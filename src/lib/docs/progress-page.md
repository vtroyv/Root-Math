# Progress page: how it works

A game-style stats page that shows how far a student has got in each skill (area) of a course as a radar chart. Next to it are cards explaining how to improve, an insight for the selected skill, and the reviews due. Underneath is everything left to do for that skill.

Built 13 October 2026 as the **Skill Radar**, and reworked the same day: the avatar card was replaced by these cards. Renamed **Progress** on 22 October 2026: the page moved from `/learn/skill-radar` to `/learn/progress` (the old URL redirects, in `next.config.mjs`), and the chart component became `ProgressRadar`.

Open it from **PROGRESS** in the learn navigation, or go to `/learn/progress`.

---

## Contents

1. [What the student sees](#1-what-the-student-sees)
2. [How it fits together](#2-how-it-fits-together)
3. [Files created and changed](#3-files-created-and-changed)
4. [The courses, skills and lessons (`specs.js`)](#4-the-courses-skills-and-lessons-specsjs)
5. [How mastery, level and rank are calculated](#5-how-mastery-level-and-rank-are-calculated)
6. [Lessons, questions, reviews and the insight](#6-lessons-questions-reviews-and-the-insight)
7. [The radar chart and selecting a skill](#7-the-radar-chart-and-selecting-a-skill)
8. [The page layout](#8-the-page-layout)
9. [The API route](#9-the-api-route)
10. [Testing](#10-testing)
11. [Troubleshooting](#11-troubleshooting)
12. [Open decisions and next steps](#12-open-decisions-and-next-steps)

---

## 1. What the student sees

```
Progress page
Edexcel Pure Maths · Year 12 · Level 2.2 · Adept · 44% overall
Year 12  [Pure] [Statistics] [Mechanics]
Year 13  [Pure] [Statistics] [Mechanics]
┌───────────────────────────┬──────────────────────────┐
│                           │ How to improve your      │
│          Radar            │ skills                   │
│   (click a skill)         ├──────────────────────────┤
│                           │ Insight: <skill>         │
│                           ├──────────────────────────┤
│                           │ Outstanding reviews      │
├───────────────────────────┴──────────────────────────┤
│ <Skill>: what's left                                  │
│   Lessons                 │   Questions               │
└───────────────────────────────────────────────────────┘
```

- **Summary line** under the heading: course, **Level**, **Rank** and overall mastery.
- **Course toggle**: Year 12 / Year 13 × Pure / Statistics / Mechanics. The selected course is filled teal.
- **Radar**: one corner per skill. The teal shape reaches further towards a corner the better the student is doing there. Each corner shows its percentage, or "–" if the skill has no questions yet.
- **Selecting a skill**: **click** a corner (or tap it, or Tab to it and press Enter) to show that skill in the cards. Hovering does nothing: hover previews were removed on 14 October because the cards changing as the mouse crossed the chart flickered. The page opens on the student's **weakest** skill.
- **How to improve your skills**: a fixed card covering complete the lessons, answer the questions, and keep up with reviews.
- **Insight: \<skill\>**: mastery bar, when the student last practised it, questions and lessons completed, strongest and weakest question (with links), one **next step** (with a link), and the subtopics the skill covers.
- **Outstanding reviews**: a summary for the selected course, not a list: "3 questions have review cards due." with a **Go to reviews** button to `/learn/reviews?course=<course>`, or "You're all caught up. Next review tomorrow.", or "No reviews yet." The list itself is on the reviews page (see [reviews-page.md](reviews-page.md)).
- **\<Skill\>: what's left**: the skill's content to work through, in two columns. Reviews aren't repeated here, because they have their own Outstanding reviews card.
  - **Lessons**: outstanding lessons with *In progress* / *Not started* badges and links, then "✓ n complete · n coming soon". When everything available is done: **"All relevant lessons for this skill complete."**
  - **Questions**: the same, with the score on in-progress questions. When all are done: **"All relevant questions for this skill complete."**

---

## 2. How it fits together

```
/learn/progress  (page.js)
   │  course toggle → useGetMasteryQuery(courseId)          (RTK Query, cached per course)
   ▼
GET /api/mastery?spec=edx-maths-1                            (api/mastery/route.js)
   │  auth() + currentUser()       → userId, examBoard         (Clerk session, never from the URL)
   │  getQuestions()               → all questions
   │  getUserProgressForCollection → this student's question progress for the course
   │  if the course has lessons:
   │     getChapters()             → chapters and their lesson titles
   │     getBuiltLessons()         → which lessons have content (lesson-data)
   │     getUserLessonProgressList → this student's lesson progress
   │  computeMastery(spec, questions, progress, lessonData)
   ▼
{ spec, overall, level, rank, totals,
  areas: [{ id, name, short, subtopics, mastery, total, attempted, completed,
            lessons: [...], questions: [...], insight: {...} }] }

Outstanding reviews card → useGetDueReviewsQuery(today) → GET /api/reviews/due (reviews-page.md)
```

Nothing is stored for the Progress page itself. It's calculated fresh from progress on every visit.

---

## 3. Files created and changed

### Created

| File | What it does |
|---|---|
| [mastery/specs.js](../mastery/specs.js) | The six courses: their skills (radar corners), which question `topic`s and lesson chapters belong to each skill, the subtopics. (The course picker uses the student's own courses, `coursesForUser` in [courses.js](../courses/courses.js), since 25 Oct 2026.) |
| [mastery/computeMastery.js](../mastery/computeMastery.js) | Pure function: questions + lessons + one student's progress → mastery, level, rank, and per skill its lessons, questions, reviews and insight. No database or React, so it can be tested on its own. |
| [api/mastery/route.js](../../app/api/mastery/route.js) | `GET /api/mastery?spec=<course id>`. |
| [progress/ProgressRadar.js](../components/learn/progress/ProgressRadar.js) | The radar as plain SVG, reporting hover (preview) and click (pin) to the page. Also the small `MasteryBar`. |
| [learn/progress/page.js](../../app/%28authenticated%29/learn/progress/page.js) | The page: summary line, toggle, radar, the right-hand cards, and the bottom breakdown. |

### Changed

| File | Change |
|---|---|
| [mongodb/utils.js](../mongodb/utils.js) | New `getUserProgressForCollection` (question progress incl. `updatedAt`), `getChapters`, `getBuiltLessons` and `getUserLessonProgressList`. `getQuestions()` now logs the real error. |
| [redux/slices/apiSlice.js](../redux/slices/apiSlice.js) | New `getMastery` query → `useGetMasteryQuery(courseId)`. |
| [learn/LearnNav.js](../components/learn/LearnNav.js) | **PROGRESS** link between QUESTIONS and COURSES. |

---

## 4. The courses, skills and lessons (`specs.js`)

Each course is keyed by the same slug as your course pages (`/learn/edx-maths-1` and so on).

| Key | Course | `branch` | `year` | Skills (corners) | Lessons? |
|---|---|---|---|---|---|
| `edx-maths-1` | Pure, Year 12 | `pure` | `12` | Proof · Algebra · Coordinate geometry · Sequences & series · Trigonometry · Exp & logs · Differentiation · Integration · Vectors | ✅ |
| `edx-maths-2` | Pure, Year 13 | `pure` | `13` | Same, with Numerical methods instead of Exp & logs | not yet |
| `edx-stats-1` | Statistics, Year 12 | `statistics` | `12` | Sampling · Data presentation · Probability · Distributions · Hypothesis testing | not yet |
| `edx-stats-2` | Statistics, Year 13 | `statistics` | `13` | Regression · Probability · Distributions · Hypothesis testing | not yet |
| `edx-mech-1` | Mechanics, Year 12 | `mechanics` | `12` | Modelling · Constant acceleration · Forces & motion · Variable acceleration | not yet |
| `edx-mech-2` | Mechanics, Year 13 | `mechanics` | `13` | Moments · Forces & friction · Projectiles · Applications of forces · Further kinematics | not yet |

Pure and Statistics follow the Edexcel 9MA0 specification sections. Mechanics uses the textbook chapter split, because the spec's three Year 12 sections make a thin triangle.

**Which questions count for a skill:** the question's `branch` and `year` must match the course, and its `topic` must match one of the skill's `matches` (ignoring case and punctuation). Statistics and Mechanics questions should use `branch: 'statistics'` or `'mechanics'`.

**Which lessons count for a skill:** a course can have a `lessons` block. So far only Year 12 Pure does:

```js
lessons: {
  chapterCollection: 'edx-pure-y1-subsections',     // chapters and their lesson titles
  progressCollection: 'edx-maths-1-lesson-progress',
  chaptersByArea: {
    proof: ['what-is-proof', 'methods-of-proof'],
    'algebra-functions': ['algebraic-expressions', 'algebraic-methods', 'quadratic-functions',
                          'simultaneous-equations', 'inequalities', 'graphs-and-transformations'],
    'coordinate-geometry': ['straight-lines', 'circles'],
    'sequences-series': ['binomial-expansion'],
    trigonometry: ['trigonometry-and-triangles', 'trignometric-graphs', 'ratios-identities-and-equations'],
    'exponentials-logarithms': ['exponential-functions', 'logarithms'],
    differentiation: ['gradients-and-lines', 'rates-of-change-and-modelling'],
    integration: ['indefinite-integrals', 'definite-integrals-and-areas'],
    vectors: [],
  },
}
```

Every lesson title in those chapters belongs to the skill. A lesson's slug is its title lower-cased with spaces replaced by `-`, which is the same rule your course pages use to build lesson URLs, so a lesson's link is `/learn/edx-maths-1/<chapter>/<slug>`. Chapter names must match the database exactly, including the existing spelling `trignometric-graphs`.

**To add lessons for another course**, give it a `lessons` block in the same shape.

---

## 5. How mastery, level and rank are calculated

In [computeMastery.js](../mastery/computeMastery.js). **Mastery currently counts questions only.** Lessons and reviews appear in the cards but don't move the radar yet (see [open decisions](#12-open-decisions-and-next-steps)).

1. **Each question scores 0 to 1:** complete = 1; attempted = the last attempt's `marks.awarded / marks.available`; never tried = 0.
2. **A skill's mastery** = total score ÷ number of questions in that skill. This rewards doing well *and* covering the skill.
3. **Overall** = the average over skills that have at least one question.
4. **Level** = overall × 5, to one decimal place (0.0 to 5.0).
5. **Rank** from the level: Novice (0–0.4) · Apprentice (0.5–1.4) · Adept (1.5–2.4) · Expert (2.5–3.4) · Master (3.5–4.4) · Grandmaster (4.5–5.0).

**Worked example** (Year 12 Pure): Proof has 2 questions, one complete (1) and one at 2/4 (0.5), giving 75%. Algebra is 0% (4 questions, none scored). Exp & logs is 0%. Vectors is 100%. Overall = (0.75 + 0 + 0 + 1) ÷ 4 = 0.4375, so **Level 2.2, Adept**.

---

## 6. Lessons, questions, reviews and the insight

For every skill, `computeMastery` returns two lists and an insight. (Reviews come from a separate API; see below.)

**Lessons**, each `{ title, chapter, href, status, updatedAt }`:

| Status | Meaning |
|---|---|
| `complete` | lesson progress has `completed: true` |
| `in-progress` | lesson progress exists, not completed |
| `todo` | the lesson is built (in `lesson-data`) but not started |
| `coming-soon` | the lesson is listed in a chapter but not built yet (no link) |

**Questions**, each `{ title, label, difficulty, href, status, score, updatedAt }`, with status `complete`, `in-progress` (attempted) or `todo`.

**Reviews** aren't part of `computeMastery` (its placeholder `reviews` fields were removed on 19 October). The Outstanding reviews card reads `GET /api/reviews/due`, which covers every course, and keeps only the selected course's questions. Each entry also has a `skillId` if a per-skill review view is wanted later.

**Insight** (rule-based, no LLM):

| Field | How it's chosen |
|---|---|
| `lastPractised` | the most recent `updatedAt` across the skill's question and lesson progress |
| `strongest` | the attempted question with the highest score above 0 |
| `weakest` | the attempted question with the lowest score below 100% (never the same as the strongest) |
| `nextStep` | the first match, in this order: finish an in-progress lesson → start a built lesson → retry the weakest question → try an unstarted question → "Everything here is complete. Keep it fresh with your reviews." |

---

## 7. The radar chart and selecting a skill

[ProgressRadar.js](../components/learn/progress/ProgressRadar.js) draws one SVG with a 500 × 500 coordinate system. Corner `i` of `n` is at angle `-90° + i × 360°/n`, so the first skill is at the top and the rest go clockwise. That works for any number of corners. The student's shape places each corner at `radius × mastery` along its spoke, with a 4% minimum so a new student still sees a small shape.

**Selection is click only and owned by the page**, as one piece of state: `pinned`, the skill clicked, tapped, or chosen with Enter/Space. It starts as `null`, which means "the weakest skill". The selected corner has a larger filled-teal dot and a bold teal label. There are no transitions or animations.

Hover previews were removed (14 October): the cards changing as the mouse moved across the chart flickered. **Keyboard users** still see where they are: tabbing to a corner draws a dashed teal ring around it, kept as local state inside `ProgressRadar`, without changing the cards until they press Enter or Space.

**Switching course** resets both, so the page opens on that course's weakest skill.

---

## 8. The page layout

[page.js](../../app/%28authenticated%29/learn/progress/page.js):
Redesigned on 25 October 2026 to match the course pages:
- **Header panel**: the course's exam board and qualification, "Your Progress", the course name, and on the right a ring of overall mastery with **Level n · Rank** and "n of m questions complete".
- **Course picker**: one row per qualification and year ("A level Maths · Year 12"), one button per course, from the student's own courses (`coursesForUser`). It opens on Year 12 Pure if the student has it, otherwise their first course.
- **Radar column** (`lg=7`) and **card column** (`lg=5`: Insight, Outstanding reviews, How to improve). On phones they stack: radar first, then the cards.
- All cards share one `Card` frame, the course pages' look: a teal header band with an icon, 2px ink border. Styles are in the "Learn area" block of `globals.css`.
- The breakdown's outstanding items are rows like the chapter page's, with a status icon, "In progress · 40%" or "Not started", and a link.
- **`currentData`** (not `data`) from RTK Query, so the page never shows the previous course's numbers while the new course loads.
- The **Column** component in the breakdown shows outstanding items first, then "✓ n complete · n coming soon". When everything available is done it shows the green "All relevant … for this skill complete." message. If items exist but none are built yet, it shows a neutral "None available yet." rather than a tick.

---

## 9. The API route

[api/mastery/route.js](../../app/api/mastery/route.js):
1. `await auth()` gets the user from Clerk's session, or returns 401. The user ID is never taken from the URL.
2. `?spec=` picks the course (default `edx-maths-1`). An unknown course returns 404.
3. `await currentUser()` reads `examBoard`, which picks the question progress collection.
4. It loads questions and question progress. If the course has a `lessons` block, it also loads chapters, built lessons and lesson progress.
5. It returns `computeMastery(...)`.

---

## 10. Testing

- **Unit tests of `computeMastery`:** the worked example; a new student showing Level 0.0 Novice; all six courses computing; no leaking between courses or years.
- **Against your real lesson data (read-only):**
  - all 20 chapters are mapped, and every name in `chaptersByArea` exists in the database;
  - 5 of the 6 built lessons match a chapter lesson. The 6th, `quadratics-graphs`, is a stray duplicate of `quadratic-graphs` in `lesson-data`;
  - with sample progress, Algebra correctly showed 1 lesson complete, 1 in progress, 2 not started and 27 coming soon, picked the right strongest and weakest questions, and suggested finishing *Quadratic Graphs* with a working link.
- **Lint** clean. The **page compiles**, and the **API returns 401** when signed out.
- **Not yet checked in a browser while signed in.**

---

## 11. Troubleshooting

**"Progress page failed: Error: Failed to fetch questions!" (500)**

On 13 October the real error, which `getQuestions()` used to hide, was `MongoNetworkError: read ECONNRESET`. Your public IP had changed, and **MongoDB Atlas** only accepts IPs on its **Network Access** list. **Fix:** Atlas → Network Access → Add IP Address → **Add Current IP Address**, wait for Active, then refresh. `getQuestions()` now logs the real error in the terminal.

---

## 12. Open decisions and next steps

1. **The level formula.** Overall averages only skills that *have* questions, so completing the only question in a course makes a student Level 5.0 Grandmaster. Recommended fix: average every skill, counting empty ones as 0.
2. **Count lessons (and later reviews) towards mastery.** The "How to improve" card says to complete lessons, but only questions move the radar today. A weighted blend, for example 70% questions and 30% lessons, would make lessons count.
3. ~~**Show real outstanding reviews.**~~ Done 19 October: the card shows the count and links to the reviews page ([reviews-page.md](reviews-page.md)).
4. **Lessons for the other five courses**: add a `lessons` block once their chapter collections exist. (Lesson progress itself was rebuilt on 20 October 2026, and `completed` is now set when every task is done: [lessons.md](lessons.md).)
5. **Content clean-up** spotted while testing:
   - `quadratics-graphs` is a duplicate entry in `lesson-data`;
   - "Proof by contradiction" sits in the Year 12 `methods-of-proof` chapter, although it's Year 13 content in the specification.
6. **Per-subtopic progress**: add a `subtopic` field to questions to show progress per subtopic in the Insight card.
7. **Real subscriptions**: billing should write the student's course ids to Clerk `publicMetadata.courses`, which `coursesForUser` already reads (the hard-coded `SUBSCRIBED_COURSES` was removed on 25 Oct 2026).
