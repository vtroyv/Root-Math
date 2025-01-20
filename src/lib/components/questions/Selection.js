'use client';
import React, { useEffect, useRef, useState } from 'react'
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { MathfieldElement } from 'mathlive';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Container
} from 'reactstrap';

export default function Selection({ question }) {
  const questionView = useRef(new MathfieldElement());
  const questionRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (question) {
      questionView.current.value = String.raw`${question.latex}`;
      questionView.current.readOnly = true;
      if (questionRef.current && !questionRef.current.contains(questionView.current)) {
        questionRef.current.appendChild(questionView.current);
      }
    }
  }, [question]);

  const handleCardClick = (option) => {
    // Set which option is selected
    setSelectedOption(option.option);
    // Simple feedback check
    if (option.isCorrect) {
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect!');
    }
  };

  if (!question) {
    return <div>Loading question...</div>;
  }

  // Helper to assign color to the cards (similar to Kahoot)
  const getColorByIndex = (index) => {
    const colors = ['info', 'primary', 'warning', 'danger'];
    return colors[index % colors.length];
  };

  return (
    <Container className="py-4">
      {/* Top row: question text and (optionally) an image */}
      <Row className="mb-4">
        <Col xs={12} className="text-center">
          <h1 style={{ marginBottom: '1rem' }}>
            {question.title.replace(/-/g, ' ')}
          </h1>
          <div
            ref={questionRef}
            style={{
              margin: 'auto',
              display: 'inline-block',
              fontWeight: 'bold',
              fontSize: '20px'
            }}
          />
        </Col>
      </Row>

      {/** Optional Image Row (if you have a question.image property) */}
      {/* 
      <Row className="mb-4">
        <Col xs={12} className="text-center">
          <img
            src={question.image}
            alt="Question"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </Col>
      </Row>
      */}

      {/* Answer Cards in a 2x2 grid (if 4 options) */}
      <Row>
        {question.options?.map((option, index) => (
          <Col
            key={index}
            xs={12}
            md={6}
            className="d-flex align-items-stretch mb-3"
          >
            <Card
              color={getColorByIndex(index)}
              inverse
              style={{ width: '100%', cursor: 'pointer' }}
              onClick={() => handleCardClick(option)}
            >
              <CardBody className="text-center">
                <h5><Latex>${option.option}$</Latex></h5>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Feedback Row */}
      {feedback && (
        <Row className="mt-3">
          <Col xs={12} className="text-center">
            <h2 info>{feedback}</h2>
          </Col>
        </Row>
      )}
    </Container>
  );
}
