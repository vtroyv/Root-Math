// components/Pricing.tsx — the /pricing page.
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Footer from './Footer';

const MONTHLY_PENCE = 1799; // £17.99 per course per month
const UPFRONT_DISCOUNT = 0.1; // 10% off when paying upfront

const courses = [
  { id: 'gcse-maths', name: 'GCSE Maths' },
  { id: 'a-level-maths', name: 'A Level Maths' },
  { id: 'a-level-further-maths', name: 'A Level Further Maths' },
  { id: 'tmua', name: 'TMUA' },
  { id: 'step', name: 'STEP' },
];

/* Formatted by hand rather than with Intl/toLocaleDateString, so the server
   render and the client hydration cannot disagree. */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const formatDate = (date: Date) =>
  `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;

const money = (pence: number) => `£${(pence / 100).toFixed(2)}`;

/* Months remaining, rounded UP: any part of a month is charged as a whole one.
   22 Sep 2026 → 31 Jul 2027 is 10 months and 9 days, so 11 months. */
function monthsUntil(from: Date, to: Date) {
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;

  const anchor = new Date(from);
  anchor.setMonth(anchor.getMonth() + months);
  if (anchor < to) months += 1;

  return Math.max(months, 1);
}

/** 31 July of the given year, at the end of the day. */
const julyEnd = (year: number) => new Date(year, 6, 31, 23, 59, 59);

export default function Pricing({ today: todayIso }: { today: string }) {
  // Fixed reference date handed down by the page, so every price on this
  // render is measured from the same moment.
  const today = useMemo(() => new Date(todayIso), [todayIso]);

  /* Always three years ahead. The first is the next 31 July still to come, so
     the list rolls forward on its own the day after each one passes. */
  const years = useMemo(() => {
    const first =
      today <= julyEnd(today.getFullYear())
        ? today.getFullYear()
        : today.getFullYear() + 1;
    return [first, first + 1, first + 2];
  }, [today]);

  const [chosen, setChosen] = useState<string[]>(['a-level-maths']);
  const [plan, setPlan] = useState<'monthly' | number>('monthly');
  const [tmuaSitting, setTmuaSitting] = useState<'october' | 'january' | 'july'>(
    'january',
  );

  const toggleCourse = (id: string) =>
    setChosen((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id],
    );

  const selected = courses.filter((course) => chosen.includes(course.id));
  const upfront = plan !== 'monthly';
  const year = upfront ? (plan as number) : years[0];
  const hasTmua = chosen.includes('tmua');

  /* TMUA is sat in October or January, so its access does not need to run to
     the following July. Both sittings in the chosen year are offered, and any
     that has already passed drops off the list. */
  const tmuaOptions = useMemo(() => {
    const options = [
      { id: 'october' as const, label: `October sitting`, end: new Date(year - 1, 9, 31, 23, 59, 59) },
      { id: 'january' as const, label: `January sitting`, end: new Date(year, 0, 31, 23, 59, 59) },
      { id: 'july' as const, label: `Keep it until 31 July`, end: julyEnd(year) },
    ];
    return options.filter((option) => option.end > today);
  }, [year, today]);

  const activeTmua =
    tmuaOptions.find((option) => option.id === tmuaSitting) ?? tmuaOptions[0];

  const lines = selected.map((course) => {
    if (!upfront) {
      return {
        id: course.id,
        name: course.name,
        detail: 'Rolling monthly',
        pence: MONTHLY_PENCE,
        full: MONTHLY_PENCE,
      };
    }

    const end = course.id === 'tmua' && activeTmua ? activeTmua.end : julyEnd(year);
    const months = monthsUntil(today, end);
    const full = months * MONTHLY_PENCE;

    return {
      id: course.id,
      name: course.name,
      detail: `${months} ${months === 1 ? 'month' : 'months'} · to ${formatDate(end)}`,
      pence: Math.round(full * (1 - UPFRONT_DISCOUNT)),
      full,
    };
  });

  const total = lines.reduce((sum, line) => sum + line.pence, 0);
  const fullTotal = lines.reduce((sum, line) => sum + line.full, 0);
  const saving = fullTotal - total;

  return (
    <div className="rm-landing">
      <header className="rm-paperhead rm-paperhead--tight">
        <div className="rm-container">
          <div className="rm-section-head">
            <span className="rm-eyebrow">
              <i className="bi bi-tag-fill" /> Pricing
            </span>
            <h1 className="rm-display">
              Pay for the courses you <span className="rm-underline">actually take</span>
            </h1>
            <p className="rm-lead">
              £17.99 a month per course, and nothing for the ones you do not want. Pay
              upfront to the end of an exam year instead and it is 10% cheaper.
            </p>
          </div>
        </div>
      </header>

      <section className="rm-section rm-container">
        <div className="rm-pricing">
          {/* ------------------------------------------------------- choices */}
          <div className="rm-form">
            <fieldset>
              <legend>1. Choose your courses</legend>
              <div className="rm-choices">
                {courses.map((course) => (
                  <label className="rm-choice" key={course.id}>
                    <input
                      type="checkbox"
                      checked={chosen.includes(course.id)}
                      onChange={() => toggleCourse(course.id)}
                    />
                    <i className="bi bi-check-lg" aria-hidden="true" />
                    {course.name}
                  </label>
                ))}
              </div>
              <p className="rm-field__hint">
                £17.99 per month each. Every course includes the lessons, the full
                question bank, past papers and the AI tutor.
              </p>
            </fieldset>

            <fieldset>
              <legend>2. Choose how you pay</legend>
              <div className="rm-choices">
                <label className="rm-choice">
                  <input
                    type="radio"
                    name="plan"
                    checked={!upfront}
                    onChange={() => setPlan('monthly')}
                  />
                  <i className="bi bi-check-lg" aria-hidden="true" />
                  Monthly
                </label>

                {years.map((option) => (
                  <label className="rm-choice" key={option}>
                    <input
                      type="radio"
                      name="plan"
                      checked={plan === option}
                      onChange={() => setPlan(option)}
                    />
                    <i className="bi bi-check-lg" aria-hidden="true" />
                    Upfront to 31 July {option}
                  </label>
                ))}
              </div>
              <p className="rm-field__hint">
                Monthly rolls on until you cancel. Paying upfront buys access to 31 July
                of that year at a 10% discount — Year 13 usually wants {years[0]}, Year
                12 {years[1]}.
              </p>
            </fieldset>

            {/* TMUA is the one course whose end date is worth choosing, because
                the test is sat long before the A Level exams. */}
            {hasTmua && upfront && activeTmua && (
              <fieldset>
                <legend>3. When do you sit the TMUA?</legend>
                <div className="rm-choices">
                  {tmuaOptions.map((option) => (
                    <label className="rm-choice" key={option.id}>
                      <input
                        type="radio"
                        name="tmua"
                        checked={activeTmua.id === option.id}
                        onChange={() => setTmuaSitting(option.id)}
                      />
                      <i className="bi bi-check-lg" aria-hidden="true" />
                      {option.label}
                    </label>
                  ))}
                </div>
                <p className="rm-field__hint">
                  TMUA access ends {formatDate(activeTmua.end)}. Paying only to your
                  sitting costs less; keeping it to 31 July {year} leaves the material
                  open for the rest of the year.
                </p>
              </fieldset>
            )}
          </div>

          {/* ------------------------------------------------------- summary */}
          <div className="rm-card rm-summary">
            <h2 className="rm-h3">Your plan</h2>

            {lines.length === 0 ? (
              <p className="rm-card__body">
                Pick at least one course to see what it costs.
              </p>
            ) : (
              <>
                {lines.map((line) => (
                  <div className="rm-summary__line" key={line.id}>
                    <span>
                      {line.name}
                      <span className="rm-summary__detail">{line.detail}</span>
                    </span>
                    <span>{money(line.pence)}</span>
                  </div>
                ))}

                <div className="rm-summary__total">
                  <span>Total</span>
                  <span>
                    {money(total)}
                    {!upfront && <span style={{ fontSize: '1rem' }}> /month</span>}
                  </span>
                </div>

                {upfront ? (
                  <>
                    <p className="rm-summary__save">
                      <i className="bi bi-scissors" aria-hidden="true" /> You save{' '}
                      {money(saving)} against paying monthly.
                    </p>
                    <p className="rm-summary__note">
                      Access runs to {formatDate(julyEnd(year))}
                      {hasTmua && activeTmua && activeTmua.id !== 'july'
                        ? `, with TMUA to ${formatDate(activeTmua.end)}`
                        : ''}
                      . Part months are charged as whole months.
                    </p>
                  </>
                ) : (
                  <p className="rm-summary__note">
                    Billed monthly, cancel any time. Paying upfront instead would save
                    you 10%.
                  </p>
                )}

                <div className="rm-card__foot">
                  <Link href="/register" className="rm-btn rm-btn--primary" style={{ width: '100%' }}>
                    Register your interest
                  </Link>
                  <p className="rm-summary__note">
                    No payment is taken yet — we will email you the moment your course
                    opens.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
