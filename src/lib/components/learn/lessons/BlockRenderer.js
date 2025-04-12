import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import ImageWithEnlarge from './ImageWithEnlarge';

export default function BlockRenderer({ block }) {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level || 2}`;
      return <Tag style={{ margin: '0.5rem', fontWeight: 'bold', color: 'black' }}><Latex>{block.content}</Latex></Tag>;
    }
    case 'paragraph':
      return <p style={{ fontSize: '1.25rem', margin: '0.5rem' }}><Latex>{block.content}</Latex></p>;
    case 'bullet-points': {
      return (
        <ul>
          {block.points.map(point =>
            <li key={point} style={{ fontSize: '1.25rem', margin: '1.25rem' }}>
              <Latex>{point}</Latex>
            </li>
          )}
        </ul>
      );
    }
    //Note i don't believe this case 'task' is ever being actually used. It's actually being covered in the taskRenderer part of the insctuction component 
    //I believe at a later date you should delete this or simply replace it with the taskcase in the instruction component. 
    case 'task':
      return (
        <div
          style={{
            border: '1px solid #ddd',
            padding: '0.5rem',
            margin: '0.5rem 0',
          }}
        >
          <h4 style={{ fontWeight: 'bold' }}><Latex>{block.title}</Latex></h4>
          <p><Latex>{block.instructions}</Latex></p>
          {block.hint && (
            <details style={{ marginTop: '0.5rem' }}>
              <summary>Hint</summary>
              <p>{block.hint}</p>
            </details>
          )}
        </div>
      );
    case 'image':
      return (
        <ImageWithEnlarge
          url={block.url}
          alt={block.alt}
          caption={block.caption}
        />
      );
    default:
      return null;
  }
}
