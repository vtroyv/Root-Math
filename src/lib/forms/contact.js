import { cleanLine, normaliseEmail, isValidEmail, normaliseMobile, MOBILE_ERROR, EMAIL_ERROR } from './shared';

/*
The Contact form's options and rules, used by the page and by /api/contact.
See docs/contact-form.md.
*/

export const SUBJECTS = [
  'A course or specification question',
  'Schools and departments',
  'Something is not working',
  'Feedback or a feature request',
  'Press or partnerships',
  'Something else',
];

const MIN_MESSAGE = 10;
const MAX_MESSAGE = 5000;

// Returns { errors, data }. `errors` is keyed by field, and is empty when `data` is safe to store.
export function validateEnquiry(input = {}) {
  /** @type {Record<string, string>} */
  const errors = {};

  const name = cleanLine(input.name, 120);
  if (!name) errors.name = 'Please enter your name.';

  const email = normaliseEmail(input.email);
  if (!isValidEmail(email)) errors.email = EMAIL_ERROR;

  // optional, but if they typed something it has to be usable
  const typedMobile = cleanLine(input.mobile, 40);
  const mobile = typedMobile ? normaliseMobile(typedMobile) : null;
  if (typedMobile && !mobile) errors.mobile = MOBILE_ERROR;

  const subject = SUBJECTS.includes(input.subject) ? input.subject : '';
  if (!subject) errors.subject = 'Choose the closest subject.';

  // keeps its line breaks, unlike the single-line fields
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (message.length < MIN_MESSAGE) errors.message = 'Please tell us a little more, so we can help.';
  else if (message.length > MAX_MESSAGE) errors.message = `Please keep it under ${MAX_MESSAGE} characters.`;

  return { errors, data: { name, email, mobile, subject, message } };
}
