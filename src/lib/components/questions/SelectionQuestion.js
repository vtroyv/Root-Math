'use client';
import { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';
import { Button } from 'reactstrap';

/**
 * For multiple-choice questions:
 * - Displays question.latex in a read-only Mathfield
 * - Shows each option as a button
 * - Gives immediate feedback if correct or incorrect
 */
export default function SelectionQuestion({ question }) {
  const questionView = useRef(new MathfieldElement());
  const questionRef = useRef(null);

  // For feedback messages
  const [feedback, setFeedback] = useState('');

  // Read-only Mathfield for the question prompt
  useEffect(() => {
    if (question?.latex) {
      questionView.current.value = String.raw`${question.latex}`;
      questionView.current.readOnly = true;
      questionView.current.style.margin = '1%';
      questionView.current.style.fontWeight = 'bold';
      questionView.current.style.fontSize = '20px';

      if (questionRef.current && !questionRef.current.contains(questionView.current)) {
        questionRef.current.appendChild(questionView.current);
      }
    }
  }, [question]);

  // On click of an option
  const handleOptionClick = (option) => {
    if (option.isCorrect) {
      setFeedback('Well done, that is correct!');
    } else {
      setFeedback('Incorrect, try again!');
    }
  };

  return (
    <div>
      <h2>{question.title}</h2>
      <div ref={questionRef} />

      {/* Render the multiple-choice options */}
      <div style={{ marginTop: '1rem' }}>
        {question.options?.map((option, idx) => {
          // Some data may have an empty object for an option, so skip
          if (!option.option) return null;

          return (
            <div key={idx} style={{ margin: '0.5rem 0' }}>
              <Button color="info" outline onClick={() => handleOptionClick(option)}>
                {option.option}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Feedback display */}
      {feedback && (
        <div style={{ marginTop: '1rem' }}>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}
