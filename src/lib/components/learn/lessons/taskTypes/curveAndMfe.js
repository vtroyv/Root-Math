'use client';
import React, { useRef, useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import CurveSketch from './curveSketch';
import SingleMfe from './singleMfe';

export default function CurveAndMfe({ task, part,onDataChange }) {
//    essentially, what i need to do is get this component to successfully be updating the global task state on changes 


    return (
        <div >
        <CurveSketch task={task}  onDataChange={onDataChange}  />
        <SingleMfe part={part} task={task} />
          
            </div>
    
    );
    
}