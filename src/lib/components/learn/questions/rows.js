import { findCourse, courseLabel } from '@/lib/courses/courses';
import { formatTitle } from '@/lib/mastery/computeMastery';

/*
The Questions page's table rows and filters, kept pure so they can be tested on their own.

A row, from a GET /api/questions question:
  { title, label, href, status, topic, difficulty, courseId, course, locked, search }
    status    complete | in-progress | todo, the same words as the course and Progress pages
    courseId  the course's id, or NO_COURSE for questions that aren't in one
    locked    in a course that isn't on the student's account (Clerk publicMetadata.courses);
              questions outside every course are never locked
    search    what the search box matches: name, topic, difficulty and course (not locked/unlocked)
*/

export const NO_COURSE = 'none';
export const PAGE_SIZE = 20;
export const DIFFICULTIES = ['Easy', 'Medium', 'Exam', 'Challenge'];
export const STATUSES = [
  { id: 'complete', label: 'Complete' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'todo', label: 'Not started' },
];

// question progress statuses -> row statuses ('incomplete' = submitted but not full marks)
const STATUS_OF = { complete: 'complete', incomplete: 'in-progress' };

// allowed: a Set of the student's course ids. Unlocked rows come first, otherwise the API's order is kept.
export function toRows(questions, allowed) {
  const rows = questions.map((q) => {
    const course = findCourse(q.courseId);
    const difficulty = DIFFICULTIES.find((d) => d.toLowerCase() === String(q.difficulty ?? '').toLowerCase()) ?? q.difficulty ?? '';
    const label = formatTitle(q.title);
    const topic = q.topic ?? '';
    return {
      title: q.title,
      label,
      href: `/learn/questions/${q.title}`,
      status: STATUS_OF[q.status] ?? 'todo',
      topic,
      difficulty,
      courseId: course?.id ?? NO_COURSE,
      course,
      locked: Boolean(course) && !allowed.has(course.id),
      search: [label, topic, difficulty, course && `${course.examBoard} ${course.qualification} ${courseLabel(course)}`]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    };
  });
  return rows.sort((a, b) => a.locked - b.locked);
}

/*
filters: { status, access, topics, difficulty, courseIds, search }
  status      '' (any) or a STATUSES id
  access      'unlocked' (the default) | 'locked' | 'all'
  topics      [] (any) or topic names
  difficulty  '' (any) or one of DIFFICULTIES
  courseIds   [] (any) or course ids (NO_COURSE included)
*/
export function filterRows(rows, { status, access, topics, difficulty, courseIds, search }) {
  const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return rows.filter(
    (r) =>
      (!status || r.status === status) &&
      (access === 'all' || (access === 'locked') === r.locked) &&
      (!topics.length || topics.includes(r.topic)) &&
      (!difficulty || r.difficulty === difficulty) &&
      (!courseIds.length || courseIds.includes(r.courseId)) &&
      words.every((w) => r.search.includes(w)),
  );
}

// up to `size` page numbers around the current page, e.g. (7, 12) -> [5, 6, 7, 8, 9]
export function pageWindow(current, pages, size = 5) {
  const start = Math.max(1, Math.min(current - Math.floor(size / 2), pages - size + 1));
  return Array.from({ length: Math.min(size, pages) }, (_, i) => start + i);
}

// completed / total, overall and per difficulty or topic, for the Progress card
export function tally(rows, keyOf) {
  const groups = new Map();
  for (const r of rows) {
    const key = keyOf(r);
    const g = groups.get(key) ?? { key, total: 0, completed: 0 };
    g.total += 1;
    if (r.status === 'complete') g.completed += 1;
    groups.set(key, g);
  }
  return groups;
}
