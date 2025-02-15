'use client';

/*
THIS NEEDS TO BE MORE LIKE THE questions/[title] page.js to enable conditional rendering depending on the students exam boards , 
e.g, use the params or metadata on the student to render the correct component.
Experiment what is faster e.g. using params or meta data about student, the question/[title] component currently uses meta data from the question object. 



*/ 


import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  CardText,
  CardBody,
  CardHeader,
  Badge,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { useRouter } from 'next/navigation';

export default function EdxPm1() {
  const router = useRouter();

  // Helper for navigation
  const navigate = (path) => {
    router.push(path);
  };

  const preUrl = '/learn/edx-maths-1'

  return (
    <div className="Edxpm1-container" style={{ backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
      <Container style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* TOP SECTION - Title and "My Progress" */}
        <Card body className="mb-4 shadow-sm" style={{ borderRadius: '15px' }}>
          <Row>
            <Col md={8}>
              <CardHeader
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '0'
                }}
              >
                <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontFamily: 'Georgia, serif' }}>
                  <strong>Edexcel Mathematics</strong> – Pure Mathematics
                </h1>
                <h2 style={{ margin: 0, color: '#666' }}>Year 12</h2>
              </CardHeader>
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <CardBody className="text-md-right text-center" style={{ padding: '0' }}>
                <h5 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>My Progress</h5>
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    padding: '0.5rem 1rem',
                    border: '1px solid #ddd'
                  }}
                >
                  {/* You can replace this with a progress bar or more dynamic data */}
                  <span style={{ color: '#17a2b8', fontWeight: 'bold' }}>0%</span>
                </div>
              </CardBody>
            </Col>
          </Row>
        </Card>

        {/* MAIN TOPICS */}
        <Row>
          {/* Proof */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '15px' }}>
              <CardHeader
                style={{
                  backgroundColor: '#17a2b8',
                  borderRadius: '15px 15px 0 0',
                  border: 'none'
                }}
              >
                <h3 style={{ color: '#fff' }}>Proof</h3>
              </CardHeader>
              <ListGroup flush style={{ borderRadius: '0 0 15px 15px' }}>
                <ListGroupItem
                  action
                  onClick={() => navigate('what-is-proof')}
                  style={{ cursor: 'pointer' }}
                >
                  What is Proof?
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('methods-of-proof')}
                  style={{ cursor: 'pointer' }}
                >
                  Methods of Proof
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>

          {/* Coordinate Geometry */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '15px' }}>
              <CardHeader
                style={{
                  backgroundColor: '#17a2b8',
                  borderRadius: '15px 15px 0 0',
                  border: 'none'
                }}
              >
                <h3 style={{ color: '#fff' }}>Coordinate Geometry in the (x,y) Plane</h3>
              </CardHeader>
              <ListGroup flush style={{ borderRadius: '0 0 15px 15px' }}>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Straight Lines
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Circles
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Algebra & Functions */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '15px' }}>
              <CardHeader
                style={{
                  backgroundColor: '#17a2b8',
                  borderRadius: '15px 15px 0 0',
                  border: 'none'
                }}
              >
                <h3 style={{ color: '#fff' }}>Algebra &amp; Functions</h3>
              </CardHeader>
              <ListGroup flush style={{ borderRadius: '0 0 15px 15px' }}>
                <ListGroupItem
                  action
                  onClick={() => navigate(preUrl+'/algebraic-expressions')}
                  style={{ cursor: 'pointer' }}
                >
                  Algebraic Expressions
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate(preUrl+'/quadratic-functions')}
                  style={{ cursor: 'pointer' }}
                >
                  Quadratic Functions
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('simultaneous-equations')}
                  style={{ cursor: 'pointer' }}
                >
                  Simultaneous Equations
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('inequalities')}
                  style={{ cursor: 'pointer' }}
                >
                  Inequalities
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Graphs &amp; Transformations
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Algebraic Methods
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>

          {/* Trigonometry */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '15px' }}>
              <CardHeader
                style={{
                  backgroundColor: '#17a2b8',
                  borderRadius: '15px 15px 0 0',
                  border: 'none'
                }}
              >
                <h3 style={{ color: '#fff' }}>Trigonometry</h3>
              </CardHeader>
              <ListGroup flush style={{ borderRadius: '0 0 15px 15px' }}>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Sine, Cosine &amp; Tangent
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Trigonometry &amp; Triangles
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Trigonometric Graphs
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Trigonometric Angles &amp; Ratios
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Trigonometric Identities
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Trigonometric Equations
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Sequences & Series */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '15px' }}>
              <CardHeader
                style={{
                  backgroundColor: '#17a2b8',
                  borderRadius: '15px 15px 0 0',
                  border: 'none'
                }}
              >
                <h3 style={{ color: '#fff' }}>Sequences &amp; Series</h3>
              </CardHeader>
              <ListGroup flush style={{ borderRadius: '0 0 15px 15px' }}>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Binomial Expansion
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>

          {/* Exponentials & Logarithms */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '15px' }}>
              <CardHeader
                style={{
                  backgroundColor: '#17a2b8',
                  borderRadius: '15px 15px 0 0',
                  border: 'none'
                }}
              >
                <h3 style={{ color: '#fff' }}>Exponentials &amp; Logarithms</h3>
              </CardHeader>
              <ListGroup flush style={{ borderRadius: '0 0 15px 15px' }}>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Exponential Graphs
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Logarithms
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Exponential Modelling
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Differentiation */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '15px' }}>
              <CardHeader
                style={{
                  backgroundColor: '#17a2b8',
                  borderRadius: '15px 15px 0 0',
                  border: 'none'
                }}
              >
                <h3 style={{ color: '#fff' }}>Differentiation</h3>
              </CardHeader>
              <ListGroup flush style={{ borderRadius: '0 0 15px 15px' }}>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Gradients &amp; Derivatives
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Differentiating Functions
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Gradients, Tangents &amp; Normals
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Rates of Change &amp; Modelling
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>

          {/* Integration */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm" style={{ borderRadius: '15px' }}>
              <CardHeader
                style={{
                  backgroundColor: '#17a2b8',
                  borderRadius: '15px 15px 0 0',
                  border: 'none'
                }}
              >
                <h3 style={{ color: '#fff' }}>Integration</h3>
              </CardHeader>
              <ListGroup flush style={{ borderRadius: '0 0 15px 15px' }}>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  What Is Integration?
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Definite Integrals
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Indefinite Integrals
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Vectors */}
          <Col lg={12}>
            <Card className="shadow-sm" style={{ borderRadius: '15px' }}>
              <CardHeader
                style={{
                  backgroundColor: '#17a2b8',
                  borderRadius: '15px 15px 0 0',
                  border: 'none'
                }}
              >
                <h3 style={{ color: '#fff' }}>Vectors</h3>
              </CardHeader>
              <ListGroup flush style={{ borderRadius: '0 0 15px 15px' }}>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  What Are Vectors?
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Vectors In Geometry
                </ListGroupItem>
                <ListGroupItem
                  action
                  onClick={() => navigate('')}
                  style={{ cursor: 'pointer' }}
                >
                  Modelling With Vectors
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
