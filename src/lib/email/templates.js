import { COURSES, PAPER_COURSES } from '@/lib/forms/registerInterest';
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

/* The 3 free A Level pure practice papers, sent in the register thank-you. They're linked,
   not attached: attachments from a new sending domain raise the spam score, and many school
   email systems strip them. The PDFs are in public/practice-papers and anyone with a link can
   download them, which is fine: every page carries RadixMaths and the website.
   Sources and answer checks: the "RadixMaths practice papers" folder on the T7 drive. */
const PRACTICE_PAPERS = [
  { name: 'Paper 1', level: 'Standard', file: 'radixmaths-paper-1-standard' },
  { name: 'Paper 2', level: 'Hard', file: 'radixmaths-paper-2-hard' },
  { name: 'Paper 3', level: 'Challenge', file: 'radixmaths-paper-3-challenge' },
];
const paperUrl = (file) => `${SITE_URL}/practice-papers/${file}.pdf`;

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
  const sendPapers = courses.some((course) => PAPER_COURSES.includes(course.id));

  const papersHtml = sendPapers
    ? `
      <p style="margin:0 0 8px;font-size:18px;font-weight:bold;color:#0e7c8e;">Your 3 free practice papers</p>
      <p style="margin:0 0 12px;">Three A Level pure maths papers, each 2 hours and 100 marks, written to suit every exam board. Each one has a mark scheme with full worked solutions. Try a paper under timed conditions before you look at its mark scheme.</p>
      ${PRACTICE_PAPERS.map(
        (paper) =>
          `<p style="margin:0 0 10px;"><strong>${paper.name} (${paper.level})</strong><br>${link(paperUrl(paper.file), 'Question paper')} &middot; ${link(paperUrl(`${paper.file}-mark-scheme`), 'Mark scheme')}</p>`,
      ).join('')}
      <p style="margin:16px 0 16px;">Paper 3 is a challenge paper, much harder than a real exam, so don’t worry if you don’t finish it.</p>`
    : '';
  const papersText = sendPapers
    ? `
YOUR 3 FREE PRACTICE PAPERS
Three A Level pure maths papers, each 2 hours and 100 marks, written to suit every exam board. Try a paper under timed conditions before you look at its mark scheme.

${PRACTICE_PAPERS.map(
  (paper) =>
    `${paper.name} (${paper.level})\nQuestion paper: ${paperUrl(paper.file)}\nMark scheme: ${paperUrl(`${paper.file}-mark-scheme`)}`,
).join('\n\n')}

Paper 3 is a challenge paper, much harder than a real exam, so don't worry if you don't finish it.
`
    : '';

  return {
    subject: sendPapers
      ? 'Your 3 free A Level practice papers from RadixMaths'
      : 'Thanks for registering your interest in RadixMaths',
    html: layout(`
      <p style="margin:0 0 16px;">Hi ${escapeHtml(name)},</p>
      <p style="margin:0 0 16px;">Thank you for registering your interest in RadixMaths. You’re on the list for <strong>${chosen.map(escapeHtml).join(', ')}</strong>.</p>
      ${papersHtml}
      <p style="margin:0 0 16px;">${when}</p>
      <p style="margin:0 0 20px;">In the meantime, have a read of our blog, and stay up to date by following us: ${socialLinks()}.</p>
      <p style="margin:0 0 24px;">${button(blog, 'Read our blog')}</p>
      <p style="margin:0;">Thanks,<br>The RadixMaths team</p>`),
    text: `Hi ${name},

Thank you for registering your interest in RadixMaths. You're on the list for ${chosen.join(', ')}.
${papersText}
${when}

In the meantime, check out our blog: ${blog}

Stay up to date by following us:
${socialLinksText()}

Thanks,
The RadixMaths team`,
  };
}

// Sent when a parent signs up on the parents' blog post. Can be sent to any address
// typed into that form, so like registerThankYou it repeats nothing but a plain first name.
export function parentThankYou({ firstName }) {
  const name = firstNameFor(firstName);
  const pricing = `${SITE_URL}/pricing`;

  return {
    subject: 'Thanks for signing up to RadixMaths updates',
    html: layout(`
      <p style="margin:0 0 16px;">Hi ${escapeHtml(name)},</p>
      <p style="margin:0 0 16px;">Thank you for signing up. Year 12 A Level Maths opens on 1 December, and Year 13 follows in January. We’ll email you when it’s ready, along with the early-access price and a free trial.</p>
      <p style="margin:0 0 16px;">Until then, we’ll send you a few short emails about how RadixMaths works and how it can help your child. You can unsubscribe at any time.</p>
      <p style="margin:0 0 24px;">${button(pricing, 'See pricing')}</p>
      <p style="margin:0 0 16px;">If you have any questions, just reply to this email.</p>
      <p style="margin:0;">Thanks,<br>The RadixMaths team</p>`),
    text: `Hi ${name},

Thank you for signing up. Year 12 A Level Maths opens on 1 December, and Year 13 follows in January. We'll email you when it's ready, along with the early-access price and a free trial.

Until then, we'll send you a few short emails about how RadixMaths works and how it can help your child. You can unsubscribe at any time.

See pricing: ${pricing}

If you have any questions, just reply to this email.

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

// Goes to our own inbox, in the same Enquiries folder as the contact form (same subject prefix).
export function teacherRequestNotification({ name, email, role, school, board, resource, topic, problem, wantsWorkshop, wantsClassTrial, wantsChat, wantsUpdates }) {
  const rows = [
    ['Name', name],
    ['Email', email],
    ['Role', role],
    ['School or organisation', school],
    ['Exam board', board],
    ['Resource', resource || 'None'],
    ['What it should cover', topic || 'Not given'],
    ['Interested in a student workshop', wantsWorkshop ? 'Yes' : 'No'],
    ['Interested in trying it with one class', wantsClassTrial ? 'Yes' : 'No'],
    ['Happy to have a 20-minute chat', wantsChat ? 'Yes' : 'No'],
    ['Email when the teacher version is ready', wantsUpdates ? 'Yes' : 'No'],
  ];
  const biggestProblem = problem || 'Not given';
  return {
    subject: `enquiry-contact-form: Teacher request, from ${name} at ${school}`,
    html: layout(`
      <p style="margin:0 0 16px;font-weight:bold;">New request from the teachers page</p>
      ${rows.map(([label, value]) => `<p style="margin:0 0 6px;"><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join('')}
      <p style="margin:16px 0 6px;"><strong>Biggest problem:</strong></p>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(biggestProblem)}</p>`),
    text: `New request from the teachers page

${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}

Biggest problem:
${biggestProblem}`,
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
