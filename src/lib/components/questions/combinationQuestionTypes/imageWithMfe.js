'use client'
import { MathfieldElement } from "mathlive";
import { useQuestionStore } from "@/lib/zustand/providers/question-state-provider";
//In this file we will keep the imageWithMfe component, suitible to be rendered 
// with combination question types 

import ImageWithEnlarge from "../../learn/lessons/ImageWithEnlarge";
import { useEffect, useRef } from "react";

export default function ImageWithMfe({questionDetails}) {
    const titleView = useRef(null);
    const titleRef = useRef(null);
    const mfe = useRef(null);
    const mathfieldRef = useRef(null);
    const progress = useQuestionStore((state)=> state.userProgress)

    useEffect(()=>{
        if (!questionDetails) return;

        if(!titleView.current) {
            titleView.current = new MathfieldElement();
        }

        const tv = titleView.current
        tv.value = String.raw`${questionDetails.title}`;
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

    if (!mfe.current) {
        mfe.current = new MathfieldElement({
            mathModeSpace: '\\,', 
            mathVirtualKeyboardPolicy:'manual',

        })

        const mf = mfe.current;

        Object.assign(mf.style, {
        display:         'block',
        width:           '100%',
        height:          '100%',
        backgroundColor: 'lightblue',
        padding:         '0.5rem',
        borderRadius:    '4px',
        boxSizing:       'border-box',
        })


        if (mathfieldRef.current && !mathfieldRef.current.contains(mf)) {
            mathfieldRef.current.appendChild(mf);

            mf.focus();
            mf.addEventListener('pointerdown', ev => {
    ev.preventDefault();            // Stop any default blur/selection behavior
    mf.focus();                     //  ensure the field has focus
    // figure out the offset closest to the click (viewport coords)
    const offset = mf.getOffsetFromPoint(ev.clientX, ev.clientY)  
    //  move the caret to that offset
    mf.position = offset;      
    // esentially what was happening whas when i click on a part of the mathfield element that didn't have text, 
    // it wouldn't put the caret into a valid insertion point which would cause keyboard events to be ignored i think                                
  });
}
//new lines
 mfe.current.addEventListener('input', function (event) {
      if (event.inputType === 'insertLineBreak') {
        mfe.current.executeCommand('addRowAfter');
        event.preventDefault();
      }
    });

    //check if there is any userLatex in the current progress object and if so set the latex as it

    mfe.current.setValue(progress?.userLatex || questionDetails?.mfeLatex || '') 


// it would be great if there was some logic to set the parts which contain errors as red

    // mfe.current.selection = [0,5]
    // mfe.current.applyStyle({color:'red'})
     

    mfe.current.addEventListener("input", (event) => {
  // 1) grab the up-to-date LaTeX
  const liveLatex = mfe.current.value;   
  updateProgress({ userLatex: liveLatex})          // or mfe.current.getValue()
event.preventDefault();
    })

    

        
    }

        
    },[questionDetails])
    return (
        <div>
            <div ref={titleRef} style={{width:'100%'}}></div>
            <ImageWithEnlarge url={questionDetails.url} alt={questionDetails.alt}/>
            <div
          ref={mathfieldRef}
          onClick={() => mfe.current?.focus()}
          style={{
            flex:      1,
            width:     '100%',
            overflowY: 'auto',
            marginTop: '0.5rem',
          }}
        />

            
        </div>
    );
}