'use client';
import { useEffect, useRef } from 'react';
import { MathfieldElement } from 'mathlive';

/*
`answer` part (fill in the blanks). The template is read-only LaTeX containing
MathLive prompts, e.g.  x = \placeholder[x]{}  ->  only the box is editable.
Response shape: { blanks: { [promptId]: latex } }
After marking, each box turns green (and locks) or red.
*/
export default function AnswerPart({ part, response, result, onChange, locked }) {
  const hostRef = useRef(null);
  const mfRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const mf = new MathfieldElement({ mathVirtualKeyboardPolicy: 'manual' });
    mf.value = part.template ?? '';
    mf.readOnly = true; // prompts stay editable in a read-only field
    Object.assign(mf.style, {
      display: 'block',
      width: '100%',
      padding: '0.5rem',
      fontSize: '1.25rem',
      border: '1px solid #ced4da',
      borderRadius: '4px',
      background: '#fff',
      boxSizing: 'border-box',
    });
    hostRef.current.appendChild(mf);
    mfRef.current = mf;

    // restore saved answers
    Object.entries(response?.blanks ?? {}).forEach(([id, latex]) => {
      if (latex) mf.setPromptValue(id, latex, {});
    });

    mf.addEventListener('input', () => {
      const blanks = {};
      mf.getPrompts().forEach((id) => {
        blanks[id] = mf.getPromptValue(id, 'latex');
        // clear a red box as soon as the student starts fixing it
        if (mf.getPromptState(id)[0] === 'incorrect') mf.setPromptState(id, undefined, false);
      });
      onChangeRef.current({ blanks });
    });

    return () => mf.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // colour each box from the marking result
  useEffect(() => {
    const mf = mfRef.current;
    const states = result?.details?.blanks;
    if (!mf || !states) return;
    mf.getPrompts().forEach((id) => {
      if (!(id in states)) return;
      mf.setPromptState(id, states[id] ? 'correct' : 'incorrect', states[id] || locked);
    });
  }, [result, locked]);

  return <div ref={hostRef} />;
}
