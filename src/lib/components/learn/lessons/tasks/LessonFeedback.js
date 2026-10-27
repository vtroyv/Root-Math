'use client';
import { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import BlockRenderer from '@/lib/components/learn/lessons/BlockRenderer';
import NotesPane from '@/lib/components/learn/lessons/feedback/NotesPane';
import CommentsPane from '@/lib/components/learn/lessons/feedback/CommentsPane';
import ReviewPane from '@/lib/components/questions/reviews/ReviewPane';
import { useGetLessonReviewsQuery } from '@/lib/redux/slices/apiSlice';
import { localToday } from '@/lib/reviews/localDay';
import { STATUS_TEXT, statusColour } from './LessonTasks';

/*
The lesson page's right pane. Feedback has one card per task of the current part (Task 1,
Task 2, ...): every task's written feedback is here, not under the task. Notes and Comments
are the existing lesson panes. Review = the lesson's flashcards (unlocked once the lesson is complete).
`feedbackSignal` goes up each time a task is marked or revealed, which switches to the Feedback tab.
*/

// no fixed height: the tab area scrolls, so the pane never runs past the bottom of the screen
const frame = {
  padding: '1.5rem',
  background: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  margin: '0 auto',
  boxSizing: 'border-box',
};

export default function LessonFeedback({ part, states, slug, openReview, feedbackSignal }) {
  const [activeTab, setActiveTab] = useState(openReview ? 'review' : 'feedback');
  const lastSignal = useRef(feedbackSignal);
  useEffect(() => {
    if (feedbackSignal === lastSignal.current) return;
    lastSignal.current = feedbackSignal;
    setActiveTab('feedback');
  }, [feedbackSignal]);

  const tab = (id, label) => (
    <NavItem>
      <NavLink className={classnames({ active: activeTab === id })} onClick={() => setActiveTab(id)} style={{ cursor: 'pointer' }}>
        {label}
      </NavLink>
    </NavItem>
  );

  return (
    <div style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Nav tabs>
        {tab('feedback', 'Feedback')}
        {tab('notes', 'Your Notes')}
        {tab('comments', 'Comments')}
        {tab('review', <ReviewTabLabel slug={slug} />)}
      </Nav>
      <TabContent activeTab={activeTab} style={{ padding: '1rem', flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <TabPane tabId="feedback">
          <TaskFeedback states={states} />
        </TabPane>
        <TabPane tabId="notes">
          <NotesPane part={part} />
        </TabPane>
        <TabPane tabId="comments">
          <CommentsPane part={part} />
        </TabPane>
        <TabPane tabId="review">
          <ReviewPane lessonSlug={slug} />
        </TabPane>
      </TabContent>
    </div>
  );
}

// "Review · 3": cards due. Shares ReviewPane's cached query, so no extra request.
function ReviewTabLabel({ slug }) {
  const [today] = useState(localToday);
  const { data } = useGetLessonReviewsQuery({ slug, today });
  return (
    <>
      Review{data?.dueCount > 0 && <strong style={{ color: '#17a2b8' }}> · {data.dueCount}</strong>}
    </>
  );
}

function TaskFeedback({ states }) {
  return (
    <div style={frame}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Feedback</h3>
      {states.length === 0 && <p style={{ color: '#495057' }}>There are no tasks in this part.</p>}
      {states.map((state, i) => (
        <TaskFeedbackCard key={state.task.id} index={i} state={state} />
      ))}
    </div>
  );
}

function TaskFeedbackCard({ index, state }) {
  const { entry, status, stale } = state;
  const result = entry.result;

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderLeft: `4px solid ${status ? statusColour(status) : '#ddd'}`,
        borderRadius: '4px',
        padding: '0.75rem',
        marginBottom: '0.75rem',
        background: '#fff',
      }}
    >
      <h4 style={{ margin: '0 0 0.5rem', color: '#17a2b8', fontWeight: 'bold', fontSize: '1.15rem' }}>
        Task {index + 1}
        {status && (
          <span style={{ marginLeft: '0.5rem', fontSize: '0.95rem', color: statusColour(status) }}>
            {status === 'revealed' ? STATUS_TEXT.revealed : result && result.status !== 'unanswered' ? `${result.marksAwarded} / ${result.marksAvailable}` : STATUS_TEXT[status]}
          </span>
        )}
      </h4>

      {!status &&<p style={{ margin: 0, color: '#6c757d' }}>No feedback yet for this task.</p>}
      {stale && <p style={{ margin: '0 0 0.25rem', color: '#6c757d' }}>(You&apos;ve changed your answer since this was marked. Submit again.)</p>}

      {status === 'revealed' ? (
        <>
          <p style={{ margin: '0 0 0.25rem' }}>
            You revealed the solution, so the answer has been filled in. Read through the working below and make sure you could do it yourself.
          </p>
          {(entry.solution ?? []).map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </>
      ) : (
        (result?.feedback ?? []).map((block, i) => <BlockRenderer key={i} block={block} />)
      )}
    </div>
  );
}
