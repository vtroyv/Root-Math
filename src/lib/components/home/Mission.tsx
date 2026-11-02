// components/Mission.tsx — the /mission page.
import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';
import Footer from './Footer';

/* The mission in Troy's own framing: the point is maths and how people learn it, with AI
   as the reason it's urgent. `tilt` is the resting angle of the note card, as on the
   landing page: small and alternating, so a row of them looks pinned up. */
const pillars = [
  {
    icon: 'bi-lightbulb-fill',
    tilt: '-1.2deg',
    title: 'More than a grade',
    body:
      'Learning maths properly gives you far more than an exam result. It builds the deeper skills underneath: problem solving, intuition, creativity, and the ability to narrow a huge search space of possible solutions down to the few worth trying when you face a hard decision. Those skills last long after the formulas fade.',
  },
  {
    icon: 'bi-exclamation-triangle-fill',
    tilt: '0.9deg',
    title: 'Deep thinking is under threat',
    body:
      'Certain AI tools can frequently kill learning. Students no longer sit on problems. They get the answer in seconds, it feels like progress, and they don’t find out they can’t do it until they’re alone in the exam. We’re entering a time of little deep thinking, where the motivation to learn, and even the need to, seem to be disappearing.',
  },
  {
    icon: 'bi-signpost-split-fill',
    tilt: '-0.8deg',
    title: 'RadixMaths is the bridge',
    body:
      'Ignoring these tools and refusing to use them isn’t the right answer either. RadixMaths is here to guide students through this new era. But it doesn’t act like other AI services, handing over the answer straight away and taking away the uncomfortable feeling of being stuck, which is exactly what makes students grow. Instead, we harness the power of AI just enough to help you learn more and solve harder problems than you could have before AI, without taking away the need to get stuck and think deeply or the drive to get yourself unstuck. That’s what mathematics is all about.',
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
              To foster a new era of mathematical learning, one that builds how you think, at
              a time when the motivation to learn, and the need to, seem to be under threat.
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

        <Reveal className="rm-section-head" style={{ marginTop: 'var(--rm-section-y)', marginBottom: 0 }}>
          <h2 className="rm-h2">
            A top grade is the goal. The way of thinking you build getting there is what lasts.
          </h2>
          <Link href="/register" className="rm-btn rm-btn--primary rm-btn--lg">
            Register your interest
          </Link>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
