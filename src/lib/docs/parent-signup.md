# Parents: the share button and the sign-up list

How students tell a parent about RadixMaths, and how parents join their own mailing list. Built 8 November 2026. It reuses the Register Interest plumbing: see [register-interest.md](register-interest.md).

## How it works

```
Student registers at /register
  │  The thank-you panel shows "Tell a parent".
  │  Phone or tablet: "Send to a parent" opens the share sheet (WhatsApp, iMessage, email...).
  │  Laptop: "Copy message", "WhatsApp" (WhatsApp Web or the desktop app) and "Email".
  ▼
Parent opens /blog/radixmaths-for-parents
  │  Reads the guide. The sign-up form is under the article.
  │  POST /api/parent-signup
  ▼
Saved to MongoDB `parentSignups`, and a thank-you email goes to the parent.
```

## Why the student never types in the parent's email

Under PECR, marketing emails need the recipient's own consent. A child entering a parent's address isn't the parent agreeing, and the ICO treats "tell a friend" emails a company sends as that company's marketing. So:

- **The student sends the link from their own phone, WhatsApp or email.** We never see the parent's address.

### Why laptops don't get the share menu

Most laptop browsers now support the share feature too, but on Windows the share box offers Nearby Share and a few installed apps, not Gmail or WhatsApp Web, and the Mac menu is similar. So the share sheet is used only on touchscreens (the `pointer: coarse` media query). Laptops get "Copy message" first, because it works everywhere. The "Email" link opens the computer's default mail app, which is often an Outlook nobody has set up, so it comes last.
- **The parent signs up themselves,** with a box they must tick. That tick, with its exact wording, is the consent we store.

The pre-written message is deliberately plain, a link to a guide rather than an advert, and there's no reward for sharing. Keep it that way: an incentive or a sales pitch makes it look more like our marketing sent through the student.

This is general guidance, not legal advice.

## Files

| File | What it does |
|---|---|
| [components/home/RegisterInterest.tsx](../components/home/RegisterInterest.tsx) | `SendToParent`: the share button on the thank-you panel. The message is `PARENT_MESSAGE`. |
| [data/blogPosts.js](../data/blogPosts.js) | The `radixmaths-for-parents` post. `parentSignup: true` shows the form under it. |
| [components/home/BlogArticle.tsx](../components/home/BlogArticle.tsx) | Shows `ParentSignup` under any post with `parentSignup: true` |
| [components/home/ParentSignup.tsx](../components/home/ParentSignup.tsx) | The form: first name, email and the consent box |
| [forms/parents.js](../forms/parents.js) | `PARENT_WORDING` and `validateParentSignup()`, run in the browser and on the server |
| [forms/server.js](../forms/server.js) | `saveParentSignup()` and `markParentThankYouSent()` |
| [app/api/parent-signup/route.js](../../app/api/parent-signup/route.js) | The API route: spam trap, checks, 20 per IP per hour, save, then email |
| [email/templates.js](../email/templates.js) | `parentThankYou()` |

## The data in MongoDB

Database `RootMath`, collection **`parentSignups`**, one document per email address (unique index). It's kept apart from `registrations` so a student mailing never goes to parents, or the other way round.

```js
{
  email: "polly@example.com",       // lowercased
  firstName: "Polly",
  consent: {
    given: true,                    // always true: the form can't be sent without the tick
    wording: "Email me when RadixMaths launches, plus a few short emails...",
    answeredAt: ISODate("...")
  },
  thankYouSentAt: ISODate("..."),   // null until Resend accepts the email
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

Signing up twice updates the same record and doesn't send a second thank-you.

## Before emailing parents

- **Build the unsubscribe route first.** The privacy policy promises every email has one, and it doesn't exist yet (see [register-interest.md](register-interest.md), section 15).
- **Only send what the wording promised:** the launch, the early-access price and the free trial, plus a few short emails about how RadixMaths works.
- **The 12-month deletion** in the privacy policy applies here too, and also isn't automated yet.

## Not built yet

- No link from the parent's record to their child's registration. That would need the student's consent as well, and isn't needed for a launch email.
