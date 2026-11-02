// components/Teachers.tsx — the /teachers page. How it works: docs/teachers-page.md.
import React from 'react';
import Image from 'next/image';
import Footer from './Footer';
import TeacherForm from './TeacherForm';
import TryItYourself from './TryItYourself';

/* Nothing here claims results, schools or time saved, because there are none yet. Keep
   `building` true to today: only mark a row as available once a teacher can really get it. */
const resources = [
  {
    icon: 'bi-easel-fill',
    title: 'PowerPoint lessons',
    body: 'Lessons you can teach from directly in class, and edit however you like.',
    image: '/images/teachers/example-lesson-slide.png',
    alt: 'Lesson slide on binomial expansion, with the formula, a worked example and a question for students.',
  },
  {
    icon: 'bi-file-earmark-text-fill',
    title: 'Worksheets',
    body: 'Worksheets for students to use in class, with a full mark scheme for you. We’ll match each one to exactly what you’re teaching right now.',
    image: '/images/teachers/example-worksheet.png',
    alt: 'Worksheet on binomial expansion, with five questions beside their mark scheme.',
  },
  {
    icon: 'bi-exclamation-triangle-fill',
    title: 'Common mistakes sheets',
    body: 'The errors students make on a topic, why they make them and how to tackle them. We’ll focus each one on what your class is finding hard right now.',
    image: '/images/teachers/example-common-mistakes.png',
    alt: 'Common mistakes sheet on binomial expansion, listing four mistakes, why they happen and how to tackle them.',
  },
  {
    icon: 'bi-card-text',
    title: 'Cheat sheets',
    body: 'The key methods and formulas for a topic, on one page. We’ll cover exactly what your class needs right now.',
    image: '/images/teachers/example-cheat-sheet.png',
    alt: 'Cheat sheet on binomial expansion, with the formulas, Pascal’s triangle and quick checks.',
  },
  {
    icon: 'bi-journal-text',
    title: 'Practice papers',
    body: 'Exam-style papers on the topics you choose, with a mark scheme.',
    image: '/images/teachers/example-practice-paper.png',
    alt: 'Practice paper on binomial expansion, with four exam-style questions worth 18 marks.',
  },
];

const status = {
  availableNow: { label: 'Available now', className: 'rm-tag--live' },
  onRequest: { label: 'Available on request', className: 'rm-tag--live' },
  launchYear12: { label: 'Launches 1 December 2026', className: 'rm-tag--live' },
  launchYear13: { label: 'Launches January 2027', className: 'rm-tag--live' },
  comingSoon: { label: 'Coming soon', className: 'rm-tag--soon' },
};

const building = [
  {
    name: 'Sample questions',
    detail: 'Try real questions from the course, with no account.',
    status: status.availableNow,
  },
  {
    name: 'PowerPoint lessons for every topic',
    detail: 'Ask for the topic you’re teaching, and we’ll make it for you.',
    status: status.onRequest,
  },
  {
    name: 'Free classroom resources',
    detail: 'Worksheets, common mistakes sheets, cheat sheets and practice papers.',
    status: status.onRequest,
  },
  {
    name: 'Free student workshops',
    detail: 'Maths workshops for students, at your school.',
    status: status.onRequest,
  },
  {
    name: 'Year 12 A Level Maths course',
    detail: 'Lessons, questions and reviews for students.',
    status: status.launchYear12,
  },
  {
    name: 'Year 13 A Level Maths course',
    detail: 'Lessons, questions and reviews for students.',
    status: status.launchYear13,
  },
  {
    name: 'A bank of questions and lessons',
    detail: 'Customise or create resources based on exactly where your students are.',
    status: status.comingSoon,
  },
  {
    name: 'Tools for your classes',
    detail: 'Set work mapped to your specification and see how your classes are doing. We’ll shape these with teachers.',
    status: status.comingSoon,
  },
  {
    name: 'Further Maths for schools',
    detail: 'Further Maths content and class tools.',
    status: status.comingSoon,
  },
  {
    name: 'School-wide sign-in',
    detail: 'Single sign-on and links to your school’s information system.',
    status: status.comingSoon,
  },
];

const yourControl = [
  'Choose whether students get AI assistance, and limit how much',
  'Decide when students can see solutions',
  'Identify exactly where students struggle',
  'Total control over questions, to align with what you’re doing in class',
];

const wontDo = [
  'Train AI models on pupil data',
  'Market to pupils or parents through school accounts',
  'Claim results without saying how we measured them',
];

const nextSteps = [
  'We’ll email your resource, usually within 2 working days.',
  'It’s free, whether or not you ever use RadixMaths.',
  'You can edit it and share it within your school or organisation. We only ask that you don’t resell it.',
  'Tell us what worked and what didn’t, so we can make it better.',
  'If you’re happy to talk, we’ll arrange a 20-minute chat at a time that suits you.',
];

const contactEmail = 'hello@radixmaths.co.uk';

// Stops the anchored heading ending up underneath the sticky nav.
const anchorOffset = { scrollMarginTop: '5rem' };

const sectionHead = { marginTop: 'clamp(3rem, 6vw, 4.5rem)' };

const exampleImage = {
  width: '100%',
  height: 'auto',
  marginTop: 'auto', // lines the images up across a row when the text above differs in length
  border: '2px solid var(--rm-rule)',
  borderRadius: 'var(--rm-wobble-1)',
};

export default function Teachers() {
  return (
    <div className="rm-landing">
      <header className="rm-paperhead rm-paperhead--tight">
        <div className="rm-container">
          <div className="rm-section-head">
            <span className="rm-eyebrow">
              <i className="bi bi-mortarboard-fill" /> For teachers · Free resources
            </span>
            <h1 className="rm-display">
              Free A Level Maths lessons and worksheets,{' '}
              <span className="rm-underline">made for your class</span>
            </h1>
            <p className="rm-lead">
              Tell us the topic and the class, and we’ll make you a PowerPoint lesson, worksheet,
              cheat sheet or practice paper. We’ll email it over, usually within 2 working days,
              with no cost and no login.
            </p>
            <div className="rm-btn-row" style={{ justifyContent: 'center' }}>
              <a href="#request" className="rm-btn rm-btn--primary rm-btn--lg">
                Request a free resource
              </a>
              <a href="#try" className="rm-btn rm-btn--ghost rm-btn--lg">
                Try a question
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="rm-section rm-container">
        <div className="rm-section-head">
          <span className="rm-eyebrow">Free for teachers</span>
          <h2 className="rm-h2">Tell us what you need and we’ll make it</h2>
          <p className="rm-lead">
            Here’s what we can make for each A Level Maths topic. These examples are all on
            binomial expansion.
          </p>
        </div>

        <div className="rm-grid rm-grid--2">
          {resources.map((resource) => (
            <div key={resource.title} className="rm-card">
              <span className="rm-card__icon" aria-hidden="true">
                <i className={`bi ${resource.icon}`} />
              </span>
              <h3 className="rm-h3">{resource.title}</h3>
              <p className="rm-card__body">{resource.body}</p>
              <Image
                src={resource.image}
                alt={resource.alt}
                width={1200}
                height={730}
                sizes="(max-width: 48rem) 100vw, 36rem"
                style={exampleImage}
              />
            </div>
          ))}
          {/* alignSelf stops this card stretching to the height of the image card beside it */}
          <div className="rm-card" style={{ alignSelf: 'start', height: 'auto' }}>
            <span className="rm-card__icon" aria-hidden="true">
              <i className="bi bi-chat-dots-fill" />
            </span>
            <h3 className="rm-h3">Something else?</h3>
            <p className="rm-card__body">
              Need a cover lesson, a revision session or something we haven’t listed?{' '}
              <a href="#request" className="rm-link">
                Just ask
              </a>
              .
            </p>
          </div>
        </div>

        <div className="rm-section-head" id="try" style={{ ...sectionHead, ...anchorOffset }}>
          <span className="rm-eyebrow">Try it yourself</span>
          <h2 className="rm-h2">Answer a question the way a student would</h2>
          <p className="rm-lead">
            These are real questions from the course. No account needed, and nothing you enter
            is saved.
          </p>
        </div>

        <TryItYourself />

        <div className="rm-section-head" style={sectionHead}>
          <span className="rm-eyebrow">Free for schools</span>
          <h2 className="rm-h2">Free maths workshops for your students</h2>
          <p className="rm-lead">
            This year, we simply want to get to know maths departments. So we’ll come to your
            school and run a free maths workshop for your students, with prizes and extended free
            trials of RadixMaths to give out. Our workshop leader is DBS checked, and we’ll
            travel as far as we need to, though schools further away may need a little longer to
            plan a date.
          </p>
          <div className="rm-btn-row" style={{ justifyContent: 'center' }}>
            <a href="#request" className="rm-btn rm-btn--ghost rm-btn--lg">
              Ask about a workshop
            </a>
          </div>
        </div>

        <div className="rm-section-head" style={sectionHead}>
          <span className="rm-eyebrow">Our aim</span>
          <h2 className="rm-h2">Less to do outside the classroom</h2>
          <p className="rm-lead">
            We want to reduce what you have to do outside the classroom, so that in the classroom
            you have the capacity to give your students the full attention they deserve. That
            means less marking, less time making resources, and a quick refresher ready before
            each lesson.
          </p>
        </div>

        <div className="rm-section-head" style={sectionHead}>
          <span className="rm-eyebrow">What we’re building</span>
          <h2 className="rm-h2">Where everything stands today</h2>
          <p className="rm-lead">What you tell us will decide what we build next.</p>
        </div>

        <div className="rm-table-wrap">
          {/* two columns fit a phone, so this table doesn't need .rm-table's minimum width */}
          <table className="rm-table" style={{ minWidth: 0 }}>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {building.map((item) => (
                <tr key={item.name}>
                  <th scope="row">
                    {item.name}
                    <span className="rm-table__sub">{item.detail}</span>
                  </th>
                  <td>
                    {/* the longer labels have to wrap on a phone, unlike .rm-tag's other uses */}
                    <span className={`rm-tag ${item.status.className}`} style={{ whiteSpace: 'normal' }}>
                      {item.status.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Image
          src="/images/teachers/example-teacher-dashboard.png"
          alt="A class dashboard showing made-up homework and in-class check results for five students."
          width={1200}
          height={730}
          sizes="(max-width: 48rem) 100vw, 48rem"
          style={{ ...exampleImage, display: 'block', maxWidth: '48rem', margin: '2rem auto 0' }}
        />
        <p className="rm-lead" style={{ textAlign: 'center', margin: '0.75rem auto 0' }}>
          Tell us what features would make your life easier.
        </p>

        <div className="rm-section-head" style={sectionHead}>
          <span className="rm-eyebrow">Our commitments</span>
          <h2 className="rm-h2">You stay in charge of your classes</h2>
        </div>

        <div className="rm-grid rm-grid--2">
          <div className="rm-card">
            <span className="rm-card__icon" aria-hidden="true">
              <i className="bi bi-sliders" />
            </span>
            <h3 className="rm-h3">What stays in your control</h3>
            <span className="rm-card__kicker">When the teacher version opens</span>
            <ul className="rm-card__list">
              {yourControl.map((point) => (
                <li key={point}>
                  <i className="bi bi-check-lg" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rm-card">
            <span className="rm-card__icon" aria-hidden="true">
              <i className="bi bi-shield-fill-check" />
            </span>
            <h3 className="rm-h3">What we won’t do</h3>
            <span className="rm-card__kicker">In writing, from the start</span>
            <ul className="rm-card__list">
              {wontDo.map((point) => (
                <li key={point}>
                  <i className="bi bi-x-lg" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rm-section-head" id="request" style={{ ...sectionHead, ...anchorOffset }}>
          <span className="rm-eyebrow">Request a resource</span>
          <h2 className="rm-h2">Tell us what would help</h2>
          <p className="rm-lead">
            Ask for a free resource or a workshop, tell us what’s getting in the way, or all
            three. Tutors and tuition agencies are welcome too.
          </p>
        </div>

        <TeacherForm />

        <div className="rm-card" style={{ height: 'auto', marginTop: '1.5rem' }}>
          <span className="rm-card__icon" aria-hidden="true">
            <i className="bi bi-envelope-fill" />
          </span>
          <h3 className="rm-h3">What happens next</h3>
          <ul className="rm-card__list rm-card__list--columns">
            {nextSteps.map((step) => (
              <li key={step}>
                <i className="bi bi-check-lg" aria-hidden="true" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="rm-card__body">
            Prefer email? Write to{' '}
            <a className="rm-link" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
