'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Modal } from 'reactstrap';
import ProgressRadar from '@/lib/components/learn/progress/ProgressRadar';
import { SPECS } from '@/lib/mastery/specs';

/*
"See how it works" on the landing page: a carousel of RootMath's features in a pop-up
(instead of a promotional video, decided 22 Oct 2026). Back / Next, the dots, and the
← → keys move between slides. There's no autoplay and no slide animation (the styling
preference is plain state changes), and the last slide ends on Register Interest.

Each slide's `visual` is an image (`image`) or the real Progress page radar chart drawn with
example data (`radar`). The images are content from the lessons and questions for now:
swap in a screenshot of each feature by changing its `image.url`.
*/

const slides = [
  {
    icon: 'bi-journal-text',
    title: 'Lessons that teach you step by step',
    body: 'Every topic on your specification, broken into short parts you can finish in one sitting.',
    points: ['Clear explanations with worked examples', 'A short video for each part', 'Tasks checked as you go, with a hint whenever you get stuck'],
    visual: { image: { url: '/images/quadratic-graph.png', alt: 'A quadratic graph from the Quadratic Graphs lesson' } },
  },
  {
    icon: 'bi-check2-circle',
    title: 'Every answer marked the moment you submit',
    body: 'Exam-style questions marked part by part, so you know exactly which step went wrong.',
    points: ['Written feedback on every part', 'Model solutions and mark schemes', 'Your answers save as you type'],
    visual: { image: { url: '/images/cube-it-or-lose-it.png', alt: 'A cubic graph from the question Cube It or Lose It' } },
  },
  {
    icon: 'bi-bezier2',
    title: 'More than typing in an answer',
    body: 'Show what you know the way you would on paper.',
    points: ['Sketch curves and drag points onto a grid', 'Place vectors and put proof steps in order', 'Write out full working, line by line'],
    visual: { image: { url: '/images/points-connected.png', alt: 'A sketched quadratic through its key points' } },
  },
  {
    icon: 'bi-arrow-repeat',
    title: "Review cards so you don't forget",
    body: 'Finish a question or lesson and it unlocks short flashcards on the key steps.',
    points: ['They come back just before you would forget them', 'A few seconds each, no calculator needed', 'One reviews page for everything that is due'],
    visual: { image: { url: '/images/the-unit-circle.png', alt: 'The unit circle' } },
  },
  {
    icon: 'bi-bullseye',
    title: 'See your strengths at a glance',
    body: 'Your Progress page shows how far you have got in every topic, as a radar chart, and what to do next.',
    points: ['Your level and rank for each course', 'Your strongest and weakest questions', 'A suggested next step for every topic'],
    visual: { radar: true },
  },
  {
    icon: 'bi-chat-dots',
    title: 'An AI tutor whenever you need one',
    body: 'Stuck at 11pm the night before a test? Ask the tutor, right next to the question you are on.',
    points: ['Hints that guide you, rather than just giving the answer', 'Explanations pitched at your level', 'Available 24/7, at no extra cost'],
    visual: { image: { url: '/images/approaching-gradient-chords.png', alt: 'Chords approaching a tangent, from the First Principles lesson' } },
  },
];

// example data for the Progress page slide: Year 12 Pure, with made-up progress
const exampleMastery = [0.85, 0.7, 0.55, 0.4, 0.62, 0.3, 0.75, 0.5, 0.65];
const radarAreas = SPECS['edx-maths-1'].areas.map((area, i) => ({ ...area, mastery: exampleMastery[i] ?? 0.5, total: 1 }));

export default function HowItWorks({ isOpen, toggle }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const last = index === slides.length - 1;

  // start from the first slide each time it opens
  useEffect(() => {
    if (isOpen) setIndex(0);
  }, [isOpen]);

  // ← → change slide while the pop-up is open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, slides.length - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" centered fade={false} aria-labelledby="how-it-works-title">
      <div style={{ background: 'var(--rm-paper)', padding: 'clamp(1rem, 3vw, 2rem)', fontFamily: 'var(--rm-body)', color: 'var(--rm-ink)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
          <span className="rm-eyebrow">
            <i className={`bi ${slide.icon}`} aria-hidden="true" /> How RootMath works · {index + 1} of {slides.length}
          </span>
          <button type="button" onClick={toggle} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: '1.75rem', lineHeight: 1, color: 'var(--rm-ink)', cursor: 'pointer' }}>
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        {/* the slide: words and picture side by side, stacked on narrow screens */}
        <div
          aria-live="polite"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(1.25rem, 3vw, 2.5rem)', alignItems: 'center', minHeight: '22rem' }}
        >
          <div>
            <h2 id="how-it-works-title" className="rm-h2" style={{ margin: '0 0 0.75rem' }}>
              {slide.title}
            </h2>
            <p className="rm-lead" style={{ marginBottom: '1rem' }}>
              {slide.body}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.15rem' }}>
              {slide.points.map((point) => (
                <li key={point} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <i className="bi bi-check-lg" aria-hidden="true" style={{ color: 'var(--rm-teal-deep)', fontSize: '1.2rem' }} />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: '#fff',
              border: '2px solid var(--rm-ink)',
              borderRadius: index % 2 ? 'var(--rm-wobble-2)' : 'var(--rm-wobble-1)',
              boxShadow: 'var(--rm-lift-sm)',
              padding: '1rem',
            }}
          >
            {slide.visual.radar ? (
              <ProgressRadar areas={radarAreas} pinned={0} onPin={() => {}} />
            ) : (
              <Image
                key={slide.visual.image.url}
                src={slide.visual.image.url}
                alt={slide.visual.image.alt}
                width={0}
                height={0}
                sizes="(max-width: 768px) 90vw, 45vw"
                style={{ width: '100%', height: 'auto', maxHeight: '22rem', objectFit: 'contain', display: 'block' }}
              />
            )}
          </div>
        </div>

        {/* Back · dots · Next (or Register Interest on the last slide) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button type="button" className="rm-btn" onClick={() => setIndex((i) => i - 1)} disabled={index === 0} style={{ visibility: index === 0 ? 'hidden' : 'visible' }}>
            <i className="bi bi-arrow-left" aria-hidden="true" /> Back
          </button>

          <div role="tablist" aria-label="Choose a slide" style={{ display: 'flex', gap: '0.5rem' }}>
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${s.title}`}
                onClick={() => setIndex(i)}
                style={{
                  width: '0.9rem',
                  height: '0.9rem',
                  padding: 0,
                  borderRadius: '50%',
                  border: '2px solid var(--rm-ink)',
                  background: i === index ? 'var(--rm-teal)' : 'transparent',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {last ? (
            <Link href="/register" className="rm-btn rm-btn--primary" onClick={toggle}>
              Register Interest
            </Link>
          ) : (
            <button type="button" className="rm-btn rm-btn--primary" onClick={() => setIndex((i) => i + 1)}>
              Next <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
