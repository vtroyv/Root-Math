/*
Daily goals and the activity map on the Questions page (src/lib/components/learn/questions/ActivityMap.js).
Pure (no database or browser APIs), so the API routes and the page can both use it.

A day's activity, from GET /api/activity:  { day: 'YYYY-MM-DD', questions, reviews, lessons, minutes }
  questions  different questions submitted for marking that day
  reviews    review cards rated (reviews and practice)
  lessons    lessons finished
  minutes    active minutes on the learn pages (src/lib/components/learn/StudyTimer.js)
Days are the student's LOCAL date, the same as review schedules (src/lib/reviews/localDay.js).

Goals live in Clerk unsafeMetadata.dailyGoals, e.g. { questions: 3, reviews: 10, minutes: 20 }.
A goal of 0 is switched off. A day is shaded by how much of its goals it met, on average.
*/

export const GOALS = [
  { id: 'questions', label: 'Questions', unit: 'questions', max: 50 },
  { id: 'reviews', label: 'Review cards', unit: 'cards', max: 200 },
  { id: 'minutes', label: 'Study time', unit: 'min', max: 240 },
];

export const DEFAULT_GOALS = { questions: 3, reviews: 10, minutes: 20 };

export function goalsFor(user) {
  const saved = user?.unsafeMetadata?.dailyGoals ?? {};
  return Object.fromEntries(GOALS.map((g) => [g.id, cleanGoal(saved[g.id], g)]));
}

// a whole number from 0 to the goal's max, or the default if it isn't a number
export function cleanGoal(value, goal) {
  const n = Number(value);
  if (value === '' || value == null || !Number.isFinite(n)) return DEFAULT_GOALS[goal.id];
  return Math.min(goal.max, Math.max(0, Math.round(n)));
}

// 0 to 1: the average share of each switched-on goal met (each capped at 1); 0 if every goal is off
export function goalScore(day, goals) {
  const on = GOALS.filter((g) => goals[g.id] > 0);
  if (!on.length) return 0;
  return on.reduce((sum, g) => sum + Math.min(1, (day?.[g.id] ?? 0) / goals[g.id]), 0) / on.length;
}

// the map's shade: 0 nothing, 1-3 part of the goals, 4 every goal met
export function shade(score) {
  if (score <= 0) return 0;
  if (score >= 1) return 4;
  return Math.min(3, 1 + Math.floor(score * 3));
}

export const isDay = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);

// the day to log activity under: the student's local date if the browser sent one, else today in UTC
export const activityDay = (today) => (isDay(today) ? today : new Date().toISOString().slice(0, 10));

// ─── month grid ('YYYY-MM') ─────────────────────────────────────────────

// { from, to, cells }: cells are 'YYYY-MM-DD', with nulls before the 1st so weeks start on Monday
export function monthGrid(month) {
  const [y, m] = month.split('-').map(Number);
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const blanks = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const day = (d) => `${month}-${String(d).padStart(2, '0')}`;
  return {
    from: day(1),
    to: day(days),
    cells: [...Array(blanks).fill(null), ...Array.from({ length: days }, (_, i) => day(i + 1))],
  };
}

export function shiftMonth(month, by) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + by, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}
