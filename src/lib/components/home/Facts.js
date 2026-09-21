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
    icon: 'bi-lightning-charge-fill',
    tilt: '0.9deg',
    kicker: 'AI, not appointments',
    title: 'Instant marking',
    body: 'You get the benefits of one-to-one tuition without the waiting or the cost.',
    list: [
      'Real time marking and custom feedback',
      'Study plans built around your weak topics',
      'Ask a question mid-problem, get hints and redirection',
    ],
    href: '/features',
    cta: 'How the marking works',
  },
  {
    icon: 'bi-collection-fill',
    tilt: '0.8deg',
    kicker: 'Everything in one place',
    title: 'Content packed',
    body: 'Lessons, worked examples, topic quizzes and full mock papers sit side by side, so revision never means hunting across six websites again. Sketch a graph, type real maths notation, and keep every note attached to the question it belongs to.',
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
      <h2 className="rm-h2">Reasons students stick with us</h2>
      <p className="rm-lead">
        RootMath is not another video library. It marks your work, finds your gaps and
        tells you what to do next.
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
