// components/Mission.tsx — the /mission page.
import React from 'react';
import Reveal from './Reveal';
import Footer from './Footer';

/* The three pillars, carried over word for word from the old page. `tilt` is
   the resting angle of the note card, as on the landing page — small and
   alternating, so a row of them looks pinned up rather than printed. */
const pillars = [
  {
    icon: 'bi-mortarboard-fill',
    tilt: '-1.2deg',
    title: 'Empower Every Student',
    body:
      'At RootMath, our mission is to democratise top-tier A-Level maths tuition by harnessing technology and Oxford/Cambridge-trained tutors. We believe every student—regardless of background or school—deserves access to high-quality lessons, personalised support, and a community that values excellence. Through targeted video lessons, on-demand tutor support, and interactive quizzes, we guide students from foundational concepts all the way to A* mastery.',
  },
  {
    icon: 'bi-lightbulb-fill',
    tilt: '0.9deg',
    title: 'Build Confidence Through Understanding',
    body:
      'More than memorisation, we focus on deep conceptual clarity. Our structured curriculum breaks down complex topics into bite-sized modules, ensuring students understand the “why” behind every theorem and technique. By building that strong foundation, students gain confidence to tackle any exam question—whether it’s pure calculus, mechanics, or statistics.',
  },
  {
    icon: 'bi-people-fill',
    tilt: '-0.8deg',
    title: 'Foster a Collaborative Community',
    body:
      'We’re more than a platform—we’re a community. From weekly group workshops to an interactive forum, students learn alongside peers who share their academic goals. RootMath’s community encourages knowledge-sharing, peer support, and healthy competition, all in a safe, moderated environment. Our goal is to foster lifelong curiosity and a love for mathematics.',
  },
];

export default function Mission() {
  return (
    <div className="rm-landing">
      <header className="rm-paperhead rm-paperhead--tight">
        <div className="rm-container">
          <div className="rm-section-head">
            <span className="rm-eyebrow">
              <i className="bi bi-geo-alt-fill" /> About us
            </span>
            <h1 className="rm-display">
              Our <span className="rm-underline">mission</span>
            </h1>
            <p className="rm-lead">
              Why RootMath exists and how we empower students to excel in A-Level maths.
            </p>
          </div>
        </div>
      </header>

      <section className="rm-section rm-container">
        <div className="rm-grid rm-grid--3">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} className="rm-cardslot" delay={index * 90}>
              <div
                className="rm-notecard"
                style={{ '--rm-tilt': pillar.tilt } as React.CSSProperties}
              >
                <span className="rm-card__icon" aria-hidden="true">
                  <i className={`bi ${pillar.icon}`} />
                </span>
                <h2 className="rm-h3">{pillar.title}</h2>
                <p className="rm-card__body">{pillar.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
