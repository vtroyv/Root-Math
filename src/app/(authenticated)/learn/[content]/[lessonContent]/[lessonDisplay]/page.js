'use client';
import { useEffect, useState,useRef } from 'react';
import { Alert } from 'reactstrap';
import {  useDynamicLessonDataMutation,useLessonQuestionFeedbackMutation } from '@/lib/redux/slices/apiSlice';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useLessonStore } from '@/lib/zustand/providers/lesson-state-provider';
import ThreePaneResponsive from '@/lib/components/learn/lessons/ThreePaneResponsive';
import Instructions from '@/lib/components/learn/lessons/Instructions';
import LessonDisplay from '@/lib/components/learn/lessons/LessonMathDisplay';
import Feedback from '@/lib/components/learn/lessons/feedback';
import { useUpdateLessonProgressMutation } from '@/lib/redux/slices/apiSlice';
import ComputeEngineConfig from '@/lib/utils/ceConfig';
import preprocessLatex from '@/lib/utils/preprocess-latex';



export default function LessonsPage() {
  //Set up State hooks:
  const [lesson, setLesson] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [userTaskIndex, setUserTaskIndex] = useState(null);
  const [userLatexStore, setUserLatexStore] = useState('');
  const [taskState, setTaskState] = useState([]);
  const [userTaskState, setUserTaskState]= useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState([]);
  const [userFeedbackMessage, setUserFeedbackMessage] = useState([]);
  const [tasksCount, setTasksCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');

  //compute engine reference
  const ceRef = useRef(null)

  const {addLesson, updateCurrentPart, tasks,    } = useLessonStore();
  const globalTaskStates = useLessonStore((state)=> state.taskState);

  const { isLoaded, isSignedIn, user } = useUser();
  
  
  useEffect(() => {
    //Responsible for removing alery messages after 3 secs
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Set up reduxAPI hook to connect with nextjs API route handler 
  const [lessonQuestionFeedback, mutationStateA] = useLessonQuestionFeedbackMutation(); // responsible for getting feedback on a lesson task
  const [dynamicLessonData, mutationStateB]= useDynamicLessonDataMutation();// responsible for getting the static lesson data and dynamic userProgress data, if userProgress doesn't exist it creates it, e.g. first time doing lesson
  const [updateUserProgress, mutationStateC] = useUpdateLessonProgressMutation(); //responsible for updating the user progress 


  const params = useParams();

  const apiParams = { lessonData: params.lessonDisplay } //the title of the lesson


  


 


  

  useEffect(() => {
    /*
    PURPOSE
    _______
    The purpose of this useEffect is to fetch an object containing the staticLessonData and userProgressData from the database
    and then set the lesson and userProgress state to these values.

    */
    
    const getLessonData = async () => {
      try {
        // first build the params and userID
        if (isSignedIn) {
          const {id, unsafeMetadata} = user
          const {examBoard} = unsafeMetadata
          

          
          const dynamicRouteData = {params: apiParams, userId: id, examBoard: examBoard} 
        
        //This function should return a              and dynamicLessonData as keys in obj
        const result = await dynamicLessonData(dynamicRouteData)
        const {staticLessonData,userProgressData} = result.data; 

       


        
        
        setLesson(staticLessonData)
        addLesson(staticLessonData) // how the addLesson hook from our zustand store works it updates the task states etc, using the static lesson data, e.g checking the tasks in the current part from the static data and updating the tasks part of the zustand store accordingly
        setUserProgress(userProgressData)



        

      } 
    } catch(error) {
      // Eventually update this error to return a UI where users 
      console.log('Mutation error: ', err);
    }
  }
  getLessonData() 
},[ isSignedIn, user,]);

useEffect(()=>{
  console.log('The tasks being read from the zustand store is ', tasks)


}, [tasks])


  // When "part" changes, re-initialize taskState
  //currently from this line and below the code is responsible for fetching the taskstate and feedback.
  // ---------------------------------------------------  

  useEffect(() => {

    if (!lesson) return;
    const part = lesson.parts[currentPartIndex]; //Note the currentPartIndex is always set to 0, that's why page refreshes send you back to 0. 

    
    const userProgressPart = userProgress.parts[currentPartIndex]
    const tasksInUserProgressPart = userProgressPart.tasks


    // We'll look for tasks in part.blocks. 
    // The first task is "unlocked", rest "locked".
    const tasksInPart = part.blocks.filter(b => b.type === 'task');

    

    // const count = tasksInPart.length;
    const countTasksUserProgress = tasksInUserProgressPart.length 
    setTasksCount(countTasksUserProgress);

   //Now this code below essentially sets the task state, however, i would like to start reading the taskState instead.
   //Now in regards to this we may simply beable to just send over the userProgressTaskState as it is as it already contains a status field. 
   

    const newTaskState = tasksInPart.map((task, idx) => {
      if (idx === 0) {
        return { status: 'unlocked', task }; 
      } else {
        return { status: 'locked', task };
      }
    });
    setTaskState(newTaskState);

    //Essentially a first time a new user accesses a specific lesson, 
    //every taskStatus is set to 'locked', so essentially everytime a part changes this 
    //should take the tasks for the parts for the user and unlock the first task without changing anything else
    const newUserTaskState = tasksInUserProgressPart.map((task, idx) => {
      if (idx === 0 && task.status == 'locked'){
        const unlockedFirstTask = {...task, status:'unlocked'}
        return unlockedFirstTask
      } else{
        return task
      }
    });


  

    setUserTaskState(newUserTaskState)
   

    // Clear feedback each time we load a new part
    setFeedbackMessage('');

    //should obtain the feedbackMessages everytime we load a new part 
    const userFeedback = tasksInUserProgressPart.map(((task) => task.feedback))
    //Now that we have an array of the user's current feedback we simply need to add it to the feedback state!
    setUserFeedbackMessage(userFeedback)

    
//This is done we now simply need to replace what were calling to see if it works 


  }, [lesson, currentPartIndex]);
  // ---------------------------------------------------------------

  //This useEffect is responsible for updating the userProgressState and sending it to the DB
  useEffect(() => {
    //Now all we have to do here is set a safety guard so that it only updates
    //when both the userFeeedbackMessage and userTaskState have updated, 
    //Then we need to send these updates to the database!

    //Once this is fully working we'll simply replace all useState with zustand - potentially!

    if (
      (userTaskState[userTaskIndex]?.status === 'correct' ||
       userTaskState[userTaskIndex]?.status === 'incorrect') &&
      userFeedbackMessage[userTaskIndex]
    ) {

      //Now we should simply provide an update to the userProgress object then simply send that off to mongoDB
      setUserProgress((oldState) => {
        // Create a shallow copy of the entire state
        const newState = { ...oldState };
      
        // Create a shallow copy of the parts array
        newState.parts = [...oldState.parts];
      
        // Create a shallow copy of the specific part you want to update
        newState.parts[currentPartIndex] = {
          ...oldState.parts[currentPartIndex],
          // Also create a copy of the tasks array for that part
          tasks: [...oldState.parts[currentPartIndex].tasks]
        };
      
        // Now update the tasks array as needed.
        // If you want to replace the tasks array completely with userTaskState:
        newState.parts[currentPartIndex].tasks = userTaskState;
      
        // Then update the feedback for the specific task:
        newState.parts[currentPartIndex].tasks[userTaskIndex] = {
          ...newState.parts[currentPartIndex].tasks[userTaskIndex],
          feedback: userFeedbackMessage[userTaskIndex]
        };

        return newState;
      });

    
      // This function isn't running as it's not 
      // This function below should update our userStatus in the database whenever our user makes any progress
     
    }
  }, [userFeedbackMessage, userTaskState]);
//
  useEffect(()=>{
    if((userTaskState[userTaskIndex]?.status === 'correct' ||
      userTaskState[userTaskIndex]?.status === 'incorrect') &&
     userFeedbackMessage[userTaskIndex] && userTaskIndex === 0 || userTaskIndex) {

      

      const updateUserProgresFunc = async()=>{

        const progress= userProgress
        const data = {progress, collection: lesson.collection}
   
        const updatedStatus = await updateUserProgress(data);

      }

      
      //You should probably have some fall back logic to retry post if false value comes back etc!

      updateUserProgresFunc();  
      //Now that were successfully updating the database with the userProgress,
      //It's about time to replace all the state with the dynamic state 

    }

  }, [userProgress])

  useEffect(()=>{
    //Update zustandStore with the new currentPart
    updateCurrentPart(currentPartIndex) 

  }, [currentPartIndex])
 
  
  if (!lesson) {
    return <div>Loading lesson...</div>;
  }

  const currentPart = lesson.parts[currentPartIndex];

  /** 
   * Called by LessonDisplay on "submit"
   * We'll simulate a server check. In real usage, do fetch(...)
   */
      //we will want to update this function to provide updates to the userProgres obect on submission aswell, e.g. store feedback etc
  async function handleSubmitTask(taskIndex, latexInput, userLatex, multipleChoiceImages = null) {


    setUserLatexStore(userLatex);

    setUserTaskIndex(taskIndex);

     // Create variables needed for the switch statement below
    let lessonData
   
   
    const task = taskState[taskIndex];
    const userTask = userTaskState[taskIndex] 
    const taskType  = task.task.renderType;
    const slug = lesson.slug;
    const partID = lesson.parts[currentPartIndex].id;
    const ceConfig = new ComputeEngineConfig();
    const ce = ceConfig.getEngine();
    ceRef.current = {ce}
    let selectedChoice
    let preprocessedArray
    let boxedExpressionArray
    let compiled
    let compiledStrings
    let reducedCoordinates

    console.log(`The task type is ${taskType}`)

    

    switch(taskType) {
      case 'multipleChoiceImages':
         selectedChoice =  globalTaskStates[taskIndex].selectedChoice; 
        lessonData = {slug, partID, task, selectedChoice, taskType}
        break; 

      case 'sketch':
       
        reducedCoordinates = globalTaskStates[taskIndex].reducedCoordinates;
        lessonData = {slug, partID, task, reducedCoordinates, taskType}
        console.log('The lessonData is ', lessonData)
        break;

      case 'multipleChoice':
         selectedChoice = globalTaskStates[taskIndex].selectedChoice;
         lessonData = {slug, partID, task, selectedChoice, taskType}
         break;

      case 'image':
        latexInput = globalTaskStates[taskIndex].latex

    
         preprocessedArray = preprocessLatex(latexInput); 
        console.log('The preprocessedArray is ', preprocessedArray)

         boxedExpressionArray = preprocessedArray.map(item => 
          ceRef.current.ce.parse(item)
        );

        console.log('The boxedExpressionArray is ', boxedExpressionArray)


         compiled = boxedExpressionArray.map(bE => bE.compile('sympy'));
        console.log('the compiled is ', compiled)
        
         compiledStrings= compiled.map(fn => fn.toString());
        console.log('The compiled strings are ', compiledStrings)
        


        lessonData = {slug, partID, task, compiledStrings, taskType}

        break;

        case 'curveAndMfe':
          console.log('This case ran just right now!');
          latexInput = globalTaskStates[taskIndex].latex
          reducedCoordinates = globalTaskStates[taskIndex].reducedCoordinates;

          preprocessedArray = preprocessLatex(latexInput);
          console.log('The preprocessedArray is ', preprocessedArray)

          boxedExpressionArray = preprocessedArray.map(item => 
            ceRef.current.ce.parse(item)
          );
  
          console.log('The boxedExpressionArray is ', boxedExpressionArray)
  
  
           compiled = boxedExpressionArray.map(bE => bE.compile('sympy'));
          console.log('the compiled is ', compiled)
          
           compiledStrings= compiled.map(fn => fn.toString());
          console.log('The compiled strings are ', compiledStrings)

          //IM CURRENTLY REPEATING ALOT OF CODE HERE BETWEEN THE curveAndMfe and image task cases, encapsulate this into a function

          lessonData = {slug, partID, task, compiledStrings, reducedCoordinates, taskType}
          console.log('The lessonData is ', lessonData)

          //Next add a model and case for this in the fastapi sever -> implement sympy logic for checking if two expressions are equal or equal something predefined in the markScheme!
          break;



       




      default:
        lessonData = { slug, partID, task, latexInput };
        break;

    } 
   


    const { feedback, correct } = await verifyTask(lessonData);
 
  
  

    setTaskState(oldState => {
      const newState = [...oldState];

      // Mark current task as correct or incorrect.
      newState[taskIndex] = {
        ...newState[taskIndex],
        status: correct ? 'correct' : 'incorrect',
      };

      //we essneially just need to copy this for the userTaskState, but if it's true also update the corresponding taskState in the database!
      // Note we do want to eventually use zustand so eventually this should be updated to make a change to the zustand Store and then send the change to mongoD

      // If correct, unlock next if it exists.
      if (correct && newState[taskIndex + 1]) {
        if (newState[taskIndex + 1].status === 'locked') {
          newState[taskIndex + 1].status = 'unlocked';
        }
      }
      
      return newState;
    });

    setUserTaskState(oldState => {
      const newState = [...oldState]
    

      //Mark the current task as correct or incorrect
      newState[taskIndex] = {
        ...newState[taskIndex],
        status: correct ? 'correct': 'incorrect'
      };

      

      //If correct, unlock the next step if it exists 
      if (correct && newState[taskIndex +1]) {
        

        if (newState[taskIndex+1].status ==='locked') {
          
          newState[taskIndex+1]= {
            ...newState[taskIndex+1], 
            status: 'unlocked'
          }
        }
      }

  
      
      return newState
    })

    //lets handle updating the feedback for the given userTask first then send the update to the database

    setFeedbackMessage(prevFeedback => {
      const updated = [...prevFeedback];
      updated[taskIndex] = feedback;
      return updated;
    });
    

    setUserFeedbackMessage(prevFeedback => {
      const updated = [...prevFeedback]
 
      updated[taskIndex] = feedback;
      return updated;
    })


    
    

    //Now lastly at this point i need to perform an update to the mongoBD, what needs to happen is,
    //i need to send the updated feedback plus the new taskState to the mongoDB, 
    //In fact it would even be good to update the correct field aswell,
    /*
    CHANGES/IMPROVEMENTS TO MAKE
    ----------------------------
    I should store and array of the feedbacks, for each task 
    as well as an array of the correct, incorrect, or pending for the correct field
    this will be extremely valueable for mem0.

    */

    //tasks and feedback are both arrays so all we have to do is track the overall 
    //Index for the specific task that were on then have a useEffect that updates the userProgress
    //and sends the update to the mongoDB, if and only if both the feedback and task status
    //feedback for currentIndex is non-nullish, and status is 'correct' or 'incorrect'

  }

 
  async function verifyTask(lessonData) {

    const res = await lessonQuestionFeedback(lessonData).unwrap();

    //use the same route for everything but 
    
    return res;
  }
    
  // Enable "Next" button only if all tasks are correct.
  const allTasksCorrect = userTaskState.every(t => t.status === 'correct');
  const isLastPart = currentPartIndex === lesson.parts.length - 1;

  const handleBack = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex(i => i - 1);
    }
  };

  const handleNext = () => {
    if (!allTasksCorrect) {
      setAlertMessage('You must complete all tasks before moving on!');
      return;
    }
    if (!isLastPart) {
      setCurrentPartIndex(i => i + 1);
      
      
    } else {
      setAlertMessage('You have reached the end of the lesson!');
    }
  };

  // ---------- 1) Instructions Pane
  const instructionsPane = (
    <Instructions
      part={currentPart}
      currentPartIndex={currentPartIndex}
      totalParts={lesson.parts.length}
      onBack={handleBack}
      onNext={handleNext}
      taskState={userTaskState} // pass tasks + statuses so we can show checkboxes
    />
  );

  // ---------- 2) LessonDisplay (center)
  const mainPane = (
    <LessonDisplay
      part={currentPart}
      onSubmitTask={handleSubmitTask}
      taskState={userTaskState}
      
    />
  );

  // ---------- 3) Feedback Pane (right)
  const feedbackPane = (
    <Feedback
      // You can store "feedbackMessage" here
      part={currentPart}
      extraFeedback={userFeedbackMessage}
      tasksCount={tasksCount}
    />
  );

  return (
    <>
      {/* Display the Reactstrap alert if there's an alert message */}
      {alertMessage && (
        <Alert color="warning">
          {alertMessage}
        </Alert>
      )}
      <ThreePaneResponsive
        instructions={instructionsPane}
        mainContent={mainPane}
        feedbackData={{
          feedback: feedbackPane,
        }}
      />
    </>
  );
}
