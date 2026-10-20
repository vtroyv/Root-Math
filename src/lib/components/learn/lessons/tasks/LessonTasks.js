'use client';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import ImageWithEnlarge from '@/lib/components/learn/lessons/ImageWithEnlarge';
import { BODIES, STATUS_COLOURS } from '@/lib/components/questions/parts/PartRenderer';
import { taskKey } from '@/lib/lessons/progress';

/*
The lesson page's centre pane: the current part's tasks, answered with the same components as
question parts. Only colour is shown here (a coloured edge and a one-line status); the written
feedback goes in the Feedback tab on the right, and hints are in the task boxes on the left.
The open task has a teal border; tasks after it are greyed out until it's done.
`footer` = the alerts and Save / Submit / Reset / Solution row, from LessonView.
*/

export const STATUS_TEXT = {
  correct: 'Correct',
  partial: 'Partly correct: see Feedback',
  incorrect: 'Not quite: see Feedback',
  unanswered: 'Not answered yet',
  error: "Couldn't be marked: try again",
  revealed: 'Solution revealed',
};
export const REVEALED_COLOUR = '#17a2b8';
export const statusColour = (status) => (status === 'revealed' ? REVEALED_COLOUR : STATUS_COLOURS[status] ?? '#dee2e6');

export default function LessonTasks({ part, states, versions, onChange, footer }) {
  return (
    <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '0.25rem' }}>
        {states.length === 0 && (
          <p style={{ fontSize: '1.1rem', color: '#495057', textAlign: 'center', margin: '2rem 1rem' }}>
            There are no tasks in this part. Read through it on the left, then press <strong>Next</strong>.
          </p>
        )}
        {states.map((state, i) => {
          const key = taskKey(part.id, state.task.id);
          // remount when the task unlocks, is reset or has a solution filled in, so it shows the new answer
          const mountKey = `${key}-${versions[key] ?? 0}-${state.locked ? 'locked' : 'open'}`;
          return <TaskCard key={mountKey} index={i} state={state} onChange={(response) => onChange(key, response)} />;
        })}
      </div>
      {footer}
    </div>
  );
}

function TaskCard({ index, state, onChange }) {
  const { task, entry, done, open, locked, status, stale } = state;
  const Body = BODIES[task.type];
  const shownStatus = stale ? null : status;

  return (
    <section
      style={{
        background: '#fff',
        border: open ? '2px solid #17a2b8' : '1px solid #dee2e6',
        borderLeft: `6px solid ${shownStatus ? statusColour(shownStatus) : '#dee2e6'}`,
        borderRadius: '6px',
        padding: '0.75rem 1rem',
        marginBottom: '0.75rem',
        opacity: locked ? 0.5 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <strong style={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }}>Task {index + 1}</strong>
        <div style={{ flex: 1, fontSize: '1.1rem' }}>
          <Latex>{task.prompt ?? ''}</Latex>
        </div>
      </div>

      {task.image && (
        <ImageWithEnlarge url={task.image.url} alt={task.image.alt} caption={task.image.caption} width={task.image.width} height={task.image.height} />
      )}

      {/* locked tasks are shown so the student can see what's coming, but can't be answered yet */}
      <div style={{ pointerEvents: locked ? 'none' : 'auto' }} aria-disabled={locked}>
        {Body ? (
          <Body part={task} response={entry.response} result={stale ? null : entry.result} onChange={onChange} locked={done || locked} />
        ) : (
          <p style={{ color: '#dc3545' }}>Unknown task type &quot;{task.type}&quot;.</p>
        )}
      </div>

      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: shownStatus ? statusColour(shownStatus) : '#6c757d', fontWeight: shownStatus ? 'bold' : 'normal' }}>
        {locked
          ? 'Finish the task above to unlock this one.'
          : stale
            ? 'Changed since marking: submit again.'
            : shownStatus
              ? STATUS_TEXT[shownStatus]
              : 'Answer this task, then press Submit.'}
      </p>
    </section>
  );
}
