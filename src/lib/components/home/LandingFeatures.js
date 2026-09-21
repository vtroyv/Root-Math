import React from 'react';
import Image from 'next/image';
import RootMathJourney from '../../images/RootMath4.png';
import Reveal from './Reveal';

/*
The three doodles (struggling student / RootMath / celebrating student) live in
one wide PNG rather than three files. Instead of shipping new assets we slice
it in CSS: each card blows the strip up to 300% of the card's art box and
slides it sideways so the wanted doodle lands in the window. `frame` picks
which third — see .rm-step__art in globals.css.
*/
const steps = [
  {
    frame: 'start',
    tilt: '-1.5deg',
    title: 'Engaging content',
    body:
      'Every video is pitched at themes students actually recognise, in a fun and comedic manner.',
    punch: 'Far easier to digest — and to remember.',
  },
  {
    frame: 'middle',
    tilt: '1.1deg',
    title: 'All in one',
    body:
      'Lessons, questions, papers and a tutor in a single place. No textbooks, no hourly rates.',
    punch: 'RootMath has got you covered.',
  },
  {
    frame: 'end',
    tilt: '-0.7deg',
    title: 'Accelerated learning',
    body:
      'The hardest topics broken into chunks you can finish in a sitting, with hints from our AI assistant when you stall.',
    punch: 'Maths, digested in a way you have not seen before.',
  },
];

const LandingFeatures = () => (
  <section className="rm-why">
    <div className="rm-container">
      <Reveal className="rm-section-head">
        <span className="rm-eyebrow">Why RootMath</span>
        <h2 className="rm-h2">Built by people who found maths hard</h2>
        <p className="rm-lead">
          A teaching style that meets you where you are, combined with AI that adapts to
          what you personally keep getting wrong.
        </p>
      </Reveal>

      <div className="rm-grid rm-grid--3">
        {steps.map((step, index) => (
          <Reveal key={step.title} className="rm-cardslot" delay={index * 90}>
            <div className="rm-notecard rm-notecard--center" style={{ '--rm-tilt': step.tilt }}>
              <div className={`rm-step__art rm-step__art--${step.frame}`}>
                {/* Decorative: the heading carries the meaning, so this is
                    hidden from screen readers rather than described twice. */}
                <Image src={RootMathJourney} alt="" aria-hidden="true" />
              </div>
              <h3 className="rm-h3">{step.title}</h3>
              <p className="rm-step__body">{step.body}</p>
              <p className="rm-step__punch">
                <span>{step.punch}</span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default LandingFeatures;
