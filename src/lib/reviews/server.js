import { getSpecificQuestion, getReviewStates, getLessonBySlug } from '@/lib/mongodb/utils';
import { cardKey, lessonSlugFromTitle } from './cards';

/*
Shared lookups for the /api/reviews routes (server only: touches MongoDB).
Each returns either the thing asked for or a Response to send back as-is.
*/

const json = (body, status) => Response.json(body, { status });

// question (or lesson) + one of its review cards + this student's schedule for it.
// `title` is a question title, or 'lesson:<slug>' for a lesson's cards (see cards.js).
export async function loadCardForUser(userId, title, cardId) {
  if (typeof title !== 'string' || typeof cardId !== 'string') return { error: json({ error: 'title and cardId are required' }, 400) };

  const slug = lessonSlugFromTitle(title);
  const question = slug ? await getLessonBySlug(slug) : await getSpecificQuestion(title);
  const card = question?.review?.find((c) => c.id === cardId);
  if (!card) return { error: json({ error: `No review card "${cardId}" on "${title}"` }, 404) };

  const [state] = await getReviewStates(userId, [cardKey(title, cardId)]);
  // no schedule = the student hasn't unlocked these cards yet
  if (!state) return { error: json({ error: `This card is locked. Finish the ${slug ? 'lesson' : 'question'} first.` }, 403) };

  return { question, card, state };
}
