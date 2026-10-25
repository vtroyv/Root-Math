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
Every task in a part with what the page needs to show it. Tasks open one at a time:
the first task that isn't done is `open`, and everything after it is `locked`.
  status   'correct' | 'partial' | 'incorrect' | 'unanswered' | 'error' | 'revealed' | null (not marked)
  stale    marked, then changed since
*/
export function partTaskStates(part, tasksProgress) {
  let blocked = false;
  return (part?.tasks ?? []).map((task) => {
    const entry = tasksProgress?.[taskKey(part.id, task.id)] ?? {};
    const done = isDone(entry);
    const state = {
      task,
      entry,
      done,
      open: !done && !blocked,
      locked: !done && blocked,
      status: entry.revealed ? 'revealed' : entry.result?.status ?? null,
      stale: !entry.revealed && Boolean(entry.result) && !same(entry.response, entry.markedResponse),
    };
    if (!done) blocked = true;
    return state;
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
