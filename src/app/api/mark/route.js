import { auth } from '@clerk/nextjs/server';
import { getSpecificQuestion } from '@/lib/mongodb/utils';
import { markQuestion } from '@/lib/marking';

// Marks every part of a parts-based question.
// Body: { title, responses: [response per part] }
// The full question (with answer keys) is re-read from MongoDB here, so the client never needs them.
export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const { title, responses } = await request.json();
    const question = await getSpecificQuestion(title);
    if (!question?.parts) {
      return Response.json({ error: `No parts-based question titled "${title}"` }, { status: 404 });
    }

    const marked = await markQuestion(question, Array.isArray(responses) ? responses : []);
    return Response.json(marked);
  } catch (error) {
    console.error('Marking failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
