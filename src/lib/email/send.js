import { HEADER_IMAGE_BASE64, HEADER_IMAGE_ID } from './headerImage';

/*
Sends one email through Resend's API (https://resend.com/docs/api-reference/emails/send-email).
Called directly with fetch rather than through Resend's npm package, so this file is
the only place to change if the provider ever does. Throws if the email isn't accepted;
callers decide what that means. Settings are in docs/register-interest.md.
*/
export async function sendEmail({ to, subject, html, text, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'RadixMaths <hello@mail.radixmaths.co.uk>',
      to: [to],
      subject,
      html,
      text,
      reply_to: replyTo || process.env.EMAIL_REPLY_TO || 'hello@radixmaths.co.uk',
      // the logo every template shows through <img src="cid:...">
      attachments: [{ filename: 'radixmaths.png', content: HEADER_IMAGE_BASE64, content_id: HEADER_IMAGE_ID }],
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Resend answered ${response.status}: ${await response.text()}`);
  }
}
