'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Footer from './Footer';
import { FieldError, Honeypot } from './FormBits';
import { COURSES, MARKETING_WORDING, validateRegistration } from '@/lib/forms/registerInterest';
import { suggestEmail } from '@/lib/forms/shared';

/* Scribbled-in-the-margin maths, the same idea as the hero: hard-coded
   positions (Math.random() would break hydration), kept in the outer gutters
   so nothing ever runs under the form, and hidden once the page is too narrow
   for those gutters to exist. */
const marginSymbols = [
  { text: '∫ x² dx', top: '4%', left: '4%', size: 2.1, rotate: -8 },
  { text: 'dy/dx', top: '12%', left: '89%', size: 2.4, rotate: 9 },
  { text: '√2', top: '21%', left: '7%', size: 1.9, rotate: -13 },
  { text: '∑ aₙ', top: '30%', left: '92%', size: 1.9, rotate: -7 },
  { text: 'sin²θ + cos²θ = 1', top: '39%', left: '1%', size: 1.5, rotate: 6 },
  { text: 'eˣ', top: '47%', left: '90%', size: 2.2, rotate: -5 },
  { text: "f′(x)", top: '56%', left: '5%', size: 1.9, rotate: -4 },
  { text: 'lim f(x)', top: '65%', left: '88%', size: 1.7, rotate: 8 },
  { text: 'π', top: '74%', left: '6%', size: 2.5, rotate: -11 },
  { text: 'n!', top: '83%', left: '91%', size: 1.9, rotate: 5 },
  { text: 'θ = π/3', top: '91%', left: '4%', size: 1.7, rotate: -6 },
];

type School = { name: string; town: string };

/* -------------------------------------------------------------------------
   PLACEHOLDER DATA — ten institutions purely so the box can be seen filtering.
   The real control needs every school, sixth form and college in the country,
   which is far too much to ship in the bundle: the list belongs in our own
   database, queried as the student types. The markup below is already the
   right shape for that — swap `matches` from filtering this array to the
   results of a debounced fetch and nothing else changes.

     1. Seed from the official registers, which are free bulk downloads:
        - England: DfE "Get Information About Schools" (GIAS) — full CSV of
          every establishment with a URN, phase and status.
        - Scotland: Scottish Government school contact details dataset.
        - Wales: StatsWales / My Local School address list.
        - N. Ireland: DE "Schools Plus" institution export.
     2. Filter to open establishments teaching 14+ (secondary, all-through,
        sixth-form and FE colleges), keep URN, name, town and postcode, and
        store them in one `schools` table with the URN as the natural key.
     3. Expose GET /api/schools?q= returning the top ~20 name/town matches —
        a trigram or full-text index keeps it fast — and call it from the
        input's onChange behind a ~200ms debounce.
     4. Re-import the CSVs termly — schools open, close and rename — matching
        on URN so existing registrations keep pointing at the right record.
        Worth storing the chosen URN alongside the name for that reason.

   Anyone the register would miss (international, home-schooled, private
   candidates) is caught by the "Other" row pinned to the foot of the list.
   ------------------------------------------------------------------------- */
const schools: School[] = [
  { name: 'Altrincham Grammar School for Girls', town: 'Altrincham' },
  { name: 'Brampton Manor Academy Sixth Form', town: 'London' },
  { name: 'Harris Academy Battersea', town: 'London' },
  { name: 'Hills Road Sixth Form College', town: 'Cambridge' },
  { name: 'King Edward VI Camp Hill School for Boys', town: 'Birmingham' },
  { name: 'Nottingham High School', town: 'Nottingham' },
  { name: 'Peter Symonds College', town: 'Winchester' },
  { name: "St Olave's Grammar School", town: 'Orpington' },
  { name: 'Varndean College', town: 'Brighton' },
  { name: 'Woodhouse College', town: 'London' },
];

/* Loose matching so "st olaves", "ST OLAVE'S" and "olave" all find the same
   school — punctuation and case are exactly what students get wrong. */
const normalise = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/* Which element to focus for each error key, in the order the fields appear. */
const fieldIdFor = (key: string) => {
  if (key === 'courses') return `course-${COURSES[0].id}`;
  if (key.startsWith('board.')) return `board-${key.slice('board.'.length)}`;
  return key;
};

export default function RegisterInterest() {
  const [details, setDetails] = useState({ firstName: '', lastName: '', email: '', mobile: '' });
  const [chosenCourses, setChosenCourses] = useState<string[]>([]);
  const [boards, setBoards] = useState<Record<string, string>>({});
  const [schoolQuery, setSchoolQuery] = useState('');
  const [chosenSchool, setChosenSchool] = useState<School | null>(null);
  const [schoolIsOther, setSchoolIsOther] = useState(false);
  const [otherSchool, setOtherSchool] = useState('');
  const [listOpen, setListOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(-1);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [website, setWebsite] = useState(''); // the spam trap, see Honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  // Everything the API needs, in the shape validateRegistration checks on both sides.
  const buildPayload = () => ({
    ...details,
    courses: chosenCourses.map((id) => ({ id, board: boards[id] ?? null })),
    // Anything typed without picking from the list is kept, marked as custom.
    school: chosenSchool
      ? { name: chosenSchool.name, town: chosenSchool.town, custom: false }
      : { name: schoolIsOther ? otherSchool : schoolQuery, custom: true },
    marketingConsent,
    website,
  });

  const clearError = (key: string) =>
    setErrors((current) => {
      if (!current[key]) return current;
      const { [key]: _removed, ...rest } = current;
      return rest;
    });

  const setDetail = (key: keyof typeof details, value: string) => {
    setDetails((current) => ({ ...current, [key]: value }));
    clearError(key);
  };

  // Email and mobile are checked as soon as the student leaves the field.
  const checkOnBlur = (key: 'email' | 'mobile') => {
    if (key === 'email') setEmailSuggestion(suggestEmail(details.email));
    const message = details[key] ? validateRegistration(buildPayload()).errors[key] : undefined;
    setErrors((current) => {
      const { [key]: _removed, ...rest } = current;
      return message ? { ...rest, [key]: message } : rest;
    });
  };

  const toggleCourse = (id: string) => {
    setChosenCourses((current) =>
      current.includes(id)
        ? current.filter((courseId) => courseId !== id)
        : [...current, id],
    );
    clearError('courses');
    clearError(`board.${id}`);
  };

  // Kept in the order the courses are listed rather than the order they were
  // ticked, so the board questions never jump around underneath the pills.
  const needBoard = COURSES.filter(
    (course) => course.boards && chosenCourses.includes(course.id),
  );

  const matches = useMemo(() => {
    const query = normalise(schoolQuery);
    const hits = query
      ? schools.filter((school) =>
          normalise(`${school.name} ${school.town}`).includes(query),
        )
      : schools;
    return hits.slice(0, 8);
  }, [schoolQuery]);

  // "Other" comes straight after the matches, so the arrow keys reach it too.
  const otherIndex = matches.length;

  const chooseSchool = (school: School) => {
    setSchoolQuery(school.name);
    setChosenSchool(school);
    setListOpen(false);
    setActiveOption(-1);
  };

  const chooseOther = () => {
    setSchoolIsOther(true);
    setChosenSchool(null);
    setListOpen(false);
    setActiveOption(-1);
  };

  const backToSearch = () => {
    setSchoolIsOther(false);
    setOtherSchool('');
    setSchoolQuery('');
  };

  const onSchoolKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!listOpen) {
        setListOpen(true);
        return;
      }
      const rows = matches.length + 1;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveOption((index) => (index + step + rows) % rows);
    } else if (event.key === 'Enter' && listOpen && activeOption >= 0) {
      event.preventDefault();
      if (activeOption === otherIndex) chooseOther();
      else chooseSchool(matches[activeOption]);
    } else if (event.key === 'Escape') {
      setListOpen(false);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    const payload = buildPayload();
    const found = validateRegistration(payload).errors;
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(fieldIdFor(firstError))?.focus();
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/register-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        setDone(true);
        window.scrollTo(0, 0);
      } else if (result.errors) {
        setErrors(result.errors);
      } else {
        setFormError(result.error ?? 'Something went wrong.');
      }
    } catch {
      setFormError('We couldn’t reach the server. Check your connection and try again.');
    } finally {
      setSending(false);
    }
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
              <i className="bi bi-envelope-paper-fill" /> Register your interest
            </span>
            <h1 className="rm-display">
              Be <span className="rm-underline">first</span> through the door
            </h1>
            <p className="rm-lead">
              Tell us what you are studying and we will let you know the moment your
              course goes live — along with the early-access price for everyone who
              registers before launch.
            </p>
          </div>

          {done ? (
            <div className="rm-form rm-form--done" role="status">
              <span className="rm-card__icon" aria-hidden="true">
                <i className="bi bi-patch-check-fill" />
              </span>
              <h2 className="rm-h3">You’re on the list, thank you!</h2>
              <p className="rm-lead">
                A confirmation email is on its way to {details.email.trim()}. If you can’t
                see it, check your junk folder. In the meantime, have a read of our blog.
              </p>
              <div className="rm-btn-row">
                <Link href="/blog" className="rm-btn rm-btn--primary">
                  Read the blog
                </Link>
                <Link href="/" className="rm-btn rm-btn--ghost">
                  Back to home
                </Link>
              </div>
            </div>
          ) : (
          <form className="rm-form" onSubmit={onSubmit} noValidate>
            <Honeypot value={website} onChange={setWebsite} />

            {/* ------------------------------------------------------ about you */}
            <fieldset>
              <legend>Your details</legend>

              <div className="rm-form__row">
                <div className="rm-field">
                  <label className="rm-field__label" htmlFor="firstName">
                    First name
                  </label>
                  <input
                    className="rm-input"
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Tommy"
                    value={details.firstName}
                    onChange={(event) => setDetail('firstName', event.target.value)}
                    aria-invalid={Boolean(errors.firstName)}
                    required
                  />
                  <FieldError id="firstName" message={errors.firstName} />
                </div>

                <div className="rm-field">
                  <label className="rm-field__label" htmlFor="lastName">
                    Last name
                  </label>
                  <input
                    className="rm-input"
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Shelby"
                    value={details.lastName}
                    onChange={(event) => setDetail('lastName', event.target.value)}
                    aria-invalid={Boolean(errors.lastName)}
                    required
                  />
                  <FieldError id="lastName" message={errors.lastName} />
                </div>
              </div>

              <div className="rm-field">
                <label className="rm-field__label" htmlFor="email">
                  Personal email address
                </label>
                <input
                  className="rm-input"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tommy@shelbycompanyltd.co.uk"
                  value={details.email}
                  onChange={(event) => {
                    setDetail('email', event.target.value);
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
                        setDetail('email', emailSuggestion);
                        setEmailSuggestion(null);
                      }}
                    >
                      {emailSuggestion}
                    </button>
                    ?
                  </p>
                )}
                <p className="rm-field__hint">Where we will send your invite.</p>
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
                  value={details.mobile}
                  onChange={(event) => setDetail('mobile', event.target.value)}
                  onBlur={() => checkOnBlur('mobile')}
                  aria-invalid={Boolean(errors.mobile)}
                />
                <FieldError id="mobile" message={errors.mobile} />
              </div>
            </fieldset>

            {/* --------------------------------------------------- your studies */}
            <fieldset>
              <legend>Your studies</legend>

              <div className="rm-field">
                <span className="rm-field__label">Courses you are interested in</span>
                <div className="rm-choices">
                  {COURSES.map((course) => (
                    <label className="rm-choice" key={course.id}>
                      <input
                        id={`course-${course.id}`}
                        type="checkbox"
                        name="courses"
                        value={course.id}
                        checked={chosenCourses.includes(course.id)}
                        onChange={() => toggleCourse(course.id)}
                      />
                      <i className="bi bi-check-lg" aria-hidden="true" />
                      {course.name}
                    </label>
                  ))}
                </div>
                <FieldError id="courses" message={errors.courses} />
                <p className="rm-field__hint">
                  Pick as many as you like — we will ask for the exam board of each
                  one.
                </p>
              </div>

              {/* One board question per course chosen above, so two courses on
                  different boards can both be recorded properly. */}
              {needBoard.length > 0 && (
                <div className="rm-boards">
                  {needBoard.map((course) => (
                    <div className="rm-field" key={course.id}>
                      <label className="rm-field__label" htmlFor={`board-${course.id}`}>
                        Exam board for {course.name}
                      </label>
                      <select
                        className="rm-input"
                        id={`board-${course.id}`}
                        name={`examBoard.${course.id}`}
                        value={boards[course.id] ?? ''}
                        onChange={(event) => {
                          setBoards((current) => ({ ...current, [course.id]: event.target.value }));
                          clearError(`board.${course.id}`);
                        }}
                        aria-invalid={Boolean(errors[`board.${course.id}`])}
                        required
                      >
                        <option value="" disabled>
                          Choose the board for {course.name}
                        </option>
                        {course.boards?.map((board) => (
                          <option key={board} value={board}>
                            {board}
                          </option>
                        ))}
                      </select>
                      <FieldError id={`board-${course.id}`} message={errors[`board.${course.id}`]} />
                    </div>
                  ))}
                </div>
              )}
            </fieldset>

            {/* ---------------------------------------------------- your school */}
            <fieldset>
              <legend>Your school</legend>

              {schoolIsOther ? (
                <div className="rm-field">
                  <label className="rm-field__label" htmlFor="school">
                    Type your school, sixth form or college <span>(optional)</span>
                  </label>
                  <input
                    className="rm-input"
                    id="school"
                    name="school"
                    type="text"
                    autoComplete="off"
                    placeholder="Garrison Lane Sixth Form"
                    value={otherSchool}
                    onChange={(event) => setOtherSchool(event.target.value)}
                    autoFocus
                  />
                  <p className="rm-field__hint">
                    International students, home-schoolers and private candidates are
                    all welcome.{' '}
                    <button type="button" className="rm-link rm-form__linkbtn" onClick={backToSearch}>
                      Search the list instead
                    </button>
                  </p>
                </div>
              ) : (
                <div className="rm-field">
                  <label className="rm-field__label" htmlFor="school">
                    School, sixth form or college <span>(optional)</span>
                  </label>

                  <div className="rm-combo">
                    <input
                      className="rm-input"
                      id="school"
                      name="school"
                      type="text"
                      role="combobox"
                      aria-expanded={listOpen}
                      aria-controls="school-options"
                      aria-autocomplete="list"
                      autoComplete="off"
                      placeholder="Start typing — e.g. Hills Road Sixth Form College"
                      value={schoolQuery}
                      onChange={(event) => {
                        setSchoolQuery(event.target.value);
                        setChosenSchool(null); // typing again un-picks the school
                        setListOpen(true);
                        setActiveOption(-1);
                      }}
                      onFocus={() => setListOpen(true)}
                      onBlur={() => setListOpen(false)}
                      onKeyDown={onSchoolKeyDown}
                    />

                    {listOpen && (
                      <ul className="rm-combo__list" id="school-options" role="listbox">
                        {matches.map((school, index) => (
                          <li
                            key={school.name}
                            id={`school-option-${index}`}
                            className="rm-combo__option"
                            role="option"
                            aria-selected={index === activeOption}
                            data-active={index === activeOption}
                            /* mousedown, not click: blur would close the list
                               before a click ever landed. */
                            onMouseDown={(event) => {
                              event.preventDefault();
                              chooseSchool(school);
                            }}
                            onMouseEnter={() => setActiveOption(index)}
                          >
                            {school.name}
                            <small>{school.town}</small>
                          </li>
                        ))}
                        {/* Pinned below the scrolling matches, so nobody is ever stuck
                            behind a list their school is not on. */}
                        <li
                          id={`school-option-${otherIndex}`}
                          className="rm-combo__option rm-combo__option--other"
                          role="option"
                          aria-selected={activeOption === otherIndex}
                          data-active={activeOption === otherIndex}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            chooseOther();
                          }}
                          onMouseEnter={() => setActiveOption(otherIndex)}
                        >
                          Other
                          <small>Not listed? Click here to type it in</small>
                        </li>
                      </ul>
                    )}
                  </div>

                  <p className="rm-field__hint">
                    Type to search. Cannot see yours? Choose Other at the bottom of the
                    list.
                  </p>
                </div>
              )}
            </fieldset>

            {/* Unticked by default: PECR needs a clear opt-in for marketing emails. */}
            <label className="rm-consent">
              <input
                type="checkbox"
                name="marketingConsent"
                checked={marketingConsent}
                onChange={(event) => setMarketingConsent(event.target.checked)}
              />
              <span>{MARKETING_WORDING}</span>
            </label>

            {formError && (
              <p className="rm-field__error" role="alert">
                {formError} You can also email us at{' '}
                <a className="rm-link" href="mailto:hello@radixmaths.co.uk">hello@radixmaths.co.uk</a>.
              </p>
            )}

            <div className="rm-form__foot">
              <button type="submit" className="rm-btn rm-btn--primary rm-btn--lg" disabled={sending}>
                {sending ? 'Registering…' : 'Register my interest'}
              </button>
              <p className="rm-form__note">
                <i className="bi bi-patch-check-fill" /> No card needed. Unless you tick the
                box above, we will only email you about your own course. See our{' '}
                <Link href="/privacy" className="rm-link">privacy policy</Link>.
              </p>
            </div>
          </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
