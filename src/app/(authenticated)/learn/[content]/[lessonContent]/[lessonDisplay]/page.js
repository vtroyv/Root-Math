'use client';
import { useEffect, useState } from 'react';
import { Button, Alert } from 'reactstrap';
import { useGetLessonDataQuery, useDynamicLessonDataMutation,useLessonQuestionFeedbackMutation } from '@/lib/redux/slices/apiSlice';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import ThreePaneResponsive from '@/lib/components/learn/lessons/ThreePaneResponsive';
import Instructions from '@/lib/components/learn/lessons/Instructions';
import LessonDisplay from '@/lib/components/learn/lessons/LessonMathDisplay';
import Feedback from '@/lib/components/learn/lessons/feedback';
import { useUpdateLessonProgressMutation } from '@/lib/redux/slices/apiSlice';

export default function LessonsPage() {
  const [lesson, setLesson] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [userTaskIndex, setUserTaskIndex] = useState(null);

  // For each part, we track an array of tasks with statuses
  const [taskState, setTaskState] = useState([]);
  const [userTaskState, setUserTaskState]= useState([]);
  // We'll store a feedback message from the "server" to show in the right pane
  const [feedbackMessage, setFeedbackMessage] = useState([]);
  const [userFeedbackMessage, setUserFeedbackMessage] = useState([]);
  const [tasksCount, setTasksCount] = useState(0);
  // Alert message state for displaying Reactstrap alerts
  const [alertMessage, setAlertMessage] = useState('');

  //Access userData from clerkJS
  const { isLoaded, isSignedIn, user } = useUser();
  
  // Auto-dismiss alert after 3 seconds if one is shown.
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Set up reduxAPI hook to connect with nextjs API route handler 
  const [lessonQuestionFeedback, mutationStateA] = useLessonQuestionFeedbackMutation();
  const [dynamicLessonData, mutationStateB]= useDynamicLessonDataMutation();
  const [updateUserProgress, mutationStateC] = useUpdateLessonProgressMutation();
  const params = useParams();
  const apiParams = { lessonData: params.lessonDisplay };


 


  
  // fetch multi-part lesson
  useEffect(() => {
    
    const getLessonData = async () => {
      try {
        // first build the params and userID
        if (isSignedIn) {
          const {id, unsafeMetadata} = user
          const {examBoard} = unsafeMetadata
          

          
          const dynamicRouteData = {params: apiParams, userId: id, examBoard: examBoard} 
        
        //This function should return a staticLessonData and dynamicLessonData as keys in obj
        const result = await dynamicLessonData(dynamicRouteData)
        const {staticLessonData,userProgressData} = result.data
        
       
        setLesson(staticLessonData)
        setUserProgress(userProgressData)

        console.log('The userProgress is ', userProgressData)
        console.log('THe static lesson data is ', staticLessonData)
        
        

       
      } 
    } catch(error) {
      // handle error appropriately
      console.log('Mutation error: ', err);
    }
  }
  getLessonData()

  


   
},[ params.lessonDisplay ,isSignedIn, user,]);


  // When "part" changes, re-initialize taskState
  //currently from this line and below the code is responsible for fetching the taskstate and feedback.
  //Now although this probably not the best practice, i would like to avoid as much as possible from rewriting all this code from scratch. 
  useEffect(() => {
    if (!lesson) return;
    const part = lesson.parts[currentPartIndex];

    // we will first use the currentPartIndex, to fetch the part from the userProgress State. 
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
    })
  

    setUserTaskState(newUserTaskState)
   

    // Clear feedback each time we load a new part
    setFeedbackMessage('');

    //should obtain the feedbackMessages everytime we load a new part 
    const userFeedback = tasksInUserProgressPart.map(((task) => task.feedback))
    //Now that we have an array of the user's current feedback we simply need to add it to the feedback state!
    setUserFeedbackMessage(userFeedback)

    
//This is done we now simply need to replace what were calling to see if it works 


  }, [lesson, currentPartIndex]);

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
      console.log('userFeedbackMessage has been updated:', userFeedbackMessage);
      console.log('userTaskState has been updated:', userTaskState);
      console.log('The userProgess state is ', userProgress)
      console.log('The current userPartIndex is ', currentPartIndex)
      console.log('The currentuserTaskIndex is ', userTaskIndex)

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
      
        console.log('The new userProgress state after updating feedback and everything is ', newState);
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

        console.log('The updatedStatus is ', updatedStatus);
      }

      
      //You should probably have some fall back logic to retry post if false value comes back etc!

      updateUserProgresFunc();  
      //Now that were successfully updating the database with the userProgress,
      //It's about time to replace all the state with the dynamic state 

    }

  }, [userProgress])

  
  if (!lesson) {
    return <div>Loading lesson...</div>;
  }

  const currentPart = lesson.parts[currentPartIndex];

  /** 
   * Called by LessonDisplay on "submit"
   * We'll simulate a server check. In real usage, do fetch(...)
   */
      //we will want to update this function to provide updates to the userProgres obect on submission aswell, e.g. store feedback etc
  async function handleSubmitTask(taskIndex, latexInput) {
    
    //First update the userTaskIndex in the global state using taskIndex, 
    //as we will need it in our safeguarded useEffct which updates the userProgress DB!

    setUserTaskIndex(taskIndex);
    console.log('The task index is ', taskIndex)

    const task = taskState[taskIndex];
    const userTask = userTaskState[taskIndex]


    const slug = lesson.slug;
    const partID = lesson.parts[currentPartIndex].id;

    const lessonData = { slug, partID, task, latexInput };

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
        console.log('This if clause is running')

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
    
    return res;
  }
    
  // Enable "Next" button only if all tasks are correct.
  const allTasksCorrect = taskState.every(t => t.status === 'correct');
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
      taskState={taskState} // pass tasks + statuses so we can show checkboxes
    />
  );

  // ---------- 2) LessonDisplay (center)
  const mainPane = (
    <LessonDisplay
      part={currentPart}
      onSubmitTask={handleSubmitTask}
      taskState={taskState}
    />
  );

  // ---------- 3) Feedback Pane (right)
  const feedbackPane = (
    <Feedback
      // You can store "feedbackMessage" here
      part={currentPart}
      extraFeedback={feedbackMessage}
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
