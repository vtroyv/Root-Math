import { toClientPart } from '../marking/sanitize.js';

/*
What the browser may see of a lesson. Each task is sanitised exactly like a question part
(answer keys, model answers and marking data removed), and the review cards are left out:
they're served by /api/reviews/lesson/[slug] with their answers stripped.
The order-task shuffle is seeded per lesson part, so it's the same on every reload.
*/
export function toClientLesson(lesson) {
  // eslint-disable-next-line no-unused-vars
  const { review, _id, ...rest } = lesson;
  return {
    ...rest,
    _id: _id?.toString?.() ?? _id,
    reviewCount: (review ?? []).length,
    parts: (lesson.parts ?? []).map((part) => ({
      ...part,
      tasks: (part.tasks ?? []).map((task, i) => toClientPart(task, i, `${lesson.slug}|${part.id}`)),
    })),
  };
}
