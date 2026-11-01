'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Modal } from 'reactstrap';
import ProgressRadar from '@/lib/components/learn/progress/ProgressRadar';
import { SPECS } from '@/lib/mastery/specs';

/*
"See how it works" on the landing page: a carousel of RadixMaths' features in a pop-up
(instead of a promotional video, decided 22 Oct 2026). Back / Next, the dots, and the
← → keys move between slides. There's no autoplay and no slide animation (the styling
preference is plain state changes), and the last slide ends on Register Interest.

Each slide's `visual` is an image (`image`, with a play button over it if `play`) or the real Progress page radar chart drawn with
example data (`radar`). Most images are screenshots of the feature; keep `alt` describing
what's in the screenshot when one is swapped.
*/

const slides = [
  {
    icon: 'bi-journal-text',
    title: 'Lessons that teach you step by step',
    body: 'Every topic on your specification, broken into short parts you can finish in one sitting.',
    points: ['Clear explanations with worked examples', 'Complicated concepts made easy to grasp '  ,'Tasks checked as you go, with a hint whenever you get stuck'],
    visual: { image: { url: '/images/see-how-it-works-1.png', alt: 'A Quadratic Graphs lesson: the explanation and graphs on the left, a proof task in the middle, and feedback for each task on the right' } },
  },
  {
    icon: 'bi-play-btn',
    title: 'In depth videos for every lesson and question',
    body: 'Learn best by watching? Each lesson part and question comes with a short video that walks you through the idea, so you can see it done before you try it yourself.',
    points: ['Concepts explained visually, one step at a time', 'Worked solutions you can pause, rewind and rewatch', 'Ideal for visual learners, or whenever you are stuck'],
    visual: { image: { url: '/images/see-how-it-works-3.png', alt: 'A lesson video playing over the First Principles lesson, showing the chord AB getting closer to the tangent at A' }, play: true },
  },
  {
    icon: 'bi-check2-circle',
    title: 'Every answer marked the moment you submit',
    body: 'Exam-style questions marked part by part, so you know exactly which step went wrong.',
    points: ['Written feedback on every part', 'Model solutions and mark schemes', 'Your answers save as you type'],
    visual: { image: { url: '/images/see-how-it-works-2.png', alt: 'A Sum of Squared Binomial Coefficients question: an answer marked 0 / 1 with feedback on the mistake, next to the model solution' } },
  },
  {
    icon: 'bi-people',
    title: 'A community, not just a revision site',
    body: "Every lesson and question has its own comments, so you can ask about the exact step you're stuck on, share a shortcut, or help someone who's where you were last week.",
    points: ['Ask, reply and vote on every lesson and question', 'Tips and answers pinned by the RadixMaths team', 'A friendly, moderated space to learn alongside other students'],
    visual: { image: { url: '/images/see-how-it-works-7.png', alt: 'The Comments tab on a question, with a pinned hint from the RadixMaths team, upvotes and student replies' } },
  },
  {
    icon: 'bi-bezier2',
    title: 'More than typing in an answer',
    body: 'Show what you know the way you would on paper.',
    points: ['Sketch curves and drag points onto a grid', 'Place vectors and put proof steps in order', 'Write out full working, line by line'],
    visual: { image: { url: '/images/points-connected.png', alt: 'A quadratic sketched on a grid through its y-intercept, both roots and its minimum point' } },
  },
  {
    icon: 'bi-arrow-repeat',
    title: "Review cards so you don't forget",
    body: 'Finish a question or lesson and it unlocks short flashcards on the key steps.',
    points: ['They come back just before you would forget them', 'A few seconds each, no calculator needed', 'One reviews page for everything that is due'],
    visual: { image: { url: '/images/see-how-it-works-6.png', alt: 'A review card asking what four things you find before sketching y = ax² + bx + c, with the answer and Again, Hard, Good and Easy buttons' } },
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
    visual: { image: { url: '/images/see-how-it-works-8.png', alt: 'The RadixMaths tutor open beside a Binomial Estimation lesson, giving a hint rather than the answer' } },
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
    // wider than Bootstrap's xl (1140px) so the screenshots are readable; `style` goes on .modal-dialog
    <Modal isOpen={isOpen} toggle={toggle} size="xl" centered fade={false} aria-labelledby="how-it-works-title" style={{ maxWidth: 'min(1600px, 95vw)' }}>
      <div style={{ background: 'var(--rm-paper)', padding: 'clamp(1rem, 3vw, 2rem)', fontFamily: 'var(--rm-body)', color: 'var(--rm-ink)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
          <span className="rm-eyebrow">
            <i className={`bi ${slide.icon}`} aria-hidden="true" /> How RadixMaths works · {index + 1} of {slides.length}
          </span>
          <button type="button" onClick={toggle} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: '1.75rem', lineHeight: 1, color: 'var(--rm-ink)', cursor: 'pointer' }}>
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        {/* the slide: words and picture side by side (the picture gets about two thirds), stacked on narrow screens */}
        <div
          aria-live="polite"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(1.25rem, 3vw, 2.5rem)', alignItems: 'center', minHeight: '28rem' }}
        >
          <div style={{ flex: '1 1 300px' }}>
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
              flex: '2 1 480px',
              minWidth: 0,
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
              <div style={{ position: 'relative' }}>
                <Image
                  key={slide.visual.image.url}
                  src={slide.visual.image.url}
                  alt={slide.visual.image.alt}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 90vw, 60vw"
                  style={{ width: '100%', height: 'auto', maxHeight: '62vh', objectFit: 'contain', display: 'block' }}
                />
                {/* `play`: a still play button over the picture, so the slide reads as a video */}
                {slide.visual.play && (
                  <i
                    className="bi bi-play-circle-fill"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '4rem',
                      lineHeight: 1,
                      color: 'var(--rm-teal)',
                      background: '#fff',
                      borderRadius: '50%',
                    }}
                  />
                )}
              </div>
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
