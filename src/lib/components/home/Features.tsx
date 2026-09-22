// components/Features.tsx — the /features page.
import React from 'react';
import Reveal from './Reveal';
import Footer from './Footer';

/* Titles and descriptions are carried over word for word from the old page —
   they describe what RootMath is meant to do rather than what it does today,
   so they are due a pass once the feature set settles. The `icon` is a
   bootstrap-icons name, replacing the hand-rolled SVGs. */
const featureItems = [
  {
    title: 'Unlimited Tutor Support',
    icon: 'bi-chat-dots-fill',
    description:
      'Connect with our expert tutors 24/7. Get instant help on any question—video calls, chat, or email, whenever you need it.',
  },
  {
    title: 'Comprehensive Video Lessons',
    icon: 'bi-play-btn-fill',
    description:
      'Step-by-step, syllabus-aligned video lessons filmed by A*-achieving instructors. Learn at your own pace, pause/replay as much as you like.',
  },
  {
    title: 'Exam-Style Quizzes & Past Papers',
    icon: 'bi-file-earmark-text-fill',
    description:
      'Test your knowledge with interactive quizzes after every topic. Plus, access fully worked past papers with examiner feedback.',
  },
  {
    title: 'Personalised Progress Tracking',
    icon: 'bi-graph-up-arrow',
    description:
      'Our dashboard highlights your strengths and weaknesses. See your performance over time and receive curated recommendations.',
  },
  {
    title: 'Live Group Workshops',
    icon: 'bi-camera-video-fill',
    description:
      'Participate in weekly live workshops with peers and instructors. Collaborative problem-solving and real-time Q&A sessions.',
  },
  {
    title: 'Personalised Revision Plans',
    icon: 'bi-calendar-check-fill',
    description:
      'Receive a custom revision schedule based on your performance. Focus on weak areas and track completion as you go.',
  },
  {
    title: 'Exam Tips & Strategy',
    icon: 'bi-lightbulb-fill',
    description:
      'Learn expert strategies for time management, question approach, and stress reduction to maximise your exam performance.',
  },
  {
    title: 'Community Forum Access',
    icon: 'bi-people-fill',
    description:
      'Join our private forum to discuss problems, share resources, and learn from a community of motivated students.',
  },
];

export default function Features() {
  return (
    <div className="rm-landing">
      <header className="rm-paperhead rm-paperhead--tight">
        <div className="rm-container">
          <div className="rm-section-head">
            <span className="rm-eyebrow">
              <i className="bi bi-stars" /> Features
            </span>
            <h1 className="rm-display">
              Our key <span className="rm-underline">features</span>
            </h1>
            <p className="rm-lead">
              Everything you need to reach A*-A grades—available anytime, anywhere.
            </p>
          </div>
        </div>
      </header>

      <section className="rm-section rm-container">
        <div className="rm-grid rm-grid--4">
          {featureItems.map((feature, index) => (
            <Reveal key={feature.title} className="rm-card" delay={index * 70}>
              <span className="rm-card__icon" aria-hidden="true">
                <i className={`bi ${feature.icon}`} />
              </span>
              <h2 className="rm-h3">{feature.title}</h2>
              <p className="rm-card__body">{feature.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
