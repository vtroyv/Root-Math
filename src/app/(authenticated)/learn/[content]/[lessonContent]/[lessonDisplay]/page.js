'use client';
import { useEffect, useState } from 'react';
import { Button, Alert } from 'reactstrap';
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
  const [taskState, setTaskState] = useState([]);
  // We'll store a feedback message from the "server" to show in the right pane
  const [feedbackMessage, setFeedbackMessage] = useState([]);
  const [tasksCount, setTasksCount] = useState(0);
  // Alert message state for displaying Reactstrap alerts
  const [alertMessage, setAlertMessage] = useState('');

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
  const [lessonQuestionFeedback, mutationState] = useLessonQuestionFeedbackMutation();
  const params = useParams();
  console.log('The params are ', params);

  const apiParams = { lessonData: params.lessonDisplay };

  const { data, isLoading } = useGetLessonDataQuery(apiParams);

  // Mock "fetch" of multi-part lesson
  useEffect(() => {
    const lessonData = data;
    setLesson(lessonData);
  }, [data]);

  // When "part" changes, re-initialize taskState
  useEffect(() => {
    if (!lesson) return;
    const part = lesson.parts[currentPartIndex];
    console.log('The current part is ', part);
    // We'll look for tasks in part.blocks. 
    // The first task is "unlocked", rest "locked".
    const tasksInPart = part.blocks.filter(b => b.type === 'task');
    const count = tasksInPart.length;
    console.log('The count is ', count);
    setTasksCount(count);

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
  async function handleSubmitTask(taskIndex, latexInput) {
    const task = taskState[taskIndex];
    console.log('The task that i would like to send is ', task);
    const slug = lesson.slug;
    const partID = lesson.parts[currentPartIndex].id;

    const lessonData = { slug, partID, task, latexInput };

    const { feedback, correct } = await verifyTask(lessonData);
    console.log('The feedback from the apiRoute is ', feedback);
    console.log('The correct status from the apiRoute is ', correct);

    setTaskState(oldState => {
      const newState = [...oldState];

      // Mark current task as correct or incorrect.
      newState[taskIndex] = {
        ...newState[taskIndex],
        status: correct ? 'correct' : 'incorrect',
      };

      // If correct, unlock next if it exists.
      if (correct && newState[taskIndex + 1]) {
        if (newState[taskIndex + 1].status === 'locked') {
          newState[taskIndex + 1].status = 'unlocked';
        }
      }
      console.log('The new taskState is given by ', newState);
      return newState;
    });
    setFeedbackMessage(prevFeedback => {
      const updated = [...prevFeedback];
      updated[taskIndex] = feedback;
      return updated;
    });
  }
    
  async function verifyTask(lessonData) {
    const res = await lessonQuestionFeedback(lessonData).unwrap();
    console.log('The response from the apiRoute is , ', res);
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
