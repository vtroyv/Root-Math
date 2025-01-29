// /lib/components/learn/LessonDisplay.jsx
'use client';
import { useEffect, useRef } from 'react';
import { MathfieldElement } from 'mathlive';

export default function LessonEditorDisplay({ part }) {
  const mathfieldRef = useRef(null);
  const mfe = useRef(new MathfieldElement());

  useEffect(() => {
    if (mathfieldRef.current && !mathfieldRef.current.contains(mfe.current)) {
      mfe.current.style.width = '100%';
      mfe.current.style.height = '100%';
      mfe.current.style.backgroundColor = 'lightblue';
      mathfieldRef.current.appendChild(mfe.current);
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={mathfieldRef}>
      {/* Optionally display something about the current part:
          e.g., <p>Currently on {part.title}</p> 
      */}
    </div>
  );
}
