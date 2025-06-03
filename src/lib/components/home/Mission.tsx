// components/Mission.tsx

import React, { useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import 'animate.css';

export default function Mission() {
  

  return (
    <section style={{ backgroundColor: 'white', padding: '4rem 0', position: 'relative' }}>
      <Container>
        {/* SECTION HEADER */}
        <div className="text-center mb-5">
          {/* Mission SVG icon */}
          <div className="mb-3">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="#17a2b8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 4.25 4 8.5 7 12 3-3.5 7-7.75 7-12 0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
            </svg>
          </div>
          <h2 style={{ color: '#17a2b8', fontWeight: 'bold' }}>Our Mission</h2>
          <p style={{ color: '#6c757d', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Why RootMath exists and how we empower students to excel in A-Level maths.
          </p>
        </div>

        {/* Decorative SVG wave under header */}
        <div>
          <svg
            viewBox="0 0 500 50"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '50px', marginBottom: '2rem' }}
          >
            <path
              d="M0,30 C150,80 350,-20 500,30 L500,50 L0,50 Z"
              fill="#17a2b8"
              opacity="0.1"
            />
          </svg>
        </div>

        {/* MISSION CONTENT */}
        <Row className="wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
          <Col>
            <h4 style={{ color: '#17a2b8', fontWeight: '600', marginBottom: '1rem' }}>
              Empower Every Student
            </h4>
            <p style={{ color: '#495057', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              At RootMath, our mission is to democratise top-tier A-Level maths tuition by
              harnessing technology and Oxford/Cambridge-trained tutors. We believe every
              student—regardless of background or school—deserves access to high-quality lessons,
              personalised support, and a community that values excellence. Through targeted video
              lessons, on-demand tutor support, and interactive quizzes, we guide students from
              foundational concepts all the way to A* mastery.
            </p>

            <h4 style={{ color: '#17a2b8', fontWeight: '600', marginBottom: '1rem' }}>
              Build Confidence Through Understanding
            </h4>
            <p style={{ color: '#495057', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              More than memorisation, we focus on deep conceptual clarity. Our structured
              curriculum breaks down complex topics into bite-sized modules, ensuring students
              understand the “why” behind every theorem and technique. By building that strong
              foundation, students gain confidence to tackle any exam question—whether it’s pure
              calculus, mechanics, or statistics.
            </p>

            <h4 style={{ color: '#17a2b8', fontWeight: '600', marginBottom: '1rem' }}>
              Foster a Collaborative Community
            </h4>
            <p style={{ color: '#495057', fontSize: '1rem', lineHeight: 1.6 }}>
              We’re more than a platform—we’re a community. From weekly group workshops to an
              interactive forum, students learn alongside peers who share their academic goals.
              RootMath’s community encourages knowledge-sharing, peer support, and healthy
              competition, all in a safe, moderated environment. Our goal is to foster lifelong
              curiosity and a love for mathematics.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
