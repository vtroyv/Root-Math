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
      content:"So now that we know how the second derivative can be used to classify stationairy points, how about understanding why?"
    }, 
    {
      type:"paragraph", 
      content:""
    }



  ]
}]
}


  // On mount, set lesson and userProgress from the static lesson data
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLesson(stationairypointsAndTheirNature);
      setUserProgress(createUserProgress(stationairypointsAndTheirNature, user.id));
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
