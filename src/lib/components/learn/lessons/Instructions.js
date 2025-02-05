// /lib/components/learn/lessons/Instructions.jsx

'use client';
import { Button } from 'reactstrap';
import BlockRenderer from './BlockRenderer';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function Instructions({
  part,
  currentPartIndex,
  totalParts,
  onBack,
  onNext,
  taskState = [],
}) {
  if (!part) return <div>No instructions found.</div>;

  // We'll render tasks with the checkboxes in top-right
  // For non-task blocks, we just render them normally
  function renderBlockOrTask(block, i) {
    if (block.type === 'task') {
      // find matching taskState entry by index (the tasks appear in order)
      const taskIndex = part.blocks.filter(b => b.type === 'task').indexOf(block);
      const stateObj = taskState[taskIndex]; 
      const status = stateObj?.status || 'locked';

      return (
        <TaskRenderer
          key={i}
          block={block}
          status={status}
        />
      );
    } else {
      return <BlockRenderer key={i} block={block} />;
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow:'hidden'
      }}
    >
      {/* Scrollable content */}
      <div style={{ overflowY: 'auto', flex: 1, }}>
        <h2 style={{color:'#17a2b8', fontWeight:'bold'}}>{part.title}</h2>
        {part.blocks.map((block, i) => renderBlockOrTask(block, i))}
      </div>

      {/* Bottom row for Back/Next buttons */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {currentPartIndex > 0 && (
          <Button outline size="sm" color="secondary" onClick={onBack}>
            Back
          </Button>
        )}
        <Button outline size="sm" color="primary" onClick={onNext}>
          {currentPartIndex < totalParts - 1 ? 'Next' : 'Finish'}
        </Button>
      </div>
    </div>
  );
}

/** Renders a task with a top-right "checkbox" or X, plus instructions, hint, etc. */
function TaskRenderer({ block, status }) {
  const isLocked = status === 'locked';
  const isCorrect = status === 'correct';
  const isIncorrect = status === 'incorrect';

  let icon = '';
  if (isCorrect) icon = '✔';
  else if (isIncorrect) icon = '✘';

  return (
    <div 
      style={{
        position: 'relative',
        border: '1px solid #ddd',
        padding: '0.5rem',
        margin: '0.5rem 0',
        // Gray out if locked
        opacity: isLocked ? 0.5 : 1.0,
        pointerEvents: isLocked ? 'none' : 'auto',
      }}
    >
      {/* The "checkbox" or icon in top-right */}
      <div
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          fontWeight: 'bold',
        }}
      >
        {isCorrect ? '✅'  : isIncorrect ? '❌' : '⬜'}
      </div>

      <h4>{block.title}</h4>
      <p>{block.instructions}</p>
      {block.hint && (
        <details style={{ marginTop: '0.5rem' }}>
          <summary>Hint</summary>
          <p><Latex>{block.hint}</Latex></p>
        </details>
      )}
    </div>
  );
}
