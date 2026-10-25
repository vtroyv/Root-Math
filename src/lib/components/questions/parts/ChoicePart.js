'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button, Modal, ModalBody } from 'reactstrap';
import Latex from 'react-latex-next';

/*
`choice` part (multiple choice). `part.multiple` (set by the server) allows
selecting several options. Correctness is only known after Submit, because
the `correct` flags never reach the browser.
`fill` = this is the only part, so the options grow to fill the panel.
Response shape: { selected: [optionId] }

Options with an `image` (e.g. "which graph is a quadratic?") are shown as image cards,
at most two per row so four make a 2x2 grid: clicking the card selects it, and only the
↗ icon in its corner opens the enlarged image.
*/

const BORDERS = { secondary: '#ced4da', info: '#17a2b8', success: '#28a745', danger: '#dc3545' };

export default function ChoicePart({ part, response, result, onChange, locked, fill }) {
  const selected = response?.selected ?? [];
  const states = result?.details?.options ?? {};
  const [enlarged, setEnlarged] = useState(null); // the image option being shown big
  const hasImages = (part.options ?? []).some((o) => o.image);

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

  if (hasImages) {
    return (
      <div>
        {part.multiple && <p style={{ fontSize: '0.9rem', margin: '0 0 0.75rem' }}>Select all that apply.</p>}
        <div
          role={part.multiple ? 'group' : 'radiogroup'}
          style={{
            display: 'grid',
            // at most two columns, one on narrow panes
            gridTemplateColumns: 'repeat(auto-fit, minmax(max(200px, calc(50% - 0.5rem)), 1fr))',
            gap: '1rem',
            padding: '0.5rem 0',
          }}
        >
          {(part.options ?? []).map((option) => (
            <ImageOption
              key={option.id}
              option={option}
              selected={selected.includes(option.id)}
              border={BORDERS[colourFor(option.id)]}
              multiple={part.multiple}
              locked={locked}
              onSelect={() => toggle(option.id)}
              onEnlarge={() => setEnlarged(option)}
            />
          ))}
        </div>

        {/* fade={false}: no open/close animation (styling preference) */}
        <Modal isOpen={!!enlarged} toggle={() => setEnlarged(null)} centered size="xl" fade={false}>
          <ModalBody>
            {enlarged && (
              <>
                <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem' }}>Option {enlarged.id}</p>
                <Image
                  src={enlarged.image.url}
                  alt={enlarged.image.alt ?? `Option ${enlarged.id}`}
                  width={0}
                  height={0}
                  sizes="90vw"
                  style={{ width: '100%', height: 'auto' }}
                />
                <Button outline color="primary" onClick={() => setEnlarged(null)} style={{ display: 'block', margin: '1rem auto 0' }}>
                  Close
                </Button>
              </>
            )}
          </ModalBody>
        </Modal>
      </div>
    );
  }

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
              <Latex>{option.content ?? ''}</Latex>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

/*
One image card. The card (role radio/checkbox) and the ↗ button are siblings, not nested, so
clicking the card only selects it and the ↗ only enlarges. The image keeps its own shape
(width 100%, height auto) instead of being forced to a fixed size.
Selected = teal border; after marking, green or red. Plain colour changes, no hover effects.
*/
function ImageOption({ option, selected, border, multiple, locked, onSelect, onEnlarge }) {
  const disabled = locked && !selected;
  const select = () => {
    if (!disabled) onSelect();
  };
  return (
    <div style={{ position: 'relative' }}>
      <div
        role={multiple ? 'checkbox' : 'radio'}
        aria-checked={selected}
        aria-disabled={disabled}
        aria-label={`Option ${option.id}`}
        tabIndex={disabled ? -1 : 0}
        onClick={select}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            select();
          }
        }}
        style={{
          height: '100%',
          padding: '2.75rem 0.75rem 0.75rem',
          background: '#fff',
          border: `${selected ? 3 : 2}px solid ${border}`,
          borderRadius: '6px',
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '0.6rem',
            left: '0.6rem',
            width: '1.8rem',
            height: '1.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${selected ? border : '#495057'}`,
            borderRadius: '4px',
            background: selected ? border : '#fff',
            color: selected ? '#fff' : '#495057',
            fontWeight: 'bold',
            lineHeight: 1,
          }}
        >
          {option.id}
        </span>
        <Image
          src={option.image.url}
          alt={option.image.alt ?? `Option ${option.id}`}
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, 30vw"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        {option.content && (
          <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
            <Latex>{option.content}</Latex>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onEnlarge}
        aria-label={`Enlarge option ${option.id}`}
        title="Enlarge"
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          padding: '0.15rem 0.4rem',
          background: '#fff',
          border: '1px solid #ced4da',
          borderRadius: '4px',
          lineHeight: 1,
          cursor: 'pointer',
        }}
      >
        <i className="bi bi-arrows-angle-expand" aria-hidden="true" />
      </button>
    </div>
  );
}
