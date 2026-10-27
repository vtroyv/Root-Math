/*
Lesson progress rules, shared by the lesson page and the server (pure, no database or React).
See src/lib/docs/lessons.md.

A student's progress document (`<course>-lesson-progress`, one per student per lesson):
  { userId, lessonSlug, schemaVersion: 2,
    currentPart,                          // index of the part they were last on
    tasks: { '<partId>:<taskId>': {
      response,                           // what they've entered (same shape as question parts)
      result,                             // the latest marking of that response
      markedResponse,                     // the response `result` was for (to spot edits since)
      revealed, solution } },             // set by the Solution button
    completed, completedAt, createdAt, updatedAt }

Tasks are keyed by id, not position, so reordering or adding tasks in a lesson can't attach
a student's answer to the wrong task.
*/

export const PROGRESS_VERSION = 2;

// e.g. 'edx-maths-1' -> 'edx-maths-1-lesson-progress' (the collection the Progress page reads too)
export const progressCollection = (lesson) => `${lesson.collection}-lesson-progress`;

export const taskKey = (partId, taskId) => `${partId}:${taskId}`;

const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

// a lesson document in the parts/tasks format (anything else is rendered by the old lesson page)
export const isTaskLesson = (lesson) => lesson?.schemaVersion === 2 && Array.isArray(lesson.parts);

// correct (and not edited since) or revealed: either way it counts as done
export const isDone = (entry) =>
  entry?.revealed === true || (entry?.result?.status === 'correct' && same(entry.response, entry.markedResponse));

/*
Every task in a part with what the page needs to show it. All of a part's tasks are open at
once and can be done in any order; the next part waits until every one of them is done.
  status   'correct' | 'partial' | 'incorrect' | 'unanswered' | 'error' | 'revealed' | null (not marked)
  stale    marked, then changed since
  pending  answered and not marked yet (or changed since): what Submit marks
*/
export function partTaskStates(part, tasksProgress) {
  return (part?.tasks ?? []).map((task) => {
    const entry = tasksProgress?.[taskKey(part.id, task.id)] ?? {};
    const done = isDone(entry);
    const stale = !entry.revealed && Boolean(entry.result) && !same(entry.response, entry.markedResponse);
    return {
      task,
      entry,
      done,
      status: entry.revealed ? 'revealed' : entry.result?.status ?? null,
      stale,
      pending: !done && entry.response != null && (!entry.result || stale),
    };
  });
}

export const isPartDone = (part, tasksProgress) => partTaskStates(part, tasksProgress).every((s) => s.done);

// every task in every part done (parts without tasks count as done)
export const isLessonComplete = (lesson, tasksProgress) => (lesson?.parts ?? []).every((part) => isPartDone(part, tasksProgress));

export function freshProgress(userId, lessonSlug, now = new Date().toISOString()) {
  return {
    userId,
    lessonSlug,
    schemaVersion: PROGRESS_VERSION,
    currentPart: 0,
    tasks: {},
    completed: false,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}
