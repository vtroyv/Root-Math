'use client';
import { Button } from 'reactstrap';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import ImageWithEnlarge from '@/lib/components/learn/lessons/ImageWithEnlarge';
import { BODIES, STATUS_COLOURS } from '@/lib/components/questions/parts/PartRenderer';
import { taskKey } from '@/lib/lessons/progress';

/*
The lesson page's centre pane: the current part's tasks, answered with the same components as
question parts. Only colour is shown here (a coloured edge and a one-line status); the written
feedback goes in the Feedback tab on the right, and hints are in the task boxes on the left.
Every task can be answered at once; each has its own Solution button until it's done.
`footer` = the alerts and Save / Submit / Reset row, from LessonView, pinned under the tasks.
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

export default function LessonTasks({ part, states, versions, onChange, onSolution, revealing, footer }) {
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
          // remount when the task is reset or has a solution filled in, so it shows the new answer
          const mountKey = `${key}-${versions[key] ?? 0}`;
          return (
            <TaskCard
              key={mountKey}
              index={i}
              state={state}
              onChange={(response) => onChange(key, response)}
              onSolution={() => onSolution(state.task.id)}
              revealing={revealing}
            />
          );
        })}
      </div>
      {footer}
    </div>
  );
}

function TaskCard({ index, state, onChange, onSolution, revealing }) {
  const { task, entry, done, status, stale, pending } = state;
  const Body = BODIES[task.type];
  const shownStatus = stale ? null : status;

  return (
    <section
      style={{
        background: '#fff',
        border: '1px solid #dee2e6',
        borderLeft: `6px solid ${shownStatus ? statusColour(shownStatus) : '#dee2e6'}`,
        borderRadius: '6px',
        padding: '0.75rem 1rem',
        marginBottom: '0.75rem',
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

      {Body ? (
        <Body part={task} response={entry.response} result={stale ? null : entry.result} onChange={onChange} locked={done} />
      ) : (
        <p style={{ color: '#dc3545' }}>Unknown task type &quot;{task.type}&quot;.</p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        <p style={{ flex: 1, margin: 0, fontSize: '0.9rem', color: shownStatus ? statusColour(shownStatus) : '#6c757d', fontWeight: shownStatus ? 'bold' : 'normal' }}>
          {stale
            ? 'Changed since marking: press Submit to mark it again.'
            : shownStatus
              ? STATUS_TEXT[shownStatus]
              : pending
                ? 'Answered: press Submit to mark it.'
                : 'Answer this task, then press Submit.'}
        </p>
        {!done && (
          <Button size="sm" color="secondary" outline onClick={onSolution} disabled={revealing}>
            Solution
          </Button>
        )}
      </div>
    </section>
  );
}
