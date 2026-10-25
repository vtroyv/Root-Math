# Reviews page: how it works

One place to see every review that's due, across all courses. Built 19 October 2026.

Open it from **REVIEWS** in the learn navigation, from **Go to reviews** on the Progress page, or go to `/learn/reviews`.

How the review cards themselves work (storage, scheduling, the Review tab) is in [question-reviews.md](question-reviews.md).

---

## 1. What the student sees

```
Reviews
Short, regular reviews stop what you've learned from fading. …
Year [All years ▾]   Course [All courses ▾]   Skill [Pick a year and course first ▾]
┌ Questions · 3 ┐ Lessons
Question                       Course            Skill        Cards due   Due
Completing the Square …        Pure · Year 12    Algebra …    2           4 days overdue
Exact Exponential Equation     Pure · Year 12    Exp & logs   1           Due today
```

- **Filters**: year, course and skill. Skill only unlocks once a single year *and* course are picked, because skills belong to one course. Changing year or course clears the skill.
- **Questions tab**: one row per question with cards due, **most overdue first**. The tab label shows how many questions have cards due (with the filters applied). Clicking a question opens it on its **Review tab** (`/learn/questions/<title>?tab=review`).
- **Lessons tab**: one row per lesson with cards due, with the same filters and columns. Clicking a lesson opens it on its Review tab. Lesson cards unlock when the whole lesson is complete (added 20 October 2026, see [lessons.md](lessons.md#7-review-cards)).
- **Nothing due**: "All caught up. Next review in 3 days."
- **Nothing unlocked**: "No review cards yet. Finish a question to unlock its review cards."

**Counts are questions, not cards.** "3" means 3 questions have something due; the Cards due column gives the card count. Each row links to one question, so counting cards would make the number bigger than the list.

**URL options**:
- `?course=edx-maths-1` opens with that course's year and course selected. The Progress page's link uses this.
- `?tab=lessons` opens on the Lessons tab.

## 2. Where else the due count appears

| Place | Shows | Scope |
|---|---|---|
| Nav: **REVIEWS · 3** | questions + lessons with cards due | all courses |
| Progress page: **Outstanding reviews** | "8 reviews due: 3 questions · 5 lessons" + **Go to reviews** (links with `?course=`), or "You're all caught up. Next review tomorrow." | the course selected on the radar |

## 3. How it fits together

```
/learn/reviews, LearnNav, Progress page card
   │  useGetDueReviewsQuery(today)                      (one cached RTK query, shared by all three)
   ▼
GET /api/reviews/due?today=2026-10-19                    (api/reviews/due/route.js)
   │  auth()                        → userId (never from the URL)
   │  getAllReviewStates(userId)    → every reviewStates doc: { cardKey, source, due }
   │  getQuestionSummaries(titles)  → { title, branch, year, topic } of those questions
   │  summariseQuestionReviews(...)  (src/lib/reviews/due.js, pure)
   ▼
{ questions: [{ title, label, href, courseId, skillId, skillName, cardsDue, dueSince, nextDue }],
  lessons:   [{ slug,  label, href, courseId, skillId, skillName, cardsDue, dueSince, nextDue }] }
```

- **Filtering happens in the browser.** A student has about 3 cards per finished question, so the whole list is small.
- **Course and skill** use the same matching as the Progress page (`branch` + `year` pick the course, `topic` picks the skill; see [progress-page.md](progress-page.md) section 4). A question whose topic matches no skill still appears, with "–" as its skill, when the skill filter is off.
- Cards whose question has been deleted are left out.

**Keeping the count fresh** (RTK Query tag `{ type: 'Reviews', id: 'DUE' }`):
- rating a card refreshes it;
- the question route returns `newlyUnlocked: true` when it has just created schedules (a question finished), and the browser then refreshes it, because new cards are due today;
- the reviews page and the Progress page refetch every time they're opened, because cards turn due overnight without anything else changing.

## 4. Files

| File | Change |
|---|---|
| [reviews/due.js](../reviews/due.js) | **New.** `summariseQuestionReviews` (group by question, due/next dates, sort) and `locateQuestion` (course + skill). |
| [api/reviews/due/route.js](../../app/api/reviews/due/route.js) | **New.** `GET /api/reviews/due?today=`. |
| [learn/reviews/page.js](../../app/%28authenticated%29/learn/reviews/page.js) | **New.** The page. |
| [mongodb/utils.js](../mongodb/utils.js) | New `getAllReviewStates` and `getQuestionSummaries`. |
| [redux/slices/apiSlice.js](../redux/slices/apiSlice.js) | New `getDueReviews` query; `rateReviewCard` and newly unlocked cards refresh it. |
| [api/reviews/question/[title]/route.js](../../app/api/reviews/question/%5Btitle%5D/route.js) | Returns `newlyUnlocked`. |
| [learn/LearnNav.js](../components/learn/LearnNav.js) | **REVIEWS · n** link after PROGRESS. |
| [learn/progress/page.js](../../app/%28authenticated%29/learn/progress/page.js) | Outstanding reviews card is now a count + link. |
| [mastery/computeMastery.js](../mastery/computeMastery.js) | Dropped the placeholder `reviews` fields; exports `normalise` and `formatTitle` for `due.js`. |
| [questions/feedback/index.js](../components/questions/feedback/index.js) + the question page | `?tab=review` opens the Review tab. |
| [learn/Breadcrumbs.js](../components/learn/Breadcrumbs.js) | "Reviews" crumb. |

## 5. Testing

- `summariseQuestionReviews` checked with sample data: grouping, due count, oldest due date, next date, most-overdue-first order, unmatched topics, missing branch, deleted questions and lesson cards ignored.
- Lint clean on the new files. The page compiles and renders; `?course=edx-stats-2&tab=lessons` preselects Year 13 · Statistics and opens Lessons. The API returns 401 when signed out.
- **Not yet checked in a browser while signed in.**

## 6. Not in this version

- **Review all**: a button that starts one mixed session of every due card. It would go at the top of this page.
- **On phones** the question page opens on its Question pane; `?tab=review` selects the Review tab inside the Feedback pane, so the student taps **Instructions, Feedback and Solutions** to see it.
