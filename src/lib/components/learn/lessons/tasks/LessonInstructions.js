'use client';
import { useState } from 'react';
import { Button } from 'reactstrap';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import BlockRenderer from '@/lib/components/learn/lessons/BlockRenderer';
import { statusColour } from './LessonTasks';

/*
The lesson page's left pane: the part's teaching blocks, then one box per task with its
title, instructions, a tick / cross, and its hint (hints live here, not in the centre).
Back / Next (Finish on the last part) at the bottom.
*/

const ICONS = {
  correct: 'bi-check-circle-fill',
  revealed: 'bi-eye-fill',
  partial: 'bi-dash-circle-fill',
  incorrect: 'bi-x-circle-fill',
  error: 'bi-exclamation-circle-fill',
};

export default function LessonInstructions({ part, partIndex, totalParts, states, onBack, onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
        <p style={{ color: '#6c757d', margin: 0 }}>
          Part {partIndex + 1} of {totalParts}
        </p>
        <h2 style={{ color: '#17a2b8', fontWeight: 'bold' }}>
          <Latex>{part.title ?? ''}</Latex>
        </h2>
        {(part.blocks ?? []).map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}

        {states.length > 0 && <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '1rem 0.5rem 0.5rem' }}>Your tasks</h3>}
        {states.map((state, i) => (
          <TaskBox key={state.task.id} index={i} state={state} />
        ))}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        {partIndex > 0 ? (
          <Button outline size="sm" color="secondary" onClick={onBack}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button outline size="sm" color="primary" onClick={onNext}>
          {partIndex < totalParts - 1 ? 'Next' : 'Finish'}
        </Button>
      </div>
    </div>
  );
}

function TaskBox({ index, state }) {
  const { task, status, stale } = state;
  const [hintOpen, setHintOpen] = useState(false);
  const shown = stale ? null : status;
  const hint = typeof task.hint === 'string' ? [{ type: 'paragraph', content: task.hint }] : task.hint ?? [];

  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        padding: '0.5rem 0.75rem',
        margin: '0.5rem 0',
        background: '#fff',
      }}
    >
      <i
        className={`bi ${ICONS[shown] ?? 'bi-circle'}`}
        aria-label={shown ?? 'Not answered'}
        style={{ position: 'absolute', top: '0.5rem', right: '0.75rem', fontSize: '1.2rem', color: shown ? statusColour(shown) : '#adb5bd' }}
      />
      <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', margin: '0 2rem 0.25rem 0' }}>
        Task {index + 1}: <Latex>{task.title ?? ''}</Latex>
      </h4>
      {task.instructions && (
        <p style={{ margin: '0 0 0.25rem' }}>
          <Latex>{task.instructions}</Latex>
        </p>
      )}
      {hint.length > 0 && (
        <>
          <Button size="sm" color="secondary" outline={!hintOpen} onClick={() => setHintOpen((v) => !v)} aria-expanded={hintOpen}>
            {hintOpen ? 'Hide hint' : 'Hint'}
          </Button>
          {hintOpen && (
            <div style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', borderLeft: '4px solid #17a2b8', background: '#f8f9fa' }}>
              {hint.map((block, i) => (
                <BlockRenderer key={i} block={block} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
