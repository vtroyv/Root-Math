/*
Checks used by both public forms. Pure functions with no database or React, so the
browser and the API routes run exactly the same rules. See docs/register-interest.md.
*/

// Trims, collapses runs of whitespace (including newlines) and caps the length.
export const cleanLine = (value, max = 120) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';

export const normaliseEmail = (value) => cleanLine(value, 254).toLowerCase();

// Deliberately loose: one @, no spaces, a dot in the domain. Only sending can prove it's real.
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(email);

const DOMAIN_TYPOS = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.co.uk': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmial.co.uk': 'hotmail.co.uk',
  'hotmail.co': 'hotmail.co.uk',
  'outlok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yahoo.co': 'yahoo.co.uk',
  'icloud.co': 'icloud.com',
  'icloud.con': 'icloud.com',
};

// "ada@gmial.com" gives "ada@gmail.com". A prompt only, it never blocks the form.
export function suggestEmail(value) {
  const email = normaliseEmail(value);
  const at = email.lastIndexOf('@');
  if (at < 1) return null;
  const fixed = DOMAIN_TYPOS[email.slice(at + 1)];
  return fixed ? `${email.slice(0, at)}@${fixed}` : null;
}

// Returns the number in +447123456789 form, or null if it can't be a mobile.
// UK mobiles (07...) or any number with a country code (+33..., 0033...).
export function normaliseMobile(value) {
  if (typeof value !== 'string') return null;
  let number = value.replace(/[\s\-().]/g, '');
  if (number.startsWith('00')) number = `+${number.slice(2)}`;
  if (/^07\d{9}$/.test(number)) return `+44${number.slice(1)}`;
  if (number.startsWith('+44')) return /^\+447\d{9}$/.test(number) ? number : null;
  return /^\+[1-9]\d{7,14}$/.test(number) ? number : null;
}

export const MOBILE_ERROR = 'That doesn’t look like a mobile number. Try 07123 456789, or include your country code.';
export const EMAIL_ERROR = 'That doesn’t look like an email address. Check it and try again.';
