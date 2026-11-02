import { COURSES } from '@/lib/forms/registerInterest';
import { SITE_URL, SOCIALS } from '@/lib/socials';
import { HEADER_IMAGE_ID } from './headerImage';

/*
The form emails, each returning { subject, html, text }. Inline styles only, because
email apps strip stylesheets. Anything a visitor typed is escaped before it goes in html.

The two thank-yous can be sent to any address someone types into a form, so they must
not repeat free text from the form: that would let anyone use them to send their own
words to a stranger. firstNameFor() is the one exception, and only lets a plain name through.
*/

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function firstNameFor(name) {
  const first = String(name).trim().split(' ')[0];
  return /^\p{L}[\p{L}'-]{0,39}$/u.test(first) ? first : 'there';
}

const link = (href, label) =>
  `<a href="${href}" style="color:#0e7c8e;font-weight:bold;">${label}</a>`;

// Same colours, border and hard shadow as .rm-btn--primary. Apps that ignore the shadow still get a clear button.
const button = (href, label) =>
  `<a href="${href}" style="display:inline-block;padding:12px 22px;background:#17a2b8;border:2px solid #2c2c2c;border-radius:14px 5px 12px 6px/6px 12px 5px 14px;box-shadow:3px 3px 0 #2c2c2c;color:#ffffff;font-weight:bold;text-decoration:none;">${label}</a>`;

/*
The look of every email, matching the site: the squared-paper page, a paper card with
an ink border, hard shadow and hand-drawn corners. Web fonts don't load in most email
apps, so the logo and name are an image sent inside the email (see headerImage.js) and the text is Arial.
The grid and wobbly corners are extras: apps that drop them still get a clean card.
Dark mode can't be fully controlled, as some apps recolour emails whatever we ask for.
*/
const layout = (body) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <style>:root { color-scheme: light only; }</style>
</head>
<body style="margin:0;padding:0;background-color:#f2fafb;">
  <div style="padding:28px 12px;background-color:#f2fafb;background-image:linear-gradient(#c2e4ec 1px,transparent 1px),linear-gradient(90deg,#c2e4ec 1px,transparent 1px);background-size:28px 28px;">
    <div style="max-width:560px;margin:0 auto;background:#fffdf9;border:2px solid #2c2c2c;border-radius:255px 15px 225px 15px/15px 225px 15px 255px;box-shadow:4px 4px 0 #2c2c2c;overflow:hidden;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#2c2c2c;">
      <img src="cid:${HEADER_IMAGE_ID}" width="560" height="120" alt="RadixMaths" style="display:block;width:100%;height:auto;max-height:120px;border:0;border-bottom:2px solid #2c2c2c;color:#0e7c8e;font-size:24px;font-weight:bold;text-align:center;">
      <div style="padding:28px;">
        ${body}
      </div>
    </div>
  </div>
</body>
</html>`;

const socialLinks = () => SOCIALS.map((social) => link(social.href, social.label)).join(' &middot; ');
const socialLinksText = () => SOCIALS.map((social) => `${social.label}: ${social.href}`).join('\n');

export function registerThankYou({ firstName, courses }) {
  const name = firstNameFor(firstName);
  const chosen = courses.map(({ id, board }) => {
    const course = COURSES.find((item) => item.id === id);
    return board ? `${course.name} (${board})` : course.name;
  });
  // only A Level Maths has announced dates
  const when = courses.some((course) => course.id === 'a-level-maths')
    ? 'Year 12 A Level Maths opens on 1 December, and Year 13 follows in January. We’ll email you when it’s ready, along with your early-access price.'
    : 'We’ll email you the moment your course opens, along with your early-access price.';
  const blog = `${SITE_URL}/blog`;

  return {
    subject: 'Thanks for registering your interest in RadixMaths',
    html: layout(`
      <p style="margin:0 0 16px;">Hi ${escapeHtml(name)},</p>
      <p style="margin:0 0 16px;">Thank you for registering your interest in RadixMaths. You’re on the list for <strong>${chosen.map(escapeHtml).join(', ')}</strong>.</p>
      <p style="margin:0 0 16px;">${when}</p>
      <p style="margin:0 0 20px;">In the meantime, have a read of our blog, and stay up to date by following us: ${socialLinks()}.</p>
      <p style="margin:0 0 24px;">${button(blog, 'Read our blog')}</p>
      <p style="margin:0;">Thanks,<br>The RadixMaths team</p>`),
    text: `Hi ${name},

Thank you for registering your interest in RadixMaths. You're on the list for ${chosen.join(', ')}.

${when}

In the meantime, check out our blog: ${blog}

Stay up to date by following us:
${socialLinksText()}

Thanks,
The RadixMaths team`,
  };
}

export function contactThankYou({ name }) {
  const first = firstNameFor(name);
  return {
    subject: 'We’ve received your message',
    html: layout(`
      <p style="margin:0 0 16px;">Hi ${escapeHtml(first)},</p>
      <p style="margin:0 0 16px;">Thank you for getting in touch. We’ve received your message and will get back to you shortly.</p>
      <p style="margin:0;">Thanks,<br>The RadixMaths team</p>`),
    text: `Hi ${first},

Thank you for getting in touch. We've received your message and will get back to you shortly.

Thanks,
The RadixMaths team`,
  };
}

// Goes to our own inbox. The subject prefix is what the mailbox's Enquiries folder rule matches.
export function enquiryNotification({ name, email, mobile, subject, message }) {
  const rows = [
    ['Name', name],
    ['Email', email],
    ['Mobile', mobile || 'Not given'],
    ['Subject', subject],
  ];
  return {
    subject: `enquiry-contact-form: ${subject}, from ${name}`,
    html: layout(`
      <p style="margin:0 0 16px;font-weight:bold;">New enquiry from the contact form</p>
      ${rows.map(([label, value]) => `<p style="margin:0 0 6px;"><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join('')}
      <p style="margin:16px 0 6px;"><strong>Message:</strong></p>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(message)}</p>`),
    text: `New enquiry from the contact form

${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}

Message:
${message}`,
  };
}
