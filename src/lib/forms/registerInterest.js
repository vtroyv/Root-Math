import { cleanLine, normaliseEmail, isValidEmail, normaliseMobile, MOBILE_ERROR, EMAIL_ERROR } from './shared';

/*
The Register Interest form's options and rules, used by the page and by
/api/register-interest. See docs/register-interest.md.
*/

export const A_LEVEL_BOARDS = ['Edexcel', 'AQA', 'OCR', 'OCR (MEI)', 'CIE', 'Other / not sure yet'];
const GCSE_BOARDS = ['Edexcel', 'AQA', 'OCR', 'WJEC / Eduqas', 'CIE (IGCSE)', 'Other / not sure yet'];

/* A course carries its own board list, so the exam-board questions are per course: a
   student doing Edexcel A Level and AQA GCSE can say so. STEP and TMUA are each set by
   a single body, so they have no `boards` and there is nothing to ask. */
export const COURSES = [
  { id: 'a-level-maths', name: 'A Level Maths', boards: A_LEVEL_BOARDS },
  { id: 'a-level-further-maths', name: 'A Level Further Maths', boards: A_LEVEL_BOARDS },
  { id: 'gcse-maths', name: 'GCSE Maths', boards: GCSE_BOARDS },
  { id: 'step', name: 'STEP', boards: null },
  { id: 'tmua', name: 'TMUA', boards: null },
];

// Stored with each answer, as the record of exactly what the student agreed to.
export const MARKETING_WORDING = 'Send me revision tips and offers too. I can unsubscribe at any time.';

// Returns { errors, data }. `errors` is keyed by field, and is empty when `data` is safe to store.
export function validateRegistration(input = {}) {
  /** @type {Record<string, string>} */
  const errors = {};

  const firstName = cleanLine(input.firstName, 80);
  if (!firstName) errors.firstName = 'Please enter your first name.';

  const lastName = cleanLine(input.lastName, 80);
  if (!lastName) errors.lastName = 'Please enter your last name.';

  const email = normaliseEmail(input.email);
  if (!isValidEmail(email)) errors.email = EMAIL_ERROR;

  // optional, but if they typed something it has to be usable
  const typedMobile = cleanLine(input.mobile, 40);
  const mobile = typedMobile ? normaliseMobile(typedMobile) : null;
  if (typedMobile && !mobile) errors.mobile = MOBILE_ERROR;

  const chosen = Array.isArray(input.courses) ? input.courses : [];
  const courses = [];
  COURSES.forEach((course) => {
    const answer = chosen.find((item) => item?.id === course.id);
    if (!answer) return;
    if (course.boards && !course.boards.includes(answer.board)) {
      errors[`board.${course.id}`] = `Choose the exam board for ${course.name}.`;
    }
    courses.push({ id: course.id, board: course.boards ? answer.board ?? null : null });
  });
  if (!courses.length) errors.courses = 'Pick at least one course.';

  // optional, so a blank school is stored as null
  const schoolName = cleanLine(input.school?.name, 160);

  return {
    errors,
    data: {
      firstName,
      lastName,
      email,
      mobile,
      courses,
      school: schoolName
        ? {
            name: schoolName,
            town: input.school.custom ? null : cleanLine(input.school.town, 80) || null,
            custom: Boolean(input.school.custom),
          }
        : null,
      marketingConsent: input.marketingConsent === true,
    },
  };
}
