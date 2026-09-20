'use client'
import React from 'react'; 
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { useQuestionStore } from '@/lib/zustand/providers/question-state-provider';
import BlockRenderer from '../../learn/lessons/BlockRenderer';

export default function QuestionFeedbackPane() {
    const feedback = useQuestionStore((state)=> state.userProgress.feedback)
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
      boxSizing: 'border-box',
      overflowY:'auto'

    }}>
         <h1 style={{textAlign:'center', marginBottom:'1rem',  textDecoration:'underline', fontWeight:"bold",       color:"#17a2b8"  }}>
            Feedback
        </h1>
            
              {feedback.length > 0 && feedback[feedback.length-1].map((block, i) =>
        <BlockRenderer key={i} block={block} />
      )}

      {feedback.length == 0 && emptyFeedback.map((block,i) => <BlockRenderer key={i} block={block} />)
      }

      

          
        </div>
    );
}

const emptyFeedback = [{type:"paragraph", content:"Submit your first attempt to begin recieving feedback!"}]