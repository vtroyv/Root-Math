import { orderLineId, seededShuffle } from './ids.js';

/*
Turns a parts-based question from the DB into what the browser is allowed to see.
Answer keys for auto-marked parts are removed; the marker re-reads the full question
from MongoDB, so nothing the client sends back is trusted as an answer.

Solutions and mark schemes are left in, because the Solution pane reveals them
after 3 attempts. If you want those hidden too, strip them here and fetch on reveal.
*/
export function toClientQuestion(question) {
  if (!Array.isArray(question?.parts)) return question;

  // `review` cards hold answers too; they're served separately by /api/reviews (answer keys stripped)
  // eslint-disable-next-line no-unused-vars
  const { parts, review, ...rest } = question;
  return {
    ...rest,
    _id: question._id?.toString?.() ?? question._id,
    parts: parts.map((part, index) => toClientPart(part, index, question.title)),
  };
}

// exported so review cards (src/lib/reviews/cards.js) can be sanitised the same way as parts
export function toClientPart(part, index, title) {
  const { hint, solution, image, ...p } = part;
  const base = { ...p, hint, solution, image, marks: partMarks(part) };

  switch (part.type) {
    case 'answer': {
      const { blanks, ...keep } = base;
      return keep;
    }
    case 'choice': {
      const correctCount = (part.options ?? []).filter((o) => o.correct).length;
      return {
        ...base,
        multiple: part.multiple ?? correctCount > 1,
        options: (part.options ?? []).map(({ id, content, image: optionImage }) => ({
          id,
          content,
          image: optionImage,
        })),
      };
    }
    case 'order': {
      const { lines, distractors, ...keep } = base;
      const all = [...(lines ?? []), ...(distractors ?? [])].map((content) => ({
        id: orderLineId(part, content),
        content,
      }));
      return { ...keep, lines: seededShuffle(all, `${title}|${index}`) };
    }
    case 'place':
      return {
        ...base,
        objects: (part.objects ?? []).map(({ answer, ...object }) => object),
      };
    case 'sketch': {
      const { keyPoints, correctFeedback, ...keep } = base;
      return keep;
    }
    case 'working':
    case 'explain': {
      const { llm, ...keep } = base;
      return keep;
    }
    default:
      return base;
  }
}

// Marks available for a part, with sensible defaults so authors can omit `marks`
export function partMarks(part) {
  if (typeof part.marks === 'number') return part.marks;
  switch (part.type) {
    case 'answer':
      return Object.keys(part.blanks ?? {}).length || 1;
    case 'place':
      return (part.objects ?? []).length || 1;
    case 'sketch':
      return (part.keyPoints ?? []).length || 1;
    case 'working':
    case 'explain':
      return (part.markScheme ?? []).reduce((sum, m) => sum + (m.marks ?? 1), 0) || 1;
    default:
      return 1;
  }
}
