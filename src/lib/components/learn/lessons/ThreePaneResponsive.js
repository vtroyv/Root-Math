// /lib/components/learn/ThreePaneResponsive.jsx
'use client';

import React, { useState } from 'react';
import Split from 'react-split';
import useMediaQuery from './useMediaQuery';

/**
 * A responsive layout with 3 panes on desktop,
 * or top-level tabs on mobile.
 *
 * The actual logic of instructions, feedback, notes, comments
 * is handled by the parent and the Feedback components.
 *
 * PROPS:
 *   instructions - ReactNode (left pane)
 *   mainContent  - ReactNode (center pane)
 *   feedbackData - { feedback, notes, comments } - right pane content
 */
export default function ThreePaneResponsive({
  instructions,
  mainContent,
  feedbackData,
}) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  // For the entire layout tabs on mobile:
  const [activeMobileTab, setActiveMobileTab] = useState('lesson');

  // -----------------------------------------
  // MOBILE LAYOUT (TABBED)
  // -----------------------------------------
  if (isMobile) {
    return (
      <div
        style={{
          marginTop: '1rem',
          border: '1px solid #ccc',
          height: 'calc(100vh - 2rem)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top bar with 3 buttons */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #ccc',
            backgroundColor: '#f0f0f0',
          }}
        >
          <button
            onClick={() => setActiveMobileTab('instructions')}
            style={tabButtonStyle(activeMobileTab === 'instructions')}
          >
            Instructions
          </button>
          <button
            onClick={() => setActiveMobileTab('lesson')}
            style={tabButtonStyle(activeMobileTab === 'lesson')}
          >
            Lesson
          </button>
          <button
            onClick={() => setActiveMobileTab('feedback')}
            style={tabButtonStyle(activeMobileTab === 'feedback')}
          >
            Feedback
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeMobileTab === 'instructions' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {instructions}
            </div>
          )}
          {activeMobileTab === 'lesson' && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                padding: '1rem',
              }}
            >
              {mainContent}
            </div>
          )}
          {activeMobileTab === 'feedback' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {feedbackData?.feedback || <p>No feedback component provided.</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // DESKTOP LAYOUT (3 SPLIT PANES)
  // -----------------------------------------
  return (
    <div
      style={{
        marginTop: '1rem',
        border: '1px solid #ccc',
        height: 'calc(100vh - 2rem)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Split
        direction="horizontal"
        sizes={[35, 65]}
        gutterSize={6}
        gutterAlign="center"
        gutter={createGutter}
        style={{
          flex: 1,
          display: 'flex',
          width: '100%',
        }}
      >
        {/* LEFT PANE: instructions */}
        <aside
          style={{
            borderRight: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '1rem',
            boxSizing: 'border-box',
          }}
        >
          {instructions}
        </aside>

        <Split
          direction="horizontal"
          sizes={[60, 40]}
          gutterSize={6}
          gutterAlign="center"
          gutter={createGutter}
          style={{
            display: 'flex',
            width: '100%',
          }}
        >
          {/* CENTER PANE: mainContent */}
          <main
            style={{
              padding: '1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
              borderRight: '1px solid #ccc',
            }}
          >
            {mainContent}
          </main>

          {/* RIGHT PANE: feedback (tabs are inside the Feedback component) */}
          <aside style={{ padding: '1rem' }}>
            {feedbackData?.feedback || <p>No feedback component provided.</p>}
          </aside>
        </Split>
      </Split>
    </div>
  );
}

/** Creates a thicker gray gutter for react-split's draggable handle */
function createGutter(index, direction) {
  const gutterEl = document.createElement('div');
  gutterEl.className = `gutter gutter-${direction}`;
  gutterEl.style.backgroundColor = '#ddd';
  gutterEl.style.cursor = 'col-resize';
  return gutterEl;
}

/** A little helper style for the 3 big "mobile" tab buttons. */
function tabButtonStyle(isActive) {
  return {
    flex: 1,
    padding: '1rem',
    border: 'none',
    backgroundColor: isActive ? '#fff' : 'transparent',
    borderBottom: isActive ? '2px solid #000' : 'none',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
  };
}
