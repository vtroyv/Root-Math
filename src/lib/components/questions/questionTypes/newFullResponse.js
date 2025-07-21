'use client'

import React, {useEffect, useRef} from 'react'
import {MathfieldElement} from 'mathlive'
import 'katex/dist/katex.min.css'
import {Button} from 'reactstrap'

export default function NewFullResponse({question}) {
  const questionRef  = useRef(null)
  const mathfieldRef = useRef(null)
  const mfe           = useRef(new MathfieldElement())
  const questionView  = useRef(new MathfieldElement())

  // Whenever question changes, (re)append and style both Mathfields
  useEffect(() => {
    if (!question) return

    // ----- read‑only question view -----
    const qv = questionView.current
    qv.value    = String.raw`${question.latex}`
    qv.readOnly = true
    Object.assign(qv.style, {
      width:      '100%',
      
      margin:     '0.5rem 0',
      fontWeight: 'bold',
      fontSize:   '1.25rem',
      boxSizing:  'border-box',
    })
    if (!questionRef.current.contains(qv)) {
      questionRef.current.appendChild(qv)
    }

    // ----- user input mathfield -----
    const mf = mfe.current
    mf.mathModeSpace        = '\\,'
    mf.virtualKeyboardMode  = 'manual'
    Object.assign(mf.style, {
      display:  'block',
      width:    '100%',
      height:   '100%',
      backgroundColor: '#f9f9f9',
      padding:  '0.5rem',
      borderRadius: '4px',
      boxSizing: 'border-box',
    })
    if (mathfieldRef.current && !mathfieldRef.current.contains(mf)) {
      mathfieldRef.current.appendChild(mf)
    }
  }, [question])

  // pretty‐print title
  const title = question?.title || ''
  const formattedTitle = title.includes('-')
    ? title
        .split('-')
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join(' ')
    : title

  return (
    <div
      style={{
        height: '100%',   // fill the aside entirely
        width:  '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          height: '100%',  // also fill the parent
          width:  '100%',
          maxWidth: '900px',
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
            color:      '#17a2b8',
            fontWeight: 'bold',
            textAlign:  'center',
            margin:     0,
            marginBottom: '1rem',
          }}
        >
          {formattedTitle}
        </h1>

        {/* question text */}
        <div
          ref={questionRef}
          style={{ width: '100%' }}
        />

        {/* mathfield input */}
        <div
          ref={mathfieldRef}
          style={{
            flex:      1,
            width:     '100%',
            overflowY: 'auto',
            marginTop: '0.5rem',
          }}
        />

        {/* stays at bottom */}
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
  )
}
