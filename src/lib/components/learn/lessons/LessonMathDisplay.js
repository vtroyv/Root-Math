'use client';
import React, { useState, useEffect, useRef } from 'react';
import TaskRenderer from './TaskRenderer';
import SingleMfe from './taskTypes/singleMfe';
import { Button, Alert } from 'reactstrap';
import preprocessLatex from '@/lib/utils/preprocess-latex';
import ComputeEngineConfig from '@/lib/utils/ceConfig';

export default function LessonMathDisplay({ part, onSubmitTask, taskState }) {
  // We'll use a ref if we are rendering a single SingleMfe.
  const singleMfeRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const ceRef = useRef(null);

  useEffect(() => {
    if (part) {
      const ceConfig = new ComputeEngineConfig();
      const ce = ceConfig.getEngine();
      ceRef.current = { ce };
    }
  }, [part]);

  // Determine active task index from taskState.
  function getActiveTaskIndex() {
    const tasks = part.blocks.filter(b => b.type === 'task');
    return tasks.findIndex((t, idx) => {
      const st = taskState[idx]?.status;
      return st === 'unlocked' || st === 'incorrect';
    });
  }

  function getTaskStrings(compiledStrings, activeIndex) {
    const groups = [];
    let currentGroup = [];
    const questionRegex = /^["']?\d+\)/;
    compiledStrings.forEach((line) => {
      if (questionRegex.test(line)) {
        if (currentGroup.length) {
          groups.push(currentGroup);
        }
        currentGroup = [line];
      } else {
        currentGroup.push(line);
      }
    });
    if (currentGroup.length) {
      groups.push(currentGroup);
    }
    return groups[activeIndex] || [];
  }

  function handleSubmit() {
    const activeIndex = getActiveTaskIndex();
    if (activeIndex === -1) {
      alert("No task currently unlocked. Maybe you're done!");
      return;
    }
    // When no task has a renderType, we use our SingleMfe ref.
    const userLatex = singleMfeRef.current ? singleMfeRef.current.getValue() : "";
    const preprocessedArray = preprocessLatex(userLatex);
    const boxedExpressionArray = preprocessedArray.map(item =>
      ceRef.current.ce.parse(item)
    );
    const compiled = boxedExpressionArray.map(bE => bE.compile('sympy'));
    const compiledStrings = compiled.map(fn => fn.toString());
    const taskStrings = getTaskStrings(compiledStrings, activeIndex);
    console.log('The taskStrings are ', taskStrings)
    onSubmitTask(activeIndex, taskStrings, userLatex);
  }

  // Decide which renderer to use:
  const tasksList = part?.blocks?.filter(b => b.type === 'task') || [];
  const tasksWithRenderType = tasksList.filter(task => task.renderType);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {tasksWithRenderType.length === 0 ? (
        // Render a single SingleMfe with ref if no task has a renderType.
        <SingleMfe ref={singleMfeRef} part={part} />
      ) : (
        // Otherwise, render TaskRenderer to handle multiple tasks.
        <TaskRenderer part={part} taskState={taskState} />
      )}

      <Button
        block
        outline
        color="primary"
        style={{ marginTop: '0.5rem' }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </div>
  );
}



/*
I need to add to this massively - modify the way this component works, essentailly i need to support different types of tasks,
 e.g. some tasks will require images, some tasks will require sketches, multiple choices etc, and frequently,
 you may need to compare tasks of different types in the same lesson part.
 So what you'll need to do is essentially add types to tasks, and then make sure the mathLessonDisplay component renders the tasks acordingly,
  for instance if non of the tasks have a special type field keep things the same otherwise start putting in components and rendering it neabling horizontal scroll!

  The relevant task types will  be in teh taskTypes folder in the component directory

  make sure for the relevant task (in the case where there are more than one type of task in a lesson part, or multiple sketches etc), that you make a light border/shadow for the current task being completed or current incorrect task etc.
*/