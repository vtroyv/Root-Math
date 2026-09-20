import React from 'react';
import Image from 'next/image';
import RootMathJourney from '../../images/RootMath4.png';
import Reveal from './Reveal';

const thoughts = [
  {
    title: 'Engaging content',
    body:
      'Every video is pitched at themes students actually recognise, in a fun and comedic manner.',
    punch: 'Far easier to digest — and to remember.',
  },
  {
    title: 'All in one',
    body:
      'Lessons, questions, papers and a tutor in a single place. No textbooks, no hourly rates.',
    punch: 'RootMath has got you covered.',
  },
  {
    title: 'Accelerated learning',
    body:
      'The hardest topics broken into chunks you can finish in a sitting, with hints from our AI assistant when you stall.',
    punch: 'Maths, digested in a way you have not seen before.',
  },
];

const LandingFeatures = () => (
  <section className="rm-band">
    <div className="rm-container">
      <Reveal className="rm-section-head">
        <span className="rm-eyebrow">Why RootMath</span>
        <h2 className="rm-h2">Built by people who found maths hard</h2>
        <p className="rm-lead">
          A teaching style that meets you where you are, combined with AI that adapts to
          what you personally keep getting wrong.
        </p>
      </Reveal>

      <Reveal className="rm-journey">
        <Image src={RootMathJourney} alt="From struggling with maths, to RootMath, to celebrating" />
      </Reveal>

      <div className="rm-grid rm-grid--3">
        {thoughts.map((thought, index) => (
          <Reveal key={thought.title} delay={index * 90}>
            <div className="rm-thought">
              <h3 className="rm-h3">{thought.title}</h3>
              <p>{thought.body}</p>
              <p>
                <strong>{thought.punch}</strong>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default LandingFeatures;
