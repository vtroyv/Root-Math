// components/Privacy.tsx — the /privacy page.
import React from 'react';
import Link from 'next/link';
import Footer from './Footer';

/* Written in plain language on purpose: most students are under 18, and the
   ICO's Children's Code expects privacy information they can actually follow.
   Covers the whole site as it will run from launch (1 December 2026), so
   update it when a service below changes, and bump LAST_UPDATED. */
const LAST_UPDATED = '2 November 2026';
const CONTACT = 'hello@radixmaths.co.uk';

const services = [
  { name: 'Clerk', use: 'accounts and signing in' },
  { name: 'MongoDB Atlas', use: 'our database, where your progress is stored' },
  { name: 'Vercel', use: 'hosting the website' },
  { name: 'Resend', use: 'sending our emails' },
  { name: 'Our AI provider', use: 'generating the tutor’s replies' },
  { name: 'Stripe', use: 'taking payments, from launch' },
];

export default function Privacy() {
  return (
    <div className="rm-landing">
      <header className="rm-paperhead rm-paperhead--tight">
        <div className="rm-container">
          <div className="rm-section-head">
            <span className="rm-eyebrow">
              <i className="bi bi-shield-lock-fill" /> Legal
            </span>
            <h1 className="rm-display">
              Privacy <span className="rm-underline">policy</span>
            </h1>
            <p className="rm-lead">
              What we collect, why we collect it, and how to ask us to change or delete it.
              Last updated {LAST_UPDATED}.
            </p>
          </div>
        </div>
      </header>

      <section className="rm-section rm-container">
        <article className="rm-article">
          <h2 className="rm-h3">The short version</h2>
          <ul>
            <li>We only collect what we need to run RadixMaths and to tell you when your course is ready.</li>
            <li>We never sell your data, and we don’t show you adverts from anyone else.</li>
            <li>
              You can ask to see, change or delete your data at any time by emailing{' '}
              <a href={`mailto:${CONTACT}`} className="rm-link">{CONTACT}</a>.
            </li>
          </ul>

          <h2 className="rm-h3">Who we are</h2>
          <p>
            RadixMaths (“we”, “us”) is an online maths learning platform based in the UK. We
            are responsible for the personal data described on this page. If you have any
            questions about it, email{' '}
            <a href={`mailto:${CONTACT}`} className="rm-link">{CONTACT}</a>.
          </p>

          <h2 className="rm-h3">What we collect</h2>
          <ul>
            <li>
              <strong>When you register your interest:</strong> your first and last name, email
              address, mobile number if you choose to give it, the courses and exam boards
              you’re interested in, and your school.
            </li>
            <li>
              <strong>When a parent or guardian signs up for updates</strong> on our parents’
              page: their first name and email address. Students never give us a parent’s
              details.
            </li>
            <li>
              <strong>When you contact us:</strong> your name, email address, mobile number if
              you choose to give it, and your message.
            </li>
            <li>
              <strong>When you send a request from our teachers page:</strong> your name, work
              email address, role, school, college or organisation, exam board, the resource you
              ask for, and anything you tell us about your teaching.
            </li>
            <li>
              <strong>When you create an account:</strong> your name, email address and sign-in
              details. Signing in is handled by Clerk, so we never see your password.
            </li>
            <li>
              <strong>When you use RadixMaths:</strong> the lessons you complete, your answers
              and marks, your notes, your review card history, and the progress worked out
              from all of these.
            </li>
            <li>
              <strong>When you use the tutor:</strong> the messages you send it, along with the
              lesson or question you’re on.
            </li>
            <li>
              <strong>When you post in the community:</strong> your comments, replies and votes,
              which other students see next to your display name.
            </li>
            <li>
              <strong>When you pay (from launch):</strong> Stripe handles your card details. We
              only receive a record of the payment, such as the amount, the date and the
              course.
            </li>
            <li>
              <strong>Basic technical information:</strong> such as your browser type and IP
              address, which our hosting provider logs to keep the site secure and working.
            </li>
          </ul>

          <h2 className="rm-h3">Why we use it</h2>
          <p>UK data protection law asks us to give a reason (a “lawful basis”) for each use:</p>
          <ul>
            <li>
              <strong>To tell you when your course opens</strong> and about early-access
              pricing, because you asked us to (consent). For parents who sign up, this
              includes a few short emails about how RadixMaths works.
            </li>
            <li>
              <strong>To answer you when you contact us</strong> (legitimate interests).
            </li>
            <li>
              <strong>To run your account and your course:</strong> lessons, marking, reviews,
              progress and the tutor (to provide the service you signed up for).
            </li>
            <li>
              <strong>To keep the site secure, fix problems and improve our lessons</strong>, in
              ways you would reasonably expect (legitimate interests).
            </li>
            <li>
              <strong>To take payments and keep the financial records the law requires</strong>{' '}
              (to provide the service, and a legal obligation).
            </li>
            <li>
              <strong>To send you other news, tips or offers</strong>, only if you have said yes
              (consent). Every email has an unsubscribe link.
            </li>
          </ul>

          <h2 className="rm-h3">Students under 18</h2>
          <p>
            Most RadixMaths students are under 18, so we keep this page clear and our privacy
            settings high by default. RadixMaths is for students aged 13 and over. If you’re
            under 13, please ask a parent or guardian to contact us instead of registering
            yourself.
          </p>
          <p>
            We don’t use your data to show you adverts, and we don’t track you across other
            websites. Parents and guardians who are linked to their child’s account can see
            their progress, and can contact us about their child’s data at any time.
          </p>

          <h2 className="rm-h3">Who we share it with</h2>
          <p>
            We never sell your data. We only share it with the services that help us run
            RadixMaths, and they may only use it to provide that service to us:
          </p>
          <ul>
            {services.map((service) => (
              <li key={service.name}>
                <strong>{service.name}</strong>: {service.use}
              </li>
            ))}
          </ul>
          <p>
            We will also share information if the law requires it. Some of these companies
            store data outside the UK, mainly in the US. When that happens, it is protected by
            safeguards approved under UK data protection law.
          </p>

          <h2 className="rm-h3">Cookies</h2>
          <p>
            We only use the cookies the site needs to work, such as the one that keeps you
            signed in. We don’t use advertising or analytics cookies. If we ever add them, we
            will ask first, and they will stay off unless you say yes.
          </p>

          <h2 className="rm-h3">How long we keep it</h2>
          <ul>
            <li>
              <strong>Registrations:</strong> 12 months after your course launches, unless you
              create an account or ask to keep hearing from us.
            </li>
            <li>
              <strong>Messages you send us:</strong> 12 months after we have dealt with them.
            </li>
            <li>
              <strong>Account and learning data:</strong> for as long as your account is open.
              If you close it, we delete this within 30 days.
            </li>
            <li>
              <strong>Community posts:</strong> until you delete them. If you close your
              account, they are deleted or made anonymous.
            </li>
            <li>
              <strong>Payment records:</strong> for as long as the law requires, usually 6
              years.
            </li>
          </ul>

          <h2 className="rm-h3">Your rights</h2>
          <p>You can ask us to:</p>
          <ul>
            <li>show you the data we hold about you</li>
            <li>correct anything that’s wrong</li>
            <li>delete your data</li>
            <li>stop or limit how we use it</li>
            <li>give you a copy to take somewhere else</li>
          </ul>
          <p>
            Where we rely on your consent, you can withdraw it at any time. Email{' '}
            <a href={`mailto:${CONTACT}`} className="rm-link">{CONTACT}</a> and we will reply
            within one month.
          </p>
          <p>
            If you’re unhappy with how we’ve handled your data, you can complain to the
            Information Commissioner’s Office at{' '}
            <a href="https://ico.org.uk" className="rm-link">ico.org.uk</a> or on 0303 123
            1113. We’d appreciate the chance to put it right first, though, so please{' '}
            <Link href="/contact" className="rm-link">get in touch</Link>.
          </p>

          <h2 className="rm-h3">Changes to this policy</h2>
          <p>
            If we change this policy, we will update the date at the top of this page, and if
            the change is significant we will email you about it.
          </p>
        </article>
      </section>

      <Footer />
    </div>
  );
}
