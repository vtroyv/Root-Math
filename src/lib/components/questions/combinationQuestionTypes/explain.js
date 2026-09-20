'use client'
import {MathfieldElement} from 'mathlive';
import { useQuestionStore } from '@/lib/zustand/providers/question-state-provider';
import {useEffect, useRef} from 'react'; 

export default function CombinationExplain({questionDetails}) {
    console.log('the questionDetails are ', questionDetails)
    const titleView = useRef(null);
    const titleRef = useRef(null);

    const mfe = useRef(null);
    const mathfieldRef = useRef(null);
    const progress = useQuestionStore((state)=> state.userProgress)

    useEffect(()=> {
        if(!questionDetails) return; 

        if (!titleView.current) {
            titleView.current = new MathfieldElement();
        }

        const tv = titleView.current
        tv.readOnly = true;
        tv.value = String.raw`${questionDetails.title}`;
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
        mf.defaultMode = 'text';
     
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
            ev.preventDefault();
            mf.focus();
            const offset = mf.getOffsetFromPoint(ev.clientX, ev.clientY);
            mf.position = offset;
        })

    }

    mfe.current.addEventListener('input', function (event) {
        if (event.inputType === 'insertLineBreak') {
            mfe.current.executeCommand('addRowAfter');
            event.preventDefault();
        }
    });

    const questionIndex = questionDetails.index
    mfe.current.setValue(progress?.componentProgress?.[questionIndex]?.userLatex || '') 

    mfe.current.addEventListener("input", (event)=> {
        const liveLatex = mfe.current.value;
        updateProgress({userLatex: liveLatex})
        event.preventDefault();
    })

    }


    })
    
    return (
        <div>
        <div ref={titleRef} style={{width:'100%'}}></div>
        <div ref={mathfieldRef} onClick={()=> mfe.current?.focus()} style={{flex:1, width:'100%', overflowY:'auto', marginTop:'0.5rem'}}></div>
        </div>
    );
}