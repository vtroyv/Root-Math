'use client'

import { useQuestionStore } from "@/lib/zustand/providers/question-state-provider";
import { useEffect, useRef, useState } from "react";
import { MathfieldElement } from "mathlive";


export default function CombinationSketch({questionDetails}) {
    //read the index from the questionDetails, then when you update the updateDetais object in userProgress, 
    //you only add to the object corresponding to the current index, or otherwise create it if it doesn't exist yet
    const titleView = useRef(null);
    const titleRef = useRef(null);
    const mathfieldRef = useRef(null);
    const progress = useQuestionStore((state) => state.userProgress)
    const boardContainerRef =useRef(null);
    const boardRef = useRef(null);
    const pointsRef = useRef([]);
    const curveRef = useRef(null);

    const setComponentProgressAt = useQuestionStore((s)=> s.setComponentProgressAt)
    const {index} = questionDetails

    const [scriptLoaded,setScriptLoaded] = useState(false);
    const [reducedCoordinates, setReducedCoordinates] = useState([]);

    console.log('the bounding box is ', questionDetails.boundingBox)

    const clearDrawing = (board) => {
        if (!board )return;
        if(curveRef.current) board.removeObject(curveRef.current);
        pointsRef.current.forEach((p)=> board.removeObject(p))
        pointsRef.current =[];
        curveRef.current=null;
    
    };

    const syncReduced = ()=> {
        const data = pointsRef.current.map((p)=> ({
            x: p.X(), 
            y:p.Y(), 
            label: p.name ?? p.label?.textStr ?? ''
        }));
        setReducedCoordinates(data);
        return data; 
    }

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
        // updateProgress({ coordinates: newReduced });
        setComponentProgressAt(index, {coordinates:newReduced})
      });
    });

    curveRef.current = board.create(
      'functiongraph',
      [window.JXG.Math.Numerics.lagrangePolynomial(pointsRef.current)],
      { strokeColor: '#000000', strokeWidth: 3, lineCap: 'round' }
    );
  };



    useEffect(()=> {
        if(!questionDetails) return;

        if(!titleView.current) {
            titleView.current = new MathfieldElement();
        }

        const tv = titleView.current
        tv.value = String.raw`${questionDetails.title}`
        tv.readOnly = true;

         Object.assign(tv.style, {
      width:      '100%',
      margin:     '0.5rem 0',
      fontWeight: 'bold',
      fontSize:   '1.25rem',
      boxSizing:  'border-box',
    });

      if (titleRef.current && !titleRef.current.contains(tv)) {
        titleRef.current.appendChild(tv)
    }


    
    },[questionDetails?.title])

    useEffect(()=>{
        console.log('The global userProgress is ', progress);

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

    //   INIT board + sketch interactions 
    useEffect(()=>{
        if(!scriptLoaded) return;
        if(!window.JXG) {
            console.log('JSXgraph not found on window. The script might have failed to load.');
            return
        }
        const {JXG} = window;
        const board = JXG.JSXGraph.initBoard(boardContainerRef.current, {
            boundingbox: questionDetails?.boundingBox ?? [-10,10,10,-10],
            axis: true, 
            pan:{enabled:true, needTwoFingers:true, needShift:true}, 
            showCopyright:false, 
        });
        boardRef.current = board; 

        const degree = questionDetails.degree;
        board.BOARD_MODE_SKETCH = 0x0100;

        let sketch;

        const labelsFallback = questionDetails?.labels ?? null;

        // Start sketch 
        board.on('down', ()=> {
            if (board.mode !== board.BOARD_MODE_NONE) return;
            board.mode = board.BOARD_MODE_SKETCH;

            sketch = board.create('curve', [[], []], {
                strokeColor: '#bbbbbb', 
                lineCap:'round',
                strokeWidth:6, 
            })
        }); 

        // Finish sketch -> simplify -> points -> curve 

        board.on('up', ()=> {
            if (board.mode !== board.BOARD_MODE_SKETCH) return;
            board.mode = board.BOARD_MODE_NONE;

            //remove old drawing 

            clearDrawing(board);

            //collect raw coords from sketch 

            const coords = [];
            for (let i = 0; i< sketch.dataX.length; i++) {
                coords.push(new JXG.Coords(JXG.COORDS_BY_USER, [sketch.dataX[i], sketch.dataY[i]], board));
            }

            //Simplify
            const reduced = JXG.Math.Numerics.Visvalingam(coords, degree -1);

            //create poiints at simplified coords
            pointsRef.current=reduced.map((r,i) => {
                const x = r.usrCoords[1];
                const y = r.usrCoords[2];
                return board.create('point', [x,y], {
                    name: (labelsFallback && labelsFallback[i]) || `P${i +1}`, 
                    withLabel:true, 
                    size:4, 
                    strokeColor: '#e67e22', 
                    fillColor: '#e67e22', 
                    label: {offset: [8,-12], fontSize:14, color:'#17a2b8'}, 
                    showInfobox:true,
                })
            });

            syncReduced();
            // updateProgress({coordinates: syncReduced()});  // ill need to change this so it updates the correct index in updateobject. 
            setComponentProgressAt(index, {coordinates: syncReduced()})
            pointsRef.current.forEach((pt)=> {
                pt.on('drag', ()=> syncReduced());
                pt.on('up', ()=> {
                    const newReduced = syncReduced();
                    // updateProgress({coordinates: newReduced});
                    setComponentProgressAt(index, {coordinates: newReduced})
                })
            })

            //Build Curve
            curveRef.current = board.create(
                'functiongraph', 
                [JXG.Math.Numerics.lagrangePolynomial(pointsRef.current)], 
                {strokeColor: '#000000', strokeWidth:3, lineCap:'round'}
            );

            //remove raw sketch 
            board.removeObject(sketch);

        })

        // while sketching, add points 
        board.on('move', (evt, mode)=> {
            if (mode !== board.BOARD_MODE_SKETCH) return;
            const pos = board.getMousePosition(evt);
            const c = new JXG.Coords(JXG.COORDS_BY_SCREEN, pos,board);
            sketch.dataX.push(c.usrCoords[1]);
            sketch.dataY.push(c.usrCoords[2]);
            board.update();
        })

        // IF we already have ssaved coordainte, draw them now

        const questionIndex = questionDetails?.index
        if (progress?.componentProgress?.[questionIndex]?.coordinates?.length) {
            buildFromCoords(board, progress.componentProgress[questionIndex].coordinates, labelsFallback);
        }
        
        //clean up
        return () => {
            board.off('down');
            board.off('up');
            board.off('move');
            window.JXG.JSXGraph.freeBoard(board);
            boardRef.current = null;
            pointsRef.current = [];
            curveRef.current= null;

        }

    }, [scriptLoaded])

    // If progress arrives/changes later (e.g. async) reflect it on the board 
    useEffect(()=> {
        if (!boardRef.current) return;
        const labelsFallback = questionDetails?.labels ?? null;
        const questionIndex = questionDetails.index

        if (progress?.componentProgress?.[questionIndex]?.coordinates?.length) {
            buildFromCoords(boardRef.current, progress.componentProgress[questionIndex].coordinates, labelsFallback)
        }
    }, [index, questionDetails?.labels, progress?.componentProgress?.[index]?.coordinates])

  

    return (
        <div>
            <div ref={titleRef} style={{width:'100%'}}></div>
            {/* Graph area below */}
            <div
            style={{
                flex:'1 1 auto', 
                display: 'flex', 
                justifyContent:'center', 
                alignItems: 'center', 
                minHeight:0, 
                padding:'0 1rem 2rem',
            }}
            >
                <div 
                style={{width:'100%', maxWidth:'600px', aspectRatio:'1 / 1', position:'relative'}}
                >
                    <div
                    ref={boardContainerRef}
                    style={{position:'absolute', top:0, left:0, right:0, bottom:0, margin: '1rem 0'}}
                    >

                    </div>


                </div>

            </div>
    
        </div>
    );
}