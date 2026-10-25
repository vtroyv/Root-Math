import { getChapters, getBuiltLessons, getUserLessonProgressList } from '@/lib/mongodb/utils';
import { SPECS } from '@/lib/mastery/specs';
import { courseOutline } from './courses';

/*
One course's outline for one student (courseOutline in courses.js), read from MongoDB.
Server only. Pass `built` (the lesson-data slugs) to share one read across several courses.
Courses without a `lessons` config in specs.js have no chapters yet, so nothing is read for them.
*/
export async function loadCourseOutline(course, userId, built) {
  const spec = SPECS[course.id];
  const config = spec?.lessons;
  if (!config) return courseOutline(course, spec);

  const [chapters, builtLessons, progress] = await Promise.all([
    getChapters(config.chapterCollection),
    built ?? getBuiltLessons(),
    getUserLessonProgressList(config.progressCollection, userId),
  ]);
  return courseOutline(course, spec, chapters, builtLessons, progress);
}
