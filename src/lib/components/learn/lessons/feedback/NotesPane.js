// /lib/components/learn/feedback/NotesPane.jsx
'use client';

import { useState } from 'react';

/**
 * A simple example where the user can type personal notes 
 * about the current part of the lesson.
 */
export default function NotesPane({ part }) {
  const [notes, setNotes] = useState('');

  if (!part) {
    return <p>No part selected.</p>;
  }

  return (
    <div>
      <h4>Your Notes for {part?.title}</h4>
      <textarea
        style={{ width: '100%', minHeight: '120px' }}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your personal notes here..."
      />
    </div>
  );
}
