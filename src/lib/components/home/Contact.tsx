// components/Contact.tsx
'use client'
import React, { useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';
import 'animate.css';

export default function Contact() {
 

  return (
    <section style={{ backgroundColor: 'white', padding: '4rem 0', position: 'relative' }}>
      <Container>
        {/* SECTION HEADER */}
        <div className="text-center mb-5">
          {/* Envelope SVG icon */}
          <div className="mb-3">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="#17a2b8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v2l8 5 8-5V4H4zm0 4.236V20h16V8.236l-8 5-8-5z" />
            </svg>
          </div>
          <h2 style={{ color: '#17a2b8', fontWeight: 'bold' }}>Contact Us</h2>
          <p style={{ color: '#6c757d', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            We’d love to hear from you! Fill out the form below or reach us directly at:
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
        <Row className="align-items-center">
          {/* Left: Contact Info */}
          <Col md="6">
            <div className="wow animate__animated animate__fadeInLeft">
              <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Get in Touch</h3>
              <p style={{ fontSize: '1rem', color: '#6c757d' }}>
                You can also reach us directly at:
              </p>
              <ul
                style={{
                  listStyleType: 'none',
                  paddingLeft: 0,
                  color: '#495057',
                  lineHeight: 1.6,
                  marginTop: '1rem',
                }}
              >
                <li>
                  <strong>Email:</strong> support@yourdomain.com
                </li>
                <li>
                  <strong>Phone:</strong> +44 1234 567 890
                </li>
                <li>
                  <strong>Address:</strong> 123 Learning Lane, London, UK
                </li>
              </ul>
            </div>
          </Col>

          {/* Right: Form Card */}
          <Col md="6">
            <Card
              className="wow animate__animated animate__fadeInRight"
              data-wow-delay="0.3s"
              style={{
                borderRadius: '12px',
                border: '1px solid #dee2e6',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <CardBody>
                <CardTitle
                  tag="h4"
                  style={{
                    fontWeight: 'bold',
                    color: '#17a2b8',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  Send Us a Message
                </CardTitle>
                <Form>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      type="text"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="yourname@example.com"
                      type="email"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+44 7123 456 789"
                      type="tel"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="message">Message</Label>
                    <Input
                      id="message"
                      name="message"
                      type="textarea"
                      placeholder="Type your message here..."
                      rows={5}
                    />
                  </FormGroup>

                  <Button
                    color="info"
                    style={{
                      backgroundColor: '#17a2b8',
                      borderColor: '#17a2b8',
                      width: '100%',
                    }}
                  >
                    Send Message
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
