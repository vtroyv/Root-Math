'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { MathfieldElement } from 'mathlive';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';

const ACCENT = '#17a2b8';

export default function Selection({ question }) {
  const questionView = useRef(null);
  const questionRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    if (!question) return;

    if (!questionView.current) {
      questionView.current = new MathfieldElement();
    }

    const qv = questionView.current;
    qv.value = String.raw`${question.latex}`;
    qv.readOnly = true;

    Object.assign(qv.style, {
      width: '100%',
      margin: '0.5rem 0',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      boxSizing: 'border-box',
    });

    if (questionRef.current && !questionRef.current.contains(qv)) {
      questionRef.current.appendChild(qv);
    }
  }, [question]);

  if (!question) return <div>Loading question...</div>;

  const title = (question.title || '')
    .split('-')
    .map(w => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');

  const handlePick = opt => {
    if (selectedOption) return; // lock after first pick
    setSelectedOption(opt.option);
    setIsCorrect(!!opt.isCorrect);
  };

  const reset = () => {
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const baseBtnStyle = {
    width: '100%',
    padding: '1.25rem',
    borderRadius: '9999px',
    fontSize: '1.1rem',
    fontWeight: 700,
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  };

  const getBtnColor = idx => {
    const palette = ['info', 'secondary', 'warning', 'danger'];
    return palette[idx % palette.length];
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '1rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <h1
          style={{
            color: ACCENT,
            fontWeight: 'bold',
            textAlign: 'center',
            margin: 0,
            marginBottom: '1rem',
          }}
        >
          {title}
        </h1>

        <Row>
          {/* LEFT: Question + Options */}

            <div ref={questionRef} />

            <Row className="mt-3">
              {(question.options || []).map((opt, idx) => {
                const picked = selectedOption === opt.option;
                const showState = selectedOption !== null;
                const correctPick = picked && isCorrect === true;
                const wrongPick = picked && isCorrect === false;

                return (
                  <Col key={idx} xs="12" md="6" className="mb-3">
                    <Button
                      color={getBtnColor(idx)}
                      className="w-100"
                      style={{
                        ...baseBtnStyle,
                        outline: correctPick
                          ? '3px solid #28a745'
                          : wrongPick
                          ? '3px solid #dc3545'
                          : picked
                          ? `3px solid ${ACCENT}`
                          : 'none',
                        opacity: showState && !picked ? 0.9 : 1,
                        cursor: selectedOption ? 'default' : 'pointer',
                      }}
                      onClick={() => handlePick(opt)}
                      disabled={!!selectedOption}
                    >
                      <Latex>{`$${opt.option}$`}</Latex>
                    </Button>
                  </Col>
                );
              })}
            </Row>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button color="secondary" outline onClick={reset}>
                Try Again
              </Button>
            </div>


          {/* RIGHT: Feedback panel */}
         
        </Row>
      </div>
    </div>
  );
}
