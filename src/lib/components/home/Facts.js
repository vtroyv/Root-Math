import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

const pillars = [
  {
    icon: 'bi-journal-bookmark-fill',
    tilt: '-1.2deg',
    kicker: 'All major exam boards',
    title: 'Syllabus specific',
    body: 'Built for every student sitting Maths A Level in the UK, whichever board you are on. Each video, question and paper is mapped to a topic on your specification — nothing off-syllabus, nothing missing.',
    href: '/courses',
    cta: 'See course coverage',
  },
  {
    icon: 'bi-signpost-split-fill',
    tilt: '0.9deg',
    kicker: 'Stuck is where you grow',
    title: 'Help that doesn’t do it for you',
    body: 'Most AI hands you the answer, and you don’t find out you can’t do it until you’re alone in the exam. RadixMaths keeps the thinking with you.',
    list: [
      'Hints that point the way, without giving the answer away',
      'Fix your mistakes and try again, keeping the parts you got right',
      'The full solution stays hidden until you choose to see it',
    ],
    href: '/mission',
    cta: 'Why we built it this way',
  },
  {
    icon: 'bi-collection-fill',
    tilt: '0.8deg',
    kicker: 'Everything in one place',
    title: 'Content packed',
    body: 'Lessons, worked examples, topic quizzes and custom papers you won’t find anywhere else sit side by side, so revision never means hunting across six websites again. Sketch a graph, type real maths notation, and keep every note attached to the question it belongs to.',
    href: '/features',
    cta: 'Explore the platform',
  },
  {
    icon: 'bi-lightbulb-fill',
    tilt: '-1deg',
    kicker: 'Beyond the syllabus',
    title: 'Problem solving',
    body: 'Top marks take more than recall. Alongside the full specification, we teach the art of attacking a question you have never seen before — and the mindset to keep reasoning when the way in is not obvious.',
    list: [
      'Dedicated lessons on cracking unfamiliar problems',
      'The kind of reasoning STEP and TMUA reward',
      'Thinking habits that outlast A Level',
    ],
    href: '/features',
    cta: 'Inside the lessons',
  },
];

const Facts = () => (
  <section className="rm-section rm-container">
    <Reveal className="rm-section-head">
      <span className="rm-eyebrow">What you get</span>
      <h2 className="rm-h2">What makes RadixMaths different</h2>
      <p className="rm-lead">
        RadixMaths is not another video library. You do the maths, get help when you need it,
        and see exactly what to work on next.
      </p>
    </Reveal>

    <div className="rm-grid rm-grid--2">
      {pillars.map((pillar, index) => (
        <Reveal key={pillar.title} className="rm-cardslot" delay={index * 90}>
          <div className="rm-notecard" style={{ '--rm-tilt': pillar.tilt }}>
            <span className="rm-card__icon" aria-hidden="true">
              <i className={`bi ${pillar.icon}`} />
            </span>
            <span className="rm-card__kicker">{pillar.kicker}</span>
            <h3 className="rm-h3">{pillar.title}</h3>
            <p className="rm-card__body">{pillar.body}</p>

            {pillar.list && (
              <ul className="rm-card__list">
                {pillar.list.map((item) => (
                  <li key={item}>
                    <i className="bi bi-check-lg" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="rm-card__foot">
              <Link href={pillar.href} className="rm-link">
                {pillar.cta} →
              </Link>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Facts;
