import { auth } from '@clerk/nextjs/server';
import { saveReviewState } from '@/lib/mongodb/utils';
import { loadCardForUser } from '@/lib/reviews/server';
import { RATINGS, isDay, isDue, schedule, practise } from '@/lib/reviews/scheduler';

/*
POST /api/reviews/rate  { title, cardId, rating, mode: 'review' | 'practice', today }
Records the student's rating and returns the card's next due date.
  review    the normal SM-2 schedule (src/lib/reviews/scheduler.js)
  practice  doesn't change the schedule, except that Again brings the card back tomorrow
A 'review' of a card that isn't actually due yet is treated as practice, so reviewing
early can never push a card further away.
*/
export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const { title, cardId, rating, mode, today } = await request.json();
    if (!RATINGS.includes(rating)) return Response.json({ error: `rating must be one of ${RATINGS.join(', ')}` }, { status: 400 });
    if (mode !== 'review' && mode !== 'practice') return Response.json({ error: "mode must be 'review' or 'practice'" }, { status: 400 });
    if (!isDay(today)) return Response.json({ error: 'today must be YYYY-MM-DD (the student’s local date)' }, { status: 400 });

    const loaded = await loadCardForUser(userId, title, cardId);
    if (loaded.error) return loaded.error;
    const { state } = loaded;

    const applied = mode === 'review' && isDue(state, today) ? 'review' : 'practice';
    let next = state;
    if (applied === 'review') {
      next = schedule(state, rating, today);
      await saveReviewState(next);
    } else {
      const result = practise(state, rating, today);
      if (result.changed) await saveReviewState(result.state);
      next = result.state;
    }

    return Response.json({ mode: applied, due: next.due, intervalDays: next.intervalDays });
  } catch (error) {
    console.error('Rating a review card failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
