import { auth } from '@clerk/nextjs/server';
import { getLessonBySlug, getLessonProgressDoc, getReviewStates, createReviewStates } from '@/lib/mongodb/utils';
import { cardKey, lessonCardsTitle, toClientCard } from '@/lib/reviews/cards';
import { isDay, isDue, newState } from '@/lib/reviews/scheduler';
import { progressCollection } from '@/lib/lessons/progress';

/*
GET /api/reviews/lesson/<slug>?today=YYYY-MM-DD
A lesson's Review tab: its cards (answer keys removed) with this student's due dates.
Same response shape as /api/reviews/question/[title], so the same ReviewPane shows both.

The cards unlock once the whole lesson is complete (decided 20 Oct 2026), so they can be
asked in any order rather than following the lesson's parts. Cards are keyed
'lesson:<slug>#<card id>'; once a student has schedules they stay unlocked, even after a Reset.
*/
export async function GET(request, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  const today = new URL(request.url).searchParams.get('today');
  if (!isDay(today)) return Response.json({ error: 'today must be YYYY-MM-DD (the student’s local date)' }, { status: 400 });

  try {
    const slug = decodeURIComponent(params.slug);
    const lesson = await getLessonBySlug(slug);
    if (!lesson) return Response.json({ error: `No lesson "${slug}"` }, { status: 404 });

    const cards = lesson.review ?? [];
    if (!cards.length) return Response.json({ hasCards: false, unlocked: false, cards: [], dueCount: 0, nextDue: null });

    const title = lessonCardsTitle(slug);
    const keys = cards.map((c) => cardKey(title, c.id));
    let states = await getReviewStates(userId, keys);

    const progress = lesson.collection ? await getLessonProgressDoc(progressCollection(lesson), userId, slug) : null;
    const unlocked = progress?.completed === true || states.length > 0;
    if (!unlocked) return Response.json({ hasCards: true, unlocked: false, cards: [], dueCount: 0, nextDue: null });

    // schedules for newly unlocked cards (and for cards added to the lesson later)
    const have = new Set(states.map((s) => s.cardKey));
    const missing = cards
      .filter((c) => !have.has(cardKey(title, c.id)))
      .map((c) => newState({ userId, cardKey: cardKey(title, c.id), source: { kind: 'lesson', slug }, today }));
    if (missing.length) {
      await createReviewStates(missing);
      states = await getReviewStates(userId, keys);
    }

    const stateByKey = new Map(states.map((s) => [s.cardKey, s]));
    const clientCards = cards.map((c) => {
      const state = stateByKey.get(cardKey(title, c.id));
      return { ...toClientCard(c, title), due: state.due, isDue: isDue(state, today) };
    });
    const upcoming = clientCards.filter((c) => !c.isDue).map((c) => c.due).sort();

    return Response.json({
      hasCards: true,
      unlocked: true,
      cards: clientCards,
      dueCount: clientCards.filter((c) => c.isDue).length,
      nextDue: upcoming[0] ?? null,
      newlyUnlocked: missing.length > 0, // tells the browser to refresh the due-reviews list
    });
  } catch (error) {
    console.error('Loading lesson review cards failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
