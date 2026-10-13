/*
Builds the { instructions, solution, markScheme } object the existing Feedback pane
expects, from a parts-based question. Anything set explicitly in `question.details`
wins; otherwise it is generated from each part's `solution` and `markScheme`.
*/

const DEFAULT_INSTRUCTIONS = [
  { type: 'heading', level: 4, content: '1) Answer each part on the left. Your work saves automatically.' },
  { type: 'heading', level: 4, content: '2) When you are happy with your answers, click Submit.' },
  { type: 'heading', level: 4, content: '3) Each part is marked and you get feedback under it and in the Feedback tab.' },
  { type: 'heading', level: 4, content: '4) Fix anything marked wrong and submit again. Correct parts lock.' },
  { type: 'heading', level: 4, content: '5) Stuck? Open the hint under a part, or ask your tutor.' },
  { type: 'heading', level: 4, content: "6) When you're done, click Next to choose another question." },
];

export default function partsDetails(question) {
  const parts = question.parts ?? [];
  const many = parts.length > 1;
  const labelFor = (part, i) => part.label ?? (many ? `Part ${i + 1}` : '');

  const solution = parts.flatMap((part, i) => [
    ...(many ? [{ type: 'heading', level: 4, content: labelFor(part, i) }] : []),
    ...(part.solution ?? []),
  ]);

  const markScheme = parts
    .map((part, i) => ({ part, i }))
    .filter(({ part }) => part.markScheme?.length)
    .flatMap(({ part, i }) => [
      ...(many ? [{ type: 'heading', level: 4, content: labelFor(part, i) }] : []),
      {
        type: 'bullet-points',
        points: part.markScheme.map((m) => `${m.code}: ${m.text} (${m.marks ?? 1} mark${(m.marks ?? 1) === 1 ? '' : 's'})`),
      },
    ]);

  return {
    instructions: question.details?.instructions ?? DEFAULT_INSTRUCTIONS,
    solution: question.details?.solution ?? solution,
    markScheme: question.details?.markScheme ?? (markScheme.length ? markScheme : [
      { type: 'paragraph', content: 'These parts are marked automatically. See the model solution above.' },
    ]),
  };
}
