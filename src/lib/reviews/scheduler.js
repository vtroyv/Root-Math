/*
Review scheduling: a simplified SM-2 (the algorithm Anki used for years).
Pure functions, no database, so they can be unit-tested on their own.
See src/lib/docs/question-reviews.md section 6 for the rules in plain English.

Dates are the student's LOCAL calendar day as 'YYYY-MM-DD' (sent by the browser), so a
card becomes due at the student's midnight rather than the server's. Because the format
sorts correctly as text, "is it due?" is simply `state.due <= today`.
*/

export const RATINGS = ['again', 'hard', 'good', 'easy'];

const START_EASE = 2.5;
const MIN_EASE = 1.3;
const round2 = (n) => Math.round(n * 100) / 100; //enables rounding to 2 decimal places

export function isDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// '2026-10-14' + 3 -> '2026-10-17' (works across month and year ends)
export function addDays(day, days) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const isDue = (state, today) => state.due <= today;

// the schedule for a card that has just unlocked: due today
// source = where the card lives: { kind: 'question', title } (the default) or { kind: 'lesson', slug }
export function newState({ userId, cardKey, title, source = { kind: 'question', title }, today, now = new Date().toISOString() }) {
  return {
    userId,
    cardKey,
    source,
    ease: START_EASE,
    intervalDays: 0,
    reps: 0,
    lapses: 0,
    due: today,
    lastRating: null,
    lastReviewedAt: null,
    createdAt: now,
  };
}

/*
A real (due) review: work out the next gap from the rating.
  again  back tomorrow; counts as a lapse; ease -0.2
  hard   gap x1.2 (at least 1 day); ease -0.15
  good   1 day, then 3 days, then gap x ease
  easy   4 days, then gap x ease x1.3; ease +0.15
Ease never drops below 1.3, so a card you keep knowing goes roughly 1 -> 3 -> 8 -> 20 days.
*/
export function schedule(state, rating, today, now = new Date().toISOString()) {
  if (!RATINGS.includes(rating)) throw new Error(`Unknown rating "${rating}"`);
  let { ease, intervalDays, reps, lapses } = state;
  let interval;

  if (rating === 'again') {
    lapses += 1;
    reps = 0;
    ease = Math.max(MIN_EASE, ease - 0.2);
    interval = 1;
  } else if (rating === 'hard') {
    reps += 1;
    ease = Math.max(MIN_EASE, ease - 0.15);
    interval = Math.max(1, Math.round(intervalDays * 1.2));
  } else if (rating === 'good') {
    reps += 1;
    interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(intervalDays * ease);
  } else {
    reps += 1;
    interval = reps === 1 ? 4 : Math.round(Math.max(intervalDays, 1) * ease * 1.3);
    ease += 0.15;
  }

  return {
    ...state,
    ease: round2(ease),
    intervalDays: interval,
    reps,
    lapses,
    due: addDays(today, interval),
    lastRating: rating,
    lastReviewedAt: now,
  };
}

/*
Practice ("Practise anyway"): reviewing early must not push a card further away, so only
a wrong answer counts. Again brings the card back tomorrow (if it was due later than that);
every other rating leaves the schedule exactly as it was.
Returns { state, changed }.
*/
export function practise(state, rating, today, now = new Date().toISOString()) {
  if (!RATINGS.includes(rating)) throw new Error(`Unknown rating "${rating}"`);
  const tomorrow = addDays(today, 1);
  if (rating !== 'again' || state.due <= tomorrow) return { state, changed: false };
  return {
    state: { ...state, due: tomorrow, lapses: state.lapses + 1, lastRating: 'again', lastReviewedAt: now },
    changed: true,
  };
}
