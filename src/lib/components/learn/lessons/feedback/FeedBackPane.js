// /lib/components/learn/feedback/FeedbackPane.jsx
'use client';

export default function FeedbackPane({ part }) {
  if (!part) {
    return <p>No feedback data yet.</p>;
  }

  return (
    <div>
      <h4>Feedback on {part?.title}</h4>
      <p>
        This is the feedback tab where you can show hints, instructor notes, or 
        other info for this specific part.
      </p>
    </div>
  );
}
