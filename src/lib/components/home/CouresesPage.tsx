// components/CouresesPage.tsx — the /courses page.
import React from 'react';
import Link from 'next/link';
import Footer from './Footer';

/* =========================================================================
   COURSE CONTENT — everything on this page is generated from this one array,
   so a course is added or reworded here and nowhere else.

   `id`      the anchor the footer and the availability table link to, e.g.
             /courses#a-level-maths. Also the id the register form submits.
   `summary` what the qualification itself is.
   `covers`  what sits on the specification.
   `prepare` PLACEHOLDER COPY — this is the part to rewrite in your own words.
             Each bracketed line is a prompt, not finished copy: say how
             RootMath gets a student ready for that particular course and
             delete the brackets.
   ========================================================================= */
const courses = [
  {
    id: 'a-level-maths',
    name: 'A Level Maths',
    status: 'live',
    boards: 'Edexcel · AQA · OCR · OCR (MEI) · CIE',
    summary:
      'The full A Level: Pure Maths alongside Statistics and Mechanics, taught across two years and examined at the end of Year 13 — usually three papers, whichever board you sit.',
    covers: [
      'Pure — proof, algebra and functions, coordinate geometry, sequences and series, trigonometry, exponentials and logarithms',
      'Calculus — differentiation, integration, parametric and implicit methods, numerical solutions',
      'Statistics — sampling, data presentation, probability, distributions and hypothesis testing',
      'Mechanics — kinematics, forces and Newton’s laws, moments and projectile motion',
      'Exam technique — full past papers marked under real timing',
    ],
    prepare: [
      '[Your words here — how RootMath prepares a student for A Level Maths. Worth covering: lesson-by-lesson coverage of the whole specification, the question bank running from first principles up to exam standard, and marking that lands the moment a question is submitted.]',
      '[Second paragraph — the bit only you can write: what a student who works through this course can expect by results day, and why that beats a weekly tutor.]',
    ],
  },
  {
    id: 'a-level-further-maths',
    name: 'A Level Further Maths',
    status: 'soon',
    boards: 'Edexcel · AQA · OCR · OCR (MEI) · CIE',
    summary:
      'Taken alongside A Level Maths, Further Maths pushes past the core content into complex numbers, matrices and further calculus, plus the applied options your school chooses.',
    covers: [
      'Core Pure — complex numbers, matrices, proof by induction, series and vectors',
      'Further calculus — improper integrals, volumes of revolution, differential equations',
      'Further algebra — roots of polynomials, hyperbolic functions, polar coordinates',
      'Optional routes — further statistics, further mechanics or decision maths',
      'The step up in pace that makes Further Maths the course students most often fall behind in',
    ],
    prepare: [
      '[Your words here — how RootMath prepares a student for Further Maths. Worth covering: how the course handles the different optional modules, and how it keeps Further Maths moving alongside the main A Level rather than competing with it.]',
      '[Second paragraph — who this course is for: the student aiming at a STEM degree, and what they get out of it.]',
    ],
  },
  {
    id: 'gcse-maths',
    name: 'GCSE Maths',
    status: 'soon',
    boards: 'Edexcel · AQA · OCR · WJEC / Eduqas · CIE (IGCSE)',
    summary:
      'Foundation and Higher tier GCSE — the qualification every sixth form, apprenticeship and university course asks for. Three papers, one of them non-calculator.',
    covers: [
      'Number — fractions, ratio and proportion, percentages, standard form, bounds',
      'Algebra — expressions, equations, simultaneous equations, quadratics and graphs',
      'Geometry and measures — angles, circle theorems, trigonometry, transformations',
      'Probability and statistics — averages, diagrams, tree diagrams and interpretation',
      'Multi-step problem solving, which is where most of the marks are won or lost',
    ],
    prepare: [
      '[Your words here — how RootMath prepares a student for GCSE Maths. Worth covering: how the course handles both tiers, how it finds the gaps a student has been carrying since Year 9, and the drilling that turns a grade 6 into a grade 8.]',
      '[Second paragraph — what a parent reading this page needs to hear.]',
    ],
  },
  {
    id: 'step',
    name: 'STEP',
    status: 'soon',
    boards: 'Set by Cambridge Assessment · Required by Cambridge and Warwick',
    summary:
      'The Sixth Term Examination Paper: a three-hour admissions exam of a few long, unfamiliar problems rather than many short ones. Offers from Cambridge and Warwick routinely hang on it.',
    covers: [
      'Pure problems built on A Level content and taken a great deal further',
      'Long, multi-part questions where the method is not handed to you',
      'Mechanics and probability questions sitting on the same paper',
      'Marks for a complete, well-argued solution — six questions, three hours',
      'The habit of staying with a problem you cannot immediately see through',
    ],
    prepare: [
      '[Your words here — how RootMath prepares a student for STEP. Worth covering: how the course teaches problem solving rather than method recall, and what worked solutions and feedback look like for a question this open-ended.]',
      '[Second paragraph — why students holding a Cambridge or Warwick offer should start this early rather than after mocks.]',
    ],
  },
  {
    id: 'tmua',
    name: 'TMUA',
    status: 'soon',
    boards: 'Sat before your offer · Used by Cambridge, Imperial, LSE, Durham and Warwick',
    summary:
      'The Test of Mathematics for University Admission: two 75-minute multiple-choice papers, one on applying mathematical knowledge and one on mathematical reasoning and logic.',
    covers: [
      'Paper 1 — applying A Level style maths quickly and accurately',
      'Paper 2 — logic and proof: implications, necessary and sufficient conditions, counterexamples',
      'No calculator, and roughly four minutes a question, so speed counts',
      'Scored 1.0 to 9.0, with offers typically naming a score to hit',
      'Recognising the wrong answers a question has been built to tempt you into',
    ],
    prepare: [
      '[Your words here — how RootMath prepares a student for the TMUA. Worth covering: timed practice at real exam pace, and how the course drills the reasoning paper, which is unlike anything else a student has sat.]',
      '[Second paragraph — the score a student should be aiming for and how the course tracks progress towards it.]',
    ],
  },
];

const statusLabel = { live: 'Available now', soon: 'Coming soon' } as const;

export default function CoursesPage() {
  return (
    <div className="rm-landing">
      {/* -------------------------------------------------- header + availability */}
      <header className="rm-paperhead">
        {/* Sketched axes and a parabola, drawn deliberately off-true so it
            matches the hand-drawn borders everywhere else. */}
        <svg
          className="rm-paperhead__sketch"
          viewBox="0 0 300 240"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M42 14C40 74 43 140 41 212" />
          <path d="M12 196C92 198 204 193 288 196" />
          <path d="M42 14 36 28M42 14 49 27" />
          <path d="M288 196 275 189M288 196 274 203" />
          <path d="M70 30C104 118 142 196 172 194c30-2 62-84 104-168" />
          <path d="M96 191v10M150 189v10M204 190v10M36 150h10M36 104h10M36 58h10" strokeWidth="2.5" />
        </svg>

        <div className="rm-container">
          <div className="rm-section-head">
            <span className="rm-eyebrow">
              <i className="bi bi-journal-bookmark-fill" /> Our courses
            </span>
            <h1 className="rm-display">
              Everything we <span className="rm-underline">teach</span>
            </h1>
            <p className="rm-lead">
              A Level Maths is live today; the rest are being built in the order below.
              Pick a course to read what it covers and how RootMath gets you through it.
            </p>
          </div>

          <div className="rm-table-wrap">
            <table className="rm-table">
              <thead>
                <tr>
                  <th scope="col">Course</th>
                  <th scope="col">Exam boards</th>
                  <th scope="col">Availability</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <th scope="row">
                      <Link href={`#${course.id}`} className="rm-link">
                        {course.name}
                      </Link>
                    </th>
                    <td>{course.boards}</td>
                    <td>
                      <span className={`rm-tag rm-tag--${course.status}`}>
                        {course.status === 'live' && (
                          <i className="bi bi-check-lg" aria-hidden="true" />
                        )}
                        {statusLabel[course.status as keyof typeof statusLabel]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------- one section per course */}
      {courses.map((course, index) => (
        <section
          key={course.id}
          id={course.id}
          className={`rm-course${index % 2 ? ' rm-course--alt' : ''}`}
        >
          <div className="rm-container">
            <div className="rm-course__head">
              <h2 className="rm-h2">{course.name}</h2>
              <span className={`rm-tag rm-tag--${course.status}`}>
                {statusLabel[course.status as keyof typeof statusLabel]}
              </span>
            </div>

            <p className="rm-lead">{course.summary}</p>
            <p className="rm-course__boards">{course.boards}</p>

            <div className="rm-grid rm-grid--2 rm-course__panels">
              <div className="rm-card">
                <span className="rm-card__icon" aria-hidden="true">
                  <i className="bi bi-list-check" />
                </span>
                <h3 className="rm-h3">What the course covers</h3>
                <ul className="rm-card__list">
                  {course.covers.map((item) => (
                    <li key={item}>
                      <i className="bi bi-check-lg" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rm-card">
                <span className="rm-card__icon" aria-hidden="true">
                  <i className="bi bi-rocket-takeoff-fill" />
                </span>
                <h3 className="rm-h3">How RootMath gets you ready</h3>
                {/* Placeholder copy — see the note at the top of this file. */}
                {course.prepare.map((paragraph) => (
                  <p className="rm-card__body" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}
