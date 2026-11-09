import { validateParentSignup, PARENT_WORDING } from '@/lib/forms/parents';
import { clientIp, underRateLimit, saveParentSignup, markParentThankYouSent } from '@/lib/forms/server';
import { sendEmail } from '@/lib/email/send';
import { parentThankYou } from '@/lib/email/templates';

/*
POST /api/parent-signup: saves a parent to the parentSignups list, then emails a thank-you.
Same steps as /api/register-interest, and the save comes first for the same reason.
Full walkthrough: docs/parent-signup.md.
*/

const HOUR = 60 * 60 * 1000;
const MAX_PER_IP_PER_HOUR = 20;

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: 'Invalid request.' }, { status: 400 });

  // Only bots fill the hidden `website` field. Pretend it worked, so they don't adapt.
  if (body.website) return Response.json({ ok: true });

  const { errors, data } = validateParentSignup(body);
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

  try {
    if (!(await underRateLimit(`parent:${clientIp(request)}`, MAX_PER_IP_PER_HOUR, HOUR))) {
      return Response.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }
    const { sendThankYou } = await saveParentSignup(data, PARENT_WORDING);

    if (sendThankYou) {
      try {
        await sendEmail({ to: data.email, ...parentThankYou(data) });
        await markParentThankYouSent(data.email);
      } catch (error) {
        // Saved, so still a success. thankYouSentAt stays null until a later attempt works.
        console.error('Parent sign-up: thank-you email failed:', error);
      }
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Parent sign-up: could not save:', error);
    return Response.json({ error: 'Could not save your details.' }, { status: 500 });
  }
}
