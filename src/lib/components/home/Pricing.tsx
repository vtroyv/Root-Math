// components/PricingPage.tsx
'use client'
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import 'animate.css';

type BillingPeriod = 'monthly' | '2026' | '2025';

const COURSE_OPTIONS = [
  { label: 'A-Level Maths', value: 'alevel_maths' },
  { label: 'A-Level Further Maths', value: 'alevel_further_maths' },
  { label: 'MAT', value: 'mat' },
];

const PRICING_DATA: Record<
  'master' | 'core',
  Record<BillingPeriod, { display: string; original?: string }>
> = {
  master: {
    monthly: { display: '£89.99' },
    '2026': { original: '£659.98', display: '£459.98' },
    '2025': { original: '£399.99', display: '£79.99' },
  },
  core: {
    monthly: { display: '£69.99' },
    '2026': { original: '£499.98', display: '£344.98' },
    '2025': { original: '£299.99', display: '£64.99' },
  },
};

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);


  

  const toggleCourse = (value: string) => {
    setSelectedCourses((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const pricingLabels: Record<BillingPeriod, string> = {
    monthly: 'Monthly',
    '2026': 'Until Exams 2026',
    '2025': 'Until Exams 2025',
  };

  return (
    <section style={{ backgroundColor: 'white', padding: '4rem 0', position: 'relative' }}>
      <Container>
        {/* SECTION HEADER */}
        <div className="text-center mb-5">
          {/* Price tag SVG icon */}
          <div className="mb-3">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="#17a2b8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM11 17.93c-3.95-.49-7-3.85-7-7.93V6.3l7-3.11 7 3.11v3.7c0 4.08-3.05 7.44-7 7.93z" />
              <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
          </div>
          <h2 style={{ color: '#17a2b8', fontWeight: 'bold' }}>Our Plans</h2>
          <p style={{ color: '#6c757d', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Get ahead with flexible billing. Select your courses and pick a plan that suits you.
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

        {/* COURSE SELECTION */}
        <Card className="mb-5 wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
          <CardBody>
            <CardTitle
              tag="h4"
              style={{
                fontWeight: 'bold',
                color: '#17a2b8',
                marginBottom: '1rem',
                textAlign: 'center',
              }}
            >
              Select Your Courses
            </CardTitle>
            <Form>
              <Row>
                {COURSE_OPTIONS.map((course) => (
                  <Col md="4" sm="6" xs="12" key={course.value}>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          value={course.value}
                          onChange={() => toggleCourse(course.value)}
                          checked={selectedCourses.includes(course.value)}
                        />{' '}
                        {course.label}
                      </Label>
                    </FormGroup>
                  </Col>
                ))}
              </Row>
              <p
                className="mt-3 text-center"
                style={{ color: '#6c757d', fontSize: '0.9rem' }}
              >
                (Prices below are per subject. We only charge for courses you select.)
              </p>
            </Form>
          </CardBody>
        </Card>

        {/* BILLING PERIOD TOGGLE */}
        <div className="text-center mb-4 wow animate__animated animate__fadeInUp" data-wow-delay="0.4s">
          <ButtonGroup>
            {(Object.keys(pricingLabels) as BillingPeriod[]).map((period) => (
              <Button
                key={period}
                color={billingPeriod === period ? 'info' : 'outline-info'}
                onClick={() => setBillingPeriod(period)}
              >
                {pricingLabels[period]}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* PRICING CARDS */}
        <Row>
          {/* Master Plan */}
          <Col md="6" className="mb-4">
            <Card className="wow animate__animated animate__fadeInUp" data-wow-delay="0.6s">
              <CardBody>
                <div className="text-center mb-3">
                  <div style={{ color: '#28a745', fontWeight: 600 }}>
                    CHOSEN BY 62% OF STUDENTS
                  </div>
                  <CardTitle tag="h4">Up Master</CardTitle>
                </div>
                <div className="text-center mb-3">
                  {PRICING_DATA.master[billingPeriod].original && (
                    <div>
                      <span
                        style={{
                          textDecoration: 'line-through',
                          color: '#dc3545',
                          fontSize: '1.25rem',
                          marginRight: '0.5rem',
                        }}
                      >
                        {PRICING_DATA.master[billingPeriod].original}
                      </span>
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 500 }}>
                      {PRICING_DATA.master[billingPeriod].display}
                    </span>
                  </div>
                  <div style={{ fontSize: '1rem', color: '#6c757d' }}>
                    per subject
                  </div>
                </div>

                <div className="mb-3 text-center">
                  <strong>
                    Full access to a single subject until{' '}
                    {billingPeriod === 'monthly'
                      ? 'you cancel'
                      : `31 July ${billingPeriod}`}
                  </strong>
                  <br />
                  <span>Unlimited tutor support at the click of a button</span>
                </div>

                <hr />

                <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '1.5rem' }}>
                  <li>
                    <Input type="checkbox" checked readOnly style={{ marginRight: '0.5rem' }} />
                    Full, unrestricted access to all content &amp; features
                  </li>
                  <li>
                    <Input type="checkbox" checked readOnly style={{ marginRight: '0.5rem' }} />
                    All-in-one solution for A*/A results from any prior level
                  </li>
                  <li>
                    <Input type="checkbox" checked readOnly style={{ marginRight: '0.5rem' }} />
                    A*/A guaranteed, or your money back –{' '}
                    <a href="/moneyback">find out more</a>
                  </li>
                  <li>
                    <Input type="checkbox" checked readOnly style={{ marginRight: '0.5rem' }} />
                    If your plan expires, we save all your progress.
                  </li>
                  <li>
                    <Input type="checkbox" checked readOnly style={{ marginRight: '0.5rem' }} />
                    <span style={{ color: '#17a2b8', fontWeight: 500 }}>
                      Unlimited one-to-one 24/7 tutor support.
                    </span>{' '}
                    Tutors from top universities such as Oxford, Cambridge, LSE.
                  </li>
                  <li>
                    <Input type="checkbox" checked readOnly style={{ marginRight: '0.5rem' }} />
                    + 2 exam papers marked by experienced officials
                  </li>
                </ul>

                <div className="text-center">
                  <Button
                    color="info"
                    style={{ backgroundColor: '#17a2b8', borderColor: '#17a2b8' }}
                    size="lg"
                  >
                    Start free 3-day trial
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Core Plan */}
          <Col md="6" className="mb-4">
            <Card className="wow animate__animated animate__fadeInUp" data-wow-delay="0.8s">
              <CardBody>
                <div className="text-center mb-3">
                  <CardTitle tag="h4">Up Core</CardTitle>
                </div>
                <div className="text-center mb-3">
                  {PRICING_DATA.core[billingPeriod].original && (
                    <div>
                      <span
                        style={{
                          textDecoration: 'line-through',
                          color: '#dc3545',
                          fontSize: '1.25rem',
                          marginRight: '0.5rem',
                        }}
                      >
                        {PRICING_DATA.core[billingPeriod].original}
                      </span>
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 500 }}>
                      {PRICING_DATA.core[billingPeriod].display}
                    </span>
                  </div>
                  <div style={{ fontSize: '1rem', color: '#6c757d' }}>
                    per subject
                  </div>
                </div>

                <div className="mb-3 text-center">
                  <strong>
                    Full access to a single subject until{' '}
                    {billingPeriod === 'monthly'
                      ? 'you cancel'
                      : `31 July ${billingPeriod}`}
                  </strong>
                  <br />
                  <span>Basic 24/7 online support</span>
                </div>

                <hr />

                <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '1.5rem' }}>
                  <li>
                    <Input type="checkbox" checked readOnly style={{ marginRight: '0.5rem' }} />
                    Full, unrestricted access to all content &amp; features
                  </li>
                  <li>
                    <Input type="checkbox" checked readOnly style={{ marginRight: '0.5rem' }} />
                    All-in-one solution for A*/A results from any prior level
                  </li>
                  <li>
                    <Input type="checkbox" checked readOnly style={{ marginRight: '0.5rem' }} />
                    A*/A guaranteed, or your money back –{' '}
                    <a href="/moneyback">find out more</a>
                  </li>
                  <li>
                    <Input type="checkbox" checked readOnly style={{ marginRight: '0.5rem' }} />
                    If your plan expires, we save all your progress.
                  </li>
                  <li>
                    <Input type="checkbox" checked readOnly style={{ marginRight: '0.5rem' }} />
                    Basic 24/7 online support
                  </li>
                </ul>

                <div className="text-center">
                  <Button
                    outline
                    color="info"
                    style={{ borderColor: '#17a2b8', color: '#17a2b8' }}
                    size="lg"
                  >
                    Start free 3-day trial
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
