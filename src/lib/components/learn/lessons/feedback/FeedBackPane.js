'use client';
import React from 'react';

export default function FeedbackPane({ part, extraFeedback, tasksCount = 4 }) {
  // Ensure extraFeedback is an array. If not, use an empty array.
  const feedbackArray = Array.isArray(extraFeedback) ? extraFeedback : [];

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
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Feedback 
      </h3>
      
      {/* Scrollable container for task feedback cards */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingRight: '0.5rem'
      }}>
        {Array.from({ length: tasksCount }).map((_, i) => (
          <div key={i} style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '0.75rem',
            marginBottom: '0.75rem',
            background: '#fff'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Task {i + 1}</h4>
            <p style={{ margin: 0 }}>
              {feedbackArray[i] !== undefined && feedbackArray[i] !== null 
                ? feedbackArray[i] 
                : "No feedback yet for this task."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
