import { validateRegistration, MARKETING_WORDING } from '@/lib/forms/registerInterest';
import { clientIp, underRateLimit, saveRegistration, markThankYouSent } from '@/lib/forms/server';
import { sendEmail } from '@/lib/email/send';
import { registerThankYou } from '@/lib/email/templates';

/*
POST /api/register-interest: saves a registration, then emails a thank-you.
The save comes first, so an email problem never loses anyone's details.
Full walkthrough: docs/register-interest.md.
*/

const HOUR = 60 * 60 * 1000;
// A whole class can share one school IP address, so this is generous.
const MAX_PER_IP_PER_HOUR = 30;

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: 'Invalid request.' }, { status: 400 });

  // Only bots fill the hidden `website` field. Pretend it worked, so they don't adapt.
  if (body.website) return Response.json({ ok: true });

  const { errors, data } = validateRegistration(body);
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

  try {
    if (!(await underRateLimit(`register:${clientIp(request)}`, MAX_PER_IP_PER_HOUR, HOUR))) {
      return Response.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }
    const { sendThankYou } = await saveRegistration(data, MARKETING_WORDING);

    if (sendThankYou) {
      try {
        await sendEmail({ to: data.email, ...registerThankYou(data) });
        await markThankYouSent(data.email);
      } catch (error) {
        // They're registered, so this still counts as success. thankYouSentAt stays
        // null, and they'll get the email if they register again.
        console.error('Register interest: thank-you email failed:', error);
      }
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Register interest: could not save:', error);
    return Response.json({ error: 'Could not save your details.' }, { status: 500 });
  }
}
