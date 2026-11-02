import { createHash } from 'crypto';
import getMongoClient from '@/lib/mongodb/db';

/*
Database code for the public forms (server only). Three collections in RootMath:
registrations (one per email address), enquiries (one per message) and formRateLimits
(short-lived counters that MongoDB deletes itself).
*/

const REGISTRATIONS = 'registrations';
const ENQUIRIES = 'enquiries';
const RATE_LIMITS = 'formRateLimits';

const getDb = async () => (await getMongoClient()).db('RootMath');

// Creates the indexes once per server start; a failure is forgotten so the next request retries.
let indexesReady;
function ensureIndexes(db) {
  indexesReady ??= Promise.all([
    db.collection(REGISTRATIONS).createIndex({ email: 1 }, { unique: true }),
    db.collection(RATE_LIMITS).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]).catch((error) => {
    indexesReady = undefined;
    throw error;
  });
  return indexesReady;
}

// Two first-time requests can race on an upsert; the loser gets a duplicate key error and retries as an update.
async function upsertWithRetry(run) {
  try {
    return await run();
  } catch (error) {
    if (error?.code !== 11000) throw error;
    return run();
  }
}

// First address from the proxy header. Hashed before storing, so no IP addresses are kept.
export function clientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

// Counts `key` in a fixed time window and returns false once it passes `limit`.
export async function underRateLimit(key, limit, windowMs) {
  const db = await getDb();
  await ensureIndexes(db);
  const bucket = Math.floor(Date.now() / windowMs);
  const hash = createHash('sha256').update(key).digest('hex');
  const doc = await upsertWithRetry(() =>
    db.collection(RATE_LIMITS).findOneAndUpdate(
      { _id: `${hash}:${bucket}` },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + windowMs * 2) } },
      { upsert: true, returnDocument: 'after' },
    ),
  );
  return doc.count <= limit;
}

// Creates or updates the registration for this email. `sendThankYou` is true unless
// they've already been thanked, so registering twice doesn't send a second email.
export async function saveRegistration({ marketingConsent, ...details }, marketingWording) {
  const db = await getDb();
  await ensureIndexes(db);
  const now = new Date();
  const before = await upsertWithRetry(() =>
    db.collection(REGISTRATIONS).findOneAndUpdate(
      { email: details.email },
      {
        $set: {
          ...details,
          marketingConsent: { given: marketingConsent, wording: marketingWording, answeredAt: now },
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now, thankYouSentAt: null },
      },
      { upsert: true, returnDocument: 'before' },
    ),
  );
  return { sendThankYou: !before?.thankYouSentAt };
}

export async function markThankYouSent(email) {
  const db = await getDb();
  await db.collection(REGISTRATIONS).updateOne({ email }, { $set: { thankYouSentAt: new Date() } });
}

// Returns the new enquiry's id, for recording which emails went out.
export async function saveEnquiry(enquiry) {
  const db = await getDb();
  const { insertedId } = await db.collection(ENQUIRIES).insertOne({
    ...enquiry,
    createdAt: new Date(),
    notifiedAt: null,
    autoReplySentAt: null,
  });
  return insertedId;
}

export async function markEnquiry(id, fields) {
  const db = await getDb();
  await db.collection(ENQUIRIES).updateOne({ _id: id }, { $set: fields });
}
