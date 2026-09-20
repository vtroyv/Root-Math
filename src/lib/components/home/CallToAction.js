import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

const CallToAction = () => (
  <section className="rm-cta rm-container">
    <Reveal className="rm-cta__panel">
      <span className="rm-eyebrow">Ready when you are</span>
      <h2 className="rm-h2">
        Start with your <span className="rm-underline">weakest topic</span>
      </h2>
      <p className="rm-lead">
        Pick your exam board, answer a few questions, and RootMath will build the study
        plan for you. It takes about five minutes.
      </p>
      <div className="rm-btn-row">
        <Link href="/sign-up" className="rm-btn rm-btn--primary rm-btn--lg">
          Start learning free
        </Link>
        <Link href="/pricing" className="rm-btn rm-btn--ghost rm-btn--lg">
          See pricing
        </Link>
      </div>
      <p className="rm-cta__note">No card needed to get started · Cancel any time</p>
    </Reveal>
  </section>
);

export default CallToAction;
