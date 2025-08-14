'use client'; // Ensure this is a Client Component
import React, { useRef, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import {
  Row,
  Button,
  Col,
  Card,
  CardSubtitle,
  ListGroup,
  ListGroupItem,
  CardBody,
  Nav, 
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import { useGradeSketchQuestionMutation, useUpdateQuestionProgressMutation } from '@/lib/redux/slices/apiSlice';
import { useQuestionStore } from '@/lib/zustand/providers/question-state-provider';

export default function Sketch({ question }) {
  const boardContainerRef = useRef(null);
  const boardRef = useRef(null);
  const pointsRef = useRef([]);   // current draggable points on the board
  const curveRef = useRef(null);  // current Lagrange curve on the board

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [reducedCoordinates, setReducedCoordinates] = useState([]); // State to store reduced coordinates

  const [gradeSketchQuestion, mutationStateA] = useGradeSketchQuestionMutation();
  const [updateUserProgress, mutationStateB] = useUpdateQuestionProgressMutation();
  const { user } = useUser();

  const { updateProgress } = useQuestionStore();
  const progress = useQuestionStore((state) => state.userProgress);

  // --- helpers --------------------------------------------------------------

  const clearDrawing = (board) => {
    if (!board) return;
    if (curveRef.current) board.removeObject(curveRef.current);
    pointsRef.current.forEach((p) => board.removeObject(p));
    pointsRef.current = [];
    curveRef.current = null;
  };

  const syncReduced = () => {
    const data = pointsRef.current.map((p) => ({
      x: p.X(),
      y: p.Y(),
      label: p.name ?? p.label?.textStr ?? '',
    }));
    setReducedCoordinates(data);
    return data;
  };

  // (re)build points + curve from a coordinates array
  const buildFromCoords = (board, coords, labelsFallback) => {
    if (!board || !coords?.length) return;

    clearDrawing(board);

    const labels =
      coords.map((c) => c.label).some(Boolean)
        ? coords.map((c) => c.label || '')
        : labelsFallback ?? ['1st root', '2nd root', 'y-intercept'];

    pointsRef.current = coords.map((c, i) =>
      board.create('point', [c.x, c.y], {
        name: labels[i] || `P${i + 1}`,
        withLabel: true,
        size: 4,
        strokeColor: '#e67e22',
        fillColor: '#e67e22',
        label: { offset: [8, -12], fontSize: 14, color: '#17a2b8' },
        showInfobox: true,
      })
    );

    // keep state in sync and re-save on release
    syncReduced();
    pointsRef.current.forEach((pt) => {
      pt.on('drag', () => syncReduced());
      pt.on('up', () => {
        const newReduced = syncReduced();
        updateProgress({ coordinates: newReduced });
      });
    });

    curveRef.current = board.create(
      'functiongraph',
      [window.JXG.Math.Numerics.lagrangePolynomial(pointsRef.current)],
      { strokeColor: '#000000', strokeWidth: 3, lineCap: 'round' }
    );
  };

  // -------------------------------------------------------------------------
useEffect(()=>{
console.log('the global userprogress is ', progress)
},[progress])
  // Load JSXGraph
  useEffect(() => {
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.type = 'text/css';
    linkEl.href = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css';

    const scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.charset = 'UTF-8';
    scriptEl.src = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js';
    scriptEl.onload = () => setScriptLoaded(true);

    document.head.appendChild(linkEl);
    document.head.appendChild(scriptEl);

    return () => {
      if (scriptEl) document.head.removeChild(scriptEl);
      if (linkEl) document.head.removeChild(linkEl);
    };
  }, []);

  // Init board + sketch interactions
  useEffect(() => {
    if (!scriptLoaded) return;
    if (!window.JXG) {
      console.error('JSXGraph not found on window. The script might have failed to load.');
      return;
    }

    const { JXG } = window;
    const board = JXG.JSXGraph.initBoard(boardContainerRef.current, {
      boundingbox: [-10, 10, 10, -10],
      axis: true,
      pan: { enabled: true, needTwoFingers: true, needShift: true },
      showCopyright: false,
    });
    boardRef.current = board;

    const degree = question.degree;
    board.BOARD_MODE_SKETCH = 0x0100;

    let sketch;

    const labelsFallback =
      question?.marking?.guide?.['graph-values']?.map((g) => g.label) ?? null;

    // Start sketch
    board.on('down', () => {
      if (board.mode !== board.BOARD_MODE_NONE) return;
      board.mode = board.BOARD_MODE_SKETCH;

      sketch = board.create('curve', [[], []], {
        strokeColor: '#bbbbbb',
        lineCap: 'round',
        strokeWidth: 6,
      });
    });

    // Finish sketch -> simplify -> points -> curve
    board.on('up', () => {
      if (board.mode !== board.BOARD_MODE_SKETCH) return;
      board.mode = board.BOARD_MODE_NONE;

      // remove old drawing
      clearDrawing(board);

      // Collect raw coords from sketch
      const coords = [];
      for (let i = 0; i < sketch.dataX.length; i++) {
        coords.push(new JXG.Coords(JXG.COORDS_BY_USER, [sketch.dataX[i], sketch.dataY[i]], board));
      }

      // Simplify
      const reduced = JXG.Math.Numerics.Visvalingam(coords, degree - 1);

      // Create points at simplified coords
      pointsRef.current = reduced.map((r, i) => {
        const x = r.usrCoords[1];
        const y = r.usrCoords[2];
        return board.create('point', [x, y], {
          name: (labelsFallback && labelsFallback[i]) || `P${i + 1}`,
          withLabel: true,
          size: 4,
          strokeColor: '#e67e22',
          fillColor: '#e67e22',
          label: { offset: [8, -12], fontSize: 14, color: '#17a2b8' },
          showInfobox: true,
        });
      });

      // Sync state + save on release
      syncReduced();
      updateProgress({ coordinates: syncReduced() });
      pointsRef.current.forEach((pt) => {
        pt.on('drag', () => syncReduced());
        pt.on('up', () => {
          const newReduced = syncReduced();
          updateProgress({ coordinates: newReduced });
        });
      });

      // Build curve
      curveRef.current = board.create(
        'functiongraph',
        [JXG.Math.Numerics.lagrangePolynomial(pointsRef.current)],
        { strokeColor: '#000000', strokeWidth: 3, lineCap: 'round' }
      );

      // Remove raw sketch
      board.removeObject(sketch);
    });

    // While sketching, add points
    board.on('move', (evt, mode) => {
      if (mode !== board.BOARD_MODE_SKETCH) return;
      const pos = board.getMousePosition(evt);
      const c = new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, board);
      sketch.dataX.push(c.usrCoords[1]);
      sketch.dataY.push(c.usrCoords[2]);
      board.update();
    });

    // If we already have saved coordinates, draw them now
    if (progress?.coordinates?.length) {
      buildFromCoords(board, progress.coordinates, labelsFallback);
    }

    // cleanup
    return () => {
      board.off('down');
      board.off('up');
      board.off('move');
      window.JXG.JSXGraph.freeBoard(board);
      boardRef.current = null;
      pointsRef.current = [];
      curveRef.current = null;
    };
  }, [scriptLoaded, question.degree]);

  // If progress arrives/changes later (e.g., async), reflect it on the board
  useEffect(() => {
    if (!boardRef.current) return;
    const labelsFallback =
      question?.marking?.guide?.['graph-values']?.map((g) => g.label) ?? null;

    if (progress?.coordinates?.length) {
      buildFromCoords(boardRef.current, progress.coordinates, labelsFallback);
    }
  }, [progress?.coordinates, question?.marking, question.degree]);

  const handleSubmit = async () => {
    console.log('The submitted coordinates are', reducedCoordinates);
    console.log('The submitted Question data is ', question);

    const dataForFeedback = {
      questionData: question,
      reducedCoordinates: reducedCoordinates,
    };
    const resp = await gradeSketchQuestion(dataForFeedback).unwrap();
    const feedback = resp?.data?.feedback?.feedback;
    const isCorrect = resp?.data?.feedback?.correct;

    const status = isCorrect ? 'complete' : 'incomplete';
    const newProgress = {
      ...progress,
      feedback: [...(progress.feedback || []), feedback],
      attempts: (progress.attempts || 0) + 1,
      status,
      coordinates: reducedCoordinates, // keep latest
    };

    updateProgress(newProgress);

    const { id, unsafeMetadata } = user || {};
    const { examBoard } = unsafeMetadata || {};

    const collectionIdentifier = {
      id,
      examBoard,
      title: question.title, // fixed (was undefined)
      branch: question.branch,
      year: question.year,
    };

    const data = { collectionIdentifier, progress: newProgress };
    await updateUserProgress(data);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: 0,
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', padding: '1rem 0', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, color: '#17a2b8', fontWeight: 'bold' }}>
          {question.title.replace(/-/g, ' ')}
        </h1>
        <h3>
          <Latex>${question.latex}$</Latex>
        </h3>
      </div>

      {/* Graph area */}
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 0,
          padding: '0 1rem 2rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '600px', aspectRatio: '1 / 1', position: 'relative' }}>
          <div
            ref={boardContainerRef}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, margin: '1rem 0' }}
          />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginTop: '1rem' }}>
        <Button style={{ marginTop: '1rem', alignSelf: 'center', maxWidth: '10%' }} color="secondary" outline block>
          Hint
        </Button>
        <Button style={{ marginTop: '1rem', alignSelf: 'center', maxWidth: '10%' }} color="secondary" outline block>
          Save
        </Button>
        <Button
          style={{ marginTop: '1rem', alignSelf: 'center', width: '40%' }}
          color="info"
          outline
          block
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button style={{ marginTop: '1rem', alignSelf: 'center', maxWidth: '10%' }} color="secondary" outline block>
          Reset
        </Button>
        <Button style={{ marginTop: '1rem', alignSelf: 'center', maxWidth: '10%' }} color="secondary" outline block>
          Next
        </Button>
      </div>
    </div>
  );
}
