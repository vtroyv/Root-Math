'use client';
import React from 'react';
import SingleMfe from './taskTypes/singleMfe';
import CurveSketch from './taskTypes/curveSketch';
import QuestionImage from './taskTypes/questionWithImage';
import CurveAndMfe from './taskTypes/curveAndMfe';
import MultipleChoiceTask from './taskTypes/multipleChoice';
import MultipleChoiceImagesTask from './taskTypes/multipleChoiceImage';

export default function TaskRenderer({ part, taskState }) {
  // If no part exists, render a fallback SingleMfe with empty LaTeX.
  console.log('This function is being called!')
  if (!part) {
    return <SingleMfe part={{ latex: '' }} />;
  }
  
  const tasksList = part.blocks.filter(b => b.type === 'task');
  console.log('The tasksList is:', tasksList)

  // If there are no tasks, render a SingleMfe with empty LaTeX.
  if (!tasksList || tasksList.length === 0) {
    console.log('Were in this if sttement')
    return <SingleMfe part={{ latex: '' }} noTasks={true} />;
  }

  // Check if any task has a renderType.
  const tasksWithRenderType = tasksList.filter(task => task.renderType);
  
  // If none have a renderType, render a single SingleMfe (using the part's LaTeX).
  if (tasksWithRenderType.length === 0) {
    console.log('were here')
    return <SingleMfe part={part} noTasks={true}/>;
  }

  // Otherwise, render each task using a switch statement.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', }}>
      {tasksList.map((task, idx) => {
        switch (task.renderType) {
          case 'sketch':
            return (
              <CurveSketch
                key={idx}
                task={task}
                // If needed, you can pass an onDataChange callback here.
                onDataChange={(data) => {/* handle data for task idx */}}
              />
            );
          // Add additional cases for other renderTypes if needed.
          case 'image':
            console.log('the image case was selected')
          return(
            <QuestionImage
              key={idx}
              url={task.url}
              alt={task.alt}
              caption={task.caption}
              part={{
                ...part,
                latex: task.latex || part.latex,
              }}
              task={task}
              mfeHeight=''
            />
          )
          case 'curveAndMfe':
            return (
              <CurveAndMfe
                key={idx}
                task={task}
                part={{
                  ...part,
                  latex: task.latex || part.latex,
                }}
                onDataChange={(data) => 'handle data for task idx'}
              />
            );
          case 'multipleChoice':
            return (
              <MultipleChoiceTask
                key={idx}
                question={task.question}
                choices={task.choices}
                task={task}
                onChange={(value) => 'handle value for task idx'}
              />
            );

          case 'multipleChoiceImages':
            return (
              <MultipleChoiceImagesTask
                key={idx}
                task={task}
                imageChoices={task.imageChoices || []} 
                />
            )
  

            
            
          default:
            return (
              <SingleMfe
                key={idx}
                part={{
                  ...part,
                  latex: task.latex || part.latex,
                }}
              />
            );
        }
      })}
    </div> 
  );
}
