# Question Display: how it works

A walkthrough of `/learn/questions/[title]` and everything it touches: providers, Clerk, Redux (RTK Query), Zustand, the API routes, MongoDB, every question type, the feedback panes and the LaTeX → SymPy grading pipeline.

Written October 2026, from the code on the `self-marking` branch.

---

## Contents

1. [The big picture](#1-the-big-picture)
2. [Providers and layouts](#2-providers-and-layouts-what-wraps-the-page)
3. [Clerk: identity and examBoard](#3-clerk-identity-and-examboard)
4. [Redux / RTK Query](#4-redux--rtk-query)
5. [Server side: route handlers and MongoDB](#5-server-side-route-handlers-and-mongodb)
6. [Zustand](#6-zustand)
7. [The page itself](#7-the-page-itself)
8. [The question types](#8-the-question-types)
9. [The right-hand pane (Feedback)](#9-the-right-hand-pane-feedback)
10. [MyTutor](#10-mytutor-shown-on-this-page-via-the-layout)
11. [Gotchas and bugs](#11-gotchas-and-bugs-youll-run-into)
12. [Where to start](#12-where-to-start)
13. [Reference: data shapes](#13-reference-data-shapes)

---

## 1. The big picture

```
Browser                                    Next.js server (route handlers)        External
───────                                    ────────────────────────────────        ────────
/learn/questions/sketch-the-quadratic-i
        │
 RootLayout: ClerkProvider → StoreProvider (Redux)
 LearnLayout: LearnNav, Breadcrumbs, MyTutor widget
        │
 QuestionDisplay (page.js)
   useUser()  ─────────────────────────── Clerk (who is logged in + examBoard)
   dynamicQuestionData() ── POST /api/questions/[title] ──► getSpecificQuestion  ─► MongoDB "RootMath"
                                                           getUserQuestionProgress    quizzes
                                                           createUserQuestionProgress <board>-questions-<branch>-y1|y2-progress
        │  {question, existingUserProgress}
   setProgress() ──► Zustand useQuestionStore (userProgress)
        │
   selectComponent(question.type)
        └─ TwoPaneResponsive
             ├─ left:  NewFullResponse | Selection | Sketch | Combination
             │          Submit ── POST /api/feedback or /api/feedback/sketch ──► FastAPI 127.0.0.1:8000
             │                  ── POST /api/question-progress ──► replaceOne in Mongo
             └─ right: Feedback (tabs: Instructions / Feedback / Solution / Notes / Comments / Review)
                        reads Zustand userProgress
```

Two things to keep in mind:

- **Grading isn't in this repo.** `/api/feedback`, `/api/feedback/sketch` and `/api/tutor/asktutor` just forward to a **Python FastAPI server on `127.0.0.1:8000`**. If that server isn't running, Submit fails.
- **There are two state systems.** Redux (RTK Query) only does network calls. Zustand holds the UI state that several components share.

---

## 2. Providers and layouts (what wraps the page)

**[app/layout.tsx](../../app/layout.tsx)**: the root layout.
- `<ClerkProvider>` wraps everything, so `useUser()` works anywhere.
- `<StoreProvider>` ([StoreProvider.js](../redux/StoreProvider.js)) creates the Redux store once per browser session using a `useRef`. That's the standard Next.js App Router pattern for Redux.
- Global CSS loads here: a Bootstrap theme, bootstrap-icons, KaTeX CSS, and `globals.css` last so your design system wins.

**[middleware.ts](../../middleware.ts)**: `clerkMiddleware()` with **no `auth.protect()`**. Clerk is attached to every request, but **no route is actually protected**. `/learn/...` is reachable while logged out (see the gotchas).

**[learn/layout.js](../../app/%28authenticated%29/learn/layout.js)**: wraps every `/learn/*` page with `LearnNav`, `Breadcrumbs` and the floating `MyTutor` chat widget. The `(authenticated)` folder is only a route group: it doesn't change the URL and has no layout or auth logic of its own.

**[questions/layout.js](../../app/%28authenticated%29/learn/questions/layout.js)**: just a `<section>`.

**How users get here:** [QuestionTable.js:145](../components/questions/QuestionTable.js#L145) links to `questions/${title with spaces→dashes}`. The URL slug **is the question's `title` field in Mongo** (e.g. `Sketch-the-Quadratic-I`). It's the lookup key, so titles must be unique and must match exactly.

---

## 3. Clerk: identity and examBoard

- `useUser()` returns `{ isLoaded, isSignedIn, user }`.
- `user.id` is the Clerk user ID. It's stored as `userId` on every progress document.
- `user.unsafeMetadata.examBoard` is set during sign-up at [sign-up/page.tsx:54](../../app/%28public%29/sign-up/page.tsx#L54) together with `year` and `school`. After email verification, the same data is also written to Mongo `users` through `/api/users`.
- `examBoard` decides **which Mongo collection your progress lives in** (section 5). Right now only `'edexcel'` really works.

"Unsafe" metadata means the user can edit it from the browser. That's fine for a preference, but it shouldn't be trusted for anything security-related.

---

## 4. Redux / RTK Query

File: [redux/slices/apiSlice.js](../redux/slices/apiSlice.js)

As the file's own comment says, Redux is now **only** a typed fetch layer. `baseUrl: '/api'`, and each endpoint becomes a hook:

| Hook | Call | Used by |
|---|---|---|
| `useDynamicQuestionDataMutation` | `POST /api/questions/:title` body `{userId, examBoard}` | **page.js**: loads question + progress |
| `useGradeQuestionMutation` | `POST /api/feedback` | NewFullResponse (and the old FullResponse) |
| `useGradeSketchQuestionMutation` | `POST /api/feedback/sketch` | Sketch |
| `useUpdateQuestionProgressMutation` | `POST /api/question-progress` | NewFullResponse, Sketch |
| `useGetQuestionsQuery` | `GET /api/questions?userId&examBoard` | QuestionTable (the list page) |
| `useAskTutorMutation` | `POST /api/tutor/asktutor` | MyTutor |
| `useUpdateQuestionNotesMutation`, `getQuestionNotes` | `/api/question-notes` | not wired up (the route is empty) |

Loading the question is a **mutation**, not a query, even though it's mostly a read. That's because it can also *create* a progress document. The trade-off is no caching, and the page uses `mutationState.isUninitialized` to mean "not fetched yet."

---

## 5. Server side: route handlers and MongoDB

### Connection: [mongodb/db.js](../mongodb/db.js)

This is the standard Next.js pattern. In development, one `MongoClient` promise is cached on `global` so hot reloads don't pile up connections. It needs `MONGODB_URI` in `.env.local`.

### Data access: [mongodb/utils.js](../mongodb/utils.js)

- `init()` connects to the database `RootMath` and sets `questions = db.collection('quizzes')`. So **questions live in the `quizzes` collection.**
- `getSpecificQuestion(title)`: `quizzes.findOne({ title })`.
- `identifyQuesProg({examBoard, branch, year})` at [utils.js:266](../mongodb/utils.js#L266) builds the progress collection name:
  ```
  `${examBoard}-questions-${branch}-${year == '12' ? 'y1' : 'y2'}-progress`
  e.g. "edexcel-questions-pure-y1-progress"
  ```
  So **`branch` and `year` on the question document** decide where its progress is stored.
- `getUserQuestionProgress`: `findOne({ userId, title })` in that collection.
- `createUserQuestionProgress`: ensures a unique index on `{userId, title}` and inserts. On a duplicate key error (`11000`, e.g. two tabs racing) it returns the existing document instead.
- `updateUserQuestionProgress({collectionIdentifier, progress})`: strips `_id` and does **`replaceOne({userId, title}, progress)`**. It replaces the whole document, so whatever the client sends is the new truth.

### [POST /api/questions/[title]](../../app/api/questions/%5Btitle%5D/route.js): the route this page depends on

1. Reads `{userId, examBoard}` from the body and `title` from the URL.
2. Fetches the question from `quizzes`.
3. Looks up progress. If there isn't any, it creates this starter document:
   ```js
   { title, status: 'Todo', feedback: [], userId, type: question.type,
     attempts: 0, createdAt, updatedAt }
   ```
4. Returns `{ question, existingUserProgress }`.

If the inner progress block throws, the error is only logged, and `existingUserProgress` comes back `undefined` with a 200 status.

### The other routes

- [POST /api/question-progress](../../app/api/question-progress/route.js): calls `updateUserQuestionProgress`.
- [POST /api/feedback](../../app/api/feedback/route.js): sends `{ sympy: body.sympyResponse, questionData }` to FastAPI `/feedback`.
- [POST /api/feedback/sketch](../../app/api/feedback/sketch/route.js): sends `{ reducedCoordinates, questionData }` to FastAPI `/sketch/feedback`.
- [POST /api/tutor/asktutor](../../app/api/tutor/asktutor/route.js): forwards to FastAPI `/ask-tutor`, but **ignores the response and returns the hard-coded string `'succss'`**.
- [/api/question-notes](../../app/api/question-notes/route.js): only comments, no handlers. Calls to it get a 405.

---

## 6. Zustand

File: [zustand/providers/question-state-provider.ts](../zustand/providers/question-state-provider.ts)

Despite the `providers` folder name, these are **plain global stores** created with `create()`, with no React Context. Any component that imports `useQuestionStore` sees the same store, and it persists across client-side navigation.

```js
userProgress: null                      // mirrors the Mongo progress document
setProgress(p)                          // replace the whole thing (page.js on load)
updateProgress(partial)                 // shallow merge into userProgress
setComponentProgressAt(index, patch)    // merge into userProgress.componentProgress[index] (Combination)
```

Fields that end up on `userProgress` depending on question type:

- **all types:** `title, status ('Todo' | 'incomplete' | 'complete'), feedback[], attempts, userId, type, ...`
- **fullResponse:** `userLatex`, the live contents of the answer box
- **sketch:** `coordinates: [{x, y, label}]`
- **combination:** `componentProgress: [{userLatex?, coordinates?}, ...]`, indexed by `block.index`

Two ways to read the store:

```js
const progress = useQuestionStore(s => s.userProgress)   // re-renders only when userProgress changes
const { updateProgress } = useQuestionStore()            // subscribes to EVERYTHING
```

The second store, [question-drawer-state-provider.ts](../zustand/providers/question-drawer-state-provider.ts), is just `isOpen/open/close/toggle` for the "Next question" side drawer. That lets the Next button and the drawer communicate without passing props.

---

## 7. The page itself

File: [app/(authenticated)/learn/questions/[title]/page.js](../../app/%28authenticated%29/learn/questions/%5Btitle%5D/page.js)

What happens over time:

1. **First render:** Clerk may not be loaded and the mutation hasn't fired, so `isUninitialized` is true and it shows **"Loading..."** ([line 110](../../app/%28authenticated%29/learn/questions/%5Btitle%5D/page.js#L110)).
2. **The effect runs** (deps `[user, isSignedIn]`, [line 94](../../app/%28authenticated%29/learn/questions/%5Btitle%5D/page.js#L94)). Once `isSignedIn`, it builds `{params, userId, examBoard}` and calls `dynamicQuestionData(...).unwrap()`. `.unwrap()` gives the raw payload or throws.
3. **On success:**
   - `setQuestion(question)` stores the question in local state.
   - `setUserProgress(...)` stores a local copy. It's redundant and only triggers a `console.log` effect.
   - `setProgress(existingUserProgress)` is the copy that matters: it seeds Zustand for every child component.
4. **`selectComponent(question.type)`** ([line 124](../../app/%28authenticated%29/learn/questions/%5Btitle%5D/page.js#L124)) dispatches on the question's `type`:

| `type` | Left pane | Right pane |
|---|---|---|
| `fullResponse` | `NewFullResponse` | `Feedback` |
| `selection` | `Selection` | `Feedback` |
| `combination` | `Combination` | `Feedback` |
| `sketch` | `Sketch` | `Feedback` |
| `explain` | `Explain`, a placeholder `<div>` | none |
| `fillInBlank` | `FillInBlank`, a placeholder `<div>` | none |

Several imports in the page are dead: `FullResponse` (the old version), `useGetQuestionsQuery`, `useGradeQuestionMutation`, and the `updateProgress` destructure.

### TwoPaneResponsive

File: [learn/lessons/TwoPaneResponsive.js](../components/learn/lessons/TwoPaneResponsive.js)

It's shared with lessons. On desktop it uses `react-split`: a draggable 50/50 split with the question on the left and feedback on the right. At ≤768px (via [useMediaQuery](../components/learn/lessons/useMediaQuery.js)) it switches to two tabs. It receives **already-built JSX elements** as props, not components.

---

## 8. The question types

### 8.1 `fullResponse`: NewFullResponse (the main one)

File: [questionTypes/newFullResponse.js](../components/questions/questionTypes/newFullResponse.js)

The student types a multi-line maths answer, and it's converted to SymPy and graded in Python.

**Setup (effect on `[question]`):**

- It creates two **MathLive `MathfieldElement`s by hand** (`new MathfieldElement()`) and appends them to ref'd `<div>`s, instead of using JSX:
  - `questionView`: read-only, shows `question.latex`.
  - `mfe`: the answer box, created with `mathVirtualKeyboardPolicy: 'manual'` and thin-space on spacebar.
- A `pointerdown` handler forces focus and moves the caret to the click point. Without it, clicking empty space left the caret in an invalid spot.
- On Enter (`insertLineBreak`), it runs `addRowAfter`, which gives multi-line answers.
- It **restores** the saved answer with `mfe.setValue(progress?.userLatex)`.
- On every keystroke it calls `updateProgress({ userLatex })`, so Zustand always holds the live answer.

**Compute Engine (second effect):** `new ComputeEngineConfig(...)` from [utils/ceConfig.js](../utils/ceConfig.js). This is **your vendored fork** of Cortex Compute Engine in `src/lib/cortex/compute-engine-main`, not the npm package. Your fork adds `compile-sympy.ts`, which is what makes `.compile('sympy')` work. `ceConfig` extends the LaTeX dictionary with `\lim_`, `\Rightarrow` (Implies), prefix `=`, `\to`, and a `lines` environment.

That also answers the comment at the top of `page.js`: this grading engine is a separate instance from the one MathLive uses internally. The mathfield doesn't "contain" it.

**Submit pipeline (`handleSubmit`):**

```
mfe.value (LaTeX, multi-line)
  → preprocessLatex()       // src/lib/utils/preprocess-latex.js
       splits on \\ into lines, strips \, _{} \displaylines aligned & etc.,
       and forces \text{...} onto its own line
  → ce.parse(line)          // each line → BoxedExpression (MathJSON)
  → .compile('sympy').toString()   // each line → SymPy source string
  → gradeQuestion({ questionData: question, sympyResponse: [...] })
  → FastAPI /feedback  → { feedback, status }
```

Then:

- `newProgress = {...progress, feedback: [...progress.feedback, feedback], attempts + 1, status: status ? 'complete' : 'incomplete'}`
- `updateProgress(newProgress)` updates the UI immediately. The Feedback pane switches tabs.
- `updateUserProgress({collectionIdentifier, progress: newProgress})` persists it to Mongo.

**Buttons:** Submit and Next work. **Hint, Save and Reset do nothing.** Next opens [NextQuestions](../components/questions/other-question-components/NextQuestions.js), a Reactstrap Offcanvas. Its `problems` list is **hard-coded** at the top of the component, and only `Sketch-the-Quadratic-I` is a real slug.

The big comment block at the top of this file is your old TODO list with ✅/❌ marks. It's still accurate.

### 8.2 `sketch`: Sketch

File: [questionTypes/Sketch.js](../components/questions/questionTypes/Sketch.js)

The student freehand-draws a curve, which gets simplified to a few draggable points.

- It loads **JSXGraph from the jsdelivr CDN** with a script tag. The `jsxgraph` npm package is installed but isn't used here.
- Its board is `[-10, 10, 10, -10]` with axes.
- **On mouse down** it enters a custom `BOARD_MODE_SKETCH` and starts a grey curve.
- **On move** it appends points to the curve.
- **On mouse up:**
  - It runs `JXG.Math.Numerics.Visvalingam(coords, degree - 1)`, which simplifies the stroke to about `degree` key points. A quadratic with degree 3 gives 3 points: 2 roots and the y-intercept.
  - It creates orange draggable points labelled from `question.marking.guide['graph-values'][].label`, and draws a **Lagrange polynomial** through them.
  - Dragging updates `reducedCoordinates`. Releasing calls `updateProgress({ coordinates })`.
- **Restore:** if `progress.coordinates` exists, `buildFromCoords` redraws it.
- **Submit:** sends `{questionData, reducedCoordinates}` to `/api/feedback/sketch`, which forwards to FastAPI. The response is `resp.data.feedback.{feedback, correct}`, a **different shape** from fullResponse's `resp.data.{feedback, status}`. It then updates the progress the same way, both in Zustand and in Mongo.

### 8.3 `selection`: Selection

File: [questions/Selection.js](../components/questions/Selection.js)

A multiple-choice question.

- It shows `question.latex` in a read-only mathfield and lays out `question.options` (`[{option, isCorrect}]`) as coloured buttons.
- Correctness is checked **entirely on the client** from `opt.isCorrect`.
- The choice locks after the first pick, and "Try Again" resets it.
- **No grading call, nothing goes into Zustand, nothing is saved.** The Feedback pane next to it will never show feedback.

### 8.4 `combination`: Combination

File: [questionTypes/Combination.js](../components/questions/questionTypes/Combination.js)

A question made of several sub-parts. It maps `question.combinationDetails[]` through [combinationTypeRenderer.js](../components/questions/combinationQuestionTypes/combinationTypeRenderer.js) on `block.type`:

| block.type | Component | Block fields used |
|---|---|---|
| `imageWithMfe` | [imageWithMfe.js](../components/questions/combinationQuestionTypes/imageWithMfe.js) | `title` (LaTeX), `url`, `alt`, `mfeLatex` (pre-filled), `index` |
| `sketch` | [sketch.js](../components/questions/combinationQuestionTypes/sketch.js) | `title`, `boundingBox`, `degree`, `labels`, `index` |
| `explain` | [explain.js](../components/questions/combinationQuestionTypes/explain.js) | `title`, `index` (text-mode mathfield) |

`multipleChoice.js` and `multipleChoiceImage.js` are **empty files**.

Each sub-part writes into its own slot with `setComponentProgressAt(block.index, {...})`. That design is sound. However, **this type has no submit logic and saves nothing** (see the gotchas).

### 8.5 `explain`, `fillInBlank`

Both are stubs that render placeholder text.

### 8.6 The old FullResponse

File: [questions/FullResponse.js](../components/questions/FullResponse.js)

It's imported but not used anymore. It's an older version of fullResponse with its own built-in Instructions/Feedback tabs, and NewFullResponse + Feedback replaced it. Safe to delete once you're sure.

---

## 9. The right-hand pane (Feedback)

File: [questions/feedback/index.js](../components/questions/feedback/index.js)

`Feedback` takes `details = question.details = { instructions, solution, markScheme }`. **Each of those is an array of "blocks"** that are rendered by [BlockRenderer](../components/learn/lessons/BlockRenderer.js), the same renderer lessons use. Block types are `heading`, `paragraph`, `bold-paragraph`, `bullet-points`, `image`, `accordion`, `table` and `task`, and all text goes through `react-latex-next`, so `$...$` works.

Tabs:

- **Instructions:** [questionInstructionPane](../components/questions/feedback/questionInstructionPane.js) renders `details.instructions`.
- **Feedback:** [questionFeedbackPane](../components/questions/feedback/questionFeedbackPane.js) renders only the **last** entry of `userProgress.feedback`. That entry is assumed to be **an array of blocks**, so FastAPI has to return feedback in block format.
- **Model Solution & Explanation:** [questionSolutionPane](../components/questions/feedback/questionSolutionPane.js).
  - The solution and mark scheme stay blurred until 3 attempts have been made, or until `status === 'complete'`.
  - "Reveal" sets `status: 'complete'` in Zustand only.
- **Notes:** [questionNotesPane](../components/questions/feedback/questionNotesPane.js) is a full create/edit/delete UI built on mathfields, with a text/maths toggle. **It only uses local `useState`**, so notes are lost on refresh. The API route and RTK hooks for notes exist but are empty or unused.
- **Comments, Review:** tab headers exist, but there's **no `TabPane`**, so they show nothing.

An effect switches to the Feedback tab whenever the `feedback` array reference changes. Submitting creates a new array, so the tab flips automatically.

---

## 10. MyTutor (shown on this page via the layout)

File: [learn/MyTutor.js](../components/learn/MyTutor.js)

It only turns on for routes whose last param is `lessonDisplay` or `title`, so it's active on this page. On send, it posts `{id, title, currentUrl, latestConversation, lessonContext}`, but **`lessonContext` comes from the *lesson* Zustand store, not `useQuestionStore`**. On question pages the tutor never sees the question or the student's work, which is exactly what the comment in `page.js` asks for. The reply is faked with a `setTimeout`, since the API returns `'succss'`.

---

## 11. Gotchas and bugs you'll run into

### Crashes / broken behaviour

1. **Combination Submit throws.** `handleSubmit` is never defined in [Combination.js:88](../components/questions/questionTypes/Combination.js#L88), and it also never renders `<NextQuestions>`, so Next opens nothing.
2. **Combination "explain" throws on every keystroke.** `updateProgress` is never pulled from the store ([explain.js:83](../components/questions/combinationQuestionTypes/explain.js#L83)). Its `useEffect` also has no dependency array, so it runs on every render.
3. **Combination `imageWithMfe` restores the wrong value.** It reads `progress.userLatex` ([imageWithMfe.js:85](../components/questions/combinationQuestionTypes/imageWithMfe.js#L85)) instead of `progress.componentProgress[index].userLatex`.
4. **Logged out means "Loading..." forever.** The middleware doesn't protect `/learn`, and the mutation never fires without a user, so `isUninitialized` stays true.
5. **The Feedback pane crashes if `userProgress` is null.** `state.userProgress.feedback` has no `?.`, and `existingUserProgress` can be `undefined` if the progress lookup failed on the server (it fails silently).
6. **Errors are swallowed.** The page logs `'the error is '` without the error ([page.js line 88](../../app/%28authenticated%29/learn/questions/%5Btitle%5D/page.js#L88)), and the questions route logs and continues.
7. **The Feedback pane opens on the Feedback tab, not Instructions.** The switch-tab effect also fires on mount.

### Data that isn't saved

- Typed `userLatex` and sketch `coordinates` only reach Mongo **on Submit**. Typing and then refreshing loses the work, because Save does nothing.
- "Reveal Solution" → `status: 'complete'` is never saved to Mongo.
- Selection, Combination and Notes save nothing.

### Security (worth fixing before real users)

- The route handlers trust `userId` from the request body. Anyone can read or overwrite anyone's progress. Use `auth()` from `@clerk/nextjs/server` inside the handlers instead.
- The whole question document, including `solution`, `markScheme` and the `isCorrect` flags, is sent to the browser. The blur is cosmetic, and the answers are visible in the network tab.

### Performance / cleanliness

- `page.js` [line 49](../../app/%28authenticated%29/learn/questions/%5Btitle%5D/page.js#L49) subscribes to the whole store with `useQuestionStore()`. Because NewFullResponse writes `userLatex` on every keystroke, **the whole page re-renders on each keypress**. Use selectors: `useQuestionStore(s => s.setProgress)`.
- `useMediaQuery` uses the deprecated `addListener`. Lots of `console.log`s throughout.
- `getUserProgForAllQuestions` only handles `edexcel`, and it hard-codes the `pure-y1` collection.

---

## 12. Where to start

1. Make sure Mongo (`MONGODB_URI`) and the FastAPI server on `:8000` are running, then open a `fullResponse` question end to end. It's the most complete path.
2. Quick wins: add selectors in `page.js`, add `?.` guards in the Feedback panes, fix `explain.js`'s `updateProgress`, and log real errors.
3. Then finish Combination (a submit that loops over `componentProgress`), add a real Save/autosave, and wire `useQuestionStore` into MyTutor's `promptData`.

---

## 13. Reference: data shapes

These are inferred from what the components read; there's no schema in the repo.

### Question document (`RootMath.quizzes`)

```js
{
  _id,
  title: 'Sketch-the-Quadratic-I',   // also the URL slug and lookup key
  type: 'fullResponse' | 'selection' | 'sketch' | 'combination' | 'explain' | 'fillInBlank',
  latex: '...',                      // question text, shown in a read-only mathfield
  branch: 'pure',                    // → progress collection name
  year: '12' | '13',                 // '12' → y1, anything else → y2
  details: {                         // right-hand pane, arrays of BlockRenderer blocks
    instructions: [ { type: 'paragraph', content: '...' }, ... ],
    solution:     [ ... ],
    markScheme:   [ ... ],
  },

  // selection only
  options: [ { option: 'latex', isCorrect: true }, ... ],

  // sketch only
  degree: 3,
  marking: { guide: { 'graph-values': [ { label: '1st root', ... }, ... ] } },

  // combination only
  combinationDetails: [
    { type: 'imageWithMfe', index: 0, title, url, alt, mfeLatex },
    { type: 'sketch',       index: 1, title, boundingBox, degree, labels },
    { type: 'explain',      index: 2, title },
  ],
}
```

### Progress document (`<examBoard>-questions-<branch>-<y1|y2>-progress`)

Unique index on `{ userId, title }`.

```js
{
  _id,
  title, userId, type,
  status: 'Todo' | 'incomplete' | 'complete',
  attempts: 0,
  feedback: [ [block, block, ...], ... ],   // one array of blocks per submission; last is shown
  createdAt, updatedAt,

  userLatex: '...',                          // fullResponse
  coordinates: [ { x, y, label } ],          // sketch
  componentProgress: [ { userLatex?, coordinates? } ],  // combination (Zustand only today)
}
```

### Block (BlockRenderer)

```js
{ type: 'heading', level: 2, content }
{ type: 'paragraph' | 'bold-paragraph', content }
{ type: 'bullet-points', points: [ '...' ] }
{ type: 'image', url, alt, caption }
{ type: 'accordion', title, children: [ block, ... ] }
{ type: 'table', header: [ ... ], rows: [ [ ... ], ... ] }
{ type: 'task', title, instructions, hint }
```
