// components/Features.tsx — the /features page.
import React from 'react';
import Reveal from './Reveal';
import Footer from './Footer';

/* Strongest selling points first. Marking is deliberately not the headline, because
   every AI tool can do it. The `icon` is a bootstrap-icons name. */
const featureItems = [
  {
    title: 'Lessons that check you’ve got it',
    icon: 'bi-journal-check',
    description:
      'Every topic is split into short parts, with questions inside each one. Finish a part’s questions before moving on, so completing a lesson means you can do it, not just that you’ve watched it.',
  },
  {
    title: 'Videos that show you how it works',
    icon: 'bi-play-btn-fill',
    description:
      'A short video for every lesson part and question, with moving graphs for every graphical topic. Pause, rewind and rewatch until it clicks.',
  },
  {
    title: 'Answer like you would on paper',
    icon: 'bi-pencil-fill',
    description:
      'Sketch curves, plot points, order proof steps and write out your working. Exam-style questions and custom papers you won’t find anywhere else come with feedback on each part, model solutions and mark schemes.',
  },
  {
    title: 'Reviews that make it stick',
    icon: 'bi-arrow-repeat',
    description:
      'Finishing a lesson or question unlocks short review cards. Each one comes back just before you’d forget it, so your work is still there on exam day.',
  },
  {
    title: 'Always know what to do next',
    icon: 'bi-bullseye',
    description:
      'Your Progress page shows your strengths and weaknesses in every topic, which lessons to focus on and which reviews are due. Spend your time on the maths, not on planning.',
  },
  {
    title: 'Help where you’re stuck',
    icon: 'bi-chat-dots-fill',
    description:
      'A tutor beside every question already knows the question and part you’re on, and your weakest topics. Hints move you one step at a time, so you still do the maths yourself.',
  },
  {
    title: 'Learn alongside other students',
    icon: 'bi-people-fill',
    description:
      'Every lesson and question has its own comments. See how others solved the same problem, ask about the exact step you’re stuck on and swap shortcuts, with the best answers pinned by our team.',
  },
  {
    title: 'The A/A* guarantee',
    icon: 'bi-patch-check-fill',
    description:
      'Keep your progress high in every topic up to your first exam. If you still fall short of an A or A*, send us your results within 30 days for a full refund.',
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
              Built for the hours you spend studying on your own, from your first lesson to exam day.
            </p>
          </div>
        </div>
      </header>

      <section className="rm-section rm-container">
        <div className="rm-grid rm-grid--2">
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
