import { ComputeEngine } from '@cortex-js/compute-engine';
import { orderLineId } from './ids.js';
import { partMarks } from './sanitize.js';

/*
Markers for every part type that doesn't need an LLM.
Each takes (part, response) where `part` is the FULL part from MongoDB
(answer keys included) and returns a PartResult:

  { status: 'correct' | 'partial' | 'incorrect' | 'unanswered',
    marksAwarded, marksAvailable,
    feedback: [blocks],        // rendered with BlockRenderer
    details: {...} }           // per-blank / per-option etc, used to highlight the UI
*/

const ce = new ComputeEngine();

export function buildResult(part, marksAwarded, feedback = [], details = {}, answered = true) {
  const marksAvailable = partMarks(part);
  const awarded = Math.max(0, Math.min(marksAvailable, marksAwarded));
  let status = 'incorrect';
  if (!answered) status = 'unanswered';
  else if (awarded === marksAvailable) status = 'correct';
  else if (awarded > 0) status = 'partial';
  return { status, marksAwarded: answered ? awarded : 0, marksAvailable, feedback, details };
}

const para = (content) => ({ type: 'paragraph', content });

// ─── answer (fill in the blanks) ──────────────────────────────────────────

function cleanLatex(latex) {
  return String(latex ?? '')
    .replace(/\\placeholder(\[[^\]]*\])?\{\}/g, '')
    .replace(/\\[,;:! ]/g, ' ')
    .trim();
}

// true if the student's LaTeX matches the blank spec
export function blankMatches(studentLatex, spec) {
  let student = cleanLatex(studentLatex);
  if (!student) return false;

  const candidates = [spec.answer, ...(spec.accept ?? [])].map(String);

  // "b = 12" typed into a blank whose answer is "12" -> just compare the right-hand side
  if (student.includes('=') && !candidates.some((c) => c.includes('='))) {
    student = student.split('=').pop().trim();
  }

  const s = ce.parse(student);
  if (!s.isValid) return false;

  for (const candidate of candidates) {
    const expected = ce.parse(candidate);
    if (spec.exactForm) {
      // the form matters, e.g. "leave your answer as a power of 2"
      if (s.isSame(expected)) return true;
      continue;
    }
    try {
      if (s.isEqual(expected)) return true;
    } catch {
      /* fall through to the numeric check */
    }
    if (typeof spec.tolerance === 'number') {
      const a = s.N().value;
      const b = expected.N().value;
      if (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= spec.tolerance) {
        return true;
      }
    }
  }
  return false;
}

export function markAnswer(part, response) {
  const blanks = part.blanks ?? {};
  const ids = Object.keys(blanks);
  const given = response?.blanks ?? {};
  const answered = ids.some((id) => cleanLatex(given[id]));

  const results = {};
  const feedback = [];
  for (const id of ids) {
    results[id] = blankMatches(given[id], blanks[id]);
    if (!results[id] && blanks[id].feedback) feedback.push(para(blanks[id].feedback));
  }

  const correctCount = ids.filter((id) => results[id]).length;
  const marks = ids.length ? Math.round((partMarks(part) * correctCount) / ids.length) : 0;

  if (answered && correctCount === ids.length) feedback.unshift(para('Correct.'));
  else if (answered) {
    feedback.unshift(
      para(`${correctCount} of ${ids.length} answer${ids.length === 1 ? '' : 's'} correct. Boxes marked red need another look.`),
    );
  }
  return buildResult(part, marks, feedback, { blanks: results }, answered);
}

// ─── choice (multiple choice) ─────────────────────────────────────────────

export function markChoice(part, response) {
  const options = part.options ?? [];
  const selected = new Set(response?.selected ?? []);
  const correct = new Set(options.filter((o) => o.correct).map((o) => o.id));
  const answered = selected.size > 0;

  const isRight = answered && selected.size === correct.size && [...selected].every((id) => correct.has(id));

  const states = {};
  const feedback = [];
  for (const option of options) {
    if (!selected.has(option.id)) continue;
    states[option.id] = correct.has(option.id) ? 'correct' : 'incorrect';
    if (option.why) feedback.push(para(option.why));
  }
  if (answered) feedback.unshift(para(isRight ? 'Correct.' : 'Not quite.'));

  return buildResult(part, isRight ? partMarks(part) : 0, feedback, { options: states }, answered);
}

// ─── order (put the steps in order) ───────────────────────────────────────

export function markOrder(part, response) {
  const expected = (part.lines ?? []).map((content) => orderLineId(part, content));
  const distractorIds = new Set((part.distractors ?? []).map((content) => orderLineId(part, content)));
  const sequence = response?.sequence ?? [];
  const answered = sequence.length > 0;

  const positions = sequence.map((id, i) => id === expected[i]);
  const correctCount = positions.filter(Boolean).length;
  const usedDistractor = sequence.some((id) => distractorIds.has(id));
  const exact = sequence.length === expected.length && correctCount === expected.length;

  const feedback = [];
  if (answered) {
    if (exact) feedback.push(para('Correct. Every step is in the right place.'));
    else {
      feedback.push(para(`${correctCount} of ${expected.length} steps are in the right position.`));
      if (usedDistractor) feedback.push(para("At least one line you've used doesn't belong in this argument."));
      if (sequence.length < expected.length) feedback.push(para('Some steps are still missing.'));
    }
  }

  const marks = exact ? partMarks(part) : Math.floor((partMarks(part) * correctCount) / Math.max(expected.length, 1));
  // a partially right order never earns full marks
  const capped = exact ? marks : Math.min(marks, partMarks(part) - 1);
  return buildResult(part, capped, feedback, { positions }, answered);
}

// ─── place (drag points / vectors on a grid) ──────────────────────────────

const close = (a, b, tol) => Array.isArray(a) && Array.isArray(b) && Math.hypot(a[0] - b[0], a[1] - b[1]) <= tol;

export function markPlace(part, response) {
  const objects = part.objects ?? [];
  const placed = response?.objects ?? [];
  const tol = part.tolerance ?? 0.1;
  const answered = placed.some(Boolean);

  const results = objects.map((object, i) => {
    const got = placed[i];
    const answer = object.answer;
    if (!got || !answer) return false;
    if (object.kind === 'point') return close(got.at, answer.at ?? answer, tol);
    // vectors: either a free vector (components) or a fixed one (from/to)
    if (answer.components) {
      const comps = [got.to[0] - got.from[0], got.to[1] - got.from[1]];
      return close(comps, answer.components, tol);
    }
    return close(got.from, answer.from, tol) && close(got.to, answer.to, tol);
  });

  const correctCount = results.filter(Boolean).length;
  const marks = Math.round((partMarks(part) * correctCount) / Math.max(objects.length, 1));
  const feedback = [];
  if (answered) {
    if (correctCount === objects.length) feedback.push(para('Correct.'));
    objects.forEach((object, i) => {
      if (!results[i]) feedback.push(para(object.feedback ?? `${object.label ?? `Object ${i + 1}`} isn't in the right place yet.`));
    });
  }
  return buildResult(part, marks, feedback, { objects: results }, answered);
}

// ─── sketch (freehand curve -> handles -> polynomial) ─────────────────────

// Lagrange interpolation through the student's handles, same curve JSXGraph draws
function lagrange(points) {
  return (x) =>
    points.reduce((sum, pi, i) => {
      let term = pi.y;
      points.forEach((pj, j) => {
        if (i !== j) term *= (x - pj.x) / (pi.x - pj.x);
      });
      return sum + term;
    }, 0);
}

// closest distance from (px, py) to the student's curve, sampled across the board
function distanceToCurve(f, px, py, [xMin, xMax]) {
  const steps = 2000;
  let best = Infinity;
  for (let k = 0; k <= steps; k++) {
    const x = xMin + ((xMax - xMin) * k) / steps;
    const y = f(x);
    if (Number.isFinite(y)) best = Math.min(best, Math.hypot(x - px, y - py));
  }
  return best;
}

// leading coefficient of the polynomial through the handles: positive = ends up (∪), negative = ends down (∩)
function leadingCoefficient(points) {
  return points.reduce((sum, pi, i) => {
    let denominator = 1;
    points.forEach((pj, j) => {
      if (i !== j) denominator *= pi.x - pj.x;
    });
    return sum + pi.y / denominator;
  }, 0);
}

/*
Checks, each worth one mark:
  keyPoints   the curve passes within `threshold` of each one
  shape       optional 'up' | 'down': the sign of the x^degree coefficient (∪ or ∩ for a quadratic).
              Lets a task ask for "any quadratic with a > 0" without fixing its points.
*/
export function markSketch(part, response) {
  const keyPoints = part.keyPoints ?? [];
  const points = (response?.points ?? []).filter((p) => Number.isFinite(p?.x) && Number.isFinite(p?.y));
  const answered = points.length >= 2;
  const distinctX = new Set(points.map((p) => p.x)).size === points.length;
  if (!answered || !distinctX) return buildResult(part, 0, [], { keyPoints: [] }, answered);

  const f = lagrange(points);
  const bbox = part.boundingBox ?? [-10, 10, 10, -10];
  const results = keyPoints.map((kp) => distanceToCurve(f, kp.x, kp.y, [bbox[0], bbox[2]]) <= (kp.threshold ?? 0.25));
  const lead = leadingCoefficient(points);
  const shapeRight = !part.shape || (part.shape === 'up' ? lead > 0 : lead < 0);

  const checks = results.length + (part.shape ? 1 : 0);
  const correctCount = results.filter(Boolean).length + (part.shape && shapeRight ? 1 : 0);
  const marks = Math.round((partMarks(part) * correctCount) / Math.max(checks, 1));

  let feedback = [];
  if (correctCount === checks) {
    feedback = part.correctFeedback ?? [para('Correct. Your curve passes through every key point.')];
  } else {
    if (!shapeRight) {
      feedback.push(...(part.shapeFeedback ?? [para(`Check the shape: this curve should open ${part.shape === 'up' ? 'upwards (∪)' : 'downwards (∩)'}.`)]));
    }
    keyPoints.forEach((kp, i) => {
      if (results[i]) return;
      feedback.push(...(kp.feedback ?? [para(`Check your ${kp.label ?? 'key point'}.`)]));
    });
  }
  return buildResult(part, marks, feedback, { keyPoints: results, shape: shapeRight }, answered);
}
