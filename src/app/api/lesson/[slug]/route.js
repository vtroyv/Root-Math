import { auth } from '@clerk/nextjs/server';
import { getLessonBySlug, getLessonProgressDoc, saveLessonProgressDoc, getLessonSummaries, getChapters } from '@/lib/mongodb/utils';
import { isTaskLesson, freshProgress, progressCollection, PROGRESS_VERSION } from '@/lib/lessons/progress';
import { toClientLesson } from '@/lib/lessons/sanitize';
import { findChapter, lessonHref } from '@/lib/lessons/links';
import { SPECS } from '@/lib/mastery/specs';

/*
GET /api/lesson/<slug>
The lesson page's data: { lesson (answer keys removed), progress, nextLesson }.
  - Old-format lesson documents return { legacy: true }, and the page falls back to the old lesson UI.
  - A student without progress, or with old-format progress, gets fresh progress. Old progress is
    replaced, because the tasks changed when the lessons were rewritten (decided 20 Oct 2026).
*/
export async function GET(request, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const slug = decodeURIComponent(params.slug);
    const lesson = await getLessonBySlug(slug);
    if (!lesson) return Response.json({ error: `No lesson "${slug}"` }, { status: 404 });
    if (!isTaskLesson(lesson)) return Response.json({ legacy: true });
    if (!lesson.collection) return Response.json({ error: `Lesson "${slug}" has no collection (course)` }, { status: 500 });

    const collection = progressCollection(lesson);
    let progress = await getLessonProgressDoc(collection, userId, slug);
    if (progress?.schemaVersion !== PROGRESS_VERSION) {
      progress = freshProgress(userId, slug);
      await saveLessonProgressDoc(collection, progress);
    }

    return Response.json({ lesson: toClientLesson(lesson), progress, nextLesson: await findNextLesson(lesson) });
  } catch (error) {
    console.error('Loading the lesson failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// { slug, title, href } of the lesson's `next`, if that lesson has been built
async function findNextLesson(lesson) {
  if (!lesson.next) return null;
  const [next] = await getLessonSummaries([lesson.next]);
  if (!next) return null;
  const chapterCollection = SPECS[lesson.collection]?.lessons?.chapterCollection;
  const chapters = chapterCollection ? await getChapters(chapterCollection) : [];
  return { slug: next.slug, title: next.title, href: lessonHref(lesson.collection, findChapter(chapters, next.slug), next.slug) };
}
