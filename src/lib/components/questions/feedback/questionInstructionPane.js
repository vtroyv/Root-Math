'use client'
import React from 'react'; 
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import BlockRenderer from '../../learn/lessons/BlockRenderer';

export default function QuestionInstructionPane({instructions}) {
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
      overflowY: 'auto',   
    }}>
        <h3 style={{textAlign:'center', marginBottom:'1rem',  textDecoration:'underline'}}>
            Instructions
        </h3>
            {/* {Scrollable container for task feedback cards} */}
            {/* Take in the instructions and displa it using the task render like before  */}
          {test.map((block,i) => <BlockRenderer key={i} block={block} />)}
          
        </div>
    );
}

const test =  [
  {
    "type": "heading",
    "level": 2,
    "content": "Proof that for any positive numbers $p$ and $q$ : $$p+q > \\\\sqrt{4pq}$$"
  },
  {
    "type": "paragraph",
    "content": "Since $p>0$ and $q>0$, both sides of the desired inequality are positive.  Therefore we can square without changing direction:"
  },
  {
    "type": "paragraph",
    "content": "$$(p+q)^2 > 4pq$$"
  },
  {
    "type": "bullet-points",
    "points": [
      "Expand the left side: $$(p+q)^2 = p^2 + 2pq + q^2$$",
      "Subtract $4pq$ from both sides: $$(p+q)^2 - 4pq = p^2 - 2pq + q^2$$",
      "Factor: $$p^2 - 2pq + q^2 = (p - q)^2$$"
    ]
  },
  {
    "type": "paragraph",
    "content": "But $(p-q)^2 \\ge 0$, with equality only if $p = q$.  Hence"
  },
  {
    "type": "paragraph",
    "content": "$$(p+q)^2 \\\\ge 4pq \\quad\\\\Longrightarrow\\\\quad p+q \\\\ge \\\\sqrt{4pq},$$"
  },
  {
    "type": "paragraph",
    "content": "and in the generic case $p \\neq q$ the inequality is strict, so"
  },
  {
    "type": "paragraph",
    "content": "$$p+q > \\\\sqrt{4pq}.$$"
  }
]
