# Register Interest page: how it works

The form at `/register`. A visitor fills it in, their details are saved to MongoDB, and they get a thank-you email. Built 2 November 2026.

The Contact form shares most of its plumbing: see [contact-form.md](contact-form.md).

---

## Contents

1. [What the visitor sees](#1-what-the-visitor-sees)
2. [What happens when they submit](#2-what-happens-when-they-submit)
3. [Files](#3-files)
4. [Setting up email (Resend and GoDaddy)](#4-setting-up-email-resend-and-godaddy)
5. [Settings](#5-settings)
6. [The data in MongoDB](#6-the-data-in-mongodb)
7. [The checks on each field](#7-the-checks-on-each-field)
8. [The school search](#8-the-school-search)
9. [The thank-you email](#9-the-thank-you-email)
10. [Spam protection](#10-spam-protection)
11. [When something fails](#11-when-something-fails)
12. [Privacy and the law](#12-privacy-and-the-law)
13. [How to change common things](#13-how-to-change-common-things)
14. [Testing](#14-testing)
15. [Not built yet](#15-not-built-yet)

---

## 1. What the visitor sees

| Section | Fields |
|---|---|
| **Your details** | First name, last name, personal email address, mobile (optional) |
| **Your studies** | Course pills (pick at least one). A Level Maths, Further Maths and GCSE each then ask for an exam board. STEP and TMUA ask for nothing. |
| **Your school** (optional) | Search box, with **Other** always at the bottom of the list |
| **Marketing** | An unticked box: "Send me revision tips and offers too. I can unsubscribe at any time." |

- **Email and mobile** are checked as soon as the visitor leaves the field.
- **Every field** is checked when they press **Register my interest**. Problems appear in red under the field, and the cursor jumps to the first one.
- **A common email typo** gets a clickable prompt, e.g. `tommy@gmial.com` shows "Did you mean tommy@gmail.com?". It's only a suggestion and never blocks the form.
- **Once sent,** the form is replaced by "You're on the list, thank you!", with buttons for the blog and the home page.

---

## 2. What happens when they submit

```
Browser (RegisterInterest.tsx)
  │  validateRegistration() runs. If anything's wrong, show the errors and stop.
  │  POST /api/register-interest
  ▼
API route (app/api/register-interest/route.js)
  1. Hidden "website" field filled in? It's a bot: answer "ok" and do nothing.
  2. validateRegistration() runs again. The browser's check can be bypassed, this one can't.
  3. More than 30 attempts from this IP address this hour? Answer 429.
  4. Save to MongoDB (create, or update if this email has already registered).
  5. Never been thanked? Send the thank-you email and record when.
  6. Answer { ok: true }.
  ▼
Browser shows the thank-you panel.
```

**The save always comes before the email.** If Resend is down, the registration is still safe, and the visitor still sees success.

**Registering twice** updates the same record, with the newest answers replacing the old ones. No second email goes out, unless the first one failed to send.

---

## 3. Files

| File | What it does |
|---|---|
| [components/home/RegisterInterest.tsx](../components/home/RegisterInterest.tsx) | The page and form |
| [components/home/FormBits.tsx](../components/home/FormBits.tsx) | The red error line and the hidden spam trap, shared with Contact |
| [forms/registerInterest.js](../forms/registerInterest.js) | The course and exam board lists, the marketing wording, and `validateRegistration()` |
| [forms/shared.js](../forms/shared.js) | Email and mobile checks, and the typo suggestions, shared with Contact |
| [forms/server.js](../forms/server.js) | MongoDB code: saving, rate limits, indexes |
| [app/api/register-interest/route.js](../../app/api/register-interest/route.js) | The API route that runs the steps in section 2 |
| [email/send.js](../email/send.js) | Sends one email through Resend. The only file that knows which email provider we use. |
| [email/templates.js](../email/templates.js) | The wording and design of every email (`layout()` is the design) |
| [email/headerImage.js](../email/headerImage.js) | The logo and name at the top of every email, generated from [public/email/header.png](../../../public/email/header.png) |
| [socials.js](../socials.js) | Website address and social links, shared by the footer and emails |

---

## 4. Setting up email (Resend and GoDaddy)

**Until this is done, forms still save, but no emails are sent.** The server logs `RESEND_API_KEY is not set`.

1. **Create an account** at [resend.com](https://resend.com).
2. **Add a domain:** Domains → Add Domain → enter `mail.radixmaths.co.uk`.
   - Use the subdomain, not `radixmaths.co.uk`. Resend recommends it, and it keeps sending problems away from your main email domain's reputation.
3. **Add the DNS records.** The easy way is the **Auto Configure** button, which signs you in to GoDaddy and adds them. Otherwise, copy each record from Resend's dashboard into GoDaddy → your domain → DNS.
   - These only affect the `mail` subdomain. Your existing inbox and its records don't change.
   - Copy values from the Resend dashboard, not from a guide. They can differ per account.
4. **Wait for "Verified"** in Resend. This usually takes minutes, occasionally longer.
5. **Create an API key:** API Keys → Create → "Sending access" only.
6. **Add it to `.env.local`:**
   ```
   RESEND_API_KEY="re_your_key_here"
   ```
7. **Restart `npm run dev`.** Next.js only reads `.env.local` when it starts.
8. **Add the same variable to your host** (e.g. Vercel → Project → Settings → Environment Variables) before going live. `.env.local` isn't deployed.
9. **Test it:** register with your own email address, and check it arrives and isn't in junk.

**Limits:** Resend's free plan is about 100 emails a day and 3,000 a month, and the paid plan starts at about $20 a month. Check [resend.com/pricing](https://resend.com/pricing) for current figures. Each registration uses 1 email, and each contact enquiry uses 2. Once ads are running, expect to need the paid plan.

---

## 5. Settings

All go in `.env.local`, and on your host for the live site. Only the first is required.

| Variable | Default | Used for |
|---|---|---|
| `RESEND_API_KEY` | none | Sending anything at all |
| `EMAIL_FROM` | `RadixMaths <hello@mail.radixmaths.co.uk>` | The sender people see. Must use your verified domain. |
| `EMAIL_REPLY_TO` | `hello@radixmaths.co.uk` | Where replies to the automatic emails go |
| `CONTACT_INBOX` | `hello@radixmaths.co.uk` | Where contact enquiries are delivered |

---

## 6. The data in MongoDB

Database `RootMath`, collection **`registrations`**. There's one document per email address, enforced by a unique index. To see the data: MongoDB Atlas → Browse Collections → `RootMath` → `registrations`.

```js
{
  email: "tommy@example.com",        // lowercased
  firstName: "Tommy",
  lastName: "Shelby",
  mobile: "+447123456789",           // always in this format, or null
  courses: [
    { id: "a-level-maths", board: "AQA" },
    { id: "step", board: null }      // STEP and TMUA have no board
  ],
  school: {                          // null if they left it blank
    name: "Hills Road Sixth Form College",
    town: "Cambridge",               // null if typed in rather than picked
    custom: false                    // true if typed in rather than picked
  },
  marketingConsent: {
    given: true,
    wording: "Send me revision tips and offers too. I can unsubscribe at any time.",
    answeredAt: ISODate("2026-11-02T...")
  },
  thankYouSentAt: ISODate("..."),    // null until the email has been accepted by Resend
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

**Why the consent wording is stored:** under UK law you may need to prove what someone agreed to. Storing the exact sentence means changing the form later doesn't blur old answers.

**Before sending any marketing email,** filter on `marketingConsent.given: true`.

**Rate limit counters** live in `formRateLimits`. They hold a scrambled (hashed) form of the IP address, not the address itself, and MongoDB deletes them automatically after two time windows. Both this collection's and `registrations`' indexes are created automatically on first use.

---

## 7. The checks on each field

The same function, `validateRegistration()`, runs in the browser and on the server.

| Field | Rule |
|---|---|
| First and last name | Required, up to 80 characters |
| Email | Required. One `@`, no spaces, a dot in the domain. Saved in lowercase. |
| Mobile | Optional, but if filled in, must be `07` plus 9 digits, or a `+`/`00` international number. UK numbers must be mobiles (`+447...`). |
| Courses | At least one, from the list |
| Exam board | Required for courses that have boards, and must be on that course's list |
| School | Optional, up to 160 characters: picked from the list, or typed in |
| Marketing | Only an actual tick counts as yes |

**These checks can't prove an address belongs to someone,** only that it looks valid. Only a confirmation link could prove that, and we chose not to add that step since it loses some registrations.

---

## 8. The school search

- The box filters as they type, and ignores capitals and punctuation, so `st olaves` finds St Olave's Grammar School.
- **Other** stays visible at the bottom below a dashed divider, however far the list scrolls. Arrow keys and Enter can reach it too.
- Choosing Other swaps the search for a plain text box, with a "Search the list instead" link to go back.
- The whole question is optional, so leaving it blank is fine and saves `school: null`.
- Typing without picking from the list is kept too, saved with `custom: true`. Those names can be messy (`st olaves`), and `custom` lets you tell them apart from names picked from the list.

**The list is still 10 placeholder schools.** They're in the `schools` array in `RegisterInterest.tsx`, along with a comment explaining how to replace them from the government registers. See [section 15](#15-not-built-yet).

---

## 9. The thank-you email

Written in `registerThankYou()` in [email/templates.js](../email/templates.js). It:

- greets them by first name
- thanks them and lists the courses they chose
- gives the 3 free practice papers if they chose A Level Maths, Further Maths, STEP or TMUA (subject: "Your 3 free A Level practice papers from RadixMaths"). Students who only chose GCSE get the original email, because the papers are A Level pure.
- gives the launch dates if they chose A Level Maths ("Year 12 opens on 1 December, Year 13 in January"), otherwise says we'll email when their course opens
- points them to the blog and the social accounts

### The practice papers

Three A Level pure papers (Standard, Hard and Challenge), each 2 hours and 100 marks, each with a mark scheme and worked solutions. The six PDFs are in [public/practice-papers](../../../public/practice-papers), and the list is `PRACTICE_PAPERS` in [email/templates.js](../email/templates.js).

- **Linked, not attached.** PDF attachments from a new sending domain raise the spam score, and many school email systems strip or quarantine them. Links to our own domain don't have that problem.
- **Anyone with a link can download them.** That's deliberate: sharing spreads RadixMaths, since every page carries the name and website.
- **To change a paper,** edit its LaTeX source in the "RadixMaths practice papers" folder on the T7 drive, rerun `verify_answers.py`, rebuild, and copy the PDF over the one in `public/practice-papers` with the same file name. Everyone's link then gets the new version.
- **People who registered before 9 November 2026** got the old email without the papers. Registering again doesn't resend it (see "One thank-you per address" below).

**Replies** go to `hello@radixmaths.co.uk`, not a dead-end address, because a parent replying with a question is a warm lead.

**It doesn't repeat what they typed,** apart from the first name, and only if it looks like a real name (otherwise "Hi there"). The form can send an email to any address someone types in, so repeating free text would let anyone send their own words to a stranger.

**If the launch date changes,** update this template as well as the FAQ.

### The design

`layout()` in the same file gives every email the site's look: the squared-paper background, and a paper card with an ink border, hard shadow and hand-drawn corners. Three limits to know about:

- **Fonts:** most email apps won't load Cabin Sketch or Neucha. So the logo and name are an image, and the text is Arial.
- **The header image travels inside the email** as an inline attachment, so it doesn't need the site to be live. Some apps may show a paperclip because of this. **Resend's batch sending doesn't support attachments,** so a bulk launch email would need a hosted image or individual sends.
- **Dark mode:** the emails ask to stay light, but some apps recolour them anyway. Wobbly corners and shadows may be dropped by some apps, such as desktop Outlook, leaving a plain card.

**The round picture beside the sender's name** is chosen by the reader's email app, not by the email. Showing the logo there needs BIMI: a strict DMARC email policy plus, for most big providers, a paid logo certificate.

---

## 10. Spam protection

| Protection | How it works |
|---|---|
| **Hidden field** | A `website` box people can't see. Bots fill it in. The API answers "ok" and does nothing, so they don't learn they were caught. |
| **Rate limit** | 30 attempts per IP address per hour. It's generous because a whole classroom can share one school IP address. |
| **One thank-you per address** | Submitting someone else's email repeatedly can't flood their inbox. |

**One known gap:** there's no login, so anyone who knows a registered email address could submit the form again and overwrite those details. That's low risk for a waitlist. If it's ever abused, the fix is a confirmation link.

If bots become a real problem, the next step is a CAPTCHA such as Cloudflare Turnstile.

---

## 11. When something fails

| What fails | What the visitor sees | What happens to the data | What to do |
|---|---|---|---|
| Email (Resend down, no key, unverified domain) | Normal success | Saved, with `thankYouSentAt: null` | Check the server logs. Find affected people with `{ thankYouSentAt: null }`. |
| MongoDB | "Could not save your details", plus the hello@ address | Not saved | Check Atlas and the network access list |
| Visitor's connection | "We couldn't reach the server" | Not saved, and the form stays filled in so they can retry | Nothing |
| Too many attempts | "Too many attempts. Please try again later." | Not saved | Raise the limit if real people hit it |

---

## 12. Privacy and the law

- **The privacy policy** ([Privacy.tsx](../components/home/Privacy.tsx)) describes all this data and is linked beneath the submit button. **Keep it in step:** any new field or service needs a line there.
- **Marketing consent:** the box must stay unticked by default. Only email people with `given: true` about anything beyond their course launch.
- **The thank-you email links to the blog and social accounts.** Promotional content in an automatic email can count as marketing under PECR. Links this light are low risk, but keep it from growing into an advert.
- **The policy promises** registrations are deleted 12 months after a course launches. **Nothing does that automatically yet**, so it needs a clean-up job or a reminder.
- **Under-18s:** keep asking only for what you use, and keep mobile optional.

This is general guidance, not legal advice.

---

## 13. How to change common things

| To change | Edit |
|---|---|
| Email wording or design | [email/templates.js](../email/templates.js) |
| Sender or inbox addresses | The variables in section 5 |
| Courses or exam boards | `COURSES` in [forms/registerInterest.js](../forms/registerInterest.js) (updates the form and the checks) |
| Marketing wording | `MARKETING_WORDING` in the same file. New answers store the new wording. |
| Common email typos | `DOMAIN_TYPOS` in [forms/shared.js](../forms/shared.js) |
| Rate limit | `MAX_PER_IP_PER_HOUR` in the [API route](../../app/api/register-interest/route.js) |
| Social links | [socials.js](../socials.js) (updates the footer and emails) |
| Email provider | [email/send.js](../email/send.js) only |

---

## 14. Testing

Tested on 2 November 2026, on the local dev site:

- **Checks and emails (script, with Resend stubbed so nothing sent):** every field rule, the typo prompts, mobile formats, HTML being escaped, spam text not reaching the thank-you, and the exact request sent to Resend.
- **API (real requests and real MongoDB):** bad data rejected, spam trap ignored, registering twice giving one updated record, and a failed email not losing the save. Test records were then deleted.
- **In Chrome (typed and clicked like a visitor):** error messages, focus jumping to the first error, the typo prompt, Other chosen by keyboard, and the thank-you panel.

**Not tested: a real email arriving,** because there's no Resend key yet. Do step 9 of section 4 once it's set up, and check it in Gmail and Outlook.

---

## 15. Not built yet

- **A real list of schools.** Still 10 placeholders. The suggestion is to import England's register now and let everyone else use Other.
- **The launch email** to everyone registered on 1 December. Sending thousands at once needs a paid plan and a small script or Resend's bulk tools.
- **An unsubscribe route,** needed before sending any marketing email.
- **Automatic deletion** after 12 months (see section 12).
