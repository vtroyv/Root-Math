// Example React snippet
import React from 'react';
import Latex from 'react-latex-next';
import postprocessLatex from '@/lib/utils/postprocess-latex';

const FeedbackDisplay = ({ feedback }) => {
  // feedback is the object from above:
  // {
  //   marks: { firstMark: { feedback: "..." }, ... },
  //   totalMarks: "...",
  //   finalFeedback: "..."
  // }

  /*
  POSTPROCESSING LATEX
  we should create a function called postprocess-latex.js, 
  that essentially takes in the gpt output, and then uses regular expressions to,
  surround the latex with the correct $$ signs,  

  
  */
 // "firstMark" -> "First Mark"
function camelCaseToTitle(str) {
    // Insert a space before each capital, then capitalize the first letter
    const spaced = str.replace(/([A-Z])/g, ' $1');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }
  


  console.log('The feedback sent to the feedback display component is ', feedback)

  if (feedback.error) {
    return <p>Error: {feedback.error}</p>;
  }

  return (
    <div>
      <div>
        {Object.entries(feedback.marks).map(([markKey, markValue]) => (
          <div key={markKey}>
            <h2>{camelCaseToTitle(markKey)}</h2>
            <Latex>{postprocessLatex(markValue.feedback)}</Latex>
          </div>
        ))}
      </div>
      <h2>Total Marks</h2>
      <Latex>{feedback.totalMarks}</Latex>

      <h2>Final Feedback</h2>
      <Latex>{feedback.finalFeedback}</Latex>
    </div>
  );
};

export default FeedbackDisplay;
