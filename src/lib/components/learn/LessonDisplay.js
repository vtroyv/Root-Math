'use client';
import { useEffect, useRef } from 'react';
import { MathfieldElement } from 'mathlive';

export default function LessonDisplay() {
  const mathfieldRef = useRef(null);
  const mfe = useRef(new MathfieldElement());

  useEffect(() => {
    if (mathfieldRef.current && !mathfieldRef.current.contains(mfe.current)) {
      // Make the mathfield fill 100% of the parent container
      mfe.current.style.width = '100%';
      mfe.current.style.height = '100%';
      mfe.current.style.backgroundColor = 'lightblue';
      mathfieldRef.current.appendChild(mfe.current);
    }
  }, []);

  // Parent div also must fill its container
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
      ref={mathfieldRef}
    />
  );
}
