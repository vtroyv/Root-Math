import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

const faqs = [
  {
    q: 'How do we get our A/A* guarantee?',
    a: [
      <>
        RootMath uses machine learning and well-researched study techniques to assess each
        student&apos;s current working level, then assigns daily and weekly targets aimed at
        an A or A*.
      </>,
      <>
        We are confident enough in the platform that any student who fulfils their targets
        and still falls short of an A/A* gets a full refund. You can read the detail{' '}
        <Link href="/features" className="rm-link">
          here
        </Link>
        .
      </>,
    ],
  },
  {
    q: 'Is it worth getting RootMath in year 12?',
    a: [
      <>
        Absolutely. You may not sit real exams in year 12, but it is the year your
        performance sets the predicted grades you apply to university with.
      </>,
      <>
        Getting those grades right matters just as much — and it is far easier with
        RootMath behind you.
      </>,
    ],
  },
  {
    q: 'How do I know RootMath will actually help me?',
    a: [
      <>
        RootMath is built to cater to every student&apos;s needs, whatever your background or
        starting knowledge level.
      </>,
      <>
        We have drawn on an arsenal of world-class study techniques to help all students
        reach the highest grades. You can read more about the learning techniques built
        into the platform{' '}
        <Link href="/features" className="rm-link">
          here
        </Link>
        .
      </>,
    ],
  },
  {
    q: 'How does the integrated tutor work?',
    a: [
      <>
        You get an AI-powered tutor you can ask anything you would ask a real one — mid
        question, at 2am, as many times as you like.
      </>,
      <>
        It exists to bridge the gap between online learning platforms and traditional
        tuition: all the benefits, a fraction of the cost.{' '}
        <Link href="/features" className="rm-link">
          Learn more
        </Link>
        .
      </>,
    ],
  },
  {
    q: 'What makes RootMath lessons special?',
    a: [
      <>
        Our videos use scenarios that relate to your actual life to build concrete
        examples, then use animation and gamification to carry you from those examples
        into abstract thinking.
      </>,
      <>
        Quizzes and the AI tutor are built into the lessons themselves, so you are
        practising as you learn rather than after it.
      </>,
    ],
  },
  {
    q: 'Does a course include both year 12 and year 13 content?',
    a: [
      <>
        Yes. When you buy a course you choose how long you have access for — a student
        starting year 12 can pay through to their exams at the end of year 13, while a
        year 13 student pays through to that year&apos;s exam season.
      </>,
      <>
        However long you choose, each course contains the relevant year 12 and year 13
        material.{' '}
        <Link href="/pricing" className="rm-link">
          See pricing
        </Link>
        .
      </>,
    ],
  },
];

const Faq = () => (
  <section className="rm-faq">
    <div className="rm-container">
      <Reveal className="rm-section-head">
        <span className="rm-eyebrow">FAQs</span>
        <h2 className="rm-h2">Got questions? Answered</h2>
        <p className="rm-lead">
          If yours is not covered below, ask us directly{' '}
          <Link href="/contact" className="rm-link">
            here
          </Link>
          .
        </p>
      </Reveal>

      <Reveal className="rm-accordion">
        {faqs.map((faq) => (
          <details key={faq.q}>
            <summary>{faq.q}</summary>
            <div className="rm-accordion__body">
              {faq.a.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </details>
        ))}
      </Reveal>
    </div>
  </section>
);

export default Faq;
