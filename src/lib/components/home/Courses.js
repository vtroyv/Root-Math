import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

const boards = ['Edexcel', 'AQA', 'OCR', 'CIE'];

const admissionsTests = [
  {
    name: 'STEP',
    full: 'Sixth Term Examination Paper',
    required: 'Cambridge, Warwick',
  },
  {
    name: 'TMUA',
    full: 'Test of Mathematics for University Admission',
    required: 'Cambridge, Oxford, Imperial, LSE, Durham, Warwick',
  },
];

const included = [
  {
    icon: 'bi-play-btn-fill',
    title: 'Lessons',
    kicker: 'Detailed yet concise',
    body:
      'Every topic broken into short parts you can finish in one sitting, explained properly so it actually sticks.',
    list: [
      'A short video for every lesson part, with the graphs animated in every graphical topic',
      'Questions inside every part, marked as you go, with a hint whenever you get stuck',
      "Finish a part's questions to move on, so when you complete a lesson you know you can actually do it, not just that you've watched it",
    ],
  },
  {
    icon: 'bi-patch-question-fill',
    title: 'Questions by topics',
    kicker: 'Hundreds of questions',
    body:
      'Questions from first principles up to exam level and beyond, covering the whole curriculum.',
    list: [
      'Answer the way you would on paper: sketch curves, plot points, order proof steps and write out your working',
      'A video walkthrough for every question',
      'Model solutions, mark schemes and written feedback on every part',
    ],
  },
  {
    icon: 'bi-file-earmark-text-fill',
    title: 'Custom exam papers',
    kicker: 'Just like the real thing',
    body:
      'Papers written by us that you won’t find anywhere else, sat under real conditions and marked instantly so you know your grade the same day.',
    list: [
      'Marked part by part, so you see exactly where the marks went',
      'Worked solutions and mark schemes for every question',
    ],
  },
  {
    icon: 'bi-chat-dots-fill',
    title: "Help when you're stuck",
    kicker: 'Hints, not answers',
    body:
      "Stuck on a step? Ask for help right beside the question. Each hint moves you one step further, so you still do the maths yourself and remember how.",
    list: [
      "Already knows the question and part you're on, so there's nothing to explain",
      "Explains it another way if the first explanation doesn't land",
      'There at 11pm the night before a test, at no extra cost',
    ],
  },
];

// The full-width card under the four above: reviews and progress together are what
// the A/A* guarantee rests on (see the guarantee answer in Faq.js), so it closes the section.
const reviewsAndProgress = {
  icon: 'bi-bullseye',
  title: 'Reviews and progress',
  kicker: 'The plan behind the guarantee',
  body:
    "Finish a lesson or question and its key steps become spaced repetition review cards, each one timed to come back just before you'd forget it, so everything is in your long-term memory by your exam. Your Progress page learns from everything you do on the site, from your marks and the hints you use to the reviews you pass, and turns it into daily and weekly targets.",
  list: [
    'Review cards for every lesson and question, scheduled around your exam date',
    'Your strengths and weaknesses in every topic, worked out from how you actually answer',
    'Which lessons to focus on next, and which reviews are due today',
  ],
  guarantee:
    'Complete your targets and reviews and still fall short of an A or A*? You get a full refund.',
};

const Courses = () => (
  <>
  <section className="rm-section rm-container">
    <Reveal className="rm-section-head">
      <span className="rm-eyebrow">Our courses</span>
      <h2 className="rm-h2">Find your specification</h2>
      <p className="rm-lead">
        RadixMaths fully covers the A Level Maths specification for Edexcel, AQA, OCR and
        CIE. Course not listed?{' '}
        <Link href="/contact" className="rm-link">
          Get in touch
        </Link>{' '}
        and we will tell you which one matches your curriculum best.
      </p>
    </Reveal>

    <Reveal className="rm-table-wrap">
      <table className="rm-table">
        <thead>
          <tr>
            <th scope="col">Exam board</th>
            <th scope="col">A Level Maths</th>
            <th scope="col">A Level Further Maths</th>
            <th scope="col">GCSE</th>
          </tr>
        </thead>
        <tbody>
          {boards.map((board) => (
            <tr key={board}>
              <th scope="row">{board}</th>
              <td>
                <span className="rm-tag rm-tag--live">
                  <i className="bi bi-calendar-check" aria-hidden="true" /> Opens 1 December
                </span>
              </td>
              <td>
                <span className="rm-tag rm-tag--soon">Coming soon</span>
              </td>
              <td>
                <span className="rm-tag rm-tag--soon">Coming soon</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>



    <Reveal
      className="rm-section-head"
      style={{ marginTop: 'clamp(3rem, 6vw, 4.5rem)' }}
    >
      <span className="rm-eyebrow">Beyond A Level</span>
      <h3 className="rm-h2">The exams that decide the offer</h3>
      <p className="rm-lead">
        Every year, students holding conditional offers for STEM courses at top
        universities lose them on the admissions test rather than on their A Levels.
        STEP and TMUA are hard by design — they reward working out a problem you have
        never seen before, not recalling a method you have drilled. That is exactly
        what we are building for: the same lessons, question banks and instant marking,
        pointed at your raw problem solving.
      </p>
    </Reveal>

    <Reveal className="rm-table-wrap">
      <table className="rm-table">
        <thead>
          <tr>
            <th scope="col">Admissions test</th>
            <th scope="col">Typically required by</th>
            <th scope="col">Coverage</th>
          </tr>
        </thead>
        <tbody>
          {admissionsTests.map((test) => (
            <tr key={test.name}>
              <th scope="row">
                {test.name}
                <span className="rm-table__sub">{test.full}</span>
              </th>
              <td>{test.required}</td>
              <td>
                <span className="rm-tag rm-tag--soon">Coming soon</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>

    <Reveal
      className="rm-section-head"
      style={{ marginTop: 'clamp(3rem, 6vw, 4.5rem)' }}
    >
      <h3 className="rm-h2">Every course includes</h3>
    </Reveal>

    {/* two columns rather than four, so the checklists have room to read */}
    <div className="rm-grid rm-grid--2">
      {included.map((item, index) => (
        <Reveal key={item.title} className="rm-card" delay={index * 80}>
          <span className="rm-card__icon" aria-hidden="true">
            <i className={`bi ${item.icon}`} />
          </span>
          <h3 className="rm-h3">{item.title}</h3>
          <span className="rm-card__kicker">{item.kicker}</span>
          <p className="rm-card__body">{item.body}</p>
          <ul className="rm-card__list">
            {item.list.map((point) => (
              <li key={point}>
                <i className="bi bi-check-lg" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}

      <Reveal className="rm-card" style={{ gridColumn: '1 / -1' }}>
        <span className="rm-card__icon" aria-hidden="true">
          <i className={`bi ${reviewsAndProgress.icon}`} />
        </span>
        <h3 className="rm-h3">{reviewsAndProgress.title}</h3>
        <span className="rm-card__kicker">{reviewsAndProgress.kicker}</span>
        <p className="rm-card__body">{reviewsAndProgress.body}</p>
        <ul className="rm-card__list">
          {reviewsAndProgress.list.map((point) => (
            <li key={point}>
              <i className="bi bi-check-lg" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <p className="rm-card__foot rm-hero__trust" style={{ margin: 0, color: 'var(--rm-ink)' }}>
          <i className="bi bi-patch-check-fill" aria-hidden="true" />
          {reviewsAndProgress.guarantee}
        </p>
      </Reveal>
    </div>
  </section>

  
  

  </>

  
);

export default Courses;
