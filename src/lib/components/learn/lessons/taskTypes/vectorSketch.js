'use client';

import { useQuestionStore } from '@/lib/zustand/providers/question-state-provider';
import { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';

export default function VectorSketch({ questionDetails }) {
  // --- refs & store ---
  const titleView = useRef(null);
  const titleRef = useRef(null);
  const boardContainerRef = useRef(null);
  const boardRef = useRef(null);
  const PRef = useRef(null);
  const QRef = useRef(null);
  const arrowRef = useRef(null);

  const progress = useQuestionStore((s) => s.userProgress);
  const setComponentProgressAt = useQuestionStore((s) => s.setComponentProgressAt);

  const { index } = questionDetails ?? {};
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // ---------- helpers ----------
  const getDefaults = () => {
    const {
      boundingBox = [-8, 8, 8, -8],
      axis = true,
      start = [-2, 1],
      end = [3, 4],
      snap = 0, // 0 = off, else step (e.g., 0.5 or 1)
      strokeColor = '#17a2b8',
      title = String.raw`Draw the vector \overrightarrow{PQ} by dragging P and Q.`,
    } = questionDetails ?? {};
    return { boundingBox, axis, start, end, snap, strokeColor, title };
  };

  const snapIfNeeded = (x, y, step) => {
    if (!step || step <= 0) return [x, y];
    const s = Number(step);
    return [Math.round(x / s) * s, Math.round(y / s) * s];
  };

  const saveAnswer = () => {
    if (!PRef.current || !QRef.current) return;
    const ans = {
      start: [PRef.current.X(), PRef.current.Y()],
      end: [QRef.current.X(), QRef.current.Y()],
    };
    setComponentProgressAt(index, { vector: ans });
    return ans;
  };

  const loadSavedOrDefaults = () => {
    const { start, end } = getDefaults();
    const saved = progress?.componentProgress?.[index]?.vector;
    return {
      start: Array.isArray(saved?.start) ? saved.start : start,
      end: Array.isArray(saved?.end) ? saved.end : end,
    };
  };

  // ---------- Title (MathfieldElement) ----------
  useEffect(() => {
    if (!questionDetails) return;
    if (!titleView.current) titleView.current = new MathfieldElement();

    const { title } = getDefaults();
    const tv = titleView.current;
    tv.value = String.raw`${title}`;
    tv.readOnly = true;

    Object.assign(tv.style, {
      width: '100%',
      margin: '0.5rem 0',
      fontWeight: 'bold',
      fontSize: '1.25rem',
      boxSizing: 'border-box',
    });

    if (titleRef.current && !titleRef.current.contains(tv)) {
      titleRef.current.appendChild(tv);
    }
  }, [questionDetails?.title]);

  // ---------- Load JSXGraph from CDN ----------
  useEffect(() => {
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css';

    const scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.src = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js';
    scriptEl.onload = () => setScriptLoaded(true);

    document.head.appendChild(linkEl);
    document.head.appendChild(scriptEl);

    return () => {
      try {
        document.head.removeChild(linkEl);
        document.head.removeChild(scriptEl);
      } catch {
        /* ignore */
      }
    };
  }, []);

  // ---------- Init board ----------
  useEffect(() => {
    if (!scriptLoaded || !window.JXG || !boardContainerRef.current) return;

    const { JXG } = window;
    const { boundingBox, axis, strokeColor, snap } = getDefaults();
    const { start, end } = loadSavedOrDefaults();

    const brd = JXG.JSXGraph.initBoard(boardContainerRef.current, {
      boundingbox: boundingBox,
      axis,
      pan: { enabled: true, needTwoFingers: true, needShift: true },
      showCopyright: false,
    });
    boardRef.current = brd;

    // light grid
    brd.create('grid', [], { strokeColor: '#eee' });

    // points
    const P = brd.create('point', start, {
      name: 'P',
      withLabel: true,
      size: 4,
      strokeColor: '#374151',
      fillColor: '#374151',
      label: { offset: [8, -12] },
      showInfobox: true,
    });
    const Q = brd.create('point', end, {
      name: 'Q',
      withLabel: true,
      size: 4,
      strokeColor: '#374151',
      fillColor: '#374151',
      label: { offset: [8, -12] },
      showInfobox: true,
    });
    PRef.current = P;
    QRef.current = Q;

    // arrow PQ
    const vec = brd.create('line', [P, Q], {
      straightFirst: false,
      straightLast: false,
      lastArrow: true,
      strokeColor,
      strokeWidth: 3,
    });
    arrowRef.current = vec;

    const update = () => {
      saveAnswer();
      brd.update();
    };

    P.on('drag', update);
    Q.on('drag', update);

    const snapPoint = (pt) => {
      if (!snap || snap <= 0) return;
      const [sx, sy] = snapIfNeeded(pt.X(), pt.Y(), snap);
      pt.moveTo([sx, sy], 0);
      update();
    };
    P.on('up', () => snapPoint(P));
    Q.on('up', () => snapPoint(Q));

    // initial save
    saveAnswer();

    return () => {
      try {
        brd.off('down');
        brd.off('up');
        brd.off('move');
        window.JXG.JSXGraph.freeBoard(brd);
      } catch {
        /* ignore */
      }
      boardRef.current = null;
      PRef.current = null;
      QRef.current = null;
      arrowRef.current = null;
    };
  }, [scriptLoaded]);

  // ---------- reflect late-arriving saved progress ----------
  useEffect(() => {
    if (!boardRef.current || !PRef.current || !QRef.current) return;
    const saved = progress?.componentProgress?.[index]?.vector;
    if (!saved?.start || !saved?.end) return;
    PRef.current.moveTo(saved.start, 0);
    QRef.current.moveTo(saved.end, 0);
    boardRef.current.update();
  }, [progress?.componentProgress?.[index]?.vector]);

  // ---------- UI actions ----------
  const onReset = () => {
    const { start, end } = getDefaults();
    if (!PRef.current || !QRef.current || !boardRef.current) return;
    PRef.current.moveTo(start, 0);
    QRef.current.moveTo(end, 0);
    saveAnswer();
    boardRef.current.update();
  };

  const onSwap = () => {
    if (!PRef.current || !QRef.current || !boardRef.current) return;
    const s = [PRef.current.X(), PRef.current.Y()];
    const e = [QRef.current.X(), QRef.current.Y()];
    PRef.current.moveTo(e, 0);
    QRef.current.moveTo(s, 0);
    saveAnswer();
    boardRef.current.update();
  };

  // ---------- render ----------
  return (
    <div>
      <div ref={titleRef} style={{ width: '100%' }} />

      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 0,
          padding: '0 1rem 0.75rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '620px', aspectRatio: '1 / 1', position: 'relative' }}>
          <div
            ref={boardContainerRef}
            style={{ position: 'absolute', inset: 0, margin: '1rem 0', borderRadius: 12, overflow: 'hidden' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 1rem 1rem' }}>
        <button
          type="button"
          onClick={onReset}
          style={{
            padding: '6px 10px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            background: '#f9fafb',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onSwap}
          style={{
            padding: '6px 10px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            background: '#f9fafb',
            cursor: 'pointer',
          }}
        >
          Swap to → QP
        </button>
      </div>
    </div>
  );
}
