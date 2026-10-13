'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'reactstrap';
import loadJSXGraph from './loadJSXGraph';

/*
`sketch` part: the student draws a curve freehand; it's simplified to `degree + 1`
draggable handles and a polynomial is drawn through them (Lagrange interpolation).
The server marks by checking the curve passes close to each hidden key point,
so the handles don't have to sit exactly on the roots / intercepts.
Response shape: { points: [{ x, y }] }
*/

const HANDLE = '#e67e22';
const round = (v) => Math.round(v * 1e4) / 1e4;

export default function SketchPart({ part, response, onChange, locked }) {
  const boxRef = useRef(null);
  const boardRef = useRef(null);
  const handlesRef = useRef([]);
  const curveRef = useRef(null);
  const lockedRef = useRef(locked);
  lockedRef.current = locked;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [loadError, setLoadError] = useState(null);

  const degree = part.degree ?? 2;

  const clearDrawing = () => {
    const board = boardRef.current;
    if (!board) return;
    if (curveRef.current) board.removeObject(curveRef.current);
    handlesRef.current.forEach((p) => board.removeObject(p));
    handlesRef.current = [];
    curveRef.current = null;
  };

  const emit = () => {
    onChangeRef.current({ points: handlesRef.current.map((p) => ({ x: round(p.X()), y: round(p.Y()) })) });
  };

  const drawHandles = (coords) => {
    const board = boardRef.current;
    const JXG = window.JXG;
    clearDrawing();
    handlesRef.current = coords.map(([x, y], i) => {
      const p = board.create('point', [x, y], {
        name: part.handleLabels?.[i] ?? `P${i + 1}`,
        size: 4,
        strokeColor: HANDLE,
        fillColor: HANDLE,
        highlight: false,
        fixed: lockedRef.current,
        label: { offset: [8, -12], fontSize: 14 },
      });
      p.on('up', emit);
      return p;
    });
    curveRef.current = board.create('functiongraph', [JXG.Math.Numerics.lagrangePolynomial(handlesRef.current)], {
      strokeColor: '#000',
      strokeWidth: 3,
      highlight: false,
    });
  };

  useEffect(() => {
    let board;
    let cancelled = false;

    loadJSXGraph()
      .then((JXG) => {
        if (cancelled || !boxRef.current) return;
        board = JXG.JSXGraph.initBoard(boxRef.current, {
          // copied: the question is frozen by RTK Query and JSXGraph writes into this array
          boundingbox: [...(part.boundingBox ?? [-10, 10, 10, -10])],
          axis: true,
          showCopyright: false,
          // same as the original Sketch component: JSXGraph's navigation bar (− o + and arrows)
          // stays visible, and panning needs Shift held so it never clashes with drawing
          pan: { enabled: true, needTwoFingers: true, needShift: true },
        });
        boardRef.current = board;
        board.BOARD_MODE_SKETCH = 0x0100;
        let stroke = null;

        // start a freehand stroke (only when not dragging a handle)
        board.on('down', () => {
          if (lockedRef.current || board.mode !== board.BOARD_MODE_NONE) return;
          board.mode = board.BOARD_MODE_SKETCH;
          stroke = board.create('curve', [[], []], { strokeColor: '#bbb', strokeWidth: 6, lineCap: 'round', highlight: false });
        });

        board.on('move', (evt, mode) => {
          if (mode !== board.BOARD_MODE_SKETCH || !stroke) return;
          const c = new JXG.Coords(JXG.COORDS_BY_SCREEN, board.getMousePosition(evt), board);
          stroke.dataX.push(c.usrCoords[1]);
          stroke.dataY.push(c.usrCoords[2]);
          board.update();
        });

        // finish: simplify the stroke to degree + 1 points and fit the curve
        board.on('up', () => {
          if (board.mode !== board.BOARD_MODE_SKETCH) return;
          board.mode = board.BOARD_MODE_NONE;
          const raw = stroke.dataX.map((x, i) => new JXG.Coords(JXG.COORDS_BY_USER, [x, stroke.dataY[i]], board));
          board.removeObject(stroke);
          stroke = null;
          if (raw.length < degree + 1) return; // a tap, not a stroke
          const reduced = JXG.Math.Numerics.Visvalingam(raw, degree - 1);
          drawHandles(reduced.map((r) => [r.usrCoords[1], r.usrCoords[2]]));
          emit();
        });

        // restore a saved sketch
        if (response?.points?.length) drawHandles(response.points.map((p) => [p.x, p.y]));
      })
      .catch((error) => setLoadError(error.message));

    return () => {
      cancelled = true;
      if (board) window.JXG.JSXGraph.freeBoard(board);
      boardRef.current = null;
      handlesRef.current = [];
      curveRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handlesRef.current.forEach((p) => p.setAttribute({ fixed: locked }));
  }, [locked]);

  if (loadError) return <p style={{ color: '#dc3545' }}>The graph couldn&apos;t load: {loadError}</p>;

  return (
    <div>
      <p style={{ fontSize: '0.9rem', margin: '0 0 0.5rem' }}>
        Draw the curve in one stroke, then drag the orange points to adjust it.
      </p>
      <div style={{ width: '100%', maxWidth: '520px', aspectRatio: '1 / 1', position: 'relative', margin: '0 auto' }}>
        <div ref={boxRef} style={{ position: 'absolute', inset: 0 }} />
      </div>
      {!locked && (
        <Button
          size="sm"
          outline
          style={{ marginTop: '0.5rem' }}
          onClick={() => {
            clearDrawing();
            onChange(undefined);
          }}
        >
          Clear sketch
        </Button>
      )}
    </div>
  );
}
