import { cleanLine, normaliseEmail, isValidEmail, EMAIL_ERROR } from './shared';
import { A_LEVEL_BOARDS } from './registerInterest';

/*
The teacher request form's options and rules, used by the /teachers page and by
/api/teacher-request. See docs/teachers-page.md.
*/

// Tutors and agencies cover more than one board, unlike a school department.
export const BOARDS = [...A_LEVEL_BOARDS, 'Several boards'];

export const ROLES = [
  'Head of maths',
  'Maths teacher',
  'Other school or college staff',
  'Tutor',
  'Tuition agency',
  'Something else',
];

export const RESOURCES = [
  'PowerPoint lesson',
  'Worksheet with mark scheme',
  'Common mistakes sheet',
  'Cheat sheet',
  'Practice paper',
  'Something else',
];

// Stored with each answer, as the record of exactly what the teacher agreed to.
export const UPDATES_WORDING = 'Email me when the teacher version is ready. I can unsubscribe at any time.';

const MAX_PROBLEM = 5000;

// Returns { errors, data }. `errors` is keyed by field, and is empty when `data` is safe to store.
export function validateTeacherRequest(input = {}) {
  /** @type {Record<string, string>} */
  const errors = {};

  const name = cleanLine(input.name, 120);
  if (!name) errors.name = 'Please enter your name.';

  const email = normaliseEmail(input.email);
  if (!isValidEmail(email)) errors.email = EMAIL_ERROR;

  const role = ROLES.includes(input.role) ? input.role : '';
  if (!role) errors.role = 'Choose your role.';

  const school = cleanLine(input.school, 160);
  if (!school) errors.school = 'Please enter your school, college or organisation.';

  const board = BOARDS.includes(input.board) ? input.board : '';
  if (!board) errors.board = 'Choose your exam board.';

  const resource = RESOURCES.includes(input.resource) ? input.resource : '';

  const topic = cleanLine(input.topic, 200);
  if (resource && !topic) errors.topic = 'Tell us what the resource should cover.';

  // keeps its line breaks, unlike the single-line fields
  const problem = typeof input.problem === 'string' ? input.problem.trim() : '';
  const wantsWorkshop = input.wantsWorkshop === true;
  const wantsClassTrial = input.wantsClassTrial === true;
  const wantsChat = input.wantsChat === true;
  const wantsUpdates = input.wantsUpdates === true;
  if (problem.length > MAX_PROBLEM) errors.problem = `Please keep it under ${MAX_PROBLEM} characters.`;
  else if (!resource && !problem && !wantsWorkshop && !wantsClassTrial && !wantsChat && !wantsUpdates) {
    errors.problem = 'Choose a resource, tick a box below, or tell us your biggest problem.';
  }

  return {
    errors,
    data: {
      name,
      email,
      role,
      school,
      board,
      resource: resource || null,
      topic: topic || null,
      problem: problem || null,
      wantsWorkshop,
      wantsClassTrial,
      wantsChat,
      wantsUpdates,
    },
  };
}
