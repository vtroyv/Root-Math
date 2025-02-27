'use client';
import React, { useRef, useEffect, useState } from 'react';

// Optional: if you need a polyfill for older browsers
// import ResizeObserver from 'resize-observer-polyfill';

export default function CurveSketch({ question, onDataChange }) {
  const boardContainerRef = useRef(null);
  const boardRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [reducedCoordinates, setReducedCoordinates] = useState([]);

  // 1. Dynamically load JSXGraph CSS + script
  useEffect(() => {
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css';

    const scriptEl = document.createElement('script');
    scriptEl.src = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js';
    scriptEl.onload = () => {
      setScriptLoaded(true);
    };

    document.head.appendChild(linkEl);
    document.head.appendChild(scriptEl);

    return () => {
      if (scriptEl) document.head.removeChild(scriptEl);
      if (linkEl) document.head.removeChild(linkEl);
    };
  }, []);

  // 2. Initialize the board once the script is loaded
  useEffect(() => {
    if (!scriptLoaded) return;
    if (!window.JXG) {
      console.error('JSXGraph not found on window.');
      return;
    }

    const { JXG } = window;
    const board = JXG.JSXGraph.initBoard(boardContainerRef.current, {
      boundingbox: [-10, 10, 10, -10],
      axis: true,
      pan: { enabled: true, needTwoFingers: true, needShift: true },
      showCopyright: false
    });
    boardRef.current = board;

    // The rest of your “sketch” logic...
    const degree =  5;
    board.BOARD_MODE_SKETCH = 0x0100;
    let sketch = null;
    let curve = null;
    let points = [];

    // Helper to update reduced coords
    const updateReducedCoordinates = () => {
      const coords = points.map(p => new JXG.Coords(JXG.COORDS_BY_USER, [p.X(), p.Y()], board));
      const reduced = JXG.Math.Numerics.Visvalingam(coords, degree - 1);
      const newCoords = reduced.map(r => ({ x: r.usrCoords[1], y: r.usrCoords[2] }));
      setReducedCoordinates(newCoords);
      if (onDataChange) {
        onDataChange(newCoords);
      }
    };

    // “down” event
    board.on('down', () => {
      if (board.mode !== board.BOARD_MODE_NONE) return;
      board.mode = board.BOARD_MODE_SKETCH;
      setReducedCoordinates([]);
      sketch = board.create('curve', [[], []], {
        strokeColor: '#bbbbbb',
        lineCap: 'round',
        strokeWidth: 6,
      });
    });

    // “up” event
    board.on('up', () => {
      if (board.mode !== board.BOARD_MODE_SKETCH) return;

      if (curve && JXG.exists(curve)) {
        board.removeObject(curve);
        points.forEach(pt => board.removeObject(pt));
        points = [];
      }
      board.mode = board.BOARD_MODE_NONE;

      // Collect raw coords
      const coords = sketch.dataX.map((x, i) => {
        return new JXG.Coords(JXG.COORDS_BY_USER, [x, sketch.dataY[i]], board);
      });
      // Visvalingam
      const reduced = JXG.Math.Numerics.Visvalingam(coords, degree - 1);

      // Create points
      points = reduced.map(r => {
        const x = r.usrCoords[1];
        const y = r.usrCoords[2];
        return board.create('point', [x, y], {
          size: 5,
          withLabel: false
        });
      });
      // Drag event to recalc coords
      points.forEach(pt => {
        pt.on('drag', () => updateReducedCoordinates());
      });
      updateReducedCoordinates();

      // Lagrange polynomial
      curve = board.create('functiongraph', [
        JXG.Math.Numerics.lagrangePolynomial(points)
      ], {
        strokeColor: '#000000',
        strokeWidth: 3,
        lineCap: 'round'
      });

      board.removeObject(sketch);
      sketch = null;
    });

    // “move” event
    board.on('move', (evt, mode) => {
      if (mode !== board.BOARD_MODE_SKETCH) return;
      const pos = board.getMousePosition(evt);
      const c = new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, board);
      sketch.dataX.push(c.usrCoords[1]);
      sketch.dataY.push(c.usrCoords[2]);
      board.update();
    });

    return () => {
      board.off('down');
      board.off('up');
      board.off('move');
      JXG.JSXGraph.freeBoard(board);
    };
  }, [scriptLoaded,  onDataChange]);

  // 3. Use a ResizeObserver to resize the board whenever the container changes size
  useEffect(() => {
    if (!scriptLoaded || !boardRef.current) return;

    // If you need a polyfill, uncomment import above or install 'resize-observer-polyfill'
    const ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Resize the board to the new container dimensions
        boardRef.current.resizeContainer(width, height);
        // Optionally preserve the bounding box or re-set it:
        // boardRef.current.setBoundingBox([-10, 10, 10, -10], false);
        boardRef.current.update();
      }
    });
    ro.observe(boardContainerRef.current);

    return () => {
      ro.disconnect();
    };
  }, [scriptLoaded]);

  return (
    <div
      ref={boardContainerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px'
      }}
    />
  );
}
