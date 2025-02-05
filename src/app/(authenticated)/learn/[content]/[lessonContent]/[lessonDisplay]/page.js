'use client';
import { useEffect, useState } from 'react';
import { Button, Alert} from 'reactstrap';
import { useGetLessonDataQuery, useLessonQuestionFeedbackMutation } from '@/lib/redux/slices/apiSlice';
import { useParams } from 'next/navigation';

import ThreePaneResponsive from '@/lib/components/learn/lessons/ThreePaneResponsive';
import Instructions from '@/lib/components/learn/lessons/Instructions';
import LessonDisplay from '@/lib/components/learn/lessons/LessonMathDisplay';
import Feedback from '@/lib/components/learn/lessons/feedback';

export default function LessonsPage() {
  const [lesson, setLesson] = useState(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);

  // For each part, we track an array of tasks with statuses
  const [taskState, setTaskState]= useState([])
  // We'll store a feedback message from the "server" to show in the right pane
  const [feedbackMessage, setFeedbackMessage]= useState([])
  const [tasksCount, setTasksCount] = useState(0);

  //Set up reduxAPI hook to connect with nextjs API route handler 
  const [lessonQuestionFeedback, mutationState] = useLessonQuestionFeedbackMutation()
  const params = useParams()
  console.log('The params are ', params)

  const apiParams = {lessonData: params.lessonDisplay}
 

  const {data, isLoading} = useGetLessonDataQuery(apiParams)
 


  // Mock "fetch" of multi-part lesson
  useEffect(() => {

    const lessonData = data
   

  
    setLesson(lessonData);
  }, [data]);

  // When "part" changes, re-initialize taskState
  useEffect(() => {
    if (!lesson) return;
    const part = lesson.parts[currentPartIndex];
    // We'll look for tasks in part.blocks. 
    // The first task is "unlocked", rest "locked".
    const tasksInPart = part.blocks.filter(b => b.type === 'task');
    const count = part.blocks.filter(b => b.type =='task').length;
    console.log('The count is ', count )
    setTasksCount(count)

    const newTaskState = tasksInPart.map((task, idx) => {
      if (idx === 0) {
        return { status: 'unlocked', task }; 
      } else {
        return { status: 'locked', task };
      }
    });
    setTaskState(newTaskState);
    // Clear feedback each time we load a new part
    setFeedbackMessage('');
  }, [lesson, currentPartIndex]);


  if (!lesson) {
    return <div>Loading lesson...</div>;
  }

  const currentPart = lesson.parts[currentPartIndex];

  /** 
   * Called by LessonDisplay on "submit"
   * We'll simulate a server check. In real usage, do fetch(...)
   */
  function handleSubmitTask(taskIndex, latexInput) {
    // For demonstration, we'll pretend the server always returns correct if the latexInput includes "x^7"
    // or something. Real usage: fetch to FastAPI.
    console.log('Just testing the taskIndex is ', taskIndex)
    console.log('And the taskState is ', taskState[taskIndex])
    simulateServerCheck(latexInput).then(res => {
      setFeedbackMessage(['testing', 'testing again']); // store message
      // Update the tasks
      setTaskState(oldState => {
        const newState = [...oldState];
        // Mark current task as correct or incorrect
        newState[taskIndex] = {
          ...newState[taskIndex],
          status: res.correct ? 'correct' : 'incorrect',
        };
        // If correct, unlock next if it exists
        if (res.correct && newState[taskIndex + 1]) {
          if (newState[taskIndex + 1].status === 'locked') {
            newState[taskIndex + 1].status = 'unlocked';
          }
        }
        return newState;
      });
    });
  }

  // Enable "Next" button only if all tasks are correct
  const allTasksCorrect = taskState.every(t => t.status === 'correct');
  const isLastPart = currentPartIndex === lesson.parts.length - 1;

  const handleBack = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex(i => i - 1);
    }
  };

  const handleNext = () => {
    if (!allTasksCorrect) {
      alert('You must complete all tasks before moving on!');
      return;
   
    }
    if (!isLastPart) {
      setCurrentPartIndex(i => i + 1);
    } else {
      alert('You have reached the end of the lesson!');
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
    <ThreePaneResponsive
      instructions={instructionsPane}
      mainContent={mainPane}
      feedbackData={{
        feedback: feedbackPane,
      }}
    />
  );
}

/** 
 * Simulate a server check. 
 * In real usage, you'd do:
 *   const res = await fetch('/api/validate', { method: 'POST', body: ... })
 *   return await res.json();
 */
function simulateServerCheck(userLatex) {
  return new Promise(resolve => {
    setTimeout(() => {
      // just a silly check: if user latex includes 'x^7', it's correct
      if (userLatex.includes('x^7')) {
        resolve({
          correct: true,
          feedback: '✔ Correct! Good job!',
        });
      } else {
        resolve({
          correct: false,
          feedback: '✘ Incorrect, please try again.',
        });
      }
    }, 800);
  });
}
