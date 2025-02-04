// /lib/components/learn/BlockRenderer.jsx
'use client';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function BlockRenderer({ block }) {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level || 2}`;
      return <Tag style={{margin:'0.5rem', fontWeight:'bold', color:'black'}}>{block.content}</Tag>;
    }
    case 'paragraph':
      return <p style={{fontSize:'1.25rem', margin:'0.5rem'}}><Latex>{block.content}</Latex></p>;

    case 'bullet-points': {
      
       return (
        <>
        <ul>
          {block.points.map(point=>
            <li key={point} style={{fontSize:'1.25rem', margin:'1.25rem'}}><Latex>{point}</Latex></li>
          )}
        </ul>
        
        </>
       )
    }
   



    case 'task':
      return (
        <div
          style={{
            border: '1px solid #ddd',
            padding: '0.5rem',
            margin: '0.5rem 0',
          }}
        >
          <h4 style={{fontWeight:'bold'}}>{block.title}</h4>
          <p>{block.instructions}</p>
          {block.hint && (
            <details style={{ marginTop: '0.5rem' }}>
              <summary>Hint</summary>
              <p><Latex>{block.hint}</Latex></p>
            </details>
          )}
        </div>
      );
    default:
      return null;
  }
}
