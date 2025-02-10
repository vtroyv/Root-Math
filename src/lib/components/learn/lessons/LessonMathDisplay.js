// /lib/components/learn/lessons/LessonMathDisplay.jsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';
import { Button, Alert } from 'reactstrap';
import preprocessLatex from '@/lib/utils/preprocess-latex';
import ComputeEngineConfig from '@/lib/utils/ceConfig';

export default function LessonEditorDisplay({ part, onSubmitTask, taskState }) {
  const mathfieldRef = useRef(null);
  const mfe = useRef(null);
  const [latex, setLatex] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
     const tasksList = part.blocks.filter(b=>b.type === 'task')
    console.log('The tasks are ', tasksList)

  // Keep a reference to the last valid LaTeX value.
  const lastValidLatexRef = useRef('');
  // Store all protected segments (the full \text{…} commands) from the original LaTeX.
  const protectedSegmentsRef = useRef([]);

  //ComputeEnging Ref
  const ceRef = useRef(null)
  // When the part changes, extract the protected segments from its LaTeX.
  useEffect(() => {
    if (part.latex) {
      // This regex finds all instances of \text{…}
      const segments = part.latex.match(/\\text\{[^}]*\}/g) || [];
      protectedSegmentsRef.current = segments;
      lastValidLatexRef.current = part.latex;
    }
  }, [part.latex]);

 //Set up mathfield element 
  useEffect(() => {
    if (!mfe.current) {
      mfe.current = new MathfieldElement({
        mathModeSpace: '\\,',
        mathVirtualKeyboardMode: 'manual',
      });

      // Style the mathfield.
      mfe.current.style.width = '100%';
      mfe.current.style.height = '100%';
      mfe.current.style.backgroundColor = 'lightblue';

      // Listen for input events to validate the LaTeX.
      mfe.current.addEventListener('input', (event) => {
        const newLatex = mfe.current.getValue();

        // Validate that every protected segment is still present.
        let valid = true;
        for (const seg of protectedSegmentsRef.current) {
          if (!newLatex.includes(seg)) {
            valid = false;
            break;
          }
        }

        if (!valid) {
          // If a protected segment was altered, show an alert and revert the change.
          setAlertVisible(true);
          mfe.current.setValue(lastValidLatexRef.current);

          // Hide the alert after 3 seconds.
          setTimeout(() => {
            setAlertVisible(false);
          }, 3000);

          // Stop processing this input.
          return;
        }

        // If valid, update the last valid state and the component's state.
        lastValidLatexRef.current = newLatex;
        setLatex(newLatex);
        console.log('LaTeX Output:', newLatex);
      });

      // Optional: intercept Enter (line break) to execute a custom command.
      mfe.current.addEventListener('input', (event) => {
        if (event.inputType === 'insertLineBreak') {
          mfe.current.executeCommand('addRowAfter');
          event.preventDefault();
        }
      });

      // Append the mathfield element to our container.
      if (mathfieldRef.current && !mathfieldRef.current.contains(mfe.current)) {
        mathfieldRef.current.appendChild(mfe.current);
      }
    }
  }, []);

  // Reset the mathfield whenever the part changes.
  useEffect(() => {
    if (mfe.current) {
      mfe.current.setValue(part.latex || '');
      lastValidLatexRef.current = part.latex || '';
      setLatex(part.latex || '');
    }
  }, [part]);

  //Set up Compute engine for compiling to sympy
  useEffect(()=> {
    if (part) {
      const ceConfig = new ComputeEngineConfig()
      const ce = ceConfig.getEngine();
      if(ceRef.current) {
        ceRef.current.ce = ce
       
      } else{
        ceRef.current={ce}
      }
    }

  },[part])

  // Determine which task is active.
  function getActiveTaskIndex() {
    const tasks = part.blocks.filter(b => b.type === 'task');
    
    // Find the first task that is 'unlocked' or 'incorrect'.
    return tasks.findIndex((t, idx) => {
      const st = taskState[idx]?.status;
      return st === 'unlocked' || st === 'incorrect';
    });
  }

  /**
 * Extracts the subarray of strings for the current task based on activeIndex.
 *
 * @param {Array<string>} compiledStrings - The array of compiled strings (questions and answers).
 * @param {number} activeIndex - The current task index (0-based).
 * @returns {Array<string>} - The subarray containing the question and its corresponding answer lines.
 */
function getTaskStrings(compiledStrings, activeIndex) {
  // Array to hold groups of lines for each question.
  const groups = [];
  let currentGroup = [];

  // Regex to detect the start of a new question.
  // Matches an optional starting quote, then one or more digits followed by a closing parenthesis.
  const questionRegex = /^["']?\d+\)/;

  // Loop through each line in the compiledStrings array.
  compiledStrings.forEach((line) => {
    // If the line starts with a question number (e.g., "1)", "2)", etc.)
    if (questionRegex.test(line)) {
      // If there is an existing group (from the previous question), add it to groups.
      if (currentGroup.length) {
        groups.push(currentGroup);
      }
      // Start a new group with the current line (the question prompt).
      currentGroup = [line];
    } else {
      // Otherwise, this line is part of the current question's answer/working.
      currentGroup.push(line);
    }
  });

  // Add the final group (if any) to groups.
  if (currentGroup.length) {
    groups.push(currentGroup);
  }

  // Return the group corresponding to the active task.
  // If the activeIndex is out of range, return an empty array.
  return groups[activeIndex] || [];
}


  // Called when the user clicks the Submit button.
  function handleSubmit() {
    const activeIndex = getActiveTaskIndex();
    console.log('activeIndex is ', activeIndex)
    
    if (activeIndex === -1) {
      alert("No task currently unlocked. Maybe you're done!");
      return;
    }

 
    //Convert users work to sympy before sending to server 
    
    const userLatex = mfe.current.getValue();
    console.log('The original userLatex is given by', userLatex)
    const preprocessedArray = preprocessLatex(userLatex);
    console.log('testing what ? is ', ceRef.current.ce.parse('?'))
    console.log('The preprocessed latex is given by ', preprocessedArray)

 
    // parse the latex into boxed expressions
    const boxedExpressionArray = preprocessedArray.map((item) => 
    ceRef.current.ce.parse(item)
    );

    console.log('The boxedExpression Aray is given by ', boxedExpressionArray)

    //compile expressions to sympy
    const compiled = boxedExpressionArray.map((bE) => bE.compile('sympy'));
    console.log('The compiled array is ', compiled)
    const compiledStrings = compiled.map((fn) => fn.toString());
    console.log('The compiled strings are ', compiledStrings)
    const taskStrings = getTaskStrings(compiledStrings, activeIndex)
    console.log('The task strings are', taskStrings)

    
    

  

    //You'll probably need to change the type in which fastapi expects to recieve the userLatex, 
    //before sending it to avoid breakage. 


    onSubmitTask(activeIndex, taskStrings);
  }

  return (
    <>
      {/* Show the alert if a protected section was edited */}
      {alertVisible && (
        <Alert color="danger">
          The questions cannot be edited.
        </Alert>
      )}
      <div style={{ width: '100%', height: '100%' }} ref={mathfieldRef} />
      <Button
        block
        outline
        color="primary"
        style={{ margin: '0.5rem' }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </>
  );
}
