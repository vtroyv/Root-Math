'use client'; // Ensure this is a Client Component
import React, { useRef, useEffect, useState } from 'react';

export default function Sketch() {
  const boardContainerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // 1) Dynamically create the <link> for JSXGraph's CSS
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.type = 'text/css';
    linkEl.href = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css';

    // 2) Dynamically create the <script> for JSXGraph's core
    const scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.charset = 'UTF-8';
    scriptEl.src = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js';

    // When script finishes loading, we can safely call "window.JXG"
    scriptEl.onload = () => {
      setScriptLoaded(true);
    };

    // Append them to the document
    document.head.appendChild(linkEl);
    document.head.appendChild(scriptEl);

    // Cleanup on unmount: remove the script + CSS
    return () => {
      if (scriptEl) {
        document.head.removeChild(scriptEl);
      }
      if (linkEl) {
        document.head.removeChild(linkEl);
      }
    };
  }, []);

  // Once the script is loaded, init the JSXGraph board
  useEffect(() => {
    if (!scriptLoaded) return;
    if (!window.JXG) {
      console.error('JSXGraph not found on window. The script might have failed to load.');
      return;
    }

    // Initialize the board
    const { JXG } = window;
   const board = JXG.JSXGraph.initBoard(boardContainerRef.current, {
  boundingbox: [-10, 10, 10, -10],
  axis: true,
  pan: { enabled: true, needTwoFingers: true, needShift: true },

  // Hide the top bar
//   showNavigation: false,      // removes the entire top "navbar"
  // or showFullscreen: false,
  // or showScreenshot: false,

  // If you see any extra text or links:
  showCopyright: false,
//   showInfobox: false,
});
    // Example: slider for polynomial degree
    const degree = board.create('slider', [
      [1, 8],
      [7, 8],
      [1, 3, 10],
    ], {
      name: 'degree',
      snapWidth: 1,
      digits: 0,
    });

    board.BOARD_MODE_SKETCH = 0x0100;
    let sketch, curve;
    let points = [];

    // On 'down': start a sketch curve
    board.on('down', () => {
      if (board.mode !== board.BOARD_MODE_NONE) return;
      board.mode = board.BOARD_MODE_SKETCH;

      sketch = board.create('curve', [[], []], {
        strokeColor: '#bbbbbb',
        lineCap: 'round',
        strokeWidth: 10,
      });
    });

    // On 'up': convert to a Lagrange polynomial
    board.on('up', () => {
      if (board.mode !== board.BOARD_MODE_SKETCH) return;

      if (JXG.exists(curve)) {
        board.removeObject(curve);
        board.removeObject(points);
      }
      board.mode = board.BOARD_MODE_NONE;

      // Collect raw coordinates from the sketch
      const coords = [];
      for (let i = 0; i < sketch.dataX.length; i++) {
        coords.push(
          new JXG.Coords(JXG.COORDS_BY_USER, [sketch.dataX[i], sketch.dataY[i]], board)
        );
      }

      // Simplify the path
      const reduced = JXG.Math.Numerics.Visvalingam(coords, degree.Value() - 1);

      // Create new points
      points = [];
      for (let r of reduced) {
        const x = r.usrCoords[1];
        const y = r.usrCoords[2];
        points.push(board.create('point', [x, y], {
          size: 5,
          withLabel: false,
        }));
      }

      // Build a polynomial through these points
      curve = board.create('functiongraph', [
        JXG.Math.Numerics.lagrangePolynomial(points),
      ], {
        strokeColor: '#000000',
        strokeWidth: 3,
        lineCap: 'round',
      });

      // Remove the raw sketch curve
      board.removeObject(sketch);
    });

    // On 'move': add points to the sketch
    board.on('move', (evt, mode) => {
      if (mode !== board.BOARD_MODE_SKETCH) return;
      const pos = board.getMousePosition(evt);
      const c = new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, board);
      sketch.dataX.push(c.usrCoords[1]);
      sketch.dataY.push(c.usrCoords[2]);
      board.update();
    });

    // Cleanup: remove event listeners + free board
    return () => {
      board.off('down');
      board.off('up');
      board.off('move');
      JXG.JSXGraph.freeBoard(board);
    };
  }, [scriptLoaded]);

  return (
    <div
      ref={boardContainerRef}
      style={{ width: '600px', height: '600px', margin: 'auto' }}
    />
  );
}
