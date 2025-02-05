// /lib/components/learn/lessons/LessonMathDisplay.jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';
import { Button } from 'reactstrap';

export default function LessonEditorDisplay({ part, onSubmitTask, taskState }) {
  const mathfieldRef = useRef(null);
  const mfe = useRef(new MathfieldElement());
  const [latex, setLatex] = useState('');

  useEffect(() => {
    if (mathfieldRef.current && !mathfieldRef.current.contains(mfe.current)) {
      mfe.current.style.width = '100%';
      mfe.current.style.height = '100%';
      mfe.current.style.backgroundColor = 'lightblue';
      mfe.current.mathModeSpace = '\\,';
      mfe.current.mathVirtualKeyboardMode = 'manual';
     

      mfe.current.addEventListener('input', () => {
        const latexValue = mfe.current.getValue();
        setLatex(latexValue);
        console.log('LaTeX Output:', latexValue);
      });

      mathfieldRef.current.appendChild(mfe.current);
      mfe.current.addEventListener('input', function (event) {
        if (event.inputType === 'insertLineBreak') {
          mfe.current.executeCommand('addRowAfter');
          event.preventDefault();
        }
      })
    }
  }, []);

  // Reset mathfield if part changes
  useEffect(() => {
    if (mfe.current) {
      mfe.current.setValue(part.latex || '');
      setLatex(part.latex || '');
    }
  }, [part]);

  // We'll find the first task with status !== 'correct' or 'locked' 
  // Actually simpler: find the first 'unlocked' or 'incorrect' if you want them to re-try
  function getActiveTaskIndex() {
   
    const tasks = part.blocks.filter(b => b.type === 'task');
    
    // Find first that is 'unlocked' or 'incorrect' 
    // (meaning they can keep trying if they got it wrong)
    return tasks.findIndex((t, idx) => {
      const st = taskState[idx]?.status;
      return st === 'unlocked' || st === 'incorrect';
    });
  }

  function handleSubmit() {
    // The user is answering the "active" task
    const activeIndex = getActiveTaskIndex();
    if (activeIndex === -1) {
      alert("No task currently unlocked. Maybe you're done!");
      return;
    }
    const userLatex = mfe.current.getValue();

    // Call parent callback ->This gets the latex, and index and calls fastapi webserver to mark it 
    onSubmitTask(activeIndex, userLatex);
  }

  return (
    <>
      <div style={{ width: '100%', height: '100%' }} ref={mathfieldRef} />
      <Button
        block
        outline
        color='primary'
        style={{ margin: '0.5rem' }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </>
  );
}
