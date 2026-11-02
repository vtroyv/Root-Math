// components/CouresesPage.tsx — the /courses page.
import React from 'react';
import Link from 'next/link';
import Footer from './Footer';

/* =========================================================================
   COURSE CONTENT: everything on this page is generated from this one array,
   so a course is added or reworded here and nowhere else.

   `id`      the anchor the footer and the availability table link to, e.g.
             /courses#a-level-maths. Also the id the register form submits.
   `status`  a key of statusInfo below.
   `summary` what the qualification itself is.
   `covers`  what sits on the specification.
   `prepare` how RadixMaths helps. Unopened courses say "will", because they
             describe the plan. Change that to the present tense at launch.

   STEP and TMUA rules change often, so check the university and exam board
   pages each year. Last checked 2 November 2026.
   ========================================================================= */
const courses = [
  {
    id: 'a-level-maths',
    name: 'A Level Maths',
    status: 'opening',
    boards: 'Edexcel · AQA · OCR · OCR (MEI) · CIE',
    summary:
      'The full A Level: Pure Maths alongside Statistics and Mechanics, taught across two years and examined at the end of Year 13 — usually three papers, whichever board you sit.',
    covers: [
      'Pure — proof, algebra and functions, coordinate geometry, sequences and series, trigonometry, exponentials and logarithms',
      'Calculus — differentiation, integration, parametric and implicit methods, numerical solutions',
      'Statistics — sampling, data presentation, probability, distributions and hypothesis testing',
      'Mechanics — kinematics, forces and Newton’s laws, moments and projectile motion',
      'Exam technique — custom papers you won’t find anywhere else, under real timing',
    ],
    prepare: [
      'Year 12 opens on 1 December and Year 13 follows in January. Every topic is split into short lessons, with a video for each part and questions inside it, so finishing a lesson means you can actually do the maths. Exam-style questions and custom papers you won’t find anywhere else then build from first principles to full exam standard.',
      'Review cards bring each topic back before you forget it, and your Progress page shows your weakest topics and what to do next. When you get stuck, there’s a tutor beside every question and other students in the comments who have just worked through the same thing.',
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
      'Exam technique for the faster pace and harder questions',
    ],
    prepare: [
      'Every Further Maths topic will be split into short lessons, with a video for each part and questions inside it, so you know you can do the maths before moving on. Exam-style practice then builds up to custom papers you won’t find anywhere else. Review cards will bring topics back before you forget them, and a Progress page will show what to focus on, helping you keep up alongside your main A Level.',
      'It’s for students aiming at degrees like maths, engineering, physics or computer science, where it can be required or give you a real advantage. Register your interest and we’ll email you when it opens.',
    ],
  },
  {
    id: 'gcse-maths',
    name: 'GCSE Maths',
    status: 'soon',
    boards: 'Edexcel · AQA · OCR · WJEC / Eduqas · CIE (IGCSE)',
    summary:
      'Foundation and Higher tier GCSE, the qualification most sixth forms, apprenticeships and university courses ask for. Usually three papers, with one of them non-calculator.',
    covers: [
      'Number — fractions, ratio and proportion, percentages, standard form, bounds',
      'Algebra — expressions, equations, simultaneous equations, quadratics and graphs',
      'Geometry and measures — angles, circle theorems, trigonometry, transformations',
      'Probability and statistics — averages, diagrams, tree diagrams and interpretation',
      'Multi-step problem solving, which is where most of the marks are won or lost',
    ],
    prepare: [
      'Every GCSE topic will be split into short lessons, with a video for each part and questions inside it, so you know you can do the maths before moving on. Exam-style practice then builds up to the multi-step problems where marks are won or lost.',
      'For parents: a Progress page will show which topics are strong and which need work, so you can see how your child is doing without having to ask. Short review cards will bring earlier topics back before they’re forgotten, right up to the exams.',
    ],
  },
  {
    id: 'step',
    name: 'STEP',
    status: 'soon',
    boards: 'Set by OCR · Typically required by Cambridge and Warwick',
    summary:
      'The Sixth Term Examination Paper: an admissions exam sat in June, made up of long, unfamiliar problems rather than many short ones. Offers from Cambridge and Warwick often depend on it, so check your course’s requirements.',
    covers: [
      'Pure problems built on A Level content and taken a great deal further',
      'Long, multi-part questions where the method is not handed to you',
      'Mechanics and probability questions sitting on the same paper',
      'Marks for complete, well-argued solutions',
      'The habit of staying with a problem you cannot immediately see through',
    ],
    prepare: [
      'STEP rewards thinking through problems you have never seen, so this course will focus on problem solving rather than repeating methods: how to get started, what to try when you’re stuck, and how to write a complete argument.',
      'A tutor beside every question will give hints one step at a time rather than handing over the solution, and comments from other students will let you compare different approaches to the same problem. Start early: the exam is in June, and these skills take months to build, not weeks.',
    ],
  },
  {
    id: 'tmua',
    name: 'TMUA',
    status: 'soon',
    boards: 'Sat in October or January · Used by Cambridge, Oxford, Imperial, LSE, Durham and Warwick',
    summary:
      'The Test of Mathematics for University Admission: two 75-minute multiple-choice papers, one on applying mathematical knowledge and one on mathematical reasoning and logic.',
    covers: [
      'Paper 1 — applying A Level style maths quickly and accurately',
      'Paper 2 — logic and proof: implications, necessary and sufficient conditions, counterexamples',
      'No calculator, and roughly four minutes a question, so speed counts',
      'Scored from 1.0 to 9.0, and each university decides how it uses your score',
      'Recognising the wrong answers a question has been built to tempt you into',
    ],
    prepare: [
      'The TMUA is about speed and reasoning, so this course will include timed practice at real exam pace, plus dedicated work on the logic paper, which is unlike anything most students have sat before.',
      'Tempting wrong answers are part of the test, so worked solutions will explain why the wrong answers are wrong as well as why the right one is right. Check which sitting your university accepts, and leave yourself time to prepare.',
    ],
  },
];

const statusInfo = {
  opening: { label: 'Opens 1 December', tone: 'live', icon: 'bi-calendar-check' },
  soon: { label: 'Coming soon', tone: 'soon', icon: null },
} as const;

function StatusTag({ status }: { status: string }) {
  const { label, tone, icon } = statusInfo[status as keyof typeof statusInfo];
  return (
    <span className={`rm-tag rm-tag--${tone}`}>
      {icon && <i className={`bi ${icon}`} aria-hidden="true" />}
      {label}
    </span>
  );
}

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
              A Level Maths opens first: Year 12 on 1 December, and Year 13 in January.
              Further Maths, GCSE, STEP and TMUA are on the way. Pick a course to see what
              it covers and how RadixMaths helps.
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
                      <StatusTag status={course.status} />
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
              <StatusTag status={course.status} />
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
                <h3 className="rm-h3">How RadixMaths gets you ready</h3>
                {course.prepare.map((paragraph) => (
                  <p className="rm-card__body" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
                <div className="rm-card__foot">
                  <Link href="/register" className="rm-btn rm-btn--primary">
                    Register your interest
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}
