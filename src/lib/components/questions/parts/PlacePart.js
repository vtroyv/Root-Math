'use client';
import { useEffect, useRef, useState } from 'react';
import loadJSXGraph from './loadJSXGraph';

/*
`place` part: drag points and/or vector arrows on a grid.
  part.given   - fixed reference objects (grey):  { kind: 'point', at, label } | { kind: 'vector', from, to, label }
  part.objects - objects the student drags (orange): { kind: 'point', start, label } | { kind: 'vector', start: { from, to }, label }
  part.snap    - grid step to snap to (e.g. 1 or 0.5), omit for free placement
Response shape: { objects: [{ at } | { from, to }] }  (same order as part.objects)
*/

const ORANGE = '#e67e22';
const GREY = '#6c757d';
const GREEN = '#28a745';
const RED = '#dc3545';
const round = (v) => Math.round(v * 1e4) / 1e4;
// JSXGraph writes into the coordinate arrays it is given, but the question comes from
// RTK Query, which freezes it, so always hand JSXGraph its own copies.
const copy = (value) => (Array.isArray(value) ? value.map(copy) : value);

export default function PlacePart({ part, response, result, onChange, locked }) {
  const boxRef = useRef(null);
  const boardRef = useRef(null);
  const objectsRef = useRef([]); // [{ kind, points: [JXG.Point...], arrow }]
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let board;
    let cancelled = false;

    loadJSXGraph()
      .then((JXG) => {
        if (cancelled || !boxRef.current) return;
        board = JXG.JSXGraph.initBoard(boxRef.current, {
          boundingbox: copy(part.boundingBox ?? [-6, 6, 6, -6]),
          axis: true,
          showCopyright: false,
          // same as the original Sketch component: JSXGraph's navigation bar (− o + and arrows)
          // stays visible, and panning needs Shift held so it never clashes with dragging
          pan: { enabled: true, needTwoFingers: true, needShift: true },
        });
        boardRef.current = board;
        board.create('grid', [], { strokeColor: '#eee' });

        const fixedStyle = { fixed: true, highlight: false, strokeColor: GREY, fillColor: GREY };
        (part.given ?? []).forEach((g) => {
          if (g.kind === 'point') {
            board.create('point', copy(g.at), { ...fixedStyle, name: g.label ?? '', size: 3 });
          } else {
            board.create('arrow', [copy(g.from), copy(g.to)], { ...fixedStyle, strokeWidth: 3, name: g.label ?? '', withLabel: true });
          }
        });

        const snap = part.snap ? { snapToGrid: true, snapSizeX: part.snap, snapSizeY: part.snap } : {};
        const dragStyle = { ...snap, highlight: false, strokeColor: ORANGE, fillColor: ORANGE, fixed: locked };

        objectsRef.current = (part.objects ?? []).map((object, i) => {
          const saved = response?.objects?.[i];
          if (object.kind === 'point') {
            const p = board.create('point', copy(saved?.at ?? object.start ?? [0, 0]), { ...dragStyle, name: object.label ?? '', size: 4 });
            p.on('up', emit);
            return { kind: 'point', points: [p] };
          }
          const from = copy(saved?.from ?? object.start?.from ?? [0, 0]);
          const to = copy(saved?.to ?? object.start?.to ?? [1, 1]);
          const tail = board.create('point', from, { ...dragStyle, name: '', size: 3 });
          const head = board.create('point', to, { ...dragStyle, name: '', size: 4 });
          const arrow = board.create('arrow', [tail, head], {
            highlight: false,
            strokeColor: ORANGE,
            strokeWidth: 3,
            name: object.label ?? '',
            withLabel: true,
          });
          tail.on('up', emit);
          head.on('up', emit);
          return { kind: 'vector', points: [tail, head], arrow };
        });
      })
      .catch((error) => setLoadError(error.message));

    function emit() {
      const objects = objectsRef.current.map((o) =>
        o.kind === 'point'
          ? { at: [round(o.points[0].X()), round(o.points[0].Y())] }
          : {
              from: [round(o.points[0].X()), round(o.points[0].Y())],
              to: [round(o.points[1].X()), round(o.points[1].Y())],
            },
      );
      onChangeRef.current({ objects });
    }

    return () => {
      cancelled = true;
      if (board) window.JXG.JSXGraph.freeBoard(board);
      boardRef.current = null;
      objectsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // lock / unlock dragging
  useEffect(() => {
    objectsRef.current.forEach((o) => o.points.forEach((p) => p.setAttribute({ fixed: locked })));
  }, [locked]);

  // colour each object from the marking result
  useEffect(() => {
    const states = result?.details?.objects;
    objectsRef.current.forEach((o, i) => {
      const colour = states ? (states[i] ? GREEN : RED) : ORANGE;
      o.points.forEach((p) => p.setAttribute({ strokeColor: colour, fillColor: colour }));
      o.arrow?.setAttribute({ strokeColor: colour });
    });
    boardRef.current?.update();
  }, [result]);

  if (loadError) return <p style={{ color: RED }}>The graph couldn&apos;t load: {loadError}</p>;

  return (
    <div style={{ width: '100%', maxWidth: '520px', aspectRatio: '1 / 1', position: 'relative', margin: '0 auto' }}>
      <div ref={boxRef} style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}
