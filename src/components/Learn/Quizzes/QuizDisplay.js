/*

EVERYTHING IS A MESS RN BUT MATHLIVE HAS EVERYTHING YOU NEED TO BUILD THE DREAM, IT EVEN HAS A STATIC MATH PART SO WE MAY BEABLE TO SCRAP KATEX
AND JUST RELY PURELY ON MATHLIVE TO HANDLE ALL RENDERING OF MATHEMATICS.

SO START WORKING YOUR WAY THRU MATH LIVE LEARN HOW TO INPUT MATHEMATICAL NOTATION, AND SKIP LINES

IN THE STATIC MATHFIELD OPTION ON THE SITE WE EVEN HAVE THE OPPORTUNITY TO CREATE READ ONLY MATHFIELDS WHICH WE CAN USE IN REGARDS TO CREATING QUESTIONS 
IT WILL BE KEY IN THE MULTIPLE CHOICE/ FILL IN THE GAPS STYLE OF QUESTIONS 

WE CAN ALSO USE TEH FILL IN THE GAP PART OF MATHLIVE FOR FILL IN THE GAP STYLE QUESTIONS


SO THE 4 TYPE OF QUESTIONS WE'LL HAVE IS;

MULTIPLE CHOCIE

FILL IN GAP STYLE QUESTIONS 

TYPE IN ANSWER QUESTIONS 

(DRAW RESPONSE PART SIMILAR TO UPLEARN WHERE YOU CAN DRAW A GRAPH OR SKETCH THEN HAVE IT COMPARED TO A REAL DRAWING BENEATH)

FULL PROPER RESPONSE QUESTONS EQUIVALENT TO HAND WRITTEN
(THE FIRST 3 ARE FINE WITH MATHLIVE BUT STRUGGLING TO FIND WAY TO CREATE NEW LINES WHICH IS ESSENTIAL FOR FULL WRITTEN RESPONSE STYLE)






*/


/* 
/quick note, becauase all the mathfield elements share the same instance of the computeEngine 
on the page, then lets check if we need to use the useREF hook in our code, because it would be more efficient
to not use it, if once we import the CE and configure it, our mathfield element will contain it already. 

Just some food for thought 

*/
import React, { useEffect, useRef, useState} from 'react';
import { useLocation,  } from 'react-router-dom';
import QRCode from 'qrcode';
import { Row, Col, Card, CardBody, CardSubtitle, ListGroup, ListGroupItem, Button} from 'reactstrap';
import { MathfieldElement } from 'mathlive';
import "bootstrap-icons/font/bootstrap-icons.css"
import axios from 'axios'
import { useSelector } from 'react-redux'; 
import { io } from 'socket.io-client';
import ComputeEngineConfig from './parse';
import { prettyPrintJson } from 'pretty-print-json';

/*
in this component we will use the useselector hook to 
*/




const QuizDisplay = () => {




  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');






  const location = useLocation();
 
  const quiz = location.state;
  console.log('the current quiz is ',quiz)
  // console.log(`this title is ${quiz.title}`)
  const problem = String.raw`${quiz.latex}`;
  const uid = useSelector(state => state.user.currentUser.uid)
  // console.log(uid)
  // console.log(problem);

  const imageKey = `${uid}${quiz.title}`; // Added imageKey variable
  const text = `http://10.230.0.234:3000/upload/${quiz.title}/${uid}`;

  // you need to reread over your redux notes because rightnow we dont even remener how to use a selector to get thez


  const questionRef = useRef(null);
  const mathfieldRef = useRef(null);
  const mfe = useRef(new MathfieldElement());
  const questionView = useRef(new MathfieldElement());

  const ceRef = useRef(null);

// send image from laptop files to upload to the server for latex rendering 
  const submit = async event =>{
    
    event.preventDefault();
    

    const formData = new FormData();
    formData.append('image', file)
    formData.append('imageKey', imageKey)
    //may want to do a quick check to see whether the image is currently uploaded and then if it is ask them if they wish to redo the question. 
    //down the line if the question has already been marked, make sure to display it initially with the option to redo offered.
    await axios.post('http://10.230.0.234:4000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    setFile(null)
    setCaption('')


  }

//send latex (well we'll have to change this to MATHJSON as our server cannot directly parse latex into sympy expressions)  
  const getMark = async() =>{
    //convert latex to MATHJSON

    if (ceRef.current){

      try{
        const latex = mfe.current.value
        console.log(latex)

      //FIX TOMORROW        
      //  const lines =  ceRef.current.separateLines(latex)
      //  console.log(lines)
       const MATHJSON =  ceRef.current.parse(mfe.current.value).json;
       console.log(prettyPrintJson.toString(MATHJSON));
       console.log('this should print before contacting python server it is the mathjson')

       const {data} = await axios.get('//localhost:5001/process-latex', {
        params: {
          mathjson : MATHJSON

        }
      
       })
       console.log(data)
       //the issue is when the feedback arrives your going to want to display it, should be route to a new component, 
       //that displays this feedback or should we store the feedback in a state 

      } catch(error){
        console.log(error)
      }

    }   
  }




  useEffect(() => {
    const generateQR = async () => {
      try {
        const canvas = document.getElementById('qrcode');
        const url = await QRCode.toDataURL(text, {
          color: {
            dark: '#17a2b8FF',
            light:'#FFFFFFFF'
          }
        });
        canvas.src = url;
      } catch (err) {
        console.error(err);
      }
    };

    generateQR();

    questionView.current.value =problem;
    questionView.current.readOnly = true;
    questionRef.current.style.margin ='1%';
    questionRef.current.style.fontWeight ='bold';
    questionRef.current.style.fontSize ='20px';
    questionRef.current.style.borderBottom = '2px solid black`x';
  
 
    questionRef.current.appendChild(questionView.current);
    

   

   

  mfe.current.mathModeSpace = '\\:'
  mfe.current.virtualKeyboardMode ='manual'
 
    mfe.current.style.display = 'block';
  mfe.current.style.Width = '700px';  // Set the width
   // Set the height
// mfe.current.value= String.raw`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`;
 

  
 

  mathfieldRef.current.appendChild(mfe.current)
  mfe.current.addEventListener('input', function(event) {
    // console.log(event.inputType)
    //we can see that by pressing the 
    if (event.inputType === 'insertLineBreak') {
     
      mfe.current.executeCommand('addRowAfter');
      event.preventDefault();
      
    }
  })

  
    
  }, [problem, text]);

  useEffect(()=>{

  const socket = io('http://10.230.0.234:4000');  // Your server's URL

  socket.on('connect', () => {
    console.log('Socket.io connected!');
  });

  socket.on('imageUploaded',async data => {
    // setImageKey(data.imageKey);
    // call /process route here using the imageKey
    //the image key that is passed is literally the same as the imageKey constant that we generated, 
    //so perhaps instead of sending the imageKey variable from socketIO, we should just listen for this 
    //imageUploaded event and call the process route with our imageKey passed again once more as Data
    
    //you probably want to send the imagekey in the params of the req
    const response  = await axios.get(`http://10.230.0.234:4000/api/process/${imageKey}`);
    console.log(response.data);

    for(let line of response.data.answer.line_data){

      mfe.current.setValue(line.text);
      mfe.current.executeCommand('addRowAfter');
      mfe.current.executeCommand('moveDown');

    }

    console.log(mfe.current.value)







    
  });
  

  // Disconnect socket when component unmounts
  return () => {
    socket.disconnect();
  };
  }, [imageKey])

//get the compute engine to enable to send latex

useEffect(()=>{
  const ceConfig = new ComputeEngineConfig(quiz?.questionType)
  const ce = ceConfig.getEngine()

  ceRef.current = ce;




},[quiz])


  return (
    <div className='quiz-display'>
      <Row className='quiz-display-row'>
        
        <Col >
        
        
          <div className='question'>
            <div ref={questionRef} >

            </div>
         


          </div>
          <div ref={mathfieldRef}>

</div>
<div>
<Button
    block
    color="info"
    outline
    onClick={getMark}
  >
    Submit
  </Button>
</div>




          
      

          </Col>
        
        <Col className='QR-instructions'>
        
        <Card style={{borderRadius:'20px', margin:'2%'}}>
  <div className='qr-container' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding:'2%'}}>
    <div>
    <h4 style={{fontWeight:'bold', textAlign:'start', color:'#17a2b8'}}>Scan the QR code, Upload your work and get feedback <i class="bi bi-arrow-right-square-fill"></i> </h4>
    <br/>
    <h5 style={{fontWeight:'bold', textAlign:'start'}}>You can either upload your work as per the instructions below, or simply type your response directly into the textbox.</h5>
    </div>
    
    <div className='qr-image'>
      <img id='qrcode' alt='qrcode' src=''/>
    </div>
  </div>

  <CardSubtitle>
    <h5 style={{fontWeight:'bold', }}>Instructions</h5>
  </CardSubtitle>
  <CardBody style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignContent:'flex-start'}}>
    <ListGroup >
      <ListGroupItem color='info' style={{borderRadius:'0px'}}>
    
   <h6 style={{fontWeight:'bold', fontSize: '18px'}}>1) Answer the question on paper as you would in an exam</h6>
   <br />

   <h6 style={{fontWeight:'bold', fontSize: '18px'}}>2) Once you've finished scan the QR code above with your smart phone</h6>
   <br />
   
   <h6 style={{fontWeight:'bold', fontSize: '18px'}}>3) Follow the instructions on your phone to upload your work </h6>
   <br />

   <h6 style={{fontWeight:'bold', fontSize: '18px'}}>4) Once you've uploaded your work you'll see it shortly appear in the text box to the left</h6>
   <br />

   <h6 style={{fontWeight:'bold', fontSize: '18px'}}>5) Give it a read through and edit any typos that may of arised from the scan </h6>
   <br />

   <h6 style={{fontWeight:'bold', fontSize: '18px'}}>6) Click "submit" and await your feedback and grade ! </h6>
   </ListGroupItem>
   <ListGroupItem style={{borderRadius:'0px'}}>
    <h6 style={{fontWeight:'bold'}}> Alternatively you can upload directly from here. Upload your picture then click submit  </h6>
    <form onSubmit={submit}>
      <input onChange ={e => setFile(e.target.files[0])} type="file" accept="image/*"/>
      <input value={caption} onChange={e => setCaption(e.target.value)} type="text" placeholder='caption'/>
      {/* need to add code so that if a file isn't selected then it disables the submit button */}
      <button type="submit"> Submit</button>

     </form>
   </ListGroupItem>

   </ListGroup>


   

   
   
   
   
  </CardBody>
</Card>
        </Col>
      </Row>
    </div>
  );
}
export default QuizDisplay;








// const MathEquation = () => {
//   return (
//     <div>
   
     

//       <BlockMath math={String.raw`
//       \begin{aligned}
//         & \therefore \mathbb{1}^{p} \equiv 1(\bmod p) \\
//         & 2^{p}=2(\bmod p) \\
//         & 3^{p} \equiv 3(\bmod p) \\
//         & \vdots \\
//         &(p-1)^{p} \equiv p_{-1}(\bmod p)
//       \end{aligned}
//       `} />

//       <BlockMath math={String.raw`
//       \begin{aligned}
//         & \text{Therefore we can now simplify our question, as Showing } y 1^{p}+2^{p}+\cdots+(p-1)^{p} \equiv 0 \text{ (nad) is equivalent to Showing } 1+2+\cdots+(p-1) \equiv 0 \text{ (mod } p)
//         \\
//         & \text{Now using the Sum of the first p-1 natural numbers we sorn see that } 1+2+\cdots+(P-1)=\frac{P(P-1)}{2} \text{, where } P \text{ is a Prime and } P \neq 2
//         \\
//         & \therefore \text{we can see } \frac{P(P-1)}{2} \text{ is a multiple of } P, \text{ hence}
//       \end{aligned}
//       `} />

//       <BlockMath math={String.raw`
//       \begin{aligned}
//         & \frac{p(p-1)}{2} \equiv 0(\bmod p) \\
//         & \therefore \text{Because } 1+2+\cdots+(p-1) \equiv 0(\bmod p) \\
//         & \text{By g Fermat's little theorem, } 1+2+\ldots+(p-1) \equiv 1^{p}+2^{p}+\cdots+(p-1)^{p} \quad(\bmod p)
//       \end{aligned}
//       `} />

//       <BlockMath math={String.raw`
//       \text{So were shawn } 1^{p}+2^{p}+\cdots+(p-1)^{p} \equiv 0 \text{ (mod } p)
//       `} />

//       <BlockMath math={String.raw`
//       \begin{aligned}
//         &(123456789)^{94}(\bmod 8) \\
//         & \text{First thing we do is find the modurios of the base en } 123456789 \bmod 8 \\
//         & \text{We can find this by focusing on the last 3 digits } 789 \bmod 8=5 \\
//         & \therefore 123456789 \bmod 8=5 \\
//         & \text{Therefore all we have to find is } (5)^{99} \bmod 8 \\
//         & \text{Let try find a pattern}
//       \end{aligned}
//       `} />

//       {/* Rest of the equations */}
      
//       <BlockMath math={String.raw`
//       \text{In obler coords 12345 is the Dilted solvtion to } x^{3}+14 x+30 \equiv 0 \bmod 12769
//       `} />
//     </div>
//   );
// }



//this will probably end up being quite a bulky component but then later we can isolate functionality into to different components and just import it all here. 
//Plans for this component:
/*
-- Essentially display a given question correctly depening on the question type. (SO WE'LL BE CHECKING QUESTION TYPE AND THEN RENDERING ACCORDINGLY)
--> perhaps we can have different components imported into here based on the question type and then render them if the correct type was selected! 
 ----> so basically we will use teh location hook to pass the specific question data to the component, then we will 
       display the question in the correct format depending on whether or not it is a written quesiton, fill in style of question, 
       mathematical notation type of question and lastly written to paper and uploaded style of question. 

-- Then I want to have a component at the side that is maybe a question description that shows a breif description of the question plus the question titles 
   for potentially similar questions (eg same topic + same format of answering), if they've attempted the question before we also want to display the mark
   then a button [ > ] at the bottom right which can enable the student to move onto the next question. 

-- You need to decide how each question is structured and the type of questions you want your site to support so we know how to structure our DB schema 
   to faciliate each of these use cases, 

   ---ONCE THE UNDERLYING STRUCTURE IS CREATED WE WANNA GET TO THE POINT WHERE ALL WE HAVE TO DO IS CREATE QUESTIONS WITH THE CORRECT STRUCTURE 
      FOR ALL QUESTION TYPES (APART FROM THE COMPLETE AI MARKING ASPECT) THEN WE CAN FOCUS PRIMARILY ON THE AI ASPECTS + MACHINE LEARNING FOR PROGRESS + 
      VIDEOS. ALL WE'LL HAVE TO DO IS FIND A SET NUMBER OF QUESTIONS PER DAY AND ADD THEM TO THE DB IN THE CORRECT FORMAT


*/
