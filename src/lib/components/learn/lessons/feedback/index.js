// /lib/components/learn/feedback/index.jsx
'use client';

import React, { useState } from 'react';
import classnames from 'classnames';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

// Import your 3 subcomponents (default exports)
import FeedbackPane from './FeedBackPane';
import NotesPane from './NotesPane';
import CommentsPane from './CommentsPane';

export default function Feedback({ part }) {
  const [activeTab, setActiveTab] = useState('feedback');

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
      
      <TabContent activeTab={activeTab} style={{ padding: '1rem', flex: 1 }}>
        <TabPane tabId="feedback">
          <FeedbackPane part={part} />
        </TabPane>
        <TabPane tabId="notes">
          <NotesPane part={part} />
        </TabPane>
        <TabPane tabId="comments">
          <CommentsPane part={part} />
        </TabPane>
      </TabContent>
    </div>
  );
}
