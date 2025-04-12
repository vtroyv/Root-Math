'use client';
import React, { useRef, useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { useLessonStore } from '@/lib/zustand/providers/lesson-state-provider';

/*
TO DO: (Heavy on sympy )
- look at the sketch.js question and see if we can use the same logic to get the reduced coordinates
- using the same logic that the sketch.js component updates the reduced coordinates - use this to update global state to store the reduced coordinates (time for more zustand)
- On submit send the reduced coordinates as well as question data about the problem
- On the server side, create a framework for the following logic: 
  -1. Use the reduced coordinates from client to create lagrange interpolation of the users sketch 
  -2. Using this interpolated function, store its key points e.g. roots/turning points, axis-intercepts etc in a list
  -3. Next using the original function from the problem, determine its key points e.g. roots/turning points, axis-intercepts etc in a list
      - note this list for the original function could be predefined in the database and thus sent over to fastapi from the client
  -4. Compare the two lists and determine if they are similar enough to be considered correct- e.g. have a threshold
  -5. Based on which points are correct (e.g. near enough) we can provide insightful feedback on where the student went wrong
  -6. We could also store and obtain additional information e.g. curve shapes, limits etc and use it to help aid our comparison between our approximation of the student’s sketch and the original function

- Create some logic to determine the limits of a student’s sketch, perhaps by using the lagrange interpolation function of the student’s work and evaluating it at large values of ±x
- Once more, be able to provide accurate feedback off this.
*/

export default function CurveSketch({ task, onDataChange }) {
  const boardContainerRef = useRef(null);
  const boardRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [reducedCoordinates, setReducedCoordinates] = useState([]);

  // Zustand hook for updating the global task state
  const updateTaskState = useLessonStore((state) => state.updateTaskState);

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

    const degree = 2; // Hardcoded; later you may load this dynamically.
    board.BOARD_MODE_SKETCH = 0x0100;
    let sketch = null;
    let curve = null;
    let points = [];

    // This function computes the reduced coordinates and updates local state.
    // It returns the computed coordinates so they can be sent to global state as needed.
    const updateReducedCoordinates = () => {
      const coords = points.map(p => new JXG.Coords(JXG.COORDS_BY_USER, [p.X(), p.Y()], board));
      const reduced = JXG.Math.Numerics.Visvalingam(coords, degree - 1);
      const newReducedCoords = reduced.map(r => ({
        x: r.usrCoords[1],
        y: r.usrCoords[2],
      }));
      setReducedCoordinates(newReducedCoords);
      return newReducedCoords;
    };

    // “down” event: Begin the sketch.
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

    // “up” event: Finalize sketch and update global state.
    board.on('up', () => {
      if (board.mode !== board.BOARD_MODE_SKETCH) return;

      // If an existing curve exists, remove it and reset points.
      if (curve && JXG.exists(curve)) {
        board.removeObject(curve);
        points.forEach(pt => board.removeObject(pt));
        points = [];
      }
      board.mode = board.BOARD_MODE_NONE;

      // Collect raw coordinates from the sketch.
      const coords = sketch.dataX.map((x, i) =>
        new JXG.Coords(JXG.COORDS_BY_USER, [x, sketch.dataY[i]], board)
      );

      // Use the Visvalingam algorithm to reduce the collected points.
      const reduced = JXG.Math.Numerics.Visvalingam(coords, degree - 1);

      // Create board points at the reduced coordinates.
      points = reduced.map(r => {
        const x = r.usrCoords[1];
        const y = r.usrCoords[2];
        return board.create('point', [x, y], {
          size: 5,
          withLabel: false
        });
      });

      // Update local and global state after finishing sketch.
      const finalReducedCoords = updateReducedCoordinates();
      updateTaskState({ title: task.title, reducedCoordinates: finalReducedCoords });

      // Attach events to each reduced point.
      points.forEach(pt => {
        // (Optional) Update local state continuously while dragging.
        pt.on('drag', () => {
          updateReducedCoordinates();
        });
        // Update global state only when the user releases the point.
        pt.on('up', () => {
          const newReducedCoords = updateReducedCoordinates();
          updateTaskState({ title: task.title, reducedCoordinates: newReducedCoords });
        });
      });

      // Create the Lagrange polynomial curve from the reduced points.
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

    // “move” event: Update the sketch while drawing.
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
  }, [scriptLoaded]);

  // 3. Resize the board when the container size changes using a ResizeObserver.
  useEffect(() => {
    if (!scriptLoaded || !boardRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        boardRef.current.resizeContainer(width, height);
        boardRef.current.update();
      }
    });
    ro.observe(boardContainerRef.current);

    return () => {
      ro.disconnect();
    };
  }, [scriptLoaded]);

  console.log('The coordinates are ', reducedCoordinates);

  return (
    <>
      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 'bold' }}>
            <Latex style={{ fontFamily: 'Cabin Sketch' }}>{task.title}</Latex>
          </h3>
        </div>
        <div
          ref={boardContainerRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '400px'
          }}
        />
      </div>
    </>
  );
}
