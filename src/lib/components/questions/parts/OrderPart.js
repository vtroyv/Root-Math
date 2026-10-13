'use client';
import { useState } from 'react';
import { Button } from 'reactstrap';
import Latex from 'react-latex-next';

/*
`order` part: build an argument from a shuffled pool of lines (some may be distractors).
Lines arrive from the server already shuffled, with opaque ids.
Response shape: { sequence: [lineId] }
After marking, each placed line is outlined green (right position) or red.
*/
export default function OrderPart({ part, response, result, onChange, locked }) {
  const sequence = response?.sequence ?? [];
  const byId = Object.fromEntries((part.lines ?? []).map((line) => [line.id, line]));
  const pool = (part.lines ?? []).filter((line) => !sequence.includes(line.id));
  const positions = result?.details?.positions;
  const [dragFrom, setDragFrom] = useState(null);

  const update = (next) => onChange({ sequence: next });
  const move = (from, to) => {
    if (to < 0 || to >= sequence.length) return;
    const next = [...sequence];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update(next);
  };

  // `result` is only passed while the sequence is unchanged since marking (see QuestionParts)
  const borderFor = (i) => {
    if (!positions || i >= positions.length) return '#ced4da';
    return positions[i] ? '#28a745' : '#dc3545';
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    marginBottom: '0.4rem',
    background: '#fff',
    borderRadius: '4px',
  };
  const small = { padding: '0 0.4rem', lineHeight: 1.4 };

  return (
    <div>
      <h6 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Your answer</h6>
      <div style={{ minHeight: '3rem', padding: '0.5rem', background: '#f8f9fa', border: '1px dashed #ced4da', borderRadius: '4px' }}>
        {sequence.length === 0 && (
          <p style={{ margin: 0, fontStyle: 'italic', color: '#6c757d' }}>Add lines from below, in order.</p>
        )}
        {sequence.map((id, i) => (
          <div
            key={id}
            draggable={!locked}
            onDragStart={() => setDragFrom(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragFrom !== null) move(dragFrom, i);
              setDragFrom(null);
            }}
            style={{ ...rowStyle, border: `2px solid ${borderFor(i)}`, cursor: locked ? 'default' : 'grab' }}
          >
            <strong style={{ minWidth: '1.5rem' }}>{i + 1}.</strong>
            <div style={{ flex: 1 }}>
              <Latex>{byId[id]?.content ?? ''}</Latex>
            </div>
            {!locked && (
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <Button size="sm" outline style={small} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move up">↑</Button>
                <Button size="sm" outline style={small} onClick={() => move(i, i + 1)} disabled={i === sequence.length - 1} aria-label="Move down">↓</Button>
                <Button size="sm" outline color="danger" style={small} onClick={() => update(sequence.filter((s) => s !== id))} aria-label="Remove">✕</Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {!locked && pool.length > 0 && (
        <>
          <h6 style={{ fontWeight: 'bold', margin: '1rem 0 0.5rem' }}>Lines to use</h6>
          {pool.map((line) => (
            <div key={line.id} style={{ ...rowStyle, border: '1px solid #ced4da' }}>
              <div style={{ flex: 1 }}>
                <Latex>{line.content}</Latex>
              </div>
              <Button size="sm" color="info" outline onClick={() => update([...sequence, line.id])}>
                Add
              </Button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
