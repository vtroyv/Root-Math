'use client';
import { useEffect, useState } from 'react';
import { Button } from 'reactstrap';

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
  const [feedbackMessage, setFeedbackMessage]= useState('')


  // Mock "fetch" of multi-part lesson
  useEffect(() => {
    const lessonData = {
      slug: 'index-laws',
      title: 'The Laws of Indices',
      parts: [
        {
          id: 'part1-intro',
          title: 'Introduction to the Laws of Indices',
          blocks: [
            
            {
              type: 'paragraph',
              content:
                "Indices (also known as exponents or powers) appear in many areas of maths. They're a way to reprsent the repeated multiplication of a number by itself.",
            },
            {
              type:'paragraph', 
              content:
              "For instance if we had the number 3 multiplied by itself 5 times, we could represent this as: $$ 3 \\cdot 3 \\cdot 3 \\cdot 3 \\cdot 3 = 3^{5}$$"

            },
            {
              type: 'paragraph',
              content:
              'There are 4 index laws that you must know and understand, these are:'

            },
            
            {
              type:'bullet-points', 
              points: [
                '$a^{n} \\cdot a^{m} = a^{m+n}$', 
                '$\\frac{a^n}{a^m} = a^{n-m}$', 
                '$(a^m)^n = a^{m \\cdot n}$', 
               '$(ab)^n = a^n \\, b^n$', 
              ]

            }, 
            {
              type:'paragraph',
              content:'We will now take a closer look at each of these rules one by one'
            }
            
          ],
        },
        {
          id: 'part2-product',
          title: 'Law 1: Product of Powers',
          blocks: [
            {
              type: 'paragraph', 
              content: "Let's consider a term with the form $x^{n}$ When we see terms like this we refer to $x$ as the base and $n$ as the indice (or power), now let's take a look at our first indice law!"
            },
            {
              type: 'heading', 
              level: 4,
              content: 'The product of powers:' 
            }
            ,
            {
              type: 'paragraph',
              content:
                'If you multiply two expressions with the same base, you add their exponents: $$ a^m * a^n = a^{m+n}$$',
            },
            {
              type: 'paragraph', 
              content:'So for example if we had $3^3 \\cdot 3^4$, this is the same as $3^7$, as given our bases are the same (i.e. 3 in this case), we can simply add the indices (i.e. $3+4 = 7$ in this case)'
            },
            {
              type:'paragraph',
              content:"Pretty straight forward right? - Now let's get some practice!"
            }
            ,
            {
              type: 'task',
              title: 'Check Your Understanding',
              instructions: 'Replace the  ? in question 1) with the correct answer',
              hint: 'Add the exponents when the bases match!',
            },
            {
              type: 'task',
              title: 'Time to add',
              instructions: "Replace the '?' in question 2) with the correct answer  ",
              hint: 'Just like before add the indicies, all the bases are the same!',
            },
            {
              type:'task', 
              title: "Let's spice things up", 
              instructions: "Replace each of the three '?' in question 3) with the correct indice",
              hint:"Simply add together the powers for terms with the same base"
            },
            {
              type:'task',
              title: "Time for a challenge", 
              instructions: "Replace the each '?' in question 4) with the the correct values",
              hint:'Same stuff as before - add those powers!:)'
            }
            
            ,
          ],
          latex: String.raw`
\begin{aligned}
  &\text{1) This one's nice and easy, simplify: }\\
   &a^m \cdot a^n = ?\\
  &\\
  &\text{2) Now simplify: }\\
  &x^3 \cdot x^4 \cdot x^5 = ?\\
  &\\
  &\text{3) Time to make things a little harder, simplify this: }\\
  & a^3 \cdot a^{4 \cdot 5} \cdot b^5 \cdot b^6 \cdot x^4=a^? \cdot b^? \cdot x^{?} \\
  &\\
  &\text{4)Now if you can answer this you must really understand, simplify: }\\
  & a^4 \cdot x^5 \cdot a^x \cdot x^a = a^{?} \cdot x^{?}\\ 
  &\\
\end{aligned}
`,

        },
        {
          id: 'part3-quotient',
          title: 'Law 2: Quotient of Powers',
          blocks: [
            {
              type: 'paragraph',
              content:"Now we've seen when we multiply two terms together with the same base that we add the powers, so what about when we divide two terms with the same base? ",
            },
            {
              type:'paragraph', 
              content:'Well maybe you guessed it already - we simply subtract the indices'
            },
            {
                type: 'heading', 
                level: 4,
                content: 'The quotient of powers:' 
            },
            {
              type: 'paragraph', 
              content: 'If you divide two terms with the same base, you subtract their exponents $$ \\frac{a^n}{a^m} = a^{n-m}$$'

            },
            {
              type:'paragraph', 
              content:"Pretty, simple right! So if we have $\\frac{7^3}{7^2}$, this would simply be $7^{3-2} = 7^1 = 7$. All we do is apply our rule, the base's are the same and we're dividing, so we just just subtract the power of the denominator from the power of the numerator, and we're good to go! ",

            },

            {
              type:'paragraph', 
              content: "Now let's test our understanding by working through the following problems"

            }
            ,

            {
              type: 'task',
              title: "Have you been paying attention?",
              instructions: 'Simplify y^5 / y^2.',
              hint: 'Subtract exponents when dividing with the same base.',
            },
          ],
          latex: String.raw`
          \begin{aligned}
            &\text{1) Once again we'll start nice and easy, complete the following:}\\
            &\frac{7^4}{7^2} = \,?\\[1ex]
            &\\
            &\text{2) Now let's make things a little harder, complete:}\\
            &\frac{e^{7x}}{3e^3} = \,?\\[1ex]
            &\\
            &\text{3) Is it a trick question? Let's find out, simplify:}\\
            &\frac{x^4}{x^3} = \,?\\
          \end{aligned}
          `
        },
        {
          id: 'part4-power',
          title: 'Law 3: Power of a Power',
          blocks: [
            {
              type: 'paragraph',
              content: '(a^m)^n = a^(m*n). You multiply the exponents.',
            },
            {
              type: 'task',
              title: 'Practice',
              instructions: 'Simplify (x^3)^4.',
              hint: 'Multiply the exponents.',
            },
          ],
        },
        {
          id: 'part5-zero',
          title: 'Law 4: Zero Exponent',
          blocks: [
            {
              type: 'paragraph',
              content: 'Any non-zero base to the 0 power is 1: a^0 = 1.',
            },
            {
              type: 'task',
              title: 'Confirm Understanding',
              instructions: 'Evaluate 7^0 and (-3)^0.',
              hint: 'Any base (except 0) to the zero power is 1.',
            },
          ],
        },
      ],
    };
    setLesson(lessonData);
  }, []);

  // When "part" changes, re-initialize taskState
  useEffect(() => {
    if (!lesson) return;
    const part = lesson.parts[currentPartIndex];
    // We'll look for tasks in part.blocks. 
    // The first task is "unlocked", rest "locked".
    const tasksInPart = part.blocks.filter(b => b.type === 'task');

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
    simulateServerCheck(latexInput).then(res => {
      setFeedbackMessage(res.feedback); // store message
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
