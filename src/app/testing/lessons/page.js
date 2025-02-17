'use client';
import { useEffect, useState } from 'react';
import { Alert } from 'reactstrap';
import ThreePaneResponsive from '@/lib/components/learn/lessons/ThreePaneResponsive';
import Instructions from '@/lib/components/learn/lessons/Instructions';
import LessonDisplay from '@/lib/components/learn/lessons/LessonMathDisplay';
import Feedback from '@/lib/components/learn/lessons/feedback';
import { useUser } from '@clerk/nextjs';

/**
 * Takes in static lesson data and a userId,
 * and returns an object ready for insertion into your MongoDB user progress collection.
 *
 * @param {Object} staticLessonData - The lesson object with fields like slug, parts, etc.
 * @param {string} userId - The identifier for the current user.
 * @returns {Object} - The user progress object.
 */
function createUserProgress(staticLessonData, userId) {
  const { slug: lessonSlug, parts } = staticLessonData;
  const partsProgress = parts.map((part) => {
    const tasks = part.blocks
      .filter((block) => block.type === "task")
      .map((task, index) => {
        const partId =
          typeof part.id === "object" && part.id.$numberInt
            ? part.id.$numberInt
            : part.id;
        return {
          taskId: `part-${partId}-task-${index + 1}`,
          title: task.title,
          instructions: task.instructions,
          hint: task.hint,
          expected: task.gpt,
          status: "locked",
          answer: null,
          correct: null,
          feedback: null,
          submittedAt: null,
          userLatex: '',
        };
      });
    return {
      partId:
        typeof part.id === "object" && part.id.$numberInt
          ? part.id.$numberInt
          : part.id,
      title: part.title,
      tasks,
    };
  });
  return {
    lessonSlug,
    userId,
    parts: partsProgress,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default function LessonsPage() {
  const [lesson, setLesson] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [userTaskIndex, setUserTaskIndex] = useState(null);
  const [userLatexStore, setUserLatexStore] = useState('');

  // For each part, we track an array of tasks with statuses
  const [taskState, setTaskState] = useState([]);
  const [userTaskState, setUserTaskState] = useState([]);
  // We'll store a feedback message from the "server" to show in the right pane
  const [feedbackMessage, setFeedbackMessage] = useState([]);
  const [userFeedbackMessage, setUserFeedbackMessage] = useState([]);
  const [tasksCount, setTasksCount] = useState(0);
  // Alert message state for displaying Reactstrap alerts
  const [alertMessage, setAlertMessage] = useState('');

  const { isLoaded, isSignedIn, user } = useUser();

  // Auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Hardcoded staticLessonData
  const staticLessonData = {
    "_id": { "$oid": "67b36df8d5b1e261a98b903d" },
    "slug": "negative-and-fractional-indices",
    "title": "The Laws of Indices II",
    "next": "introduction-to-surds",
    "parts": [
      {
        "id": { "$numberInt": "1" },
        "title": "Let's get Rational",
        "blocks": [
          { "type": "paragraph", "content": "In our last lesson, we were introduced to the following index laws:" },
          { "type": "bullet-points", "points": ["$a^{n} \\cdot a^{m} = a^{m+n}$", "$\\frac{a^n}{a^m} = a^{n-m}$", "$(a^m)^n = a^{m \\cdot n}$", "$(ab)^n = a^n\\,b^n$"] },
          { "type": "paragraph", "content": "We can extend these laws to rational (i.e fractional) exponents, negative exponents, and even a combination of both of them! Before, we dive in, let's first get a solid understanding of what a rational number is." },
          { "type": "paragraph", "content": "A rational number is any number that can be expressed in the form $\\frac{a}{b}$, where $a$ and $b$ are integers and $b$ can't equal 0 i.e  $(b \\neq 0)$. Note a integer is any whole number which can be positive, negative or zero, for example:" },
          {"type": "paragraph", "content": " $..,  -2, -1, 0, 1, 2,...$ are all  examples of integers and the list continues to infinity and beyond!"},
          { "type": "paragraph", "content": "Now  $\\frac{1}{2}$ or $-\\frac{7}{12}$ are both examples of rational numbers as we have written them in the form $\\frac{a}{b}$, where $a$ and $b$ are both integers" },
          { "type": "paragraph", "content": "Also keep in mind that  numbers like $7$ or $2.75$ are also examples of rational numbers for instance, $7$ can be written in the form $7 = \\frac{7}{1}$ and  $2.75$ can be written as $2.75 = \\frac{11}{4}$, so be mindful." },
          { "type": "paragraph", "content": "Although rare, not all numbers can be written in the form $\\frac{a}{b}$, which means not all numbers are rationals. Numbers that can't be written in the form $\\frac{a}{b}$ are called irrational numbers, some examples of irrational numbers include:" },
          { "type": "paragraph", "content": "$\\pi = 3.1415926535...$ which continues forever without repeating making it irrational,another example is  $\\sqrt2 = 1.414..$ or $\\sqrt5$ both are non-repeating and non-terminating decimals and therefore irrational. " },
          { "type": "paragraph", "content": "Lastly, it's important to keep in mind that all integers are also rationals, for instance, we saw that integers are  $.., -3, -2, -1, 0, 1, 2, 3,...$, however, this can be written as  $.., -\\frac{3}{1}, -\\frac{2}{1}, -\\frac{1}{1}, \\frac{0}{1}, \\frac{1}{1}, \\frac{2}{1}, \\frac{3}{1},...$" },
          { "type": "paragraph", "content": "Now are you ready to hear something cool? - we can use the same laws of indices that we learned in our last lesosn with any rational power! " },
          { "type": "paragraph", "content": "For example we have $x^{\\frac{1}{4}} \\cdot x^{\\frac{1}{4}} \\cdot  x^{\\frac{1}{4}} \\cdot x^{\\frac{1}{4}} = x^{\\frac{1}{4} + \\frac{1}{4} + \\frac{1}{4} + \\frac{1}{4}} = x^1 =1$,  or $\\frac{x^{\\frac{5}{2}}}{x^{- \\frac{1}{2}}} = x^{\\frac{5}{2} - (- \\frac{1}{2})} = x^3$" },
          { "type": "paragraph", "content": "Now for rationals and negative numbers we have the following laws: " },
          { "type": "bullet-points", "points": ["$a^{\\frac{1}{m}} = \\sqrt[m]{a}$", "$a^{\\frac{n}{m}} = \\sqrt[m]{a^n}$", "$a^{-m} = \\frac{1}{a^m}$"] },
          { "type": "paragraph", "content": "These are just generalisations of our previous laws to rational expononent - We will now explore each of these laws in a bit more detail" },
          { "type": "task", "title": "what's a square root?", "instructions": "Read through the notes in the editor, when you're happy click submit", "gpt": "This is not a question - all you have to do is return correct, and 'well done' as feedback" }
        ],
        
        "latex": String.raw`
        \[
\begin{aligned}
  &\text{Did you know that when we have a square root } \sqrt x \\
  &\text{it's the same as } x^{\frac{1}{2}} \text{in other words, } x^{\frac{1}{2}} = \sqrt x\\
  &\\
  &\text{But it doesn't just stop there, we can also reprsent }\\
  &\ \text{the cube root as: }\\
  &\ \sqrt [3] x = x^{\frac{1}{3}} \text{ and, } \sqrt [4] x = x^{\frac{1}{4}} \text{ etc...}\\
  &\\
  &\ \text{So in general we have: } x^{\frac{1}{m}} = \sqrt [m] x\\
  &\ \text{Now once you've read through hit submit and move on to the next part of the lesson! }\\
  \end{aligned}
  `
         
      },
      {
        "id": { "$numberInt": "2" },
        "title": "Negative Indices",
        "blocks": [
          { "type": "paragraph", "content": "A negative power indicates a reciprocal. In general:" },
          { "type": "bullet-points", "points": ["$a^{-1} = \\frac{1}{a}$", "$a^{-n} = \\frac{1}{a^n}$"] },
          { "type": "paragraph", "content": "For instance, \\(x^{-3} = \\frac{1}{x^3}\\). This concept follows from the quotient rule \\(\\tfrac{a^n}{a^m} = a^{n-m}\\), along with \\(a^0 = 1\\)." },
          { "type": "paragraph", "content": "Let's practice simplifying expressions with negative indices." },
          { "type": "task", "title": "Check Your Understanding", "instructions": "Replace the '?' with the correct simplified form of 2x^-3.", "hint": "Remember x^-3 = 1/x^3.", "gpt": "Correct answer is 2 / x^3. Check if the student wrote that." },
          { "type": "task", "title": "Now Try This", "instructions": "Simplify each expression:\n1) x^-2 y^-1\n2) 3 / x^-3\nReplace '?' with the final simplified form.", "hint": "Dividing by x^-3 is the same as multiplying by x^3.", "gpt": "Answers: 1) 1/(x^2 y),  2) 3 x^3." }
        ],
        "latex": "\\begin{aligned}\\n  &\\text{1) Simplify the following: } 2x^{-3} = ?\\\\\\n  &\\\\\\n  &\\text{2) Now simplify these: } x^{-2}y^{-1}, \\quad \\frac{3}{x^{-3}}.\\\\\\n  &\\\\\\n  &\\text{3) A quick check: } \\frac{x^4}{x^3} = ?\\text{ (Is it a trick?)}\\\\\\n\\end{aligned}"
      },
      {
        "id": { "$numberInt": "3" },
        "title": "Fractional Indices",
        "blocks": [
          { "type": "paragraph", "content": "A fractional index corresponds to roots. For instance:" },
          { "type": "bullet-points", "points": ["$a^{\\tfrac{1}{2}} = \\sqrt{a}$ (the square root of a)", "$a^{\\tfrac{1}{3}} = \\sqrt[3]{a}$ (the cube root of a)", "$a^{\\tfrac{m}{n}} = \\bigl(a^m\\bigr)^{\\tfrac{1}{n}} = \\sqrt[n]{a^m}$"] },
          { "type": "paragraph", "content": "The same rules apply: if you multiply or divide expressions with the same base, you add or subtract their exponents, even if those exponents are fractional. And if you raise a power to another power, you multiply the exponents." },
          { "type": "paragraph", "content": "Let’s get some practice!" },
          { "type": "task", "title": "Warm-Up Task", "instructions": "Rewrite each as a radical or evaluate:\n1) x^(1/2)\n2) 64^(1/3)\n3) 81^(1/4)", "hint": "64^(1/3) = cube root of 64 = 4, etc.", "gpt": "Answers: 1) sqrt(x), 2) 4, 3) 3." },
          { "type": "task", "title": "Apply the Rules", "instructions": "Simplify:\n1) x^(3/4) * x^(5/4)\n2) (9^(1/2))^2\nReplace '?' with the correct exponent or value.", "hint": "Multiply with the same base => add exponents, raise a power to a power => multiply exponents.", "gpt": "Answers: 1) x^(3/4 + 5/4) = x^2, 2) 9." }
        ],
        "latex": "\\begin{aligned}\\n  &\\text{1) Simplify/interpret: } x^{1/2},\\quad 64^{1/3},\\quad 81^{1/4}.\\\\\\n  &\\\\\\n  &\\text{2) Combine fractional powers: } x^{3/4}\\cdot x^{5/4},\\quad \\bigl(9^{1/2}\\bigr)^{2}.\\\\\\n\\end{aligned}"
      },
      {
        "id": { "$numberInt": "4" },
        "title": "Combining Negative & Fractional Indices",
        "blocks": [
          { "type": "paragraph", "content": "We can also have negative fractional powers—these represent reciprocals of roots. For example:" },
          { "type": "bullet-points", "points": ["$a^{-\\tfrac{1}{2}} = \\frac{1}{a^{\\tfrac{1}{2}}} = \\frac{1}{\\sqrt{a}}$", "$a^{-\\tfrac{m}{n}} = \\frac{1}{a^{\\tfrac{m}{n}}} = \\frac{1}{\\sqrt[n]{a^m}}$"] },
          { "type": "paragraph", "content": "All of our earlier rules still apply. When multiplying or dividing, add or subtract exponents; when taking a power of a power, multiply the exponents." },
          { "type": "paragraph", "content": "Let’s practice a few examples." },
          { "type": "task", "title": "Check Your Understanding", "instructions": "Rewrite each expression without negative exponents:\n1) x^(-1/2) y^(3/2)\n2) 1 / x^(2/3)\nReplace '?' with the simplest form.", "hint": "Convert negative powers to reciprocal forms, fractional powers to radicals if needed.", "gpt": "Answers: 1) y^{3/2}/(x^{1/2}), 2) x^{-2/3} = 1/(x^{2/3})." },
          { "type": "task", "title": "Final Challenge", "instructions": "Simplify:\n1) 2^(-4/3) * 2^(7/3)\n2) (3^(5/2))^(-1)\nGive your answer with no negative exponents, in simplest radical or integer form.", "hint": "Combine exponents (add/multiply). Negative flips the fraction.", "gpt": "Answers: 1) 2^{(-4/3 + 7/3)} = 2^1 = 2, 2) 3^{-5/2} = 1 / (3^{5/2})." }
        ],
        "latex": "\\begin{aligned}\\n  &\\text{1) Remove negative exponents:}\\quad x^{-1/2}y^{3/2},\\quad \\frac{1}{x^{2/3}}.\\\\\\n  &\\\\\\n  &\\text{2) Simplify:}\\quad 2^{-4/3}\\cdot 2^{7/3},\\quad \\bigl(3^{5/2}\\bigr)^{-1}.\\\\\\n\\end{aligned}"
      }
    ],
    "collection": "edx-maths-1"
  };

  // On mount, set lesson and userProgress from the static lesson data
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLesson(staticLessonData);
      setUserProgress(createUserProgress(staticLessonData, user.id));
    }
  }, [isLoaded, isSignedIn, user]);

  // When the part changes, reinitialize task and feedback states
  useEffect(() => {
    if (!lesson || !userProgress) return;
    const part = lesson.parts[currentPartIndex];
    const userProgressPart = userProgress.parts[currentPartIndex];
    const tasksInPart = part.blocks.filter(b => b.type === 'task');
    setTasksCount(userProgressPart.tasks.length);

    const newTaskState = tasksInPart.map((task, idx) => ({
      status: idx === 0 ? 'unlocked' : 'locked',
      task,
    }));
    setTaskState(newTaskState);

    const newUserTaskState = userProgressPart.tasks.map((task, idx) => {
      if (idx === 0 && task.status === 'locked') {
        return { ...task, status: 'unlocked' };
      }
      return task;
    });
    setUserTaskState(newUserTaskState);
    setFeedbackMessage([]);
    const userFeedback = userProgressPart.tasks.map(task => task.feedback);
    setUserFeedbackMessage(userFeedback);
  }, [lesson, userProgress, currentPartIndex]);

  // Fake submit function: always returns true and sets feedback to "testing- well done"
  async function handleSubmitTask(taskIndex, latexInput, userLatex) {
    setUserLatexStore(userLatex);
    setUserTaskIndex(taskIndex);
    
    // For testing, we hardcode the result:
    const feedback = 'testing- well done';
    const correct = true;
    
    setTaskState(oldState => {
      const newState = [...oldState];
      newState[taskIndex] = { ...newState[taskIndex], status: correct ? 'correct' : 'incorrect' };
      // Unlock the next task if it exists
      if (correct && newState[taskIndex + 1] && newState[taskIndex + 1].status === 'locked') {
        newState[taskIndex + 1].status = 'unlocked';
      }
      return newState;
    });

    setUserTaskState(oldState => {
      const newState = [...oldState];
      newState[taskIndex] = { ...newState[taskIndex], status: correct ? 'correct' : 'incorrect' };
      if (correct && newState[taskIndex + 1] && newState[taskIndex + 1].status === 'locked') {
        newState[taskIndex + 1] = { ...newState[taskIndex + 1], status: 'unlocked' };
      }
      return newState;
    });

    setFeedbackMessage(prev => {
      const updated = [...prev];
      updated[taskIndex] = feedback;
      return updated;
    });

    setUserFeedbackMessage(prev => {
      const updated = [...prev];
      updated[taskIndex] = feedback;
      return updated;
    });

    return true;
  }

  if (!lesson || !userProgress) {
    return <div>Loading lesson...</div>;
  }

  const currentPart = lesson.parts[currentPartIndex];

  // Instructions Pane
  const instructionsPane = (
    <Instructions
      part={currentPart}
      currentPartIndex={currentPartIndex}
      totalParts={lesson.parts.length}
      onBack={() => {
        if (currentPartIndex > 0) setCurrentPartIndex(i => i - 1);
      }}
      onNext={() => {
        const allTasksCorrect = userTaskState.every(t => t.status === 'correct');
        if (!allTasksCorrect) {
          setAlertMessage('You must complete all tasks before moving on!');
          return;
        }
        if (currentPartIndex < lesson.parts.length - 1) {
          setCurrentPartIndex(i => i + 1);
        } else {
          setAlertMessage('You have reached the end of the lesson!');
        }
      }}
      taskState={userTaskState}
    />
  );

  // Main Lesson Display Pane
  const mainPane = (
    <LessonDisplay
      part={currentPart}
      onSubmitTask={handleSubmitTask}
      taskState={userTaskState}
    />
  );

  // Feedback Pane
  const feedbackPane = (
    <Feedback
      part={currentPart}
      extraFeedback={userFeedbackMessage}
      tasksCount={tasksCount}
    />
  );

  return (
    <>
      {alertMessage && (
        <Alert color="warning">
          {alertMessage}
        </Alert>
      )}
      <ThreePaneResponsive
        instructions={instructionsPane}
        mainContent={mainPane}
        feedbackData={{ feedback: feedbackPane }}
      />
    </>
  );
}
