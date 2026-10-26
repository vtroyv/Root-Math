# Learn area redesign and binomial content: summary

What changed in the 23–25 October 2026 session. Nothing was committed.

## 1. Binomial lessons (paste into `lesson-data`)

Four lessons in [lesson-examples/](lesson-examples/), written from the old `introducingBinomials` / `beyondPascal` drafts in `testing/lessons/page.js`, in the tasks format (`schemaVersion: 2`):

| File | Lesson | Parts | Tasks | Cards |
|---|---|---|---|---|
| `07-pascals-triangle.json` | Pascal's Triangle | 3 | 11 | 5 |
| `08-factorial-notation.json` | Factorial Notation | 3 | 12 | 5 |
| `09-brackets-and-large-powers.json` | Brackets and Large Powers | 4 | 14 | 5 |
| `10-binomial-estimation.json` | Binomial Estimation | 3 | 11 | 5 |

- **Insert** each with Compass → `lesson-data` → Add Data → Insert Document. The slugs match the course page titles.
- **Content fixes:** the rows of Pascal's triangle are now counted from 0 everywhere; the Markdown `*…*` and `\n-` bullets, which don't render, are gone; the history line is corrected; and the typos are fixed.
- **New content:** expanding with the triangle; dividing factorials; $\binom{n}{r}$ notation and symmetry; ascending powers, unknown constants, products and the term independent of $x$; probability examples; and the whole estimation lesson (choosing $x$, percentage error and an explain task).
- **Spec coverage:** checked against the Year 12 specs for Edexcel, CIE, AQA, OCR A and OCR B (MEI).
- **`next`:** Binomial Estimation has none yet. Add it once the next chapter's first lesson exists.

### Straight lines and circles (8 more lessons)

`11`–`18` in [lesson-examples/](lesson-examples/), on the Edexcel Year 1 textbook split (chapters 5 and 6): gradient and equations of lines; parallel and perpendicular; distance, intersections and areas; modelling; midpoints and perpendicular bisectors; the equation of a circle and completing the square; line–circle intersections, tangents and chords; the angle in a semicircle and circumcircles. 70 tasks and 40 review cards, tested with ~2,300 checks.

- **Titles fixed** ("Whats a Straight Line" → "What is a Straight Line", "Inbetween two Points" → "Between Two Points", ...). Paste the corrected chapter documents in [lesson-examples/chapters/](lesson-examples/chapters/) over the `straight-lines` and `circles` documents in `edx-pure-y1-subsections`, keeping each `_id`.
- **New marking: `equation: true`** on an answer box accepts any rearrangement or multiple of the right equation (and expanded circle equations), with an optional `form: 'y=mx+c' | 'ax+by+c=0'` check. Before, `2x − y + 3 = 0` was marked wrong for `y = 2x + 3`. In `marking/deterministic.js`.
- **New: draggable circles** in the `place` part (drag the centre, resize from the edge), plus fixed grey `line` and `circle` reference objects. In `PlacePart.js`, `markPlace` and `solutions.js`.
- **Straight lines are sketched** with the existing sketch part at `degree: 1`.
- Triangles and Circles has no `next` yet (the next chapter's lessons don't exist).

## 2. Challenge questions (paste into `quizzes`)

Three `difficulty: "Challenge"`, `topic: "Binomial Expansion"` questions in [question-examples/](question-examples/):

- `09-integer-part-of-two-plus-root-three.json`: $(2+\sqrt3)^n + (2-\sqrt3)^n$ is even, so the integer part of $(2+\sqrt3)^n$ is odd. Two parts are written proofs, marked by the simulated marker until `FASTAPI_MARKING=live`.
- `10-which-is-bigger-without-a-calculator.json`: $1000^{1000}$ vs $1001^{999}$, with the proof as an order task.
- `11-sum-of-squared-binomial-coefficients.json`: $\sum \binom{n}{r}^2 = \binom{2n}{n}$, with the proof as an order task.

The order tasks make 10 and 11 easier than a written proof would. Swap them for `working` parts once AI marking is live if you want them properly hard.

**Testing:** every lesson, question and card was run against the real marking, sanitising and progress code (about 2,300 checks). Every Solution answer marks correct, wrong answers and distractors are rejected, all the maths renders in KaTeX, and nothing that gives answers away reaches the browser.

## 3. Learn area redesign

| Page | What changed |
|---|---|
| **Layout** (`learn/layout.js`) | The nav is sticky and sits in the page flow, as on the public site. The `<br>` spacers and wrapper divs that caused the big gap are gone. |
| **Nav** (`LearnNav.js`) | Rebuilt on the home nav's `rm-nav` classes in teal: a pill for the current page, a reviews badge and a ☰ menu on phones. Adds a **Learn** link. COURSES lists the student's own courses. **Sign out** really signs out (Clerk). The placeholder items are gone. |
| **Breadcrumbs** (`Breadcrumbs.js`) | A padded pale-teal box with › separators and a house icon. Chapter names come from the spec. The current page isn't a link. Hidden on `/learn`. |
| **Landing** (`/learn`, `LearnCourses.js`) | "Welcome back", a qualification filter, and cards grouped by qualification and year. Each card has a teal header, an icon, a progress ring (% of built lessons complete) and Start/Continue. Courses with no lessons show "Coming soon". |
| **Course page** (`/learn/<course>`) | Built from the database instead of hand-written cards. A header with a ring and **Continue: \<next lesson\>**, then topic cards with a progress bar and chapter rows ("2 of 4", ✓). Empty chapters are greyed out. Stats, Mechanics and Year 13 show their spec topics as coming soon (before, every course showed Year 12 Pure). |
| **Chapter page** (`/learn/<course>/<chapter>`) | The same header, then one card per lesson group, with a status icon for each lesson. |
| **Reviews** (`/learn/reviews`) | The same header panel: the number of cards due and **Start with \<most overdue\>**. A Questions / Lessons toggle with badges, then Course and Skill filters built from the student's own courses (replacing Year + Course). The due list is a card with a row per item (course and skill underneath, a card-count pill and how overdue), replacing the table. See [reviews-page.md](reviews-page.md). |
| **Progress** (`/learn/progress`) | The same header panel, with an overall mastery ring, **Level · Rank** and questions complete. A course picker built from the student's own courses. Every panel (radar, Insight, Outstanding reviews, How to improve, what's left) is a teal-header card, and the breakdown uses the chapter page's rows and status icons. The hard-coded `SUBSCRIBED_COURSES` list is gone. See [progress-page.md](progress-page.md) section 8. |

**New code**
- [courses/courses.js](../courses/courses.js): the course list; `coursesForUser` (reads Clerk `publicMetadata.courses`, and anyone without it sees every course); and `courseOutline`, which works out every lesson's status. The landing, course and chapter numbers all come from this one function.
- [courses/server.js](../courses/server.js): `loadCourseOutline` (MongoDB reads).
- `GET /api/courses` and `GET /api/courses/<course>`, which returns 403 if the course isn't on the student's account. Hooks: `useGetCoursesQuery` and `useGetCourseOutlineQuery`.
- [learn/courses/CourseUI.js](../components/learn/courses/CourseUI.js): the progress ring, progress bar, status icon and header panel.
- `chapterTitles` in [specs.js](../mastery/specs.js), for chapter names like "What is Proof?".
- One commented "Learn area" block at the end of `globals.css`. Hovers only swap colours, with no movement or animation.

**To give a student specific courses:** Clerk dashboard → the user → Metadata → Public: `{"courses": ["edx-maths-1"]}`.

**Checked:** lint is clean on every new file; the course list and outline logic have unit tests; and on the dev server every page compiles and the APIs return 401 when signed out. **Not yet checked while signed in.**

## 4. Known issues and next steps

- The **Exam** filter in `QuestionTable.js` (line 357) looks for `"exam"`, but questions use `"Exam"`, so it shows nothing.
- The old chapter API (`/api/lessons/[collection]/[lessonContent]`, `useGetLessonContentQuery`) is now unused and can be deleted.
- Adding lessons lowers a course's % (it's completed ÷ built lessons).
- Subscriptions and billing don't exist yet: `publicMetadata.courses` is where billing should write.
