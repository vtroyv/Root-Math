import { SPECS } from '../mastery/specs.js';
import { lessonSlug } from '../mastery/computeMastery.js';

/*
Where a lesson lives. Lesson URLs are /learn/<course>/<chapter>/<lesson slug>, and the chapter
isn't stored on the lesson document: it comes from the course's chapter collection
(e.g. edx-pure-y1-subsections), whose subsections list lesson titles.
*/

// chapters: [{ name, subsections: { heading: [lesson title, ...] } }]
export function findChapter(chapters, slug) {
  const chapter = (chapters ?? []).find((c) =>
    Object.values(c.subsections ?? {})
      .flat()
      .some((title) => lessonSlug(title) === slug),
  );
  return chapter?.name ?? null;
}

export const lessonHref = (courseId, chapter, slug) => (courseId && chapter ? `/learn/${courseId}/${chapter}/${slug}` : null);

// the Progress page skill (area) a chapter belongs to, from the course's `lessons.chaptersByArea`
export function skillForChapter(courseId, chapter) {
  const spec = SPECS[courseId];
  const areaId = Object.entries(spec?.lessons?.chaptersByArea ?? {}).find(([, chapters]) => chapters.includes(chapter))?.[0];
  return spec?.areas.find((a) => a.id === areaId) ?? null;
}
