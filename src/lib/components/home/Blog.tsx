// components/Blog.tsx
'use client'
import React, { useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import 'animate.css';

export default function Blog() {
 

  const articles = [
    {
      id: 1,
      date: '2025-05-15',
      title: 'How to Maximise Your A-Level Revision',
      excerpt:
        'Discover proven strategies to structure your revision, stay motivated, and achieve top grades in your A-Levels. From smart timetabling to active recall techniques, we’ve got you covered.',
    },
    {
      id: 2,
      date: '2025-04-30',
      title: 'Choosing Between Up Core and Up Master',
      excerpt:
        'Not sure which plan fits your needs? We break down the differences between Up Core and Up Master, so you can choose the most cost-effective route to A* results in maths and further maths.',
    },
  ];

  return (
    <section style={{ backgroundColor: 'white', padding: '4rem 0', position: 'relative' }}>
      <Container>
        {/* SECTION HEADER */}
        <div className="text-center mb-5">
          {/* Blog SVG icon */}
          <div className="mb-3">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="#17a2b8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h10v2H4v-2zm0 4h10v2H4v-2z" />
            </svg>
          </div>
          <h2 style={{ color: '#17a2b8', fontWeight: 'bold' }}>Latest Articles</h2>
          <p style={{ color: '#6c757d', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Read our latest insights, tips, and updates on A-Level maths, resources, and more.
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

        {/* ARTICLES ROW */}
        <Row>
          {articles.map((article, idx) => {
            const delay = `${0.2 * (idx + 1)}s`;
            const formattedDate = new Date(article.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }); // e.g. "15 May 2025"
            return (
              <Col md="6" className="mb-4" key={article.id}>
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
                  <CardBody>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        color: '#6c757d',
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                      }}
                    >
                      {formattedDate}
                    </div>
                    <CardTitle
                      tag="h5"
                      style={{
                        color: '#17a2b8',
                        fontWeight: 600,
                        marginTop: '2rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {article.title}
                    </CardTitle>
                    <CardText style={{ color: '#495057', fontSize: '0.95rem' }}>
                      {article.excerpt}
                    </CardText>
                    <div className="text-right">
                      <Button
                        color="info"
                        outline
                        style={{ borderColor: '#17a2b8', color: '#17a2b8' }}
                      >
                        Read More
                      </Button>
                    </div>
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
