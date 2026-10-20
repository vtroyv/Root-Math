import { getLessonBySlug } from '@/lib/mongodb/utils';
import { isTaskLesson } from './progress';

/*
Shared lookups for the /api/lesson/[slug] routes (server only: touches MongoDB).
Each returns either what was asked for or `{ error }`, a Response to send back as-is.
*/

const json = (body, status) => Response.json(body, { status });

export async function loadTaskLesson(slug) {
  const lesson = await getLessonBySlug(slug);
  if (!lesson) return { error: json({ error: `No lesson "${slug}"` }, 404) };
  if (!isTaskLesson(lesson)) return { error: json({ error: `"${slug}" is still in the old lesson format` }, 400) };
  if (!lesson.collection) return { error: json({ error: `Lesson "${slug}" has no collection (course)` }, 500) };
  return { lesson };
}

// the lesson's part and task for the ids a request names
export function findTask(lesson, partId, taskId) {
  const part = lesson.parts.find((p) => String(p.id) === String(partId));
  const task = part?.tasks?.find((t) => t.id === taskId);
  if (!task) return { error: json({ error: `No task "${taskId}" in part ${partId} of "${lesson.slug}"` }, 404) };
  return { part, task };
}
