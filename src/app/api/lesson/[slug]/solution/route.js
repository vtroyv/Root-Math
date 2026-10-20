import { auth } from '@clerk/nextjs/server';
import { solutionResponse } from '@/lib/marking/solutions';
import { loadTaskLesson, findTask } from '@/lib/lessons/server';

/*
POST /api/lesson/<slug>/solution  { partId, taskId }  ->  { response, solution }
The Solution button: the correct answer for one task, in the shape its component saves
(src/lib/marking/solutions.js), plus the task's worked solution blocks for the Feedback tab.
The page has already asked the student whether they'd rather keep trying.
*/
export async function POST(request, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const { partId, taskId } = await request.json();
    const loaded = await loadTaskLesson(decodeURIComponent(params.slug));
    if (loaded.error) return loaded.error;
    const found = findTask(loaded.lesson, partId, taskId);
    if (found.error) return found.error;

    return Response.json({ response: solutionResponse(found.task), solution: found.task.solution ?? [] });
  } catch (error) {
    console.error('Loading a lesson solution failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
