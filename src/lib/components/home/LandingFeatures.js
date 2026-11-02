import React from 'react';
import Reveal from './Reveal';

/*
Why RadixMaths: three reasons the rest of the landing page doesn't already make
(community, review cards, the Progress page). Each card opens with a small
hand-drawn sketch of the feature, built from plain HTML so it matches the page
instead of a cartoon. Static, no animation — see .rm-why__sketch in globals.css.
*/

const CommunitySketch = () => (
  <div className="rm-why__sketch" aria-hidden="true">
    <div className="rm-why__chip">
      Why does the 2 multiply the −9 as well?
      <small>@priya · ▲ 8</small>
    </div>
    <div className="rm-why__chip rm-why__chip--reply">
      It&apos;s still inside the bracket! Expand it and you&apos;ll see 🙌
      <small>@sam · ▲ 14</small>
    </div>
    <div className="rm-why__chip rm-why__chip--pinned">
      <small>
        <i className="bi bi-pin-angle-fill" /> RadixMaths team
      </small>
      Spot on, Sam. That&apos;s the exact trap examiners set.
    </div>
  </div>
);

const ReviewSketch = () => (
  <div className="rm-why__sketch" aria-hidden="true">
    <div className="rm-why__chip">
      What four things do you find before sketching y = ax² + bx + c?
    </div>
    <div className="rm-why__row">
      {['Again', 'Hard', 'Good', 'Easy'].map((label) => (
        <span key={label} className={`rm-why__chip${label === 'Good' ? ' rm-why__chip--on' : ''}`}>
          {label}
        </span>
      ))}
    </div>
    <small>
      <i className="bi bi-arrow-repeat" /> Back in 6 days, just before you&apos;d forget
    </small>
  </div>
);

const topics = [
  { name: 'Quadratics', mastery: 85 },
  { name: 'Differentiation', mastery: 60 },
  { name: 'Binomial expansion', mastery: 30 },
];

const ProgressSketch = () => (
  <div className="rm-why__sketch" aria-hidden="true">
    {topics.map((topic) => (
      <div key={topic.name}>
        <small>{topic.name}</small>
        <div className="rm-why__bar">
          <span style={{ width: `${topic.mastery}%` }} />
        </div>
      </div>
    ))}
    <div className="rm-why__chip rm-why__chip--on">
      Next: Binomial Estimation, part 1 →
    </div>
  </div>
);

const reasons = [
  {
    tilt: '-1.5deg',
    Sketch: CommunitySketch,
    title: 'Never stuck on your own',
    body:
      'Every lesson and question has its own comment thread, full of students working through the same thing. Ask about the exact step that has you stuck, swap shortcuts and memory tricks, vote the best explanations to the top, and help whoever is a week behind you. The RadixMaths team pins the answers that are spot on and keeps it friendly.',
    punch: 'Revision is a lot more fun with other people.',
  },
  {
    tilt: '1.1deg',
    Sketch: ReviewSketch,
    title: "You won't forget it by June",
    body:
      "Most revision fades within weeks. Finish a lesson or question and its key steps become short review cards, each one coming back just before you'd forget it. A few seconds a card, no calculator, and everything that's due waits on one page.",
    punch: 'Learn it in October, still know it in the exam hall.',
  },
  {
    tilt: '-0.7deg',
    Sketch: ProgressSketch,
    title: 'Always know what to do next',
    body:
      'Your Progress page shows how strong you are in every topic on your course, picks out the questions you keep dropping marks on, and suggests a next step for each topic. Sit down with twenty minutes spare and you will know exactly how to spend them.',
    punch: 'No more staring at the syllabus wondering where to start.',
  },
];

const LandingFeatures = () => (
  <section className="rm-why">
    <div className="rm-container">
      <Reveal className="rm-section-head">
        <span className="rm-eyebrow">Why RadixMaths</span>
        <h2 className="rm-h2">Built by people who know what it&apos;s like to find maths hard</h2>
        <p className="rm-lead">
          Finding maths hard isn&apos;t the problem. Getting stuck is how you grow. But in this
          new era of AI, when an answer is only seconds away, deep and critical thinking are
          at risk. RadixMaths is built to keep you doing the thinking yourself, with other
          students beside you, reviews that make it stick, and a clear next step.
        </p>
      </Reveal>

      <div className="rm-grid rm-grid--3">
        {reasons.map(({ tilt, Sketch, title, body, punch }, index) => (
          <Reveal key={title} className="rm-cardslot" delay={index * 90}>
            <div className="rm-notecard" style={{ '--rm-tilt': tilt }}>
              <Sketch />
              <h3 className="rm-h3">{title}</h3>
              <p className="rm-step__body">{body}</p>
              <p className="rm-step__punch">
                <span>{punch}</span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default LandingFeatures;
