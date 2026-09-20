'use client'
import { useState, useEffect } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import BlockRenderer from '../../learn/lessons/BlockRenderer';
import { useQuestionStore } from '@/lib/zustand/providers/question-state-provider';

export default function QuestionSolutionPane({ solution , markScheme}) {
  const { updateProgress } = useQuestionStore();
  const attempts = useQuestionStore((state) => state.userProgress.attempts);
  const status = useQuestionStore((state) => state.userProgress.status);

  // Local state for reveal
  const [showSolution, setShowSolution] = useState(status === 'complete');

  // Compute remaining attempts
  const triesRemaining = Math.max(0, 3 - attempts);

  useEffect(() => {
    // Show solution automatically if status is complete
    if (status === 'complete') {
      setShowSolution(true);
    }
  }, [status]);

  const handleReveal = () => {
    setShowSolution(true);
    updateProgress({ status: 'complete' });
  };

  

  return (
    <div
      style={{
        position: 'relative',
        padding: '1.5rem',
        height: '80vh',
        background: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: '1rem auto',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '1rem',
          textDecoration: 'underline',
          fontWeight: 'bold',
          color: '#17a2b8',
        }}
      >
        Model Solution
      </h1>

      {/* Overlay card when solution is hidden */}
      {!showSolution && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '400px',
            zIndex: 10,
          }}
        >
          <Card>
            <CardBody className="text-center">
              {attempts < 3 ? (
                <>
                  <h5 className="mb-3">Keep Going!</h5>
                  <p>
                    Complete <strong>{triesRemaining}</strong> more attempt
                    {triesRemaining !== 1 ? 's' : ''} before revealing the solution.
                  </p>
                  <Button color="primary" disabled>
                    Attempts Left: {triesRemaining}
                  </Button>
                </>
              ) : (
                <>
                  <h5 className="mb-3">Ready to Reveal?</h5>
                  <p>
                    We recommend trying your hardest before looking at a solution.
                    If you&apos;re happy with your effort, reveal it now.
                  </p>
                  <Button color="primary" onClick={handleReveal}>
                    Reveal Solution
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Blurred solution underneath overlay */}
      <div
        style={{
          position: 'relative',
          filter: showSolution ? 'none' : 'blur(6px)',
          pointerEvents: showSolution ? 'auto' : 'none',
          transition: 'filter 0.3s ease',
          zIndex: 1,
        }}
      >
        {solution.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}

        <h1
        style={{
          textAlign: 'center',
          marginBottom: '1rem',
          textDecoration: 'underline',
          fontWeight: 'bold',

        }}
      >
        Mark Scheme
      </h1>
        {markScheme.map((block,i) => (
            <BlockRenderer key={i} block={block}/>
        ) )}
      </div>
    </div>
  );
}
