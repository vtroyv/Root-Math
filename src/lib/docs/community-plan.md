# Community: comments, votes and a Discuss page (plan)

A plan for adding real comments (with replies and up/down votes) to lessons and questions, and a LeetCode-style **Discuss** page. Nothing here is built yet. It's written so you can understand every piece, and build it yourself if you want to.

Related docs: [lessons.md](lessons.md), [question-display.md](question-display.md), [questions-page.md](questions-page.md).

---

## Contents

1. [Is it a good idea?](#1-is-it-a-good-idea)
2. [What exists today](#2-what-exists-today)
3. [Build it yourself, or use a hosted service?](#3-build-it-yourself-or-use-a-hosted-service)
4. [Packages](#4-packages)
5. [How it fits together](#5-how-it-fits-together)
6. [The data (MongoDB collections)](#6-the-data-mongodb-collections)
7. [Votes: the tricky part](#7-votes-the-tricky-part)
8. [Sorting: Top, New, Best and Hot](#8-sorting-top-new-best-and-hot)
9. [The API routes](#9-the-api-routes)
10. [The front end](#10-the-front-end)
11. [The Discuss page](#11-the-discuss-page)
12. [Safety, moderation and the law (students are under 18)](#12-safety-moderation-and-the-law-students-are-under-18)
13. [Getting people to actually post](#13-getting-people-to-actually-post)
14. [Build order](#14-build-order)
15. [Files you'd create](#15-files-youd-create)
16. [Testing checklist](#16-testing-checklist)
17. [Glossary](#17-glossary)

---

## 1. Is it a good idea?

**Yes, with three caveats.**

Why it helps:
- **AI can write a lesson, but it can't be a community.** Students who help each other, joke about a hard question and come back to see replies are something a chatbot doesn't replace. Every useful comment also makes the lesson better for the next student.
- **It keeps students coming back between study sessions.** "Someone replied to you" is a reason to open the site.
- **It's free content.** Good questions and answers in the comments are extra explanations you didn't have to write.

The caveats:
1. **An empty forum looks dead, and that's worse than no forum.** Comments under lessons and questions work from day one, because students are already there. A separate Discuss page needs a few hundred students using the site every week before it feels alive. Build comments first and Discuss later (see [section 14](#14-build-order)).
2. **Most of your users are under 18.** That brings legal duties and real safeguarding responsibilities (see [section 12](#12-safety-moderation-and-the-law-students-are-under-18)). Moderation is part of the feature, not an extra.
3. **In maths, a popular answer can be wrong.** You'll want a way to mark the correct answer: a **staff** badge and pinned comments from you, and later "accepted answer" on Discuss posts.

So the real advantage over AI is the combination: lessons and videos you made, marking students trust, *and* a community that's active and kept safe.

---

## 2. What exists today

- [CommentsPane.js](../components/learn/lessons/feedback/CommentsPane.js) (the lesson page's **Comments** tab) is a **mock**. It starts with 3 hard-coded comments and keeps votes and replies only in React state, so nothing is saved and every student sees the same fake comments.
- The question page's **Comments** tab ([feedback/index.js](../components/questions/feedback/index.js)) has a tab heading but **no content behind it**.
- Things you can reuse: **Clerk** for who's signed in, **MongoDB** (the `RootMath` database), the **API route pattern** (e.g. [progress/route.js](../../app/api/lesson/%5Bslug%5D/progress/route.js)), **RTK Query** in [apiSlice.js](../redux/slices/apiSlice.js) for fetching and caching, and **KaTeX**, which already draws the maths.

---

## 3. Build it yourself, or use a hosted service?

| Option | What it is | Verdict |
|---|---|---|
| **Build it yourself** (this plan) | Your own collections, API routes and components | **Recommended.** Comments are tied to your lessons, questions, Clerk accounts and (later) reputation. You control moderation, which matters with under-18s, and you own the data. |
| **Disqus** | Drop-in comment widget | **Avoid.** Shows ads and tracks users across sites, which is wrong for children. |
| **Giscus / Utterances** | Comments stored as GitHub Discussions | **Avoid.** Students would need GitHub accounts. |
| **Discourse** | A full forum, self-hosted or paid hosting | **Reasonable for Discuss only.** It's mature, with moderation, trust levels and search built in. It can share log-ins with Clerk through its "DiscourseConnect" single sign-on. But it's a separate site that won't feel like RadixMaths, and you can't easily link posts to your questions. |
| **Liveblocks / Velt / GetStream** | Paid comment/feed APIs | Overkill and costly. They're aimed at collaboration tools or social feeds. |

**Why building it is realistic:** a basic comments system is three collections, about six API routes and four React components. Building it yourself is mostly about getting votes and moderation right, and the sections below cover both.

---

## 4. Packages

### Already installed, reused

| Package | Used for |
|---|---|
| `next` (14, App Router) | Pages and API route handlers |
| `@clerk/nextjs` | Who's signed in (`auth()` on the server), usernames, admin role |
| `mongodb` (driver v6) | Storing comments, votes and posts |
| `@reduxjs/toolkit` (RTK Query) | Fetching comments, caching, and instant ("optimistic") vote updates |
| `katex` | Drawing maths in comments (through `rehype-katex` below) |
| `reactstrap`, `bootstrap-icons` | Buttons, tabs and the ▲▼ icons. Reuse the existing `rm-` / `learn-` styles: colour changes only, no hover movement |

### New

| Package | Why | Notes |
|---|---|---|
| **`react-markdown`** | Lets students write **bold**, lists and `code` in comments, and turns that text into React elements | **Safe by default.** It doesn't render raw HTML, so a student can't inject `<script>`. Never add `rehype-raw`. |
| **`remark-math`** + **`rehype-katex`** | Maths in comments: `$x^2$` inline, `$$...$$` on its own line | Uses the KaTeX you already have, so it looks the same as your lessons. |
| **`zod`** | Checks every request body on the server, e.g. "body is a string of 1–5,000 characters" | Never trust what the browser sends. Zod gives a clear error when it's wrong. |
| **`obscenity`** | Profanity filter that also catches disguised spellings ("f*ck", "fvck") | A first line of defence before human review. |

### Probably not needed

| Package | Instead |
|---|---|
| `date-fns` / `dayjs` for "10 hours ago" | The built-in `Intl.RelativeTimeFormat` does it with no extra package. |
| `@upstash/ratelimit` + Redis | Start with a simple MongoDB count ([section 9](#9-the-api-routes)). Switch if you get big. |
| A rich-text editor (TipTap, Quill) | A plain `<textarea>` with a **Preview** toggle is enough, and simpler to keep safe. |

Install: `npm install react-markdown remark-math rehype-katex zod obscenity`

---

## 5. How it fits together

```
Browser (React)                              Next.js server                         MongoDB "RootMath"
─────────────────                            ─────────────────                      ──────────────────
CommentsPanel thread="lesson:pascals-triangle:part-2"
  │  useGetCommentsQuery ──── GET /api/comments?thread=…&sort=best ──► find comments   ─► comments
  │                                                                    + my votes      ─► votes
  │  ▲ click ─► useVoteMutation
  │     (score changes on screen straight away: optimistic update)
  │                     ──── POST /api/comments/<id>/vote {value:1} ─► auth() → userId
  │                                                                    upsert vote      ─► votes
  │                                                                    $inc score       ─► comments
  │  Post ─► useAddCommentMutation
  │                     ──── POST /api/comments {thread, parentId, body}
  │                                                                    zod check, rate limit,
  │                                                                    profanity filter → insert ─► comments
  │  Report ─► POST /api/reports ─────────────────────────────────────► insert, auto-hide at 3 ─► reports
```

**The key idea is a `thread` key.** Every comment belongs to one thread, named by a string:

| Where | Thread key |
|---|---|
| A lesson part | `lesson:<lessonSlug>:<partId>`, e.g. `lesson:pascals-triangle:p2` |
| A question | `question:<questionTitle>` |
| A Discuss post | `post:<postId>` |

So **one** `comments` collection, **one** set of API routes and **one** `CommentsPanel` component serve lessons, questions and Discuss. Comments on lessons are per **part**, so a comment about part 3 doesn't show on part 1.

---

## 6. The data (MongoDB collections)

### `comments`

```js
{
  _id: ObjectId,
  thread: 'lesson:pascals-triangle:p2',
  parentId: null,               // null = top-level; otherwise the _id of the top-level comment it replies to
  authorId: 'user_2abc…',       // Clerk userId, always taken from auth(), never from the request body
  authorName: 'surd_lord',      // username copied in when posting, so lists don't need a Clerk lookup
  body: 'Why is the middle term $2xy$?',   // the Markdown + LaTeX text exactly as typed
  ups: 4, downs: 1, score: 3,   // kept up to date by the vote route
  best: 0.41,                   // a precomputed sort value (section 8)
  replyCount: 2,
  staff: false,                 // posted by you / a moderator: shows a badge
  pinned: false,                // staff can pin a comment to the top
  status: 'visible',            // 'visible' | 'hidden' (by moderation) | 'deleted' (by the author)
  reportCount: 0,
  createdAt: Date, editedAt: null
}
```

Indexes (they keep queries fast as the collection grows):
```js
comments.createIndex({ thread: 1, parentId: 1, best: -1 })      // "Best" lists
comments.createIndex({ thread: 1, parentId: 1, createdAt: -1 })  // "New" lists
comments.createIndex({ authorId: 1, createdAt: -1 })             // rate limiting, a user's history
```

**Replies only go one level deep** (like YouTube and LeetCode, unlike Reddit). Replying to a reply attaches it to the same top-level comment and starts the text with `@username`. Infinite nesting gets unreadable in a narrow side pane, and it's much harder to load and display.

**Deleting is "soft":** set `status: 'deleted'` and show "[deleted]". The comment isn't removed, so its replies still make sense and moderators can still see what was said.

**Copying the username into each comment** (`authorName`) is called *denormalising*. The trade-off is that if a student changes their username, their old comments keep the old name. That's acceptable, and much faster than asking Clerk for a name for every comment.

### `votes`

```js
{ _id, targetType: 'comment', targetId: ObjectId, userId: 'user_2abc…', value: 1 /* or -1, or 0 */, createdAt, updatedAt }
```
```js
votes.createIndex({ targetId: 1, userId: 1 }, { unique: true })  // one vote per person per comment, enforced by the database
```

### `reports`

```js
{ _id, targetType: 'comment', targetId, reporterId, reason: 'rude' | 'spam' | 'answer-spoiler' | 'unsafe' | 'other',
  note, status: 'open' | 'resolved', createdAt, resolvedBy, resolution }
```

### `profiles` (for Discuss and reputation, later)

```js
{ _id: 'user_2abc…' /* the Clerk userId */, username, reputation: 0, banned: false, createdAt }
```

### `posts` (Discuss, later)

```js
{ _id, title, body, category: 'help', ref: { type: 'question', id: 'Completing-the-Square-Exam-Style' } /* optional link */,
  authorId, authorName, ups, downs, score, hot, commentCount, lastActivityAt,
  pinned, staff, acceptedCommentId: null, status: 'visible', createdAt, editedAt }
```

---

## 7. Votes: the tricky part

A vote can be **new** (0 → ▲), **changed** (▲ → ▼, a swing of 2) or **removed** (▲ → 0). The comment's `score` must always equal the total of its votes, even if a student double-clicks or two requests arrive at the same moment.

**The naive way has a bug:** "read my old vote, work out the difference, save" in separate steps. If two requests arrive together, both read "no vote yet" and the score goes up by 2.

**The safe way:** update the vote document and get back its **previous** value in one database operation. The unique index guarantees there's only ever one vote document per person per comment.

```js
// POST /api/comments/[id]/vote   body: { value: 1 | -1 | 0 }
const { userId } = await auth();
const now = new Date();

// 1. One step: set my vote and get the vote as it was *before* (null if I'd never voted)
const before = await votes.findOneAndUpdate(
  { targetId: commentId, userId },
  { $set: { value, targetType: 'comment', updatedAt: now }, $setOnInsert: { createdAt: now } },
  { upsert: true, returnDocument: 'before' },
);
const old = before?.value ?? 0;
if (old === value) return Response.json({ ok: true });   // clicking the same arrow twice changes nothing

// 2. Adjust the counts by the difference (e.g. ▲ → ▼: score −2, ups −1, downs +1)
const after = await comments.findOneAndUpdate(
  { _id: commentId },
  { $inc: {
      score: value - old,
      ups: Number(value === 1) - Number(old === 1),
      downs: Number(value === -1) - Number(old === -1),
  } },
  { returnDocument: 'after' },
);

// 3. Recompute the "best" sort value from the new counts (section 8)
await comments.updateOne({ _id: commentId }, { $set: { best: wilson(after.ups, after.downs) } });
```

Edge cases:
- **Two first votes at exactly the same moment:** one insert fails with a "duplicate key" error (code `11000`) because of the unique index. Catch it and run step 1 again.
- **Voting on your own comment:** return 400. Each comment starts on score 0.
- **Clicking ▲ when you've already voted ▲:** the front end sends `value: 0`, which removes the vote, as on Reddit.
- **A safety net:** if the counts ever drift, a small script can recount `votes` for each comment and fix them.

---

## 8. Sorting: Top, New, Best and Hot

| Sort | What it does | Where |
|---|---|---|
| **New** | Newest first (`createdAt` descending) | Everywhere |
| **Top** | Highest score first | Everywhere |
| **Best** | Most *reliably* good. A comment with 9 ▲ and 1 ▼ beats one with 1 ▲ and 0 ▼. | Comments (the default) |
| **Hot** | Popular **and** recent, so new posts can still reach the top | Discuss (the default) |

**Best** uses the *Wilson score lower bound*. It asks: "given these votes, how sure can we be that most people like it?" Few votes mean a low value, because the evidence is weak. This is what Reddit uses for "Best".

```js
function wilson(ups, downs, z = 1.96) {          // z = 1.96 means "95% confident"
  const n = ups + downs;
  if (n === 0) return 0;
  const p = ups / n;                                // the share of votes that are ▲
  return (p + z*z/(2*n) - z*Math.sqrt((p*(1 - p) + z*z/(4*n)) / n)) / (1 + z*z/n);
}
```

**Hot** is based on Reddit's formula. Votes count logarithmically: the first 10 votes matter as much as the next 90. Newer posts get a steady boost, so a post needs 10× the votes to beat one posted 12.5 hours later.

```js
function hot(score, createdAt) {
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = Math.sign(score);
  const seconds = createdAt.getTime() / 1000 - 1735689600;   // seconds since 1 Jan 2025
  return sign * order + seconds / 45000;                      // 45,000 s = 12.5 hours
}
```

Both are **stored on the document** and updated whenever someone votes, so sorting is a simple index lookup rather than a calculation on every page load.

**Pinned and staff comments** always come first: sort by `{ pinned: -1, best: -1 }`.

---

## 9. The API routes

Same pattern as your existing routes: `auth()` for the user, `try/catch`, `Response.json`.

| Route | Does |
|---|---|
| `GET /api/comments?thread=…&sort=best&page=1` | Top-level comments (20 per page), each with its first few replies, plus **my vote** on each (one `votes.find({ userId, targetId: { $in: ids } })`) |
| `GET /api/comments/[id]/replies` | All replies to one comment ("View 12 more replies") |
| `POST /api/comments` `{ thread, parentId, body }` | Post a comment or reply |
| `PATCH /api/comments/[id]` `{ body }` | Edit your own comment (sets `editedAt`, shows "edited") |
| `DELETE /api/comments/[id]` | Soft-delete your own comment (or any comment, as staff) |
| `POST /api/comments/[id]/vote` `{ value }` | [Section 7](#7-votes-the-tricky-part) |
| `POST /api/reports` `{ targetType, targetId, reason, note }` | Report a comment. At 3 reports from different users it's hidden until reviewed. |
| `GET/PATCH /api/admin/reports` | The moderation queue: list open reports, then hide/restore/ban (staff only) |

**What `POST /api/comments` checks, in order:**
1. **Signed in:** `auth()` returns a `userId`, otherwise 401.
2. **Valid:** zod checks the body, e.g. `z.object({ thread: z.string().regex(/^(lesson|question|post):/), parentId: z.string().nullable(), body: z.string().trim().min(1).max(5000) })`.
3. **The thread exists:** the lesson, question or post is real (stops junk threads being created).
4. **Not banned:** `profiles.banned` isn't true.
5. **Rate limit:** no more than 5 comments in the last minute and 50 in the last day. That's `comments.countDocuments({ authorId: userId, createdAt: { $gt: oneMinuteAgo } })`, which the `authorId` index makes fast.
6. **Profanity:** `obscenity` finds a match → reject with "Please keep it friendly", or save as `hidden` for review.
7. **Links:** new accounts (e.g. under 7 days old) can't post links. This stops spam.
8. **Insert**, and `$inc` `replyCount` on the parent if it's a reply.

**Who is staff?** In the Clerk dashboard, set your user's **public metadata** to `{ "role": "admin" }`. On the server, check it with `(await clerkClient.users.getUser(userId)).publicMetadata.role === 'admin'`. For speed later, you can add the role to Clerk's session token and read it from `auth().sessionClaims`.

**Usernames:** turn on **username** in Clerk (User & Authentication → Username) and make it required. Comments show the username only, **never a real name or email address** (see [section 12](#12-safety-moderation-and-the-law-students-are-under-18)).

---

## 10. The front end

### RTK Query (in `apiSlice.js`)

Add `'Comments'` to `tagTypes`, then add these endpoints:

```js
getComments: builder.query({
  query: ({ thread, sort, page }) => ({ url: '/comments', params: { thread, sort, page } }),
  providesTags: (result, error, { thread }) => [{ type: 'Comments', id: thread }],
}),
addComment: builder.mutation({
  query: (body) => ({ url: '/comments', method: 'POST', body }),
  invalidatesTags: (result, error, { thread }) => [{ type: 'Comments', id: thread }],   // refetch the list
}),
voteComment: builder.mutation({
  query: ({ id, value }) => ({ url: `/comments/${id}/vote`, method: 'POST', body: { value } }),
  // Optimistic update: change the score on screen now, and undo it if the server says no
  async onQueryStarted({ id, value, listArgs }, { dispatch, queryFulfilled }) {
    const patch = dispatch(apiSlice.util.updateQueryData('getComments', listArgs, (draft) => {
      const c = draft.comments.find((x) => x._id === id) ?? draft.comments.flatMap((x) => x.replies).find((x) => x._id === id);
      if (!c) return;
      c.score += value - (c.myVote ?? 0);
      c.myVote = value;
    }));
    try { await queryFulfilled; } catch { patch.undo(); }
  },
}),
```

*Optimistic update* means the arrow and score change the instant you click, without waiting about 200 ms for the server. If the server rejects the vote, `patch.undo()` puts it back. You already use the same `onQueryStarted` pattern for review cards.

### Components

| Component | Does |
|---|---|
| `CommentsPanel({ thread })` | Sort tabs (Best / New / Top), the composer, the list and "Load more". Used in the lesson's Comments tab, the question's Comments tab and Discuss posts. |
| `CommentItem({ comment })` | Vote column (▲ score ▼) · username (+ **Staff** badge) · "3 hours ago" · body · Reply / Edit / Delete / Report · its replies |
| `CommentComposer({ thread, parentId })` | A `<textarea>`, a **Preview** toggle that shows the rendered Markdown + maths, a character count, and Post |
| `CommentBody({ text })` | Renders the text with Markdown and maths (below) |
| `VoteButtons({ score, myVote, onVote })` | ▲/▼ coloured teal when chosen. A colour change only, no movement. |

```jsx
// CommentBody.js: safe Markdown + LaTeX
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default function CommentBody({ text }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{ a: (props) => <a {...props} target="_blank" rel="nofollow noopener noreferrer" /> }}
    >
      {text}
    </ReactMarkdown>
  );
}
```

"10 hours ago" without a package:
```js
const rtf = new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' });
function ago(date) {
  const s = (new Date(date) - Date.now()) / 1000;
  for (const [unit, secs] of [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]])
    if (Math.abs(s) >= secs) return rtf.format(Math.round(s / secs), unit);
  return 'just now';
}
```

### Answer spoilers on questions

Comments on a question can give the answer away. Until a student has **submitted the question at least once**, show the comments blurred, with "Comments may contain the answer. **Show anyway**." The question page already knows the attempt count (`progress.attempts`), so this is a few lines.

---

## 11. The Discuss page

Like LeetCode's Discuss: a list of posts, each with its own comment thread.

| Route | Page |
|---|---|
| `/learn/discuss` | Category tabs · sort (Hot / New / Top) · list of posts (title, author, time, score, comment count) · **New post** button |
| `/learn/discuss/new` | Title, category, body (same composer + preview), optional "This is about…" link to a question or lesson |
| `/learn/discuss/[id]` | The post, its votes, and `<CommentsPanel thread={'post:' + id} />` |

**Categories (a suggestion):** Help with a question · Exam tips & revision · Study together · Show off (solved something hard, got your grade) · Feedback for RadixMaths. Keep it to five or six. Too many categories makes a quiet forum look even quieter.

**Make it feed itself:**
- **"Ask the community"** on every question page opens a new post, already linked to that question. Linked posts then show on the question ("3 discussions").
- **Accepted answer:** the person who asked can mark one comment as the answer, shown with a ✓ and pinned under the post.
- **Problem of the week:** a pinned post from you each Monday with a hard question, discussed through the week.

API: `GET/POST /api/posts`, `GET/PATCH/DELETE /api/posts/[id]`, `POST /api/posts/[id]/vote`. These are the same as the comment routes, with `hot` instead of `best`.

**Add it to the nav:** a **Discuss** link in [LearnNav.js](../components/learn/LearnNav.js).

---

## 12. Safety, moderation and the law (students are under 18)

*This is a summary to point you in the right direction, not legal advice. Read the official guidance linked from Ofcom's and the ICO's websites before launching comments.*

**The Online Safety Act 2023.** Any service where users can post content that other users see (a *user-to-user service*), with UK users, is covered. As I understand it, the duties include:
- an **illegal content risk assessment**, and measures to deal with illegal content;
- a **children's access assessment**. Your site is aimed at children, so it will be "likely to be accessed by children", which means a **children's risk assessment** and protecting them from harmful content;
- easy **reporting and complaints** tools, and acting on reports;
- clear **terms of service** explaining how you handle all of this.

Ofcom publishes codes of practice and simpler guidance for small services. The duties have been coming into force since 2025, so check the current position.

**The ICO Children's Code** (the Age Appropriate Design Code) covers children's personal data: high-privacy settings by default, collecting the minimum data, and no designs that nudge children into sharing more.

**What that means for the design:**

| Do | Don't (at least at first) |
|---|---|
| Usernames only, with a warning not to use your real name | Real names, photos or school names on profiles |
| A **Report** button on every comment and post | **Direct messages.** Private chat between users is the biggest safeguarding risk. Leave it out. |
| Auto-hide at 3 reports, plus a moderation queue you check daily | Image or file uploads (they're hard to moderate) |
| Profanity filter, rate limits, no links for new accounts | Public profile pages listing everything a student has posted |
| Ban and unban, and an audit trail (who hid what, and when) | Showing which students are online |
| Community guidelines, linked next to every composer | Letting brand-new accounts post on Discuss straight away (comment-only for the first day) |
| A named **safeguarding contact** (safeguarding@radixmaths.co.uk) and a process for serious reports | Anonymous posting. Every post links to a Clerk account. |

**Moderation queue** (`/learn/admin/moderation`, staff only): open reports with the comment, its thread link, who reported it and why. Actions are **Dismiss**, **Hide**, **Hide + warn** and **Ban user**, and every action is recorded in the report.

**Optional, later: automatic moderation.** Send each new comment to an AI moderation service and hold anything flagged for review. OpenAI has a free moderation endpoint, or you could call Claude to classify comments. Use it as an extra filter, not instead of your own review.

---

## 13. Getting people to actually post

Most people only read. A common rule of thumb is that only around 1 in 100 users posts regularly, so plan for it:

- **Seed every lesson part** with one pinned staff comment, e.g. "Common mistake: forgetting the middle term. What tripped you up?" An empty box gets no comments, and a question invites an answer.
- **Show the count on the tab:** "Comments · 4" (like your "Review · 3").
- **Prompt at the right moment:** after a student gets a task right, show "Explain how you did it in the comments".
- **Reply to everything early on.** In the first months, a reply from the founder is the best reason for a student to come back.
- **Reputation, later:** +10 for each ▲ on your comments, +15 for an accepted answer, small badges, and a weekly "most helpful" shout-out.
- **Notifications, later:** "Someone replied to your comment", via a `notifications` collection and a bell in the nav. Weekly email digests only with consent.

---

## 14. Build order

| Phase | What | Rough effort | When |
|---|---|---|---|
| **1. Real comments** | Comments on lesson parts and questions: post, one level of replies, ▲▼ votes, Best/New/Top, delete own, Report (auto-hide at 3), profanity filter, rate limit, required usernames, Staff badge and pinning | 1–2 weeks | Before the January launch |
| **2. Moderation** | Moderation queue page, ban/unban, edit, answer-spoiler blur on questions, comment counts on tabs, community guidelines page | ~1 week | With phase 1 if possible, and before many users arrive |
| **3. Discuss** | Posts, categories, Hot sort, "Ask the community" from questions, accepted answers, Problem of the week | 1–2 weeks | Once a few hundred students use the site every week |
| **4. Engagement** | Reputation and badges, notifications, search (MongoDB text index or Atlas Search) | 2+ weeks | After the exam season |

Phase 1 is cheap, makes the existing (fake) Comments tab real, and works even with few users. Phase 3 is where the "empty forum" risk lives, so wait until there are people to fill it.

---

## 15. Files you'd create

```
src/app/api/comments/route.js                    GET list, POST new
src/app/api/comments/[id]/route.js               PATCH edit, DELETE
src/app/api/comments/[id]/replies/route.js       GET all replies
src/app/api/comments/[id]/vote/route.js          POST vote
src/app/api/reports/route.js                     POST report
src/app/api/admin/reports/route.js               GET queue, PATCH resolve (staff)
src/lib/community/collections.js                 getCommentsCollection(), getVotesCollection(), … + createIndexes()
src/lib/community/scores.js                      wilson(), hot()  (pure functions, easy to test)
src/lib/community/validate.js                    zod schemas, profanity check, link check, rate limit
src/lib/community/auth.js                        isStaff(userId)
src/lib/components/community/CommentsPanel.js
src/lib/components/community/CommentItem.js
src/lib/components/community/CommentComposer.js
src/lib/components/community/CommentBody.js
src/lib/components/community/VoteButtons.js
src/app/(authenticated)/learn/admin/moderation/page.js
-- phase 3 --
src/app/api/posts/route.js, src/app/api/posts/[id]/route.js, src/app/api/posts/[id]/vote/route.js
src/app/(authenticated)/learn/discuss/page.js, new/page.js, [id]/page.js
```
Plus: swap the mock [CommentsPane.js](../components/learn/lessons/feedback/CommentsPane.js) for `<CommentsPanel thread={…} />`, and give the question page's empty Comments tab the same panel.

---

## 16. Testing checklist

- **Votes:** ▲, ▲ again (removed), ▲ then ▼ (score −2), double-click quickly (still counted once), voting on your own comment (refused), signed out (401).
- **Scores match:** after a burst of votes, each comment's `score` equals the total of its `votes`.
- **Sorting:** Best puts 9▲/1▼ above 1▲/0▼; pinned always comes first; New is newest first.
- **Safety:** `<script>alert(1)</script>` in a comment shows as plain text; maths renders; links open in a new tab with `nofollow`; profanity is blocked; the 6th comment in a minute is refused; 3 reports hide a comment; banned users can't post.
- **Privacy:** no real name or email address anywhere in API responses (check the Network tab).
- **Threads:** a comment on lesson part 2 doesn't appear on part 3; question comments stay blurred until the first submission.

---

## 17. Glossary

| Term | Meaning |
|---|---|
| **Thread key** | The string naming which page a comment belongs to, e.g. `question:Cube-It-or-Lose-It` |
| **Denormalise** | Copy a value (like the username) into each document so reading is fast, accepting it can go out of date |
| **Unique index** | A database rule that two documents can't have the same values, e.g. one vote per user per comment |
| **Upsert** | "Update it if it exists, otherwise insert it", in one step |
| **Soft delete** | Mark something deleted instead of removing it |
| **Optimistic update** | Change the screen before the server confirms, and undo it if the server refuses |
| **Rate limit** | A maximum number of actions per user per time period, which stops spam |
| **XSS** | Cross-site scripting: sneaking code into a page through user content. `react-markdown` without `rehype-raw` prevents it. |
| **Wilson score** | A "best" ranking that trusts many votes more than a few |
| **Hot score** | A ranking that mixes votes with how recent a post is |
