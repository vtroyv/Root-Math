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
                'Indices (also known as exponents or powers) appear in many areas of math. They are a way to reprsent the repeated multiplication of a number by itself.',
            },
            {
              type:'paragraph', 
              content:
              "For instance if we had the number 3 multiplied by itself 5 times, we could represent this as: $ 3 \\cdot 3 \\cdot 3 \\cdot 3 \\cdot 3 = 3^{5}$"

            },
            {
              type: 'paragraph',
              content:
              'There are 4 index laws that we now go on to explore:'

            },
            
            // {
            //   type:'bullet-points', 
            //   points: {
            //     point1:'$a^{n} \\cdot a^{m} = a^{m+n}$', 
            //     point2: '$\\frac{a^n}{a^m} = a^{n-m}$', 
            //     point3: '$(a^m)^n = a^{m \\cdot n}$', 
            //     point4: '$(ab)^n = a^n \\, b^n$', 
            //   }

            // }, 
          ],
        },
        {
          id: 'part2-product',
          title: 'Law 1: Product of Powers',
          blocks: [
            {
              type: 'paragraph',
              content:
                'If you multiply two expressions with the same base, you add their exponents: a^m * a^n = a^(m+n).',
            },
            {
              type: 'task',
              title: 'Check Your Understanding',
              instructions: 'Simplify x^3 * x^4.',
              hint: 'Add the exponents when the bases match.',
            },
            {
              type: 'task',
              title: 'Testing multiple tasks',
              instructions: 'Simplify x^2 * x^5.',
              hint: 'Add the exponents when the bases match.',
            },
            
            ,
          ],
        },
        {
          id: 'part3-quotient',
          title: 'Law 2: Quotient of Powers',
          blocks: [
            {
              type: 'paragraph',
              content:
                'If you divide two expressions with the same base, you subtract their exponents: a^m / a^n = a^(m-n).',
            },
            {
              type: 'task',
              title: 'Try It Out',
              instructions: 'Simplify y^5 / y^2.',
              hint: 'Subtract exponents when dividing with the same base.',
            },
          ],
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

  if (!lesson) {
    return <div>Loading lesson...</div>;
  }

  // Current part
  const currentPart = lesson.parts[currentPartIndex];

  // "Back" button
  const handleBack = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex((i) => i - 1);
    }
  };

  // "Next" button
  const handleNext = () => {
    if (currentPartIndex < lesson.parts.length - 1) {
      setCurrentPartIndex((i) => i + 1);
    } else {
      alert('You have reached the end of the lesson!');
    }
  };

  // 1) Instructions Pane (left)
  const instructionsPane = (
    <Instructions
      part={currentPart}
      currentPartIndex={currentPartIndex}
      totalParts={lesson.parts.length}
      onBack={handleBack}
      onNext={handleNext}
    />
  );

  // 2) LessonDisplay (center)
  const mainPane = (
    <LessonDisplay
      part={currentPart}
      // pass any additional props if needed
    />
  );

  // 3) Feedback Pane (right) — includes its own tabs
  const feedbackPane = (
    <Feedback
      part={currentPart}
      // pass more props if the feedback depends on user progress
    />
  );

  // The layout container
  return (
    <ThreePaneResponsive
      instructions={instructionsPane}
      mainContent={mainPane}
      // We pass an object with .feedback, .notes, .comments if desired
      feedbackData={{
        feedback: feedbackPane,
        // optional placeholders if you want separate tab content
        // notes: <NotesPane ... />,
        // comments: <CommentsPane ... />,
      }}
    />
  );
}
