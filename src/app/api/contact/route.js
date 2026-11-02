import { validateEnquiry } from '@/lib/forms/contact';
import { clientIp, underRateLimit, saveEnquiry, markEnquiry } from '@/lib/forms/server';
import { sendEmail } from '@/lib/email/send';
import { contactThankYou, enquiryNotification } from '@/lib/email/templates';

/*
POST /api/contact: saves an enquiry, emails it to our inbox, and sends the visitor an
automatic reply. The save comes first, so an email problem never loses a message.
Full walkthrough: docs/contact-form.md.
*/

const HOUR = 60 * 60 * 1000;
const MAX_PER_IP_PER_HOUR = 10;
// Stops someone using the form to flood another person's inbox with automatic replies.
const MAX_AUTO_REPLIES_PER_ADDRESS_PER_DAY = 3;

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: 'Invalid request.' }, { status: 400 });

  // Only bots fill the hidden `website` field. Pretend it worked, so they don't adapt.
  if (body.website) return Response.json({ ok: true });

  const { errors, data } = validateEnquiry(body);
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

  try {
    if (!(await underRateLimit(`contact:${clientIp(request)}`, MAX_PER_IP_PER_HOUR, HOUR))) {
      return Response.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
    }
    const id = await saveEnquiry(data);

    const notify = async () => {
      await sendEmail({
        to: process.env.CONTACT_INBOX || 'hello@radixmaths.co.uk',
        replyTo: data.email,
        ...enquiryNotification(data),
      });
      await markEnquiry(id, { notifiedAt: new Date() });
    };
    const autoReply = async () => {
      if (!(await underRateLimit(`contact-reply:${data.email}`, MAX_AUTO_REPLIES_PER_ADDRESS_PER_DAY, 24 * HOUR))) return;
      await sendEmail({ to: data.email, ...contactThankYou(data) });
      await markEnquiry(id, { autoReplySentAt: new Date() });
    };

    // Separate failures: the visitor's reply shouldn't depend on our notification, or
    // the other way round. The message is saved either way, so this still counts as success.
    const results = await Promise.allSettled([notify(), autoReply()]);
    results
      .filter((result) => result.status === 'rejected')
      .forEach((result) => console.error('Contact form: email failed:', result.reason));

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Contact form: could not save:', error);
    return Response.json({ error: 'Could not send your message.' }, { status: 500 });
  }
}
