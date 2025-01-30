'use client';
import { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';

export default function LessonEditorDisplay({ part }) {
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
    }
  }, []);

  // Reset Mathfield value when part changes
  useEffect(() => {
    if (mfe.current) {
      mfe.current.setValue(part.latex || ''); // Reset to new part's latex or clear if none
    }
  }, [part]); // Runs every time "part" updates

  return <div style={{ width: '100%', height: '100%' }} ref={mathfieldRef} />;
}
