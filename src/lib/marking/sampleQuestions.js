/*
The questions anyone can try without an account, on the /teachers page. /api/sample-question
serves and marks only these, so every one must be auto-marked: it refuses a question with a
`working` or `explain` part, because those call the LLM and would cost money per visitor.
*/
export const SAMPLE_QUESTIONS = [
  {
    title: 'Sketch-a-Simple-Quadratic',
    icon: 'bi-graph-up',
    name: 'Sketch a curve',
    description: 'Draw a quadratic freehand, then drag its points into the right places.',
  },
  {
    title: 'Log-Two-Of-Three-Irrational-Proof',
    icon: 'bi-list-ol',
    name: 'Build a harder proof',
    description: 'Prove that log₂3 is irrational by putting the lines in order, leaving out the two that don’t belong.',
  },
];
