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


  const factorisingQuadratics ={
    "_id": { "$oid": "[GET THIS FROM MONGODB]" },
    "slug": "factorising-quadratics",
    "title": "Factorising Quadratics",
    "next": "completing-the-square",
    "parts": [
        {
            "id": { "$numberInt": "1" },
            "title": "So what's the point in factorising?",
            "blocks": [
                {
                    "type": "paragraph",
                    "content": "A quadratic expression is an expression which has the form $ax^2+bx+c$, it's curve is U shaped and formally known as a parabola, as shown below: "
                },
                {
                    "type": "image",
                    "url": "/images/example-to-factorise.png",
                    "alt": "Quadratic Graph",
                    "caption": "The curve of a quadratic expression"
                },
                {
                    "type": "paragraph",
                    "content": "Now solving a quadratic means: finding the values of x for which $ax^2+bx+c = 0$, these are the exact points where the curve crosses the x-axis!"
                },
                {
                    "type": "paragraph",
                    "content": "Now the curve in the image above is $$-x^2+3x+4$$ To solve this equation we first set it equal to 0 so we get $-x^2+3x+4=0$ But then what?"
                },
                {
                    "type": "paragraph",
                    "content": "Well one thing we can do, which you will learn the tricks of in the next part of this lesson is factorise it, which simply means to write our quadratic as a product of simpler terms "
                },
                {
                    "type": "paragraph",
                    "content": "When we factorise $-x^2+3x+4$ we get $$-x^2+3x+4 = \\bigl(4-x \\bigr) \\bigl(x+1 \\bigr) $$ So setting this equal to 0 we now get: $$\\bigl(4-x \\bigr) \\bigl(x+1 \\bigr)=0$$"
                },
                {
                    "type": "paragraph",
                    "content": "However if  $\\bigl(4-x \\bigr)\\bigl(x+1 \\bigr)=0$ this implies that either: $$ \\bigl( 4-x \\bigr) =0 \\text{ or } \\bigl( x+1\\bigr) = 0$$"
                },
                {
                    "type": "paragraph",
                    "content": "So now that we've factorised, it's clear to see that $\\bigl(4-x \\bigr) =0$ implies $x=4$ and  $\\bigl( x+1\\bigr) = 0$ implies that $x=-1$ These points correspond to exactly where our curve crosses the x-axis: At $(-1,0)$ and $(4,0)$, and just like that we've found our roots and solved the quadratic equation!"
                },
                {
                    "type": "paragraph", 
                    "content": "So now that you understand why it's benefinical to factorise quadratic equations in order to solve them, next we'll take a look at some tips and tricks to enable you to sucessfully factorise quadratic equations"
                },
                {
                    "type":"paragrpah", 
                    "content":"However, first let's answer a few questions to make sure you've fully understood the example that we just worked through"
                },
                /*

                Now the type of questions i should have for this are simply a bunch of sketches and asking which one is the correct factorisation

                */
                // {
                //     "type": "task",
                //     "title": "1) Identify the quadratic Curve?",
                //     "instructions": "Select the correct image from the list below.",
                //     "hint": "One of them is correct.",
                //     "gpt": "test",
                //     "renderType": "multipleChoiceImages",
                //     "imageChoices": [
                //         {
                //             "url": "/images/quartic-case.png",
                //             "alt": "Test Image 1",
                //             "width": { "$numberInt": "300" },
                //             "height": { "$numberInt": "200" },
                //             "isCorrect": false,
                //             "explanation": "This image shows a quartic curve, not a quadratic curve."
                //         },
                //         {
                //             "url": "/images/cubic-case.png",
                //             "alt": "Test Image 2",
                //             "width": { "$numberInt": "300" },
                //             "height": { "$numberInt": "200" },
                //             "isCorrect": false,
                //             "explanation": "This image shows a cubic function, not a quadratic curve."
                //         },
                //         {
                //             "url": "/images/quadratic-case.png",
                //             "alt": "Test Image 2",
                //             "width": { "$numberInt": "300" },
                //             "height": { "$numberInt": "200" },
                //             "isCorrect": true,
                //             "explanation": "Well done. This is the correct choice because it shows a quadratic graph."
                //         },
                //         {
                //             "url": "/images/reciprocal-case.png",
                //             "alt": "Test Image 2",
                //             "width": { "$numberInt": "300" },
                //             "height": { "$numberInt": "200" },
                //             "isCorrect": false,
                //             "explanation": "This image shows a reciprocal function, not a quadratic curve."
                //         }
                //     ]
              
                // }
            ]
        },
        {
            "id": { "$numberInt": "2" },
            "title": "Factorising Tricks - When a=1",
            "blocks": [
                {
                    "type": "paragraph",
                    "content": "Now quadratic curves take two shapes depending on the expression: they can either be a 'U' shape or an upside down 'U' shape. The specific shape depends on the value of the coefficient of the $x^2$ term."
                },
                {
                    "type": "paragraph",
                    "content": "Recalling that a quadratic expression has the form $ax^2+bx+c$, when the value of a is positive our quadratic curve will have the shape: $$a>0$$"
                },
                {
                    "type": "image",
                    "url": "/images/positive-quadratic.png",
                    "alt": "Quadratic Graph",
                    "caption": "The curve of a positive quadratic expression"
                },
                {
                    "type": "paragraph",
                    "content": "And when the value of a is negative, our quadratic curve will have the shape: $$a<0$$"
                },
                {
                    "type": "image",
                    "url": "/images/negative-quadratic.png",
                    "alt": "Quadratic Graph",
                    "caption": "The curve of a negative quadratic expression"
                },
                {
                    "type": "paragraph",
                    "content": "Not too hard at all! Now complete the two tasks below before moving on."
                },
                {
                    "type": "task",
                    "title": "1) What's the shape I",
                    "instructions": "Sketch a quadratic where the coefficient of the quadratic term is positive",
                    "hint": "Any quadratic will do as long as it's positive.",
                    "gpt": "test",
                    "renderType": "sketch",
                    "marking": {
                        "tool": "limit",
                        "guide": {
                            "limit-values": [
                                {
                                    "x": { "$numberInt": "100" },
                                    "y": { "$numberInt": "2000" },
                                    "threshold": { "$numberInt": "1000" }
                                },
                                {
                                    "x": { "$numberInt": "-100" },
                                    "y": { "$numberInt": "2000" },
                                    "threshold": { "$numberInt": "1000" }
                                }
                            ]
                        }
                    },
                    "degree": { "$numberInt": "2" }
                },
                {
                    "type": "task",
                    "title": "2) What's the shape II",
                    "instructions": "Sketch a quadratic where the coefficient of the quadratic term is negative",
                    "hint": "Any quadratic will do as long as it's negative.",
                    "gpt": "test",
                    "renderType": "sketch",
                    "degree": { "$numberInt": "2" },
                    "marking": {
                        "guide": {
                            "limit-values": [
                                {
                                    "x": { "$numberInt": "100" },
                                    "y": { "$numberInt": "-2000" },
                                    "threshold": { "$numberInt": "1000" }
                                },
                                {
                                    "x": { "$numberInt": "-100" },
                                    "y": { "$numberInt": "-2000" },
                                    "threshold": { "$numberInt": "1000" }
                                }
                            ]
                        },
                        "tool": "limit"
                    }
                },
                {
                    "type": "task",
                    "title": "3) Sketch $y=ax^2+bx-4$ with $a>0$",
                    "instructions": "Sketch a quadratic where the coefficient of the quadratic term is positive",
                    "hint": "Any quadratic will do as long as it's positive.",
                    "gpt": "test",
                    "renderType": "sketch",
                    "degree": { "$numberInt": "2" },
                    "marking": {
                        "tool": ["limit", "graph"],
                        "guide": {
                            "limit-values": [
                                {
                                    "x": { "$numberInt": "100" },
                                    "y": { "$numberInt": "2000" },
                                    "threshold": { "$numberInt": "1000" }
                                },
                                {
                                    "x": { "$numberInt": "-100" },
                                    "y": { "$numberInt": "2000" },
                                    "threshold": { "$numberInt": "1000" }
                                }
                            ],
                            "graph-values": [
                                {
                                    "x": { "$numberInt": "0" },
                                    "y": { "$numberInt": "-4" },
                                    "threshold": { "$numberDouble": "0.25" }
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "task",
                    "title": "4) Is it possible for a quadratic expression $$ax^2+bx+c$$ where $a>0$ to have two positive roots?",
                    "instructions": "Select the correct answer from the list below.",
                    "hint": "One of them is correct.",
                    "gpt": "test",
                    "renderType": "multipleChoice",
                    "question": "2) Which of the following is a quadratic function?",
                    "choices": [
                        {
                            "text": "Yes",
                            "isCorrect": true,
                            "explanation": "Correct. A quadratic expression with a > 0 can have two positive roots under the right conditions."
                        },
                        {
                            "text": "No",
                            "isCorrect": false,
                            "explanation": "Incorrect. It is possible for a quadratic with a > 0 to have two positive roots."
                        }
                    ]
                },
                {
                    "type": "task",
                    "title": "5) Is it possible for a quadratic expression $$ax^2+bx+c$$ where now both $a>0$ and $c<0$ to have two positive roots?",
                    "instructions": "Select the correct answer from the list below.",
                    "hint": "One of them is correct.",
                    "gpt": "test",
                    "renderType": "multipleChoice",
                    "choices": [
                        {
                            "text": "Yes",
                            "isCorrect": false,
                            "explanation": "Incorrect. With c < 0, the product of the roots is negative, so both roots cannot be positive."
                        },
                        {
                            "text": "No",
                            "isCorrect": true,
                            "explanation": "Correct. A quadratic with a > 0 and c < 0 cannot have two positive roots."
                        }
                    ]
                }
            ]
        },
       
    ],
    "collection": "edx-maths-1"
}
  

const differentiatingPolynomials = {
  _id: "650000000000000000000002",
  slug: "differentiating-polynomials",
  title: "Differentiating Polynomials",
  next: "power-rule",
  parts: [
    {
      id: 1,
      title: "Why We Need Shortcut Rules",
      blocks: [
        {
          type: "paragraph",
          content: "We’ve already seen how to find a derivative from first principles by using\n\n" +
                   "$$f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}.$$  While this definition is fundamental, " +
                   "in practice every new function requires a lot of algebraic expansion, collection of like terms, " +
                   "division by h and then taking a limit.  Even for a simple cubic it can be quite lengthy!"
        },
        {
          type: "paragraph",
          content: "Imagine having to re-derive the derivative of every polynomial you encounter in an exam by starting " +
                   "from the limit definition.  You’d spend precious time expanding powers, cancelling terms and simplifying, " +
                   "rather than focusing on the conceptual steps or the application to a real-world context."
        },
        {
          type: "paragraph",
          content: "Instead, mathematicians have identified basic rules (such as the power rule, sum rule and constant multiple rule) " +
                   "that you can memorise and apply in a few quick steps.  These shortcut formulae save time and reduce algebraic work—" +
                   "yet they themselves can be proved from first principles if you ever need to."
        },
        {
          type: "paragraph",
          content: "Before we learn those formulas, try the following task to appreciate just how long a first-principles calculation can be."
        },
        {
          type: "task",
          title: "Lengthy First-Principles Differentiation",
          instructions: "Differentiate the function\n\n" +
                        "$$y = x^3 + 3x^2 - 5x + 2$$\n\n" +
                        "using the limit definition (first principles). Show every step of your expansion, cancellation and limit-taking.",
          hint: "You will need to expand (x+h)^3 and (x+h)^2, collect like terms, divide by h and then let h→0.",
          gpt: "test",
        }
      ]
    }, 
   {
  id: 2,
  title: "The Power Rule for \(x^n\)",
  blocks: [
    {
      type: "paragraph",
      content: "Rather than re-deriving every derivative from first principles, we can use a memorised shortcut called the **power rule**.\n\nFor any real exponent \\(n\\):\n\n$$\\frac{d}{dx}\\bigl(x^n\\bigr) = n\\,x^{n-1}.$$"
    },
    {
      type: "paragraph",
      content: "If your function has a constant multiplier, say \\(y = a\\,x^n\\), you simply pull out the constant:\n\n$$\\frac{d}{dx}\\bigl(a\\,x^n\\bigr) = a\\frac{d}{dx}(x^n) = a\\,n\\,x^{n-1}.$$"
    },
    {
      type: "paragraph",
      content: "This means you need only focus on the power of \\(x\\); coefficients stay in place."
    },
    {
      type: "paragraph",
      content: "**Where does it come from?**\n\nWe can still prove it quickly from first principles using the binomial expansion:\n\n1.  \\((x+h)^n = \\displaystyle\\sum_{k=0}^n \\binom n k x^{n-k}h^k = x^n + n x^{n-1}h + \\cdots + h^n.\\)\n2.  Form the difference quotient:\n    \\[\n      \\frac{(x+h)^n - x^n}{h}\n      = \\frac{n x^{n-1}h + \\text{terms containing }h^2}{h}\n      = n x^{n-1} + O(h).\n    \\]\n3.  Let \\(h\\to0\\): all terms containing \\(h\\) vanish, leaving\n    \\[\n      \\lim_{h\\to0} \\frac{(x+h)^n - x^n}{h} = n x^{n-1}.\n    \\]\n\nThus the power rule holds for any integer \\(n\\)."
    },
    {
      type: "paragraph",
      content: "Now that you understand **why** it works and **how** to apply it, let’s build fluency with some practice."
    },
    {
      type: "task",
      title: "Applying the Power Rule",
      instructions: "Differentiate each of the following using the power rule (no first-principles work needed):\n\n1.  \\(y = 5x^4\\)\n2.  \\(y = -3x^7\\)\n3.  \\(y = 2x^5 + x^2\\)\n4.  \\(y = \\tfrac12 x^{-3}\\)\n5.  \\(y = 7x^3 - 4x + 9\\)\n\nShow your results in simplest form.",
      hint: "Remember: bring down the exponent, subtract one from the exponent, keep coefficients attached.",
      gpt: "test",

    }
  ]
},

  {
  id: 3,
  title: "The Sum Rule & Quadratic Derivatives",
  blocks: [
    {
      type: "paragraph",
      content: "When a function has more than one term, you can differentiate each term **one-at-a-time** and then add the results.  This is called the **sum rule**:\n\n" +
               "$$\\frac{d}{dx}\\bigl[f(x)+g(x)\\bigr]=f'(x)+g'(x).$$"
    },
    {
      type: "paragraph",
      content: "For a quadratic\n\n" +
               "$$y=ax^2+bx+c$$\n\n" +
               "we apply the power rule to each term and the constant rule to \\(c\\):\n\n" +
               "- \\(d(ax^2)/dx = 2ax\\)\n" +
               "- \\(d(bx)/dx = b\\)\n" +
               "- \\(d(c)/dx = 0\\)\n\n" +
               "So altogether:"
    },
    {
      type: "paragraph",
      content: "$$\\frac{dy}{dx}=2ax+b.$$"
    },
    {
      type: "paragraph",
      content: "Notice that the derivative of a quadratic is a **straight line** of gradient \\(2a\\) and intercept \\(b\\).  Furthermore, the point where this line crosses the \\(x\\)-axis,\n\n" +
               "$$2ax+b=0\\quad\\Longrightarrow\\quad x=-\\frac b{2a},$$\n\n" +
               "matches the turning point of the original parabola."
    },
    {
      type: "heading",
      level: 4,
      content: "Worked Example"
    },
    {
      type: "paragraph",
      content: "Differentiate\n\n" +
               "$$y = 3x^2 + 2x - 7$$\n\n" +
               "term-by-term."
    },
    {
      type: "paragraph",
      content: "Applying the sum and power rules:\n\n" +
               "- \\(d(3x^2)/dx=6x\\)\n" +
               "- \\(d(2x)/dx=2\\)\n" +
               "- \\(d(-7)/dx=0\\)\n\n" +
               "Hence\n\n" +
               "$$y'=6x+2.$$"
    },
    {
      type: "paragraph",
      content: "To find the parabola’s turning point, set \\(y'=0\\):\n\n" +
               "$$6x+2=0\\quad\\Longrightarrow\\quad x=-\\tfrac13.$$"
    },
    {
      type: "paragraph",
      content: "So the parabola is decreasing for \\(x<-\\tfrac13\\) and increasing for \\(x>-\\tfrac13\\), with a minimum at \\(x=-\\tfrac13\\)."
    },
    {
      type: "task",
      title: "Practice: Quadratic & Its Derivative",
      instructions: "a) Differentiate \\(y=4x^2-6x+5\\) to find \\(y'\\).\n" +
                    "b) Sketch on the same axes the parabola \\(y=4x^2-6x+5\\) and its derivative line \\(y'=8x-6\\).\n" +
                    "c) Mark where the derivative crosses the \\(x\\)-axis and explain its connection to the parabola’s turning point.",
      hint: "Use the power rule on each term, then set \\(y'=0\\) to locate the turning point.",
      gpt: "test",

    }
  ]
}, 
{
  id: 4,
  title: "Combining Rules & Fluency Practice",
  blocks: [
    {
      type: "paragraph",
      content: "So far we’ve seen:\n\n" +
               "- How to derive from first principles (for small powers),\n" +
               "- The power rule \\(d(x^n)/dx = n x^{n-1}\\),\n" +
               "- The sum rule \\(d[f(x)+g(x)]/dx = f'(x) + g'(x)\\),\n" +
               "- Constants drop out and constant multiples come along for the ride.\n\n" +
               "Now we put these together in a series of varied polynomial differentiation questions."
    },
    {
      type: "task",
      title: "Practice Problems",
      instructions: "Use the power rule, sum/difference rule, and constant rule to differentiate each of the following. No first-principles work needed—just apply the shortcuts:\n\n" +
                    "1.  \\(y = 7x^5 - 2x^3 + x\\)\n" +
                    "2.  \\(y = -4x^4 + 6x^2 - 3\\)\n" +
                    "3.  \\(y = 5x^3 + x^{-2}\\)\n" +
                    "4.  \\(y = 2x^6 - x + 4\\)\n" +
                    "5.  \\(y = 3x^2 + 7x - 8 + 2x^4\\)\n" +
                    "6.  \\(y = x^3 - 5x^{-1} + 9\\)\n\nShow each derivative in simplest form, and label it \\(y'\\) or \\(dy/dx\\).",
      hint: "Treat each term separately; bring exponents down, subtract 1, constants vanish.",
      gpt: "test"
    }
  ]
}



  ]
};

const LinesandDerivatives = {
  _id: "650000000000000000000002",
  slug: "lines-and-derivatives",
  title: "Lines and Derivatives",
  next: "power-rule",
  parts: [
    {
  id: 1,
  title: "Tangents",
  blocks: [
    {
      type: "paragraph",
      content: "Remember that the derivative of a function at a point gives the gradient of the tangent line to its graph.  In other words, if \\(y=f(x)\\), then\n\n" +
               "$$f'(a)=\\text{gradient of the tangent to }y=f(x)\\text{ at }(a,\,f(a)).$$"
    },
    {
      type: "image",
      url: "/images/tangent-gradient-placeholder.png",
      alt: "Placeholder: curve y = f(x) with a tangent drawn at (a, f(a)), illustrating gradient f'(a)"
    },
    {
      type: "paragraph",
      content: "Once you know the gradient \\(m=f'(a)\\) at the single point \\((a,f(a))\\), you no longer need two points to write the tangent’s equation.  You simply use the point–gradient form of a line:"
    },
    {
      type: "paragraph",
      content: "$$y - f(a) = f'(a)\,\bigl(x - a\bigr).$$\n\n" +
               "This is exactly the same as the familiar form\n\n" +
               "$$y - y_1 = m\,(x - x_1)$$\n\n" +
               "you learned when studying straight lines, but here \\((x_1,y_1)=(a,f(a))\\) and \\(m=f'(a)\\)."
    },
    {
      type: "image",
      url: "/images/point-gradient-formula-placeholder.png",
      alt: "Placeholder: annotated diagram showing y - y1 = m(x - x1) reused for tangent at (a, f(a))"
    },
    {
      type: "paragraph",
      content: "In practice this means:\n\n" +
               "1.  Compute \\(f'(x)\\) via your differentiation rules.\n" +
               "2.  Evaluate \\(f'(a)\\) to get the gradient at \\(x=a\\), because as stated before the gradient of the tangent to the curve at $x=a$ is the same as the gradient of the curve at $x=a$\n" +
               "3.  Substitute into \\(y - f(a) = f'(a)(x - a)\\) to get the final tangent line equation."
    }
  ]
}


,{
  id: 2,
  title: "Normals to Curves",
  blocks: [
    {
      type: "paragraph",
      content: "At any point on a curve, in addition to the tangent we can draw a **normal**—the line perpendicular to the tangent at that point."
    },
    {
      type: "image",
      url: "/images/normal-and-tangent-placeholder.png",
      alt: "Placeholder: curve y=f(x) with both tangent and normal drawn at (a,f(a))"
    },
    {
      type: "paragraph",
      content: "If the tangent at \\((a,f(a))\\) has gradient \\(m=f'(a)\\), then the normal’s gradient is the negative reciprocal:\n\n" +
               "$$m_{\text{normal}} = -\\frac{1}{m} = -\\frac{1}{f'(a)}.$$"
    },
    {
      type: "paragraph",
      content: "Thus the equation of the normal in point–gradient form is\n\n" +
               "$$y - f(a) = -\\frac{1}{f'(a)}\\,(x - a).$$"
    },
    {
      type: "image",
      url: "/images/normal-equation-placeholder.png",
      alt: "Placeholder: annotation of the normal line equation at (a,f(a))"
    },
    {
      type: "paragraph",
      content: "In summary:\n\n" +
               "1.  Find the tangent gradient \\(m=f'(a)\\).\n" +
               "2.  Compute the normal gradient \\(-1/m\\).\n" +
               "3.  Substitute into the point–gradient form to get the normal’s equation."
    }
  ]
}

  ]
}

const increasingandDecreasingFunctoins = {
  _id: "650000000000000000000002",
  slug: "increasing-and-decreasing-functions",
  title: "Increasing and Decreasing Functions ",
  next: "power-rule",
  parts: [
    {
  id: 1,
  title: "Where Gradients Tell the Story",
  blocks: [
    {
      type: "paragraph",
      content: "Recall that the **gradient** of a curve at a point—given by the derivative $f'(x)$—is the instantaneous rate of change, in other words how y is changing per small change in x at that point, however as we've now come to experience the gradient of any typical function is constantly changing as you progress along it, for example:"
    },
    {
      type: "image",
      url: "/images/inc-dec-intervals-placeholder.png",
      alt: "Placeholder: a single curve showing green segments where it increases and red segments where it decreases"
    },
    {
      type: "paragraph",
      content: "As you travel along the graph, you’ll see it switch from rising to falling or vice versa at **turning points**, where the gradient is zero. "
    },
    {
      type: "image",
      url: "/images/turning-point-gradient-placeholder.png",
      alt: "Placeholder: zoomed-in view of a turning point where the tangent is horizontal (gradient = 0)"
    },
    {
      type: "paragraph",
      content: "To say a function is **increasing** on an interval means \\(f(x+h)>f(x)\\) for small positive \\(h\\).  **Decreasing** means \\(f(x+h)<f(x)\\)"
    }, 
    {
      type:"paragraph", 
      content:"Now what if we wanted to determine if a function is fully increasing or decreasing over an interval? - clearly checking if every value of the function is greater than or less than the previous value of the interval would be impractical, and as you already know we DEFINITELY won't always have a convenient sketch of the function to simply look at."
    }, 
    {
      type:'paragraph', 
      content:"Well in the remainder of this lesson, we will look at techniques that rely on analysing the gradident to determine whether or not a function is increasing or decrasing over a interval"
    }
  ]
}

,{
  id: 2,
  title: "Increasing Functions",
  blocks: [
    {
      type: "paragraph",
      content: "We say that a function \\(f(x)\\) is increasing on the interval $[a,b]$ if for every $x$ with $(a < x < b) f'(x) > 0$"    
    },
    {
      type:"paragraph", 
      content:"But what does this mean? - Well one way to intuitively think about this is the gradient can be thought of as the slope of the curve, and a postivie slope at a point on a curve can be thought of as 'if i go a little to the right $f$ gives me a larger value, do that repeatedly from 'a' all the way to 'b' e.g over $[a,b]$ and string togheter all these little 'uphill' moves from a to b and you have a function that increases over the interval [a,b]  "
    },
    {
      type: "image",
      url: "/images/increasing-intervals-placeholder.png",
      alt: "Placeholder: a single cubic-like curve with the interval [a,b] highlighted in green where it rises and another interval in red where it falls"
    },
    {
      type: "paragraph",
      content: "In the green section above, the tangent slopes are positive, so the curve rises as \\(x\\) increases.  In the red section, slopes are negative and the curve falls."
    },
    {
      type: "paragraph",
      content: "Additionally, we can also answer the question of 'Why does  $f'(x)>0$ imply increase?' more mathematically by reconsidering the definition of our gradient function:  For any small positive increment \\(h\\),\n\n" +
               "$$f(x+h) - f(x) \\approx f'(x)\,h > 0,$$\n\n" +
               "so \\(f(x+h)>f(x)\\).  That is exactly the definition of an increasing function."
    },
    {
      type:'paragraph', 
      content: "For any small positive increment $h > 0 $: $$\\frac{f(x+h) - f(x)}{h} \\approx f'(x)$$ Therefore now consider the case where $f'(x) > 0$ and rearrang our expression so we have $$f(x+h) - f(x) \\approx f'(x) \\cdot h$$ Now given $h>0$ and $f'(x) >0 $ there product will also be greater than 0 $$ \\implies f(x+h) -f(x) >0$$ for small $h>0$ which is exactly the definitiion of an increasing function "
    },
    {
      type:'heading', 
      level:"4", 
      content:'Show that $f(x) = x^2$ is increasing on $(0, \\infty)$'
    },
    {
      type: "bullet-points",
      points: [
               "1.  First start by computing the gradient function e.g.  $f'(x)=2x$" ,
               "2.  Next consider the interval $(0, \\infty)$ which is equivalent to $x>0$, now is our gradient positive over this interval?, Well we know if $x>0$, then $2x>0$, so $f'(x)>0$ on $(0,\\infty)$ ",
               "3.  Conclusion: Therefore given $f'(x) >0 $ over the interval $(0, \\infty)$ we can conclude that $f(x)$ is increasing for all $x>0$"]
    }
  ]
},
{
  id: 3,
  title: "Decreasing Functions ",
  blocks: [
    {
      type:"paragraph", 
      content:"Now the case for decreasing functions is very much based on the same principles that we covered in detail for the case of increasing fucntions, therefore we don't need to cover the same ideas again. The rule for detemrining whether a function is decreasing via it's gradient is given by: "
    },
    // include a question which says prove that a negative gradient means a function is decreasing and this will force the student to recall the mathematical proof that we showed in the case of positive gradients but for the negative case
     {
      type: "paragraph",
      content: "A function \\(f(x)\\) is decreasing on the interval $[a,b]$ if for every $x$ with $(a < x < b) f'(x) < 0$"    
    },
    
    {
      type:'image', 
      url:"",
      alt:"Have an image with a curve with a interval highlighted which states illustrates that it's decreasing over this interval"
    },
    {
      type:"paragraph", 
      content:"For instance in the image above, we can clearly see over the interval $[a,b]$ the function is clearly decreasing - so this implies that over this entire interval the gradient of the function is negative"
    }, 
    {
      type:'paragraph', 
      content:"Now let's reinforce this with a quick example: "
    },
    {
      type:"heading", 
      level:"4", 
      content:"Show that the function $f(x) = -x$ is deceasing on $\\mathbb{R}$"
    }, 
    {
      type:'bullet-points', 
      points:[
        "1. Now the first step is to understand what our interval is, in this question were simply told to consider $\\mathbb{R}$ i.e the set of real numbers, so we can write this as $\\mathbb{R} = (-\\infty, \\infty)$", 
        "2. Next we determine the gradient function and show it's negative over our interval. Now $f(x) = -x \\implies f'(x) = -1$ clearly $f'(x) = -1 < 0$ for all $x$ in fact it's negativity doesn't even depend on $x$ it's constantly negative!",
        "3. Conclusion: Therefore given $f'(x) < 0 $ for all $x$ in $\\mathbb{R}$ we can conclude that $f(x)$ is decreasing over $\\mathbb{R}$"
      ]
    }
  ]
}


  ]
}

const stationairypointsAndTheirNature = {
  _id: "650000000000000000000002",
  slug: "Stationairy-points",
  title: "Stationairy Points",
  next: "sketching-the-gradient-function",
  parts: [
    {
    id: 1, 
    title:"The Second Derivative",
    blocks:[
      {
        type:"paragraph", 
        content:"Now before we dive into what a stationary point, and it's importance as well as variations we first need to explore the second derivative"
      }, 
      {
        type:"paragraph",
        content:"The second derivative of a function $f(x)$ is simply the derivative of it's first deriative. There ar etwo common ways to write the second derivative of $y=f(x)$:"
      },
      {
        type:"bullet-points", 
        points:["$$f''(x)$$", "$$\\frac{d^{2}y}{dx^2}$$"]
      },
      {
        type:"paragraph", 
        content:"Both mean 'take the derivative of $f'(x)$'"
      }, 
      {
        type:"paragraph", 
        content:"But what does the second derivative actually tell us? -well:"
      }, 
      {
        type:"bullet-points", 
        points:["The first derivative: $f'(x)$ tell us the slope of the gradient of $f$ at each point", "The Second derivative: $f''(x)$ tells us how the slope itself is chanigng as $x$  moves"]
      }, 
      {
        type:"paragraph", 
        content:"In other words it measures the 'steepness of the steepness'"
      }, 
      {
        type:"paragraph", 
        content:"Now let's work through a few quick examples: "
      }, 
      {
        type:"heading", 
        level:"4", 
        content:"Given $f(x)= x^3 + 2x^2+3x+1$ determine $f''(x)$"
      }, 
      {
        type:'bullet-points', 
        points:["First we determine $f'(x)$, so we have $f'(x) = 3x^2 + 4x +3$", "Next we determine $f''(x)$ which is simply given by the derivative of $f'(x)$, therefore we get $f''(x) = 6x + 4$"]
      }, 
      {
        type:"heading", 
        level:"4", 
        content:"Find the second derivative of $f(x) = ax$ where a is a positive constant, and explain what it means"
      }, 
      {
        type:"paragraph", 
        content:"Now the first derivative is given by $f'(x) = a$ and the second derivative is simply the derivative of the first, given $a$ is a constant and the derivative of a constant is 0, we have $f''(x) = 0$, so what does this tell us? Well if the second derivative is 0 at a point $x=a$, it means that the rate at which the slope is changing pauses- in other words the $f''(x) = 0$ means the slope $f'(x)$ isn't increasing or decreasing at that point - so the curve's bending 'pauses' momentarily."
      }, 
      {
        type:"paragraph", 
        content:"so now that you've got an idea on what the second derivative is, let's now work through some quick problems"
      }

    ]
},
{
  id:2, 
  title:'Stationairy Points', 
  blocks:[
    {
      type:"paragraph",
      content:'A stationairy point is any point where the curve has a gradient of zero'
    }, 
    {
      type:'paragraph', 
      content:"For example take a look at the following curves:"
    }, 
    {
      type:"image", 
      url:"", 
      alt:"A cubic curve with tangents at the stationairy points along with the point itself highlighted"
    }, 
    {
      type:"image", 
      url:"",
      alt:'A quadratic curve with tangents at the stationairy point along with the point itself highlighted'
    }, 
    {
      type:"paragraph", 
      content:"As you can see in the image, the points where the tangent to the curve is 0 are exactly where the stationariy points reside for each curve, which is because the gradient of the tangent to a curve at a specific point is the the same as the gradient of the curve at that specific point. Therefore, we can see in the first image there are 2 stationairy points, which can be found where the tangent to the curve is horizontal, whereas in the second image there is only 1."
    }, 
    {
      type:"paragraph", 
      content:"In the second image, we are looking at a quaradtic expression, remember all the way back in our lesson on quadratics, we learned about the turning point of a qudartic and how it's always located where $x=-\\frac{b}{2a}$, well as you've probably realised the turning point of the quadratic is the same as the stationairy point for the quadratic!"
    }, 
    {
      type:"paragraph", 
      content:"In general, because the stationairy point of a function occurs when $f'(x)=0$ in other words, the steepness of the curve is neither increasing or decreasing, you will frequently find stationairy points where a curve os going from increasing to deceasing -vice versa. Therefore, tunring points of a curve like those observed in  quadratics are stationairy points "
    }, 
    {
      type:"paragraph", 
      content:"Now let's take a look at how we go about determining a stationairy point"
    },
    {
      type:"heading", 
      level:"4", 
      content:"Determine the stationairy points of $f(x) = x^3-3x+1$"
    }, 
    {
      type:'bullet-points', 
      points: [
        "1) First we calculate the derivative which is given by $f'(x) = 3x^2-3$", 
        "2) Next to find the stationairy point, we need to find the value of $x$ for which $f'(x) = 0$, so $$f'(x) = 0 \\implies 3x^2-3 =0$$ $$\\implies 3x^2 = 3 \\implies x^2 = 1$$ $$\\implies x = \\pm 1$$ ", 
        "3) Lasly now that we have our x-coordinates to find the actual stationairy points we just need to evaluate $f(x)$ at $x=-1$ and $x=1$ to get the y coordinates $$f(-1) = (-1)^3 - 3(-1) + 1 =  4$$ and $$f(1) = (1)^3 -3(1) + 1 = -1$$  So our stationairy points are given by $(-1, 4)$ and $(1,-1)$"
      ]
    }
  ]
}, 
{
  id:3, 
  title:'The Nature of Stationairy Points', 
  blocks:[
    {
      type:"paragraph", 
      content:"Now we've seen what stationairy points are now, but what we haven't looked at are the different types of stationairy points. There are three different types of stationairy points that you need to be familiar with and able to identify, these are:"
    }, 
    {
      type:"bullet-points", 
      points:['Maximum points', 'Minimum Points', 'Inflection Points']
    },
    {
      type:"paragraph", 
      content:"Take a look at the examples below: "
    }, 
    {
      type:"image", 
      url:"",
      alt:"IMage of a maximum point "
    }, 
    {
      type:"image", 
      url:"",
      alt:"Image of a minimum point"
    },
    {
      type:"paragraph", 
      content:"Now as you can see in the first image at the point $A$ the gradient is 0, which makes it a stationairy point, however what makes this type of stationairy point a maximum is the fact that the gradient of the curve was increasing prior to stationairy point and is decreasing after, resulting in an upside down 'U' shape. So therefore whenever you see a stationairy point on a curve where the surrounding function has a upside down 'U' shape, what we have is a maximum point "
    }, 
    {
      type:"paragraph", 
      content:"On the other hand, in the second image, the stationairy point $A$ is a minimum point, notice that the gradient of the function before the $A$ is decreasing and after $A$ it is increasing, this results in the surrounding function having a  'U' shape which is a key characteristic of minimum points."
    }, 
    {
      type:"paragraph", 
      content:"So we've seen that: "
    }, 
    {
      type:"bullet-points", 
      points:["A maximum point has a upside down 'U' shape where the gradient increases before the stationairy point then decreases after", "A minimum point has a 'U'shape where the gradient decreases before the stationairy point and then increases after "]
    }, 
    {
      type:"paragraph", 
      content:"So we've learned about maximum and minimum points, but what our our third type of stationairy point, inflection points? - well take a look at the two images below:"
    }, 
    {
      type:"image", 
      url:"", 
      alt:"point of inlfection- decreasing to decreasing x^3"
    },
    {
      type:'image', 
      url:"", 
      alt:"point of inflection-  increasing to increasing -x^3"
    }, 

    {
      type:"paragraph", 
      content:"Now consider the two images above $f(x) = x^3$ in the first image and $f(x)=-x^3$ in the second image. In both images the point $A$ is a stationairy point as $f'(x) = \\pm3x^2 \\implies f'(0) = 0$, so $(0,0)$ is a stationairy point. However, in either image, we don't have a 'U' or upside down 'U' shape. In fact in the first image the gradient is increasing before AND after the stationairy point, whereas in the second image the gradient of the function is decreasing before AND after the stationairy point!"
    }, 
    {
      type:"paragraph", 
      content:"Therefore when the gradient of the function is increasing before and after a stationairy pooint OR decreasing before and after the stationairy point- we have a point of inflection."
    },
    {
      type:'paragraph', 
      content:"Now the last thing we will do is briefly define a few terms that you may come across: Firstly you will frequently come across the terms 'local minimum' or 'local maximum' a local minimum/maximum point is still a stationairy point, but it's called local because it's not the larget or smallest value that the function can take, it's just the larget or smallest value within a small vicinity of the function  "
    }, 
    {
      type:"image",
      url:"", 
      alt:"image of a curve with maximum or minimum point but neither is the maximum or minimum of the entire function" 
    },
    {
      type:"paragraph", 
      content:'For instance, in the image above neither the maximum or minimum shown by points $A$ and $B$ is the maximum or minimum of the entire function, but within the highlighted area it is! Hence, $A$ is a  local maximum and $B$ is a local minimum point.'
    }, 
    //have a few question like what type of stationairy point is this based on images, and finish off with an equation of a quadratic function and asking if it is a local maximum, local minimum, global maximum or global minimum
    //include the definition of global maximums and minimums in the hint of that last question
  ]
}, 
{
  id:4, 
  title:"Classifying Stationairy Points - I", 
  blocks:[
    {
      type:'paragraph', 
      content:"Now as we've seen there are three different types of stationairy points that we need to be able to classify:"
    }, 
    {
      type:"bullet-points", 
      points:[
        'maximum points', 
        'minimum points', 
        'inflection points'
      ]
    }, 
    {
      type:"paragraph", 
      content:"However, how can we actually check what type of stationairy point we have without relying on a sketch of the curve? Well there are two main approachs to achieve this "
    }, 
    {
      type:'bullet-points', 
      points:["Analyzing the gradient on either side of the stationairy point", "Using the second derivative"]
    }, 
    {
      type:'paragraph', 
      content:"In the remainder of this lesson we will focus on using the first approach by analyzing the gradient on either side of the stationairy point."
    },
    {
      type:'paragraph', 
      content:"Remember that for a maximum point, we have an upside down 'U' shape meaning the gradient of the function is increasing before the stationairy point and then decreasing after, therefore to determine whether a stationairy point is a maximum, we can substitute values into the gradient just before the stationairy point and ensure that the value outputted by the gradient funciton is positive (which means an increasing gradient ), then we can substitue a value just after the stationairy point and check that the gradient function outputs a negative value (which means we have a decreasing gradient just after the stationairy point). Therefore, this would confirm that the stationairy point is a maximum"
    }, 
    {
      type:"paragraph", 
      content:"It is a very similar process for determining whether a point is a minimum point - in the case of minimum points the gradient of the function is decreasing before the stationairy point and increasing after, so to determine whether a stationairy point is a minimum, we can substitute values into the gradient as illustrated above, but this time check that the gradient evaluated at a value just before the stationairy point is negative and just after is positive"
    }, 
    {
      type:"paragraph", 
      content:"For points of inflection it's very much the same process, however now we check if the gradient is negative both before and after the stationairy point or positive both before and after the stationairy point"
    }, 
    {
      type:'paragraph', 
      content:"Therefore we can summarise these rules below, for small $h >0$:"
    }, 
    {
      type:"bullet-points", 
      points:[
        "If $f'(x-h) < 0 ,  f'(x) = 0$  and $f'(x+h) >0 \\implies$  local minimum point ", 
        "If $f'(x-h) >0 ,  f'(x) = 0$  and $f'(x+h) <0 \\implies$  local maximum point ",
        "If $f'(x-h) < 0 ,  f'(x) = 0$  and $f'(x+h) <0 \\implies$  local minimum point ", 
        "If $f'(x-h) < 0 ,  f'(x) = 0$  and $f'(x+h) <0 \\implies$  inflection point ", 
        "If $f'(x-h) > 0 ,  f'(x) = 0$  and $f'(x+h) >0 \\implies$  inflection point"
      ]

    }, 
    {
      type:"paragraph", 
      content:"So let's finish up this part of the lesson by working through an exmaple, and the lesson tasks"
    }, 
    {
      type:"heading",
      level:'4', 
      content:'Example- Classify all the stationairy points of $y=x^2(x-4)^2$'
    }, 
    {
      type:"bullet-points", 
      points:[
        "1) First lets start by expanding this out, so we get $y=x^2(x^2-8x+16) = x^4 -8x^3 +16x^2$", 
        "2)Next determine the derivative, $\\frac{dy}{dx} = $"
      ]
    }
    
  ]
},
{
  id:5, 
  title:"Classifying Stationairy Points - II", 
  blocks:[
    {
      type:"paragraph", 
      content:"So we've already seen how to classifiy stationairy points by analyzing the gradient but, lucky you- theres a quicker way! We can also rely on the second derivative to determine the nature of a stationairy point, using the following rules:"
    }, 
    {
      type:"paragraph", 
      content:'Let $x^{*}$ be a stationairy point for the function $f(x)$, then: '
    },
    {
      type:"bullet-points", 
      points:[
        "If $f''(x^{*}) > 0$ then $x^{*}$ is a local minimum point", 
        "If $f''(x^{*}) < 0$ then $x^{*}$ is a local maximum point", 
        "If $f''(x^{*}) = 0$ then the point could be either a maximum, minimum or inflection point, so we need to resort to our original method of checking the gradient on either side "
      ]
    }, 
    {
      type:"paragraph", 
      content:""
    }, 
    {
      type:"accordion", 
      title:"So now that we know how the second derivative can be used to classify stationairy points, how about understanding why?- if interested click here",
      children:[
        {type:'paragraph', content:"Testing"}, 
        {
          type:'image', 
          url:"/Images/repeated-root.png"
        }
      ]
    }, 
    {
      type:'paragraph', 
      content:"So what are waiting for- time to get to work on the tasks!"
    }



  ]
}]
}

const sketchingGradient = {
    _id: "650000000000000000000002",
  slug: "gradient-sketching",
  title: "Gradient Sketching",
  next: "modelling",
  parts: [
    {
      id:1,
      title:"There's an easier way", 
      blocks:[
        {
          type:"paragraph", 
          content:''
        }
      ] 

    }
  ]
}

const exponentialsAndTheirGraphs = {
     _id: "650000000000000000000002",
  slug: "gradient-sketching",
  title: "Exponentials and Their Graphs",
  next: "modelling",
  parts: [
    {
      id:1, 
      title:'So What is an Exponential?', 
      blocks:[
        {
          type:"paragraph",
          content:"So have you ever heard the term exponential and not been fully sure what it means?- well guess what you're about to learn all you need to know about exponentials right now!"
        }, 
        {
          type:"bold-paragraph", 
          content:"Any function of the form $a^x$, i.e. $f(x)=a^x$ for any  positive constant $a \\ne 1$, is a exponential function"
        }, 
        {
          type:"paragraph", 
          content:"Recall all the way back on our lesson on indices that in $a^x$ $x$ can be referred to as the exponent."
        },
        {
          type:"paragraph", 
          content:"That's all their is, no surprises just a brief introduction to what an exponential function is! In the next part We'll explore the graphs of exponentials and their properties in a more detail."
        }
      ]
    }, 
    {
      id:'2', 
      title:'Exponential Graphs', 
      blocks:[
        {
          type:"paragraph", 
          content:"Now that we understand the form of exponential functions it's only right that we move on to study their graphs. Consider $y=3^x$ at different values of $x$ in the table below:", 
          
        }, 
        
        {
        type: 'table',
        header: ['x', '-2', '-1', '0', '1', '2', ],
        rows: [
          ['y', '$3^{-2} = \\frac{1}{9}$', '$3^{-1} = \\frac{1}{3}$', '$3^0=1$', '$3$', '$9$', ]
  ]
}, 
{
  type:"paragraph", 
  content:"So if we were to continue calculating these values of x and y and plot the entire curve, we would end up with something like:"
}, 
{
  type:"paragraph",
  content:"$y=3^x$"
}, 

{
  type:"image", 
  url:'/images/exponential-graph-1.png', 
  alt:'A sketch of the graph 3^x'
}, 
{
  type:'paragraph', 
  content:"Now alreay do you notice anything interesting about this function? As our $x$ value gets smaller and smaller (i.e. more and more negative), our function $y=3^x$, gets closer and closer to 0, this is because $3^{-x} = \\frac{1}{3^x}$, which becomes closer and closer to $0$ for large $x$. "
}, 
{
  type:'bold-paragraph', 
  content:'HOWEVER, $a^{-x} = \\frac{1}{a^{x}}$  NEVER precisely equals $0$ no matter how negative and big $x$ gets!'
}, 
{
  type:"paragraph", 
  content:"It simply gets infinitely closer to $0$, but never touches it. Therefore we say that our curve has an asymptote at $x=0$, and this is the case for all functions of the form $y=a^{x}$. "
}, 
{
  type:"paragraph", 
  content:"Now another interesting property shared between all function of the form $y=a^{x}$ is the value they take when $x=0$! Now we already know from our lessons on indices, that $x^0 =1 $ in other words 'anything to the power of $0$ is equal to $1$'. This means in the case of exponential functions i.e. $f(x) = e^x$ it will always be the case that $f(0) =1$ meaning our exponential functions will always cross the y axis at $y=1$ "
}, 
{
  type:'paragraph', 
  content:"Now so far we've only looked at functions $y=a^{x}$ when $a>1$, but what about the case when $a<1$? What does this look like? Well lets take $a=\\frac{1}{3}$ and consider the function $y= \\bigl( \\frac{1}{3} \\bigr) ^x$. If we create another table of values for a few $x$ we get:"
},
   {
        type: 'table',
        header: ['x', '-2', '-1', '0', '1', '2', ],
        rows: [
          ['y', '$ \\bigl( \\frac{1}{3} \\bigr)^{-2} =9$', '$ \\bigl( \\frac{1}{3} \\bigr)^{-1} =3$', '$ \\bigl( \\frac{1}{3} \\bigr)^{0} =1$', '$\\frac{1}{3}$', '$\\frac{1}{9}$', ]
  ]
},
{
  type:'paragraph', 
  content:"This is exactly the reverse of what we had for $y=3^x$, in other words, our function gets smaller as x gets larger approaching 0 but never actually touching it, our stays at $x=0$ but our curve is reflected in the y-axis!"
}, 
{
  type:'paragraph', 
  content:"So if we were to sketch $\\bigl( \\frac{1}{3} \\bigr)^x $ on the same graph as $y=3^x$ we would get:"
},
{
  type:"image", 
  url:"/images/exponential-different-bases.png", 
  alt:'Exponentials with a>1 and a <1 on the same graph'
},
{
  type:"paragraph", 
  content:"Now let's finish off this lesson with a quick example illustrating sketching an exponential function:"
}, 
{
  type:"heading", 
  level:'3', 
  content:"Example- Sketch $y=2^x$"
}, 
{
  type:""
}

      ]
    }, 
    {
     id:'3', 
     title:'Transformations with Exponentials', 
     blocks:[
      {
        type:"paragraph", 
        content:"So now that we've seen how  "
      }
     ]
    }
  ]
}

const exponentialDerivatives = {
   _id: "650000000000000000000002",
  slug: "exponential-derivatives",
  title: "Exponential Derivatives",
  next: "exponential-modelling",
  parts: [
    {
      id:"1", 
      title:"What's $e^x$ and why's it special?", 
      blocks:[
        {
          type:'paragraph', 
          content:"Now that you know what an exponential function is it's time to introduce one more special property about them... they look really like their derivatives.  Well what do we mean by this? Consider the example image, below in red we have the graph of $y=2^x$ and the blue curve denotes $\\frac{dy}{dx}$ the derivative, notice how similar it looks, "
        }, 
        {
          type:"bold-paragraph", 
          content:" (note you don't need to be able to differentiate functions of the form $y=a^x$ yet)"
        }, 
        {
          type:"image", 
          url:"/images/exponential-similar-derivatives-1.png", 
          alt:"sketch of y=2^x and dy/dx to show similarity between exponential and derivative"
        }, 
        { 
          type:"paragraph", 
          content:"See they are quite close and also similarly shaped, now let's consider another example - $y=3^x$ and it's derivative: "
        }, 
        {
          type:'image', 
          url:"/images/exponential-similar-derivatives-2.png", 
          alt:"sketch of y=3^x and dy/dx to show similarity between exponential and derivative"
        }, 
        {
          type:"paragraph", 
          content:"Notice how the curves are even closer now, with the difference being that $y=3^x$ is slight to the right of it's derivative whereas $y=2^x$ was to the left of it's! This is very important because something very special occurs between $y=2^x$ and $y=3^x$ - there exists a special constant $a$ such that $y=a^x$ is the same as it's derivative"
        }, 
        {
          type:'paragraph', 
          content:"This occurs when $a\\approx 2.71828$ and we represent this speical constant with the letter $e$! You can see $y=e^x$ plotted between $y=2^x$ and $y=3^x$ via the dashed line below"
        }, 
        {
          type:"image", 
          url:'/images/exponential-similar-derivatives-3.png', 
          alt:'e^x plotted inbetween y-2^x and y=3^x'
        }, 
        {
          type:"paragraph", 
          content:"Well let's see if you've been paying attention - complete the task below to move on "
          //This task should simply ask what is the derivative of e^x
        }
      ]
    }, 
    {
      id:"2", 
      title:"Differentiating Exponentials", 
      blocks:[
        {
          type:"paragraph", 
          content:"Now that we've introduced our speical constant $e$, it's time to state it's derivative results formally: For real values of $x$"
        }, 
        {
          type:"bullet-points",
          points:['If $y=e^x$ then $\\frac{dy}{dx} = e^{x} $', "If $f(x) = e^x$ then $f'(x) = e^{x}$"]
        }, 
        {
          type:"paragraph", 
          content:"For example if we have $y=24e^{x}$ then the derivative would simply be given by $\\frac{dy}{dx} = 24e^x$. See it's very simple there really isn't much too it at all, consider this second example:"
        }, 
        {
          type:"heading", 
          level:"4", 
          content:"Example: $f(x)=24x + 3e^{x}$ what is $f'(x)$?"
        }, 
        {
          type:"bullet-points", 
          points:["Just like we've seen before just differeniate each term one-by-one. The derivative of $24x$ is $24$, and the derivative of $3e^x = 3e^x$ ", "Therefore $f'(x) = 24+3e^x$"]
        }, 
        {
          type:"paragraph", 
          content:"Now this is simple right- but what about functions of the form $y=e^{kx}$, where k is a real number? - well in this case all you need to do is apply the following rule: For real values of $x$ and $k$"
        }, 
        {
          type:"bullet-points", 
          points:["If $y=e^{kx}$ then $\\frac{dy}{dx} = ke^{kx}$", "If $f(x)=e^{kx}$ then $f'(x) = ke^{kx}$"]
        }
      ]
    }
  ]
}

const exponentialModelling = {
   _id: "650000000000000000000002",
  slug: "exponential-models",
  title: "Exponential Models",
  next: "introducing-logarithms",
  parts: [{
    id:"1", 
    title:"When to use $e^x$", 
    blocks: [
      {
        type:'paragraph', 
        content:"So far throughout the course we've seen modelling in a variety of different concepts, for instance, we've seen you can use linear models (straight lines) in cases where we have two variables $x$ and $y$ which we could compare via the relationship $y=ax+b$ for some constants a and b. "
      }, 
      {
        type:"paragraph", 
        content:"We've also seen problems where we can use differentiation to model the rate of change between two variables. However we can't just use differential equations or linear models for everything, there will be alot of cases where it is better to model the problem using exponential functions like $e^x$"
      }, 
      {
        type:'bold-paragraph', 
        content:""
      }
    ]
  }]
}

const introducingLogarithms = {
   _id: "650000000000000000000002",
  slug: "exponential-models",
  title: "Exponential Models",
  next: "introducing-logarithms",
  parts: [{
    id:'1', 
    title:"What does log mean?", 
    blocks:[
      {
        type:"paragraph", 
        content:"So you've probably heard of logarithms before or seen them in textbooks or videos but what are they? Where do they originate? what is their purpose? What are $logs$?- We will answer all these questions in the reminader of this lesson."
      }, 
      {
        type:"bold-paragraph", 
        content:"Formally, a logarithm is the inverse of   "
      }
    ]
  }]

}

const introducingBinomials = {
  "_id": "000",
  "slug": "introducing-binomials",
  "title": "Introducing Binomials",
  "next": "brackets-and-large-powers",
  "parts": [
    {
      "id": 1,
      "title": "Pascal and his Triangle",
      "blocks": [
        {
          "type": "paragraph",
          "content": "A binomial expression has exactly two terms joined by + or −. For example: $\\bigl(x+3\\bigr)$ or  $\\bigl(2y-5\\bigr)$."
        },
        {
          "type": "paragraph",
          "content": "Often in mathematics we need to expand these expressions when raised to a power."
        },
        {
          "type":"paragraph", 
          "content": " When we raise it to low powers—for instance $(x+2)^2$—it’s straightforward, but as the powers get larger, for instance $(x+2)^9$, the work becomes more time consuming."
        }, 
{
  "type": "paragraph",
  "content": "A French mathematician, Blaise Pascal, noticed a pattern that gives all the coefficients for the expansion of binomial expressions. We arrange the numbers in a triangle, now called *Pascal’s Triangle*. $$\\begin{array}{rccccccccccccc}  &  &  &  &  &  & 1 &  &  &  &  &  &  & \\\\  &  &  &  &  & 1 &  & 1 &  &  &  &  &  & \\\\  &  &  &  & 1 &  & 2 &  & 1 &  &  &  &  & \\\\  &  &  & 1 &  & 3 &  & 3 &  & 1 &  &  &  & \\\\  &  & 1 &  & 4 &  & 6 &  & 4 &  & 1 &  &  & \\\\  & \\textcolor{#17a2b8}{1} &  & \\textcolor{#17a2b8}{5} &  & \\textcolor{#17a2b8}{10} &  & \\textcolor{#17a2b8}{10} &  & \\textcolor{#17a2b8}{5} &  & \\textcolor{#17a2b8}{1} &  & \\\\ \\end{array}$$"
}

,

{
  "type": "paragraph",
  "content": "Now let's consider expanding the binomial expression $$(x+y)^n$$ for different values of n to see where Pascal's triangle comes into play: $$\\footnotesize \\begin{array}{c} \\boldsymbol{(x+y)^0 =} 1 \\\\ \\boldsymbol{(x+y)^1 =} x+y \\\\ \\boldsymbol{(x+y)^2 =} x^2+2xy+y^2 \\\\ \\boldsymbol{(x+y)^3 =} x^3+3x^2y+3xy^2+y^3 \\\\ \\boldsymbol{(x+y)^4 =} x^4+4x^3y+6x^2y^2+4xy^3+y^4 \\\\ \\boldsymbol{(x+y)^5 =} \\textcolor{#17a2b8}{1}x^5+\\textcolor{#17a2b8}{5}x^4y+\\textcolor{#17a2b8}{10}x^3y^2+\\textcolor{#17a2b8}{10}x^2y^3+\\textcolor{#17a2b8}{5}xy^4+\\textcolor{#17a2b8}{1}y^5 \\\\ \\end{array}$$"
},
{
  "type":"paragraph", 
  "content":"Notice how the coefficient of each term in $(x+y)^5$ corresponds to the numbers in pascals triangle, this is no coincidence. In general: "
},
{
  "type":"bold-paragraph", 
  "content":"The $(n+1)^{th}$ row of pascals triangles gives the coefficeints in the expansion of $(x+y)^n$ "
},
 {
          "type": "paragraph",
          "content": "How it grows is simple: Every inside number is the sum of the two numbers directly above it. The edges are always 1’s, as shown below:"
        },

        {
          "type":"paragraph", 
          "content":"$$\\begin{array}{rccccccccccccc}  &  &  &  &  &  & 1 &  &  &  &  &  &  & \\\\  &  &  &  &  & 1 &  & 1 &  &  &  &  &  & \\\\  &  &  &  & 1 &  & 2 &  & 1 &  &  &  &  & \\\\  &  &  & 1 &  & 3 &  & 3 &  & 1 &  &  &  & \\\\  &  & 1 &  & \\textcolor{#17a2b8}{4} &  & \\textcolor{#17a2b8}{6} &  & 4 &  & 1 &  &  & \\\\  &  &  &  &  &  \\downarrow \\tiny + &  &  &  &  &  &  &  & \\\\  & 1 &  & 5 &  & \\textcolor{#17a2b8}{10} &  & 10 &  & 5 &  & 1 &  & \\\\ \\end{array}$$"
        },
        {
          "type":"paragraph", 
          "content":"See it's pretty easy, now work through the following tasks to ensure you understand, and although not necessary, if you are interested in diving deeper into pascal's triangle check out the information below:"
        }, 
        {
  "type": "accordion",
  "title": "Pascal's Triangle Deep Dive, click here",
  "children": [
    {
      "type": "paragraph",
      "content": "When you expand $(x+y)^n$, each term looks like $x^{n-k}y^k$, where $k$ is how many times you picked $y$ from the brackets."
    },
    {
      "type": "paragraph",
      "content": "Each term can appear more than once because there are many ways to pick which brackets give you a $y$."
    },
    {
      "type": "paragraph",
      "content": "For example, in $(x+y)^3$, the term $xy^2$ happens if you pick $y$ from 2 brackets and $x$ from the other 1. There are 3 different ways to do this, so the coefficient is 3."
    },
    {
      "type": "paragraph",
      "content": "Why does the adding rule work? Imagine building $(x+y)^n$ step by step from $(x+y)^{n-1}$. To make a term with $k$ $y$’s in row $n$, you either: (a) take a term with $(k-1)$ $y$’s from the previous row and multiply by another $y$, or (b) take a term with $k$ $y$’s from the previous row and multiply by another $x$. The total ways come from adding these two cases together. That’s why each number is the sum of the two numbers above it."
    },
    {
      "type": "paragraph",
      "content": "Simple example: In the 6th row , the coefficient $10$ for $x^3y^2$ comes from 4 ways of making $x^3y^1$ in the previous row then multiplying with a $y$ and 6 ways of making $x^2y^2$ in the previous row then multiplying by a $x$. Together $4+6=10$."
    }
  ]
}


      ]
    }, 
    {
  "id": 2,
  "title": "Factorials: The Shortcut Behind Pascal’s Triangle",
  "blocks": [
    {
      "type": "paragraph",
      "content": "So far we’ve seen how Pascal’s triangle gives us the coefficients of $(x+y)^n$. But writing out whole triangles every time can be slow. Luckily, there’s a neat shortcut: factorials."
    },
    {
      "type": "paragraph",
      "content": "A factorial means you multiply a number by every whole number below it until you reach 1. It’s written with an exclamation mark."
    },
    {
      "type": "bullet-points",
      "points": [
        "$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$",
        "$3! = 3 \\times 2 \\times 1 = 6$"
      ]
    },
    {
      "type": "paragraph",
      "content": "And here’s an important special case: $0! = 1$. This is just a definition mathematicians agreed on, and it makes all the formulas work out nicely."
    },
    {
      "type": "paragraph",
      "content": "So now we know what factorials are. But how do they connect to Pascal’s triangle that we just learned about?"
    },
    {
      "type": "paragraph",
      "content": "Remember that the rows of Pascal’s triangle match the coefficients in the expansion of $(x+y)^n$:"
    },
    {
      "type": "paragraph",
      "content": "$$\\begin{array}{ccccccc} &&&&& 1 \\\\ &&&& 1 && 1 \\\\ &&& 1 && 2 && 1 \\\\ && 1 && 3 && 3 && 1 \\\\ & 1 && 4 && 6 && 4 && 1 \\\\  1 && 5 && 10 && 10 && 5 && 1 \\\\ \\end{array}$$"
    },
    {
      "type": "paragraph",
      "content": "At first we said these numbers were just the coefficients in the expansions of $(x+y)^n$. But they also have another meaning: they tell us how many different ways there are to make certain choices."
    },
    {
      "type": "paragraph",
      "content": "For example, the number 10 in row 5 tells us there are 10 different ways to choose 2 $y$’s from 5 brackets when expanding $(x+y)^5$."
    },
    {
      "type": "paragraph",
      "content": "So each entry in Pascal’s triangle is really counting the *number of ways to choose*."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "The formula for the rth term in the nth row"
    },
    {
      "type": "paragraph",
      "content": "Now here’s the key connection: the rth entry in the nth row of Pascal’s triangle can be found using factorials. The formula is:"
    },
    {
      "type": "paragraph",
      "content": "$$^nC_r = \\frac{n!}{r!(n-r)!}$$"
    },
    {
      "type": "paragraph",
      "content": "We read this as 'n choose r'. It simply means the number of different ways we can choose r items from n possibilities."
    },
    {
      "type": "paragraph",
      "content": "So if we want the rth coefficient in row n of Pascal’s triangle, we don’t need to build the whole triangle — we can just plug into this formula."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Example using factorials"
    },
    {
      "type": "paragraph",
      "content": "Let’s check the '10' in row 5 without using Pascal’s triangle. Using the formula:"
    },
    {
      "type": "paragraph",
      "content": "$$^5C_2 = \\frac{5!}{2!(5-2)!} = \\frac{120}{2\\times6} = 10$$"
    },
    {
      "type": "paragraph",
      "content": "Exactly what we expected! So factorial notation is the quick way to find any entry in Pascal’s triangle, especially when the rows get large."
    }
  ]
}

  ],
  "collection": "edx-maths-1"
};

const beyondPascal = {
   "_id": "000",
  "slug": "introducing-binomials",
  "title": "Introducing Binomials",
  "next": "brackets-and-large-powers",
  "parts": [
    {
  "id": 1,
  "title": "Binomial Expansion",
  "blocks": [
    {
      "type": "paragraph",
      "content": "Up until now we’ve seen how Pascal’s triangle can give us the coefficients of $(x+y)^n$. But instead of building the triangle every time, mathematicians came up with a direct formula — the Binomial Expansion Formula."
    },
    {
      "type": "paragraph",
      "content": "The binomial expansion is a rule that allows us to expand brackets like $(a+b)^n$ in a systematic way. It tells us exactly what every term looks like and what its coefficient should be."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "The Binomial Expansion Formula"
    },
    {
      "type": "paragraph",
      "content": "The expansion of $(a+b)^n$ is given by: $$\\tiny{  (a+b)^n=a^n +\\binom{n}{1}a^{n-1}b+\\binom{n}{2}a^{n-2}b^2 + \\cdots + \\binom{n}{r}a^{n-r}b^r + \\cdots + b^n }$$"
    },
    {
      "type": "paragraph",
      "content": "Here each term has two important parts: \n- The powers of $a$ and $b$ always add up to $n$.\n- The coefficient in front of each term is given by a binomial coefficient, written as $\\binom{n}{r}$, also called 'n choose r'."
    },
    {
      "type": "paragraph",
      "content": "Remember: $$ \\binom{n}{r} = \\frac{n!}{r!(n-r)!} $$ This gives us the number of ways of choosing $r$ items from $n$, and it’s exactly the same numbers we saw in Pascal’s triangle."
    },
    {
      "type": "paragraph",
      "content": "So, in summary: every term in $(a+b)^n$ is of the form $$ \\binom{n}{r} a^{n-r}b^r $$ where $r$ starts at 0 and goes all the way up to $n$."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Example 1: Expanding $(x+1)^3$"
    },
    {
      "type": "paragraph",
      "content": "Let’s expand $(x+1)^3$ using the formula. Here $n=3$, $a=x$, and $b=1$."
    },
    {
      "type": "bullet-points",
      "points": [
        "For $r=0$: $\\binom{3}{0}x^3(1)^0 = 1 \\cdot x^3 = x^3$",
        "For $r=1$: $\\binom{3}{1}x^2(1)^1 = 3x^2$",
        "For $r=2$: $\\binom{3}{2}x^1(1)^2 = 3x$",
        "For $r=3$: $\\binom{3}{3}x^0(1)^3 = 1$"
      ]
    },
    {
      "type": "paragraph",
      "content": "So the full expansion is: $$(x+1)^3 = x^3 + 3x^2 + 3x + 1$$"
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Example 2: Expanding $(2x-3)^4$"
    },
    {
      "type": "paragraph",
      "content": "This time $n=4$, $a=2x$, and $b=-3$. Let’s carefully apply the formula."
    },
    {
      "type": "bullet-points",
      "points": [
        "For $r=0$: $\\binom{4}{0}(2x)^4(-3)^0 = 1 \\cdot 16x^4 = 16x^4$",
        "For $r=1$: $\\binom{4}{1}(2x)^3(-3)^1 = 4 \\cdot 8x^3 \\cdot (-3) = -96x^3$",
        "For $r=2$: $\\binom{4}{2}(2x)^2(-3)^2 = 6 \\cdot 4x^2 \\cdot 9 = 216x^2$",
        "For $r=3$: $\\binom{4}{3}(2x)^1(-3)^3 = 4 \\cdot 2x \\cdot (-27) = -216x$",
        "For $r=4$: $\\binom{4}{4}(2x)^0(-3)^4 = 1 \\cdot 81 = 81$"
      ]
    },
    {
      "type": "paragraph",
      "content": "So the expansion is: $$\\small{(2x-3)^4 = 16x^4 - 96x^3 + 216x^2 - 216x + 81}$$"
    },
    {
      "type": "paragraph",
      "content": "Now that you've seen how binomial expansion works, it's time to work through the following tasks: "
    }
  ]
}, 
{
  "id": 2,
  "title": "The General Term",
  "blocks": [
    {
      "type": "paragraph",
      "content": "In Part 1, we learned the full formula for expanding $(a+b)^n$. But often, we don’t need the entire expansion — we just want one specific term or coefficient. To do this, we use the general term formula."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "The General Term Formula"
    },
    {
      "type": "paragraph",
      "content": "In the expansion of $(a+b)^n$, the general term is given by: $$ \\binom{n}{r} a^{n-r}b^r $$"
    },
    {
      "type": "paragraph",
      "content": "Here $r$ starts from 0, meaning the first term has $r=0$ (all $a$’s) and the last term has $r=n$ (all $b$’s). The binomial coefficient $\\binom{n}{r}$ tells us how many ways we can pick $r$ factors of $b$ from $n$ brackets."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Why does this formula work?"
    },
    {
      "type": "paragraph",
      "content": "When expanding $(a+b)^n$, we are multiplying $n$ identical brackets. To get a term with $b^r$, we choose $b$ from exactly $r$ brackets, and $a$ from the remaining $n-r$ brackets. The number of ways to choose which brackets give $b$ is $\\binom{n}{r}$, which is why it appears as the coefficient."
    },
    {
      "type": "paragraph",
      "content": "This formula lets us calculate any single term in the expansion without writing out the entire expression."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Example 1: The 3rd term in $(x+2)^5$"
    },
    {
      "type": "bullet-points",
      "points": [
        "General formula: $\\binom{n}{r} a^{n-r} b^r$",
        "Here $n=5$, $a=x$, $b=2$",
        "For the 3rd term, $r=2$ (remember we start from $r=0$ from so $r=2$ is the 3rd term)",
        "$\\binom{5}{2}x^{5-2}(2)^2 = 10x^3 \\cdot 4 = 40x^3$"
      ]
    },
    {
      "type": "paragraph",
      "content": "So, the 3rd term in the expansion of $(x+2)^5$ is $40x^3$."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Example 2: Find the coefficient of $x^3$ in $(7+2x)(4-5x)^8$"
    },
    {
      "type": "paragraph",
      "content": "Here we have a product of $(7+2x)$ and $(4-5x)^8$. Since the $x^3$ term could come from different combinations of terms, we need to consider each possible contribution and add them together."
    },
    {
      "type": "paragraph",
      "content": "$\\textcolor{#17a2b8}{\\textbf{step 1:}}$ Because we are multiplying $(4-5x)^8$ by $(7+2x)$ we need to first consider the $x^2$ and $x^3$ terms from $(4-5x)^8$. This is because the $x^2$ term multiplied by $2x$ results in a $x^3$ term, similarly the $x^3$ term when multiplied by 7  results in a $x^3$ term which is what we're after  .Using our general term formula we have: "
    },
    {
      "type": "bullet-points",
      "points": [
        "General formula: $\\binom{n}{r} a^{n-r} b^r$",
        "Here $n=8$, $a=4$, $b=-5x$",
        "$x^2$ term occurs when $r=2$ : $$\\binom{8}{2} (4)^{8-2} (-5x)^{2} = 2867200x^2$$",
        "$x^3$ term occurs when $r=3$: $$ \\binom{8}{3}(4)^{8-3}(-5x)^3 = -7168000x^3 $$"
      ]
    },
    {
      "type": "paragraph",
      "content": "$\\textcolor{#17a2b8}{\\textbf{step 2:}}$ Multiply by $(7+2x)$ and collect $x^3$ terms"
    },
    {
      "type": "bullet-points",
      "points": [
        "From $7 \\times (-7168000x^3)$ we get $-50176000x^3$",
        "From $2x \\times 2867200x^2$ we get $5734400x^3$"
      ]
    },
    {
      "type": "paragraph",
      "content": "$\\textcolor{#17a2b8}{\\textbf{step 3:}}$: Combine the terms together"
    },
    {
      "type": "paragraph",
      "content": "$-50176000x^3 + 5734400x^3 = -44441600x^3$"
    },
    {
      "type": "paragraph",
      "content": "So the coefficient of $x^3$ in $(7+2x)(4-5x)^8$ is $-44441600$."
    },
    {
      "type": "paragraph",
      "content": "If you found the explanation to example 2 hard to understand don't worry, you can get the exact same result by FULLY expanding out $(4-5x)^8$ then multipying through by $(7+2x)$. The reason we didn't apply the full binomial expansion formula to  $(4-5x)^8$ was to simply save time, because we're only interested in the $x^3$ term for this question we don't actually need the $x^4, x^5, x^6, \\cdots$ terms because they are all higher then $x^3$, we only need the $x^2$ term because when we multiply it by the $2x$ part of $(7+2x)$ it becomes an $x^3$ term, and we needed the $x^3$ term as when we multiply it with the $7$ from $(7+2x)$ the result is also an $x^3$ term! "
    }
  ]
}, 
{
  "id": 3,
  "title": "Binomial Estimation",
  "blocks": [
    {
      "type": "paragraph",
      "content": "So far, we’ve used the binomial theorem to expand expressions exactly. But in science and engineering, we often just want an approximation — something that’s close enough without calculating huge expansions."
    },
    {
      "type": "paragraph",
      "content": "Binomial estimation works when $|x| < 1$. Why? Because as the powers of $x$ increase ($x^2, x^3, x^4, ...$), the terms get smaller and smaller, so higher powers can often be ignored. If $x \\geq 1$, the terms don’t shrink — in fact, they may grow — so the estimation no longer works."
    },
    {
      "type": "paragraph",
      "content": "So the idea is simple: when $|x| < 1$, we expand $(1+x)^n$ and keep just the first few terms, ignoring the rest. This gives us a very good approximation."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Example 1:"
    },
   
  ]
}, 
{
  "id": 4,
  "title": "Binomial Probabilities",
  "blocks": [
    {
      "type": "paragraph",
      "content": "Now if you didn't know it's time for you to get to know -the binomial theorem is VERY important in statistics and probability! But why? "
    },
    {
      "type":"paragraph", 
      "content":"The answer is that the exact same numbers we’ve been using for coefficients in expansions also appear in probability problems."
    },
    {
      "type": "paragraph",
      "content": "Imagine you flip a coin $n$ times. Each flip is either a Head (H) or a Tail (T). If you want to know the probability of getting exactly $r$ Heads, you need to count how many different ways $r$ Heads can appear in $n$ flips."
    },
    {
      "type": "paragraph",
      "content": "This is exactly what $\\binom{n}{r}$ tells us — the number of ways of choosing $r$ successes (Heads) from $n$ trials (flips)."
    },
    {
      "type": "paragraph",
      "content": "If the probability of getting a Head is $p$ and the probability of getting a Tail is $1-p$, then the probability of one particular outcome with $r$ Heads and $(n-r)$ Tails is: $$p^r(1-p)^{n-r}.$$"
    },
    {
      "type": "paragraph",
      "content": "But since there are $\\binom{n}{r}$ different ways this can happen, the total probability is: $$P(\\text{exactly } r \\text{ Heads}) = \\binom{n}{r} p^r (1-p)^{n-r}.$$"
    },
    {
      "type": "paragraph",
      "content": "Notice how this formula looks almost identical to a term in the expansion of $(p + (1-p))^n$. That’s because the binomial theorem and binomial probabilities are really the same thing — just viewed in different contexts."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "An Easy Example"
    },
    {
      "type": "paragraph",
      "content": "Suppose you flip a coin 4 times. What is the probability of getting exactly 2 Heads? Here $n=4$, $r=2$, and $p=0.5$."
    },
    {
      "type": "paragraph",
      "content": "$$P(2 \\text{ Heads}) = \\binom{4}{2}(0.5)^2(0.5)^2$$ $$= 6 \\times 0.25 \\times 0.25 = 0.375$$"
    },
    {
      "type": "paragraph",
      "content": "So there’s a $37.5\\%$ chance of exactly 2 Heads."
    },
    {
      "type": "accordion",
      "title": "If you're interested in why this works",
      "children": [
        {
          "type": "paragraph",
          "content": "The link between binomial expansions and probabilities is that each trial (success or failure) is like picking either the $a$ term or the $b$ term in $(a+b)^n$. The coefficients $\\binom{n}{r}$ tell us how many ways a certain arrangement can happen, and the powers of $p$ and $(1-p)$ track the probabilities of successes and failures. That’s why the binomial theorem shows up in probability formulas automatically!"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": "If this feels confusing right now, that’s completely okay! You’ll study the binomial distribution in detail later. For now, just remember: "
    }, 
    {
      "type":"bold-paragraph", 
      "content":"The same coefficients from Pascal’s triangle also count the number of ways successes can happen in probability problems."
    }
  ]
}



], 
  "collection":"edx-1-maths"

}


const whatAreVectors = {
   "_id": "000",
  "slug": "what-are-vectors",
  "title": "What are Vectors",
  "next": "brackets-and-large-powers",
  "parts": [{
  "id": 1,
  "title": "Introducing Vectors",
  "blocks": [
    {
      "type": "paragraph",
      "content": "In mathematics and science, we often deal with quantities. Some quantities only have size (like mass, temperature, or distance). These are called scalars. But many important quantities have both a size and a direction. These are called vectors."
    },
    {
      "type": "bold-paragraph",
      "content": "So a vector is simply a quantity that has both magnitude (which you can think of as size or length) and direction."
    },
    {
      "type": "paragraph",
      "content": "Vectors are important because they are used to describe many real-world situations: velocity and acceleration in physics, forces acting on objects, displacement in geometry, and even more advanced applications in engineering, navigation, and computer graphics."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Representing Vectors"
    },
    {
      "type": "paragraph",
      "content": "We often represent a vector as adirected line segment."
    },
    {
      "type":"bold-paragraph", 
      "content":" This means we draw an arrow from one point to another: the tail of the arrow is where the vector starts, and the tip of the arrow shows the direction."
    },
    {
      "type": "image",
      "url": "/Images/vectorRS.png",
      "alt": "Arrow pointing from P to Q representing vector RS",
      "caption": "A vector starting at R and ending at S is written as $\\overrightarrow{RS}$."
    },
    {
      "type": "paragraph",
      "content": "For example, if a vector starts at point $R$ and ends at point $S$, we write it as $\\overrightarrow{RS}$. The arrow shows the direction of the vector, and its magnitude (size) is simply the distance between $R$ and $S$."
    },
    {
      "type": "paragraph",
      "content": "If instead the vector starts at $S$ and ends at $R$, we write it as $\\overrightarrow{SR}$. Notice that this is the same distance (so the same magnitude), but the direction is reversed."
    },
    {
      "type": "image",
      "url": "/Images/vectorSR.png",
      "alt": "Arrow pointing from S to R representing vector SR",
      "caption": "A vector starting at S and ending at R is written as $\\overrightarrow{SR}$."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Notation Using Bold Letters"
    },
    {
      "type": "paragraph",
      "content": "Sometimes, instead of writing $\\overrightarrow{RS}$, we use bold lowercase letters to represent vectors. For example, the vector $\\mathbf{a}$ might represent the same vector as $\\overrightarrow{RS}$."
    },
    {
      "type": "image",
      "url": "/Images/vectorRS-bolda.png",
      "alt": "Image showing a vector labeled with bold letter a",
      "caption": "The vector $\\mathbf{a}$ shown as a directed arrow."
    },
    {
      "type": "paragraph",
      "content": "Both $\\overrightarrow{RS}$ and $\\mathbf{a}$ mean the same thing — they represent a vector with some magnitude and a direction. It just depends on the context which notation is more convenient."
    },
  

  ]
},
{
  "id": 2,
  "title": "Equal and Parallel Vectors",
  "blocks": [
    {
      "type": "paragraph",
      "content": "Now that we know what vectors are, let’s look at what it means for vectors to be equal and what it means for them to be parallel."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Equal Vectors"
    },
    {
      "type": "bold-paragraph",
      "content": "Two vectors are equal if they have the same magnitude (length) and the same direction. This means that even if they are drawn in different positions in space, they represent the same vector as long as their length and direction match."
    },
    {
      "type": "image",
      "url": "/Images/PQequalRS.png",
      "alt": "Two directed line segments PQ and RS shown as equal in length and direction"
    },
    {
      "type": "paragraph",
      "content": "For example, if $\\overrightarrow{PQ}$ and $\\overrightarrow{RS}$ both point in the same direction and are the same length, then $\\overrightarrow{PQ} = \\overrightarrow{RS}$ despite them being drawn in different positions in space."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Opposite Vectors"
    },
    {
      "type": "paragraph",
      "content": "Sometimes we may have two vectors with the same magnitude but opposite direction. In this case, one vector is the negative of the other. For instance, $\\overrightarrow{AB} = -\\overrightarrow{BA}$."
    },
    {
      "type": "image",
      "url": "/Images/EqualOppositeVectors.png",
      "alt": "Vector AB and vector BA shown with opposite directions but equal lengths"
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Parallel Vectors"
    },
    {
      "type": "paragraph",
      "content": "Two vectors are parallel if they lie along the same line or along lines that never meet, and they point in the same or opposite directions. Parallel vectors do not need to be the same length—they just need to have the same line of action."
    },
    {
      "type": "paragraph",
      "content": "For example, $\\vec{a}$ and $ \\frac{1}{2}\\vec{a}$ are parallel, because they point in the same direction, but $\\vec{a}$ is 2 times as long. Similarly, $-\\vec{a}$ is also parallel to $\\vec{a}$, but it points in the opposite direction."
    },
    {
      "type": "image",
      "url": "/Images/parallelVectors.png",
      "alt": "Vector a,  1/2a, -a  shown parallel in the same direction, and -a shown parallel but in the opposite direction"
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Scalars and Parallel Vectors"
    },
    {
      "type": "paragraph",
      "content": "The reason vectors can be parallel is because we can multiply a vector by a scalar (a real number). If $\\vec{a}$ is a vector, then $\\lambda\\vec{a}$ (where $\\lambda$ is a scalar) is a vector that is parallel to $\\vec{a}$."
    },
    {
      "type": "bullet-points",
      "points": [
        "If $\\lambda > 0$, the vector has the same direction but a different length.",
        "If $0 < \\lambda < 1$, the vector is shorter but still in the same direction.",
        "If $\\lambda < 0$, the vector points in the opposite direction."
      ]
    },
    {
      "type": "bold-paragraph",
      "content": "In general any vector parallel to $\\vec{a}$ can be written as $\\lambda \\vec{a}$ for some scalar $\\lambda$."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Examples"
    },
     {
      "type": "accordion",
      "title": "Example 1 (Easy)",
      "children": [
        {
          "type": "paragraph",
          "content": "If $\\overrightarrow{PQ}$ has the same length and direction as $\\overrightarrow{RS}$, what can you say about the two vectors?"
        },
        {
          "type": "paragraph",
          "content": "**Answer:** $\\overrightarrow{PQ} = \\overrightarrow{RS}$ because they are equal in both magnitude and direction."
        }
      ]
    },

    {
      "type": "accordion",
      "title": "Suppose $\\vec{u} = -3\\vec{v}$ and $\\vec{w} = 2\\vec{v}$. Prove that $\\vec{u}$ and $\\vec{w}$ are parallel",
      "children": [
       
        {
          "type": "paragraph",
          "content": "Remember we stated that e show one is a scalar multiple of the other. From $\\vec{w} = 2\\vec{v}$ we have $\\vec{v} = \\tfrac{1}{2}\\vec{w}$. Substitute into $\\vec{u} = -3\\vec{v}$ to get $$\\vec{u} = -3\\left(\\tfrac{1}{2}\\vec{w}\\right) = -\\tfrac{3}{2}\\vec{w}.$$ Since $\\vec{u}$ is a scalar multiple of $\\vec{w}$, the vectors are parallel (and the negative scalar shows they point in opposite directions)."
        }
      ]
    }
   
  ]
}

], 
  "collection":"edx-1-maths"
}




const whatIsIntegration = {
"_id": { "$oid": "67f51666c446bf93515666c5" },
"slug": "what-is-integration",
"title": "What is Integration?",
"next": "",
"parts": [
{
"id": 1,
"title": "What is integration?",
"blocks": [
{
"type": "paragraph",
"content": "Integration is the reverse process of differentiation. When we differentiate a function, we work out its rate of change. When we integrate a derivative, we work backwards to recover a function that could have produced that derivative."
},
{
"type": "paragraph",
"content": "Think of differentiation as a set of rules that send a function to its gradient function. Integration runs those rules in reverse: starting from a gradient function, we rebuild an original function that would differentiate to it."
},
{
"type": "image",
"url": "/images/placeholder",
"alt": "Side-by-side flow showing the power rule for differentiation (multiply by the power then subtract one) and the reverse steps for integration (add one to the power then divide by the new power).",
"caption": "Differentiating vs. integrating power functions (reverse processes)."
},
{
"type": "paragraph",
"content": "Read the diagram from left to right for differentiation and from right to left for integration. For powers of $x$, differentiation multiplies by the power and lowers the power by $1$; therefore, to reverse this, integration raises the power by $1$ and then divides by the new power."
},
{
"type": "bold-paragraph",
"content": "Important for now: we will not introduce special symbols or any extra constants yet—that comes later. For the moment, hold on to the idea that integration simply undoes differentiation."
}
]
},

{
  "id": 2,
  "title": "Rules of integration",
  "blocks": [
    {
      "type": "paragraph",
      "content": "Because integration reverses differentiation, we can write practical rules that mirror the power rule. If $x^n$ differentiates to $nx^{n-1}$ (for $n\\neq 0$), then reversing this tells us how to integrate powers of $x$."
    },
    {
      "type": "heading",
      "level": "4",
      "content": "Core power rule (no constant yet)"
    },
    {
      "type": "paragraph",
      "content": "If the derivative of a function is $x^n$ with $n\\neq -1$, then one antiderivative is $\\dfrac{x^{n+1}}{n+1}$. In words: **add one to the power, divide by the new power.**"
    },
    {
      "type": "image",
      "url": "/images/placeholder",
      "alt": "Arrow diagram like Image 2: several different quadratics (e.g., y = x^2 + 5, y = x^2, y = x^2 - 19) all differentiate to dy/dx = 2x, and integrating 2x returns y = x^2 + (constant not shown).",
      "caption": "A worked flow: differentiate to get a simple power of $x$, then integrate back by reversing the steps."
    },
    {
      "type": "heading",
      "level": "4",
      "content": "Including a number in front"
    },
    {
      "type": "paragraph",
      "content": "Differentiation respects constant multiples: $\\dfrac{d}{dx}(k\\,x^{n+1}) = k(n+1)x^n$. Reversing this, when we integrate a multiple of a power, we carry the constant through unchanged before applying the add-one/divide rule."
    },
    {
      "type": "heading",
      "level": "4",
      "content": "Examples"
    },
    {
      "type": "bold-paragraph",
      "content": "Example 1"
    },
    {
      "type": "paragraph",
      "content": "Integrate $5x^3$. Add one to the power: $x^4$. Divide by the new power: $\\dfrac{5x^4}{4}$. (No extra constant yet.)"
    },
    {
      "type": "bold-paragraph",
      "content": "Example 2 (a little trickier)"
    },
    {
      "type": "paragraph",
      "content": "Integrate $12x^{-\\tfrac{3}{2}}$. Add one to the power: $-\\tfrac{1}{2}$. Divide by the new power: $\\dfrac{12x^{-1/2}}{-1/2} = -24x^{-1/2} = -\\dfrac{24}{\\sqrt{x}}$. (Again, we will handle the extra constant later.)"
    }
  ]
},

{
  "id": 3,
  "title": "The constant of integration",
  "blocks": [
    {
      "type": "paragraph",
      "content": "From differentiation you may remember: differentiating removes constant terms. Functions that differ only by a constant—like $y=x^2+5$ and $y=x^2-10$—have identical derivatives."
    },
    {
      "type": "paragraph",
      "content": "For instance, let $f(x)=5x^2+3$ and $g(x)=5x^2-5$. Then $f'(x)=10x$ and $g'(x)=10x$. Different originals, **same** derivative."
    },
    {
      "type": "paragraph",
      "content": "This creates a problem when we integrate: starting from $10x$, we cannot tell whether the original was $5x^2+3$, or $5x^2-5$, or $5x^2+1000$, and so on."
    },
    {
      "type": "paragraph",
      "content": "To capture *all* possibilities, when we integrate we include an arbitrary constant **$+c$**. It stands for the constant that may have been lost during differentiation."
    },
    {
      "type": "image",
      "url": "/images/placeholder",
      "alt": "Family of curves, e.g., y = x^3 − 2, y = x^3 + 2, y = x^3 + 8, all vertical shifts of the same shape; an arrow indicates they all have the same derivative y' = 3x^2.",
      "caption": "A family of functions: vertically shifted graphs share the same derivative."
    },
    {
      "type": "paragraph",
      "content": "Curves that differ only by a constant form a *family of functions*. Each member is a vertical shift of the others, but all have the same gradient function. Integration returns the whole family at once via $+c$."
    },
    {
      "type": "heading",
      "level": "4",
      "content": "Rules (now including the constant)"
    },
    {
      "type": "paragraph",
      "content": "If $\\dfrac{dy}{dx}=k\\,x^n$, then $$y=\\frac{k}{n+1}x^{n+1}+c,\\quad n\\neq -1.$$"
    },
    {
      "type": "paragraph",
      "content": "Equivalently, if $f'(x)=k\\,x^n$, then $$f(x)=\\frac{k}{n+1}x^{n+1}+c,\\quad n\\neq -1.$$"
    },
    {
      "type": "image",
      "url": "/images/placeholder",
      "alt": "Quick note image: You cannot use the add-one/divide rule when n = −1 because 1/(n+1) would be 1/0 (undefined). Mentions that integrating 1/x needs a different rule covered later.",
      "caption": "Why we exclude $n=-1$ in the power rule."
    },
    {
      "type": "paragraph",
      "content": "Why the restriction $n\\neq -1$? Because then $n+1=0$ and dividing by $0$ is undefined. (The case of $\\dfrac{1}{x}$ uses a different rule, covered later.)"
    },
    {
      "type": "heading",
      "level": "4",
      "content": "Examples"
    },
    {
      "type": "bold-paragraph",
      "content": "Example 1"
    },
    {
      "type": "paragraph",
      "content": "Integrate $7x^4$. We get $\\dfrac{7}{5}x^5 + c$."
    },
    {
      "type": "bold-paragraph",
      "content": "Example 2"
    },
    {
      "type": "paragraph",
      "content": "Integrate $-\\dfrac{3}{x^{2}} = -3x^{-2}$. Add one to the power $(-1)$ and divide: $\\dfrac{-3x^{-1}}{-1} = 3x^{-1} = \\dfrac{3}{x} + c$."
    }
  ]
},

{
  "id": 4,
  "title": "Indefinite Integration",
  "blocks": [
    {
      "type": "paragraph",
      "content": "Let’s gather what we’ve learned and give integration its own notation."
    },
    {
      "type": "heading",
      "level": "4",
      "content": "The integration symbol"
    },
    {
      "type": "paragraph",
      "content": "We write integration using the symbol $\\displaystyle \\int$. For powers of $x$, $$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1}+c\\qquad (n\\ne -1).$$"
    },
    {
      "type": "paragraph",
      "content": "The small $dx$ reads “with respect to $x$”. It tells us which variable we are integrating in. Only terms involving that variable change under the integral sign; other variables are treated like constants."
    },
    {
      "type": "heading",
      "level": "4",
      "content": "Examples with notation"
    },
    {
      "type": "bold-paragraph",
      "content": "Example 1"
    },
    {
      "type": "paragraph",
      "content": "$\\displaystyle \\int 4x^2\\,dx = \\tfrac{4}{3}x^3 + c.$"
    },
    {
      "type": "bold-paragraph",
      "content": "Example 2 (which variable?)"
    },
    {
      "type": "paragraph",
      "content": "$\\displaystyle \\int (4x^2 + y)\\,dx = \\tfrac{4}{3}x^3 + yx + c$ because $y$ is a constant with respect to $x$."
    },
    {
      "type": "paragraph",
      "content": "But $\\displaystyle \\int (4x^2 + y)\\,dy = 4x^2y + \\tfrac{1}{2}y^2 + c$ because now $x$ is constant and we integrate with respect to $y$."
    },
    {
      "type": "heading",
      "level": "4",
      "content": "Indefinite integration"
    },
    {
      "type": "paragraph",
      "content": "Everything we’ve done so far is **indefinite integration**—finding an *antiderivative*: a function whose derivative is the given expression. Because many originals differ only by a constant, we include $+c$ to represent the whole family."
    },
    {
      "type": "heading",
      "level": "4",
      "content": "Term-by-term (linear) property"
    },
    {
      "type": "paragraph",
      "content": "Just like differentiation, integration works term by term. For functions $f$ and $g$ and constant $k$, $$\\int (f(x)+g(x))\\,dx = \\int f(x)\\,dx + \\int g(x)\\,dx,\\qquad \\int k\\,f(x)\\,dx = k\\int f(x)\\,dx.$$"
    },
    {
      "type": "heading",
      "level": "4",
      "content": "Final example"
    },
    {
      "type": "paragraph",
      "content": "Integrate $\\displaystyle \\int (6x^3 - 5x + 7)\\,dx$."
    },
    {
      "type": "paragraph",
      "content": "Work term by term: $\\int 6x^3\\,dx = \\tfrac{6}{4}x^4 = \\tfrac{3}{2}x^4$, $\\int (-5x)\\,dx = -\\tfrac{5}{2}x^2$, $\\int 7\\,dx = 7x$. So $$\\int (6x^3 - 5x + 7)\\,dx = \\tfrac{3}{2}x^4 - \\tfrac{5}{2}x^2 + 7x + c.$$"
    }
  ]
}


],
"collection": "edx-maths-1"
}

const identifyingTheFunction = {
  "_id": { "$oid": "67f51666c446bf9351abc001" },
  "slug": "identifying-the-function",
  "title": "Identifying the function",
  "next": "",
  "parts": [
    {
      "id": 1,
      "title": "Introduction",
      "blocks": [
        {
          "type": "paragraph",
          "content": "Up to now, whenever we integrate, we’ve been adding the constant of integration “$+c$”. This constant accounts for any number that may have been lost when differentiating. But how do we actually determine the value of $c$ for a specific curve?"
        },
        {
          "type": "paragraph",
          "content": "For example, if $\\dfrac{dy}{dx}=6x$, then integrating gives $$y=\\int 6x\\,dx=3x^2+c.$$ Without more information, this represents infinitely many curves—each different vertical shift corresponds to a different value of $c$."
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "[A family of parabolas y = 3x^2 + c for several values of c (e.g. c = -4, 0, 3, 7) shown on the same axes to illustrate vertical shifts]",
          "caption": "A family of antiderivatives: $y=3x^2+c$ for different values of $c$."
        },
        {
          "type": "bold-paragraph",
          "content": "Key idea: If we know a single point $(x_0, y_0)$ on the curve (or we know a function value $f(x_0)=k$), then we can substitute it into the antiderivative and solve for $c$. That pins down the unique curve."
        },
        {
          "type": "heading",
          "level": "4",
          "content": "Examples"
        },
        {
          "type": "paragraph",
          "content": "<strong>Example 1 (straightforward):</strong> Suppose $\\dfrac{dy}{dx}=6x$ and the curve passes through $(1,7)$. Then $$y=3x^2+c.$$ Substitute $(x,y)=(1,7)$: $$7=3(1)^2+c\\Rightarrow c=4.$$ So the specific curve is $$\\boxed{y=3x^2+4}.$$"
        },
        {
          "type": "paragraph",
          "content": "<strong>Example 2 (harder algebra):</strong> Let $\\dfrac{dy}{dx}=6x(x-1)(x+2)$. First expand: $(x-1)(x+2)=x^2+x-2$, so $$\\dfrac{dy}{dx}=6\\bigl(x^3+x^2-2x\\bigr)=6x^3+6x^2-12x.$$ Integrate: $$y=\\int (6x^3+6x^2-12x)\\,dx=\\tfrac{6}{4}x^4+\\tfrac{6}{3}x^3-\\tfrac{12}{2}x^2+c=\\tfrac{3}{2}x^4+2x^3-6x^2+c.$$ If the curve passes through $(1,4)$, substitute to get $$4=\\tfrac{3}{2}(1)^4+2(1)^3-6(1)^2+c=\\tfrac{3}{2}+2-6+c= -\\tfrac{5}{2}+c,$$ hence $$c=4+\\tfrac{5}{2}=\\tfrac{13}{2}.$$ Therefore $$\\boxed{y=\\tfrac{3}{2}x^4+2x^3-6x^2+\\tfrac{13}{2}}.$$"
        },
        {
          "type": "paragraph",
          "content": "<strong>Example 3 (using a function value $f(x)=k$):</strong> Let $\\dfrac{dy}{dx}=2x-5$, so $$y=\\int (2x-5)\\,dx=x^2-5x+c.$$ If we’re told that $f(3)=k$ with $k=1$, then $$1=3^2-5\\cdot 3+c=9-15+c=-6+c\\Rightarrow c=7.$$ Hence $$\\boxed{y=x^2-5x+7}.$$"
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "[Graph of the three final curves from Examples 1–3, each labelled at the given point to show how the point fixes the value of c]",
          "caption": "Knowing one point on the curve determines $c$ and hence the unique antiderivative."
        }
      ]
    },
    {
      "id": 2,
      "title": "Practice, Practice, Practice",
      "blocks": [
        {
          "type": "paragraph",
          "content": "In general, to determine the constant of integration $c$ and fully identify the antiderivative, follow this simple procedure:"
        },
        {
          "type": "bullet-points",
          "points": [
            "1) <strong>Integrate the function.</strong> Find a general antiderivative $F(x)$ so that $F'(x)$ equals the given derivative.",
            "2) <strong>Substitute known information.</strong> Plug a known point $(x_0,y_0)$ or a value like $f(x_0)=k$ into $F(x)$.",
            "3) <strong>Solve for $c$.</strong> The substitution gives an equation in $c$; solve it to pin down the unique curve."
          ]
        },
        {
          "type": "heading",
          "level": "4",
          "content": "Final warm-up example"
        },
        {
          "type": "paragraph",
          "content": "Suppose, after integrating, you arrive at $$F(x)=(x+c)^2,$$ where <em>$c$ is stated to be a positive constant</em>. If the condition is $$F(1)=9,$$ then substituting gives $$(1+c)^2=9.$$ This quadratic in $c$ has two algebraic solutions: $$c=2\\quad \\text{or}\\quad c=-4.$$"
        },
        {
          "type": "bold-paragraph",
          "content": "But since the question specifies that $c>0$, we must take $\\,\\boxed{c=2}$. Therefore, the identified function is $$\\boxed{F(x)=(x+2)^2}.$$"
        },
        {
          "type": "paragraph",
          "content": "Great job—now you’ve seen how a single point (or function value) lets you determine the exact antiderivative. What are you waiting for? Time to practice—work through the tasks next!"
        }
      ]
    }
  ],
  "collection": "edx-maths-1"
}

const definiteIntegrals = {
  "_id": { "$oid": "67f51666c446bf93515666c4" },
  "slug": "definite-integrals",
  "title": "Definite Integrals",
  "next": "fundamental-theorem-of-calculus",
  "parts": [
    {
      "id": 1,
      "title": "An Introduction to Definite Integrals",
      "blocks": [
        {
          "type": "paragraph",
          "content": "Up to now, our integrals have been indefinite. An indefinite integral returns a function — the whole family of antiderivatives — written with a constant of integration $+C$."
        },
        {
          "type": "paragraph",
          "content": "In this part we meet definite integrals. A definite integral returns a number. Geometrically (for curves above the x-axis), it gives the total area between the curve and the x-axis from $x=a$ to $x=b$."
        },
        {
          "type": "bold-paragraph",
          "content": "A definite integral looks like $$\\int_a^b f(x)\\,dx$$ and represents the accumulated area between $y=f(x)$ and the x-axis on $[a,b]$."
        },
        {
          "type": "table",
          "header": ["Type", "Input", "Output", "Example"],
          "rows": [
            ["Indefinite", "Function $f(x)$", "Function $F(x)+C$", "$\\int 3x^2\\,dx=x^3+C$"],
            ["Definite", "Function $f(x)$ with limits $[a,b]$", "Number (area)", "$\\int_1^2 3x^2\\,dx=7$"]
          ]
        },
        {
          "type": "heading",
          "level": "4",
          "content": "How to compute a definite integral"
        },
        {
          "type": "paragraph",
          "content": "Example: compute $$\\int_a^b 4x^2\\,dx$$."
        },
        {
          "type": "bullet-points",
          "points": [
            "Step 1: Find an antiderivative. One is $\\tfrac{4}{3}x^3$. Write it with limits: $$\\Big[\\tfrac{4}{3}x^3\\Big]_a^b$$.",
            "Step 2: Evaluate at the limits. $$\\Big[\\tfrac{4}{3}x^3\\Big]_a^b=\\tfrac{4}{3}b^3-\\tfrac{4}{3}a^3$$.",
            "Step 3: That value is the final answer — a single number."
          ]
        },
        {
          "type": "paragraph",
          "content": "With specific limits, $$\\int_1^2 4x^2\\,dx=\\Big[\\tfrac{4}{3}x^3\\Big]_1^2=\\tfrac{4}{3}(8-1)=\\tfrac{28}{3}\\approx9.33.$$"
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "Sketch of y=4x^2 with the region between x=1 and x=2 shaded above the x-axis",
          "caption": "The definite integral $$\\int_1^2 4x^2\\,dx$$ equals the shaded area."
        },
        {
          "type": "heading",
          "level": "4",
          "content": "Another quick example"
        },
        {
          "type": "paragraph",
          "content": "Compute $$\\int_1^2 2x\\,dx=[x^2]_1^2=4-1=3$$. (For comparison, if the function were $4x$ then $$\\int_1^2 4x\\,dx=[2x^2]_1^2=6$$.)"
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "Sketch of y=2x with region between x=1 and x=2 shaded",
          "caption": "The definite integral $$\\int_1^2 2x\\,dx$$ equals the shaded area."
        }
      ]
    },
    {
      "id": 2,
      "title": "The Fundamental Theorem of Calculus",
      "blocks": [
        {
          "type": "paragraph",
          "content": "The Fundamental Theorem of Calculus (FTC) links differentiation and integration. It tells us that finding areas (integration) and finding gradients (differentiation) are inverse processes."
        },
        {
          "type": "bold-paragraph",
          "content": "If $f'(x)$ is the derivative of $f(x)$ on $[a,b]$, then $$\\int_a^b f'(x)\\,dx=f(b)-f(a).$$"
        },
        {
          "type": "paragraph",
          "content": "Plain meaning: $f'(x)$ gives the instantaneous rate of change of $f$. Adding up (integrating) those tiny changes from $a$ to $b$ gives the total change in $f$ over the interval — namely $f(b)-f(a)$."
        },
        {
          "type": "heading",
          "level": "4",
          "content": "Example"
        },
        {
          "type": "paragraph",
          "content": "Let $f(x)=x^3$. Then $f'(x)=3x^2$. By the FTC, $$\\int_1^2 3x^2\\,dx=f(2)-f(1)=8-1=7.$$"
        }
      ]
    },
    {
      "id": 3,
      "title": "Integration Undoes Differentiation",
      "blocks": [
        {
          "type": "paragraph",
          "content": "Recall the FTC: $$\\int_a^b f'(x)\\,dx=f(b)-f(a).$$"
        },
        {
          "type": "paragraph",
          "content": "This shows that integration undoes differentiation. If you know the rate of change $f'(x)$, then integrating it from $a$ to $b$ adds up those tiny changes to give the exact total change in $f$ across $[a,b]$."
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "Annotated formula showing (1) f'(x) is rate of change, (2) integrate from a to b, (3) result equals f(b)-f(a)",
          "caption": "Schematic of the FTC linking rate of change to total change."
        },
        {
          "type": "bullet-points",
          "points": [
            "(1) $f'(x)$ is the rate of change (gradient) of $f$ at $x$.",
            "(2) $\\int_a^b f'(x)\\,dx$ accumulates these rates from $a$ to $b$.",
            "(3) The accumulation equals the exact total change: $f(b)-f(a)$."
          ]
        },
        {
          "type": "heading",
          "level": "4",
          "content": "Example"
        },
        {
          "type": "paragraph",
          "content": "Let $f(x)=x^3+2x$. Then $f'(x)=3x^2+2$. By the FTC, $$\\int_0^1 (3x^2+2)\\,dx=f(1)-f(0)=(1+2)-(0)=3.$$"
        }
      ]
    },
    {
      "id": 4,
      "title": "Differentiation Undoes Integration",
      "blocks": [
        {
          "type": "paragraph",
          "content": "We have seen how integrating a derivative gives the change in the original function. The reverse is also true: differentiation undoes integration."
        },
        {
          "type": "paragraph",
          "content": "Let $$F(x)=\\int_a^x g(t)\\,dt$$. Think of $F(x)$ as adding up the contributions $g(t)\\,dt$ from $t=a$ to $t=x$. If we nudge $x$ forward by a tiny amount $\\Delta x$, then:"
        },
        {
          "type": "bullet-points",
          "points": [
            "1) $F(x+\\Delta x)-F(x)=\\int_x^{x+\\Delta x} g(t)\\,dt$.",
            "2) Over the very short interval $[x,x+\\Delta x]$, $g(t)\\approx g(x)$, so $\\int_x^{x+\\Delta x} g(t)\\,dt\\approx g(x)\\Delta x$.",
            "3) Hence the average rate of change is $$\\frac{F(x+\\Delta x)-F(x)}{\\Delta x}\\approx g(x)$$.",
            "4) Taking the limit $\\Delta x\\to 0$ gives $$F'(x)=g(x)$$."
          ]
        },
        {
          "type": "paragraph",
          "content": "This is just differentiation from first principles applied to an integral. It shows that differentiating an accumulated area recovers the original integrand."
        },
        {
          "type": "heading",
          "level": "4",
          "content": "Examples"
        },
        {
          "type": "paragraph",
          "content": "Let $F(x)=\\int_0^x (4t^2-1)\\,dt$. Then by the result above, $$F'(x)=4x^2-1.$$"
        },
        {
          "type": "paragraph",
          "content": "Let $F(x)=\\int_1^x (3t^2+2t)\\,dt$. Then $$F'(x)=3x^2+2x.$$"
        }
      ]
    }
  ],
  "collection": "edx-maths-1"
}

const integrationAndArea = {
  "_id": { "$oid": "67f51666c446bf93515666c4" },
  "slug": "integration-and-area",
  "title": "Integration and Area",
  "next": "applications-of-integration",
  "parts": [
    {
      "id": 1,
      "title": "A formal introduction to definite integration",
      "blocks": [
        {
          "type": "paragraph",
          "content": "We’ve already practiced evaluating integrals and met the Fundamental Theorem of Calculus (FTC), which tells us that integration is the reverse of differentiation. In this part, we’ll introduce **definite integration**—the kind that produces a number—and connect it rigorously to **area under a curve**."
        },
        {
          "type": "paragraph",
          "content": "When a curve is above the $x$–axis, the area of the region bounded by the curve $y=f(x)$ and the vertical lines $x=a$ and $x=b$ is given by the definite integral $$\\text{Area}=\\int_a^b f(x)\\,dx.$$"
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "A smooth increasing curve y=f(x) with the region between x=a and x=b shaded.",
          "caption": "Area under $y=f(x)$ between $x=a$ and $x=b$"
        },
        {
          "type": "bold-paragraph",
          "content": "Key idea: A definite integral $\\int_a^b f(x)\\,dx$ measures the accumulated effect of the height $f(x)$ across infinitesimal widths $dx$ from $a$ to $b$."
        },
        { "type": "heading", "level": "4", "content": "Examples" },
        {
          "type": "paragraph",
          "content": "1) Find the area under $y=2x$ from $x=0$ to $x=2$. $$\\int_0^2 2x\\,dx=\\left.x^2\\right|_0^2=4.$$"
        },
        {
          "type": "paragraph",
          "content": "2) Find the area under $y=3$ from $x=1$ to $x=5$. $$\\int_1^5 3\\,dx=3(5-1)=12.$$"
        }
      ]
    },
    {
      "id": 2,
      "title": "Integration from first principles",
      "blocks": [
        {
          "type": "paragraph",
          "content": "Let $y=f(x)$ be a positive curve. Define a new function $A(x)$ to be the total area under the curve from a fixed starting point (say $x=0$) up to the vertical line at $x$."
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "Curve y=f(x) with area from 0 to x shaded and labelled A(x).",
          "caption": "Define $A(x)$ as accumulated area up to $x$"
        },
        {
          "type": "paragraph",
          "content": "As $x$ increases, you include more of the region, so $A(x)$ increases."
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "Same diagram with the vertical line moved right showing larger A(x).",
          "caption": "$A(x)$ grows as $x$ grows"
        },
        {
          "type": "paragraph",
          "content": "Increase $x$ by a tiny amount $\\delta x$. The area grows by $$\\delta A=A(x+\\delta x)-A(x).$$"
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "Thin slice between x and x+δx highlighted, labelled δA.",
          "caption": "The added thin slice has area $\\delta A$"
        },
        {
          "type": "paragraph",
          "content": "For a small but nonzero $\\delta x$, this extra area is **approximately** the area of a rectangle of width $\\delta x$ and height $y=f(x)$, so $$\\delta A\\approx y\\,\\delta x.$$ Rearranging gives $$y\\approx \\frac{\\delta A}{\\delta x}.$$"
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "Zoomed-in rectangle approximation of the thin slice showing width δx and height y=f(x).",
          "caption": "Rectangle approximation of $\\delta A$"
        },
        {
          "type": "paragraph",
          "content": "Why only an approximation? The curve bends slightly over the slice, creating a tiny error that disappears as we shrink the slice."
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "Same slice with the tiny curved-cap error region marked.",
          "caption": "The approximation error vanishes as $\\delta x\\to 0$"
        },
        {
          "type": "paragraph",
          "content": "By definition of the derivative, $$\\frac{dA}{dx}=\\lim_{\\delta x\\to 0}\\frac{A(x+\\delta x)-A(x)}{\\delta x}=\\lim_{\\delta x\\to 0}\\frac{\\delta A}{\\delta x}.$$ Taking the limit turns the approximation into an equality: $$\\frac{dA}{dx}=y=f(x).$$"
        },
        {
          "type": "paragraph",
          "content": "Therefore $$dA=y\\,dx,$$ and integrating from $x=a$ to $x=b$ gives $$A(b)-A(a)=\\int_a^b y\\,dx.$$ In words: **the area under $y=f(x)$ from $a$ to $b$ equals the definite integral**."
        },
        { "type": "heading", "level": "4", "content": "Examples" },
        {
          "type": "paragraph",
          "content": "1) If $A(x)=\\int_0^x (x^2+1)\\,dx$, then $\\dfrac{dA}{dx}=x^2+1=f(x)$ by the argument above."
        },
        {
          "type": "paragraph",
          "content": "2) Using the definition, the area under $y=x^2$ from $x=0$ to $x=3$ is $$\\int_0^3 x^2\\,dx=\\left.\\frac{x^3}{3}\\right|_0^3=9.$$"
        }
      ]
    },
    {
      "id": 3,
      "title": "Areas under the curve",
      "blocks": [
        {
          "type": "paragraph",
          "content": "From the previous part we obtained: $$\\text{Area between }x=a\\text{ and }x=b\\text{ under }y=f(x)\\text{ (with }f(x)\\ge 0\\text{)}=\\int_a^b f(x)\\,dx.$$"
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "Standard area-under-curve picture with vertical bounds x=a and x=b shaded.",
          "caption": "Compute area via $\\int_a^b f(x)\\,dx$"
        },
        { "type": "heading", "level": "4", "content": "Examples" },
        {
          "type": "paragraph",
          "content": "1) Area under $y=4-2x$ from $x=0$ to $x=1$: $$\\int_0^1 (4-2x)\\,dx=\\left.\\big(4x-x^2\\big)\\right|_0^1=4-1=3.$$"
        },
        {
          "type": "paragraph",
          "content": "2) Area under $y=\\sin x$ from $x=0$ to $x=\\pi$: $$\\int_0^{\\pi}\\sin x\\,dx=\\left.-\\cos x\\right|_0^{\\pi}=(-\\cos\\pi)-(-\\cos 0)=1+1=2.$$"
        }
      ]
    }
  ],
  "collection": "edx-maths-1"
}

const integrationAreaProblems = {
  "slug": "integration-area-problems",
  "title": "Area Problems",
  "next": "",
  "parts": [
    {
      "id": 1,
      "title": "Areas beneath the x-axis",
      "blocks": [
        {
          "type": "paragraph",
          "content": "In the last lesson we learnt that the area under a curve between the vertical lines $x=a$ and $x=b$ is found using the definite integral."
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "A curve $y=f(x)$ above the x-axis with the region between $x=a$ and $x=b$ shaded",
          "caption": "Area of a region above the x-axis."
        },
        {
          "type": "paragraph",
          "content": "$$\\text{Area}=\\int_a^b y\\,dx=\\int_a^b f(x)\\,dx.$$"
        },
        {
          "type": "paragraph",
          "content": "So far we have only found areas above the x-axis, like the picture above. But what about when the region is below the x-axis?"
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "A curve dipping below the x-axis with the region between $x=a$ and $x=b$ shaded beneath the axis",
          "caption": "Here the region lies below the x-axis."
        },
        {
          "type": "bold-paragraph",
          "content": "When the bounded region lies below the x-axis, the definite integral $\\int y\\,dx$ evaluates to a **negative** number. The geometric area is the **positive magnitude** of that value."
        },
        {
          "type": "paragraph",
          "content": "Let’s see this with an example."
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "Graph of the parabola $y=(x-2)^2-4$ with the region between $x=0$ and $x=4$ shaded below the x-axis",
          "caption": "Example region below the x-axis."
        },
        {
          "type": "paragraph",
          "content": "Consider the curve $y=(x-2)^2-4$. Between $x=0$ and $x=4$ the curve lies below the x-axis. Compute:"
        },
        {
          "type": "paragraph",
          "content": "$$\\int_{0}^{4}\\big((x-2)^2-4\\big)\\,dx=\\int_{0}^{4}(x^2-4x)\\,dx.$$"
        },
        {
          "type": "paragraph",
          "content": "$$\\begin{aligned}\n\\int (x^2-4x)\\,dx&=\\tfrac{x^3}{3}-2x^2,\\\\\n\\left[\\tfrac{x^3}{3}-2x^2\\right]_0^4&=\\left(\\tfrac{64}{3}-32\\right)-0=-\\tfrac{32}{3}.\n\\end{aligned}$$"
        },
        {
          "type": "paragraph",
          "content": "The integral is negative, so the area of the shaded region is the positive value $$\\boxed{\\tfrac{32}{3}}\\text{ square units}.$$"
        },
        {
          "type": "paragraph",
          "content": "You don’t need a new method: integrate as usual, then take the positive magnitude when the region lies below the x-axis."
        },
        {
          "type": "accordion",
          "title": "Why do negatives appear below the x-axis?",
          "children": [
            {
              "type": "paragraph",
              "content": "A definite integral adds up signed areas. Where $f(x)>0$ (above the axis), small strips have positive contribution $+f(x)\\,dx$; where $f(x)<0$ (below the axis), the strips contribute $-|f(x)|\\,dx$. Hence regions below the x-axis make the integral decrease."
            },
            {
              "type": "image",
              "url": "/images/placeholder",
              "alt": "Two small rectangular strips: one above the x-axis labelled +f(x)dx; one below the x-axis labelled -|f(x)|dx",
              "caption": "Definite integrals accumulate signed (not absolute) area."
            }
          ]
        },
        {
          "type": "heading",
          "level": 4,
          "content": "Example summary"
        },
        {
          "type": "paragraph",
          "content": "For $y=(x-2)^2-4$ on $[0,4]$: integral $=-\\tfrac{32}{3}$, geometric area $=\\tfrac{32}{3}$."
        }
      ]
    }, 
    {
  "id": 2,
  "title": "Straddling Curves",
  "blocks": [
    {
      "type": "paragraph",
      "content": "What if the curve crosses the x-axis within the interval? Then part of the region is above (positive contribution) and part is below (negative contribution)."
    },
    {
      "type": "image",
      "url": "/images/placeholder",
      "alt": "A wave-like curve crossing the x-axis twice with the positive lobe and negative lobe shaded",
      "caption": "A curve that straddles the x-axis."
    },
    {
      "type": "paragraph",
      "content": "Strategy: split the interval at the x-intercepts (roots), integrate each piece, take magnitudes for geometric areas, then add."
    },
    {
      "type": "paragraph",
      "content": "Example: $$y=x^3+x^2-6x=x(x+3)(x-2).$$ The x-intercepts are $x=-3,0,2$."
    },
    {
      "type": "image",
      "url": "/images/placeholder",
      "alt": "Sketch of y = x^3 + x^2 - 6x with roots at x = -3, 0, 2 and the lobes shaded",
      "caption": "Positive lobe on $[-3,0]$, negative lobe on $[0,2]$."
    },
    {
      "type": "paragraph",
      "content": "Positive area: $$A_+=\\int_{-3}^{0}\\big(x^3+x^2-6x\\big)\\,dx=\\left[\\tfrac{x^4}{4}+\\tfrac{x^3}{3}-3x^2\\right]_{-3}^{0}=\\tfrac{63}{4}.$$"
    },
    {
      "type": "paragraph",
      "content": "Negative area (magnitude): $$A_- =\\left\\lvert\\int_{0}^{2}\\big(x^3+x^2-6x\\big)\\,dx\\right\\rvert=\\left\\lvert\\left[\\tfrac{x^4}{4}+\\tfrac{x^3}{3}-3x^2\\right]_{0}^{2}\\right\\rvert=\\left\\lvert-\\tfrac{16}{3}\\right\\rvert=\\tfrac{16}{3}.$$"
    },
    {
      "type": "paragraph",
      "content": "Total geometric area: $$A=A_+ + A_- = \\tfrac{63}{4}+\\tfrac{16}{3}=\\boxed{\\tfrac{253}{12}}.$$"
    },
    {
      "type": "bold-paragraph",
      "content": "General rule when a curve straddles the x-axis: split at the roots, **sum areas above the axis** and **add the magnitudes** of areas below the axis."
    },
    {
      "type": "paragraph",
      "content": "In exam questions without a provided sketch, first draw one: locate roots by solving $f(x)=0$, decide where the curve is above/below the axis, and choose the correct limits before integrating."
    },
    {
      "type": "heading",
      "level": 4,
      "content": "Quick example recap"
    },
    {
      "type": "paragraph",
      "content": "For $y=x^3+x^2-6x$: areas on $[-3,0]$ and $[0,2]$ give $A=\\tfrac{253}{12}$ square units."
    
  }
]
},
{
  "id": 3,
  "title": "Curves and Lines",
  "blocks": [
    {
      "type": "paragraph",
      "content": "Now let’s find areas bounded by curves and straight lines. No new rules are needed—just careful splitting and, at times, subtracting/adding areas of familiar shapes."
    },
    {
      "type": "paragraph",
      "content": "We’ll occasionally combine integrals with areas of triangles, rectangles, and trapezia."
    },

    { "type": "heading", "level": 4, "content": "Triangle" },
    {
      "type": "image",
      "url": "/images/placeholder",
      "alt": "Triangle with base b and height h_b dropped perpendicularly to the base",
      "caption": "Triangle with base and perpendicular height."
    },
    {
      "type": "paragraph",
      "content": "$$\\text{Area}=\\tfrac{1}{2}\\times\\text{base}\\times\\text{height}.$$"
    },

    { "type": "heading", "level": 4, "content": "Squares/Rectangles" },
    {
      "type": "image",
      "url": "/images/placeholder",
      "alt": "One rectangle and one square labelled with their side lengths",
      "caption": "Rectangle/square with labelled sides."
    },
    {
      "type": "paragraph",
      "content": "$$\\text{Area}=\\text{length}\\times\\text{width}.$$"
    },

    { "type": "heading", "level": 4, "content": "Trapezium" },
    {
      "type": "image",
      "url": "/images/placeholder",
      "alt": "Trapezium with parallel sides a and b and height h marked",
      "caption": "Trapezium with parallel sides a, b and height h."
    },
    {
      "type": "paragraph",
      "content": "$$\\text{Area}=\\dfrac{a+b}{2}\\times h\\quad\\text{(where $a,b$ are the parallel sides).}$$"
    },

    { "type": "heading", "level": 4, "content": "Example 1 — Curve vs Line (with sketch)" },
    {
      "type": "image",
      "url": "/images/placeholder",
      "alt": "Region bounded by y = x + 2 and y = x^2 between their intersections",
      "caption": "Find the area between the line and the parabola."
    },
    {
      "type": "paragraph",
      "content": "Intersections: solve $x^2=x+2 \\Rightarrow x^2-x-2=0 \\Rightarrow x=-1,2$. On $[-1,2]$, the line $y=x+2$ is above the parabola $y=x^2$."
    },
    {
      "type": "paragraph",
      "content": "$$\\text{Area}=\\int_{-1}^{2}\\big[(x+2)-x^2\\big]dx=\\left[-\\tfrac{x^3}{3}+\\tfrac{x^2}{2}+2x\\right]_{-1}^{2}=\\boxed{\\tfrac{9}{2}}.$$"
    },

    { "type": "heading", "level": 4, "content": "Example 2 — Curve vs Horizontal Line (with sketch)" },
    {
      "type": "image",
      "url": "/images/placeholder",
      "alt": "Region between the parabola y = 4 - x^2 and the horizontal line y = 1, bounded between their intersection points",
      "caption": "Find the area between the parabola and the line."
    },
    {
      "type": "paragraph",
      "content": "Intersections where $4-x^2=1 \\Rightarrow x=\\pm\\sqrt{3}$. The parabola is above the line on $[-\\sqrt{3},\\sqrt{3}]$."
    },
    {
      "type": "paragraph",
      "content": "$$\\text{Area}=\\int_{-\\sqrt{3}}^{\\sqrt{3}}\\big[(4-x^2)-1\\big]dx=\\int_{-\\sqrt{3}}^{\\sqrt{3}}(3-x^2)dx=\\boxed{4\\sqrt{3}}.$$"
    },

    { "type": "heading", "level": 4, "content": "Example 3 — No sketch provided (you must sketch first!)" },
    {
      "type": "paragraph",
      "content": "Find the area of the finite region bounded by the parabola $y=x^2-4x+3$ and the line $y=x-1$."
    },
    {
      "type": "paragraph",
      "content": "Sketch both graphs. Intersections satisfy $x^2-4x+3=x-1 \\Rightarrow x^2-5x+4=0 \\Rightarrow x=1,4$. On $[1,4]$ the line is above the parabola."
    },
    {
      "type": "paragraph",
      "content": "$$\\text{Area}=\\int_{1}^{4}\\big[(x-1)-(x^2-4x+3)\\big]dx=\\int_{1}^{4}(-x^2+5x-4)dx.$$"
    },
    {
      "type": "paragraph",
      "content": "$$\\left[-\\tfrac{x^3}{3}+\\tfrac{5}{2}x^2-4x\\right]_{1}^{4}=\\left(-\\tfrac{64}{3}+24\\right)-\\left(-\\tfrac{1}{3}+\\tfrac{5}{2}-4\\right)=\\boxed{\\tfrac{9}{2}}\\text{ square units}.$$"
    }
  ]
}


  ],
  "collection": "edx-maths-1"
}

const priorKnowledge = {
"slug": "trig-prior-knowledge",
"title": "Prior Knowledge (Trigonometry)",
"next": "",
"parts": [
{
"id": 1,
"title": "Anatomy of a Right angled Triangle",
"blocks": [
{
"type": "paragraph",
"content": "Before we begin trigonometry, let’s recall some GCSE facts about right-angled triangles and the names of their sides relative to an angle $\\theta$."
},
{
"type": "heading",
"level": 4,
"content": "What is a right-angled triangle?"
},
{
"type": "paragraph",
"content": "A right-angled triangle is a triangle that contains one right angle, i.e. an angle of $90^{\\circ}$. We often mark the right angle with a small square."
},
{
"type": "image",
"url": "/Images/right-angled-triangle.png",
"alt": "[A right-angled triangle with a small square marking the right angle; the other acute angle labelled $\theta$; the three sides highlighted]",
"caption": "[Right-angled triangle with one angle $90^{\\circ}$ and another labelled $\\theta$]"
},
{
"type": "heading",
"level": 4,
"content": "The hypotenuse"
},
{
"type": "paragraph",
"content": "The side opposite the right angle is called the hypotenuse. It is always the longest side of a right-angled triangle. In symbols: the hypotenuse is the side across from the $90^{\\circ}$ angle."
},
{
"type": "heading",
"level": 4,
"content": "Opposite and adjacent (relative to $\\theta$)"
},
{
"type": "paragraph",
"content": "Once we choose an acute angle $\\theta$ (not the right angle), we name the other two sides relative to $\\theta$:"
},
{
"type": "bullet-points",
"points": [
"The opposite side is the side directly across from $\\theta$.",
"The adjacent side is the side next to $\\theta$ (forming $\\theta$ together with the hypotenuse)."
]
},
{
"type": "paragraph",
"content": "Important: “opposite” and “adjacent” depend on which angle $\\theta$ you choose. If you move $\\theta$ to the other acute corner, the opposite and adjacent swap roles."
},
{
"type": "image",
"url": "/Images/different-angle-rh-triangle.png",
"alt": "[Two right-angled triangles sharing the same shape: in the first, $\theta$ at the right-hand corner with sides labelled hypotenuse, opposite, adjacent relative to $\theta$; in the second, $\theta$ at the left-hand corner showing how opposite/adjacent change]",
"caption": "[Opposite and adjacent are named relative to the chosen angle $\theta$]"
},
]
}, 
 {
      "id": 2,
      "title": "Sine, Cos and Tan",
      "blocks": [
        {
          "type": "paragraph",
          "content": "Now that we know the anatomy of a right-angled triangle, it’s time to see how it relates to the trigonometric functions sine, cosine, and tangent."
        },
        {
          "type": "image",
          "url": "/Images/right-angled-triangle.png",
          "alt": "[Right-angled triangle with sides labelled hypotenuse, opposite, adjacent relative to angle $\\theta$]",
          "caption": "[Triangle showing hypotenuse, opposite and adjacent relative to $\\theta$]"
        },
        {
          "type": "heading",
          "level": 4,
          "content": "The three ratios"
        },
        {
          "type": "paragraph",
          "content": "We define the three primary trigonometric functions as ratios of sides in a right-angled triangle:"
        },
        {
          "type": "bullet-points",
          "points": [
            "$$\\sin\\theta = \\tfrac{\\text{opposite}}{\\text{hypotenuse}}$$",
            "$$\\cos\\theta = \\tfrac{\\text{adjacent}}{\\text{hypotenuse}}$$",
            "$$\\tan\\theta = \\tfrac{\\text{opposite}}{\\text{adjacent}}$$"
          ]
        },
        {
          "type": "paragraph",
          "content": "These ratios allow us to link the angle $\\theta$ with the lengths of sides in a right-angled triangle."
        },
        {
          "type": "heading",
          "level": 4,
          "content": "Example: Using trigonometry to find missing sides"
        },
        {
          "type": "paragraph",
          "content": "Suppose we have a right-angled triangle with an angle $\\theta=30^\\circ$ and the adjacent side is $5$ units long. Find the opposite side and the hypotenuse."
        },
        {
          "type": "paragraph",
          "content": "**Step 1: Use tangent to find the opposite side.** \n$$\\tan 30^\\circ = \\tfrac{\\text{opposite}}{5}$$ \nSo $$\\text{opposite} = 5 \\times \\tan 30^\\circ = 5 \\times \\tfrac{1}{\\sqrt{3}} = \\tfrac{5}{\\sqrt{3}}.$$"
        },
        {
          "type": "paragraph",
          "content": "**Step 2: Use Pythagoras’ theorem to find the hypotenuse.** \nWe know: \n$$\\text{hypotenuse}^2 = 5^2 + \\Big(\\tfrac{5}{\\sqrt{3}}\\Big)^2.$$ \nSo \n$$\\text{hypotenuse}^2 = 25 + \\tfrac{25}{3} = \\tfrac{100}{3}.$$ \nThus $$\\text{hypotenuse} = \\tfrac{10}{\\sqrt{3}}.$$"
        },
        {
          "type": "paragraph",
          "content": "So we have found all three sides: \n- Adjacent $=5$, \n- Opposite $=\\tfrac{5}{\\sqrt{3}}$, \n- Hypotenuse $=\\tfrac{10}{\\sqrt{3}}$."
        },
        {
          "type": "accordion",
          "title": "Forgot Pythagoras’ theorem? Read here",
          "children": [
            {
          "type": "image",
          "url": "/Images/pythagoras-theorem.png",
          "alt": "[Right-angled triangle with sides labelled hypotenuse, opposite, adjacent relative to angle $\\theta$]",
          "caption": "[Triangle showing hypotenuse, opposite and adjacent relative to $\\theta$]"
        },
            
            {
              "type": "paragraph",
              "content": "Pythagoras’ theorem is a fundamental result about right-angled triangles. It states that the square of the hypotenuse equals the sum of the squares of the other two sides."
            },
            {
              "type": "paragraph",
              "content": "$$\\text{hypotenuse}^2 = (\\text{opposite})^2 + (\\text{adjacent})^2$$"
            },
            
          ]
        },
        {
          "type": "heading",
          "level": 4,
          "content": "A neat trick: SOH-CAH-TOA"
        },
        {
          "type": "paragraph",
          "content": "To remember the definitions of sine, cosine, and tangent, many students use the mnemonic **SOH-CAH-TOA**:"
        },
        {
          "type": "bullet-points",
          "points": [
            "**S**: $\\sin\\theta = \\tfrac{\\text{Opposite}}{\\text{Hypotenuse}}$",
            "**C**: $\\cos\\theta = \\tfrac{\\text{Adjacent}}{\\text{Hypotenuse}}$",
            "**T**: $\\tan\\theta = \\tfrac{\\text{Opposite}}{\\text{Adjacent}}$"
          ]
        },
        {
          "type": "paragraph",
          "content": "Read as: **SOH (Sine = Opp/Hyp), CAH (Cos = Adj/Hyp), TOA (Tan = Opp/Adj).**"
        }
      ]
    }, 
    {
      "id": 3,
      "title": "Different Types of Triangles",
      "blocks": [
        {
          "type": "paragraph",
          "content": "So far, we’ve focused on right-angled triangles. But there are other types of triangles that we should recall from earlier studies."
        },
        {
          "type": "heading",
          "level": 4,
          "content": "Isosceles triangle"
        },
        {
          "type": "image",
          "url": "/Images/isosceles-triangle.png",
          "alt": "[Isosceles triangle with two equal sides marked and base angles labelled as equal]",
          "caption": "[An isosceles triangle showing two equal sides and equal base angles]"
        },
        {
          "type": "paragraph",
          "content": "An isosceles triangle has two sides of equal length. The angles opposite those equal sides are also equal. For example, if two sides are $5$ units each, then the angles opposite them are the same."
        },
        {
          "type": "heading",
          "level": 4,
          "content": "Equilateral triangle"
        },
        {
          "type": "image",
          "url": "/Images/equilateral-triangle.png",
          "alt": "[Equilateral triangle with all three sides and all three angles marked equal]",
          "caption": "[An equilateral triangle with all sides and angles equal]"
        },
        {
          "type": "paragraph",
          "content": "An equilateral triangle has all three sides equal. Consequently, all three angles are also equal, each measuring $60^{\\circ}$."
        },
        {
          "type": "heading",
          "level": 4,
          "content": "Scalene triangle"
        },
        {
          "type": "image",
          "url": "/Images/scalene-triangle.png",
          "alt": "[Scalene triangle with all three sides of different lengths]",
          "caption": "[A scalene triangle showing three sides of different lengths]"
        },
        {
          "type": "paragraph",
          "content": "A **scalene triangle** has no equal sides and no equal angles. Each side length and angle is different."
        },
        {
          "type": "heading",
          "level": 4,
          "content": "Using right-angled triangles inside other triangles"
        },
        {
          "type": "paragraph",
          "content": "Even if a triangle is not right-angled, we can often solve problems by drawing a line (an altitude or height) to form one or two right-angled triangles inside it. Once we have a right-angled triangle, we can apply our trigonometric rules (SOH-CAH-TOA)."
        },
        {
          "type": "heading",
          "level": 4,
          "content": "Example: Solving a scalene triangle with trigonometry"
        },
        {
          "type": "paragraph",
          "content": "Suppose we have a scalene triangle $ABC$ with vertices at $A(0,0)$, $B(6,0)$, and $C(4,5)$. We want to find the length of side $AC$."
        },
        {
          "type": "image",
          "url": "/Images/different-triangle-types-question.png",
          "alt": "[Scalene triangle with vertices A(0,0), B(6,0), C(4,5). A perpendicular from C dropped onto AB to form a right-angled triangle]",
          "caption": "[Triangle $ABC$ with coordinates $A(0,0)$, $B(6,0)$, $C(4,5)$. A perpendicular is drawn from $C$ to meet $AB$ at point $D$, forming a right-angled triangle $ADC$. Angle at $A$ is given as $53^\\circ$. Find $AC$ using trigonometry and Pythagoras.]"
        },
        {
          "type": "accordion",
          "title": "Solution",
          "children": [
            {
          "type": "image",
          "url": "/Images/pythagoras-theorem.png",
          "alt": "[Right-angled triangle with sides labelled hypotenuse, opposite, adjacent relative to angle $\\theta$]",
          "caption": "[Triangle showing hypotenuse, opposite and adjacent relative to $\\theta$]"
        },
        {
          "type": "paragraph",
          "content": " Draw a perpendicular from $C$ to $AB$, meeting it at point $D$. Now $ADC$ is a right-angled triangle. Using $\\tan 53^\\circ = \\tfrac{CD}{AD}$, we can find $CD$. Then apply Pythagoras’ theorem in $\\triangle ADC$ to find $AC$."
        },
        {
          "type":'bullet-points', 
          "points":["1) First start by drawing a perpendicular line from $C$ to $AB$, meeting it at the point $D=(4,0)$. Now $ADC$ is a right-angled triangle"]
        },
        {
           "type": "image",
          "url": "/Images/pythagoras-theorem.png",
          "alt": "[Right-angled triangle with sides labelled hypotenuse, opposite, adjacent relative to angle $\\theta$]",
          "caption": "[Triangle showing hypotenuse, opposite and adjacent relative to $\\theta$]"
        },
        
        {
          "type": "paragraph",
          "content": "This method illustrates how we can use trigonometry on scalene triangles by first creating a right-angled triangle inside them."
        }
            

          ]
        },
        
        ,


        
      ]
    }, 
    {
      "id": 4,
      "title": "Inverse Trigonometric Functions",
      "blocks": [
        {
          "type": "paragraph",
          "content": "So far we’ve seen how to use sine, cosine, and tangent to find missing sides in right-angled triangles. But what if instead we want to find a missing angle? That’s when the inverse trigonometric functions save the day."
        },
        {
          "type": "image",
          "url": "/Images/right-angled-triangle.png",
          "alt": "[Right-angled triangle with angle $\\theta$ labelled and opposite, adjacent, hypotenuse marked]",
          "caption": "[Triangle showing sides and angle $\\theta$ relative to which we apply inverse trig functions]"
        },
        {
          "type": "heading",
          "level": 4,
          "content": "The three inverse trig functions"
        },
        {
          "type": "bullet-points",
          "points": [
            "$$\\theta = \\sin^{-1}\\Big(\\tfrac{\\text{opposite}}{\\text{hypotenuse}}\\Big)$$ — gives the angle when you know opposite and hypotenuse.",
            "$$\\theta = \\cos^{-1}\\Big(\\tfrac{\\text{adjacent}}{\\text{hypotenuse}}\\Big)$$ — gives the angle when you know adjacent and hypotenuse.",
            "$$\\theta = \\tan^{-1}\\Big(\\tfrac{\\text{opposite}}{\\text{adjacent}}\\Big)$$ — gives the angle when you know opposite and adjacent."
          ]
        },
        {
          "type": "heading",
          "level": 4,
          "content": "Example 1: Finding an angle in a right-angled triangle"
        },
        {
          "type": "image",
          "url": "/Images/inverse-trig-example-1.png",
          "alt": "[Right-angled triangle with adjacent side 4 units, opposite side 3 units, angle $\\theta$ marked at the base corner]",
          "caption": "[Triangle with adjacent $=4$, opposite $=3$, hypotenuse unknown. Find $\\theta$.]"
        },
        {
          "type":"accordion", 
          "title":"Give it a go, then click here for the solution",
          "children":[
              {
          "type": "paragraph",
          "content": "Here, we know opposite $=3$ and adjacent $=4$. So we use tangent: \n$$\\theta = \\tan^{-1}\\Big(\\tfrac{3}{4}\\Big).$$ \nCalculating gives $$\\theta \\approx 36.9^\\circ.$$"
        },
          ]
        },
        
        {
          "type": "heading",
          "level": 4,
          "content": "Example 2: Finding an angle in a non-right-angled triangle"
        },
        {
          "type": "paragraph",
          "content": "Now consider a scalene triangle $ABC$ with vertices $A(0,0)$, $B(5,0)$, and $C(2,4)$. We want to find angle $ABC$ (the angle at $B$)."
        },
        {
          "type": "image",
          "url": "/Images/inverse-trig-example-2.png",
          "alt": "[Scalene triangle with vertices $A(0,0)$, $B(5,0)$, $C(2,4)$. A perpendicular is dropped from $C$ to meet $AB$ at point $D$, forming right-angled triangle $BDC$. Angle $ABC$ is highlighted to be found.]",
          "caption": "[Scalene triangle $ABC$ with altitude $CD$ drawn. Use right triangle $BDC$ to find angle $ABC$.]"
        },
        {
          "type":"accordion", 
          "title":"Once again, give it a go, then check your solution!", 
          "children":[
               {
          "type": "paragraph",
          "content": "Step 1: Drop a perpendicular from $C$ to $AB$, meeting it at $D$. Now $BDC$ is a right-angled triangle. \n\nStep 2: In $BDC$, we know $BD=3$ and $CD=4$. So: \n$$\\theta = \\tan^{-1}\\Big(\\tfrac{4}{3}\\Big).$$ \n\nStep 3: Calculating gives $$\\theta \\approx 53.1^\\circ.$$"
        },
        {
          "type":"bullet-points", 
          "points":["Step 1: Draw a perpendicular line from $C$ to $AB$, meeting it at $D$. Now $BDC$ if a right-angled triangle."]
        }, 
        {
          "type":"image", 
          "url":"/Images/inverse-trig-example-2a.png", 
          "alt":"same as the example 2 question image with a perpendicular line drawn down from C to AB to form a right angled triangle"
        },
        {
          "type":"bullet-points", 
          "points":["Step 2: In $BDC$, we know from the coordinates that $BD=3$ and $CD =4$. So $$ \\theta = \\tan^{-1}\\Big(\\tfrac{4}{3}\\Big)$$ ", "Step 3: Calculating gives: $$\\theta \\approx 53.1^\\circ$$"]
        }
          ]
        }, 
       
        {
          "type": "paragraph",
          "content": "Thus, by drawing a right-angled triangle inside the scalene triangle, we used an inverse trigonometric function to determine the missing angle."
        }
      ]
    },
     {
      "id": 5,
      "title": "Properties of Triangles",
      "blocks": [
        {
          "type": "paragraph",
          "content": "Let’s start with one of the most important facts: the sum of the angles in a triangle is always $$180^\\circ$$."
        },
        {
          "type": "paragraph",
          "content": "Why? Because a triangle’s angles can be rearranged along a straight line. A straight line makes $$180^\\circ$$, so the angles inside any triangle must also add up to $$180^\\circ$$."
        },
        {
          "type": "image",
          "url": "/images/placeholder",
          "alt": "[Diagram showing a triangle’s three angles rearranged to form a straight line of 180 degrees]",
          "caption": "[The three interior angles of a triangle together form a straight line]"
        },
        {
          "type": "paragraph",
          "content": "This fact about triangles helps us study other polygons too. Any polygon can be split into triangles by drawing diagonals from one vertex. The number of triangles you get is always $n-2$, where $n$ is the number of sides of the polygon."
        },
        {
          "type": "paragraph",
          "content": "So, the sum of interior angles of any polygon is $$(n-2) \\times 180^\\circ$$."
        },
        {
          "type": "heading",
          "level": 4,
          "content": "Polygon table"
        },
        {
          "type": "table",
          "header": ["Polygon", "Number of sides $n$", "Number of triangles", "Sum of interior angles"],
          "rows": [
            ["Quadrilateral", "$4$", "$2$", "$2 \\times 180^\\circ = 360^\\circ$"],
            ["Pentagon", "$5$", "$3$", "$3 \\times 180^\\circ = 540^\\circ$"],
            ["Hexagon", "$6$", "$4$", "$4 \\times 180^\\circ = 720^\\circ$"],
            ["Heptagon", "$7$", "$5$", "$5 \\times 180^\\circ = 900^\\circ$"]
          ]
        },
        {
          "type": "paragraph",
          "content": "This table shows how triangles form the foundation for understanding the interior angles of all polygons."
        }
      ]
    }
],
"collection": "edx-maths-1"
}

const cosineRule = {
"slug": "the-cosine-rule",
"title": "The Cosine Rule ",
"next": "",
"parts": [
{
"id": 1,
"title": "Hey! I'm missing a side!",
"blocks": [
{
"type": "paragraph",
"content": "The cosine rule (also called the law of consines) is a formula that relates the lengths of the sides of any triangle to the cosine of one of its angles. It's especially useful when when a triangle is not right-angled, and the pytahgorean theorem cannot be used directly. "
},
{
  "type":"parapgraph", 
  "content":"It comes in two main forms, which each serve a different purpose:"
},
{
  "type":"bullet-points", 
  "points":[
    "1) To find a missing side ", 
    "2) To find a missing angle"
  ]
}, 
{
  "type":"paragraph", 
  "content":"We will start by looking at case 1"
}, 
{
"type": "heading",
"level":3, 
"content": "The cosine Rule to Find a Missing Side"
},
{
  "type":"bold-paragraph", 
  "content":"If you know two sides and the included angle, the cosine rule lets you find the third side:"

},
{
  "type":"paragraph", 
  "content": "$$ a^2  = b^2 + c^2 - 2bc  \\cos{A}$$"
},
{
"type": "image",
"url": "/Images/cosine-rule.png",
"alt": "A triangle with angles A, B and C, with corresponding sides opposite each angle labled a,b and c",
"caption": "The Cosine Rule "
},
{
  "type":"paragraph", 
  "content":"Now consider the following example:"

}, 
{
"type": "image",
"url": "/Images/cosine-rule-example-1.png",
"alt": "A triangle with angles 45°, and surround sides b=8cm and c = 7c,",
"caption": "The Cosine Rule- Example 1 "
},
{
  "type":"paragraph", 
  "content":"Calculate the missing side A"
},
 {
      type:"accordion", 
      title:"Give the example above an attempt, then click here to check your solution!",
      children:[
        {
"type": "image",
"url": "/Images/cosine-rule-example-1.png",
"alt": "A triangle with angles 45°, and surround sides b=8cm and c = 7c,",
"caption": "The Cosine Rule- Example 1 "
},
        {
          "type":"paragraph", 
          "content":" Let's start by working through the solution line by line:"
        }, 
        {
          "type": "bullet-points", 
          "points":[ 
            "first start by recalling our formula: $a^2 = b^2 +c^2 -2bc \\cos{A}$", 
            "Now let's fill in each of our known values into the formula, so we get: ", 
            "$a^2=8^2 + 7^2 -2 \\cdot 8 \\cdot 7 \\cdot \\cos{45}$", 
            "This gives:",
            "$a^2 = 33.80404051...$", 
            "so taking the square root gives us: ", 
            "$a = \\sqrt{33.80404051...} = 5.81$ cm (2dp) "
          ]
        },
      

      ]
    },
      {
          "type":"paragraph", 
          "content":"So now that you've seen the cosine rule in action, you may be wondering where does it actually come from?"
        }, 
        {
          "type":"paragraph", 
          "content":"Well using the trignometric ratio's that we covering in our previous lesson we can acutally prove the cosine rule!"
        },
        {
          "type":"paragraph", 
          "content":"Start by considering the arbitrary triangle below:"
        }, 
        {
          "type": "image",
          "url": "/Images/arbitrary-triangle.png",
          "alt": "A triangle with angles, and surrounding sides labelled,",
          "caption": "A arbitrary triangle "
        },
        {
          "type":"paragraph", 
          "content":"Now if we draw a straight perpendicular line down from angle C, we can intersect the side c at , say $x$."
        }, 
        {
          "type":"paragraph", 
          "content":"This results in in two right angled triangles with the adjacent side of triangle 1 (left triangle) being of length $x$ and of triangle 2 (right triangle) being lenght $c-x$. Both these triangles have an opposite side of length h, as shown below:"
        },
        {
          "type": "image",
          "url": "/Images/arbitrary-triangle-perpendicular-line.png",
          "alt": "A triangle with angles, and surrounding sides labelled,with a perpendicular line from angle C to side c",
          "caption": "A arbitrary triangle with perpendicular line "
        },
        {
          "type":"paragraph", 
          "content":"Now let's form two equations using pythagoras's theorem:" 
        }, 
        {
          "type":"bullet-points", 
          "points":[
            "From tirangle 1 we have $h^2 + x^2 = b^2$ (1)", 
            "From triangle 2 we have $h^2 + (c-x)^2 = a^2 $ (2)"
          ]
        }, 
      {
        "type":"paragraph", 
        "content":"Now doing equation $(1) - (2)$ we get $x^2 - (c-x)^2 = b^2 - a^2$"
      }, 
      {
        "type":"paragraph", 
        "content":"so simplying this down it becomes: "
      }, 
      {
        "type":"paragraph", 
        "content":"$2cx- c^2 = b^2 - a^2$ which we can rearrange as $a^2 = b^2 +c^2 -2cx$ (3)"
      }, 
    {
      "type":"paragraph", 
      "content":"Now it's time to reintroduce one of our trignometric ratio's recall that $\\cos{A} = \\frac{x}{b}$ this means we can rearrange this to obtain $x = b \\cos{A} $ "
    }, 
    {
      "type":"paragraph", 
      "content":"Therefore subbing $x = b \\cos{A}$ into equation $(3)$ we obtain: "
    }, 
  {
    "type":"paragraph", 
    "content":"$a^2 = b^2 +c^2 -2bc \\cos{a}$ which is exactly what we want, the cosine rule to find missing sides!"
  }, 
  {
    "type":"paragraph", 
    "content":"Now that you're familiar with  the cosine rule, work through the following tasks before moving on! "
  }

]
}, 
{
  "id":2, 
  "title": "Hey! I'm missing a angle!", 
  "blocks": [
    {}
  ]
}
]}


const sineRule ={}
const CirclesAndRatios = {
  "slug": "angles-in-a-unit-circle",
  "title": "Angles in a Unit Circle",
  "next": "",
  "parts": [
    {
      "id": 1,
      "title": "Unit Circles and Trigonometry",
      "blocks": [
        {
          "type": "paragraph",
          "content": "A unit circle is a circle with radius $1$, centred at the origin $(0,0)$ of the coordinate plane. Because the radius is $1$, it gives us a simple and powerful way to connect angles with trigonometric functions."
        },
        {
          "type": "image",
          "url": "/Images/the-unit-circle.png",
          "alt": "[A circle centred at the origin with radius 1, labelled as 'unit circle']",
          "caption": "[The unit circle has radius 1 and is centred at the origin]"
        },
        {
          "type": "paragraph",
          "content": "Now let’s see how it relates to trigonometry. If we take a point $P$ on the circumference of the unit circle and join it to the origin, we form a right-angled triangle with the $x$-axis."
        },
        {
          "type": "image",
          "url": "/Images/trig-unit-circle.png",
          "alt": "[Unit circle with a point P at angle θ from the positive x-axis. Right-angled triangle drawn with horizontal base, vertical height, and hypotenuse OP labelled. Coordinates of P shown as $(\\cos \\theta, \\sin \\theta)$]",
          "caption": "[Point $P$ on the unit circle with coordinates $(\\cos\\theta, \\sin\\theta)$]"
        },
        {
          "type": "paragraph",
          "content": "Using trigonometry in this right-angled triangle, we see that:"
        },
        {
          "type":"bullet-points", 
          "points":["The $x$-coordinate of $P$ is $\\cos\\theta$", "The $y$-coordinate of $P$ is $\\sin\\theta$", "The gradient of the line $OP$ is $$\\tan\\theta = \\frac{x}{y} = \\tfrac{\\sin\\theta}{\\cos\\theta}$$"]

        },
        {
          "type":"paragraph", 
          "content":"Notice something very interesting, we just showed you that $ \\tan \\theta$ represents the gradient which can be thought of as $\\tan\\theta = \\frac{sin\\theta}{cos\\theta}$. Well this is known as a trignometric identity, and we will study them in much more detail later on!"
        }, 
        {
          "type": "heading",
          "level": 4,
          "content": "Example"
        },
        {
          "type": "paragraph",
          "content": "Suppose $\\theta = 60^\\circ$. On the unit circle, the point $P$ has coordinates $(\\cos 60^\\circ, \\sin 60^\\circ) = (\\tfrac{1}{2}, \\tfrac{\\sqrt{3}}{2})$. \nSo:\n- $\\cos 60^\\circ = \\tfrac{1}{2}$, \n- $\\sin 60^\\circ = \\tfrac{\\sqrt{3}}{2}$, \n- $\\tan 60^\\circ = \\tfrac{\\sqrt{3}}{1} = \\sqrt{3}$."
        },
        {
          "type": "paragraph",
          "content": "This shows how the unit circle definitions allow us to calculate the values of sine, cosine, and tangent for any angle $\\theta$."
        },
        {
          "type": "heading",
          "level": 4,
          "content": "Measuring Angles"
        },
        {
          "type": "paragraph",
          "content": "By convention, we always measure positive angles $\\theta$ anticlockwise from the positive $x$-axis. Negative angles are measured clockwise from the positive $x$-axis."
        },
        {
          "type": "image",
          "url": "/Images/unit-circle-anticlockwise.png",
          "alt": "[Unit circle with an arrow showing a positive angle θ measured anticlockwise from the positive x-axis, and another arrow showing a negative angle measured clockwise]",
          "caption": "[Angles are measured anticlockwise for positive $\\theta$, clockwise for negative $\\theta$]"
        }
      ]
    }
  ],
  "collection": "edx-maths-1"
}


  // On mount, set lesson and userProgress from the static lesson data
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLesson(cosineRule);
      setUserProgress(createUserProgress(cosineRule, user.id));
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
  console.log('The taskState being passed into the LessonDisplay is ', userTaskState)

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
