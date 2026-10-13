import preprocessLatex from '../utils/preprocess-latex.js';
import { buildResult } from './deterministic.js';
import { partMarks } from './sanitize.js';

/*
LLM marking for `working` and `explain` parts.

The real marking lives in the FastAPI server. Until that endpoint exists this
returns a SIMULATED response with the same shape, so the whole UI can be built
and tested. Switch with environment variables in .env.local:

  FASTAPI_MARKING=live                 # anything else (or unset) = simulated
  FASTAPI_URL=http://127.0.0.1:8000    # default shown

── Contract: POST {FASTAPI_URL}/mark-part ──────────────────────────────────
Request body:
  {
    question: { title, topic, stem },          // stem = shared context blocks
    part: {
      label, type,                             // 'working' | 'explain'
      prompt, marks,
      markScheme: [{ code, marks, text }],     // e.g. { code: 'M1', marks: 1, text: '...' }
      solution: [blocks],
      llm: { context }                         // optional extra instructions for the model
    },
    response: {
      latex,                                   // raw MathLive LaTeX, exactly as typed
      lines: [string]                          // same LaTeX split into lines
    }
  }

Expected response body:
  {
    marksAwarded: number,
    marks: [{ code, awarded: boolean, reason }],   // one per markScheme entry
    feedback: [blocks]                             // BlockRenderer blocks
  }
*/

export async function markWithLLM(question, part, response) {
  const latex = String(response?.latex ?? '').trim();
  const lines = latex ? preprocessLatex(latex) : [];
  if (!lines.length) return buildResult(part, 0, [], {}, false);

  const payload = {
    question: { title: question.title, topic: question.topic, stem: question.stem ?? [] },
    part: {
      label: part.label,
      type: part.type,
      prompt: part.prompt,
      marks: partMarks(part),
      markScheme: part.markScheme ?? [],
      solution: part.solution ?? [],
      llm: part.llm ?? {},
    },
    response: { latex, lines },
  };

  const raw = process.env.FASTAPI_MARKING === 'live' ? await callFastAPI(payload) : simulate(payload);

  const feedback = [...(raw.feedback ?? [])];
  if (raw.marks?.length) {
    feedback.push({
      type: 'bullet-points',
      points: raw.marks.map((m) => `${m.awarded ? '✓' : '✗'} ${m.code}: ${m.reason ?? ''}`),
    });
  }
  return buildResult(part, raw.marksAwarded ?? 0, feedback, { marks: raw.marks ?? [] }, true);
}

async function callFastAPI(payload) {
  const url = `${process.env.FASTAPI_URL ?? 'http://127.0.0.1:8000'}/mark-part`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`FastAPI marking failed: ${res.status}`);
  return res.json();
}

// Fake marker: awards one mark-scheme point per line of working, in order.
// Good enough to exercise partial / full marks in the UI. Clearly labelled.
function simulate({ part, response }) {
  const scheme = part.markScheme.length
    ? part.markScheme
    : [{ code: 'B1', marks: part.marks, text: 'Complete answer' }];

  let remainingLines = response.lines.length;
  let marksAwarded = 0;
  const marks = scheme.map((m) => {
    const awarded = remainingLines > 0;
    if (awarded) {
      remainingLines -= 1;
      marksAwarded += m.marks ?? 1;
    }
    return { code: m.code, awarded, reason: awarded ? `Simulated: ${m.text}` : `Simulated: not yet shown. ${m.text}` };
  });

  return {
    marksAwarded,
    marks,
    feedback: [
      { type: 'bold-paragraph', content: 'Simulated feedback' },
      {
        type: 'paragraph',
        content: 'FastAPI marking is not connected yet, so marks here are awarded one per line of working.',
      },
    ],
  };
}
