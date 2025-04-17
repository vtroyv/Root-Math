'use client';
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { MathfieldElement } from 'mathlive';
import { Alert } from 'reactstrap';
import { useLessonStore } from '@/lib/zustand/providers/lesson-state-provider';

const SingleMfe = forwardRef(({ part, noTasks , task}, ref) => {

  
  
  const mathfieldRef = useRef(null);
  const mfe = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [latex, setLatex] = useState(part.latex || '');

  const height = noTasks ? '100%' : null;

  const updateTaskState = useLessonStore((state) => state.updateTaskState);

  // Keep a reference to the last valid LaTeX value and protected segments.
  const lastValidLatexRef = useRef('');
  const protectedSegmentsRef = useRef([]);

  useEffect(() => {
    if (part.latex) {
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

      mfe.current.style.width = '100%';
      mfe.current.style.height =  '100%';
      mfe.current.style.backgroundColor = 'lightblue';

      mfe.current.addEventListener('input', function (event) {
        if (event.inputType === 'insertLineBreak') {
          mfe.current.executeCommand('addRowAfter');
          event.preventDefault();
        }
      });


      // Listen for input events.
      mfe.current.addEventListener('input', () => {
        updateTaskState({title: task.title, latex: mfe.current.getValue()}) //check how efficient this is and if it impacts performance at all
        const newLatex = mfe.current.getValue();
        let valid = true;
        for (const seg of protectedSegmentsRef.current) {
          if (!newLatex.includes(seg)) {
            valid = false;
            break;
          }
        }
        if (!valid) {
          setAlertVisible(true);
          mfe.current.setValue(lastValidLatexRef.current);
          setTimeout(() => {
            setAlertVisible(false);
          }, 3000);
          return;
        }
        lastValidLatexRef.current = newLatex;
        setLatex(newLatex);
        


      });

      if (mathfieldRef.current && !mathfieldRef.current.contains(mfe.current)) {
        mathfieldRef.current.appendChild(mfe.current);
      }
    }
  }, []);

  // When part.latex changes, update the field—but do not trigger a parent update.
  useEffect(() => {
    if (mfe.current) {
      mfe.current.setValue(part.latex || '');
      lastValidLatexRef.current = part.latex || '';
      setLatex(part.latex || '');
    }
  }, [part.latex]);



  // Expose a getValue method so the parent can read the mathfield value.
  useImperativeHandle(ref, () => ({
    getValue: () => (mfe.current ? mfe.current.getValue() : '')
  }));

  return (
    <>
      {alertVisible && (
        <Alert color="danger">
          This part of the question cannot be edited.
        </Alert>
      )}
      <div style={{ width: '100%', height: height  ,marginTop:"0.5rem",marginBottom:'0.5rem' }} ref={mathfieldRef} />
    </>
  );
});

SingleMfe.displayName = "SingleMfe";

export default SingleMfe;
