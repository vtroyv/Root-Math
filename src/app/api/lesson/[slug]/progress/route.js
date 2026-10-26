import { auth } from '@clerk/nextjs/server';
import { getLessonProgressDoc, saveLessonProgressDoc } from '@/lib/mongodb/utils';
import { loadTaskLesson } from '@/lib/lessons/server';
import { isLessonComplete, progressCollection, PROGRESS_VERSION } from '@/lib/lessons/progress';
import { logActivity } from '@/lib/activity/log';

/*
POST /api/lesson/<slug>/progress  { progress: { currentPart, tasks }, today }  ->  { completed, newlyCompleted }
(today = the student's local date; a lesson's first completion is logged on that day's activity map)
Saves one student's progress on one lesson (autosave, Save, Reset, after marking or revealing).
The student comes from the Clerk session, never the body. `completed` is worked out here from
the lesson's tasks, and `completedAt` is kept from the first time the lesson was completed.
*/
export async function POST(request, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const { progress, today } = await request.json();
    const loaded = await loadTaskLesson(decodeURIComponent(params.slug));
    if (loaded.error) return loaded.error;
    const { lesson } = loaded;

    const collection = progressCollection(lesson);
    const existing = await getLessonProgressDoc(collection, userId, lesson.slug);
    const tasks = progress?.tasks && typeof progress.tasks === 'object' ? progress.tasks : {};
    const completed = isLessonComplete(lesson, tasks);
    const now = new Date().toISOString();

    await saveLessonProgressDoc(collection, {
      userId,
      lessonSlug: lesson.slug,
      schemaVersion: PROGRESS_VERSION,
      currentPart: Number.isInteger(progress?.currentPart) ? progress.currentPart : 0,
      tasks,
      completed,
      completedAt: existing?.completedAt ?? (completed ? now : null),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });

    const newlyCompleted = completed && !existing?.completed;
    if (newlyCompleted) await logActivity(userId, today, { lesson: lesson.slug });
    return Response.json({ completed, newlyCompleted });
  } catch (error) {
    console.error('Saving lesson progress failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
