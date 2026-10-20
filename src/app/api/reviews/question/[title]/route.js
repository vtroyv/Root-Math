import { auth, currentUser } from '@clerk/nextjs/server';
import { getSpecificQuestion, getUserQuestionProgress, getReviewStates, createReviewStates } from '@/lib/mongodb/utils';
import { cardKey, toClientCard } from '@/lib/reviews/cards';
import { isDay, isDue, newState } from '@/lib/reviews/scheduler';

/*
GET /api/reviews/question/<title>?today=YYYY-MM-DD
The Review tab's data for one question: its cards (answer keys removed) with this
student's due dates.

Unlocking happens here: once the question is complete (status 'complete') or its solution
has been revealed (solutionRevealed), any card without a schedule gets one, due today. Once a
student has schedules the cards stay unlocked, even if they reset the question.
*/
export async function GET(request, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  const today = new URL(request.url).searchParams.get('today');
  if (!isDay(today)) return Response.json({ error: 'today must be YYYY-MM-DD (the student’s local date)' }, { status: 400 });

  try {
    const title = decodeURIComponent(params.title);
    const question = await getSpecificQuestion(title);
    if (!question) return Response.json({ error: `No question titled "${title}"` }, { status: 404 });

    const cards = question.review ?? [];
    if (!cards.length) return Response.json({ hasCards: false, unlocked: false, cards: [], dueCount: 0, nextDue: null });

    const keys = cards.map((c) => cardKey(title, c.id));
    let states = await getReviewStates(userId, keys);

    const user = await currentUser();
    const examBoard = user?.unsafeMetadata?.examBoard;
    const progress = examBoard
      ? await getUserQuestionProgress({ userId, examBoard, title, branch: question.branch, year: question.year })
      : null;

    // complete, or the solution was revealed (which deliberately doesn't count as complete for mastery)
    const unlocked = progress?.status === 'complete' || progress?.solutionRevealed === true || states.length > 0;
    if (!unlocked) return Response.json({ hasCards: true, unlocked: false, cards: [], dueCount: 0, nextDue: null });

    // create schedules for newly unlocked cards (and for any cards added to the question later)
    const have = new Set(states.map((s) => s.cardKey));
    const missing = cards
      .filter((c) => !have.has(cardKey(title, c.id)))
      .map((c) => newState({ userId, cardKey: cardKey(title, c.id), title, today }));
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
    console.error('Loading review cards failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
