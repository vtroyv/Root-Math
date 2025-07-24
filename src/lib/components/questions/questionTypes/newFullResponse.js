'use client';

import React, { useEffect, useRef } from 'react';
import { MathfieldElement } from 'mathlive';
import 'katex/dist/katex.min.css';
import ComputeEngineConfig from '@/lib/utils/ceConfig';
import { Button } from 'reactstrap';
import {
  useGradeQuestionMutation, 
  useGetQuestionsQuery
} from '@/lib/redux/slices/apiSlice';

import { useQuestionStore } from '@/lib/zustand/providers/question-state-provider';

import preprocessLatex from '@/lib/utils/preprocess-latex';

export default function NewFullResponse({ question }) {
  const questionRef  = useRef(null);
  const mathfieldRef = useRef(null);
  const mfe          = useRef(null);
  const questionView = useRef(null);
  const ceRef = useRef(null);
  const { updateProgress} = useQuestionStore();
  const progress = useQuestionStore(state => state.userProgress)// note this pattern of selecting what state you listen to enables you to listen to just parts of
  const [gradeQuestion, mutationState] = useGradeQuestionMutation();

  console.log('THe globalstate is ', progress)
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

     

    mfe.current.addEventListener("input", (event) => {
  // 1) grab the up-to-date LaTeX
  const liveLatex = mfe.current.value;   
  updateProgress({...progress, currentLatex: liveLatex})          // or mfe.current.getValue()
event.preventDefault();
    })

    }
  }, [question]);

  //set up compute engine 
  useEffect(()=> {
    if (question) {
      const ceConfig = new ComputeEngineConfig(question?.questionType); //don't think this serces any purpose right now
      const ce = ceConfig.getEngine();
      
      if (ceRef.current) {
        ceRef.current.ce = ce;

      } else {
        ceRef.current = {ce};
      }

    }
  }, [question])

  const handleSubmit = async () => {
    try {
      const latex = mfe.current.value;
      //basically on submit we need to create something that updates the value of the latex, 
      //next we also need to create functionality that reads the value of the latex when submitted and 
      //displays it first but then 

      const preprocessedArray = preprocessLatex(latex);
      console.log('The preprocessed latex is given by ', preprocessedArray)

      const boxedExpressionArray = preprocessedArray.map((item)=> ceRef.current.ce.parse(item));

      const compiled = boxedExpressionArray.map((bE) => bE.compile('sympy'));
      const compiledStrings = compiled.map((fn) => fn.toString());

      //build data for server to mark 
      const dataForFeedback = {
        questionData: question, 
        sympyResponse: compiledStrings
      }
      const resp = await gradeQuestion(dataForFeedback).unwrap();

      console.log('THe feedback returned from the server is ', resp?.data?.feedback )
      
    } catch (error) {
      console.log('Error when trying to access the route handler:', error)
    }
  }


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
          onClick={() => handleSubmit()}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
