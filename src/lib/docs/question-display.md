# Question Display: how it works

A walkthrough of `/learn/questions/[title]` and everything it touches: providers, Clerk, Redux (RTK Query), Zustand, the API routes, MongoDB, the question types, the right-hand pane, and how marking and review cards work.

First written October 2026 to explain the original code. **Updated 17 October 2026** after the question system was rebuilt around **parts**. The original single-type components still exist and are documented in [section 9](#9-legacy-questions-old-format-documents).

Related docs:
- [question-parts.md](question-parts.md): the parts schema, every part type, marking, and the build report.
- [question-reviews.md](question-reviews.md): review flashcards.
- [progress-page.md](progress-page.md): the stats page that reads question progress.

---

## Contents

1. [The big picture](#1-the-big-picture)
2. [Providers and layouts](#2-providers-and-layouts-what-wraps-the-page)
3. [Clerk: identity and examBoard](#3-clerk-identity-and-examboard)
4. [Redux / RTK Query](#4-redux--rtk-query)
5. [Server side: route handlers and MongoDB](#5-server-side-route-handlers-and-mongodb)
6. [Zustand](#6-zustand)
7. [The page itself: two paths](#7-the-page-itself-two-paths)
8. [Parts-based questions (the current system)](#8-parts-based-questions-the-current-system)
9. [Legacy questions (old-format documents)](#9-legacy-questions-old-format-documents)
10. [The right-hand pane](#10-the-right-hand-pane)
11. [MyTutor](#11-mytutor-shown-on-this-page-via-the-layout)
12. [What's fixed and what's still open](#12-whats-fixed-and-whats-still-open)
13. [Reference: data shapes](#13-reference-data-shapes)

---

## 1. The big picture

```
Browser                                        Next.js server (route handlers)            MongoDB "RootMath"
───────                                        ───────────────────────────────            ──────────────────
/learn/questions/Completing-the-Square-Exam-Style
        │
 RootLayout: ClerkProvider → StoreProvider (Redux)
 LearnLayout: LearnNav, Breadcrumbs, MyTutor widget
        │
 QuestionDisplay (page.js)
   useUser() ─────────────────────────────── Clerk (who is logged in + examBoard)
   dynamicQuestionData() ── POST /api/questions/[title] ─► question (answer keys stripped)  quizzes
                                                          + progress (created if new)      <board>-questions-<branch>-y1|y2-progress
   setProgress() ──► Zustand useQuestionStore.userProgress
        │
   question.parts ?  ── yes ─► TwoPaneResponsive
        │                         left:  QuestionParts  (every part type)
        │                                  Submit ─► POST /api/mark ─► markers (+ simulated / FastAPI LLM)
        │                                  autosave ─► POST /api/question-progress ─► replaceOne
        │                         right: Feedback (Instructions / Feedback / Solution / Notes / Comments / Review)
        │                                  Review tab ─► /api/reviews/* ─► reviewStates
        │
        └─ no ──► selectComponent(question.type)   ← legacy components, old-format documents only
```

Three things to keep in mind:

- **There are two state systems.** Redux (RTK Query) only does network calls and caching. Zustand holds the question progress that several components share.
- **Marking happens on the server.** `/api/mark` re-reads the question (with answer keys) from MongoDB. Auto-marked parts (`answer`, `choice`, `order`, `place`, `sketch`) are marked in Next.js. `working` and `explain` parts go through `markWithLLM()`, which is **simulated** until `FASTAPI_MARKING=live` points it at your Python server.
- **The page has two paths.** Any question document with a `parts` array uses the new system. Documents without one still use the original components.

---

## 2. Providers and layouts (what wraps the page)

**[app/layout.tsx](../../app/layout.tsx)**: the root layout.
- `<ClerkProvider>` wraps everything, so `useUser()` works anywhere.
- `<StoreProvider>` ([StoreProvider.js](../redux/StoreProvider.js)) creates the Redux store once per browser session using a `useRef`.
- Global CSS: a Bootstrap theme (`bootstrap.css`, the "sketchy" theme), bootstrap-icons, KaTeX, then `globals.css` last.
- The favicon is `src/app/icon.svg` plus `favicon.ico` and `apple-icon.png`: the AskTutor mortarboard on teal.

**[middleware.ts](../../middleware.ts)**: `clerkMiddleware()` with **no `auth.protect()`**. Clerk is attached to every request (so `auth()` works in route handlers), but **no page is protected**: `/learn/...` is reachable while logged out.

**[learn/layout.js](../../app/%28authenticated%29/learn/layout.js)**: wraps every `/learn/*` page with `LearnNav` (which now includes **PROGRESS**), `Breadcrumbs` and the floating `MyTutor` widget. `(authenticated)` is only a route group: it doesn't change the URL and does no auth itself.

**How users get here:** [QuestionTable.js](../components/questions/QuestionTable.js) links to `questions/<title>`, or the **Next** drawer on a question does. The URL slug **is the question's `title`** in MongoDB, so titles must be unique.

---

## 3. Clerk: identity and examBoard

- **In the browser:** `useUser()` returns `{ isLoaded, isSignedIn, user }`. `user.id` is stored as `userId` on progress documents.
- **On the server:** the newer routes (`/api/mark`, `/api/mastery`, `/api/reviews/*`) use **`await auth()`** from `@clerk/nextjs/server`. That reads the user from Clerk's signed session, so it can't be faked. ([Clerk docs: auth()](https://clerk.com/docs/references/nextjs/auth))
- **`user.unsafeMetadata.examBoard`** is set at sign-up ([sign-up/page.tsx](../../app/%28public%29/sign-up/page.tsx)) and picks the student's progress collection. Server routes read it with `currentUser()`. "Unsafe" means the student can edit it from the browser, so don't trust it for anything security-related.

---

## 4. Redux / RTK Query

File: [redux/slices/apiSlice.js](../redux/slices/apiSlice.js). Redux is only a typed fetch layer with caching; each endpoint becomes a hook.

| Hook | Call | Used by |
|---|---|---|
| `useDynamicQuestionDataMutation` | `POST /api/questions/:title` | **page.js**: loads the question + progress |
| `useMarkQuestionMutation` | `POST /api/mark` | `QuestionParts`: Submit |
| `useUpdateQuestionProgressMutation` | `POST /api/question-progress` | `QuestionParts`: autosave, Save, Reset, after Submit |
| `useGetQuestionsQuery` | `GET /api/questions` | `QuestionTable`, the Next drawer in `QuestionParts` |
| `useGetQuestionReviewsQuery` | `GET /api/reviews/question/:title?today=` | the Review tab and its "Review · 2" label |
| `useCheckReviewCardMutation` | `POST /api/reviews/check` | review cards with an answer to check |
| `useRateReviewCardMutation` | `POST /api/reviews/rate` | every review card |
| `useGetMasteryQuery` | `GET /api/mastery?spec=` | the Progress page |
| `useGradeQuestionMutation`, `useGradeSketchQuestionMutation` | `POST /api/feedback`, `/api/feedback/sketch` (FastAPI) | legacy components only |
| `useAskTutorMutation` | `POST /api/tutor/asktutor` | MyTutor |

**Cache tags:** `tagTypes: ['Reviews']`. Rating a review card invalidates that question's review data, so the "Review · n" count refreshes by itself. `QuestionParts` also invalidates it after a save that completes the question or reveals the solution, so the Review tab unlocks without a reload.

Loading the question is a **mutation**, not a query, because it can also create the progress document. The page uses `mutationState.isUninitialized` to mean "not fetched yet".

---

## 5. Server side: route handlers and MongoDB

### Connection: [mongodb/db.js](../mongodb/db.js)

It exports **`getMongoClient()`**, which shares one MongoDB connection, cached on `global` in development so hot reloads don't open new ones. **A failed connection is no longer cached:** it's thrown away, so the next request tries again. Before, one network blip broke every request until you restarted `npm run dev`. The file's comments (including your own notes) explain this.

### Data access: [mongodb/utils.js](../mongodb/utils.js)

- `init()` connects to `RootMath` and sets `questions = db.collection('quizzes')`. **Every function now calls `await init()` first**, so the app recovers after a connection failure, and `init()` logs MongoDB's real error.
- `getQuestions()` and `getSpecificQuestion(title)` read `quizzes`. `getQuestions()` now logs the real error instead of hiding it.
- `identifyQuesProg({ examBoard, branch, year })` builds the progress collection name: `` `${examBoard}-questions-${branch}-${year == '12' ? 'y1' : 'y2'}-progress` ``, e.g. `edexcel-questions-pure-y1-progress`.
- `getUserQuestionProgress`, `createUserQuestionProgress` (unique on `{userId, title}`) and `updateUserQuestionProgress`. The last one does **`replaceOne`**, so whatever the browser sends becomes the whole document.
- **Added for the Progress page:** `getUserProgressForCollection`, `getChapters`, `getBuiltLessons`, `getUserLessonProgressList`.
- **Added for reviews:** `getReviewStates`, `createReviewStates` and `saveReviewState`, all on the `reviewStates` collection.

### The routes this page uses

| Route | What it does | Who it trusts |
|---|---|---|
| [POST /api/questions/[title]](../../app/api/questions/%5Btitle%5D/route.js) | Returns the question **passed through `toClientQuestion`** (answer keys and `review` cards removed; old-format documents unchanged), plus the progress, created as `{ status: 'Todo', feedback: [], attempts: 0, … }` if new. | `userId` from the request body ⚠️ |
| [POST /api/mark](../../app/api/mark/route.js) | Re-reads the full question and marks every part (`src/lib/marking/`). Returns `{ results[], marksAwarded, marksAvailable, status, feedback }`. | Clerk `auth()` ✅ |
| [POST /api/question-progress](../../app/api/question-progress/route.js) | `replaceOne` of the progress document. | `userId` from the body ⚠️ |
| [/api/reviews/…](../../app/api/reviews/) | `GET question/[title]`, `POST check`, `POST rate`: see [question-reviews.md](question-reviews.md). | Clerk `auth()` ✅ |
| [GET /api/questions](../../app/api/questions/route.js) | The question list, also sanitised, with each question's status merged in. | `userId` from the query ⚠️ |
| `/api/feedback`, `/api/feedback/sketch`, `/api/tutor/asktutor` | Forward to FastAPI on `127.0.0.1:8000`. Used by the legacy components and MyTutor. | – |

### The marking library: [src/lib/marking/](../marking/)

| File | Role |
|---|---|
| `index.js` | `markQuestion()`: runs each part's marker and builds the summary feedback |
| `deterministic.js` | Markers for `answer` (Compute Engine equivalence), `choice`, `order`, `place`, `sketch` (curve-distance) |
| `llm.js` | `working` / `explain`: simulated by default, or `FASTAPI_MARKING=live` → `POST {FASTAPI_URL}/mark-part` |
| `sanitize.js` | `toClientQuestion` / `toClientPart`: strip answer keys before anything reaches the browser |
| `ids.js` | Stable ids and a seeded shuffle for `order` lines |

---

## 6. Zustand

File: [zustand/providers/question-state-provider.ts](../zustand/providers/question-state-provider.ts). These are **plain global stores** (`create()`, no React Context), shared by every component that imports them.

```js
userProgress: null                      // mirrors the MongoDB progress document
setProgress(p)                          // replace it (page.js on load)
updateProgress(partial)                 // shallow merge
setComponentProgressAt(index, patch)    // merge into userProgress.componentProgress[index]
```

**For parts-based questions** the important fields are:

```js
componentProgress: [
  { response,        // what the student has entered for part i
    result,          // the latest marking result for part i
    markedResponse } // the response that `result` was for (to spot edits since marking)
],
status,              // 'Todo' | 'incomplete' | 'complete' (complete = every part fully correct)
attempts, marks: { awarded, available }, feedback: [[blocks], ...],
solutionRevealed     // set by "Reveal solution"; unlocks review cards, doesn't count as complete
```

**Read the store with selectors** (`useQuestionStore(s => s.userProgress)`), not `useQuestionStore()`. The bare form re-renders on every change, including every keystroke. `page.js` now uses selectors.

The second store, [question-drawer-state-provider.ts](../zustand/providers/question-drawer-state-provider.ts), only opens and closes the "Next question" drawer.

---

## 7. The page itself: two paths

File: [app/(authenticated)/learn/questions/[title]/page.js](../../app/%28authenticated%29/learn/questions/%5Btitle%5D/page.js)

1. **First render:** shows "Loading..." until Clerk is ready and the question has been fetched (`mutationState.isUninitialized`).
2. **The effect** (deps `[user, isSignedIn]`) calls `dynamicQuestionData({ params, userId, examBoard }).unwrap()`, then `setQuestion(question)` and `setProgress(existingUserProgress)`. Errors are now logged with `console.error`.
3. **Which path** ([line 127](../../app/%28authenticated%29/learn/questions/%5Btitle%5D/page.js#L127)):
   - **`question.parts` exists** → `<TwoPaneResponsive question={<QuestionParts/>} feedback={<Feedback details={partsDetails(question)} reviewTitle={…}/>}>`. **This is the current system** ([section 8](#8-parts-based-questions-the-current-system)). The document's `type` doesn't matter.
   - **Otherwise** → `selectComponent(question.type)` ([line 136](../../app/%28authenticated%29/learn/questions/%5Btitle%5D/page.js#L136)) picks a legacy component ([section 9](#9-legacy-questions-old-format-documents)).

Every `<Feedback>` gets `reviewTitle={question.title}` so its Review tab can load that question's cards.

**[TwoPaneResponsive](../components/learn/lessons/TwoPaneResponsive.js)**, shared with lessons: a draggable 50/50 split on desktop, and two tabs at ≤768px.

---

## 8. Parts-based questions (the current system)

**Every question is a list of parts.** A single-part question is a list of one, and any part can have an `image`, a `hint` and a `solution`. The full schema, each type's fields and the marking rules are in [question-parts.md](question-parts.md). This section explains how the code fits together.

### Components: [src/lib/components/questions/parts/](../components/questions/parts/)

| Component | Role |
|---|---|
| **`QuestionParts.js`** | The container: title, "Last attempt: x / y marks", the shared `stem`, every part, and the Save / Submit / Reset / Next buttons. Owns autosave, Submit, Reset, stale-result detection, and the Next drawer (real questions from `useGetQuestionsQuery`, same topic first). |
| **`PartRenderer.js`** | Everything common to a part: label, prompt, `[n marks]`, image, the **Hint** button and panel, the type-specific body, and the result underneath (marks, a coloured bar, feedback blocks). |
| `MathInputPart.js` | `working` and `explain`: a multi-line MathLive field in the original light-blue style, with a **Text mode** toggle. |
| `AnswerPart.js` | `answer`: a read-only template with MathLive `\placeholder[id]{}` boxes that turn green or red after marking. |
| `ChoicePart.js` | `choice`: a 2×2 grid of option cards, each with its letter in a small box. |
| `OrderPart.js` | `order`: add lines from a shuffled pool, reorder with drag or ↑ ↓ ✕. |
| `PlacePart.js` | `place`: drag points and vector arrows on a snapping JSXGraph grid. |
| `SketchPart.js` | `sketch`: draw a curve, which becomes `degree + 1` handles with a polynomial through them. |
| `loadJSXGraph.js` | Loads JSXGraph once per page from the CDN, pinned to 1.11.1. |
| `partsDetails.js` | Builds the right-hand pane's Instructions / Solution / Mark Scheme from the parts. |

### What happens when a student works on a question

```
type / drag / pick ─► setComponentProgressAt(i, { response })     (Zustand)
                   └► "Unsaved changes" → 1.5 s later autosave ─► POST /api/question-progress

Submit ─► POST /api/mark { title, responses[] }
       ◄─ { results[i], marksAwarded, marksAvailable, status, feedback }
       ─► componentProgress[i] = { response, result, markedResponse }
          attempts + 1, status, marks, feedback.push(summary blocks)
       ─► saved; if complete, the Review tab is told to refresh
```

- **Layout:** a single `working`, `explain` or `choice` part stretches to fill the panel, like the old full-response page. Multi-part questions stack their parts.
- **Correct parts lock.** If a student edits a part after it was marked, its old result stays visible with "(changed since marking, submit again)", but the green/red highlights and the lock are removed.
- **Reset** asks for confirmation in a reactstrap `Alert` (not a browser pop-up), clears every answer, and keeps attempts and feedback history.
- **Read-only data:** the question comes from RTK Query, which freezes it. JSXGraph writes into the arrays it's given, so `PlacePart` and `SketchPart` pass it **copies**. Forgetting that caused the "Cannot assign to read only property" error.

### The seven part types (summary)

| Type | Student does | Marked by |
|---|---|---|
| `working` | multi-line maths | LLM (simulated until FastAPI is live) |
| `explain` | words + maths | LLM (simulated) |
| `answer` | fill in boxes | Compute Engine: any mathematically equal answer; `exactForm` / `tolerance` options |
| `choice` | pick option(s) | the `correct` flags, with a `why` per option |
| `order` | order the lines, avoiding distractors | positions vs the authored order |
| `place` | drag points / vectors | coordinates within a tolerance; free or fixed vectors |
| `sketch` | draw a curve | whether the curve passes near each hidden key point |

---

## 9. Legacy questions (old-format documents)

These components only run for question documents **without** `parts`. They're untouched, so the four original questions keep working until they're replaced by the migrated versions in [question-examples/](question-examples/). Once every question has `parts`, they can be deleted.

| `type` | Component | Notes |
|---|---|---|
| `fullResponse` | [newFullResponse.js](../components/questions/questionTypes/newFullResponse.js) | MathLive answer → `preprocessLatex` → your Compute Engine fork's `compile('sympy')` → FastAPI `/feedback`. The answer only saves on Submit, and the Next list is hard-coded. |
| `sketch` | [Sketch.js](../components/questions/questionTypes/Sketch.js) | Freehand curve → FastAPI `/sketch/feedback`. Loads JSXGraph with its own script tag. |
| `selection` | [Selection.js](../components/questions/Selection.js) | Checked in the browser from `isCorrect`; nothing is saved. |
| `combination` | [Combination.js](../components/questions/questionTypes/Combination.js) | **Broken:** Submit is undefined, the "explain" block throws on typing, and `imageWithMfe` restores the wrong value. Replaced by parts. |
| `explain`, `fillInBlank` | stubs | placeholder text |

`FullResponse.js` (the version before `newFullResponse`) is imported by `page.js` but not used.

---

## 10. The right-hand pane

File: [questions/feedback/index.js](../components/questions/feedback/index.js). `Feedback` takes `details = { instructions, solution, markScheme }` (arrays of [BlockRenderer](../components/learn/lessons/BlockRenderer.js) blocks) and `reviewTitle`.

For parts-based questions, `details` comes from **`partsDetails(question)`**:
- generic instructions, unless the question sets `details.instructions`;
- each part's `solution`, under its label;
- each part's `markScheme` as M1/A1 bullet points.

| Tab | What it shows |
|---|---|
| **Instructions** | `details.instructions`. **The pane now opens here**: it only switches to Feedback when *new* feedback arrives. Comparing against the previous feedback value works under React Strict Mode. |
| **Feedback** | The last entry of `userProgress.feedback`: for parts, the per-part summary from `/api/mark`. Null-safe if progress is missing. |
| **Model Solution & Explanation** | Blurred until 3 attempts, the question is complete, or the solution was revealed. **Reveal** now sets `solutionRevealed: true`, which is saved and unlocks review cards, but doesn't count as completing the question. |
| **Notes** | A mathfield notes editor. Still only local state, so notes are lost on refresh. |
| **Comments** | A tab header with no content yet. |
| **Review** | The question's review flashcards ([ReviewPane](../components/questions/reviews/ReviewPane.js)). The tab label shows the due count, e.g. **Review · 2**. Locked until the question is complete or revealed. See [question-reviews.md](question-reviews.md). |

---

## 11. MyTutor (shown on this page via the layout)

File: [learn/MyTutor.js](../components/learn/MyTutor.js). Unchanged. It's active on question pages, but its `lessonContext` comes from the **lesson** store, so it still can't see the question or the student's answers. `useQuestionStore.getState().userProgress.componentProgress` now holds every part's live answer, ready to add to its prompt. The reply is still faked, because `/api/tutor/asktutor` returns `'succss'`.

---

## 12. What's fixed and what's still open

### Fixed

| Problem (from the original review) | Fix |
|---|---|
| Combination Submit undefined; explain block throws; wrong restore | Replaced by the parts system. The broken component remains only for old documents. |
| Save, Reset, Hint did nothing | Autosave + Save; Reset with a confirm alert; per-part Hint panels |
| Typed answers lost on refresh | Autosave 1.5 s after the last change |
| Feedback pane crashed if progress was `null` | `?.` guards in the Feedback, Feedback-tab and Solution panes |
| Pane opened on Feedback, not Instructions | Only switches on *new* feedback |
| Errors swallowed (`'the error is '`, `getQuestions`) | Real errors logged |
| Whole-store subscription re-rendered the page on every keystroke | Selectors in `page.js` |
| "Reveal solution" never saved | Saves `solutionRevealed` (unlocks review cards) |
| One network blip broke MongoDB until restart | `getMongoClient()` retries; every `utils.js` function calls `init()` |
| Answer keys visible in the browser | `toClientQuestion` strips them for parts-based questions; marking runs on the server |
| Next drawer hard-coded | Real questions, same topic first (in `QuestionParts`) |

### Still open

- **⚠️ Three routes trust `userId` from the request** (`/api/questions/[title]`, `/api/question-progress`, `GET /api/questions`), so anyone could read or overwrite anyone's progress. They should use `auth()` like the newer routes.
- **Logged out means "Loading..." forever.** The middleware doesn't protect `/learn`. Add `auth.protect()` for `/learn(.*)`, and upgrade Next.js first (below).
- **Upgrade Next.js** to ≥ 14.2.25. Clerk requires it (installs need `--legacy-peer-deps` until then), and it patches the middleware auth-bypass vulnerability (CVE-2025-29927).
- **Every Submit re-marks every part.** That's fine while LLM marking is simulated, but it costs a real LLM call per `working`/`explain` part once FastAPI is live.
- **Solutions and mark schemes are sent to the browser.** This is a deliberate decision: the blur is a nudge, not a lock.
- **Notes aren't saved**, Comments has no content, and MyTutor can't see the question.
- **`public/Images` vs `/images/…`**: works on a Mac, but will 404 on Linux hosting. Rename the folder before deploying.
- **MongoDB Atlas Network Access**: when your IP changes, new connections fail with `read ECONNRESET`. Add your current IP in Atlas.

---

## 13. Reference: data shapes

### Question document (`RootMath.quizzes`): current format

```js
{
  title: 'Completing-the-Square-Exam-Style',  // URL slug + lookup key, unique
  type: 'combination', schemaVersion: 2,      // informational: the page switches on `parts`
  topic, difficulty, branch: 'pure', examBoard: 'all', year: '12',
  stem: [blocks],                             // optional shared context
  parts: [ { type, label, prompt, marks, image, hint, solution, ...type fields } ],
  details: { instructions, solution, markScheme },  // optional overrides for the right-hand pane
  review: [ card, ... ],                      // optional review flashcards (never sent with the question)
}
```

Full field lists for each part type: [question-parts.md](question-parts.md). Card format: [question-reviews.md](question-reviews.md).

### Question document: legacy format

```js
{ title, type: 'fullResponse' | 'selection' | 'sketch' | 'combination', latex, branch, year,
  details: { instructions, solution, markScheme },
  options: [{ option, isCorrect }],                        // selection
  degree, marking: { guide: { 'graph-values': [...] } },   // sketch
  combinationDetails: [...] }                              // combination
```

### Progress document (`<examBoard>-questions-<branch>-<y1|y2>-progress`)

Unique on `{ userId, title }`.

```js
{
  title, userId, type,
  status: 'Todo' | 'incomplete' | 'complete',
  attempts, marks: { awarded, available },
  feedback: [ [block, ...], ... ],                       // one block list per Submit; the last is shown
  componentProgress: [ { response, result, markedResponse } ],   // parts-based questions
  solutionRevealed: true,                                // if the solution was revealed
  createdAt, updatedAt,
  userLatex, coordinates,                                // legacy components only
}
```

### Review schedule (`reviewStates`)

One document per student per card: `{ userId, cardKey: '<title>#<cardId>', ease, intervalDays, reps, lapses, due: 'YYYY-MM-DD', … }`. See [question-reviews.md](question-reviews.md).

### Block (BlockRenderer)

```js
{ type: 'heading', level: 2, content }
{ type: 'paragraph' | 'bold-paragraph', content }        // $...$ maths works everywhere
{ type: 'bullet-points', points: [ '...' ] }
{ type: 'image', url, alt, caption }
{ type: 'accordion', title, children: [ block, ... ] }
{ type: 'table', header: [ ... ], rows: [ [ ... ], ... ] }
{ type: 'task', title, instructions, hint }
```
