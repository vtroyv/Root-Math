/*
Turns a student's progress into Skill Radar numbers, per-skill to-do lists and insights.

How mastery is worked out (questions only, unchanged):
  - each question scores 0..1:
      status 'complete'            -> 1
      otherwise, last attempt marks -> awarded / available
      never attempted              -> 0
  - an area's mastery = total score / number of questions in that area.
    So it rewards both doing well AND covering the area: acing 1 of 10 questions is 10%.
  - overall = average mastery of the areas that have at least one question.
  - level = overall * 5 (0.0 - 5.0); rank comes from the level.

Per area it also returns, for the page's cards:
  lessons    every lesson in the area's chapters, with status complete / in-progress / todo / coming-soon
  questions  every question in the area, with status complete / in-progress / todo and score
  reviews    always [] for now: review cards aren't built yet (the UI shows a "coming soon" state)
  insight    rule-based: last practised, strongest / weakest question, and one suggested next step
*/

const normalise = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// same rule the course pages use to build lesson URLs from lesson titles
export const lessonSlug = (title) => String(title).toLowerCase().split(' ').join('-');
const formatTitle = (title) => String(title).replace(/-/g, ' ');
// most recent of a list of dates (ISO strings or Date objects), as an ISO string
const latest = (dates) =>
  dates
    .filter(Boolean)
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()))
    .sort((a, b) => a - b)
    .pop()
    ?.toISOString() ?? null;

export function questionScore(progress) {
  if (!progress) return 0;
  if (progress.status === 'complete') return 1;
  const { awarded, available } = progress.marks ?? {};
  if (available > 0) return Math.max(0, Math.min(1, awarded / available));
  return 0;
}

const RANKS = [
  { min: 4.5, name: 'Grandmaster' },
  { min: 3.5, name: 'Master' },
  { min: 2.5, name: 'Expert' },
  { min: 1.5, name: 'Adept' },
  { min: 0.5, name: 'Apprentice' },
  { min: 0, name: 'Novice' },
];

/*
lessonData (optional, only for courses with `spec.lessons`):
  { chapters: [{ name, subsections }], built: [{ slug }], progress: [{ lessonSlug, completed, updatedAt }] }
*/
export function computeMastery(spec, questions, progressList, lessonData = null) {
  const progressByTitle = new Map(progressList.map((p) => [p.title, p]));
  const inSpec = questions.filter(
    (q) => (!spec.branch || q.branch === spec.branch) && (!spec.year || String(q.year) === String(spec.year)),
  );

  const chaptersByName = new Map((lessonData?.chapters ?? []).map((c) => [c.name, c]));
  const builtSlugs = new Set((lessonData?.built ?? []).map((l) => l.slug));
  const lessonProgress = new Map((lessonData?.progress ?? []).map((p) => [p.lessonSlug, p]));

  const areas = spec.areas.map((area) => {
    // ── questions ──
    const matches = new Set(area.matches.map(normalise));
    const areaQuestions = inSpec
      .filter((q) => matches.has(normalise(q.topic)))
      .map((q) => {
        const p = progressByTitle.get(q.title);
        const score = questionScore(p);
        const status = p?.status === 'complete' ? 'complete' : (p?.attempts ?? 0) > 0 ? 'in-progress' : 'todo';
        return { title: q.title, label: formatTitle(q.title), difficulty: q.difficulty ?? null, href: `/learn/questions/${q.title}`, status, score, updatedAt: p?.updatedAt ?? null };
      });

    // ── lessons: every lesson title in this area's chapters ──
    const chapterNames = spec.lessons?.chaptersByArea?.[area.id] ?? [];
    const lessons = chapterNames.flatMap((chapterName) => {
      const chapter = chaptersByName.get(chapterName);
      return Object.values(chapter?.subsections ?? {})
        .flat()
        .map((title) => {
          const slug = lessonSlug(title);
          const p = lessonProgress.get(slug);
          const status = !builtSlugs.has(slug) ? 'coming-soon' : p?.completed ? 'complete' : p ? 'in-progress' : 'todo';
          return {
            title,
            chapter: chapterName,
            href: builtSlugs.has(slug) ? `/learn/${spec.id}/${chapterName}/${slug}` : null,
            status,
            updatedAt: p?.updatedAt ?? null,
          };
        });
    });

    const mastery = areaQuestions.length ? areaQuestions.reduce((sum, q) => sum + q.score, 0) / areaQuestions.length : 0;

    return {
      id: area.id,
      name: area.name,
      short: area.short,
      subtopics: area.subtopics,
      total: areaQuestions.length,
      attempted: areaQuestions.filter((q) => q.status !== 'todo').length,
      completed: areaQuestions.filter((q) => q.status === 'complete').length,
      mastery,
      questions: areaQuestions,
      lessons,
      reviews: [],
      insight: buildInsight(areaQuestions, lessons),
    };
  });

  const withContent = areas.filter((a) => a.total > 0);
  const overall = withContent.length ? withContent.reduce((sum, a) => sum + a.mastery, 0) / withContent.length : 0;
  const level = Math.round(overall * 5 * 10) / 10;

  return {
    spec: { id: spec.id, name: spec.name },
    areas,
    overall,
    level,
    rank: RANKS.find((r) => level >= r.min).name,
    totals: {
      questions: areas.reduce((sum, a) => sum + a.total, 0),
      completed: areas.reduce((sum, a) => sum + a.completed, 0),
    },
    reviews: { available: false, due: [] }, // review cards aren't built yet
  };
}

// Rule-based insight for one area: no LLM, just the student's own numbers.
function buildInsight(questions, lessons) {
  const attempted = questions.filter((q) => q.status !== 'todo');
  const byScore = [...attempted].sort((a, b) => b.score - a.score);
  const strongest = byScore.find((q) => q.score > 0) ?? null;
  const weakest = [...byScore].reverse().find((q) => q.score < 1 && q !== strongest) ?? null;

  const pick = (q) => (q ? { label: q.label, href: q.href, score: q.score } : null);

  // one suggested next step, most useful first
  const lessonInProgress = lessons.find((l) => l.status === 'in-progress');
  const lessonTodo = lessons.find((l) => l.status === 'todo');
  const questionTodo = questions.find((q) => q.status === 'todo');
  let nextStep = null;
  if (lessonInProgress) nextStep = { text: `Finish the lesson "${lessonInProgress.title}"`, href: lessonInProgress.href };
  else if (lessonTodo) nextStep = { text: `Start the lesson "${lessonTodo.title}"`, href: lessonTodo.href };
  else if (weakest) nextStep = { text: `Have another go at "${weakest.label}"`, href: weakest.href };
  else if (questionTodo) nextStep = { text: `Try "${questionTodo.label}"`, href: questionTodo.href };
  else if (questions.length || lessons.some((l) => l.status === 'complete')) {
    nextStep = { text: 'Everything here is complete. Keep it fresh with your reviews.', href: null };
  }

  return {
    lastPractised: latest([...questions, ...lessons].map((x) => x.updatedAt)),
    strongest: pick(strongest),
    weakest: pick(weakest),
    nextStep,
  };
}
