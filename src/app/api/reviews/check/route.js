import { auth } from '@clerk/nextjs/server';
import { isAutoMarked, markCard } from '@/lib/reviews/cards';
import { loadCardForUser } from '@/lib/reviews/server';

/*
POST /api/reviews/check  { title, cardId, response }
Marks an auto-marked review card (answer / choice / order) on the server, where the
answer keys are. Returns { correct, result, explanation }. A wrong answer is rated
Again by the Review tab automatically.
*/
export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const { title, cardId, response } = await request.json();
    const loaded = await loadCardForUser(userId, title, cardId);
    if (loaded.error) return loaded.error;
    if (!isAutoMarked(loaded.card)) return Response.json({ error: 'Flip cards are self-rated, not checked' }, { status: 400 });

    const { correct, result, explanation } = markCard(loaded.card, title, response);
    return Response.json({ correct, result: { status: result.status, details: result.details, feedback: result.feedback }, explanation });
  } catch (error) {
    console.error('Checking a review card failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
