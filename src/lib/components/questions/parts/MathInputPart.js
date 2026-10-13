'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'reactstrap';
import { MathfieldElement } from 'mathlive';

/*
`working` and `explain` parts: a multi-line MathLive field marked by the LLM.
`explain` starts in text mode; the Text mode button switches between text and maths.
`fill` = this is the only part, so the field grows to fill the pane (like the old fullResponse).
`toolbar` = extra buttons from PartRenderer (the Hint button), shown beside Text mode.
Response shape: { latex }
*/
export default function MathInputPart({ part, response, onChange, locked, fill, toolbar }) {
  const hostRef = useRef(null);
  const mfRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [textMode, setTextMode] = useState(part.type === 'explain');

  useEffect(() => {
    const mf = new MathfieldElement({
      mathModeSpace: '\\,',
      mathVirtualKeyboardPolicy: 'manual',
    });
    if (part.type === 'explain') mf.defaultMode = 'text';
    mf.value = response?.latex ?? part.starter ?? '';
    mf.readOnly = locked;
    // same look as the original fullResponse answer box
    Object.assign(mf.style, {
      display: 'block',
      width: '100%',
      height: '100%',
      minHeight: fill ? '100%' : '12rem',
      backgroundColor: 'lightblue',
      padding: '0.5rem',
      borderRadius: '4px',
      boxSizing: 'border-box',
    });

    // Enter adds a new line of working instead of doing nothing
    mf.addEventListener('input', (ev) => {
      if (ev.inputType === 'insertLineBreak') mf.executeCommand('addRowAfter');
      onChangeRef.current({ latex: mf.value });
    });

    // clicking empty space inside the field otherwise leaves the caret somewhere invalid
    mf.addEventListener('pointerdown', (ev) => {
      if (mf.readOnly) return;
      ev.preventDefault();
      mf.focus();
      const offset = mf.getOffsetFromPoint(ev.clientX, ev.clientY);
      if (offset != null && offset >= 0) mf.position = offset;
    });

    hostRef.current.appendChild(mf);
    mfRef.current = mf;
    return () => mf.remove();
    // created once per mount; QuestionParts remounts parts on Reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mfRef.current) mfRef.current.readOnly = locked;
  }, [locked]);

  const toggleMode = () => {
    const next = !textMode;
    setTextMode(next);
    const mf = mfRef.current;
    if (!mf) return;
    mf.mode = next ? 'text' : 'math';
    mf.focus();
  };

  return (
    <div style={fill ? { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } : undefined}>
      <div
        ref={hostRef}
        onClick={() => mfRef.current?.focus()}
        style={{ flex: fill ? 1 : undefined, minHeight: fill ? '12rem' : undefined, width: '100%', overflowY: 'auto' }}
      />
      {(!locked || toolbar) && (
        <div style={{ display: 'flex', gap: '5px', marginTop: '0.5rem' }}>
          {!locked && (
            <Button size="sm" color={textMode ? 'info' : 'secondary'} outline={!textMode} onClick={toggleMode} aria-pressed={textMode}>
              Text mode: {textMode ? 'on' : 'off'}
            </Button>
          )}
          {toolbar}
        </div>
      )}
    </div>
  );
}
