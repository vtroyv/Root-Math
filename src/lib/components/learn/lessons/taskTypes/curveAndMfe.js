'use client';
import React, { useRef, useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import CurveSketch from './curveSketch';
import SingleMfe from './singleMfe';

export default function CurveAndMfe({ task, part,onDataChange }) {
    console.log('The task  in curveAndMfe is:', task);
    console.log('The part in curveAndMfe is:', part);


    return (
        <div >
        <CurveSketch task={task}  onDataChange={onDataChange}  />
        <SingleMfe part={part} />
            </div>
    
    );
    
}