import { cleanLine, normaliseEmail, isValidEmail, EMAIL_ERROR } from './shared';

/*
The parents' sign-up on the blog post /blog/radixmaths-for-parents, used by the form and
by /api/parent-signup. See docs/parent-signup.md.

Parents sign up themselves. Students never type in a parent's address: under PECR the
parent has to agree to marketing emails, and a child can't agree on their behalf.
*/

// Stored with each sign-up, as the record of exactly what the parent agreed to.
export const PARENT_WORDING =
  'Email me when RadixMaths launches, plus a few short emails about how it helps students. I can unsubscribe at any time.';

// Returns { errors, data }. `errors` is keyed by field, and is empty when `data` is safe to store.
export function validateParentSignup(input = {}) {
  /** @type {Record<string, string>} */
  const errors = {};

  const firstName = cleanLine(input.firstName, 80);
  if (!firstName) errors.firstName = 'Please enter your first name.';

  const email = normaliseEmail(input.email);
  if (!isValidEmail(email)) errors.email = EMAIL_ERROR;

  // The whole form is a request for these emails, so the box has to be ticked.
  const consent = input.consent === true;
  if (!consent) errors.consent = 'Tick the box so we know you’re happy for us to email you.';

  return { errors, data: { firstName, email, consent } };
}
