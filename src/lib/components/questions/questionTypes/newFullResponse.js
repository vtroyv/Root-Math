'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';
import 'katex/dist/katex.min.css';
import ComputeEngineConfig from '@/lib/utils/ceConfig';
import NextQuestions from '../other-question-components/NextQuestions';
import { useDrawerStore } from '@/lib/zustand/providers/question-drawer-state-provider';
import {
  Button,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Card,
  CardBody,
  CardText,
  Badge,
  ListGroup, ListGroupItem,
  Table,
} from 'reactstrap';
import {
  useGradeQuestionMutation, 
  useGetQuestionsQuery
} from '@/lib/redux/slices/apiSlice';
import { useUser } from '@clerk/nextjs';
import { useQuestionStore } from '@/lib/zustand/providers/question-state-provider';

import preprocessLatex from '@/lib/utils/preprocess-latex';
import { useUpdateQuestionProgressMutation } from '@/lib/redux/slices/apiSlice';
import { useRouter } from "next/navigation";


export default function NewFullResponse({ question }) {

  /*

1) Whenever i submit a question , i need to update the userProgress object in the database  ✅ 

2) I need to create something that looks for a currentLatex Field and if it exists when we read the current userProgress, to set the latex to that! ✅

3) whenever i recieve the feedback i also need to recieve back from that api a status update, to use to also update the object!!! ✅

4)  Although not directly relevant to this component , I need to start to get GPT to build concise findings on the students work, 
    to enable me to build up a profile of that students strengths and weaknesses + improve the feedback response so it's less ❌

5) When i click reveal solution on Solution Pane, without the userProgress Status being 'Complete' I need to set it to 'complete' and 
   change the latex to a correct solution! ❌ (honestly not fully necessary- perhaps having the user copy the solution out wouldn't be bad!)

6) Add a reset button to reset the user Progress for this problem. 
   - This should still store previous feedback on the backend for my own usecase- but reset it from a users perspective. ❌

6.5) Add a next button ✅

7) Whenever a solution is deemed correct prevent the latex from being edited anymore, 
   and display a green alert  saying this is correct click 'next' to move on to the next question. ❌

7.5) autmatically reveal comment and solution panels, when a userProgress status deems solution as correct! ✅ 

8) The next button should open side modal with a list of problems that are relevant, and enable to user to 
   switch to the next problem ❌

9) Once all these things are done, the question my topic/question display page will be complete, 
   for fullResponse type questions. Although you will need to continue improving the following: 
  
   - The flexibility of my sympy compiler! ❌
   - In cases where we get compiliation errors - bypassing it and calling the llm directly, or getting the llm to fix the issue❌
   - Having the hint button open the AskTutor component which should beable to read the currentLatex and provide assistancen❌
   - Having a maximum amount of hints per problem!❌

   -Fix the notes component and hook it up to a DB ❌
  
   -Fix the comment section, and enable it to be real time i.e. websockets/sockets.io maybe or maybe not + 
    also hide comment section until at least 3 attempts have been made, with also a message being displayed like 'comments' 
    can be distracting 'reveal' but have it automatically revealed when the solution is correct. ❌



    - PLEASE EXTRACT THE NEXT COMPONENT 


  */
  const problems = [
    { id: 1, title: 'Sketch-the-Quadratic-I', topic: 'Algebra' }, // you'll need to store in DB similar like to this and then perhaps have some function that formats e.g. removes dashes
    { id: 2, title: 'Integration by Parts', topic: 'Calculus' },
    { id: 3, title: 'Matrix Multiplication', topic: 'Linear Algebra' },
     { id: 4, title: 'Quadratic Equations', topic: 'Algebra' },
    { id: 5, title: 'Integration by Parts', topic: 'Calculus' },
    { id: 6, title: 'Matrix Multiplication', topic: 'Linear Algebra' },
     { id: 7, title: 'Quadratic Equations', topic: 'Algebra' },
    { id: 8, title: 'Integration by Parts', topic: 'Calculus' },
    { id: 9, title: 'Matrix Multiplication', topic: 'Linear Algebra' },
     { id: 10, title: 'Quadratic Equations', topic: 'Algebra' },
    { id: 11, title: 'Integration by Parts', topic: 'Calculus' },
    { id: 12, title: 'Matrix Multiplication', topic: 'Linear Algebra' },
     { id: 13, title: 'Quadratic Equations', topic: 'Algebra' },
    { id: 14, title: 'Integration by Parts', topic: 'Calculus' },
    { id: 15, title: 'Matrix Multiplication', topic: 'Linear Algebra' },
,
  ];
  
  const questionRef  = useRef(null);
  const mathfieldRef = useRef(null);
  const mfe          = useRef(null);
  const questionView = useRef(null);
  const ceRef = useRef(null);
  const { updateProgress} = useQuestionStore();
  const progress = useQuestionStore(state => state.userProgress)// note this pattern of selecting what state you listen to enables you to listen to just parts of
  const [gradeQuestion, mutationStateA] = useGradeQuestionMutation();
  const [updateUserProgress, mutationStateB] = useUpdateQuestionProgressMutation();

  const {user} = useUser();

    const openDrawer = useDrawerStore(s => s.open)

  console.log('THe globalstate is ', progress)
  const router = useRouter()
   const selectNext = ({title}) => {
    const next = problems.find(p => p.title === title)
    router.push(`/learn/questions/${next?.title ?? 'fallback-slug'}`)
    //now build this fallback slug component at some point lol
  }
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

    //check if there is any userLatex in the current progress object and if so set the latex as it

    mfe.current.setValue(progress?.userLatex || '') 

     

    mfe.current.addEventListener("input", (event) => {
  // 1) grab the up-to-date LaTeX
  const liveLatex = mfe.current.value;   
  updateProgress({ userLatex: liveLatex})          // or mfe.current.getValue()
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

      //#-----------------------------------------------------
      // Now I need to update this so that it returns the feedback, and then
      // aswell as the status
      const resp = await gradeQuestion(dataForFeedback).unwrap();
      console.log('the--TEST response is ', resp)
      const feedback = resp?.data?.feedback
      const isCorrect = resp?.data?.status
      const status = isCorrect ? 'complete': 'incomplete'


      //Once i get the status and feedback back, i need to update 
      //#--------------------------------------------------
      const newProgress = {
  ...progress,
  feedback: [...progress.feedback, feedback],
  attempts: progress.attempts + 1,
  status: status
};
      updateProgress(newProgress);

      //Now i need to call something that updates this state from mongoDB, and also displays the typed students work, 

      console.log('THe feedback returned from the server is ', resp?.data?.feedback )
      
      const {id, unsafeMetadata} = user;
      const {examBoard} = unsafeMetadata
      
      const collectionIdentifier = {
        id, 
        examBoard, 
        title, 
        branch: question.branch, 
        year: question.year
      }

      const data = {
        collectionIdentifier, 
        progress: newProgress
      }
      const updatedStatus = await updateUserProgress(data)

      console.log('The updated Status is ', updatedStatus)




      
      
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
        <div
        style={{'display':"flex", flexDirection:'row', gap :'5px'}}>
            <Button
        style={{marginTop:'1rem', alignSelf:'center', maxWidth:"10%"}}
        color='secondary'
        outline
        block
        >
          Hint
        </Button>
            <Button
        style={{marginTop:'1rem', alignSelf:'center', maxWidth:"10%"}}
        color='secondary'
        outline
        block
        >
          Save
        </Button>
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
      
       
            <Button
        style={{marginTop:'1rem', alignSelf:'center', maxWidth:"10%"}}
        color='secondary'
        outline
        block
        >
          Reset
        </Button>
             <Button
        style={{marginTop:'1rem', alignSelf:'center', maxWidth:"10%"}}
        color='secondary'
        outline
        block
        onClick={openDrawer}
        >
          Next
        </Button>
        </div>
      </div>
<NextQuestions problems={problems}  onSelect={selectNext}/>

    </div>
  );
}


