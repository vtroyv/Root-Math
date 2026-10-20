# Lessons: tasks, progress, solutions and review cards

How lessons work since they were rebuilt on 20 October 2026: the lesson format, what the student sees, how saving and marking work, the review cards, how to load the rewritten lessons into MongoDB, and every fix made to the lesson content.

Related docs: [question-parts.md](question-parts.md) (the task types are question part types), [question-reviews.md](question-reviews.md) (review cards and scheduling), [reviews-page.md](reviews-page.md), [skill-radar.md](skill-radar.md).

---

## Contents

1. [Summary](#1-summary)
2. [Decisions](#2-decisions)
3. [Loading the rewritten lessons](#3-loading-the-rewritten-lessons)
4. [The lesson format](#4-the-lesson-format)
5. [What the student sees](#5-what-the-student-sees)
6. [How it fits together](#6-how-it-fits-together)
7. [Review cards](#7-review-cards)
8. [Files](#8-files)
9. [Fixes made to the lesson content](#9-fixes-made-to-the-lesson-content)
10. [Testing](#10-testing)
11. [Known limitations and next steps](#11-known-limitations-and-next-steps)

---

## 1. Summary

- **Lesson tasks are question parts.** Every task is one of the seven part types (`answer`, `choice`, `order`, `place`, `sketch`, `working`, `explain`), uses the same components and is marked by the same code on the server. The old task types and the FastAPI `/lesson-feedback` endpoints aren't used by the new lessons.
- **Three panes, as before:**
  - **Left:** the teaching text, then a box per task with its title, instructions, a tick or cross, and its **hint**.
  - **Centre:** the tasks themselves. Once marked, a task gets a green, amber or red edge and a one-line status.
  - **Right:** **Feedback** (one card per task: Task 1, Task 2, …), **Your Notes**, **Comments** and **Review**.
- **Save, Submit, Reset and Solution work.** The Hint button has gone from the centre, because each task box has its own hint. Answers autosave 1.5 s after you stop typing.
- **Everything persists**, in Zustand and MongoDB. A correct task stays correct and locked until Reset. Refreshing brings back every answer and result, and reopens the part you were on.
- **Solution** asks "Have another go first?" (**Keep trying** / **Reveal solution anyway**). Revealing fills the open task in with the correct answer and shows the worked solution in Feedback.
- **Videos:** a part with a `video` field shows the 🎥 button, which plays it in a pop-up the same way **See how it works** does on the home page. Every part currently has that same placeholder video.
- **Review cards:** each lesson has 5 or 6 flashcards. They unlock when the whole lesson is complete, come in a random order, and appear in the lesson's Review tab, on the reviews page's **Lessons** tab, in the **REVIEWS · n** nav count and in the Skill Radar's Outstanding reviews box.
- **Five lessons rewritten**, ready to paste into Compass: [lesson-examples/](lesson-examples/). The maths and wording errors found are fixed and listed in [section 9](#9-fixes-made-to-the-lesson-content), and First Principles has 8 new tasks.
- **Old-format lessons still work**: any `lesson-data` document without `schemaVersion: 2` uses the original lesson page, unchanged.

---

## 2. Decisions

| Question | Your answer | What that meant |
|---|---|---|
| How do tasks open up? | One at a time | Task 2 opens once task 1 is correct or revealed. **Next** needs every task in the part done. Submit marks the open task. |
| What does a revealed task count as? | Complete | Revealed counts as done for moving on **and** for lesson completion (and so the Skill Radar). It shows as "Revealed", not green. |
| Solution for working/explain/sketch? | Fill in a model answer | Those tasks have a `modelAnswer`: LaTeX working, or curve handle points. |
| When do review cards unlock? | When the whole lesson is complete | Cards are lesson-wide, so they can be asked in any order rather than following the parts. Each session is shuffled. |
| Errors in the old tasks? | Fix them and list each fix | [Section 9](#9-fixes-made-to-the-lesson-content). |
| First Principles (no tasks)? | Write tasks + review cards | 8 tasks across its 3 parts, 5 cards, and `collection: 'edx-maths-1'`. |
| How do the lessons get into MongoDB? | JSON files you paste in | Nothing was written to the database. See [section 3](#3-loading-the-rewritten-lessons). |
| Old lesson progress? | Start fresh | A student's old-format progress is replaced with new progress the next time they open that lesson. |
| What does Reset clear? | The current part | Every task in the part on screen, after a confirm. Other parts keep their progress. |
| What does Solution fill in? | The open task | One task at a time. |
| Which parts get the placeholder video? | Every part | `video` on every part is the home page's Wistia video for now. |

---

## 3. Loading the rewritten lessons

The files are in [lesson-examples/](lesson-examples/), one per lesson:

| File | Lesson | Parts | Tasks | Review cards |
|---|---|---|---|---|
| `01-welcome-to-the-laws-of-indices.json` | The Laws of Indices I | 5 | 15 | 6 |
| `02-negative-and-fractional-indices.json` | The Laws of Indices II | 4 | 12 | 6 |
| `03-introduction-to-surds.json` | Introduction to Surds | 3 | 9 | 6 |
| `04-quadratic-graphs.json` | Quadratic Graphs | 4 | 17 | 6 |
| `05-first-principles.json` | First Principles | 3 | 8 | 5 |

**For each file:** in MongoDB Compass, open `RootMath` → `lesson-data`, find the document with that `slug`, switch to the JSON view and replace its contents with the file, **keeping the `_id` line**. Alternatively, delete the old document and use **Add Data → Insert Document**. The page looks lessons up by `slug`, so there must be only one document per slug.

**The duplicate:** `lesson-data` also has `quadratics-graphs` (with an s), an older copy of `quadratic-graphs` with fewer fields. No course page links to it. I didn't rewrite it, so you can delete it.

**Nothing else is needed.** The new code is already in place, and each lesson switches to the new page as soon as its document has `schemaVersion: 2`.

---

## 4. The lesson format

```js
{
  slug: 'introduction-to-surds',          // URL slug and lookup key. Must be unique.
  title: 'Introduction to Surds',
  next: 'rationalising-the-denominator',  // shown as "Next lesson" at the end, if that lesson exists
  collection: 'edx-maths-1',              // the course; progress goes in '<collection>-lesson-progress'
  schemaVersion: 2,                       // marks the tasks format (otherwise the old page is used)
  parts: [{
    id: 2,                                // stable: progress is keyed by part id + task id
    title: 'Multiplying Surds',
    video: 'https://….wistia.com/medias/…',  // optional: shows the 🎥 button
    blocks: [blocks],                     // the teaching text (BlockRenderer blocks, $maths$)
    tasks: [Task, ...],                   // may be empty: the student just presses Next
  }],
  review: [Card, ...],                    // lesson flashcards, same format as question cards
}
```

**A task is a question part plus a title and instructions:**

```js
{
  id: 'multiply-1',            // unique within the part, never reused for a different task
  type: 'answer',              // any question part type
  title: "Let's jump right into it!",       // left-hand task box heading
  instructions: 'Fill in the box, then press Submit.',  // left-hand task box text
  prompt: 'Simplify $\\sqrt{108} - \\sqrt{27}$.',      // shown with the task in the centre
  hint: [blocks],              // shown in the left-hand task box
  solution: [blocks],          // shown in Feedback after revealing
  modelAnswer: {...},          // what Solution fills in (needed for sketch / working / explain)
  ...the part type's own fields (template + blanks, options, lines, keyPoints, markScheme, …)
}
```

Every field is described in [question-parts.md section 5](question-parts.md#5-the-seven-part-types). Two things were added for lessons, and both also work in questions:

- **`shape: 'up' | 'down'` on `sketch`** checks the curve opens upwards (∪) or downwards (∩), for one extra mark. That allows tasks like "sketch any quadratic with $a > 0$", with no fixed points. Optional `shapeFeedback`.
- **`modelAnswer`**: the response Solution fills in. For `answer`, `choice`, `order` and `place` it's worked out from the answer key ([solutions.js](../marking/solutions.js)), so you only need it for `sketch` (`{ points: [{x, y}] }`, the `degree + 1` handles) and `working` / `explain` (`{ latex: '\\displaylines{line 1\\\\line 2}' }`).

**`exactForm: true`** on a blank matters a lot in lessons. Most tasks say "simplify", and without it Compute Engine would accept the question typed back in (e.g. `x^3x^4x^5` for `x^{12}`). With it, `x^{12}` is accepted and `x^3x^4x^5` isn't. Compute Engine still evaluates purely numeric expressions, so for something like "$(7^2)^3$ as a power of 7" the tasks ask for the power only (`7^{\placeholder[p]{}}`). It accepts reordered sums but not always reordered products, so list equivalent forms in `accept` (e.g. `18xy` and `18yx`).

---

## 5. What the student sees

| Where | What |
|---|---|
| **Left** | "Part 2 of 3", the part title, the teaching text, then **Your tasks**: one box per task with its title, instructions, an icon (✓ correct, eye = revealed, ✗ wrong, – partly right, ○ not answered, lock) and a **Hint** button. The open task's box has a teal border. **Back** / **Next** (**Finish** on the last part) at the bottom. |
| **Centre** | Each task: "Task n", its prompt, an image if it has one, and its answer area. The open task has a teal border; later tasks are greyed out ("Finish the task above to unlock this one"). After marking, the left edge turns green, amber or red, with "Correct", "Partly correct: see Feedback" or "Not quite: see Feedback". Revealed tasks are teal. Below: **Save** (with "Saved" / "Unsaved changes"), **Submit**, **Reset**, **Solution**. |
| **Right** | **Feedback**: a card per task with its marks and the marker's feedback, or for a revealed task, "You revealed the solution…" and the worked solution. It switches to this tab whenever a task is marked or revealed. **Your Notes** and **Comments**: unchanged. **Review · n**: the lesson's flashcards. |
| **Top right** | "Are you a visual learner? Watch a video for this part →" and the 🎥 button, on parts with a `video`. |

**Rules:**
- **Submit** marks the open task. If it's correct it locks, the next task opens, and its answer can't be changed until Reset.
- If you change an answer after it's marked but before it's correct, the status says "Changed since marking: submit again".
- **Solution** shows the "Have another go first?" pop-up. **Reveal solution anyway** fills the open task in, marks it Revealed, opens the next task, and shows the worked solution in Feedback.
- **Reset** asks "Clear every task in this part?" and clears the part back to task 1.
- **Next** says "Finish every task in this part before moving on" until they're all done.
- **Finishing the lesson** (the save that completes the last task) shows "Lesson complete! Its review cards are now unlocked in the Review tab", plus a **Next lesson** link if that lesson exists. **Finish** on the last part shows the same.
- **Links:** `?tab=review` opens the lesson on its Review tab. The reviews page links there.
- All pop-ups and alerts appear with no animation.

---

## 6. How it fits together

```
/learn/<course>/<chapter>/<slug>  (page.js)
   │  useGetLessonQuery(slug)  ─►  GET /api/lesson/<slug>
   │      Clerk auth() → lesson from lesson-data
   │      old format? → { legacy: true } → LegacyLessonPage (the original page, unchanged)
   │      progress from <collection>-lesson-progress (fresh if missing or old-format)
   │      ◄─ { lesson: toClientLesson(...) (answer keys + review cards removed), progress, nextLesson }
   ▼
LessonView ─ progress in Zustand (useLessonProgressStore)
   │  typing / dragging ─► setTaskEntry('<partId>:<taskId>', { response }) ─► autosave after 1.5 s
   │                                                       ─► POST /api/lesson/<slug>/progress
   │  Submit   ─► POST /api/lesson/<slug>/mark { partId, taskId, response }  ─► markQuestion() ─► { result }
   │  Solution ─► POST /api/lesson/<slug>/solution { partId, taskId }       ─► { response, solution }
   │  Reset    ─► clear the part's entries ─► save
   │  Next / Back ─► currentPart ─► save
   ▼
POST /api/lesson/<slug>/progress  ─ the student from auth(), `completed` worked out from the lesson
   ◄─ { completed, newlyCompleted }  (newlyCompleted refreshes the Review tab → cards unlock)
```

**The progress document** (`edx-maths-1-lesson-progress`, one per student per lesson, unique on `{ userId, lessonSlug }`):

```js
{ userId, lessonSlug, schemaVersion: 2,
  currentPart: 1,                          // index of the part they were last on
  tasks: {
    '2:multiply-1': { response, result, markedResponse },        // marked
    '2:multiply-2': { response, markedResponse, revealed: true, solution: [blocks] },  // revealed
  },
  completed: true, completedAt, createdAt, updatedAt }
```

Tasks are keyed by `partId:taskId`, not by position, so reordering or adding tasks can't attach an answer to the wrong task. The Skill Radar already reads `completed` and `updatedAt` from this collection: opening a lesson makes it "In progress" there, and completing it makes it "Complete".

**What's different from questions:** every lesson route uses Clerk's `auth()` for the student, never an id from the request. Lesson progress is saved for every student, whatever their exam board; before, it was only saved when `examBoard` was `edexcel`.

**MyTutor** still reads `lesson` and `tasks` from the old `useLessonStore`. LessonView keeps them filled with the sanitised lesson and the current part's tasks.

---

## 7. Review cards

- **Stored** in the lesson document's `review` array, in exactly the same card format as questions ([question-reviews.md section 3](question-reviews.md#3-the-card-format)): `flip`, `answer`, `choice` or `order`.
- **Keys:** a lesson card's schedule is a normal `reviewStates` document with `cardKey: 'lesson:<slug>#<card id>'` and `source: { kind: 'lesson', slug }`. The existing check and rate routes recognise the `lesson:` prefix and load the card from the lesson.
- **Unlocking:** `GET /api/reviews/lesson/<slug>` creates the schedules (due today) once the lesson's progress is `completed`. Once a student has schedules, the cards stay unlocked, even after a Reset.
- **Random order:** the Review tab shuffles the cards for every session, so they don't follow the order of the parts.
- **Reviews page:** the **Lessons** tab lists lessons with cards due. It has the same year, course and skill filters as questions, and links to the lesson's Review tab. A lesson's chapter (for its link and its Skill Radar skill) comes from the course's chapter collection. The nav count and the Skill Radar box count lessons too ("8 reviews due: 3 questions · 5 lessons").

---

## 8. Files

### Created

| File | What it does |
|---|---|
| [lessons/progress.js](../lessons/progress.js) | The rules, shared by the page and the server: task keys, which task is open or locked, done (correct or revealed), part done, lesson complete, fresh progress. |
| [lessons/sanitize.js](../lessons/sanitize.js) | `toClientLesson`: each task sanitised like a question part, review cards removed. |
| [lessons/links.js](../lessons/links.js) | A lesson's chapter, URL and Skill Radar skill. |
| [lessons/server.js](../lessons/server.js) | Shared lookups for the lesson API routes. |
| [marking/solutions.js](../marking/solutions.js) | `solutionResponse(part)`: the correct response for any part type (used by Solution). |
| [api/lesson/[slug]/route.js](../../app/api/lesson/%5Bslug%5D/route.js), `mark/`, `solution/`, `progress/` | The four lesson routes. |
| [api/reviews/lesson/[slug]/route.js](../../app/api/reviews/lesson/%5Bslug%5D/route.js) | A lesson's review cards. |
| [lessons/tasks/LessonView.js](../components/learn/lessons/tasks/LessonView.js) | The page: state, autosave, Submit, Reset, Solution, navigation, video. |
| [lessons/tasks/LessonInstructions.js](../components/learn/lessons/tasks/LessonInstructions.js), [LessonTasks.js](../components/learn/lessons/tasks/LessonTasks.js), [LessonFeedback.js](../components/learn/lessons/tasks/LessonFeedback.js) | The left, centre and right panes. |
| [lessons/LegacyLessonPage.js](../components/learn/lessons/LegacyLessonPage.js) | The original lesson page, moved here unchanged, for old-format lessons. |
| [zustand/providers/lesson-progress-provider.ts](../zustand/providers/lesson-progress-provider.ts) | The lesson progress store. |
| [lesson-examples/*.json](lesson-examples/) | The five rewritten lessons. |

### Changed

| File | Change |
|---|---|
| `[lessonDisplay]/page.js` | Now just loads the lesson and picks LessonView or the old page. |
| [marking/deterministic.js](../marking/deterministic.js), [marking/sanitize.js](../marking/sanitize.js) | The sketch `shape` check; `shape`, `shapeFeedback` and `modelAnswer` are never sent to the browser. |
| [parts/PartRenderer.js](../components/questions/parts/PartRenderer.js) | Exports `BODIES` and `STATUS_COLOURS` for the lesson tasks. |
| [reviews/ReviewPane.js](../components/questions/reviews/ReviewPane.js) | `lessonSlug` prop: lesson cards, shuffled sessions, lesson wording. |
| [reviews/cards.js](../reviews/cards.js), [reviews/server.js](../reviews/server.js), [reviews/scheduler.js](../reviews/scheduler.js) | The `lesson:<slug>` card keys and a `source` for new schedules. |
| [reviews/due.js](../reviews/due.js), [api/reviews/due/route.js](../../app/api/reviews/due/route.js) | Lesson entries alongside questions. |
| [learn/reviews/page.js](../../app/%28authenticated%29/learn/reviews/page.js), [skill-radar/page.js](../../app/%28authenticated%29/learn/skill-radar/page.js), [LearnNav.js](../components/learn/LearnNav.js) | The Lessons tab, and lesson counts. |
| [redux/slices/apiSlice.js](../redux/slices/apiSlice.js) | `getLesson`, `markLessonTask`, `getLessonSolution`, `saveLessonProgress`, `getLessonReviews`. |
| [mongodb/utils.js](../mongodb/utils.js) | `getLessonBySlug`, `getLessonSummaries`, `getLessonProgressDoc`, `saveLessonProgressDoc`. |

---

## 9. Fixes made to the lesson content

### The Laws of Indices I
- **Law 2, task 1:** the old AI marking note said the answer was $7^2$. It's $x^2$.
- **Law 2, task 2:** the hint said $e^{6x}$; the question has $e^{7x}$.
- **Law 4, task 1:** the old marking note said $5^3 \cdot 3^3$. Since $9^3 = 3^6$, it's $5^3 \cdot 3^6$.
- **Law 1, task 3:** the marking note had the typo `x*4` for $x^4$.
- **Law 1, task 4:** the hint gave the answer away. It now explains the method instead.
- **Law 3, task 1** asks for the power ($7^{\square}$) rather than the whole answer, because a box that took the whole answer would accept $(7^2)^3$ typed back in.
- **Part 1:** removed the placeholder image `/images/features.png` (captioned "Test image").
- **Wording:** "reprsent", "indice" → "index", $a^m * a^n$ → $a^m \cdot a^n$, "the base's", "just just", "you simply, multiply", "undertanding then" → "understanding than", and Law 4's first sentence (it described multiplying "two bases of the different powers").

### The Laws of Indices II
- **Part 1:** $x^{\frac14} \cdot x^{\frac14} \cdot x^{\frac14} \cdot x^{\frac14} = x^1 = 1$ said "= 1". It's $x$.
- **Part 1's only task** was "read the notes in the editor and press Submit". The notes are now teaching text under "What's a square root?", and the part has no tasks.
- **Fractional indices, example 1:** stray `\cdot =` removed.
- **Combining, task 4:** the power was missing. The old answer only works for $\left(\dots\right)^{-\frac{2}{3}}$, so that power is now in the question.
- **Wording:** "lesosn", "expononent", "Before, we dive in", "a integer", "irrational,another", "application of of", "all were doing".

### Introduction to Surds
- **Rendering:** $\sqrt 17$, $\sqrt ab$, $\sqrt \frac{a}{b}$ and $\sqrt 15$ displayed as $\sqrt{1}7$, $\sqrt{a}b$ and so on. They now have braces.
- **Multiplying, task 2 is a new question.** The old one couldn't be completed: $(x\sqrt3+4\sqrt5)(x\sqrt4+4\sqrt3)$ expands to $\dots + 16\sqrt{15}$, not $+80$, and it used $\sqrt4$. The new one is $(x\sqrt{3}+4\sqrt{5})(x\sqrt{3}+2\sqrt{5}) = 3x^2 + 6x\sqrt{15} + 40$, in the same style.
- **Multiplying, task 5:** the hint said "no hints… after 3 incorrect submits the solution will be revealed", which isn't how it works. It now has a real hint.
- **Dividing, tasks 3 and 4:** the denominators are now fixed ($2\cdot\frac{\sqrt{\square}}{\sqrt{2}}$ and $\frac{\square}{\sqrt{3}}$). With two free boxes, many pairs were correct (e.g. $\frac{24}{\sqrt{12}}$), but each box is marked on its own.
- **Part 1** ends with the old part's note ("remember $\sqrt{x} = x^{\frac12}$") and "press Next".
- **Wording:** "exammple", "an examples of a surds", "neither 8 or 11".

### Quadratic Graphs
- **Sketching, task 2:** the instructions said $4x^2-2x+2$ and the hint said "no real roots". The curve is $4x^2-2x-2$ (as the title and marking said), with roots $-\frac12$ and $1$. Both are fixed.
- **Match the graph:** $y=\left(x-\frac52\right)+\frac{11}{4}$ was missing the $^2$. Checked against `true.png`: turning point $(2.5, 2.75)$, y-intercept 9.
- **Part 3:** $x^2-4x+42$ → $x^2-4x+4$.
- **Part 4:** "if the expression is $x^2-4x+2$, the y-intercept is $(0,4)$" → $(0,2)$.
- **Part 3** repeated part 2's two paragraphs about the shape word for word. They're now captions saying both curves have two roots.
- **Part 2** said "complete the two tasks below"; there are five.
- **Part 2, task 4** had a leftover, unrelated question: "Which of the following is a quadratic function?". It's removed.
- **Sketching, old task 4** (three steps in one) is now three tasks: find $h$ and $k$, find $a$, then sketch.
- The "any positive / negative quadratic" sketches use the new `shape` check.
- **Images:** alt texts like "Test Image 2" are replaced. The links to `Determine-quadratic.png` and `Show-no-real-roots.png` now match the files' capital letters: the old lowercase links only worked on a Mac.

### First Principles
- No errors found. 8 new tasks: what first principles means, constant gradient, tangent vs chord, a chord's gradient, ordering the derivation (with two distractors), a difference quotient, taking the limit, and a full derivation for $x^2 + 4x$ (`working`). The document didn't have `collection`; it's now `edx-maths-1`.

---

## 10. Testing

**Verified** (998 automated checks against the real marking, sanitising and progress code, all passing):
- **Every task's Solution answer marks fully correct**, including the sketches' model curves and the simulated marking of the model working.
- **Wrong answers are wrong:**
  - zeros in every box;
  - for every single-box "simplify" task, typing the question back in;
  - a wrong option for every choice task;
  - the reversed order for the order task;
  - a flipped curve for every sketch.
- **Every `accept` alternative** really matches.
- **Every piece of maths** in the lessons (text, hints, solutions, options, cards) renders in KaTeX.
- **Every image** a task uses exists in `public/Images`.
- **Nothing that gives answers away reaches the browser:** no `blanks`, `correct`, `why`, `modelAnswer`, `keyPoints`, `shape`, `distractors`, `llm` or review cards.
- **Review cards:** every auto-marked card checks right and wrong, and no card leaks its answer.
- **Progress rules:**
  - task 1 open and the rest locked;
  - correct unlocks the next task;
  - incorrect keeps the task open;
  - revealed counts as done;
  - editing after marking makes a task stale, not done;
  - the lesson is complete only when every task is done.
- **Reviews page entries:** the right link, course and skill for Surds (Algebra) and First Principles (Differentiation).
- **Lint** is clean on all new code. The moved legacy page has the same warnings it had before.
- **On your dev server:** the lesson page compiles (200), and all five lesson routes return 401 when signed out.

**Not verified: please click through** (I couldn't sign in as you). Paste in at least `03-introduction-to-surds.json`, then:
1. Answer task 1 wrongly and Submit: red edge, ✗ on the left, feedback in the right pane. Then answer correctly: green, locked, task 2 opens.
2. Type in task 2, wait for "Saved", refresh: your answer comes back and you're on the same part.
3. **Solution** → **Keep trying** does nothing; **Reveal solution anyway** fills the boxes and shows the working in Feedback.
4. **Reset**, **Next** before finishing (blocked), **Back**.
5. Finish the lesson: "Lesson complete!", then the **Review** tab has cards, and **REVIEWS · n** and `/learn/reviews` → Lessons show it.
6. The 🎥 button plays the video; the Quadratic Graphs sketches and image choices; the First Principles order and working tasks.
7. An old-format lesson (before you paste it in) still looks as it did.

---

## 11. Known limitations and next steps

- **Results are saved from the browser**, as with questions: the progress route trusts the `result`s it's sent (it does work out `completed` itself). A student who edits requests could mark their own tasks correct. It only affects their own progress. If that matters later, save each result on the server in the mark route instead.
- **Lessons still don't count towards Skill Radar mastery** (see [skill-radar.md](skill-radar.md) section 12, item 2). They only appear in its lesson lists.
- **Notes and Comments** are unchanged: notes aren't saved, and Comments has no content.
- **Every part's video is the placeholder.** Replace each part's `video` URL as you record them, or remove the field to hide the button.
- **Once every lesson is in the new format**, these can be deleted:
  - `LegacyLessonPage.js` and `LessonMathDisplay.js`;
  - the old `taskTypes/` components;
  - `lesson-task-provider.ts`;
  - `/api/lessontasks` and `/api/lessons/[collection]/[lessonContent]/[lessonData]`;
  - the FastAPI `/lesson-feedback` endpoints.
- **`working` tasks are simulated** until `FASTAPI_MARKING=live`, the same as questions.
- **`public/Images` vs `/images/...`**: still only works on a Mac (see [question-parts.md section 10](question-parts.md#10-problems-found-in-your-existing-questions)).
