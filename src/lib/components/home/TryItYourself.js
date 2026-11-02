'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SAMPLE_QUESTIONS } from '@/lib/marking/sampleQuestions';

// Loaded on the first click: the maths input and graph code are heavy, and most visitors won't need them.
const SampleQuestion = dynamic(() => import('./SampleQuestion'), {
  ssr: false,
  loading: () => <p>Loading the question…</p>,
});

export default function TryItYourself() {
  const [chosen, setChosen] = useState(null);

  return (
    <>
      <div className="rm-grid rm-grid--2">
        {SAMPLE_QUESTIONS.map((sample) => (
          <div key={sample.title} className="rm-card">
            <span className="rm-card__icon" aria-hidden="true">
              <i className={`bi ${sample.icon}`} />
            </span>
            <h3 className="rm-h3">{sample.name}</h3>
            <p className="rm-card__body">{sample.description}</p>
            <div className="rm-btn-row">
              <button
                type="button"
                className={`rm-btn ${chosen === sample.title ? 'rm-btn--primary' : 'rm-btn--ghost'}`}
                aria-pressed={chosen === sample.title}
                onClick={() => setChosen(sample.title)}
              >
                Try this question
              </button>
            </div>
          </div>
        ))}
      </div>

      {chosen && <SampleQuestion key={chosen} title={chosen} />}
    </>
  );
}
