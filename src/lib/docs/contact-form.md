# Contact form: how it works

The form at `/contact`. A visitor sends a message, it's saved to MongoDB, you get it by email, and they get an automatic reply. Built 2 November 2026.

Register Interest shares most of its plumbing, including email setup: see [register-interest.md](register-interest.md).

---

## Contents

1. [What the visitor sees](#1-what-the-visitor-sees)
2. [What happens when they submit](#2-what-happens-when-they-submit)
3. [Files](#3-files)
4. [Setting up email](#4-setting-up-email)
5. [The email you receive, and your Enquiries folder](#5-the-email-you-receive-and-your-enquiries-folder)
6. [The automatic reply](#6-the-automatic-reply)
7. [The data in MongoDB](#7-the-data-in-mongodb)
8. [The checks on each field](#8-the-checks-on-each-field)
9. [Spam protection](#9-spam-protection)
10. [When something fails](#10-when-something-fails)
11. [Privacy](#11-privacy)
12. [How to change common things](#12-how-to-change-common-things)
13. [Testing](#13-testing)

---

## 1. What the visitor sees

**Left column, two cards:**

- **What we can help with:** course questions, schools, marking or site problems, and feature requests.
- **Other ways to reach us:** `hello@radixmaths.co.uk`, and a "message us on WhatsApp" link that opens a chat through `wa.me/447999863387`. The number itself isn't written on the page.

**Right column, the form:** name, email, mobile (optional), a subject drop-down, and their message.

- **Email and mobile** are checked as soon as they leave the field, including the "Did you mean gmail.com?" typo prompt.
- **Every field** is checked on **Send message**. Problems appear in red, and the cursor jumps to the first one.

**Once sent, the form is replaced by:**

> **Thank you, we have received your message**
> We will get back to you shortly.
> [Back to home] [Send another message]

**Send another message** brings back an empty form.

---

## 2. What happens when they submit

```
Browser (Contact.tsx)
  │  validateEnquiry() runs. If anything's wrong, show the errors and stop.
  │  POST /api/contact
  ▼
API route (app/api/contact/route.js)
  1. Hidden "website" field filled in? It's a bot: answer "ok" and do nothing.
  2. validateEnquiry() runs again. The browser's check can be bypassed, this one can't.
  3. More than 10 messages from this IP address this hour? Answer 429.
  4. Save to the enquiries collection.
  5. At the same time:
       a. Email the enquiry to CONTACT_INBOX, and record notifiedAt.
       b. Unless this address has had 3 replies today: send the automatic reply, and record autoReplySentAt.
  6. Answer { ok: true }.
  ▼
Browser shows the thank-you panel.
```

**The save comes first,** so an email problem never loses a message. The two emails are independent, so one failing doesn't stop the other.

---

## 3. Files

| File | What it does |
|---|---|
| [components/home/Contact.tsx](../components/home/Contact.tsx) | The page, cards, form and thank-you panel. The WhatsApp number is at the top. |
| [components/home/FormBits.tsx](../components/home/FormBits.tsx) | The red error line and the hidden spam trap, shared with Register Interest |
| [forms/contact.js](../forms/contact.js) | The subject list and `validateEnquiry()` |
| [forms/shared.js](../forms/shared.js) | Email and mobile checks, and typo suggestions |
| [forms/server.js](../forms/server.js) | MongoDB code: `saveEnquiry`, `markEnquiry`, rate limits |
| [app/api/contact/route.js](../../app/api/contact/route.js) | The API route that runs the steps in section 2 |
| [email/send.js](../email/send.js) | Sends one email through Resend |
| [email/templates.js](../email/templates.js) | `enquiryNotification()` and `contactThankYou()` |

---

## 4. Setting up email

Follow [section 4 of register-interest.md](register-interest.md#4-setting-up-email-resend-and-godaddy). It's one Resend account and one API key for both forms.

**Until that's done, enquiries are saved to MongoDB, but neither email is sent.**

To send enquiries to another of your aliases, set this in `.env.local` and on your host:

```
CONTACT_INBOX="contact@radixmaths.co.uk"
```

---

## 5. The email you receive, and your Enquiries folder

**Subject:**

```
enquiry-contact-form: Schools and departments, from Steve Harrington
```

- **Your folder rule** matches `enquiry-contact-form`, so every enquiry goes to Enquiries, whichever alias receives it. The text is set in `enquiryNotification()` in [email/templates.js](../email/templates.js). **If you change it, change the rule too.**
- **Replying:** Reply-To is set to the visitor, so pressing Reply writes to them, even though the email came from `hello@mail.radixmaths.co.uk`. Check the To line the first time.
- **The body** shows their name, email, mobile, subject and full message. Everything they typed is escaped, so it can't inject code or HTML into the email.

**Check junk the first time.** If it lands there, mark it as "not junk". Your mail provider may also need the sending address marked as safe.

---

## 6. The automatic reply

Subject: **We've received your message**

> Hi Steve,
> Thank you for getting in touch. We've received your message and will get back to you shortly.
> Thanks, The RadixMaths team

**It deliberately doesn't repeat their message.** The form can send an email to any address someone types in, so repeating it would let anyone send their own words to a stranger. The first name only appears if it looks like a real name (otherwise "Hi there").

Replies go to `hello@radixmaths.co.uk`.

---

## 7. The data in MongoDB

Database `RootMath`, collection **`enquiries`**, one document per message. This is your backup if an email ever goes missing. The collection is created automatically by the first enquiry.

```js
{
  name: "Steve Harrington",
  email: "steve@example.com",        // lowercased
  mobile: "+447123456789",           // or null
  subject: "Schools and departments",
  message: "Hello...",               // line breaks kept
  createdAt: ISODate("..."),
  notifiedAt: ISODate("..."),        // null if your email didn't send
  autoReplySentAt: ISODate("...")    // null if the reply didn't send or was limited
}
```

**To find enquiries you never received by email,** filter on `{ notifiedAt: null }`.

---

## 8. The checks on each field

The same function, `validateEnquiry()`, runs in the browser and on the server.

| Field | Rule |
|---|---|
| Name | Required, up to 120 characters |
| Email | Required. One `@`, no spaces, a dot in the domain. |
| Mobile | Optional, but if filled in, must be `07` plus 9 digits, or a `+`/`00` international number. UK numbers must be mobiles. |
| Subject | Required, must be from the list |
| Message | Between 10 and 5,000 characters |

---

## 9. Spam protection

| Protection | How it works |
|---|---|
| **Hidden field** | A `website` box people can't see. Bots fill it in. The API answers "ok" and does nothing. |
| **Rate limit per IP** | 10 messages per IP address per hour |
| **Reply limit per address** | At most 3 automatic replies per email address per day, so nobody can use the form to flood someone's inbox. Their messages still reach you. |

---

## 10. When something fails

| What fails | What the visitor sees | What happens | What to do |
|---|---|---|---|
| Either email | Normal success | Saved. The failed email's date stays `null`, and the error is logged. | Check the logs, and look for `{ notifiedAt: null }` |
| MongoDB | "Could not send your message", plus the hello@ address | Not saved, no emails | Check Atlas |
| Visitor's connection | "We couldn't reach the server" | Not saved; their text stays in the form so they can retry | Nothing |
| Too many messages | "Too many messages. Please try again later." | Not saved | Raise the limit if real people hit it |

---

## 11. Privacy

- **The [privacy policy](../components/home/Privacy.tsx)** covers enquiries and says they're kept for **12 months after you've dealt with them**. **Nothing deletes them automatically yet,** so that needs a clean-up job or a reminder.
- **WhatsApp** conversations happen in your WhatsApp Business account, not on this site.
- **The page promises** "We answer within one working day". Keep to that, or change the wording in [Contact.tsx](../components/home/Contact.tsx).

---

## 12. How to change common things

| To change | Edit |
|---|---|
| Subject line or email wording | [email/templates.js](../email/templates.js) (if the `enquiry-contact-form` text changes, change your inbox rule too) |
| Which inbox gets enquiries | `CONTACT_INBOX` setting |
| Subject drop-down | `SUBJECTS` in [forms/contact.js](../forms/contact.js) (updates the form and the checks) |
| WhatsApp number | `whatsAppLink` at the top of [Contact.tsx](../components/home/Contact.tsx) |
| Card wording | `helpWith` in the same file |
| Limits | The constants at the top of the [API route](../../app/api/contact/route.js) |
| Minimum or maximum message length | `MIN_MESSAGE` and `MAX_MESSAGE` in [forms/contact.js](../forms/contact.js) |

---

## 13. Testing

Tested on 2 November 2026, on the local dev site:

- **Checks and emails (script, with Resend stubbed so nothing sent):** every field rule, the subject prefix, line breaks stripped from the subject, HTML escaped in your copy, and spam text not reaching the automatic reply.
- **API (real requests and real MongoDB):** bad data rejected, spam trap ignored, and a failed email not losing the save. Test records were then deleted.
- **In Chrome (typed and clicked like a visitor):** error messages, the thank-you panel, and **Send another message** bringing back an empty form.

**Not tested: real emails arriving,** because there's no Resend key yet. Once it's set up:

1. Send an enquiry using a personal address that isn't one of your aliases.
2. Check it lands in your **Enquiries** folder.
3. Press **Reply** and confirm it's addressed to the personal address.
4. Check the personal address got the automatic reply, and that it isn't in junk.
