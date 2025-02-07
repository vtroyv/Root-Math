// /lib/components/learn/lessons/LessonMathDisplay.jsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';
import { Button, Alert } from 'reactstrap';

export default function LessonEditorDisplay({ part, onSubmitTask, taskState }) {
  const mathfieldRef = useRef(null);
  const mfe = useRef(null);
  const [latex, setLatex] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  // Keep a reference to the last valid LaTeX value.
  const lastValidLatexRef = useRef('');
  // Store all protected segments (the full \text{…} commands) from the original LaTeX.
  const protectedSegmentsRef = useRef([]);

  // When the part changes, extract the protected segments from its LaTeX.
  useEffect(() => {
    if (part.latex) {
      // This regex finds all instances of \text{…}
      const segments = part.latex.match(/\\text\{[^}]*\}/g) || [];
      protectedSegmentsRef.current = segments;
      lastValidLatexRef.current = part.latex;
    }
  }, [part.latex]);

  useEffect(() => {
    if (!mfe.current) {
      mfe.current = new MathfieldElement({
        mathModeSpace: '\\,',
        mathVirtualKeyboardMode: 'manual',
      });

      // Style the mathfield.
      mfe.current.style.width = '100%';
      mfe.current.style.height = '100%';
      mfe.current.style.backgroundColor = 'lightblue';

      // Listen for input events to validate the LaTeX.
      mfe.current.addEventListener('input', (event) => {
        const newLatex = mfe.current.getValue();

        // Validate that every protected segment is still present.
        let valid = true;
        for (const seg of protectedSegmentsRef.current) {
          if (!newLatex.includes(seg)) {
            valid = false;
            break;
          }
        }

        if (!valid) {
          // If a protected segment was altered, show an alert and revert the change.
          setAlertVisible(true);
          mfe.current.setValue(lastValidLatexRef.current);

          // Hide the alert after 3 seconds.
          setTimeout(() => {
            setAlertVisible(false);
          }, 3000);

          // Stop processing this input.
          return;
        }

        // If valid, update the last valid state and the component's state.
        lastValidLatexRef.current = newLatex;
        setLatex(newLatex);
        console.log('LaTeX Output:', newLatex);
      });

      // Optional: intercept Enter (line break) to execute a custom command.
      mfe.current.addEventListener('input', (event) => {
        if (event.inputType === 'insertLineBreak') {
          mfe.current.executeCommand('addRowAfter');
          event.preventDefault();
        }
      });

      // Append the mathfield element to our container.
      if (mathfieldRef.current && !mathfieldRef.current.contains(mfe.current)) {
        mathfieldRef.current.appendChild(mfe.current);
      }
    }
  }, []);

  // Reset the mathfield whenever the part changes.
  useEffect(() => {
    if (mfe.current) {
      mfe.current.setValue(part.latex || '');
      lastValidLatexRef.current = part.latex || '';
      setLatex(part.latex || '');
    }
  }, [part]);

  // Determine which task is active.
  function getActiveTaskIndex() {
    const tasks = part.blocks.filter(b => b.type === 'task');
    // Find the first task that is 'unlocked' or 'incorrect'.
    return tasks.findIndex((t, idx) => {
      const st = taskState[idx]?.status;
      return st === 'unlocked' || st === 'incorrect';
    });
  }

  // Called when the user clicks the Submit button.
  function handleSubmit() {
    const activeIndex = getActiveTaskIndex();
    if (activeIndex === -1) {
      alert("No task currently unlocked. Maybe you're done!");
      return;
    }
    const userLatex = mfe.current.getValue();
    onSubmitTask(activeIndex, userLatex);
  }

  return (
    <>
      {/* Show the alert if a protected section was edited */}
      {alertVisible && (
        <Alert color="danger">
          The questions cannot be edited.
        </Alert>
      )}
      <div style={{ width: '100%', height: '100%' }} ref={mathfieldRef} />
      <Button
        block
        outline
        color="primary"
        style={{ margin: '0.5rem' }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </>
  );
}
