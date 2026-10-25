import { SPECS } from '../mastery/specs.js';
import { normalise, formatTitle } from '../mastery/computeMastery.js';
import { findChapter, lessonHref, skillForChapter } from '../lessons/links.js';

/*
What the reviews page (/learn/reviews) lists: one student's review schedules grouped by
question, each tagged with the course and skill it counts towards on the Progress page.
Pure (no database), so it can be tested on its own. See src/lib/docs/reviews-page.md.

  states     [{ cardKey, source: { kind, title }, due }]   from reviewStates
  questions  [{ title, branch, year, topic }]               the questions those cards belong to
  today      the student's local date, 'YYYY-MM-DD'

Returns one entry per question with unlocked cards, most overdue first:
  { title, label, href, courseId, skillId, skillName, cardsDue, dueSince, nextDue }
    cardsDue   cards due today or earlier
    dueSince   the oldest due date among those (null when none are due), for "3 days overdue"
    nextDue    the earliest date among the cards that aren't due yet (null if none)
Cards whose question no longer exists are left out: there'd be nothing to review them on.
*/
export function summariseQuestionReviews(states, questions, today) {
  const byTitle = new Map(questions.map((q) => [q.title, q]));
  const duesByTitle = groupDues(states, 'question', (source) => source.title, byTitle);

  const entries = [...duesByTitle].map(([title, dues]) => {
    const { course, skill } = locateQuestion(byTitle.get(title));
    return {
      title,
      label: formatTitle(title),
      href: `/learn/questions/${title}`,
      courseId: course?.id ?? null,
      skillId: skill?.id ?? null,
      skillName: skill?.name ?? null,
      ...dueInfo(dues, today),
    };
  });
  return entries.sort(byMostOverdue);
}

/*
The same for lesson review cards (source { kind: 'lesson', slug }), one entry per lesson:
  { slug, label, href, courseId, skillId, skillName, cardsDue, dueSince, nextDue }
  lessons           [{ slug, title, collection }]   collection = the course id, e.g. 'edx-maths-1'
  chaptersByCourse  { [courseId]: [{ name, subsections }] }, to find the lesson's chapter,
                    which gives its URL and its Progress page skill
*/
export function summariseLessonReviews(states, lessons, chaptersByCourse, today) {
  const bySlug = new Map(lessons.map((l) => [l.slug, l]));
  const duesBySlug = groupDues(states, 'lesson', (source) => source.slug, bySlug);

  const entries = [...duesBySlug].map(([slug, dues]) => {
    const lesson = bySlug.get(slug);
    const courseId = SPECS[lesson.collection] ? lesson.collection : null;
    const chapter = findChapter(chaptersByCourse?.[courseId], slug);
    const skill = skillForChapter(courseId, chapter);
    return {
      slug,
      label: lesson.title ?? formatTitle(slug),
      href: lessonHref(courseId, chapter, slug),
      courseId,
      skillId: skill?.id ?? null,
      skillName: skill?.name ?? null,
      ...dueInfo(dues, today),
    };
  });
  return entries.sort(byMostOverdue);
}

// due dates grouped by question title / lesson slug, skipping cards whose question or lesson is gone
function groupDues(states, kind, idOf, known) {
  const groups = new Map();
  for (const s of states) {
    if (s.source?.kind !== kind) continue;
    const id = idOf(s.source);
    if (!known.has(id)) continue;
    groups.set(id, [...(groups.get(id) ?? []), s.due]);
  }
  return groups;
}

function dueInfo(dues, today) {
  const due = dues.filter((d) => d <= today).sort();
  const later = dues.filter((d) => d > today).sort();
  return { cardsDue: due.length, dueSince: due[0] ?? null, nextDue: later[0] ?? null };
}

// due first, oldest due date first; then the rest by name
const byMostOverdue = (a, b) => (a.dueSince ?? '9999').localeCompare(b.dueSince ?? '9999') || a.label.localeCompare(b.label);

// The course (a SPECS entry) and skill (one of its areas) a question counts towards,
// using the same branch / year / topic matching as computeMastery. Nulls if none match.
export function locateQuestion(question) {
  const topic = normalise(question?.topic);
  const course = Object.values(SPECS).find(
    (spec) => spec.branch === question?.branch && String(spec.year) === String(question?.year),
  );
  const skill = course?.areas.find((area) => area.matches.some((m) => normalise(m) === topic));
  return { course: course ?? null, skill: skill ?? null };
}
