import { auth, currentUser } from '@clerk/nextjs/server';
import {
  getQuestions,
  getUserProgressForCollection,
  getChapters,
  getBuiltLessons,
  getUserLessonProgressList,
} from '@/lib/mongodb/utils';
import { SPECS, DEFAULT_SPEC_ID } from '@/lib/mastery/specs';
import { computeMastery } from '@/lib/mastery/computeMastery';

// GET /api/mastery?spec=a-level-maths-y12-pure  ->  Progress page data for the signed-in student.
// The user comes from Clerk's session (auth/currentUser), never from the query string.
export async function GET(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  const specId = new URL(request.url).searchParams.get('spec') ?? DEFAULT_SPEC_ID;
  const spec = SPECS[specId];
  if (!spec) return Response.json({ error: `Unknown spec "${specId}"` }, { status: 404 });

  try {
    const user = await currentUser();
    const examBoard = user?.unsafeMetadata?.examBoard;

    const { questions, error } = await getQuestions();
    if (error) throw new Error(error);

    // students without an exam board yet simply have no progress collection to read
    const progress = examBoard
      ? await getUserProgressForCollection({ userId, examBoard, branch: spec.branch, year: spec.year })
      : [];

    // lessons only exist for courses with a `lessons` config (currently Year 12 Pure)
    const lessonData = spec.lessons
      ? {
          chapters: await getChapters(spec.lessons.chapterCollection),
          built: await getBuiltLessons(),
          progress: await getUserLessonProgressList(spec.lessons.progressCollection, userId),
        }
      : null;

    return Response.json(computeMastery(spec, questions, progress, lessonData));
  } catch (error) {
    console.error('Progress page failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
