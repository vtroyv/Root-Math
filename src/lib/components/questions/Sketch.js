'use client'; // Ensure this is a Client Component
import React, { useRef, useEffect, useState } from 'react';
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
import { useGradeSketchQuestionMutation } from '@/lib/redux/slices/apiSlice';

export default function Sketch({ question }) {
  const boardContainerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [reducedCoordinates, setReducedCoordinates] = useState([]); // State to store reduced coordinates
  const [gradeSketchQuestion, mutationState] = useGradeSketchQuestionMutation()

  useEffect(() => {
    // Dynamically create the <link> for JSXGraph's CSS
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.type = 'text/css';
    linkEl.href = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css';

    // Dynamically create the <script> for JSXGraph's core
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

  // Once the script is loaded, initialize the JSXGraph board
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

    // Example: slider for polynomial degree
    // const degree = board.create('slider', [
    //   [1, 8],
    //   [7, 8],
    //   [1, 2, 10],
    // ], {
    //   name: 'degree',
    //   snapWidth: 1,
    //   digits: 0,
    // });

    const degree = question.degree
    board.BOARD_MODE_SKETCH = 0x0100;
    let sketch, curve;
    let points = [];

    // Function to update reduced coordinates
    const updateReducedCoordinates = () => {
      const coords = points.map(p => new JXG.Coords(JXG.COORDS_BY_USER, [p.X(), p.Y()], board));
      const reduced = JXG.Math.Numerics.Visvalingam(coords, degree - 1);
      const reducedCoords = reduced.map(r => ({
        x: r.usrCoords[1],
        y: r.usrCoords[2],
      }));
      setReducedCoordinates(reducedCoords);
    };

    // On 'down': start a sketch curve
    board.on('down', () => {
      if (board.mode !== board.BOARD_MODE_NONE) return;
      board.mode = board.BOARD_MODE_SKETCH;
      setReducedCoordinates([]); // Reset reduced coordinates
      sketch = board.create('curve', [[], []], {
        strokeColor: '#bbbbbb',
        lineCap: 'round',
        strokeWidth: 6,
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

      // Simplify the path using Visvalingam algorithm
      const reduced = JXG.Math.Numerics.Visvalingam(coords, degree - 1);

      // Create new points
      points = [];
      for (let r of reduced) {
        const x = r.usrCoords[1];
        const y = r.usrCoords[2];
        const point = board.create('point', [x, y], {
          size: 5,
          withLabel: false,
        });
        points.push(point);

        // Add drag event listener to each point
        point.on('drag', () => {
          updateReducedCoordinates();
        });
      }

      // Update reduced coordinates for the first time
      updateReducedCoordinates();

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
  }, [scriptLoaded,question.degree]);

  // console.log('The intercepts are ', question.intercepts) 
  console.log('The coordinates are ', reducedCoordinates)


  const handleSubmit = async() => {
    //This function will send reduced cooredinates to the routehandler and then from there to the fastapi, on the fastapi we will deterministically, 
    console.log('The submitted coordinates are', reducedCoordinates)

    const dataForFeedback = {
      questionData: question, 
      coordinates: reducedCoordinates
    }
    const resp = await gradeSketchQuestion(dataForFeedback).unwrap()
    console.log('The response from fastpai is ', resp)

  }

  return (
    <>
    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , marginLeft:'3%'}}>
        <h1 color='info' style={{ margin: '5px', color: '#17a2b8', marginBottom: '2%' }}>{question.title.replace(/-/g, ' ')}</h1>
        <h3><Latex>${question.latex}$</Latex></h3>
        
        <div
          ref={boardContainerRef}
          style={{ width: '600px', height: '600px', margin: 'auto' }}
        />
        {/*Use the code below to obtain the reduced coordinates,   */}
        {/* <div style={{ marginTop: '20px' }}>
          <h4>Reduced Coordinates:</h4>
          <ul>
            {reducedCoordinates.map((coord, index) => (
              <li key={index}>({coord.x.toFixed(2)}, {coord.y.toFixed(2)})</li>
            ))}
          </ul>
        </div> */}
        <div style={{marginTop:'3%', width:'100%'}}>
        <Button color='info' outline style={{width:'100%'}} onClick={handleSubmit}>Submit</Button>
        </div>
       
      </div>
      
      <div>
      <Card style={{ borderRadius: '20px', marginRight: '3%' }}>
                <CardSubtitle>
                  <h5 style={{ fontWeight: 'bold', margin: '1rem' }}>
                    Instructions
                  </h5>
                </CardSubtitle>
                <CardBody
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignContent: 'flex-start'
                  }}
                >
                  <ListGroup>
                    <ListGroupItem color="info" style={{ borderRadius: '0px' }}>
                      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        1) Start by drawing an initial sketch of the curve given above
                      </h6>
                      <br />

                      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        2) Once you&#39;ve finished your initial sketch, drag the red points to show 
                      </h6>
                      <h6 style={{fontWeight:'bold', fontSize:'18px'}}>where the curve intercepts the x and y axis</h6>
                      <br />

                      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        3) Once you&#39;re happy click the submit button below the curve to check your answer
                      </h6>
                      <br />
                      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        4) Shortly after you click submit, you&#39;re feedback will appear in the feedback panel
                      </h6>
                  
                    </ListGroupItem>
                  </ListGroup>
                </CardBody>
              </Card>
      </div>
      </div>
    </>
  );
}