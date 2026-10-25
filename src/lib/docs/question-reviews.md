# Question reviews: design

How review flashcards work for questions: where they're stored, what makes a good card, how scheduling works, and every card written for the example questions. Written 14 October 2026, before the code. The build follows this document.

---

## Contents

1. [The goal](#1-the-goal)
2. [Where things are stored](#2-where-things-are-stored)
3. [The card format](#3-the-card-format)
4. [How to write a good review card](#4-how-to-write-a-good-review-card)
5. [Unlocking](#5-unlocking)
6. [Scheduling](#6-scheduling)
7. [What the student sees](#7-what-the-student-sees)
8. [How it fits together](#8-how-it-fits-together)
9. [The cards for the example questions](#9-the-cards-for-the-example-questions)
10. [Not in this version](#10-not-in-this-version)

---

## 1. The goal

When a student finishes a question, they should still be able to do it weeks later. Re-solving the whole question every time is too slow to do often, so instead each question gets a few **flashcards** that test the **decisions and key steps** of its method:

- *"What's the first step?"*
- *"Which form is the answer in?"*
- *"What does f(x − 2) do to the graph?"*

Each one takes seconds. Cards come back on a spaced schedule (like Anki): soon after first learning, then at longer and longer gaps each time the student remembers.

---

## 2. Where things are stored

**Short answer: the card *content* lives on the question document, but each student's *schedule* lives in its own collection.**

| What | Where | Why |
|---|---|---|
| **Card content** (front, back, answers) | the question document, in a `review: [...]` array | It's the same for every student and is written alongside the question, so it's one paste in Compass. The `review` field was reserved in the parts schema for this. |
| **Each student's schedule** (when each card is next due, how well they know it) | a new **`reviewStates`** collection, one document per student per card | It's different for every student. It must **not** go in the question document, which is shared by everyone. It also needs to be searchable on its own: "what's due for this student, across everything?" is one fast query here. The question page needs that now; the Progress page's Outstanding reviews card and a future "review everything due" page will need it later. |

A `reviewStates` document:

```js
{
  userId: 'user_2sp…',
  cardKey: 'Completing-the-Square-Exam-Style#first-step',  // '<question title>#<card id>'
  source: { kind: 'question', title: 'Completing-the-Square-Exam-Style' },
  ease: 2.5,             // how easily they remember it: grows with Good/Easy, shrinks with Hard/Again
  intervalDays: 3,       // the gap that was used last time
  reps: 2,               // successful reviews in a row
  lapses: 0,             // times forgotten (rated Again)
  due: '2026-10-17',     // the student's local date when it's next due
  lastRating: 'good',
  lastReviewedAt: '2026-10-14T18:02:11.000Z',
  createdAt: '2026-10-11T09:15:00.000Z'
}
```

Indexes:
- `{ userId: 1, cardKey: 1 }`, unique: one schedule per student per card.
- `{ userId: 1, due: 1 }`: makes "what's due today?" fast.

**Answers stay on the server.** The question API strips `review` before sending a question to the browser. Cards are served by their own API, with answer keys removed, in the same way as auto-marked parts.

---

## 3. The card format

Cards go in the question document's `review` array. Each has an `id` that's unique within that question, so the student's schedule stays attached to the right card even if you reorder the list.

**Flip card** (self-rated, the main type):

```js
{ id: 'first-step', type: 'flip',
  front: [blocks],   // the question side
  back:  [blocks] }  // the answer side
```

The student thinks of the answer, clicks **Show answer**, compares, and rates themselves.

**Auto-marked cards** reuse the existing part types exactly, with the same fields and the same marking:

```js
{ id: 'complete-square', type: 'answer', prompt, template, blanks, explanation: [blocks] }
{ id: 'opens',           type: 'choice', prompt, options,          explanation: [blocks] }
{ id: 'proof-order',     type: 'order',  prompt, lines, distractors, explanation: [blocks] }
```

`explanation` is optional and is shown after the student checks their answer. A wrong answer counts as **Again** automatically. A right answer lets the student choose Hard, Good or Easy. These cards also check whether the student's self-ratings on flip cards are honest.

Blocks are the usual BlockRenderer blocks, with `$...$` maths.

---

## 4. How to write a good review card

1. **One idea per card.** If the back has two separate facts, make it two cards.
2. **Under 30 seconds, no real calculation.** If it needs paper, it's a question, not a card. Test the *decision* or the *key step*, not the arithmetic.

   | ❌ Too much calculation | ✅ Tests the idea |
   |---|---|
   | "Solve e^{2x} = 5" | "What's the first step to solve e^{2x} = 5?" |
   | "Complete the square on 2x² + 12x + 13" | "x² + 6x = (x + ▢)² − ▢" |
   | "Find the turning point of y = 2(x+3)² − 5" | "Where's the turning point of y = a(x + p)² + q?" |

3. **Mostly flip cards; auto-marked cards only when the answer is short and exact** (a value, an expression, a choice).
4. **Put the key point first and bold it on the back**, so it's easy to compare against.
5. **Wrong options in choice cards should be real mistakes**, each with a `why` explaining that mistake.
6. **About 3 cards per question.** More becomes a chore.

---

## 5. Unlocking

A question's cards **unlock when the question is complete**: every part fully correct, *or* the student revealed the solution. At that point they've seen the whole method, so reviewing it makes sense. Before that, the Review tab says *"Finish this question to unlock its review cards."*

Unlocking happens when the Review tab is opened. The server sees the question is complete and the student has no schedule for its cards yet, so it creates one, due **today**.

**A fix needed for this:** *Reveal solution* used to mark the question complete **only in the browser**; nothing was saved. It now saves **`solutionRevealed: true`** to the student's progress instead, and that also unlocks the cards.

It deliberately **doesn't** set `status: 'complete'`. The Progress page counts a complete question as 100% mastery, and revealing the answer shouldn't earn that.

Once a student has schedules for a question's cards, they **stay unlocked**, even if the student resets the question. Cards added to a question later are unlocked automatically for students who already have the others.

---

## 6. Scheduling

A simplified version of SM-2, the algorithm Anki used for years. After each review the student rates the card:

| Rating | Button label | What happens next |
|---|---|---|
| **Again** | "I didn't know it" | Back **tomorrow**. Also re-shown later in the *same* session. Counts as a lapse, and ease −0.2. |
| **Hard** | "I struggled" | Gap ×1.2 (at least 1 day). Ease −0.15. |
| **Good** | "I knew it" | First time 1 day, then 3 days, then gap × ease. |
| **Easy** | "Instant" | First time 4 days, then gap × ease × 1.3. Ease +0.15. |

Ease starts at **2.5** and never drops below **1.3**. So a card you keep knowing grows: 1 → 3 → 8 → 20 days…

**"Today" is the student's local date.** The browser sends it (e.g. `2026-10-14`), so cards become due at the student's midnight, not the server's.

**Practise anyway.** When nothing is due, the student can still practise any unlocked card:
- Practice **doesn't change the schedule**, because reviewing early would make the card look easier than it is and push it too far away.
- **Except:** rating **Again** in practice brings the card back **tomorrow** (if it was due later). Getting it wrong is real information; getting it right early isn't.
- A banner says "Practice: this doesn't change your schedule."

---

## 7. What the student sees

All of this is in the existing **Review** tab on the question page. The tab label shows how many cards are due, e.g. **Review · 2**.

| State | What's shown |
|---|---|
| **Locked** | "Finish this question to unlock its review cards." |
| **Cards due** | A session, one card at a time, with progress "Card 2 of 4". Cards rated Again go to the back of the queue. |
| **Nothing due** | "All caught up. Next review in 3 days." and a **Practise anyway** button. |
| **Session finished** | A summary ("4 reviewed, 1 to see again tomorrow") and the next review date. |
| **No cards** | "No review cards for this question yet." (e.g. old-format questions) |

**A flip card:** front → **Show answer** → back → four rating buttons.
**An auto-marked card:** the usual answer, choice or order input → **Check** → green or red result and the explanation → rating buttons (only Hard, Good and Easy if right; Again is automatic if wrong).

Plain colour changes only, with no animations, matching the rest of the site.

---

## 8. How it fits together

```
Question page → Review tab → ReviewPane
   │  GET /api/reviews/question/<title>?today=2026-10-14
   │      server: Clerk auth → question (with its review cards) → is the question complete?
   │              → create any missing schedules (due today) → cards without answer keys + due info
   │
   ├─ auto-marked card: POST /api/reviews/check { title, cardId, response }
   │      server marks it with the same markers as question parts → { correct, result }
   │
   └─ every card:        POST /api/reviews/rate { title, cardId, rating, mode, today }
          server: scheduler → saves the new reviewStates document → { due, intervalDays }
```

| Piece | File |
|---|---|
| Scheduler (pure, unit-tested) | `src/lib/reviews/scheduler.js` |
| Card helpers: strip answers, mark answers | `src/lib/reviews/cards.js` (reuses `sanitize.js` and `deterministic.js`) |
| Database | new functions in `src/lib/mongodb/utils.js` |
| API | `src/app/api/reviews/question/[title]/route.js`, `src/app/api/reviews/check/route.js`, `src/app/api/reviews/rate/route.js` |
| UI | `src/lib/components/questions/reviews/ReviewPane.js`, `ReviewCard.js`, plus the Review tab in `feedback/index.js` |

---

## 9. The cards for the example questions

24 cards, 3 per question. Each tests a decision or key step from that question, not the full working.

**01 · Advanced Simplification of Indices**
| id | Type | Card |
|---|---|---|
| `common-base` | flip | First step to simplify (2³·4²)³ / 8⁴? → **Write every base as a power of 2**: 4 = 2², 8 = 2³. |
| `power-of-power` | answer | (2ᵃ)ᵇ = 2^▢ → **ab** |
| `divide-powers` | answer | 2ᵐ ÷ 2ⁿ = 2^▢ → **m − n** |

**02 · Sum-Product Inequality Proof**
| id | Type | Card |
|---|---|---|
| `key-idea` | flip | Key idea to prove p + q ≥ √(4pq)? → **Compare squares**: (p+q)² = (p−q)² + 4pq, and (p−q)² ≥ 0. |
| `difference` | answer | (p+q)² − (p−q)² = ▢ → **4pq** |
| `square-root-step` | flip | Why can you square-root (p+q)² ≥ 4pq? → **Both sides are positive** (p, q > 0). |

**03 · Sketch the Quadratic I**
| id | Type | Card |
|---|---|---|
| `key-points` | flip | Which points do you need to sketch y = ax² + bx + c? → **Roots, y-intercept (0, c), and the shape** (∪ if a > 0, ∩ if a < 0). |
| `shape` | choice | Which way does y = −2x² + 6x − 1 open? → **∩**, because the x² coefficient is negative. |
| `y-intercept` | answer | y = −2x² + 6x − 1 crosses the y-axis at (0, ▢) → **−1** |

**04 · Cube It Or Lose It**
| id | Type | Card |
|---|---|---|
| `from-roots` | flip | Cubic with roots −3, −1, 0 and leading coefficient 3? → **f(x) = 3x(x+1)(x+3)** |
| `translate` | choice | y = f(x − 2) is…? → **a translation 2 units right** |
| `reflect` | choice | y = −f(x) is…? → **a reflection in the x-axis** |

**05 · Completing the Square (exam style)**
| id | Type | Card |
|---|---|---|
| `first-step` | flip | First step to write 2x² + 12x + 13 as a(x+b)² + c? → **Take out the 2**: 2(x² + 6x) + 13. |
| `complete` | answer | x² + 6x = (x + ▢)² − ▢ → **3, 9** |
| `turning-point` | flip | Turning point of y = a(x+p)² + q? → **(−p, q)** |

**06 · Vectors on the Grid**
| id | Type | Card |
|---|---|---|
| `add-vectors` | flip | How do you add two column vectors? → **Add matching components.** |
| `midpoint` | flip | Midpoint of (x₁, y₁) and (x₂, y₂)? → **((x₁+x₂)/2, (y₁+y₂)/2)** |
| `magnitude` | answer | Magnitude of (3, −2), exact → **√13** |

**07 · Consecutive Odd Numbers Proof**
| id | Type | Card |
|---|---|---|
| `odd-form` | flip | General odd number in a proof? → **2n + 1, n an integer** (consecutive: 2n+1, 2n+3). |
| `multiple-of-4` | flip | How do you show an expression is a multiple of 4? → **Write it as 4 × (an integer)** and say why the bracket is an integer. |
| `proof-skeleton` | order | Order the steps of a "show it's a multiple of k" proof. Includes the distractor "check it works for n = 1 and n = 2", since checking examples isn't a proof. |

**08 · Exact Exponential Equation**
| id | Type | Card |
|---|---|---|
| `first-step` | flip | First step to solve e^{2x} = 5? → **Take ln of both sides**: 2x = ln 5. |
| `ln-of-e` | answer | ln(eᵏ) = ▢ → **k** |
| `exact-form` | choice | Exact solution of e^{2x} = 5? → **½ ln 5**. Wrong options are ln(5/2), 2 ln 5 and 0.80, each with a `why`. |

---

## 10. Not in this version

Built since (19 October): the **reviews page** (`/learn/reviews`), the **REVIEWS · n** nav count and the Progress page's **Outstanding reviews** count, all from `GET /api/reviews/due`. See [reviews-page.md](reviews-page.md). A link with `?tab=review` opens a question on its Review tab.

These come later and build on the same `reviewStates` collection:
- **A "Review" column in the questions table** (Locked / Due · 2 / Next in 3 days).
- ~~**Lesson cards**~~: built 20 October 2026. They're stored on the lesson document's `review` array, keyed `lesson:<slug>#<card id>`, and unlock when the lesson is complete. See [lessons.md](lessons.md#7-review-cards).
- **"Review all"** on the reviews page: one session mixing every due card across topics, the most effective way to review.
