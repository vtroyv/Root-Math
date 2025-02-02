// /lib/components/learn/lessons/feedback/FeedbackPane.jsx
'use client';

export default function FeedbackPane({ part, extraFeedback }) {
  return (
    <div>
      <h4>Feedback for {part.title}</h4>
      <div>{extraFeedback}</div>
    </div>
  );
}
