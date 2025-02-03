// /lib/components/learn/lessons/feedback/index.jsx
'use client';
import React, { useState } from 'react';
import classnames from 'classnames';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import FeedbackPane from './FeedBackPane';
import NotesPane from './NotesPane';
import CommentsPane from './CommentsPane';

export default function Feedback({ part, extraFeedback }) {
  const [activeTab, setActiveTab] = useState('feedback');
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'feedback' })}
            onClick={() => toggle('feedback')}
            style={{ cursor: 'pointer' }}
          >
            Feedback
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'notes' })}
            onClick={() => toggle('notes')}
            style={{ cursor: 'pointer' }}
          >
            Your Notes
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'comments' })}
            onClick={() => toggle('comments')}
            style={{ cursor: 'pointer' }}
          >
            Comments
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab} style={{ padding: '1rem', flex: 1 }}>
        <TabPane tabId="feedback">
          <FeedbackPane part={part} extraFeedback={extraFeedback} />
        </TabPane>
        <TabPane tabId="notes" >
          <NotesPane part={part}/>
        </TabPane>
        <TabPane tabId="comments" >
          <CommentsPane part={part}/>
        </TabPane>
      </TabContent>
    </div>
  );
}
