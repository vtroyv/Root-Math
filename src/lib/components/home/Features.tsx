// components/Features.tsx

import React, { useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import 'animate.css';

export default function Features() {
 

  // Features data: title, description, and inline SVG icon
  const featureItems = [
    {
      title: 'Unlimited Tutor Support',
      description:
        'Connect with our expert tutors 24/7. Get instant help on any question—video calls, chat, or email, whenever you need it.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="#17a2b8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 2H4C2.9 2 2 2.9 2 4V18L6 14H20C21.1 14 22 13.1 22 12V4C22 2.9 21.1 2 20 2Z" />
        </svg>
      ),
    },
    {
      title: 'Comprehensive Video Lessons',
      description:
        'Step-by-step, syllabus-aligned video lessons filmed by A*-achieving instructors. Learn at your own pace, pause/replay as much as you like.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="#17a2b8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17 10.5V6c0-1.1-0.9-2-2-2H3C1.9 4 1 4.9 1 6v12c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-4.5l4 4v-11l-4 4z" />
        </svg>
      ),
    },
    {
      title: 'Exam-Style Quizzes & Past Papers',
      description:
        'Test your knowledge with interactive quizzes after every topic. Plus, access fully worked past papers with examiner feedback.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="#17a2b8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 2h9l5 5v13c0 1.1-0.9 2-2 2H6c-1.1 0-2-0.9-2-2V4c0-1.1.9-2 2-2zM6 4v16h12V8h-4V4H6z" />
          <path d="M9 12h6v2H9zM9 8h6v2H9z" />
        </svg>
      ),
    },
    {
      title: 'Personalised Progress Tracking',
      description:
        'Our dashboard highlights your strengths and weaknesses. See your performance over time and receive curated recommendations.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="#17a2b8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 17l5-5 4 4 8-8v8H3z" />
        </svg>
      ),
    },
    {
      title: 'Live Group Workshops',
      description:
        'Participate in weekly live workshops with peers and instructors. Collaborative problem-solving and real-time Q&A sessions.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="#17a2b8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
        </svg>
      ),
    },
    {
      title: 'Personalised Revision Plans',
      description:
        'Receive a custom revision schedule based on your performance. Focus on weak areas and track completion as you go.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="#17a2b8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 17.25V21h3.75l11-11-3.75-3.75-11 11zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
      ),
    },
    {
      title: 'Exam Tips & Strategy',
      description:
        'Learn expert strategies for time management, question approach, and stress reduction to maximise your exam performance.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="#17a2b8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 21h6v-1.5H9V21zm3-19C7.91 2 5 4.91 5 8.5c0 2.41 1.19 4.52 3 5.74V16c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1.76c1.81-1.22 3-3.33 3-5.74C19 4.91 16.09 2 13 2zm1 11h-2v-1.5h2V13zm0-3h-2V7h2v3z" />
        </svg>
      ),
    },
    {
      title: 'Community Forum Access',
      description:
        'Join our private forum to discuss problems, share resources, and learn from a community of motivated students.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="#17a2b8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-5-7-5zm8 0c-0.29 0-0.62 0.02-0.97 0.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-5-7-5z" />
        </svg>
      ),
    },
  ];

  // Split into two rows of four
  const firstRow = featureItems.slice(0, 4);
  const secondRow = featureItems.slice(4, 8);

  return (
    <section style={{ backgroundColor: 'white', padding: '4rem 0', position: 'relative' }}>
      <Container>
        {/* SECTION HEADER */}
        <div className="text-center mb-5">
          {/* Star icon SVG */}
          <div className="mb-3">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="#17a2b8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
          <h2 style={{ color: '#17a2b8', fontWeight: 'bold' }}>Our Key Features</h2>
          <p style={{ color: '#6c757d', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Everything you need to reach A*-A grades—available anytime, anywhere.
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

        {/* FIRST ROW OF FEATURES */}
        <Row className="mb-4">
          {firstRow.map((feature, idx) => {
            const delay = `${0.2 * (idx + 1)}s`; // .2s, .4s, .6s, .8s
            return (
              <Col md="6" lg="3" className="mb-4" key={feature.title}>
                <Card
                  className="wow animate__animated animate__fadeInUp"
                  data-wow-delay={delay}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #dee2e6',
                    height: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <CardBody className="text-center">
                    <div className="mb-3">{feature.icon}</div>
                    <CardTitle
                      tag="h5"
                      style={{ color: '#17a2b8', fontWeight: 600, marginBottom: '0.75rem' }}
                    >
                      {feature.title}
                    </CardTitle>
                    <CardText style={{ color: '#495057', fontSize: '0.95rem' }}>
                      {feature.description}
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* SECOND ROW OF FEATURES */}
        <Row>
          {secondRow.map((feature, idx) => {
            const delay = `${0.2 * (idx + 1)}s`; // .2s, .4s, .6s, .8s
            return (
              <Col md="6" lg="3" className="mb-4" key={feature.title}>
                <Card
                  className="wow animate__animated animate__fadeInUp"
                  data-wow-delay={delay}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #dee2e6',
                    height: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <CardBody className="text-center">
                    <div className="mb-3">{feature.icon}</div>
                    <CardTitle
                      tag="h5"
                      style={{ color: '#17a2b8', fontWeight: 600, marginBottom: '0.75rem' }}
                    >
                      {feature.title}
                    </CardTitle>
                    <CardText style={{ color: '#495057', fontSize: '0.95rem' }}>
                      {feature.description}
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}
