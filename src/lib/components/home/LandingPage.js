'use client';
import React, { useState } from 'react';
import { Modal } from 'reactstrap';
import Link from 'next/link';
import ReactPlayer from 'react-player';

import Reveal from './Reveal';
import Facts from './Facts';
import LandingFeatures from './LandingFeatures';
import Courses from './Courses';
import Faq from './Faq';
import CallToAction from './CallToAction';
import Footer from './Footer';

const replaces = ['£40/hr tutors', '£30 textbooks', '20 open browser tabs'];

/* Scribbled-in-the-margin maths that floats behind the hero. Positions are
   hard-coded rather than randomised so server and client render identically —
   Math.random() here would cause a hydration mismatch. Everything sits in the
   outer thirds so it never runs under the centred copy. */
const heroSymbols = [
  { text: '∫ x² dx', top: '9%', left: '5%', size: 2.2, rotate: -8 },
  { text: '√2', top: '15%', left: '20%', size: 1.8, rotate: -14 },
  { text: 'dy/dx', top: '20%', left: '84%', size: 2.6, rotate: 10 },
  { text: '∞', top: '30%', left: '93%', size: 2.1, rotate: -9 },
  { text: 'sin²θ + cos²θ = 1', top: '37%', left: '2%', size: 1.7, rotate: 6 },
  { text: '∑ aₙ', top: '46%', left: '88%', size: 1.9, rotate: 12 },
  { text: "f′(x)", top: '58%', left: '9%', size: 1.9, rotate: -5 },
  { text: 'eˣ', top: '55%', left: '78%', size: 2.3, rotate: -6 },
  { text: 'π', top: '70%', left: '4%', size: 2.6, rotate: -12 },
  { text: 'lim f(x)', top: '76%', left: '86%', size: 1.8, rotate: 8 },
  { text: 'n!', top: '86%', left: '22%', size: 1.9, rotate: 5 },
  { text: 'θ = π/3', top: '90%', left: '70%', size: 1.7, rotate: -7 },
];

const stats = [
  { value: '4', label: 'Exam boards covered' },
  { value: '1,000+', label: 'Exam-style questions' },
  { value: 'Instant', label: 'Marking & feedback' },
  { value: '24/7', label: 'AI tutor on hand' },
];

const LandingPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const toggle = () => setModalOpen(!modalOpen);

  return (
    <div className="rm-landing">
      <Modal isOpen={modalOpen} toggle={toggle} size="lg" centered>
        <div style={{ aspectRatio: '16 / 9', width: '100%' }}>
          <ReactPlayer
            url="https://takamotoyagami.wistia.com/medias/2ci7172egn"
            controls
            playing
            width="100%"
            height="100%"
          />
        </div>
      </Modal>

      {/* ---------------------------------------------------------------- hero */}
      <header className="rm-hero">
        <div className="rm-hero__symbols" aria-hidden="true">
          {heroSymbols.map((symbol) => (
            <span
              key={symbol.text}
              style={{
                top: symbol.top,
                left: symbol.left,
                fontSize: `${symbol.size}rem`,
                '--rm-symbol-rotate': `${symbol.rotate}deg`,
              }}
            >
              {symbol.text}
            </span>
          ))}
        </div>

        <div className="rm-container rm-hero__grid">
          <div className="rm-hero__copy">
            <span className="rm-eyebrow">
              <i className="bi bi-mortarboard-fill" /> A Level Maths · All major boards
            </span>

            <h1 className="rm-display">
              Achieve the <span className="rm-underline">highest grades</span> without the
              tutor bill
            </h1>

            <p className="rm-lead">
              Every lesson, question and past paper for your specification in one place —
              marked the moment you submit. Our AI tutor adapts to how you learn and
              shows you exactly where you went wrong.
            </p>

            <ul className="rm-replaces">
              <li className="rm-replaces__label" style={{ textDecoration: 'none' }}>
                Replaces:
              </li>
              {replaces.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="rm-btn-row">
              <Link href="/register" className="rm-btn rm-btn--primary rm-btn--lg">
                Register Interest Today
              </Link>
              <button type="button" className="rm-btn rm-btn--ghost rm-btn--lg" onClick={toggle}>
                <i className="bi bi-play-fill" /> See how it works
              </button>
            </div>

            <p className="rm-hero__trust">
              <i className="bi bi-patch-check-fill" /> No card needed · A/A* guarantee or
              your money back
            </p>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------- stats */}
      <section className="rm-container" style={{ paddingBottom: 'var(--rm-section-y)' }}>
        <Reveal className="rm-stats">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="rm-stat__value">{stat.value}</div>
              <div className="rm-stat__label">{stat.label}</div>
            </div>
          ))}
        </Reveal>
      </section>

      <Facts />
      <LandingFeatures />
      <Courses />
      <Faq />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
