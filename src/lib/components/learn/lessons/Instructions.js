// /lib/components/learn/Instructions.jsx

'use client';
import { Button } from 'reactstrap';
import BlockRenderer from './BlockRenderer'; // a small helper to handle 'heading', 'paragraph', 'task', etc.

export default function Instructions({
  part,
  currentPartIndex,
  totalParts,
  onBack,
  onNext,
}) {
  if (!part) return <div>No instructions available.</div>;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Scrollable area */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        <h2 style={{color: '#17a2b8'}}>{part.title}</h2>
        {part.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>

      {/* Bottom row: Back & Next */}
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
