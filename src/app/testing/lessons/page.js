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
          "title": "A brief introduction to Quadratic Graphs",
          "blocks": [
            {
              "type": "paragraph",
              "content":"Recall that a quadratic expression is an expression which has the form $ax^2+bx+c$ Now we’ve seen lots of different types of quadratic expressions but what does the curve of a quadratic expression look like? How would we go about sketching it? "

            },
            {
              "type": "paragraph",
              "content": "In general the curve of a quadratic expression will either be a  ‘U’ or upside down ‘U’ shape which is formally called a parabola, for example: "
            }, 
            {
              "type": "image",
              "url": "/images/quadratic-graph.png",
              "alt": "Quadratic Graph",
              "caption": "The curve of a quadratic expression"
            },
            {
              "type":'paragraph',
              "content": "The image above shows a sketch of the graph $$y=x^2 -4x +2$$ "
            },
            {
              "type":"paragraph", 
              "content": "The point A shows where the curve crosses the y-axis, given that the general form of our quadratic equation will be $ax^2+bx+c$, the point where the curve crosses the y-axis always be $(0,c)$ in general. So in our case given our image shows the curve $y=x^2-4x+2$, it means our point A is at $(0,2)$, as shown in the image"

            },
            {
              "type": "paragraph",
              "content": "Now the points B in the image, correspond to the roots of the quadratic equation. In general, lets say we have a function represented by f(x). Then the roots of this function would be the values of $x$ for which $f(x) = 0$. So in our example above, once more using the fact that $f(x) = x^2 -4x +2$, our roots will be the values of x for which $x^2 -4x +2 = 0$ which are: $$x_1 = 2-\\sqrt{2}$$ and $$x_2 = 2+\\sqrt{2}$$" 
            },
            {
              "type":"paragraph",
              "content":"The point C in the image above represents the turning point of a quadratic expression. Quadratic graphs have one turning point, which is the point of the bend of the 'U'-shape. This can be a minimum or maximum, since a parabola (quadratic curve) is symmetrical, the turning point and line of symmetry are half-way between the two roots. In our example above we can see that the turning point is $(2,-2)$ "
            },
            {
              "type":"paragraph",
              "content":"Now this is just a brief introduction into quadratic graphs, but there's still much to discuss- when do we get an upside down 'U'-shape curve? Or how do we actually go about sketching such graphs?"
            },
            {
              "type":"paragraph", 
              "content":"By the end of this lesson you'll beable to answer all of these questions and much more, now answer the quick warm up question below and lets get started!"
            },
            {
              "type": "task",
              "title": "1) Identify the quadratic Curve?",
              "instructions": "Select the correct image from the list below.",
              "hint": "One of them is correct.",
              "gpt": "test",
              "renderType": "multipleChoiceImages",
              "imageChoices": [
                { "url": "/images/quartic-case.png", "alt": "Test Image 1", "width": 300, "height": 200 },
                { "url": "/images/cubic-case.png", "alt": "Test Image 2", "width": 300, "height": 200 },
                { "url": "/images/quadratic-case.png", "alt": "Test Image 2", "width": 300, "height": 200 },
                { "url": "/images/reciprocal-case.png", "alt": "Test Image 2", "width": 300, "height": 200 },

              ]
            },
            
          ],
          
    
        },
        {
          "id": { "$numberInt": "2" },
          "title": "The Anatomy of a Quadratic Graph-What's the shape?",
          "blocks":[
            {
              "type":"paragraph", 
              "content":"Now quadratic Curves take two shapes depending on the expression, they can either be a 'U' shape or an upside down 'U' shape. The specific shape that the quadratic expression takes depends on the value of the coefficient of the $x^2$ term in the expression"
            }, 
            {
              "type":"paragraph", 
              "content":"Recalling that a quadratic expresison has the form $ax^2+bx+c$, when the value of a is positive our quadratic curve will have the shape: $$a>0$$"
            },
            {
              "type": "image",
              "url": "/images/positive-quadratic.png",
              "alt": "Quadratic Graph",
              "caption": "The curve of a positive quadratic expression"
            },
            {
              "type":"paragraph", 
              "content":"and when the value of a is negative our quadratic curve will have the shape: $$a<0$$"

            },
            {
              "type": "image",
              "url": "/images/negative-quadratic.png",
              "alt": "Quadratic Graph",
              "caption": "The curve of a negative quadratic expression"
            },
            {
              "type":"paragraph", 
              "content":"See not hard at all, now complete the two tasks below before moving on"
            },

            {
              "type":"task",
              "title":"1) What's the shape I",
              "instructions":"Sketch a quadratic where the coefficient of the quadratic term is positive",
              "hint":"Any quadratic will do as long as it's ",
              "gpt":"test",
              "renderType":"sketch", 
            },
            {
              "type":"task",
              "title":"2) What's the shape II",
              "instructions":"Sketch a quadratic where the coefficient of the quadratic term is negative",
              "hint":"Any quadratic will do as long as it's ",
              "gpt":"test",
              "renderType":"sketch", 
            },
            {
              "type":"task",
              "title":"3) Sketch $y=ax^2+bx-4$ with $a>0$",
              "instructions":"Sketch a quadratic where the coefficient of the quadratic term is negative",
              "hint":"Any quadratic will do as long as it's ",
              "gpt":"test",
              "renderType":"sketch", 

            },
            {
              "type": "task",
              "title": "4) Is it possible for a quadratic expression $$ax^2+bx+c$$ where $a>0$ to have two positive roots? ",
              "instructions": "Select the correct answer from the list below.",
              "hint": "One of them is correct.",
              "gpt": "test",
              "renderType": "multipleChoice",
              "question": "2) Which of the following is a quadratic function?",
              "choices": [
                "Yes",
                "No",
              ]
            },
            {
              "type":"task", 
              "title":"5) Is it possible for a quadratic expression $$ax^2+bx+c$$ where now both $a>0$ and $c<0$ to have two positive roots?", 
              "instructions":"Select the correct answer from the list below.", 
              "hint":"One of them is correct",
              "gpt":"test", 
              "renderType":"multipleChoice", 
              "choices": [
                "Yes", 
                "No"
              ] 

            },
            
          ]
        },
        {
          "id": { "$numberInt": "3" },
          "title": "The Anatomy of a Quadratic Graph - How many roots?",
          "blocks":[
            {
              "type":"paragraph", 
              "content":"Now so far, we've seen quadratic equations that have two roots, for instance  "
            }, 
            {
              "type":"paragraph", 
              "content":"Recalling that a quadratic expresison has the form $ax^2+bx+c$, when the value of a is positive our quadratic curve will have the shape: $$a>0$$"
            },
            {
              "type": "image",
              "url": "/images/positive-quadratic.png",
              "alt": "Quadratic Graph",
              "caption": "The curve of a positive quadratic expression"
            },
            {
              "type":"paragraph", 
              "content":"and when the value of a is negative our quadratic curve will have the shape: $$a<0$$"

            },
            {
              "type": "image",
              "url": "/images/negative-quadratic.png",
              "alt": "Quadratic Graph",
              "caption": "The curve of a negative quadratic expression"
            },
            {
              "type":"paragraph", 
              "content":"Now in general when we look at a quadratic expression $ax^2+bx+c$ because the highest power is 2, we can expect it to have a maximum of 2 roots - Surprise! This means  it is perfectly possible for a quadratic expression to have 1 or 0 roots", 

            },
            {
              'type':"paragraph", 
              "content":"For example if a quadratic equation has 1 root, we sometimes call it a repeated root, an example of this would be the quadratic expression $$(x-2)^2$$ which has a repeated root at $x=2$ as shown in the image below:"
            },
            {
              "type": "image",
              "url": "/images/repeated-root.png",
              "alt": "Quadratic Graph",
              "caption": "The curve of a quadratic expression with a repeated root"
            },
            {
              "type":"paragraph",
              "content":"As we can see in the image above, the curve only touches the x-axis at one point, in this case $x=2$, which is a contrast to our previous example where the curve crossed the x-axis at two points. This is because the quadratic expression $$x^2-4x+42$$ can be factorised as $$(x-2)(x-2)$$ and when we equate this to $0$ we get $(x-2)(x-2)=0$ which only has the solution $x=2$ which means that the roots of the quadratic expression are both equal to 2, hence we have a repeated root"
            },
            {
              "type":"paragraph", 
              "content":"So now that we have an idea of what the graph of a quadratic expression that has a repeated root looks like, let's take a look at our final case of quadratic expressions which have no roots"
            },
            {
              "type":"paragraph",
              "content":"Now remember the roots of a quadratic expression are the values of $x$ for which the expression $ax^2+bx+c = 0$, and geometrically these values of $x$ are the points where the quadratic graph crosses the x-axis, therefore following this logic  the curve of a quadratic equation with no roots, simply won't cross the x-axis. For example:", 
            },
            {
              "type": "image",
              "url": "/images/no-roots.png",
              "alt": "Quadratic Graph",
              "caption": "The curve of a quadratic expression with no roots"
            },
            {
              "type":"paragraph", 
              "content":"Now let's put our new knowledge to the test, complete the tasks below and then move on to the next part of this lesson!"

            },
            {
              "type": "task",
              "title": "1) Is it possible for a quadratic expression $$ax^2+bx+c$$ to have more than 2 roots? ",
              "instructions": "Select the correct answer from the list below.",
              "hint": "One of them is correct.",
              "gpt": "test",
              "renderType": "multipleChoice",
              "choices": [
                "Yes",
                "No",
              ]
            },
            ,

            {
              "type": "task",
              "title": "2) Select the image that has no real roots",
              "instructions": "Select the correct image from the list below.",
              "hint": "One of them is correct.",
              "gpt": "test",
              "renderType": "multipleChoiceImages",
              "imageChoices": [
                { "url": "/images/how-many-roots-a.png", "alt": "How many roots image 1", "width": 300, "height": 200 },
                { "url": "/images/how-many-roots-b.png", "alt": "How many roots image 2", "width": 300, "height": 200 }, 
                { "url": "/images/how-many-roots-c.png", "alt": "How many roots image 3", "width": 300, "height": 200 },
              ]
            },
            // {
            //   "type": "task",
            //   "title": "1) Sketching the curve of a quadratic expression",
            //   "instructions": "Sketch the curve of $y=x^2$ and answer the questions below",
            //   "hint": "The curve should only touch the x-axis at one point $y=x^2$",
            //   "gpt": "test",
            //   "renderType": "sketch",
            //   "latex": String.raw` \begin{aligned} &\ \text{Sketch the curve of } y=x^2 \\ &\\ &\text{a) What is the vertex of the curve?} \end{aligned}`
            // },

           
            {
              "type": "task",
              "title": "3) Prove $y=(x-3)^2+1$ has no real roots",
              "instructions":"Above is a sketch of the curve of $y=(x-3)^2+1$, In the editor below prove that it has no real roots",
              "hint":"First make $(x-3)^2$ the subject, then use this to explain why there are no real $x$ values that satisfy this equation", 
              "gpt":"test",
              "url":"/images/show-no-real-roots.png", 
              "alt":"A quadratic image with no real roots", 
              "caption":"The curve of a quadratic expression with no roots",
              "latex":String.raw`\begin{aligned} &\ \text{Type you response below: }  \end{aligned}`,
             "renderType":"image"
            },
             ]
        },
        {
          "id": { "$numberInt": "4" },
          "title": "Sketching Quadratic Graphs ",
          "blocks":[
            {
              "type":"paragraph",
              "content":"Now when it comes to sketching a quadratic equation, as long as we can answer the following quesitons regarding the anaotomy of the quadratic expression, we can sketch it's curve, these questions are:"
            },
            {
              "type":"heading",
              "level":"4",
              "content":"Essentials to sketching $ax^2+bx+c$"
            }
            
            ,
            {
              "type":"bullet-points",
              "points":["1) Is $a>0$ or $a<0$","2) Where is the y-intercept","3) What are the x-intercepts? ","4) Where is the turning point?"]
            },
            {
              "type":"heading",
              "level":"4",
              "content":"Is $a>0$ or $a<0$?"

            },
            {
              "type":"paragraph",
              "content":"1) The purpose of the first question is to determine the shape of the quadratic curve, as we've seen before if $a>0$ our curve will be a 'U' shape and if $a<0$ our curve will be an upside down 'U' shape."
            },
            {
              "type":"heading",
              "level":"4",
              "content":"Where is the y-intercept?"
            },
            {
              "type":"paragraph", 
              "content":"2) Next we need to know the y-intercept of the quadratic expression, this is simply the value of $c$ in the expression $ax^2+bx+c$, so for example if we have the quadratic expression $x^2-4x+2$ then our y-intercept will be $(0,2)$"
            },
            {
              "type":"heading", 
              "level":"4",
              "content":"What are the x-intercepts?"
            },
            {
              "type":"paragraph", 
              "content":"3) Next we need to know the x-intercepts of the quadratic expression, this is simply the value of $x$ for which $ax^2+bx+c=0$, we've already seen how to determine the roots of a quadratic expression using a variety of methods, we could either use, factorisation, completing the square, or the quadratic formula. There's no right or wrong method, the more problems you tackle the more you will develop an intuition of which method to use for a given problem."
            }, 
            {
              "type":"heading",
              "level":"4",
              "content":"What is the turning point?"
            },
            {
              "type":"paragraph",
              "content":"4) Finally we need to know the turning point of the quadratic expression, this is simply the point of the curve where it turns from increasing to decreasing or vice versa. We can find this by either completing the square or using the formula $x=-\\frac{b}{2a}$, where $a$ and $b$ are the coefficients of the quadratic expression."
            },
            {
              "type":"paragraph", 
              "content":"Here's a full example:"
            }, 
            {
              "type":"paragraph", 
              "content":"Consider the quadratic expression $$x^2-5+4$$ now, let's work through the four guiding questions above so we can sketch it!"
            }, 
            {
              "type":"bullet-points",
              "points":["Firstly considering our quadratic expression we can see that in this case $a=1$ which is positive, so we know our curve will be a 'U' shape", "Next we can see that our constant term $c=4$ in this case, so our y-intercept will have the coordinats $(0,4)$", "Now to determine the x-intercepts we simply need to solve $x^2-5x+4=0$ which we can factorise as $(x-4)(x-1)=0$ so our x-intercepts are $x=4$ and $x=1$", "Finally to determine the turning point, we can use the fact that the x coordinate of the turning point is given by  $x=-\\frac{b}{2a}$, where $a=1$ and $b=-5$, so we have $x=-\\frac{-5}{2 \\times 1} = \\frac{5}{2}$, Now to determine the y-coordinate of the turning point we simply need to substitue $x=\\frac{5}{2}$ into $y = x^2-5x+4$ which gives us $-\\frac{9}{4} = -2.25$ So the coordinate of our turning point is $(2.5,-2.25)$ " ]
            },
            {
              "type":"paragraph", 
              "content":"Now that we have all the information we need to sketch the quadratic expression, so first lets plot the points we have so far: "
            }, 
            {
              "type":'bullet-points',
              "points": ["The point A is the y-intercept $(0,4)$", "The points B and C are the x-intercepts $(1,0)$ and $(4,0)$", "The point D is the turning point $(2.5,-2.25)$"]
            }
            ,
            {
              "type":"image",
              "url": "/images/points-for-sketching.png",
              "alt": "Quadratic Graph Points",
              "caption": "The points we need to sketch the quadratic expression"
            },
            {
              "type":"paragraph",
              "content":"Now that we have all the points we need to sketch the quadratic expression, we can simply connect them forming a 'U' shape as $a>0$ to get the curve of the quadratic expression, as shown below:"
            },
            {
              "type":"image",
              "url": "/images/points-connected.png",
              "alt": "Quadratic Graph Points Connected",
              "caption": "The points connected to form the curve of the quadratic expression"
            }, 
            {
              "type":"task", 
              "title":"1) Sketch the curve of $y=-x^2-4x+5$",
              "instructions":"Sketch the curve of $y=-x^2-4x+5$, once you're happy press submit",
              "hint":"First determine if its a 'U' or upside down 'U' shape, then determine the y-intercept, x-intercepts and turning point one step at a time",
              "gpt":"test",
              "renderType":"sketch"
            }, 
            {
              "type":"task",
              "title":"2) Sketch the curve of $y=4x^2 - 2x+2$",
              "instructions":"Sketch the curve of $y=4x^2 - 2x+2$, once you're happy press submit",
              "hint":"Τhis is a 'U' shape once again, however this curve has no real roots, so work out the shape ,y-intercept, turning point and perhaps any other point on the curve to help sketch it",
              "gpt":"test",
              "renderType":"sketch"
            }, 
            {
              "type":"task",
              "title":"3) Sketch the curve of $y=(x-3)^2$",
              "instructions":"Sketch the curve of $y=(x-3)^2$, once you're happy press submit",
              "hint":"This has a repeated root!",
              "gpt":"test",
              "renderType":"sketch"
            },
            {
              "type":"task",
              "title":"4) Consider the quadratic function that has a turning point at $(3,-2)$ and also passes through the point $(1,6)$",
              "instructions":"a) Using the hint write the quadratic function in vertex form $y=a(x-h)^2 +k$ b) Determine the value of 'a' c) Sketch the quadratic function that you've determined",
              "hint":"a) If the turning point of a quadratic is given by $(h,k)$, then the quadratic can be written in the form $y=a(x-h)^2 +k$ where $a$ is a constant b)To determine 'a' simply substitute y=1 and x = 6 into the equation and solve for 'a'\n\n c)Rewrite our equation in the familiar form $y=ax^+bx+c$ and use the given turning point and determine the y-intercept and roots to sketch!",
              "gpt":"test",
              "latex":String.raw` \begin{aligned} &\text{a) Replace h and k with their correct values: } y = a(x-h)^2+k\\ &\\ &\text{b) Determine the value of 'a' } a=?\\ &\\ &\text{c) Sketch the curve of the quadratic you determined in the graph above}  \end{aligned}`,
              "renderType":"curveAndMfe"
            }, 
            {
              "type":"task",
              "title":"5) Select the Image corresponding to the quadratic expression $$y=\\bigl( x - \\frac{5}{2} \\bigr) + \\frac{11}{4}$$",
              "instructions":"Select the correct image from the list below.",
              "hint":"First write the quadratic expression in the form $y=ax^2+bx+c$ then determine the turning point, intercepts and shape of the curve",
              "gpt":"test",
              "renderType":"multipleChoiceImages",
              "imageChoices": [
                { "url": "/images/true.png", "alt": "Option Image 1", "width": 300, "height": 200 },
                { "url": "/images/optionB.png", "alt": "Option Image 2", "width": 300, "height": 200 },
                { "url": "/images/optionC.png", "alt": "Test Image 3", "width": 300, "height": 200 },
                { "url": "/images/optionD.png", "alt": "Test Image 4", "width": 300, "height": 200 },
              ]
            }, 
            {
              "type":"task",
              "title":"6) Determine the quadratic Expression ",
              "instructions":"Determine the quadratic expression from the image given above, give your answer in the form $y=ax^2+bx+c$",
              "hint":"First determine the turning point, then the x and y intercepts, then use this to determine the quadratic expression",
              "gpt":"The correct answer is y=2 x^(2)+ 3x -2",
              "url":"/images/determine-quadratic.png",
              "alt":"A quadratic image which is to be determined ",
              "caption":"The curve of a quadratic expression with no roots",
              "latex":String.raw`\begin{aligned} &\text{Determine 'a', 'b' and 'c':}\\  &\ y= ax^2+bx+c\\   \end{aligned}`,
              "renderType":"image"
            }

            //Im thinking of adding 4 more questions, two will be select the curve corresponding to the following equation, and the last two will be determie the equation of the following curves, 
            //THe last question will require a new question type, e.g. similar to multiple choice images, but now to the right there should be a text box where the user can type in the equation of the curve, and then we can check if it's correct or not when they press submit
            //But also before settling take inspiration from the questions in the textbooks for difficultly level and also style





            
          ]
        }
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
            },
            {
              "type": "task",
              "title": "1) Rationalise the denominator",
              "instructions": "Rationalise the denominator of \\(\\frac{4}{\\sqrt{5}}\\). Replace '?' with the correct value in the form '?\\sqrt{5}' or an integer if possible.",
              "hint": "Multiply top and bottom by \\(\\sqrt{5}\\).",
              "gpt": "The correct answer is \\(\\frac{4\\sqrt{5}}{5}\\).",
              "renderType":"sketch"
            },
           
            

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
           
            },
            {
              "type": "task",
              "title": "1) Rationalise the denominator",
              "instructions": "Rationalise the denominator of \\(\\frac{4}{\\sqrt{5}}\\). Replace '?' with the correct value in the form '?\\sqrt{5}' or an integer if possible.",
              "hint": "Multiply top and bottom by \\(\\sqrt{5}\\).",
              "gpt": "The correct answer is \\(\\frac{4\\sqrt{5}}{5}\\).",
              
            },
            {
              "type": "task",
              "title": "1) Rationalise the denominator",
              "instructions": "Rationalise the denominator of \\(\\frac{4}{\\sqrt{5}}\\). Replace '?' with the correct value in the form '?\\sqrt{5}' or an integer if possible.",
              "hint": "Multiply top and bottom by \\(\\sqrt{5}\\).",
              "gpt": "The correct answer is \\(\\frac{4\\sqrt{5}}{5}\\).",
              
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
      setLesson(quadraticGraphs);
      setUserProgress(createUserProgress(quadraticGraphs, user.id));
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
