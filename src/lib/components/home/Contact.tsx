// components/Contact.tsx — the /contact page.
import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';
import Footer from './Footer';

/* PLACEHOLDER — set this to the real inbox before the page goes live. It is
   used twice below, so changing it here changes both. */
const contactEmail = 'hello@rootmath.co.uk';

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
  'Schools and colleges: department trials, licences, and how RootMath fits around a scheme of work.',
  'A question marked wrong, or anything on the site misbehaving — send us the question and we will look at it.',
  'Anything you want RootMath to do that it does not do yet. Most of what we build was asked for.',
];

const subjects = [
  'A course or specification question',
  'Schools and departments',
  'Something is not working',
  'Feedback or a feature request',
  'Press or partnerships',
  'Something else',
];

export default function Contact() {
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
                  Prefer your own email client? Write to{' '}
                  <a className="rm-link" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                  .
                </p>
                <p className="rm-card__body">
                  Wanting early access rather than an answer?{' '}
                  <Link href="/register" className="rm-link">
                    Register your interest
                  </Link>{' '}
                  instead — that form tells us which course you need.
                </p>
              </Reveal>
            </div>

            {/* ------------------------------------------------------------ the form */}
            <Reveal as="form" className="rm-form" delay={120}>
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
                    placeholder="Ada Lovelace"
                    required
                  />
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
                    placeholder="ada@example.com"
                    required
                  />
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
                  />
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
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Choose the closest one
                    </option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
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
                    required
                  />
                </div>
              </fieldset>

              <div className="rm-form__foot">
                <button type="submit" className="rm-btn rm-btn--primary rm-btn--lg">
                  Send message
                </button>
                <p className="rm-form__note">
                  <i className="bi bi-clock-fill" /> We reply within one working day.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
