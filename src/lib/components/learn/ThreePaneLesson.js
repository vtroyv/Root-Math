'use client';
import React, { useState } from 'react';
import Split from 'react-split';
import classnames from 'classnames';
import {
  Nav, NavItem, NavLink,
  TabContent, TabPane, Button
} from 'reactstrap';
import useMediaQuery from './useMediaQuery';

/**
 * A responsive "Codecademy-style" layout with:
 * - 3 resizable columns on larger screens (via react-split)
 * - A top-tab interface on mobile
 * - Reactstrap tabs in the "feedback" area for "Feedback", "Your notes", "Comments"
 *
 * Pass in your instructions, mainContent, and anything else as props:
 *
 *  <ThreePaneResponsive
 *    instructions={<div>Left content</div>}
 *    mainContent={<LessonDisplay />}
 *  />
 */
export default function ThreePaneResponsive({
  instructions,
  mainContent,
}) {
  // Our chosen mobile breakpoint (e.g. 768px)
  const isMobile = useMediaQuery('(max-width: 768px)');

  // We'll use a tab system for the entire layout on mobile
  const [activeMobileTab, setActiveMobileTab] = useState('lesson'); 
  // possible values: 'instructions', 'lesson', 'feedback'

  // We'll also use a tab system for the "feedback" side on desktop
  const [activeFeedbackTab, setActiveFeedbackTab] = useState('feedback'); 
  // possible values: 'feedback', 'notes', 'comments'

  // Helper to switch feedback tabs
  const toggleFeedbackTab = (tab) => {
    if (activeFeedbackTab !== tab) {
      setActiveFeedbackTab(tab);
    }
  };

  // -----------------------------------------
  // MOBILE/TABLET LAYOUT
  // -----------------------------------------
  if (isMobile) {
    return (
      <div
        style={{
          width: '100%',
          minHeight: '80vh',
          border: '1px solid #ccc',
          marginTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Tabs (for the entire layout) */}
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

        {/* Tab Content (mobile) */}
        <div style={{ flex: 1, padding: '1rem' }}>
          {activeMobileTab === 'instructions' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <div>{instructions}</div>
              <button
                style={bottomButtonStyle}
                onClick={() => alert('Next part!')}
              >
                Next
              </button>
            </div>
          )}

          {activeMobileTab === 'lesson' && (
            <div
              style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
              }}
            >
              {mainContent}
            </div>
          )}

          {activeMobileTab === 'feedback' && (
            <div style={{ width: '100%' }}>
              {/* For simplicity, use the same 3-tab feedback UI also on mobile,
                  or you could just show plain text. */}
              <FeedbackTabs
                activeTab={activeFeedbackTab}
                toggleTab={toggleFeedbackTab}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // DESKTOP LAYOUT (3 resizable columns)
  // -----------------------------------------
  return (
    <div
      style={{
        width: '100%',
        minHeight: '80vh',
        border: '1px solid #ccc',
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* First split: LEFT (instructions) vs. RIGHT (center + feedback) */}
      <Split
        direction="horizontal"
        sizes={[35, 65]}  // 35% left, 65% right
        gutterSize={6}
        gutterAlign="center"
        gutter={(index, direction) => {
          const gutterEl = document.createElement('div');
          gutterEl.className = `gutter gutter-${direction}`;
          gutterEl.style.backgroundColor = '#ddd';
          gutterEl.style.cursor = 'col-resize';
          return gutterEl;
        }}
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
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>{instructions}</div>
          <Button
          outline={true}
            style={bottomButtonStyle}
            onClick={() => alert('Next part!')}
          >
            Next
          </Button>
        </aside>

        {/* Second split: CENTER (lesson) vs. RIGHT (feedback tabs) */}
        <Split
          direction="horizontal"
          sizes={[60, 40]} // 60% center, 40% feedback
          gutterSize={6}
          gutterAlign="center"
          gutter={(index, direction) => {
            const gutterEl = document.createElement('div');
            gutterEl.className = `gutter gutter-${direction}`;
            gutterEl.style.backgroundColor = '#ddd';
            gutterEl.style.cursor = 'col-resize';
            return gutterEl;
          }}
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

          {/* RIGHT PANE: feedback as Reactstrap tabs */}
          <aside style={{ padding: '1rem' }}>
            <FeedbackTabs
              activeTab={activeFeedbackTab}
              toggleTab={toggleFeedbackTab}
            />
          </aside>
        </Split>
      </Split>
    </div>
  );
}

/** 
 * Reactstrap-based tab panel for "Feedback", "Your notes", "Comments".
 * We pass in activeTab and toggleTab from the parent so we can share state.
 */
function FeedbackTabs({ activeTab, toggleTab }) {
  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'feedback' })}
            onClick={() => toggleTab('feedback')}
            style={{ cursor: 'pointer' }}
          >
            Feedback
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'notes' })}
            onClick={() => toggleTab('notes')}
            style={{ cursor: 'pointer' }}
          >
            Your notes
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'comments' })}
            onClick={() => toggleTab('comments')}
            style={{ cursor: 'pointer' }}
          >
            Comments
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab} style={{ padding: '1rem' }}>
        <TabPane tabId="feedback">
          <p>This could be your feedback messages, hints, or logs.</p>
        </TabPane>
        <TabPane tabId="notes">
          <p>Here the user can jot down personal notes.</p>
        </TabPane>
        <TabPane tabId="comments">
          <p>Discussion or comments about the lesson can go here.</p>
        </TabPane>
      </TabContent>
    </div>
  );
}

/** A small helper style for the 3 big "mobile" tab buttons. */
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

/** Bottom "Next" button style (for the instructions pane). */
const bottomButtonStyle = {
  marginTop: 'auto',
  padding: '0.5rem 1rem',
  border: 'none',
  backgroundColor: '#17a2b8',
  color: '#fff',
  cursor: 'pointer',
  alignSelf: 'flex-start',
};
