// /lib/components/learn/feedback/CommentsPane.jsx
'use client';

import { useState } from 'react';

/**
 * A simple "comments" example - in a real app, you'd post to a backend, etc.
 */
export default function CommentsPane({ part }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  if (!part) return <p>No part selected yet.</p>;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, newComment.trim()]);
    setNewComment('');
  };

  return (
    <div>
      <h4>Comments for {part?.title}</h4>
      <div style={{ marginBottom: '1rem' }}>
        {comments.map((c, i) => (
          <div
            key={i}
            style={{
              border: '1px solid #ddd',
              padding: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            {c}
          </div>
        ))}
      </div>
      <div>
        <textarea
          style={{ width: '100%', minHeight: '80px' }}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment} style={{ marginTop: '0.5rem' }}>
          Add Comment
        </button>
      </div>
    </div>
  );
}
