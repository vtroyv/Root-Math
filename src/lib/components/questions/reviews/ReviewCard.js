'use client';
import { useState } from 'react';
import { Alert, Button } from 'reactstrap';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import BlockRenderer from '@/lib/components/learn/lessons/BlockRenderer';
import AnswerPart from '../parts/AnswerPart';
import ChoicePart from '../parts/ChoicePart';
import OrderPart from '../parts/OrderPart';
import { useCheckReviewCardMutation } from '@/lib/redux/slices/apiSlice';

/*
One review card. Calls onRate(rating) once the student has rated it.
  flip          front -> "Show answer" -> back -> Again / Hard / Good / Easy
  auto-marked   answer / choice / order input (the question-part components) -> "Check"
                -> right: Hard / Good / Easy   wrong: Again automatically
Card format: src/lib/docs/question-reviews.md.
*/

const INPUTS = { answer: AnswerPart, choice: ChoicePart, order: OrderPart };

const RATING_BUTTONS = [
  { rating: 'again', label: 'Again', hint: "I didn't know it", color: 'danger' },
  { rating: 'hard', label: 'Hard', hint: 'I struggled', color: 'warning' },
  { rating: 'good', label: 'Good', hint: 'I knew it', color: 'success' },
  { rating: 'easy', label: 'Easy', hint: 'Instant', color: 'info' },
];

const blocks = (list) => (list ?? []).map((block, i) => <BlockRenderer key={i} block={block} />);

export default function ReviewCard({ card, title, onRate, busy }) {
  return card.type === 'flip' ? (
    <FlipCard card={card} onRate={onRate} busy={busy} />
  ) : (
    <MarkedCard card={card} title={title} onRate={onRate} busy={busy} />
  );
}

function FlipCard({ card, onRate, busy }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div>
      <Side>{blocks(card.front)}</Side>
      {!revealed ? (
        <>
          <p style={{ fontSize: '0.9rem', color: '#6c757d', margin: '0.5rem 0' }}>Think of your answer first, then reveal it.</p>
          <Button color="info" onClick={() => setRevealed(true)}>
            Show answer
          </Button>
        </>
      ) : (
        <>
          <Side answer>{blocks(card.back)}</Side>
          <RatingButtons onRate={onRate} busy={busy} />
        </>
      )}
    </div>
  );
}

function MarkedCard({ card, title, onRate, busy }) {
  const Input = INPUTS[card.type];
  const [response, setResponse] = useState(undefined);
  const [checked, setChecked] = useState(null); // { correct, result, explanation }
  const [checkCard, { isLoading: checking }] = useCheckReviewCardMutation();
  const [error, setError] = useState(null);

  const check = async () => {
    setError(null);
    try {
      setChecked(await checkCard({ title, cardId: card.id, response }).unwrap());
    } catch {
      setError("Couldn't check your answer. Please try again.");
    }
  };

  return (
    <div>
      <div style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>
        <Latex>{card.prompt ?? ''}</Latex>
      </div>
      <Input part={card} response={response} result={checked?.result ?? null} onChange={setResponse} locked={Boolean(checked)} />

      {error && (
        <Alert color="danger" fade={false} style={{ marginTop: '0.5rem' }}>
          {error}
        </Alert>
      )}

      {!checked ? (
        <Button color="info" style={{ marginTop: '0.75rem' }} onClick={check} disabled={checking || response === undefined}>
          {checking ? 'Checking…' : 'Check'}
        </Button>
      ) : (
        <>
          <Side answer correct={checked.correct}>
            <strong>{checked.correct ? 'Correct.' : 'Not quite.'}</strong>
            {blocks(checked.result?.feedback?.filter((b) => !/^(Correct\.|Not quite\.)$/.test(b.content ?? '')))}
            {blocks(checked.explanation)}
          </Side>
          {checked.correct ? (
            // right: the student picks how easy it was (Again isn't offered)
            <RatingButtons onRate={onRate} busy={busy} omit={['again']} />
          ) : (
            // wrong: rated Again automatically
            <Button color="secondary" outline style={{ marginTop: '0.75rem' }} disabled={busy} onClick={() => onRate('again')}>
              Continue (this card will come back soon)
            </Button>
          )}
        </>
      )}
    </div>
  );
}

// a card face: the answer side gets a teal (or green/red after checking) left border
function Side({ children, answer, correct }) {
  const border = correct === true ? '#28a745' : correct === false ? '#dc3545' : answer ? '#17a2b8' : '#ced4da';
  return (
    <div style={{ background: answer ? '#f2fafb' : '#ffffff', border: '1px solid #dee2e6', borderLeft: `4px solid ${border}`, borderRadius: '4px', padding: '0.75rem 1rem', marginTop: answer ? '0.75rem' : 0 }}>
      {children}
    </div>
  );
}

function RatingButtons({ onRate, busy, omit = [] }) {
  return (
    <div style={{ marginTop: '0.75rem' }}>
      <p style={{ fontSize: '0.9rem', color: '#495057', margin: '0 0 0.4rem' }}>How well did you know it?</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
        {RATING_BUTTONS.filter((b) => !omit.includes(b.rating)).map((b) => (
          <Button key={b.rating} color={b.color} outline disabled={busy} onClick={() => onRate(b.rating)} style={{ padding: '0.4rem' }}>
            <strong>{b.label}</strong>
            <div style={{ fontSize: '0.8rem' }}>{b.hint}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}
