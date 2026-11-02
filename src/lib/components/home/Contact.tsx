// components/Contact.tsx — the /contact page. How the form works: docs/contact-form.md.
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Reveal from './Reveal';
import Footer from './Footer';
import { FieldError, Honeypot } from './FormBits';
import { SUBJECTS, validateEnquiry } from '@/lib/forms/contact';
import { suggestEmail } from '@/lib/forms/shared';

const contactEmail = 'hello@radixmaths.co.uk';
const whatsAppLink = 'https://wa.me/447999863387';

const emptyForm = { name: '', email: '', mobile: '', subject: '', message: '' };

/* Margin doodles, as on the register page: fixed positions (Math.random()
   would break hydration), kept in the outer gutters, hidden on narrow
   screens by .rm-formpage__symbols. */
const marginSymbols = [
  { text: '∫ x² dx', top: '7%', left: '4%', size: 2.1, rotate: -8 },
  { text: 'dy/dx', top: '16%', left: '89%', size: 2.4, rotate: 9 },
  { text: '√2', top: '28%', left: '6%', size: 1.9, rotate: -13 },
  { text: '∑ aₙ', top: '38%', left: '92%', size: 1.9, rotate: -7 },
  { text: "f′(x)", top: '52%', left: '4%', size: 1.9, rotate: -4 },
  { text: 'eˣ', top: '60%', left: '90%', size: 2.2, rotate: -5 },
  { text: 'π', top: '74%', left: '6%', size: 2.5, rotate: -11 },
  { text: 'lim f(x)', top: '82%', left: '88%', size: 1.7, rotate: 8 },
];

/* What people actually write in about — this replaces the old address block,
   which was placeholder contact details for an office that does not exist. */
const helpWith = [
  'Which course matches your specification — tell us your exam board and we will point you at the right one.',
  'Schools and colleges: how RadixMaths could work for your department and fit around a scheme of work.',
  'A question marked wrong, or anything on the site misbehaving — send us the question and we will look at it.',
  'Anything you want RadixMaths to do that it does not do yet. We read every request.',
];

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [website, setWebsite] = useState(''); // the spam trap, see Honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const setField = (key: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const { [key]: _removed, ...rest } = current;
      return rest;
    });
  };

  // Email and mobile are checked as soon as the visitor leaves the field.
  const checkOnBlur = (key: 'email' | 'mobile') => {
    if (key === 'email') setEmailSuggestion(suggestEmail(form.email));
    const message = form[key] ? validateEnquiry(form).errors[key] : undefined;
    setErrors((current) => {
      const { [key]: _removed, ...rest } = current;
      return message ? { ...rest, [key]: message } : rest;
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    const found = validateEnquiry(form).errors;
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(firstError)?.focus();
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) setDone(true);
      else if (result.errors) setErrors(result.errors);
      else setFormError(result.error ?? 'Something went wrong.');
    } catch {
      setFormError('We couldn’t reach the server. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const sendAnother = () => {
    setForm(emptyForm);
    setErrors({});
    setEmailSuggestion(null);
    setDone(false);
  };

  return (
    <div className="rm-landing">
      <div className="rm-formpage">
        <div className="rm-formpage__symbols" aria-hidden="true">
          {marginSymbols.map((symbol) => (
            <span
              key={symbol.text}
              style={{
                top: symbol.top,
                left: symbol.left,
                fontSize: `${symbol.size}rem`,
                '--rm-symbol-rotate': `${symbol.rotate}deg`,
              } as React.CSSProperties}
            >
              {symbol.text}
            </span>
          ))}
        </div>

        <div className="rm-container">
          <div className="rm-section-head">
            <span className="rm-eyebrow">
              <i className="bi bi-chat-square-dots-fill" /> Contact us
            </span>
            <h1 className="rm-display">
              Ask us <span className="rm-underline">anything</span>
            </h1>
            <p className="rm-lead">
              A real person reads every message — usually the people building the
              courses. We answer within one working day.
            </p>
          </div>

          <div className="rm-grid rm-grid--2">
            {/* ------------------------------------------------ what we can help with.
                Two stacked cards rather than one: a single card stretches to the
                height of the form beside it and ends up with a hole in the middle. */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--rm-gap)',
                /* Without this the column is stretched to the form's height and
                   .rm-card's `height: 100%` pads both cards out to fill it. */
                alignSelf: 'start',
              }}
            >
              <Reveal className="rm-card">
                <span className="rm-card__icon" aria-hidden="true">
                  <i className="bi bi-life-preserver" />
                </span>
                <h2 className="rm-h3">What we can help with</h2>
                <ul className="rm-card__list">
                  {helpWith.map((item) => (
                    <li key={item}>
                      <i className="bi bi-check-lg" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="rm-card" delay={80}>
                <span className="rm-card__icon" aria-hidden="true">
                  <i className="bi bi-envelope-fill" />
                </span>
                <h2 className="rm-h3">Other ways to reach us</h2>
                <p className="rm-card__body">
                  Email us at{' '}
                  <a className="rm-link" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                  .
                </p>
                <p className="rm-card__body">
                  Or{' '}
                  <a className="rm-link" href={whatsAppLink} target="_blank" rel="noopener noreferrer">
                    message us on WhatsApp
                  </a>
                  .
                </p>
              </Reveal>
            </div>

            {/* ------------------------------------------------------------ the form */}
            {done ? (
              <div className="rm-form rm-form--done" role="status">
                <span className="rm-card__icon" aria-hidden="true">
                  <i className="bi bi-patch-check-fill" />
                </span>
                <h2 className="rm-h3">Thank you, we have received your message</h2>
                <p className="rm-lead">We will get back to you shortly.</p>
                <div className="rm-btn-row">
                  <Link href="/" className="rm-btn rm-btn--primary">
                    Back to home
                  </Link>
                  <button type="button" className="rm-btn rm-btn--ghost" onClick={sendAnother}>
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
            <Reveal as="form" className="rm-form" delay={120} onSubmit={onSubmit} noValidate>
              <Honeypot value={website} onChange={setWebsite} />

              <fieldset>
                <legend>Send us a message</legend>

                <div className="rm-field">
                  <label className="rm-field__label" htmlFor="name">
                    Your name
                  </label>
                  <input
                    className="rm-input"
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Steve Harrington"
                    value={form.name}
                    onChange={(event) => setField('name', event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    required
                  />
                  <FieldError id="name" message={errors.name} />
                </div>

                <div className="rm-field">
                  <label className="rm-field__label" htmlFor="email">
                    Email address
                  </label>
                  <input
                    className="rm-input"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="steve@scoopsahoy.com"
                    value={form.email}
                    onChange={(event) => {
                      setField('email', event.target.value);
                      setEmailSuggestion(null);
                    }}
                    onBlur={() => checkOnBlur('email')}
                    aria-invalid={Boolean(errors.email)}
                    required
                  />
                  <FieldError id="email" message={errors.email} />
                  {emailSuggestion && (
                    <p className="rm-field__hint">
                      Did you mean{' '}
                      <button
                        type="button"
                        className="rm-link rm-form__linkbtn"
                        onClick={() => {
                          setField('email', emailSuggestion);
                          setEmailSuggestion(null);
                        }}
                      >
                        {emailSuggestion}
                      </button>
                      ?
                    </p>
                  )}
                </div>

                <div className="rm-field">
                  <label className="rm-field__label" htmlFor="mobile">
                    Mobile number <span>(optional)</span>
                  </label>
                  <input
                    className="rm-input"
                    id="mobile"
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+44 7123 456 789"
                    value={form.mobile}
                    onChange={(event) => setField('mobile', event.target.value)}
                    onBlur={() => checkOnBlur('mobile')}
                    aria-invalid={Boolean(errors.mobile)}
                  />
                  <FieldError id="mobile" message={errors.mobile} />
                  <p className="rm-field__hint">
                    Only if you would rather we called you back.
                  </p>
                </div>

                <div className="rm-field">
                  <label className="rm-field__label" htmlFor="subject">
                    What is it about?
                  </label>
                  <select
                    className="rm-input"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={(event) => setField('subject', event.target.value)}
                    aria-invalid={Boolean(errors.subject)}
                    required
                  >
                    <option value="" disabled>
                      Choose the closest one
                    </option>
                    {SUBJECTS.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  <FieldError id="subject" message={errors.subject} />
                </div>

                <div className="rm-field">
                  <label className="rm-field__label" htmlFor="message">
                    Your message
                  </label>
                  <textarea
                    className="rm-input"
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us what you need. If it is about a specific question, paste it in and we will work through it."
                    value={form.message}
                    onChange={(event) => setField('message', event.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    required
                  />
                  <FieldError id="message" message={errors.message} />
                </div>
              </fieldset>

              {formError && (
                <p className="rm-field__error" role="alert">
                  {formError} You can also email us at{' '}
                  <a className="rm-link" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
                </p>
              )}

              <div className="rm-form__foot">
                <button type="submit" className="rm-btn rm-btn--primary rm-btn--lg" disabled={sending}>
                  {sending ? 'Sending…' : 'Send message'}
                </button>
                <p className="rm-form__note">
                  <i className="bi bi-clock-fill" /> We reply within one working day.
                </p>
              </div>
            </Reveal>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
