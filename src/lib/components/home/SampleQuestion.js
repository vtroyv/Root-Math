'use client';
import { useEffect, useState } from 'react';
import BlockRenderer from '@/lib/components/learn/lessons/BlockRenderer';
import PartRenderer from '@/lib/components/questions/parts/PartRenderer';

/*
One question anyone can try without an account, on the /teachers page. Uses the same
part components as /learn, but keeps answers in this component's state rather than
saving them, and marks through /api/sample-question.
*/

const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export default function SampleQuestion({ title }) {
  const [question, setQuestion] = useState(null);
  const [entries, setEntries] = useState([]); // per part: { response, result, markedResponse }
  const [version, setVersion] = useState(0); // bumped on Start again to remount the parts
  const [marking, setMarking] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/sample-question?title=${encodeURIComponent(title)}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('not ok'))))
      .then(setQuestion)
      .catch(() => setError('We couldn’t load this question. Please refresh and try again.'));
  }, [title]);

  if (!question) return error ? <p className="rm-field__error" role="alert">{error}</p> : <p>Loading the question…</p>;

  const parts = question.parts;
  const marked = entries.some((entry) => entry?.result);

  const setResponse = (index, response) => {
    setEntries((current) => {
      const next = [...current];
      next[index] = { ...next[index], response };
      return next;
    });
  };

  const submit = async () => {
    setError('');
    setMarking(true);
    const responses = parts.map((_, index) => entries[index]?.response);
    try {
      const response = await fetch('/api/sample-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, responses }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setEntries(parts.map((_, index) => ({
        response: responses[index],
        result: result.results[index],
        markedResponse: responses[index],
      })));
    } catch {
      setError('We couldn’t reach the server. Check your connection and try again.');
    } finally {
      setMarking(false);
    }
  };

  const startAgain = () => {
    setEntries([]);
    setShowSolution(false);
    setError('');
    setVersion((current) => current + 1);
  };

  return (
    <div className="rm-card" style={{ height: 'auto', marginTop: 'var(--rm-gap)' }}>
      {question.stem?.map((block, index) => <BlockRenderer key={index} block={block} />)}

      {parts.map((part, index) => {
        const entry = entries[index] ?? {};
        return (
          <PartRenderer
            key={`${version}-${index}`}
            part={part}
            index={index}
            showLabel={parts.length > 1}
            response={entry.response}
            result={entry.result}
            stale={!!entry.result && !same(entry.response, entry.markedResponse)}
            onChange={(response) => setResponse(index, response)}
          />
        );
      })}

      {showSolution && (
        <div>
          <h3 className="rm-h3">Solution</h3>
          {parts.flatMap((part) => part.solution ?? []).map((block, index) => (
            <BlockRenderer key={index} block={block} />
          ))}
        </div>
      )}

      {error && <p className="rm-field__error" role="alert">{error}</p>}

      <div className="rm-btn-row">
        <button type="button" className="rm-btn rm-btn--primary" onClick={submit} disabled={marking}>
          {marking ? 'Marking…' : 'Submit'}
        </button>
        {marked && (
          <button type="button" className="rm-btn rm-btn--ghost" onClick={() => setShowSolution((open) => !open)}>
            {showSolution ? 'Hide solution' : 'Show solution'}
          </button>
        )}
        {marked && (
          <button type="button" className="rm-btn rm-btn--ghost" onClick={startAgain}>
            Start again
          </button>
        )}
      </div>
    </div>
  );
}
