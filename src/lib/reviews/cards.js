import { toClientPart } from '../marking/sanitize.js';
import { markAnswer, markChoice, markOrder } from '../marking/deterministic.js';

/*
Helpers for review cards stored in a question's `review` array.
(Card format and writing rules: src/lib/docs/question-reviews.md sections 3-4.)

  flip                        front / back blocks, self-rated
  answer | choice | order     exactly the same fields as the question part of that type,
                              plus an optional `explanation` shown after checking

Auto-marked cards are treated as parts so they reuse the existing sanitiser
(answer keys never reach the browser) and the existing markers.
*/

// identifies one card across all questions and lessons: '<question title>#<card id>'.
// Lesson cards use 'lesson:<slug>' as their title, so their keys are 'lesson:<slug>#<card id>'.
export const cardKey = (title, cardId) => `${title}#${cardId}`;
export const lessonCardsTitle = (slug) => `lesson:${slug}`;
export const lessonSlugFromTitle = (title) => (String(title).startsWith('lesson:') ? String(title).slice('lesson:'.length) : null);

const MARKERS = { answer: markAnswer, choice: markChoice, order: markOrder };
export const isAutoMarked = (card) => Boolean(MARKERS[card?.type]);

// A card viewed as a part. The card key becomes the part id, because order-line ids are
// derived from the part id: this keeps them unique per card and identical on both sides.
const asPart = (card, title) => ({ ...card, id: cardKey(title, card.id) });

// What the browser may see. The explanation is held back until the card is checked,
// because it usually gives the answer away.
export function toClientCard(card, title) {
  if (card.type === 'flip') return { id: card.id, type: 'flip', front: card.front ?? [], back: card.back ?? [] };
  // eslint-disable-next-line no-unused-vars
  const { explanation, marks, ...clientPart } = toClientPart(asPart(card, title), card.id, title);
  return { ...clientPart, id: card.id };
}

// Marks an auto-marked card. `correct` drives the rating: wrong = Again automatically.
export function markCard(card, title, response) {
  const marker = MARKERS[card.type];
  if (!marker) throw new Error(`Card "${card.id}" (${card.type}) isn't auto-marked`);
  const result = marker(asPart(card, title), response);
  return { correct: result.status === 'correct', result, explanation: card.explanation ?? [] };
}
