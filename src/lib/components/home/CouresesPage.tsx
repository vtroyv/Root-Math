// components/Courses.tsx
'use client'
import React, { useEffect } from 'react';
import { Container, Row, Col, Table, Card, CardBody, CardTitle } from 'reactstrap';
import 'animate.css';

export default function Courses() {
 

  // Hardcoded courses and availability
  const courses = [
    { name: 'A-Level Maths', available: true },
    { name: 'A-Level Further Maths', available: true },
    { name: 'MAT', available: true },
    { name: 'TMUA', available: false },
    { name: 'STEP', available: false },
    { name: 'GCSE Maths', available: true },
  ];

  // Inline SVGs for tick and clock icons
  const TickIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="#28a745"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="#6c757d"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8zm.5-13h-1v6l5.25 3.15.5-.86L12.5 11z" />
    </svg>
  );

  return (
    <section style={{ backgroundColor: 'white', padding: '4rem 0', position: 'relative' }}>
      <Container>
        {/* SECTION HEADER */}
        <div className="text-center mb-5">
          {/* Courses SVG icon */}
          <div className="mb-3">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="#17a2b8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 4h16v2H4zm0 4h16v2H4zm0 4h16v2H4zm0 4h16v2H4z" />
            </svg>
          </div>
          <h2 style={{ color: '#17a2b8', fontWeight: 'bold' }}>Our Courses</h2>
          <p style={{ color: '#6c757d', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Browse all the courses that RootMath offers. If a course isn’t ready yet, it will be
            marked “Coming Soon.”
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

        {/* COURSES TABLE CARD */}
        <Row className="wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
          <Col md="10" className="mx-auto">
            <Card
              style={{
                borderRadius: '12px',
                border: '1px solid #dee2e6',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
            >
              <CardBody style={{ padding: '1rem' }}>
                <CardTitle
                  tag="h4"
                  style={{ color: '#17a2b8', fontWeight: '600', marginBottom: '1rem' }}
                >
                  Course Availability Table
                </CardTitle>
                <Table
                  bordered
                  responsive
                  style={{
                    borderColor: '#dee2e6',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th style={{ color: '#17a2b8', fontWeight: '600' }}>Course Name</th>
                      <th
                        style={{
                          color: '#17a2b8',
                          fontWeight: '600',
                          textAlign: 'center',
                          width: '120px',
                        }}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, idx) => {
                      const delay = `${0.2 * (idx + 1)}s`;
                      return (
                        <tr
                          key={course.name}
                          className="wow animate__animated animate__fadeInUp"
                          data-wow-delay={delay}
                          style={{ fontSize: '0.95rem' }}
                        >
                          <td style={{ color: '#343a40', padding: '0.75rem 1rem' }}>
                            {course.name}
                          </td>
                          <td style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>
                            {course.available ? <TickIcon /> : <ClockIcon />}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
