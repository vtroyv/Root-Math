# Questions page (`/learn/questions`)

Redesigned 25 Oct 2026 to match the course, Reviews and Progress pages. Code: [`src/lib/components/learn/questions/`](../components/learn/questions/).

| Piece | File | What it does |
| --- | --- | --- |
| Page | `QuestionBank.js` | Header panel (questions left in your courses, and a button for the next one), the table, the right column |
| Table rows and filters | `rows.js` | Pure functions: `toRows`, `filterRows`, `pageWindow`, `tally` |
| Filter controls | `Filters.js` | `FilterMenu` (a filter button with a dropdown) and `CourseTree` (the nested course checkboxes) |
| Progress card | `QuestionProgress.js` | Questions complete in the ticked courses, by difficulty or by topic |
| Activity map | `ActivityMap.js` | A month of days shaded by daily goals, plus the goals editor |

## Table

- **Columns:** Status, Question, Course, Topic and Difficulty. It shows 20 questions a page, with First / Previous / page numbers / Next / Last.
- **Status:**
  - **Progress:** Complete, In progress or Not started. "In progress" is the old "Incorrect": submitted, but not for full marks. These are the same words as the course and Progress pages.
  - **Access:** Unlocked, Locked or Both. The ⓘ note in the menu explains what they mean.
- **Locked and unlocked:** a question is locked when its course isn't in the student's Clerk `publicMetadata.courses` (`coursesForUser` in [`courses.js`](../courses/courses.js)). Students without that list see every course, so nothing is locked until subscriptions fill it in.
  - The table opens on **Unlocked** only. The footer says how many locked questions are hidden and has a **Show them** link.
  - Locked rows show a lock and aren't links. The question page itself doesn't check access yet.
- **Course:** nested checkboxes for qualification › component › year, built by `courseTree()` from `COURSES`. Add Further Maths, TMUA (`component: 'Paper 1'`, no year) or STEP (qualification only) to `COURSES` and they appear here.
- **Search** matches the name, topic, difficulty and course (e.g. "statistics year 13"), but not locked or unlocked. Every word must match.
- **Difficulty** is compared case-insensitively, so `"exam"` and `"Exam"` both count as Exam.

A question's course comes from its `branch` and `year`, using `locateQuestion` in [`reviews/due.js`](../reviews/due.js). `GET /api/questions` adds it to each question as `courseId`, or `null` when no course matches. Those questions are listed as "Not in a course" and are never locked.

## Progress card

It uses the same course checkboxes as the table, but its own selection, which starts on the student's courses. **My courses** resets it.

It counts the questions that really exist in the ticked courses: the ring shows complete out of total, and **By difficulty** / **By topic** break that down.

## Activity map and daily goals

Each day is shaded by the average share of the student's daily goals met, with each goal capped at 100%. A goal of 0 is switched off.

| Goal | Default | Counted by |
| --- | --- | --- |
| Questions | 3 | `POST /api/mark`: different questions submitted that day |
| Review cards | 10 | `POST /api/reviews/rate`: every card rated |
| Study time (minutes) | 20 | [`StudyTimer.js`](../components/learn/StudyTimer.js) in the learn layout |

`StudyTimer` counts a minute when the tab is visible and the student clicked, typed, scrolled or touched in it. It sends the minutes to `POST /api/activity` every 5 minutes, and when the tab is hidden or closed.

Lessons finished are counted too (`POST /api/lesson/<slug>/progress`, on first completion). They show in a day's details but aren't a goal.

**Storage:**
- **Activity:** one document per student per day in the `dailyActivity` collection: `{ userId, day, questions: [titles], lessons: [slugs], reviews, minutes }`. Days are the student's local date: the browser sends `today` with marks, ratings and lesson saves.
- **Goals:** Clerk `unsafeMetadata.dailyGoals`, edited from the card.

**Read it with** `GET /api/activity?from=YYYY-MM-DD&to=YYYY-MM-DD`. The maths is in [`src/lib/activity/goals.js`](../activity/goals.js).

**History starts on 25 Oct 2026:** activity from before this change wasn't recorded, so earlier days show as empty.
