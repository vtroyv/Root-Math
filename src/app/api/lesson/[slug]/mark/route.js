import { auth } from '@clerk/nextjs/server';
import { markQuestion } from '@/lib/marking';
import { loadTaskLesson, findTask } from '@/lib/lessons/server';

/*
POST /api/lesson/<slug>/mark  { partId, taskId, response }  ->  { result }
Marks one lesson task with the same markers as question parts (src/lib/marking/). The full
lesson, with answer keys, is re-read here. working/explain tasks get the part's teaching
blocks as context for the (simulated or FastAPI) LLM marker.
*/
export async function POST(request, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const { partId, taskId, response } = await request.json();
    const loaded = await loadTaskLesson(decodeURIComponent(params.slug));
    if (loaded.error) return loaded.error;
    const found = findTask(loaded.lesson, partId, taskId);
    if (found.error) return found.error;

    const context = { title: loaded.lesson.title, topic: found.part.title, stem: found.part.blocks ?? [], parts: [found.task] };
    const { results } = await markQuestion(context, [response]);
    return Response.json({ result: results[0] });
  } catch (error) {
    console.error('Marking a lesson task failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
