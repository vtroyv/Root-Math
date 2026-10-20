# Parts-based questions: build report

What was built on 12 October 2026, how it works, how to add content, and what's left.
The earlier walkthrough of the old system is in [question-display.md](question-display.md).

---

## Contents

1. [Summary](#1-summary)
2. [Decisions](#2-decisions)
3. [How to try it now](#3-how-to-try-it-now)
4. [The schema](#4-the-schema)
5. [The seven part types](#5-the-seven-part-types)
6. [How it works end to end](#6-how-it-works-end-to-end)
7. [FastAPI / LLM marking contract](#7-fastapi--llm-marking-contract)
8. [Files created and changed](#8-files-created-and-changed)
9. [Testing: what was and wasn't verified](#9-testing-what-was-and-wasnt-verified)
10. [Problems found in your existing questions](#10-problems-found-in-your-existing-questions)
11. [Known limitations and next steps](#11-known-limitations-and-next-steps)

---

## 1. Summary

- **One question format.** Every question is now a list of `parts`. A single-part question is just a list of one. Any part can have an `image`, a `hint` and a `solution`.
- **Seven part types:**
  - `working`: multi-line maths, LLM marked
  - `explain`: text and maths, LLM marked
  - `answer`: fill in the blanks, marked exactly
  - `choice`: multiple choice
  - `sketch`: freehand curve
  - `order`: put the steps in order (new)
  - `place`: drag points and vectors on a grid (new)
- **One Submit** marks every part through a new `/api/mark` route. Results and feedback appear under each part and in the Feedback tab, and correct parts lock.
- **Save, Reset and Next now work.** Answers autosave 1.5 s after you stop typing. Reset clears answers but keeps your attempt history. Next lists your real questions from the database, same topic first.
- **Answer keys never reach the browser** for auto-marked parts. The server re-reads the question from MongoDB to mark.
- **LLM marking is simulated** until your FastAPI endpoint exists (section 7). Everything else is marked for real.
- **8 example questions** are ready to paste in: your 4 existing questions migrated, plus 4 new ones that between them use every part type.
- **Old questions still work.** Any document without `parts` renders exactly as before.

---

## 2. Decisions

| Question | Your answer | What that meant |
|---|---|---|
| Where should marking run? | Keep FastAPI, simulate the LLM for now | `working`/`explain` go through `markWithLLM()`, which returns a simulated response unless `FASTAPI_MARKING=live`. Deterministic parts (`answer`, `choice`, `order`, `place`, `sketch`) are marked in Next.js, because none of them need an LLM (see the note below). |
| Extra types today? | Place points/vectors, Order the steps | Both built. |
| Existing questions? | Migrate + keep old | Migrated JSON for all 4. Old components untouched. |

**Note on sketch marking.** Your old sketch questions were marked by FastAPI `/sketch/feedback`. The new `sketch` part is marked in Next.js instead (in [deterministic.js](../marking/deterministic.js), `markSketch`), because the data it needs is all in the question document. If you'd rather keep it in Python, change the `sketch` entry in `MARKERS` in [marking/index.js](../marking/index.js) to forward like `llm.js` does.

---

## 3. How to try it now

The example questions are in [question-examples/](question-examples/), one JSON file per question.

**To add a new question (05–08):** in MongoDB Compass, open `RootMath` → `quizzes` → **Add Data → Insert Document**, paste the whole file contents, and insert. MongoDB adds the `_id`.

**To migrate an existing question (01–04):** the page looks questions up by `title`, so there must only be one document per title. Either:
- delete the old document and insert the new file, or
- open the old document in Compass, switch to the JSON view, and replace its contents with the file, keeping the `_id` line.

The original versions are in your chat history if you want to roll back.

**Old progress documents.** Progress for those 4 questions was saved in the old shape (`userLatex`, `coordinates`). The new UI ignores those fields, so they're harmless. But the question will show your old `attempts` and `status`. For a clean test, delete your document for that title from `edexcel-questions-pure-y1-progress`.

Then open `/learn/questions/<title>`, for example `/learn/questions/Vectors-On-The-Grid`.

| File | Title | Parts |
|---|---|---|
| 01 | Advanced-Simplification-of-Indices-with-Multiple-Bases | choice |
| 02 | Sum-Product-inequality-proof | working |
| 03 | Sketch-the-Quadratic-I | sketch |
| 04 | Cube-It-Or-Lose-It | answer (with image), sketch, explain |
| 05 | Completing-the-Square-Exam-Style | working, answer, sketch, choice |
| 06 | Vectors-On-The-Grid | place (vector), place (point), answer |
| 07 | Consecutive-Odd-Numbers-Proof | order (with distractors), answer |
| 08 | Exact-Exponential-Equation | answer |

---

## 4. The schema

### Question document (`quizzes` collection)

```js
{
  title: 'Completing-the-Square-Exam-Style',  // URL slug and lookup key. Must be unique.
  type: 'combination',                         // informational: the page switches on `parts`, not `type`
  schemaVersion: 2,                            // informational, for future migrations
  topic: 'Algebra and Functions',
  difficulty: 'Exam',
  branch: 'pure',                              // with year + the student's examBoard, picks the progress collection
  examBoard: 'all',
  year: '12',

  stem: [blocks],                              // optional shared context shown above all parts
  parts: [Part, ...],                          // required: at least one part

  details: {                                   // optional: overrides for the right-hand pane
    instructions: [blocks],                    //   default: generic instructions
    solution: [blocks],                        //   default: built from each part's `solution`
    markScheme: [blocks],                      //   default: built from each part's `markScheme`
  },

  review: [Card, ...],                         // optional: review flashcards, see question-reviews.md
}
```

The `review` cards are never sent with the question. They're served separately by `/api/reviews`, with answer keys removed. Format, writing rules and scheduling: [question-reviews.md](question-reviews.md).

"Blocks" are the same format your lessons use (`BlockRenderer`): `heading`, `paragraph`, `bold-paragraph`, `bullet-points`, `image`, `accordion`, `table`. Text goes through KaTeX, so use `$...$` and `$$...$$`.

### Fields every part can have

```js
{
  type: 'working' | 'explain' | 'answer' | 'choice' | 'order' | 'place' | 'sketch',
  label: '(a)',            // optional. Multi-part questions without labels show "Part 1", "Part 2"
  prompt: 'Find ... $x$',  // text with $maths$
  marks: 3,                // optional, see the default for each type below
  image: { url: '/images/x.png', alt: '...', width: 600, height: 400 },  // optional
  hint: [blocks],          // optional, shown in a collapsible "Hint" under the part
  solution: [blocks],      // optional, shown in the Model Solution tab after 3 attempts or when complete
}
```

### Writing JSON for Compass

Every LaTeX backslash is doubled in JSON: `\frac` is written `"\\frac"`, and a LaTeX line break `\\` is written `"\\\\"`. A single backslash before `b`, `f`, `n`, `r` or `t` silently becomes a control character. That's what broke your old sketch feedback (section 10).

---

## 5. The seven part types

Each type below gives: what the student does, the fields it needs, what's saved as their response, and how it's marked.

### `working`: multi-line maths (LLM)

The student writes working line by line in a MathLive field. Enter adds a new line.

```js
{ type: 'working', prompt: '...',
  markScheme: [{ code: 'M1', marks: 1, text: 'Takes out the factor of 2' }, ...],
  starter: '...',                // optional LaTeX to pre-fill the box
  llm: { context: '...' } }      // optional extra instructions for the marker, never sent to the browser
```

- **Marks default:** the sum of the `markScheme` marks.
- **Response:** `{ latex }`.
- **Marking:** [llm.js](../marking/llm.js), simulated for now.

### `explain`: written explanation (LLM)

Same as `working`, but the field starts in text mode. A "Text mode" checkbox lets students switch to maths and back.

### `answer`: fill in the blanks (exact)

The template is read-only LaTeX. Only the `\placeholder[id]{}` boxes are editable, which is MathLive's built-in fill-in-the-blank feature.

```js
{ type: 'answer',
  template: 'x = \\placeholder[x]{},\\quad y = \\placeholder[y]{}',
  blanks: {
    x: { answer: '-3',
         accept: ['...'],      // optional extra accepted answers
         exactForm: false,     // optional, see below
         tolerance: 0.01,      // optional numeric tolerance for decimals
         feedback: '...' }     // optional, shown when this blank is wrong
  } }
```

- **Marks default:** one per blank. Partial credit is proportional.
- **Response:** `{ blanks: { x: '-3' } }`.
- **Marking:** Compute Engine `isEqual`, so any mathematically equal answer is accepted. `2(x+1)` matches `2x+2`, `√8` matches `2√2`, `(-3,-5)` matches `\left(-3,-5\right)`, and `½ ln 5` matches `ln √5`.
  - Decimals only count if you set `tolerance`. Without it, `0.8047` is **not** accepted for `½ ln 5`, which is right for "exact form" questions.
  - Set `exactForm: true` when the form matters. For example, with `answer: '2^9'` the answer `512` is rejected.
  - If a student types `b = 12` into a box whose answer is `12`, only the part after `=` is compared.
- **After marking:** boxes turn green and lock, or turn red until the student edits them.

### `choice`: multiple choice

```js
{ type: 'choice',
  options: [{ id: 'A', content: '$2^9$', correct: true,
              why: 'Shown if picked',     // optional
              image: {...} }],            // optional
  multiple: false }                       // optional; true automatically if more than one option is correct
```

- **Marks default:** 1, all or nothing.
- **Response:** `{ selected: ['A'] }`.
- **After marking:** the chosen option goes green or red, and its `why` text is shown as feedback. This is a good place to explain the misconception behind each wrong answer.

### `order`: put the steps in order (new)

```js
{ type: 'order',
  lines: ['first step', 'second step', ...],   // authored IN THE CORRECT ORDER
  distractors: ['plausible wrong line', ...] }  // optional
```

- The server shuffles `lines` and `distractors` together, with a fixed shuffle per question so it's the same on every reload. Each line gets an id that doesn't reveal whether it's a distractor.
- Students add lines with **Add**, then reorder by dragging or with ↑ ↓, and remove with ✕.
- **Marks default:** 1. Partial credit is proportional to how many positions are correct, and a partly right order never gets full marks.
- **Response:** `{ sequence: [lineId, ...] }`.
- **Feedback:** says how many lines are in the right place, whether a line doesn't belong, and whether steps are missing.
- **Keep each line's text unique within a part.** The line id is a hash of its text.

### `place`: drag points and vectors (new)

```js
{ type: 'place',
  boundingBox: [-6, 6, 6, -6],   // [xMin, yMax, xMax, yMin]
  snap: 1,                       // optional grid step (1, 0.5, ...)
  tolerance: 0.1,                // optional, default 0.1
  given: [                       // fixed grey reference objects
    { kind: 'vector', from: [0, 0], to: [2, 1], label: 'a' },
    { kind: 'point', at: [-2, 1], label: 'A' } ],
  objects: [                     // orange objects the student drags
    { kind: 'vector', label: 'a + b', start: { from: [-4, 4], to: [-2, 4] },
      answer: { components: [3, -2] },   // a free vector: any start point
      // or answer: { from: [..], to: [..] } for a fixed position
      feedback: '...' },
    { kind: 'point', label: 'M', start: [0, -4], answer: { at: [1, 2] } } ] }
```

- **Marks default:** one per object.
- **Response:** `{ objects: [{ from, to } | { at }] }`.
- **After marking:** each object turns green or red.

Make sure `start` isn't already a correct answer. A part only counts as answered once the student has dragged something.

### `sketch`: freehand curve

```js
{ type: 'sketch',
  degree: 3,                          // polynomial degree; the stroke becomes degree + 1 handles
  boundingBox: [-5, 5, 5, -5],
  keyPoints: [{ label: 'root at x = 1', x: 1, y: 0, threshold: 0.2,
                feedback: [blocks] }],   // optional; default "Check your <label>."
  correctFeedback: [blocks],             // optional
  handleLabels: ['P', 'Q', 'R'] }        // optional; default P1, P2, ...
```

- The student draws one stroke. It's simplified to `degree + 1` draggable handles, and a polynomial is drawn through them (same as before).
- **Marking changed.** Previously each handle had to be near a specific labelled point, which broke when the stroke order didn't match the label order. Now the server rebuilds the student's curve and checks it **passes within `threshold` of each key point**.
  - The handles don't have to sit on the roots.
  - Key points can be anything the curve should pass through: roots, intercepts, turning points.
- **Marks default:** one per key point.
- **Response:** `{ points: [{ x, y }] }`.
- **Limitation:** the curve is always a polynomial, so this suits quadratics and cubics, not exponentials, reciprocals or trig graphs (section 11).
- **Optional `shape: 'up' | 'down'`** (added 20 October 2026 for lessons): one extra mark for the curve opening upwards (∪) or downwards (∩), judged by the sign of its $x^{degree}$ coefficient. Lets a part ask for "any quadratic with $a > 0$" without key points. `shapeFeedback` overrides the default message.
- **`modelAnswer`** (any part, optional): the response the lesson Solution button fills in. Only needed for `sketch`, `working` and `explain`; see [lessons.md](lessons.md#4-the-lesson-format).

---

## 6. How it works end to end

```
page.js
  POST /api/questions/[title]  ─► question with answer keys stripped (sanitize.js)
                                   + progress document (created if new)
  question.parts exists?  ─► TwoPaneResponsive
                               left:  QuestionParts
                               right: Feedback, with details = partsDetails(question)

QuestionParts
  each part ─► PartRenderer (label, prompt, image, hint, result) ─► type body
  typing / dragging ─► setComponentProgressAt(i, { response }) in Zustand
                    ─► autosave after 1.5 s ─► POST /api/question-progress

  Submit ─► POST /api/mark { title, responses }
              server: auth() check → full question from Mongo → markQuestion()
                answer/choice/order/place/sketch → deterministic.js
                working/explain                  → llm.js (simulated or FastAPI)
           ◄─ { results[], marksAwarded, marksAvailable, status, feedback }
         ─► componentProgress[i] = { response, result, markedResponse }
            attempts + 1, status, marks, feedback.push(summary)
         ─► saved to Mongo
```

**Progress document after this change:**

```js
{ ...existing fields (userId, title, status, attempts, feedback, createdAt, updatedAt),
  marks: { awarded: 7, available: 10 },              // from the last attempt
  componentProgress: [
    { response: {...},          // the current answer for part i
      result: {                 // the latest marking of part i
        status: 'correct' | 'partial' | 'incorrect' | 'unanswered' | 'error',
        marksAwarded, marksAvailable, feedback: [blocks], details },
      markedResponse: {...} },  // the answer that `result` refers to
  ] }
```

**Stale results.** If a student changes a part after it was marked, its `response` no longer matches `markedResponse`. The old feedback stays visible with "(changed since marking, submit again)", but the red and green highlights and the lock are removed.

**Status** is `complete` only when every part is fully correct, so the Model Solution unlocks then or after 3 attempts, as before.

---

## 7. FastAPI / LLM marking contract

Controlled by two variables in `.env.local`:

```
FASTAPI_MARKING=live                 # leave unset to use the simulated marker
FASTAPI_URL=http://127.0.0.1:8000    # optional, this is the default
```

Restart `npm run dev` after changing them.

**Next.js calls `POST {FASTAPI_URL}/mark-part` once per `working`/`explain` part:**

```js
{
  question: { title, topic, stem },
  part: {
    label, type, prompt, marks,
    markScheme: [{ code, marks, text }],
    solution: [blocks],
    llm: { context },
  },
  response: {
    latex,     // exactly what the student typed in MathLive
    lines,     // the same LaTeX split into lines (preprocessLatex)
  },
}
```

**FastAPI must return:**

```js
{
  marksAwarded: 3,
  marks: [{ code: 'M1', awarded: true, reason: 'Correctly expanded (p+q)^2' }, ...],
  feedback: [blocks],   // BlockRenderer format
}
```

Next.js shows `feedback`, then a ✓/✗ list built from `marks`.

The **simulated** marker awards one mark-scheme point per line of working and labels its feedback "Simulated feedback", so partial and full marks can both be tested in the UI. As discussed, this sends the **raw LaTeX** rather than SymPy strings. Your Python side can call SymPy as a checking tool if it wants.

If FastAPI errors, that part shows "This part couldn't be marked right now" and the other parts are still marked.

---

## 8. Files created and changed

### Created

| File | What it is |
|---|---|
| [marking/index.js](../marking/index.js) | `markQuestion()`: marks all parts, builds the summary feedback |
| [marking/deterministic.js](../marking/deterministic.js) | Markers for `answer`, `choice`, `order`, `place`, `sketch` |
| [marking/llm.js](../marking/llm.js) | `working`/`explain` marking: simulated, or forwarded to FastAPI |
| [marking/sanitize.js](../marking/sanitize.js) | Strips answer keys before a question is sent to the browser; default marks |
| [marking/ids.js](../marking/ids.js) | Stable ids and seeded shuffle for `order` lines |
| [app/api/mark/route.js](../../app/api/mark/route.js) | `POST /api/mark`, requires a signed-in Clerk user |
| [parts/QuestionParts.js](../components/questions/parts/QuestionParts.js) | The container: stem, parts, Save/Submit/Reset/Next, autosave |
| [parts/PartRenderer.js](../components/questions/parts/PartRenderer.js) | Shared wrapper: label, prompt, image, hint, result |
| [parts/MathInputPart.js](../components/questions/parts/MathInputPart.js) | `working` + `explain` |
| [parts/AnswerPart.js](../components/questions/parts/AnswerPart.js) | `answer` |
| [parts/ChoicePart.js](../components/questions/parts/ChoicePart.js) | `choice` |
| [parts/OrderPart.js](../components/questions/parts/OrderPart.js) | `order` |
| [parts/PlacePart.js](../components/questions/parts/PlacePart.js) | `place` |
| [parts/SketchPart.js](../components/questions/parts/SketchPart.js) | `sketch` |
| [parts/loadJSXGraph.js](../components/questions/parts/loadJSXGraph.js) | Loads JSXGraph once per page, pinned to 1.11.1 |
| [parts/partsDetails.js](../components/questions/parts/partsDetails.js) | Builds Instructions / Solution / Mark Scheme for the right pane |
| [question-examples/*.json](question-examples/) | The 8 example questions |

### Changed

| File | Change |
|---|---|
| [questions/[title]/page.js](../../app/%28authenticated%29/learn/questions/%5Btitle%5D/page.js) | Renders `parts` questions through `QuestionParts`. Store selector instead of whole-store subscription. Logs the real error. |
| [api/questions/[title]/route.js](../../app/api/questions/%5Btitle%5D/route.js), [api/questions/route.js](../../app/api/questions/route.js) | Pass questions through `toClientQuestion` (no effect on old-format documents) |
| [redux/slices/apiSlice.js](../redux/slices/apiSlice.js) | Added `markQuestion` → `useMarkQuestionMutation` |
| [feedback/index.js](../components/questions/feedback/index.js) | Null-safe. Opens on Instructions and only switches to Feedback when new feedback arrives. |
| [feedback/questionFeedbackPane.js](../components/questions/feedback/questionFeedbackPane.js), [questionSolutionPane.js](../components/questions/feedback/questionSolutionPane.js) | Null-safe when progress is missing |
| `package.json`, `package-lock.json` | Added `@cortex-js/compute-engine@^0.24.1` as a direct dependency (it was already installed via MathLive) |

Old components (`NewFullResponse`, `Sketch`, `Selection`, old `Combination`) are untouched.

---

## 9. Testing: what was and wasn't verified

**Verified**
- **21 marking checks** against the 8 example files, run in Node, plus a check that `order` lines arrive shuffled. They test right, wrong, partly right and unanswered responses for every part type. All pass. They covered:
  - algebraic equivalence
  - exact form vs decimals
  - ordered pairs
  - free vectors
  - distractor detection in `order`
  - curve-distance sketch marking with handles that are not on the key points
- **Sanitiser check:** none of the 8 examples leak `correct`, `why`, `blanks`, answer values, `keyPoints`, `distractors`, `correctFeedback` or `llm` to the browser.
- **Compiled on your running dev server:**
  - `/api/mark` compiles and returns 401 when signed out.
  - The question page compiles with every part component.
  - `/api/questions` returns 200.
- **ESLint:** no warnings or errors in the new files.
- **API check:** every MathLive and JSXGraph method used was checked against the installed type definitions.

**Not verified: please click through these**

I couldn't log in as you, so the interactive UI hasn't been used in a browser yet. With the 8 examples inserted:

1. **06 Vectors:** drag the arrow ends (they should snap), drag M, type `\sqrt{13}`, then Submit. Everything should turn green and lock.
2. **04 Cube-It:** type into the b, c, d boxes, draw the cubic in one stroke and adjust the handles, write the explanation, then Submit. Check the image shows, and that (c) shows "Simulated feedback".
3. **07 Odd numbers:** Add lines, drag to reorder, use ↑ ↓ ✕, then Submit with a distractor included.
4. **Refresh mid-answer:** answers should come back. Watch "Saved" appear about 1.5 s after typing.
5. **Reset**, and **Next** (the drawer should list your real questions).
6. **An old-format question** still renders as before.
7. **Mobile width** (tabs view).

If anything misbehaves, the browser console logs a clear error.

---

## 10. Problems found in your existing questions

These are fixed in the migrated versions. The original documents in MongoDB still have them.

1. **Sum-Product proof: the statement is false.** It says `p + q > √(4pq)`, but when p = q both sides are equal. The migrated version says `≥`, which is what the solution proves.
2. **Sum-Product mark scheme:** the third point said `(p−q)² ≥ 4pq`. It should be `(p+q)² ≥ 4pq`. The solution also had `\bigr(`/`\bigl)` swapped.
3. **Sketch-the-Quadratic-I feedback** said `c = 1`. For y = −2x² + 6x − 1, `c = −1`.
4. **Sketch-the-Quadratic-I `all-correct` feedback** contains `$\bigl(` written with a single backslash in the database. `\b` was stored as an invisible backspace character, so those bullet points don't render. See the JSON note in section 4.
5. **Cube-It-Or-Lose-It** used the Sum-Product proof's `gpt-role-content` and `structured-output` (copy-paste). Part (c) also had `\end{algned}`. The migrated version has its own mark scheme for (c). Working from the image: f(x) = 3x(x+1)(x+3), so b = 12, c = 9, d = 0, and g(x) = −(x−2)(x−1)(x+1).
6. **Image folder case:** the folder is `public/Images` but every URL uses `/images/...`. That works on macOS because filenames aren't case-sensitive, but **images will 404 on Linux hosting such as Vercel**. Rename the folder to `public/images` before deploying.

---

## 11. Known limitations and next steps

- **Every Submit re-marks every part**, including ones already correct. That's fine while simulated, but once FastAPI calls a real LLM it costs a call per `working`/`explain` part per submit. A cheap fix is to send previously correct, unchanged parts' results back instead of re-marking them.
- **Sketch only fits polynomials.** For exponential, reciprocal or trig sketches, add a mode that marks key features (asymptotes, intercepts) or fits a different family.
- **Solutions and mark schemes are sent to the browser on purpose** (decided 12 October 2026). The Model Solution blur is a nudge, not a lock: a student who digs them out of the network tab is only cheating themselves. Answer keys for auto-marked parts are still stripped, so the marks saved to MongoDB always come from the server.
- **Other routes still trust `userId` from the request body** (`/api/questions/[title]`, `/api/question-progress`). `/api/mark` uses Clerk's `auth()`; the others should too.
- **Upgrade Next.js.** `npm install` currently fails a peer-dependency check: Clerk needs Next ≥ 14.2.25 and you have 14.2.7. I installed with `--legacy-peer-deps`, which changes nothing else. 14.2.25 is also the release that patched the Next.js middleware auth-bypass vulnerability (CVE-2025-29927), which matters once you protect routes in middleware.
- **Review cards:** built on 14 October. The `review: [...]` field holds each question's flashcards, shown in the Review tab. See [question-reviews.md](question-reviews.md).
- **Old components** (`NewFullResponse`, `Sketch`, `Selection`, old `Combination`, `FullResponse`, `Explain`, `FillInBlank`) can be deleted once every question has `parts`.
- **MyTutor** still can't see the question. `useQuestionStore.getState().userProgress.componentProgress` now has every part's live answer, ready to include in its prompt.
