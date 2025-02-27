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
    "_id": { "$oid": "999999999999999999999999" },
    "slug": "rationalising-the-denominator",
    "title": "Rationalising the Denominator",
    "next": "what-are-quadratic-equations",
    "parts": [
      {
        "id": { "$numberInt": "1" },
        "title": "Rationalising denominators - how do we do it?",
        "blocks": [
          {
            "type": "paragraph",
            "content": "To rationalise something in mathematics it means to transform it from being 'irrational' to 'rational'."
          },
          {
            "type":"paragraph", 
            "content":"Now when working with fractions we will see that the denominator will sometimes contain a surd (making the denominator irrational), it will often be beneficial to rewrite it so that the denominator is a rational number."

          },
          {
            "type":"paragraph", 
            "content":"This process is known as rationalising the denominator!"
          }
          ,
          {
            "type": "paragraph",
            "content": "To rationalise the  denominator of a fraction we use the following rules: "
          },
          {
            "type":"heading",
            "level":"4", 
            "content":"Rules to rationalise denominators of fractions"

          },
          {
            "type":"bullet-points", 
            "points":["For fractions in the form $\\frac{a}{\\sqrt{b}}$, multiple the entire fraction by $\\frac{\\sqrt{a}}{\\sqrt{a}}$","For fractions in the form $\\frac{a}{b + \\sqrt{c}}$, multipy the entire fraction by $\\frac{a - \\sqrt{c}}{a - \\sqrt{c}}$","Lastly, for fractions of the form $\\frac{a}{b - \\sqrt{c}}$, multiply the entire fraction by $\\frac{a + \\sqrt{b}}{a + \\sqrt{b}}$"]

          }, 
          {
            "type":"paragraph", 
            "content":"Now you need to make sure that you understand that were not actually changing the value of the fraction when me multiply it by $\\frac{\\sqrt{a}}{\\sqrt{a}}, \\frac{a - \\sqrt{c}}{a - \\sqrt{c}}$, ... etc. This is because whenever the numerator and denominator of a fraction is the same the overall fraction is equal to 1", 
            
          }, 
          {
            "type":"paragraph", 
            "content":"so $\\frac{\\sqrt{a}}{\\sqrt{a}} = 1$, $\\frac{a - \\sqrt{c}}{a - \\sqrt{c}} = 1$ etc... and as we are all know - multiplying anything by 1 doesn't change it's value"
          },
          {
            "type":"paragraph", 
            "content":"So now that we understand that rationalising the denominator of fraction doesn't change the fractions value it simply changes the fractions appearance (or form), let us go and practice rationalising some denominators!"
          }

         
        ],
      },
      {
        "id": { "$numberInt": "2" },
        "title": "Rationalising denominators with a single term",
        "blocks": [
          {
            "type": "paragraph",
            "content": "In this simple case the fractions denominator consists of only a single surd, for an example the fraction could be: $\\frac{5}{\\sqrt{2}}$"
          },
          {
            "type":"paragraph", 
            "content":"As explained in the previous page all we do is apply the following rule to rationalise the denominator:"
          },
          {
            "type":"heading", 
            "level":"4", 
            "content":"Rationalising denominators with a single surd:"
          },
          {
            "type":"bullet-points", 
            "points":["For fractions in the form $\\frac{a}{\\sqrt{b}}$, multiple the entire fraction by $\\frac{\\sqrt{a}}{\\sqrt{a}}$"]
          }, 
          {
            "type":"paragraph",
            "content":"Heres a couple examples"
          }, 
          {
            "type":"heading", 
            "level":5, 
            "content":"Example 1)"
          }, 
          {
            "type":"paragraph", 
            "content":"Suppose we have the fraction $\\frac{12}{\\sqrt{6}}$, to rationalise this all we do is multiply the fraction by another fraction being $\\frac{\\sqrt{6}}{\\sqrt{6}}$, this gives us the following $$ \\frac{12}{\\sqrt{6}} \\times \\frac{\\sqrt{6}}{\\sqrt{6}} = \\frac{12 \\cdot \\sqrt{6} }{6} = 2 \\sqrt{6}$$ where in the last equality we simply divided 12 by 6 to simplify"
          },
          {
            "type":"heading",
            "level":5, 
            "content":"Example 2)"
          }, 
          {
            "type":"paragraph", 
            "content":"Now suppose we have the fraction $\\frac{4 + x}{\\sqrt{11}}$ How do we rationalise it ?"
          }, 
          {
            "type":"paragraph", 
            "content":"Well we rationalise it in the exact same way as we rationalised example 1) , simply treat 4+x as 'a' and 11 as 'b' (using the notation in our rule above). So we have $$ \\frac{4+x}{\\sqrt{11}} = \\frac{4+x}{\\sqrt{11}} \\times \\frac{\\sqrt{11}}{\\sqrt{11}} = \\frac{ \\bigl( 4+x \\bigr) \\cdot \\sqrt{11}}{11}$$"
          }, 
          {
            "type":"paragraph", 
            "content":"Now thats enough examples, time to run through some questions: "
          }, 
          {
            "type":"task", 
            "title":"1) Let's start with a warm up", 
            "instructions":"In question 1) rationalise the denominator of the fraction and replace the '?' with the correct answer", 
            "hint":"", 
            "gpt":""
          }
          
         
        ],
        "latex": "\\[\n\\begin{aligned}\n\\text{Using the conjugate: }(a + b)(a - b) &= a^2 - b^2. \\\\[6pt]\n(1 + \\sqrt{2})(1 - \\sqrt{2}) &= 1^2 - (\\sqrt{2})^2 = 1 - 2 = -1.\n\\end{aligned}\n\\]"
      },
      {
        "id": { "$numberInt": "3" },
        "title": "Practice Questions",
        "blocks": [
          {
            "type": "paragraph",
            "content": "Now it's time to test your understanding. Remember, do not use a calculator—practice manipulating surds by hand."
          },
          {
            "type": "task",
            "title": "1) Rationalise the denominator",
            "instructions": "Rationalise the denominator of \\(\\frac{4}{\\sqrt{5}}\\). Replace '?' with the correct value in the form '?\\sqrt{5}' or an integer if possible.",
            "hint": "Multiply top and bottom by \\(\\sqrt{5}\\).",
            "gpt": "The correct answer is \\(\\frac{4\\sqrt{5}}{5}\\)."
          },
          {
            "type": "task",
            "title": "2) Rationalise the denominator",
            "instructions": "Rationalise the denominator of \\(\\frac{6}{2 - \\sqrt{3}}\\). Replace '?' with the correct value(s).",
            "hint": "Multiply numerator and denominator by the conjugate \\(2 + \\sqrt{3}\\).",
            "gpt": "The correct answer is \\(\\frac{6(2 + \\sqrt{3})}{(2 - \\sqrt{3})(2 + \\sqrt{3})} = \\frac{12 + 6\\sqrt{3}}{4 - 3} = 12 + 6\\sqrt{3}.\\)"
          },
          {
            "type": "task",
            "title": "3) Rationalise the denominator",
            "instructions": "Rationalise the denominator of \\(\\frac{3 + \\sqrt{2}}{4 - \\sqrt{2}}\\). Replace '?' with the correct simplified form.",
            "hint": "Again, use the conjugate: multiply by \\(4 + \\sqrt{2}\\). Carefully expand the numerator.",
            "gpt": "The correct answer simplifies to \\(\\frac{(3 + \\sqrt{2})(4 + \\sqrt{2})}{(4 - \\sqrt{2})(4 + \\sqrt{2})} = \\frac{12 + 3\\sqrt{2} + 4\\sqrt{2} + 2}{16 - 2} = \\frac{14 + 7\\sqrt{2}}{14} = 1 + \\frac{1}{2}\\sqrt{2}.\\)"
          }, 
          {
            "type": "paragraph",
            "content": "Rationalise \\(\\frac{5}{\\sqrt{2}}\\)."
          },
          {
            "type": "bullet-points",
            "points": [
              "Multiply numerator and denominator by \\(\\sqrt{2}\\).",
              "Result: \\(\\frac{5}{\\sqrt{2}} = \\frac{5 \\cdot \\sqrt{2}}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{5\\sqrt{2}}{2}.\\)"
            ]
          },
          {
            "type": "heading",
            "level": 4,
            "content": "Example 2"
          },
          {
            "type": "paragraph",
            "content": "Rationalise \\(\\frac{3}{1 + \\sqrt{2}}\\)."
          },
          {
            "type": "bullet-points",
            "points": [
              "We use the conjugate \\(1 - \\sqrt{2}\\).",
              "Multiply top and bottom by \\(1 - \\sqrt{2}\\): \\(\\frac{3}{1 + \\sqrt{2}} \\times \\frac{1 - \\sqrt{2}}{1 - \\sqrt{2}}\\).",
              "Denominator becomes \\((1 + \\sqrt{2})(1 - \\sqrt{2}) = 1 - 2 = -1\\).",
              "Hence, \\(\\frac{3(1 - \\sqrt{2})}{-1} = -3(1 - \\sqrt{2}) = -3 + 3\\sqrt{2}.\\)"
            ]
          }
        ],
        "latex": "\\[\n\\text{Practice makes perfect! Try rationalising each denominator carefully.}\n\\]"
      }
    ],
    "collection": "edx-maths-1"
  }
  
  const whatAreQuadratics ={
    "_id": { "$oid": "999999999999999999999999" },
    "slug": "what-are-quadratic-equations",
    "title": "What are Quadratic Equations",
    "next": "quadratic-graphs",
    "parts": [
      {
        "id": { "$numberInt": "1" },
        "title": "So what makes a equation Quadratic?",
        "blocks": [
          {
            "type": "paragraph",
            "content": ""
            /*
            Have some tasks in this section e.g.  typing in 'Yes' or 'No' depending on if the equation is quadratic or not!
             - this means we want to update the MathLessonDisplay compponent depending on if a question part has a textmode property it sets it in textmode.
             */
          }
        ],
        "latex": String.raw` 
        `
      },
      {
        "id": { "$numberInt": "2" },
        "title": "Factorising Quadratics",
        "blocks": [
          {
            "type": "paragraph",
            "content": ""
            /*
              Now Factorising let's simply  have a few exerercises practicing factorising quadratics getting progressively harder 
             */
          },
          
         
        ],
        "latex": String.raw `
        `
      },
    ], 
    "collection":'edx-maths-1'
  }

  const quadraticGraphs = {
      "_id": { "$oid": "999999999999999999999999" },
      "slug": "quadratic-graphs",
      "title": "Quadratic Graphs",
      "next": "solving-quadratics-equations",
      "parts": [
        {
          "id": { "$numberInt": "1" },
          "title": "What's a Quadratic Graph look like?",
          "blocks": [
            {
              "type": "paragraph",
              "content": ""
           
            }
          ],
          "latex": String.raw` 
          `
        },
        {
          "id": { "$numberInt": "2" },
          "title": "Factorising Quadratics",
          "blocks": [
            {
              "type": "paragraph",
              "content": ""
              /*
                Now Factorising let's simply  have a few exerercises practicing factorising quadratics getting progressively harder 
               */
            },
            
           
          ],
          "latex": String.raw `
          `
        },
      ], 
      "collection":'edx-maths-1'
    }

    const solvingQuadratics = {
      "_id": { "$oid": "999999999999999999999999" },
      "slug":"solving-quadratic-equations", 
      "title":"Solving Quadratic Equations", 
      "next":"equations-that-cant-be-factorised", 
      "parts":[
        {
          "id":{"$numberInt":"1"}, 
          "title":"So how do we solve a quadratic equation?", 
          "blocks":[
            {
              "type":"paragraph", 
              "content":"Explain what solving a quadratic equation means and the different types of ways we can solve quadratic equations"
            }
          ], 
          "latex":String.raw`
          \text{Have exmaples of each method being used to solve a quadratic equation}
          `
        }, 

        {
          "id":{"$numberInt":"2"}, 
          "title":"Solving by Factorisation", 
          "blocks":[
            {
              "type":"paragraph", 
              "content":""
            }
          ],
          "latex":String.raw``
        }, 
        {
          "id":{"$numberInt":"3"}, 
          "title":"Solving by Completing the square", 
          "blocks":[
            {
              "type":"paragraph", 
              "content":""
            }
          ], 
          "latex":String.raw``
        }, 

        {
          "id":{"$numberInt":"4"}, 
          "title":"Solving by the Quadratic Formula", 
          "blocks":[
            {
              "type":"paragraph", 
              "content":""
            }
          ], 
          "latex":String.raw``
        }
      ],
      "collection":"edx-maths-1"
    }

    const equationsThatCantBeFactorised ={
     "_id": { "$oid": "999999999999999999999999" },
     "slug":"equations-that-cant-be-factorised", 
     "title":"Equations That Can't Be Factorised", 
     "next":"the-discriminant", 
     "parts":[
      {
        "id": {"$numberInt":"1"}, 
        "title":"Wait...why can't I factorise this?", 
        //make sure to include graph images of some quadratic equations that can't be factorised. 
        "blocks":[
          {
            "type":"paragraph", 
            "content":"Display some images illustrating quadratics above and below the curve"
          }

        ],
        "latex": String.raw`Replace mathLessonDisplay with graphs displaying some curves perhaps`
      }, 
      {
        "type":"paragraph", 
        "content":"mainly just exercises on this page, get them to sketch/attempt to factorise the graph and then determine if it can be factorised or not"
      }
     ], 
     "collection":"edx-maths-1"
    }

    const theDiscriminant = {
      "_id": { "$oid": "999999999999999999999999" },
      "slug":"the-disciminant", 
      "title":"The Discriminant", 
      "next":"modelling-with-quadratics", 
      "parts":[
        {
          "id": {"$numberInt":"1"}, 
          "title":"What's a discriminant and why do we need it?", 
          "blocks":[
            {
              "type":"paragarph", 
              "content":"Explain what the discriminat is and why it's and easier alternative to check if a quadratic can be factorised",
            }
          ]
        },
        {
          "id":{"$numberInt":"2"},
          "title":"Calculating Discriminants", 
          "blocks":[
            {
              "type":"paragraph", 
              "content":"Briefly go into a little more detail on the discriminant - then quite a few tasks to practice calculating the discriminant then answering questions on characteristics of quadratics based on it"
            }, 
            {
              "type": "task",
              "title": "1) Rationalise the denominator",
              "instructions": "Rationalise the denominator of \\(\\frac{4}{\\sqrt{5}}\\). Replace '?' with the correct value in the form '?\\sqrt{5}' or an integer if possible.",
              "hint": "Multiply top and bottom by \\(\\sqrt{5}\\).",
              "gpt": "The correct answer is \\(\\frac{4\\sqrt{5}}{5}\\).",
              "renderType":"sketch"
            },
            {
              "type": "task",
              "title": "1) Rationalise the denominator",
              "instructions": "Rationalise the denominator of \\(\\frac{4}{\\sqrt{5}}\\). Replace '?' with the correct value in the form '?\\sqrt{5}' or an integer if possible.",
              "hint": "Multiply top and bottom by \\(\\sqrt{5}\\).",
              "gpt": "The correct answer is \\(\\frac{4\\sqrt{5}}{5}\\).",
              
            },
          ]
        }
      ], 
      "collection":"edx-maths-1"
    }

    const modellingQuadratics ={
      "_id": { "$oid": "999999999999999999999999" },
      "slug":"modelling-with-quadratics", 
      "title":"Modelling with Quadratics", 
      "next":"introduction-to-simultaneous-equations", 
      "parts":[
        {
          "id":{"$numberInt":"1"}, 
          "title":"Quadratics in real life?",
          "blocks":[
            {
              "type":"paragraph", 
              "content":"Quadratics can be used for lots of different things in the real world etc...", 
            }

          ] 
        }, 
        {
          "id":{"$numberInt":"2"}, 
          "title":"Time to Model", 
          "blocks":[
            {
              "type":"paragraph", 
              "content":"Now that we know the value of quadratic equations it's time to put all the techniques that we've learned so far in this section regarding quadratics to the test"
            }, 
            {
              "type":"paragraph", 
              "content":"By the time you complete all of the tasks in this in this lesson you will be more than comfortable modelling with quadratic equations",
            },
            {
              "type":"paragraph", 
              "content":"Well what are you waiting for - lets get to it!"
            }, 
            //fill it up with tasks 
          ]
        }
      ], 
      "collection":"edx-maths-1"
    }

  // On mount, set lesson and userProgress from the static lesson data
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLesson(theDiscriminant);
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
