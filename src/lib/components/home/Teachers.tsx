// components/Teachers.tsx
'use client'
import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import 'animate.css';

export default function Teachers() {


  // Sample statistics for teachers
  const stats = [
    {
      value: '97%',
      label: 'Of partnered schools see improved grades within one academic year',
    },
    {
      value: '8/10',
      label: 'Teachers report that our platform saves 5+ hours weekly',
    },
    {
      value: '500+',
      label: 'Schools using RootMath to enhance teaching outcomes',
    },
  ];

  return (
    <section style={{ backgroundColor: 'white', padding: '4rem 0', position: 'relative' }}>
      <Container>
        {/* SECTION HEADER */}
        <div className="text-center mb-5">
          {/* Teacher icon SVG */}
          <div className="mb-3">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="#17a2b8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
              <path d="M11 12.22L3 8.11v7.25C3 18.1 4.9 20 7.11 20h9.78C19.1 20 21 18.1 21 15.36V8.11l-8 4.11v2.11L11 12.22z" />
            </svg>
          </div>
          <h2 style={{ color: '#17a2b8', fontWeight: 'bold' }}>For Teachers</h2>
          <p style={{ color: '#6c757d', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Empower your classroom with RootMath’s comprehensive teaching tools. Streamline lesson planning, track student progress, and foster deeper understanding—all in one intuitive platform.
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

        {/* MAIN CONTENT */}
        <Row className="mb-5">
          <Col md="8" className="mx-auto wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
            <h4 style={{ color: '#17a2b8', fontWeight: '600', marginBottom: '1rem' }}>
              Simplify Your Teaching Workflow
            </h4>
            <p style={{ color: '#495057', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              RootMath provides a suite of resources tailored for teachers:  
              <ul style={{ marginTop: '0.5rem', marginBottom: '1rem', paddingLeft: '1.2rem' }}>
                <li>Pre-made, syllabus-aligned lesson plans and slides.</li>
                <li>Auto-generated quizzes with instant marking and feedback.</li>
                <li>Real-time analytics dashboard to track class performance.</li>
                <li>Collaborative tools to assign group activities and monitor progress.</li>
              </ul>
            </p>

            <h4 style={{ color: '#17a2b8', fontWeight: '600', marginBottom: '1rem' }}>
              Engage Students with Interactive Content
            </h4>
            <p style={{ color: '#495057', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              From dynamic video tutorials to immersive whiteboard sessions, your students will benefit from:
              <ul style={{ marginTop: '0.5rem', marginBottom: '1rem', paddingLeft: '1.2rem' }}>
                <li>Step-by-step problem walkthroughs that reinforce conceptual understanding.</li>
                <li>Interactive quizzes and polls during live lessons to boost participation.</li>
                <li>Personalised revision assignments based on individual performance data.</li>
              </ul>
            </p>

            <div className="text-center">
              <Button
                color="info"
                style={{ backgroundColor: '#17a2b8', borderColor: '#17a2b8', fontSize: '1.05rem' }}
              >
                Request a Teacher Demo
              </Button>
            </div>
          </Col>
        </Row>

        {/* STATISTICS ROW */}
        <Row>
          {stats.map((stat, idx) => {
            const delay = `${0.2 * (idx + 1)}s`;
            return (
              <Col md="4" className="mb-4" key={stat.value}>
                <Card
                  className="wow animate__animated animate__fadeInUp"
                  data-wow-delay={delay}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #dee2e6',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    height: '100%',
                  }}
                >
                  <CardBody className="text-center">
                    <CardTitle
                      tag="h3"
                      style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '0.5rem' }}
                    >
                      {stat.value}
                    </CardTitle>
                    <CardText style={{ color: '#495057', fontSize: '1rem' }}>
                      {stat.label}
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
