'use client';

import React, { useMemo, useState } from 'react';
import Footer from './Footer';

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

const aLevelBoards = [
  'Edexcel',
  'AQA',
  'OCR',
  'OCR (MEI)',
  'CIE',
  'Other / not sure yet',
];

const gcseBoards = [
  'Edexcel',
  'AQA',
  'OCR',
  'WJEC / Eduqas',
  'CIE (IGCSE)',
  'Other / not sure yet',
];

/* A course carries its own board list, so the exam-board questions below the
   picker are per course — a student doing Edexcel A Level and AQA GCSE can say
   so. STEP and TMUA have no `boards`: each is set by a single body, so there
   is nothing to ask. The `id` is what gets submitted, both as a `courses`
   value and as the `examBoard.<id>` key of its board. */
const courses = [
  { id: 'a-level-maths', name: 'A Level Maths', boards: aLevelBoards },
  { id: 'a-level-further-maths', name: 'A Level Further Maths', boards: aLevelBoards },
  { id: 'gcse-maths', name: 'GCSE Maths', boards: gcseBoards },
  { id: 'step', name: 'STEP', boards: null },
  { id: 'tmua', name: 'TMUA', boards: null },
];

type School = { name: string; town: string; custom?: boolean };

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
   candidates) is caught by the "use what I typed" row at the foot of the list.
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

export default function RegisterInterest() {
  const [chosenCourses, setChosenCourses] = useState<string[]>([]);
  const [schoolQuery, setSchoolQuery] = useState('');
  const [listOpen, setListOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(-1);

  const toggleCourse = (id: string) =>
    setChosenCourses((current) =>
      current.includes(id)
        ? current.filter((courseId) => courseId !== id)
        : [...current, id],
    );

  // Kept in the order the courses are listed rather than the order they were
  // ticked, so the board questions never jump around underneath the pills.
  const selected = courses.filter((course) => chosenCourses.includes(course.id));
  const needBoard = selected.filter((course) => course.boards);

  const matches = useMemo(() => {
    const query = normalise(schoolQuery);
    const hits = query
      ? schools.filter((school) =>
          normalise(`${school.name} ${school.town}`).includes(query),
        )
      : schools;

    const found = hits.slice(0, 8);

    // Whatever they typed is always offered as the last row, so nobody is
    // stuck behind a list their school is not on.
    if (query && !found.some((school) => normalise(school.name) === query)) {
      found.push({
        name: schoolQuery.trim(),
        town: 'Use what I typed — international, home-schooled or private candidate',
        custom: true,
      });
    }

    return found;
  }, [schoolQuery]);

  const chooseSchool = (school: School) => {
    setSchoolQuery(school.name);
    setListOpen(false);
    setActiveOption(-1);
  };

  const onSchoolKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!listOpen) {
        setListOpen(true);
        return;
      }
      if (!matches.length) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveOption((index) => (index + step + matches.length) % matches.length);
    } else if (event.key === 'Enter' && listOpen && matches[activeOption]) {
      event.preventDefault();
      chooseSchool(matches[activeOption]);
    } else if (event.key === 'Escape') {
      setListOpen(false);
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

          <form className="rm-form">
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
                    placeholder="Ada"
                    required
                  />
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
                    placeholder="Lovelace"
                    required
                  />
                </div>
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
                <p className="rm-field__hint">
                  Where we will send your invite. A personal address works best —
                  school inboxes often block us.
                </p>
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
              </div>
            </fieldset>

            {/* --------------------------------------------------- your studies */}
            <fieldset>
              <legend>Your studies</legend>

              <div className="rm-field">
                <span className="rm-field__label">Courses you are interested in</span>
                <div className="rm-choices">
                  {courses.map((course) => (
                    <label className="rm-choice" key={course.id}>
                      <input
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
                <p className="rm-field__hint">
                  Pick as many as you like — we will ask for the exam board of each
                  one.
                </p>
              </div>

              {/* One board question per course chosen above, so two courses on
                  different boards can both be recorded properly. */}
              {selected.length > 0 && (
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
                        defaultValue=""
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
                    </div>
                  ))}

                  {selected.length > needBoard.length && (
                    <p className="rm-field__hint">
                      STEP and TMUA are each set by a single board, so there is
                      nothing to choose for those.
                    </p>
                  )}
                </div>
              )}
            </fieldset>

            {/* ---------------------------------------------------- your school */}
            <fieldset>
              <legend>Your school</legend>

              <div className="rm-field">
                <label className="rm-field__label" htmlFor="school">
                  School, sixth form or college
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
                      setListOpen(true);
                      setActiveOption(-1);
                    }}
                    onFocus={() => setListOpen(true)}
                    onBlur={() => setListOpen(false)}
                    onKeyDown={onSchoolKeyDown}
                    required
                  />

                  {listOpen && matches.length > 0 && (
                    <ul className="rm-combo__list" id="school-options" role="listbox">
                      {matches.map((school, index) => (
                        <li
                          key={school.custom ? 'custom' : school.name}
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
                    </ul>
                  )}
                </div>

                <p className="rm-field__hint">
                  Type to search. Cannot see yours? Keep typing and pick the last
                  row — international students, home-schoolers and private
                  candidates are all welcome.
                </p>
              </div>
            </fieldset>

            <div className="rm-form__foot">
              <button type="submit" className="rm-btn rm-btn--primary rm-btn--lg">
                Register my interest
              </button>
              <p className="rm-form__note">
                <i className="bi bi-patch-check-fill" /> No card needed. We will only
                email you about your own course.
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
