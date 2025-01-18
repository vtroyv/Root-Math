'use client'
import { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';
import { useGetQuestionsQuery, useGradeQuestionMutation } from '@/lib/redux/slices/apiSlice';
import ComputeEngineConfig from '../../../../../lib/utils/ceConfig';
// import { Button } from 'primereact/button';
import {Row, Col, Card, CardBody, CardSubtitle, ListGroup, ListGroupItem, Button} from 'reactstrap'
import { prettyPrintJson } from 'pretty-print-json';
import preprocessLatex from '../../../../../lib/utils/preprocess-latex';
import { canonical } from '@/lib/cortex/compute-engine-main/src/compute-engine/private';
import QRCode from 'qrcode'
import Image from 'next/image';


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

    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');

    const [qrDataUrl, setQrDataUrl] = useState('');
    const imgRef = useRef(null);

    

    const title = params.title;
    // console.log('the title of the question in quiz displah is', title);

    // Check if `data` exists before trying to find a question
    const question = data ? data.find((obj) => obj.title === title) : null;
    // console.log('the question in the quiz display is ', question)


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
    
                mfe.current.mathModeSpace = '\\,';
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
                //you need to add an event listener for adding a space, regardless of in mathmode or text 

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
    

    const [gradeQuestion, mutationState] = useGradeQuestionMutation()





    const handleSubmit = async() => {
        const latex = mfe.current.value;
        console.log('The latex is given by', latex);

        const test = [1,2,3,5]
        console.log(test)
    
        // Preprocess the LaTeX
        const preprocessedArray = preprocessLatex(latex);
        console.log(`The preprocessedArray is ${preprocessedArray}`);
        const boxedExpression = ceRef.current.ce.parse(latex)
        console.log(`The boxed expression is ${boxedExpression}`)
        console.log(`and when we compile it we get ${ await boxedExpression.compile('sympy')}`)

        console.log(`The boxed expression before array is, ${boxedExpression}`)
   
        // Parse the latex into boxed expressions
        const boxedExpressionArray = preprocessedArray.map(latex => ceRef.current.ce.parse(latex));

        console.log(`The boxedExpression Array is ${boxedExpressionArray}`)

        const compiled = boxedExpressionArray.map((bE)=> bE.compile('sympy'))

        console.log(`the type compiled printed out is ${typeof compiled} and it is ${compiled}`)


        console.log(`The compiled latex is  ${JSON.stringify(compiled)}`)

      try {
        //compiled is returning javascript functions i beleive 
        const compiledStrings = compiled.map((fn) => fn.toString());
        console.log(`The compiled strings are of type ${typeof compiledStrings}, and there values are: ${compiledStrings}`)
        console.log('The question data that i would like to send is ', question)

        const dataForFeedback = {
            questionData: question, 
            sympyResponse: compiledStrings

        }

        const data = await gradeQuestion(dataForFeedback).unwrap()
        console.log(`The response from the route handler is ${JSON.stringify(data, null, 2)}`);

      } catch(error){
        console.log(`The error when trying to access the routehandler is ${error}`)

      }
      
  

    
        // console.log('The boxedExpressionArray is given below');
        // console.log(boxedExpressionArray);
    
        // // Map over the boxed expressions to extract the operands (ops)
        // const opsArray = boxedExpressionArray.map((bE) => bE.ops);
        // console.log('The operator of the boxedExpression are');
        // console.log(opsArray);
    
        // // Check if the first expression has operands and log them
        // if (opsArray[0]) {
        //     console.log(`The operands of the first boxed expression are:`);
        //     console.log(opsArray[0]);
        // }
    
        // // Check if the second operand exists
        // if (opsArray[1]) {
        //     console.log(`The second operand in the expression is: ${opsArray[1]}`);
        // } else {
        //     console.log('The second operand is undefined or does not exist.');
        // }

        
    };
    





    // crumb.includes('-') ? crumb.split('-').map(word=> word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    return (
        <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%' }}>
    {isLoading ? (
        <h1>Loading...</h1> // Add a loading indicator while fetching data
    ) : (
        question ? (
            <h1>
                {question.title.includes('-') 
                    ? question.title
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                    : question.title}
            </h1> // Display the title of the question if it exists
        ) : (
            <h1>Question not found</h1> // Fallback if question is not found
        )
    )}
</div>



        <div className='quiz-display'>
        <Row className='quiz-display-row'>
        <Col >
        
        
        <div className='question'>
          <div ref={questionRef} >

          </div>
       


        </div>
       
        <div ref={mathfieldRef}>

</div>
<br/>
<div>
<Button
  block
  color="info"
  outline
  onClick={handleSubmit}
>
  Submit
</Button>
</div>




        
    

        </Col>
        <Col className='QR-instructions'>
        
        <Card style={{borderRadius:'20px', margin:'2%'}}>
  <div className='qr-container' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding:'2%'}}>
    <div>
    {/* <h4 style={{fontWeight:'bold', textAlign:'start', color:'#17a2b8'}}>Scan the QR code, Upload your work and get feedback <i class="bi bi-arrow-right-square-fill"></i> </h4> */}
    <br/>
    <h4 style={{fontWeight:'bold', textAlign:'start', color:'#17a2b8'}}>Now&#39;s your chance to practice for exams! </h4>
    <h4 style={{fontWeight:'bold', textAlign:'start', color:'#17a2b8'}}>Even partial answers can earn marks for your explanations and working, so try your best!</h4>
   
    </div>
    
   
  </div>

  <CardSubtitle>
    <h5 style={{fontWeight:'bold', }}>Instructions</h5>
  </CardSubtitle>
  <CardBody style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignContent:'flex-start'}}>
    <ListGroup >
      <ListGroupItem color='info' style={{borderRadius:'0px'}}>

      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
  1) Answer the question in the textbox to the left , just like you would in an exam
</h6>
<br />

<h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
  2) Once you&#39;re finished and happy with your work click submit
</h6>
<br />

<h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
  3) Shortly after you submit you&#39;re work, you&#39;ll recieve feedback
</h6>
<br />

<h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
  4) Use this feedback to correct any mistakes you may have made 
</h6>
<br />

<h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
  5) And make sure to ask your personal tutor bot, any question&#39;s you may have
</h6>
<br />

<h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
  6) Once your happy click &apos;next&apos; to move on to the next question
</h6>

    

   </ListGroupItem>

   </ListGroup>


   

   
   
   
   
  </CardBody>
</Card>
        </Col>
        

     
        </Row>
        </div>
        </>
    );
}
