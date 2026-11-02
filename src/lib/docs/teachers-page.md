# Teachers page: how it works

The page at `/teachers`. It gets teachers using the site before the teacher version opens in September 2027: they can request free resources and student workshops, try real questions without an account, and tell you what they need. Tutors and tuition agencies can use it too. Built 2 November 2026.

Email setup is shared with the other forms: see [register-interest.md](register-interest.md#4-setting-up-email-resend-and-godaddy). The plan behind the page is in `reports/Up Learn and UK schools strategy.md`.

---

## What's on the page

1. **Header:** the headline, and links to the form and the sample questions.
2. **Free resources:** PowerPoint lessons, worksheets, common mistakes sheets, cheat sheets and practice papers, each with an example image. **Nothing is ready to download yet.** Teachers ask through the form, and you make it and email it over.
3. **Try it yourself:** two real questions, marked without an account.
4. **Workshops:** free student workshops at schools, with prizes and extended free trials.
5. **Our aim:** less to do outside the classroom.
6. **What we're building:** a table with each feature's status, and an example dashboard image.
7. **Commitments:** what stays in teachers' control, and what we won't do.
8. **Request form:** name, work email, role, school or organisation, exam board, one resource, what it should cover, biggest problem, a workshop, trying it with one class, a 20-minute chat, and an email when the teacher version is ready.

**Keep this page true.** It has no statistics, school names, time-saved claims or the A/A\* guarantee, because there's no evidence for them yet. Before you add one, make sure you can show how it was measured. "Available on request" means you can really make it for a teacher now, so the resource bank, class tools, Further Maths for schools and school-wide sign-in say "Coming soon" until they exist.

**The example images** are in `public/images/teachers/`. They're original questions on binomial expansion. The dashboard uses made-up students and says so on the image. Class tools aren't built yet, so the status table says "Coming soon".

---

## The request form

```
Browser (TeacherForm.tsx)
  │  validateTeacherRequest() runs. If anything's wrong, show the errors and stop.
  │  POST /api/teacher-request
  ▼
API route (app/api/teacher-request/route.js)
  1. Hidden "website" field filled in? It's a bot: answer "ok" and do nothing.
  2. validateTeacherRequest() runs again.
  3. More than 10 requests from this IP address this hour? Answer 429.
  4. Save to the teacherRequests collection.
  5. At the same time:
       a. Email the request to CONTACT_INBOX, and record notifiedAt.
       b. Unless this address has had 3 replies today: send the automatic reply, and record autoReplySentAt.
  6. Answer { ok: true }.
```

- **Required:** name, email, role, school or organisation and exam board, plus at least one of a resource, a biggest problem or a ticked box. "What should it cover?" is required once a resource is chosen. Each request can ask for one resource.
- **Your inbox:** the subject starts `enquiry-contact-form: Teacher request`, so your existing rule puts it in **Enquiries**. Pressing Reply writes to the teacher.
- **Automatic reply:** the same "We've received your message" email as the contact form.
- **The page says you'll usually reply within 2 working days.** Keep to that, or change the wording in [TeacherForm.tsx](../components/home/TeacherForm.tsx) and [Teachers.tsx](../components/home/Teachers.tsx).

The record in MongoDB (database `RootMath`, collection **`teacherRequests`**):

```js
{
  name: "Scott Clarke",
  email: "s.clarke@example.sch.uk",   // lowercased
  role: "Head of maths",
  school: "Hawkins High School",
  board: "AQA",
  resource: "PowerPoint lesson",      // or null
  topic: "Year 12 binomial expansion", // or null
  problem: "...",                     // or null, line breaks kept
  wantsWorkshop: true,
  wantsClassTrial: false,             // interest only, no dates are promised
  wantsChat: true,
  updatesConsent: { given: true, wording: "...", answeredAt: ISODate("...") },
  createdAt: ISODate("..."),
  notifiedAt: ISODate("..."),         // null if your email didn't send
  autoReplySentAt: ISODate("...")     // null if the reply didn't send or was limited
}
```

**To find requests you never received by email,** filter on `{ notifiedAt: null }`. **To list who wants the launch email,** filter on `{ "updatesConsent.given": true }`. **To list who wants a workshop,** filter on `{ wantsWorkshop: true }`.

---

## The sample questions

`/api/sample-question` is public, unlike `/api/mark`, so it has three limits:

- It only serves and marks the titles in [marking/sampleQuestions.js](../marking/sampleQuestions.js).
- It refuses any question with a `working` or `explain` part, because those call the LLM and would cost money per visitor. **Only add auto-marked questions.** A question that gains one of those parts disappears from the page with a "couldn't load" message.
- It marks at most 60 attempts per IP address per hour.

Nothing is saved: no progress, no activity and no answers. The only record is the hashed rate limit counter, which MongoDB deletes itself.

The questions come from the `quizzes` collection, so editing or renaming one there changes the page too. If you rename one, update `sampleQuestions.js`.

---

## Files

| File | What it does |
|---|---|
| [components/home/Teachers.tsx](../components/home/Teachers.tsx) | The page and its wording, including the status table |
| [components/home/TeacherForm.tsx](../components/home/TeacherForm.tsx) | The form and thank-you panel |
| [components/home/TryItYourself.js](../components/home/TryItYourself.js) | The sample question cards. Loads the question code only on the first click |
| [components/home/SampleQuestion.js](../components/home/SampleQuestion.js) | Shows and marks one question without saving anything |
| [forms/teachers.js](../forms/teachers.js) | The role and resource lists, and `validateTeacherRequest()` |
| [forms/server.js](../forms/server.js) | `saveTeacherRequest`, `markTeacherRequest`, rate limits |
| [email/templates.js](../email/templates.js) | `teacherRequestNotification()` |
| [app/api/teacher-request/route.js](../../app/api/teacher-request/route.js) | The form's API route |
| [app/api/sample-question/route.js](../../app/api/sample-question/route.js) | The sample questions' API route |

---

## Privacy

The [privacy policy](../components/home/Privacy.tsx) lists this form. Requests count as messages, so they're kept for **12 months after you've dealt with them**. **Nothing deletes them automatically yet,** as with the contact form.

Teachers who want the launch email have consented to that one email topic. Don't add them to other marketing without asking.
