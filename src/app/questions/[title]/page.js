'use client'
import { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';
import { useGetQuestionsQuery } from '@/lib/redux/slices/apiSlice';
import ComputeEngineConfig from '@/lib/cortex/utils/ceConfig';
import { Button } from 'primereact/button';
import { prettyPrintJson } from 'pretty-print-json';
import preprocessLatex from '@/lib/cortex/utils/preprocess-latex';


/* 
/quick note, because all the mathfield elements share the same instance of the computeEngine 
on the page, then let's check if we need to use the useREF hook in our code, because it would be more efficient
to not use it, if once we import the CE and configure it, our mathfield element will contain it already. 

Just some food for thought 
*/

export default function QuestionDisplay({ params }) {
    //we take the params which will be the title of the question that the user clicked on. 

    //----------------------------
    //The use Ref hooks, 
    const questionRef = useRef(null);
    const mathfieldRef = useRef(null);
    const mfe = useRef(new MathfieldElement());
    const questionView = useRef(new MathfieldElement());
    const ceRef = useRef(null);
    //----------------------------

    // Fetch data and ensure caching
    const { data, isLoading, isSuccess } = useGetQuestionsQuery(); // You could use `isLoading` to add some UI feedback

    const title = params.title;
    console.log('the title of the question in quiz displah is', title);

    // Check if `data` exists before trying to find a question
    const question = data ? data.find((obj) => obj.title === title) : null;
    console.log('the question in the quiz display is ', question)


    useEffect(() => {
        if (isSuccess && data) {
            const fetchedQuestion = data.find((obj) => obj.title === title);
            if (fetchedQuestion) {
                questionView.current.value = String.raw`${fetchedQuestion.latex}`;
                questionView.current.readOnly = true;
                questionRef.current.style.margin = '1%';
                questionRef.current.style.fontWeight = 'bold';
                questionRef.current.style.fontSize = '20px';
                // questionRef.current.style.borderBottom = '2px solid black';
    
                if (!questionRef.current.contains(questionView.current)) {
                    questionRef.current.appendChild(questionView.current);
                }
    
                mfe.current.mathModeSpace = '\\';
                mfe.current.virtualKeyboardMode = 'manual';
                mfe.current.style.display = 'block';
                mfe.current.style.width = '700px';
    
                if (!mathfieldRef.current.contains(mfe.current)) {
                    mathfieldRef.current.appendChild(mfe.current);
                }
    
                mfe.current.addEventListener('input', function (event) {
                    if (event.inputType === 'insertLineBreak') {
                        mfe.current.executeCommand('addRowAfter');
                        
                        event.preventDefault();
                    }
                });
               
                
            }
        }
    }, [data, isSuccess, title]);

  

    //get the compute engine in order to be able to use the latex

    useEffect(() => {
        if (question) {
            const ceConfig = new ComputeEngineConfig(question?.questionType); 
            const ce = ceConfig.getEngine(); 
    
            if (ceRef.current) {
                ceRef.current.ce = ce; // Safely assign ce to ceRef.current
                
            } else {
                ceRef.current = { ce }; // Initialize ceRef.current if it's null
            }
        }
    }, [question]);
    





    const handleSubmit = () => {
        const latex= mfe.current.value
        console.log('the latex is given by', latex)
        const preprocessedArray = preprocessLatex(latex);
        console.log(preprocessedArray)
        const mathjsonArray =  preprocessedArray.map(latex => ceRef.current.ce.parse(latex).symbol)
        /*

        ce.parse returns a boxed expression, we are getting the mathjson by using .json, however we could also get different things by using .head etc. 
        Therefore when parsing to sympy perhaps we shouldn't convert it to mathjson directly but instead parse from the boxed expression to sympy, as the current 
        compiler code on the github seems to convert from a boxed expression to javascript, not mathjson to javascript. Double checkl though!
        */
       
       console.log('the mathjson is given below')
       console.log(mathjsonArray)

       const boxed_expressions = mathjsonArray.map(line => ceRef.current.ce.box(line))
       console.log('the boxed expressions are', boxed_expressions)



    }







    return (
        <>
        <div>
            {isLoading ? (
                <h1>Loading...</h1> // Add a loading indicator while fetching data
            ) : (
                question ? (
                    <h1>{question.title}</h1> // Display the title of the question if it exists
                ) : (
                    <h1>Question not found</h1> // Fallback if question is not found
                )
            )}
        </div>

        <div ref={questionRef}></div>

        <div ref={mathfieldRef}></div>

        <div>
            <Button label='MathJson' onClick={handleSubmit}></Button>
        </div>
        </>
    );
}
