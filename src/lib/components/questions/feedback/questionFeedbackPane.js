'use client'
import React from 'react'; 
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function QuestionFeedbackPane() {
    return (
         <div style={{
      padding: '1.5rem',
      height: '80vh',             // Fixed height for the pane
      background: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      margin: '1rem auto',
      boxSizing: 'border-box'
    }}>
        <h3 style={{textAlign:'center', marginBottom:'1rem', textDecoration:"underline"}}>
            Feedback
        </h3>
            {/* {Scrollable container for task feedback cards} */}
            <p>Testing</p>
          
        </div>
    );
}