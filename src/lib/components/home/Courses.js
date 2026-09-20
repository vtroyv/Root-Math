import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

const boards = ['Edexcel', 'AQA', 'OCR', 'CIE'];

const included = [
  {
    icon: 'bi-patch-question-fill',
    title: 'Quizzes',
    kicker: 'Hundreds of questions',
    body:
      'Questions from first principles up to exam level and beyond, covering the whole curriculum.',
  },
  {
    icon: 'bi-play-btn-fill',
    title: 'Lessons',
    kicker: 'Detailed yet concise',
    body:
      'Short videos that explain each concept properly, written so it actually sticks.',
  },
  {
    icon: 'bi-file-earmark-text-fill',
    title: 'Exam papers',
    kicker: 'Just like the real thing',
    body:
      'Full mocks under real conditions, marked instantly so you know your grade the same day.',
  },
  {
    icon: 'bi-robot',
    title: 'Designated tutor',
    kicker: 'Experience the power of AI',
    body:
      'Ask questions, have your weaknesses analysed and get instant feedback on your working.',
  },
];

const Courses = () => (
  <section className="rm-section rm-container">
    <Reveal className="rm-section-head">
      <span className="rm-eyebrow">Our courses</span>
      <h2 className="rm-h2">Find your specification</h2>
      <p className="rm-lead">
        RootMath fully covers the A Level Maths specification for Edexcel, AQA, OCR and
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
                  <i className="bi bi-check-lg" aria-hidden="true" /> Available
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
      <h3 className="rm-h2">Every course includes</h3>
    </Reveal>

    <div className="rm-grid rm-grid--4">
      {included.map((item, index) => (
        <Reveal key={item.title} className="rm-card" delay={index * 80}>
          <span className="rm-card__icon" aria-hidden="true">
            <i className={`bi ${item.icon}`} />
          </span>
          <h3 className="rm-h3">{item.title}</h3>
          <span className="rm-card__kicker">{item.kicker}</span>
          <p className="rm-card__body">{item.body}</p>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Courses;
