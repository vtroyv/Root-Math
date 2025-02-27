'use client';
import React from 'react';
import SingleMfe from './taskTypes/singleMfe';
import CurveSketch from './taskTypes/curveSketch';

export default function TaskRenderer({ part, taskState }) {
  // If no part exists, render a fallback SingleMfe with empty LaTeX.
  if (!part) {
    return <SingleMfe part={{ latex: '' }} />;
  }
  
  const tasksList = part.blocks.filter(b => b.type === 'task');

  // If there are no tasks, render a SingleMfe with empty LaTeX.
  if (!tasksList || tasksList.length === 0) {
    return <SingleMfe part={{ latex: '' }} />;
  }

  // Check if any task has a renderType.
  const tasksWithRenderType = tasksList.filter(task => task.renderType);
  
  // If none have a renderType, render a single SingleMfe (using the part's LaTeX).
  if (tasksWithRenderType.length === 0) {
    return <SingleMfe part={part} />;
  }

  // Otherwise, render each task using a switch statement.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {tasksList.map((task, idx) => {
        switch (task.renderType) {
          case 'sketch':
            return (
              <CurveSketch
                key={idx}
                question={task}
                // If needed, you can pass an onDataChange callback here.
                onDataChange={(data) => {/* handle data for task idx */}}
              />
            );
          // Add additional cases for other renderTypes if needed.
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
