/* ==========================================================================
   Blog posts.

   Each post's `blocks` array is fed straight to the lesson BlockRenderer
   (src/lib/components/learn/lessons/BlockRenderer.js), so anything a lesson
   can do, an article can do: paragraph, bold-paragraph, heading, bullet-points,
   image, accordion and table. `$...$` is inline LaTeX, `$$...$$` is display.

   Adding a post means adding an object here — the index page and the
   /blog/<slug> route both read from this array, so nothing else needs editing.
   When these move to MongoDB, keep the same shape and swap the two helpers at
   the bottom for queries.
   ========================================================================== */

export const blogPosts = [
  {
    slug: 'study-techniques-for-maths',
    title: 'Studying maths: the techniques that actually work',
    date: '2026-09-15',
    readingTime: '7 min read',
    tag: 'Study skills',
    excerpt:
      'Re-reading your notes feels productive and does almost nothing. Here is what the evidence says about revising maths, and how to build a week of practice that actually moves your grade.',
    blocks: [
      {
        type: 'paragraph',
        content:
          'Almost every student who is disappointed on results day revised hard. The problem is rarely effort — it is that the most comfortable ways to revise are the least effective ones. Reading through worked solutions, highlighting notes and watching someone else solve a problem all produce a strong feeling of understanding without producing the ability to do it yourself under exam conditions.',
      },
      {
        type: 'bold-paragraph',
        content:
          'The single rule behind everything below: if your revision does not involve you producing an answer from a blank page, it is not revision.',
      },
      { type: 'heading', level: '3', content: '1. Retrieval, not recognition' },
      {
        type: 'paragraph',
        content:
          'Recognising a method when you see it is a much weaker skill than recalling it when the page is empty. Close the book, write down everything you know about a topic, then check what you missed. The gaps you find are the whole point — they are the questions you would have dropped marks on.',
      },
      {
        type: 'bullet-points',
        points: [
          'Cover the solution before you start, always. Every time.',
          'Write the method from memory first, then check it against your notes.',
          'Anything you could not recall goes on a list to attempt again in two days.',
        ],
      },
      { type: 'heading', level: '3', content: '2. Space it out' },
      {
        type: 'paragraph',
        content:
          'Four thirty-minute sessions across a fortnight beat one two-hour session, even though the total time is identical. Forgetting a little between sessions is what makes the next recall effortful, and effortful recall is what sticks. Plan to revisit a topic three times: a few days after you learn it, a fortnight later, then again the month after.',
      },
      { type: 'heading', level: '3', content: '3. Mix topics in one session' },
      {
        type: 'paragraph',
        content:
          'Doing twenty differentiation questions in a row teaches you to differentiate. It does not teach you to notice that a question needs differentiating — and in the exam nothing is labelled. Once you can do a method reliably, start mixing: a few questions on integration, then vectors, then trigonometry, shuffled together.',
      },
      {
        type: 'bold-paragraph',
        content:
          'Blocked practice feels smooth and scores badly. Mixed practice feels clumsy and scores well.',
      },
      { type: 'heading', level: '3', content: '4. Work from examples, then take the scaffolding away' },
      {
        type: 'paragraph',
        content:
          'When a topic is genuinely new, studying a fully worked example is more efficient than struggling from nothing. The mistake is staying there. Work through one example in full, then do the next one with the solution covered, then do a third with no support at all.',
      },
      {
        type: 'paragraph',
        content:
          'Take differentiating from first principles. Read this once, then reproduce it with the page covered: $$f\'(x)=\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}.$$ For $f(x)=x^2$ this gives $$\\frac{(x+h)^2-x^2}{h}=\\frac{2xh+h^2}{h}=2x+h,$$ and letting $h\\to 0$ leaves $f\'(x)=2x$. If you cannot rebuild those three lines without looking, you do not know it yet — and that is a question the examiner is entitled to ask.',
      },
      { type: 'heading', level: '3', content: '5. Keep an error log' },
      {
        type: 'paragraph',
        content:
          'This is the highest-value habit on the list and almost nobody does it. Every time you drop a mark, write one line: what the question was, and what specifically went wrong. Not "careless" — that is not a diagnosis.',
      },
      {
        type: 'bullet-points',
        points: [
          'Sign error when expanding a bracket — a method you can drill.',
          'Did not know the identity — a knowledge gap you can close in ten minutes.',
          'Knew it but ran out of time — a pacing problem, not a maths problem.',
          'Misread the question — usually a habit, and habits respond to practice.',
        ],
      },
      {
        type: 'paragraph',
        content:
          'After a fortnight the log tells you exactly where your marks are going, and the three or four patterns it exposes are worth more than another past paper.',
      },
      { type: 'heading', level: '3', content: '6. Practise under real conditions' },
      {
        type: 'paragraph',
        content:
          'A paper done over an afternoon with your notes open measures something, but not the thing you are graded on. At least once a fortnight, sit a full paper to time, in one go, with only the equipment you get in the exam. Speed is a skill of its own and it only improves under pressure.',
      },
      {
        type: 'accordion',
        title: 'How long should a session be?',
        children: [
          {
            type: 'paragraph',
            content:
              'Shorter than you think. Forty to fifty minutes of genuine problem solving, with a proper break afterwards, beats three hours of drifting. The measure of a session is the number of questions you attempted from a blank page, not the number of minutes the timer ran.',
          },
          {
            type: 'paragraph',
            content:
              'If you cannot face a full session, do three questions. Three questions on a bad day, repeated, will beat a heroic weekend that never happens.',
          },
        ],
      },
      { type: 'heading', level: '3', content: 'Putting it together' },
      {
        type: 'bullet-points',
        points: [
          'Every session starts with three questions from a topic you studied last week, cold.',
          'New material: one worked example, then two questions with no support.',
          'Every dropped mark goes in the error log with a specific reason.',
          'One timed paper a fortnight, marked honestly against the mark scheme.',
        ],
      },
      {
        type: 'bold-paragraph',
        content:
          'None of this is comfortable, and that is the point. The discomfort is the learning — comfortable revision is usually just reading.',
      },
    ],
  },
  {
    slug: 'a-level-maths-exam-boards',
    title: 'A Level Maths exam boards: what each one tests, and how the papers are built',
    date: '2026-09-08',
    readingTime: '8 min read',
    tag: 'Exams',
    excerpt:
      'Edexcel, AQA, OCR A, OCR B (MEI) and Cambridge International all examine the same core content — but they carve it into papers very differently. Here is what changes, and what it means for how you revise.',
    blocks: [
      {
        type: 'paragraph',
        content:
          'Students often ask which board is easiest. It is the wrong question. Since the 2017 reform, the content of A Level Mathematics is set nationally: every board in England teaches the same prescribed Pure, Statistics and Mechanics material, all of it compulsory, all of it examined at the end of two years. No modules, no picking your applied options, no January resits.',
      },
      {
        type: 'bold-paragraph',
        content:
          'What differs between boards is not what you have to know. It is how the content is split across the papers, and the house style of the questions.',
      },
      { type: 'heading', level: '3', content: 'What every board has in common' },
      {
        type: 'bullet-points',
        points: [
          'Three papers, two hours each, sat at the end of Year 13.',
          'Pure maths is roughly two thirds of the qualification; Statistics and Mechanics share the remaining third.',
          'A calculator is allowed in every paper — unlike GCSE, there is no non-calculator paper.',
          'A formulae booklet is provided, and it is worth knowing early what is in it and what you must memorise.',
          'Statistics is examined against a large data set the board publishes in advance.',
          'Overlap with AS is common, but AS marks do not count towards the A Level grade.',
        ],
      },
      { type: 'heading', level: '3', content: 'How the papers are split' },
      {
        type: 'paragraph',
        content:
          'This is the real difference. The same content, packaged four ways:',
      },
      {
        type: 'table',
        header: ['Board', 'Paper 1', 'Paper 2', 'Paper 3'],
        rows: [
          ['Edexcel (9MA0)', 'Pure 1', 'Pure 2', 'Statistics and Mechanics, in two sections'],
          ['AQA (7357)', 'Pure', 'Pure and Mechanics', 'Pure and Statistics'],
          ['OCR A (H240)', 'Pure', 'Pure and Statistics', 'Pure and Mechanics'],
          ['OCR B / MEI (H640)', 'Pure and Mechanics', 'Pure and Statistics', 'Pure and Comprehension'],
        ],
      },
      {
        type: 'paragraph',
        content:
          'Read that table again with revision in mind. On Edexcel, an entire paper is applied maths and two are untouched pure — so a weakness in mechanics is contained in one place, and a weakness in pure costs you across two papers. On AQA and OCR, pure appears in all three papers, so pure gaps leak everywhere, but a bad day on statistics damages only part of one paper.',
      },
      { type: 'heading', level: '3', content: 'The boards one at a time' },
      {
        type: 'bold-paragraph',
        content: 'Edexcel (Pearson) — 9MA0',
      },
      {
        type: 'paragraph',
        content:
          'The most widely sat specification in England. Papers 1 and 2 are pure only, each 100 marks over two hours. Paper 3 is also 100 marks, split into a statistics section and a mechanics section worth 50 each. Questions tend to be structured and predictable in shape, which makes past-paper practice unusually transferable — and makes it important to actually do them rather than read them.',
      },
      {
        type: 'bold-paragraph',
        content: 'AQA — 7357',
      },
      {
        type: 'paragraph',
        content:
          'Three 100-mark papers of two hours: Paper 1 is pure, Paper 2 pairs pure with mechanics, Paper 3 pairs pure with statistics. AQA papers often open with a run of short, sharp questions before the longer ones, and multiple-choice style items appear more here than elsewhere. Pace at the start matters.',
      },
      {
        type: 'bold-paragraph',
        content: 'OCR A — H240',
      },
      {
        type: 'paragraph',
        content:
          'Paper 1 is pure, Paper 2 is pure and statistics, Paper 3 is pure and mechanics — the mirror image of AQA. Two hours and 100 marks each. OCR has a reputation for questions that ask you to explain or justify rather than just compute, so practise writing the reason as well as the answer.',
      },
      {
        type: 'bold-paragraph',
        content: 'OCR B (MEI) — H640',
      },
      {
        type: 'paragraph',
        content:
          'The one genuine structural outlier. Paper 1 is pure and mechanics, Paper 2 is pure and statistics, and Paper 3 is pure with a comprehension section: you are given an unseen article and answer questions on it. It rewards reading mathematics you have never met before and extracting the argument — a different skill from anything in the other specifications, and one worth practising deliberately.',
      },
      {
        type: 'bold-paragraph',
        content: 'Cambridge International (CIE) — 9709',
      },
      {
        type: 'paragraph',
        content:
          'A different qualification rather than a variant of the English A Level, sat by international students and some independent schools. It is built from separate components — Pure 1 and Pure 3 alongside applied components in Mechanics and Probability & Statistics — so the structure, and the choice available within it, does not map onto the three-paper model above. If you are on 9709, check which components your centre enters you for before you plan revision.',
      },
      {
        type: 'accordion',
        title: 'What is the large data set, and do I have to memorise it?',
        children: [
          {
            type: 'paragraph',
            content:
              'Each board publishes a real data set — weather records, car data, that sort of thing — which your statistics teaching is built around. You do not memorise the numbers. What you are expected to have is familiarity: the column headings, the units, the scale of typical values, and the quirks and missing entries that make some conclusions unsafe.',
          },
          {
            type: 'paragraph',
            content:
              'Marks are lost when a student has never actually opened the thing. Spend an hour with it before the exam. The questions assume you have seen it.',
          },
        ],
      },
      {
        type: 'accordion',
        title: 'Does the board change how hard the grade is to get?',
        children: [
          {
            type: 'paragraph',
            content:
              'Grade boundaries are set after each series to account for how difficult that particular paper turned out to be, and boards are held to comparable standards. A paper everyone found hard gets lower boundaries. Chasing an "easier" board is not a strategy; your school chose one years ago, and the marks come from how you practise.',
          },
        ],
      },
      { type: 'heading', level: '3', content: 'What this means for your revision' },
      {
        type: 'bullet-points',
        points: [
          'Know your board and your paper structure by name — it tells you what a bad day in one topic actually costs you.',
          'Pure is the bulk of every specification on every board. It is where the marks are.',
          'Use past papers from your own board first; other boards are useful extra practice once you have run out.',
          'On MEI, practise the comprehension paper specifically. Nothing else prepares you for it.',
          'Check the current specification on the board\'s own site before you plan — details do change between series, and this article is a starting point rather than the last word.',
        ],
      },
      {
        type: 'bold-paragraph',
        content:
          'Same content, different packaging. Once you know which packaging you are sitting, you can stop worrying about the board and start working on the maths.',
      },
    ],
  },
];

export function getPost(slug) {
  return blogPosts.find((post) => post.slug === slug);
}

/** Newest first, for the index page. */
export function getPostsNewestFirst() {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}
