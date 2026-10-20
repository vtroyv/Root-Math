'use client';
import { useState } from 'react';
import { Button } from 'reactstrap';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import BlockRenderer from '@/lib/components/learn/lessons/BlockRenderer';
import ImageWithEnlarge from '@/lib/components/learn/lessons/ImageWithEnlarge';
import MathInputPart from './MathInputPart';
import AnswerPart from './AnswerPart';
import ChoicePart from './ChoicePart';
import OrderPart from './OrderPart';
import PlacePart from './PlacePart';
import SketchPart from './SketchPart';

// also used by lesson tasks (src/lib/components/learn/lessons/tasks/), which share these bodies
export const BODIES = {
  working: MathInputPart,
  explain: MathInputPart,
  answer: AnswerPart,
  choice: ChoicePart,
  order: OrderPart,
  place: PlacePart,
  sketch: SketchPart,
};

export const STATUS_COLOURS = {
  correct: '#28a745',
  partial: '#f0ad4e',
  incorrect: '#dc3545',
  unanswered: '#adb5bd',
  error: '#adb5bd',
};

/*
Everything common to a part: label, marks, prompt, optional image and hint,
the type-specific body, and the latest marking result underneath.
`stale` = the student has changed this part since it was marked.
`fill`  = the only part on the page, so it stretches to fill the pane.
*/

// these bodies render the Hint button in their own toolbar, next to Text mode
const OWNS_TOOLBAR = new Set(['working', 'explain']);

export default function PartRenderer({ part, index, showLabel, response, result, stale, onChange, fill }) {
  const Body = BODIES[part.type];
  const locked = result?.status === 'correct' && !stale;
  const label = part.label ?? (showLabel ? `Part ${index + 1}` : null);
  const [hintOpen, setHintOpen] = useState(false);

  const hintButton =
    part.hint?.length > 0 && !locked ? (
      <Button size="sm" color="secondary" outline={!hintOpen} onClick={() => setHintOpen((open) => !open)} aria-expanded={hintOpen}>
        {hintOpen ? 'Hide hint' : 'Hint'}
      </Button>
    ) : null;

  return (
    <section
      style={{
        padding: '1rem 0',
        borderBottom: fill ? 'none' : '1px solid #e9ecef',
        ...(fill && { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {label && <strong style={{ fontSize: '1.1rem' }}>{label}</strong>}
        <div style={{ flex: 1, fontSize: '1.1rem' }}>
          <Latex>{part.prompt ?? ''}</Latex>
        </div>
        <span style={{ whiteSpace: 'nowrap', color: '#6c757d' }}>
          [{part.marks} mark{part.marks === 1 ? '' : 's'}]
        </span>
      </div>

      {part.image && (
        <ImageWithEnlarge
          url={part.image.url}
          alt={part.image.alt}
          caption={part.image.caption}
          width={part.image.width}
          height={part.image.height}
        />
      )}

      {Body ? (
        <Body
          part={part}
          response={response}
          result={stale ? null : result}
          onChange={onChange}
          locked={locked}
          fill={fill}
          toolbar={OWNS_TOOLBAR.has(part.type) ? hintButton : undefined}
        />
      ) : (
        <p style={{ color: '#dc3545' }}>Unknown part type &quot;{part.type}&quot;.</p>
      )}

      {hintButton && !OWNS_TOOLBAR.has(part.type) && <div style={{ marginTop: '0.5rem' }}>{hintButton}</div>}

      {hintOpen && !locked && (
        <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', borderLeft: '4px solid #17a2b8', background: '#f8f9fa' }}>
          {part.hint.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem 0.75rem',
            borderLeft: `4px solid ${STATUS_COLOURS[result.status] ?? '#adb5bd'}`,
            background: '#f8f9fa',
          }}
        >
          <strong>
            {result.status === 'unanswered'
              ? 'Not answered'
              : `${result.marksAwarded} / ${result.marksAvailable} marks`}
          </strong>
          {stale && <span style={{ marginLeft: '0.5rem', color: '#6c757d' }}>(changed since marking, submit again)</span>}
          {(result.feedback ?? []).map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </div>
      )}
    </section>
  );
}
