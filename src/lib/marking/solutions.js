import { orderLineId } from './ids.js';

/*
The response that answers a part correctly, in the same shape the part's component saves.
Used by the lesson Solution button (POST /api/lesson/[slug]/solution) to fill a task in.
Server only: it reads answer keys.

  answer   every blank's `answer`
  choice   the ids of the correct options
  order    the `lines` in their authored (correct) order, without distractors
  place    each object's answer; a free vector keeps its start point and adds the components
  sketch / working / explain   no single right answer to build, so the part's `modelAnswer`
                               ({ points } or { latex }) is used
A `modelAnswer` on any part overrides the built one. Returns null if there's nothing to fill.
*/
export function solutionResponse(part) {
  if (part.modelAnswer) return part.modelAnswer;

  switch (part.type) {
    case 'answer':
      return { blanks: Object.fromEntries(Object.entries(part.blanks ?? {}).map(([id, spec]) => [id, spec.answer])) };
    case 'choice':
      return { selected: (part.options ?? []).filter((o) => o.correct).map((o) => o.id) };
    case 'order':
      return { sequence: (part.lines ?? []).map((content) => orderLineId(part, content)) };
    case 'place':
      return {
        objects: (part.objects ?? []).map((object) => {
          const answer = object.answer ?? {};
          if (object.kind === 'point') return { at: answer.at ?? answer };
          if (object.kind === 'circle') {
            const centre = answer.centre ?? object.start?.centre ?? [0, 0];
            const radius = answer.radius ?? object.start?.radius ?? 1;
            return { centre, edge: [centre[0] + radius, centre[1]] };
          }
          if (answer.components) {
            const from = object.start?.from ?? [0, 0];
            return { from, to: [from[0] + answer.components[0], from[1] + answer.components[1]] };
          }
          return { from: answer.from, to: answer.to };
        }),
      };
    default:
      return null;
  }
}
