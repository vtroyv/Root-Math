import { lessonSlug } from '../mastery/computeMastery.js';
import { SPECS } from '../mastery/specs.js';

/*
The courses a student can take. Used by the learn landing page, the course and chapter pages, the nav bar's
COURSES menu and the breadcrumbs. `id` is the course URL (/learn/<id>) and matches the specs in specs.js.

Which courses a student sees comes from their Clerk publicMetadata.courses: an array of these ids,
e.g. ['edx-maths-1', 'edx-maths-2']. Only the server can set publicMetadata, so billing can fill it in.
Students without it (everyone, until subscriptions exist) see every course.

Add Further Maths here when it exists, e.g. qualification: 'A level Further Maths'. The landing page's
filter is built from the qualifications in the student's courses.
*/
export const COURSES = [
  { id: 'edx-maths-1', qualification: 'A level Maths', examBoard: 'Edexcel', component: 'Pure Mathematics', year: 'Year 12' },
  { id: 'edx-stats-1', qualification: 'A level Maths', examBoard: 'Edexcel', component: 'Statistics', year: 'Year 12' },
  { id: 'edx-mech-1', qualification: 'A level Maths', examBoard: 'Edexcel', component: 'Mechanics', year: 'Year 12' },
  { id: 'edx-maths-2', qualification: 'A level Maths', examBoard: 'Edexcel', component: 'Pure Mathematics', year: 'Year 13' },
  { id: 'edx-stats-2', qualification: 'A level Maths', examBoard: 'Edexcel', component: 'Statistics', year: 'Year 13' },
  { id: 'edx-mech-2', qualification: 'A level Maths', examBoard: 'Edexcel', component: 'Mechanics', year: 'Year 13' },
];

export const findCourse = (id) => COURSES.find((course) => course.id === id) ?? null;
export const courseLabel = (course) => `${course.component} · ${course.year}`;

export function coursesForUser(user) {
  const ids = user?.publicMetadata?.courses;
  if (!Array.isArray(ids)) return COURSES;
  return COURSES.filter((course) => ids.includes(course.id));
}

// 'binomial-expansion' -> 'Binomial Expansion'
export const titleFromSlug = (slug) =>
  decodeURIComponent(slug)
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

// a chapter's display name: `chapterTitles` in specs.js if it has one, otherwise from its slug
export const chapterTitle = (courseId, slug) => SPECS[courseId]?.lessons?.chapterTitles?.[slug] ?? titleFromSlug(slug);

/*
Everything the course and chapter pages show, with the student's progress:
  { course, total, completed, next, areas: [{ id, name, subtopics, total, completed,
      chapters: [{ slug, title, total, completed, next, groups: [{ heading, lessons: [{ title, slug, status, href }] }] }] }] }

  course     an entry from COURSES
  spec       SPECS[course.id]: its areas are the topic cards; spec.lessons.chaptersByArea puts chapters in them
  chapters   [{ name, subsections: { heading: [lesson title, ...] } }] from spec.lessons.chapterCollection
  built      [{ slug }] from lesson-data
  progress   [{ lessonSlug, completed }] for this student

A lesson's status is complete / in-progress / todo, or coming-soon if it isn't built yet.
total and completed only count built lessons, so a course's % is "of the lessons you can do".
next is the lesson to continue with: the first one in progress, otherwise the first not started.
*/
export function courseOutline(course, spec, chapters = [], built = [], progress = []) {
  const config = spec?.lessons;
  const chaptersByName = new Map(chapters.map((chapter) => [chapter.name, chapter]));
  const builtSlugs = new Set(built.map((lesson) => lesson.slug));
  const progressBySlug = new Map(progress.map((p) => [p.lessonSlug, p]));

  const toLesson = (chapterName) => (title) => {
    const slug = lessonSlug(title);
    const p = progressBySlug.get(slug);
    const status = !builtSlugs.has(slug) ? 'coming-soon' : p?.completed ? 'complete' : p ? 'in-progress' : 'todo';
    return { title, slug, status, href: status === 'coming-soon' ? null : `/learn/${course.id}/${chapterName}/${slug}` };
  };

  const summarise = (lessons) => ({
    total: lessons.filter((lesson) => lesson.status !== 'coming-soon').length,
    completed: lessons.filter((lesson) => lesson.status === 'complete').length,
    next: lessons.find((lesson) => lesson.status === 'in-progress') ?? lessons.find((lesson) => lesson.status === 'todo') ?? null,
  });

  const areas = (spec?.areas ?? []).map((area) => {
    const areaChapters = (config?.chaptersByArea?.[area.id] ?? []).map((name) => {
      const groups = Object.entries(chaptersByName.get(name)?.subsections ?? {}).map(([heading, titles]) => ({
        heading,
        lessons: titles.map(toLesson(name)),
      }));
      const lessons = groups.flatMap((group) => group.lessons);
      return { slug: name, title: chapterTitle(course.id, name), groups, ...summarise(lessons) };
    });
    const lessons = areaChapters.flatMap((chapter) => chapter.groups.flatMap((group) => group.lessons));
    const { total, completed } = summarise(lessons);
    return { id: area.id, name: area.name, subtopics: area.subtopics ?? [], chapters: areaChapters, total, completed };
  });

  const allLessons = areas.flatMap((area) => area.chapters.flatMap((chapter) => chapter.groups.flatMap((group) => group.lessons)));
  return { course, ...summarise(allLessons), areas };
}
