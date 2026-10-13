'use client';
import { Button } from 'reactstrap';
import Latex from 'react-latex-next';
import ImageWithEnlarge from '@/lib/components/learn/lessons/ImageWithEnlarge';

/*
`choice` part (multiple choice). `part.multiple` (set by the server) allows
selecting several options. Correctness is only known after Submit, because
the `correct` flags never reach the browser.
`fill` = this is the only part, so the options grow to fill the panel.
Response shape: { selected: [optionId] }
*/
export default function ChoicePart({ part, response, result, onChange, locked, fill }) {
  const selected = response?.selected ?? [];
  const states = result?.details?.options ?? {};

  const toggle = (id) => {
    if (locked) return;
    const next = part.multiple
      ? selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
      : [id];
    onChange({ selected: next });
  };

  // `result` is only passed while the selection is unchanged since marking (see QuestionParts)
  const colourFor = (id) => {
    if (!selected.includes(id)) return 'secondary';
    if (states[id] === 'correct') return 'success';
    if (states[id] === 'incorrect') return 'danger';
    return 'info';
  };

  return (
    <div style={fill ? { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } : undefined}>
      {part.multiple && <p style={{ fontSize: '0.9rem', margin: '0 0 0.75rem' }}>Select all that apply.</p>}

      {/* two columns, one on narrow screens; when filling, every row shares the height equally */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gridAutoRows: fill ? '1fr' : 'minmax(5rem, auto)',
          gap: '1rem',
          padding: '0.5rem 0',
          ...(fill && { flex: 1, minHeight: '16rem' }),
        }}
      >
        {(part.options ?? []).map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <Button
              key={option.id}
              color={colourFor(option.id)}
              outline={!isSelected}
              onClick={() => toggle(option.id)}
              disabled={locked && !isSelected}
              aria-pressed={isSelected}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem 1rem',
                fontSize: fill ? '1.6rem' : '1.3rem',
              }}
            >
              {/* option letter in its own small box; currentColor keeps it readable on selected (filled) cards too */}
              <span
                style={{
                  position: 'absolute',
                  top: '0.6rem',
                  left: '0.6rem',
                  width: '2rem',
                  height: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid currentColor',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}
              >
                {option.id}
              </span>
              <Latex>{option.content}</Latex>
              {option.image && <ImageWithEnlarge url={option.image.url} alt={option.image.alt} />}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
