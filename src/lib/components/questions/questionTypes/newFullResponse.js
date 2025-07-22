'use client';

import React, { useEffect, useRef } from 'react';
import { MathfieldElement } from 'mathlive';
import 'katex/dist/katex.min.css';
import { Button } from 'reactstrap';

export default function NewFullResponse({ question }) {
  const questionRef  = useRef(null);
  const mathfieldRef = useRef(null);
  const mfe          = useRef(null);
  const questionView = useRef(null);

  useEffect(() => {
    if (!question) return;

    // ─── read-only question view ───────────────────────────────────
    if (!questionView.current) {
      questionView.current = new MathfieldElement();
    }
    const qv = questionView.current;
    qv.value    = String.raw`${question.latex}`;
    qv.readOnly = true;
    Object.assign(qv.style, {
      width:      '100%',
      margin:     '0.5rem 0',
      fontWeight: 'bold',
      fontSize:   '1.25rem',
      boxSizing:  'border-box',
    });
    if (questionRef.current && !questionRef.current.contains(qv)) {
      questionRef.current.appendChild(qv);
    }


    // ─── user-input mathfield ─────────────────────────────────────
    if (!mfe.current) {
      // Construct it *with* the options up-front, just like your working code
      mfe.current = new MathfieldElement({
        mathModeSpace: '\\,',                 // thin‐space on spacebar
        mathVirtualKeyboardPolicy: 'manual',  // disable auto virtual keyboard
      });

      const mf = mfe.current;
      Object.assign(mf.style, {
        display:         'block',
        width:           '100%',
        height:          '100%',
        backgroundColor: 'lightblue',
        padding:         '0.5rem',
        borderRadius:    '4px',
        boxSizing:       'border-box',
      });

  // Assume `mf = mfe.current`
if (mathfieldRef.current && !mathfieldRef.current.contains(mf)) {
  mathfieldRef.current.appendChild(mf);

  // Auto-focus on mount
  mf.focus();

  // Now, whenever the user clicks *anywhere* inside the field:
  mf.addEventListener('pointerdown', ev => {
    ev.preventDefault();            // Stop any default blur/selection behavior
    mf.focus();                     //  ensure the field has focus
    // figure out the offset closest to the click (viewport coords)
    const offset = mf.getOffsetFromPoint(ev.clientX, ev.clientY)  
    //  move the caret to that offset
    mf.position = offset;      
    // esentially what was happening whas when i click on a part of the mathfield element that didn't have text, 
    // it wouldn't put the caret into a valid insertion point which would cause keyboard events to be ignored i think                                
  });
}
//new lines
 mfe.current.addEventListener('input', function (event) {
      if (event.inputType === 'insertLineBreak') {
        mfe.current.executeCommand('addRowAfter');
        event.preventDefault();
      }
    });
    }
  }, [question]);

  // pretty-print title
  const title = question?.title || '';
  const formattedTitle = title.includes('-')
    ? title
        .split('-')
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join(' ')
    : title;

  return (
    <div
      style={{
        height:         '100%',
        width:          '100%',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          height:      '100%',
          width:       '100%',
          maxWidth:    '900px',
          display:     'flex',
          flexDirection:'column',
          padding:     '1rem',
          background:  '#fff',
          borderRadius:'8px',
          boxShadow:   '0 2px 8px rgba(0,0,0,0.1)',
          boxSizing:   'border-box',
        }}
      >
        <h1
          style={{
            color:       '#17a2b8',
            fontWeight:  'bold',
            textAlign:   'center',
            margin:      0,
            marginBottom:'1rem',
          }}
        >
          {formattedTitle}
        </h1>

        {/* question text */}
        <div ref={questionRef} style={{ width: '100%' }} />

        {/* mathfield input */}
        <div
          ref={mathfieldRef}
          onClick={() => mfe.current?.focus()}
          style={{
            flex:      1,
            width:     '100%',
            overflowY: 'auto',
            marginTop: '0.5rem',
          }}
        />

        {/* Submit button */}
        <Button
          style={{
            marginTop: '1rem',
            alignSelf: 'center',
            width:     '40%',
          }}
          color="info"
          outline
          block
          onClick={() => console.log('submitted')}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
