import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

const faqs = [
  {
    // first on purpose: the question most students will have in mind
    q: 'Why use RadixMaths instead of ChatGPT?',
    a: [
      <>
        We&apos;ll be honest: ChatGPT, Claude and Gemini are extremely capable. But they&apos;re
        built to be as general as possible, not to teach A Level Maths.
      </>,
      <>
        The catch is that they&apos;re only as good as the instructions you give them. Without
        careful prompting you usually get a long answer that&apos;s hard to take in when
        you&apos;re meeting a difficult idea for the first time, and everything stops at the
        chat window.
      </>,
      <>
        RadixMaths is built around what a chatbot doesn&apos;t give you.{' '}
        <strong>A course for your exam board</strong>, in short steps with a video for every
        part. <strong>Questions inside every lesson</strong> that you get right before moving
        on. <strong>Marking against the mark scheme</strong>, part by part, the moment you
        submit. <strong>Review cards</strong> that bring each topic back just before
        you&apos;d forget it. <strong>A Progress page</strong> that tracks your strengths and
        weaknesses and sets your targets. And <strong>a community</strong> of students on the
        same questions, sharing tricks and helping each other, with answers checked by our
        team - something AI models can&apos;t replicate.
      </>,
      <>
        So if you&apos;re paying for a chatbot mainly for A Level Maths, RadixMaths is a more
        focused option for about the same price or less. But if what you&apos;re doing is
        already getting you top grades, don&apos;t fix what isn&apos;t broken. We want to help
        shape how students learn in the age of AI, and that starts with telling you when
        you don&apos;t need us.
      </>,
    ],
  },
  {
    q: 'Why pay when there are free resources online?',
    a: [
      <>
        There are some brilliant free resources out there, and if they&apos;re getting you the
        grades you want, don&apos;t fix what isn&apos;t broken.
      </>,
      <>
        Free resources work well right up until you get stuck. The video shows the method,
        the mark scheme shows the answer, and you&apos;re left alone with the gap in between,
        piecing it together from forum threads and a dozen open tabs.
      </>,
      <>
        RadixMaths is built to step in exactly there. Its lessons, questions and videos are
        made to match the best free content out there, and around them sit two things free
        resources can&apos;t offer: a community where you can see how other students solved the
        same problem, often in a completely different way to you, and a personal tutor that
        knows every lesson, question and video on the site, as well as your strengths and
        weaknesses, so wherever you stumble, it can turn that into a path you can walk, one
        step at a time.
      </>,
      <>
        So if you&apos;d rather switch off the planning and admin part of your brain, and leave
        what to study, when to study it and how to go about it to us, RadixMaths is for
        you. You spend your time on the maths, all backed by our A/A* guarantee.
      </>,
    ],
  },
  {
    q: 'Why use RadixMaths instead of a private tutor?',
    a: [
      <>
        Most of a student&apos;s learning doesn&apos;t happen in the classroom or in a one-hour
        tutoring session. It happens on their own: doing homework, revising, and getting
        stuck on a question at 9pm with nobody to ask.
      </>,
      <>
        RadixMaths is built on a simple belief: your grade is ultimately in your hands, not
        your school&apos;s or your tutor&apos;s. So it&apos;s designed to help where you need it most,
        when you&apos;re working by yourself, marking every answer the moment you submit it,
        showing you where you went wrong and telling you what to work on next.
      </>,
      <>
        It also costs far less. A good tutor is brilliant, but at around £40 an hour most
        students get one hour a week, if they can find a good tutor with space at all.
        RadixMaths costs less than half that for a whole month.
      </>,
    ],
  },
  {
    q: 'How does the A/A* guarantee work?',
    a: [
      <>
        Your Progress page shows how well you understand every topic on your course. It
        rises as you complete lessons, answer questions and keep up with your review cards,
        and it drops in any topic where you let your reviews slip.
      </>,
      <>
        Keep your progress high in every topic up to the day of your first exam and
        you&apos;re automatically eligible. If you still fall short of an A or A*, send us your
        results within 30 days and we&apos;ll refund every payment you&apos;ve made. The exact
        progress needed will be set out in our full guarantee terms at launch.
      </>,
    ],
  },
  {
    q: 'How much does it cost, and can I cancel?',
    a: [
      <>
        £17.99 a month per course, and you only pay for the courses you take. Monthly plans
        can be cancelled any time, or you can pay upfront through to 31 July and save 10%.
      </>,
      <>
        Every course covers both Year 12 and Year 13, so a Year 12 student can carry on
        straight through to their exams.{' '}
        <Link href="/pricing" className="rm-link">
          See pricing
        </Link>
        .
      </>,
    ],
  },
  {
    q: 'When does RadixMaths launch, and what do I get for registering?',
    a: [
      <>
        All of Year 12 A Level Maths opens on 1 December, and Year 13 follows in January.
        Further Maths, GCSE, STEP and TMUA come after that.
      </>,
      <>
        Register your interest and we will email you the moment it opens, with
        the early-access price for everyone who registers before launch and a free trial so
        you can try it before you pay.{' '}
        <Link href="/register" className="rm-link">
          Register interest
        </Link>
        .
      </>,
    ],
  },
  {
    q: "I'm in Year 13. Is it too late to start?",
    a: [
      <>
        Not at all. Year 12 topics make up roughly half of what&apos;s examined at A Level, and
        all of Year 12 is ready to revise from 1 December, in time for January mocks. Year
        13 follows in January.
      </>,
      <>
        Review cards bring each topic back just before you&apos;d forget it, so what you revise
        now is still there in the summer, and your Progress page shows you which topics to
        spend your remaining time on.
      </>,
    ],
  },
  {
    q: 'Can parents see how their child is doing?',
    a: [
      <>
        Yes. Parents can follow their child&apos;s progress: which topics they are strongest
        and weakest in, and whether they are keeping up with their targets and reviews.
      </>,
      <>
        It is the same record the A/A* guarantee is based on, so you can see they are on
        track long before results day.
      </>,
    ],
  },
];

const Faq = () => (
  <section className="rm-faq">
    <div className="rm-container">
      <Reveal className="rm-section-head">
        <span className="rm-eyebrow">FAQs</span>
        <h2 className="rm-h2">Got questions? Answered</h2>
        <p className="rm-lead">
          If yours is not covered below, ask us directly{' '}
          <Link href="/contact" className="rm-link">
            here
          </Link>
          .
        </p>
      </Reveal>

      <Reveal className="rm-accordion">
        {faqs.map((faq) => (
          <details key={faq.q}>
            <summary>{faq.q}</summary>
            <div className="rm-accordion__body">
              {faq.a.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </details>
        ))}
      </Reveal>
    </div>
  </section>
);

export default Faq;
