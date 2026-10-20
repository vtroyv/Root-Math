'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ReactPlayer from 'react-player';
import ThreePaneResponsive from '@/lib/components/learn/lessons/ThreePaneResponsive';
import { useLessonProgressStore } from '@/lib/zustand/providers/lesson-progress-provider';
import { useLessonStore } from '@/lib/zustand/providers/lesson-state-provider';
import {
  useMarkLessonTaskMutation,
  useGetLessonSolutionMutation,
  useSaveLessonProgressMutation,
} from '@/lib/redux/slices/apiSlice';
import { partTaskStates, isLessonComplete, taskKey } from '@/lib/lessons/progress';
import LessonInstructions from './LessonInstructions';
import LessonTasks from './LessonTasks';
import LessonFeedback from './LessonFeedback';

/*
A lesson in the tasks format (src/lib/docs/lessons.md). Three panes:
  left    the part's teaching blocks + a box per task (title, instructions, hint, tick)
  centre  the tasks themselves (question-part components), coloured once marked,
          with Save / Submit / Reset / Solution
  right   Feedback (Task 1, Task 2, ...), Notes, Comments, Review

Progress is in Zustand (useLessonProgressStore) and autosaves to MongoDB 1.5 s after an edit.
Tasks open one at a time; a task that's correct (or revealed) locks until Reset. Submit marks
the open task, Solution fills it in after asking whether the student would rather keep trying,
and Reset clears the whole part. Next needs every task in the part done.
*/

const AUTOSAVE_MS = 1500;

export default function LessonView({ lesson, initialProgress, nextLesson, openReview }) {
  const progress = useLessonProgressStore((s) => s.progress);
  const setProgress = useLessonProgressStore((s) => s.setProgress);
  const updateProgress = useLessonProgressStore((s) => s.updateProgress);
  const setTaskEntry = useLessonProgressStore((s) => s.setTaskEntry);
  const clearTasks = useLessonProgressStore((s) => s.clearTasks);

  const [markTask, { isLoading: marking }] = useMarkLessonTaskMutation();
  const [getSolution, { isLoading: revealing }] = useGetLessonSolutionMutation();
  const [saveProgress] = useSaveLessonProgressMutation();

  const [saveState, setSaveState] = useState('saved'); // saved | unsaved | saving | error
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null); // { color, text, link? }
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [confirmingReveal, setConfirmingReveal] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [versions, setVersions] = useState({}); // per task: bumped to remount it with a new answer
  const [feedbackSignal, setFeedbackSignal] = useState(0);

  // load this student's progress into the store (and clear it when leaving the lesson)
  useEffect(() => {
    setProgress(initialProgress);
    return () => setProgress(null);
  }, [initialProgress, setProgress]);

  const current = progress ?? initialProgress; // the store is filled after the first render
  const parts = lesson.parts;
  const partIndex = Math.min(Math.max(current.currentPart ?? 0, 0), parts.length - 1);
  const part = parts[partIndex];
  const states = partTaskStates(part, current.tasks);
  const openState = states.find((s) => s.open);
  const partDone = states.every((s) => s.done);
  const lessonComplete = isLessonComplete(lesson, current.tasks);

  // MyTutor reads the lesson and current tasks from the lesson store
  useEffect(() => {
    useLessonStore.setState({ lesson, tasks: part.tasks ?? [], currentPart: partIndex });
  }, [lesson, part, partIndex]);

  // ─── saving ────────────────────────────────────────────────────────────
  const persist = async () => {
    const toSave = useLessonProgressStore.getState().progress;
    if (!toSave) return;
    setSaveState('saving');
    try {
      const saved = await saveProgress({ slug: lesson.slug, progress: { currentPart: toSave.currentPart, tasks: toSave.tasks } }).unwrap();
      updateProgress({ completed: saved.completed });
      setSaveState('saved');
      if (saved.newlyCompleted) {
        setNotice({
          color: 'success',
          text: `Lesson complete!${lesson.reviewCount ? ' Its review cards are now unlocked in the Review tab.' : ''}`,
          link: nextLesson?.href ? { href: nextLesson.href, text: `Next lesson: ${nextLesson.title}` } : null,
        });
      }
    } catch (e) {
      console.error('Saving lesson progress failed:', e);
      setSaveState('error');
    }
  };

  const timer = useRef(null);
  useEffect(() => {
    if (saveState !== 'unsaved') return;
    clearTimeout(timer.current);
    timer.current = setTimeout(persist, AUTOSAVE_MS);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.tasks, saveState]);

  const handleChange = (key, response) => {
    setTaskEntry(key, { response });
    setSaveState('unsaved');
  };

  const remount = (keys) => setVersions((v) => Object.fromEntries([...Object.entries(v), ...keys.map((k) => [k, (v[k] ?? 0) + 1])]));

  // ─── marking ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError(null);
    setNotice(null);
    if (!openState) {
      setNotice({ color: 'info', text: partDone && states.length ? 'Every task in this part is done. Press Next to carry on.' : 'There is nothing to submit in this part.' });
      return;
    }
    clearTimeout(timer.current);
    const key = taskKey(part.id, openState.task.id);
    const response = openState.entry.response;
    try {
      const { result } = await markTask({ slug: lesson.slug, partId: part.id, taskId: openState.task.id, response }).unwrap();
      setTaskEntry(key, { result, markedResponse: response });
      setFeedbackSignal((n) => n + 1);
      await persist();
    } catch (e) {
      console.error('Marking failed:', e);
      setError(e?.data?.error ?? 'Marking failed. Please try again.');
    }
  };

  // ─── solution ──────────────────────────────────────────────────────────
  const handleSolution = () => {
    setNotice(null);
    if (!openState) {
      setNotice({ color: 'info', text: 'Every task in this part is already done.' });
      return;
    }
    setConfirmingReveal(true);
  };

  const revealSolution = async () => {
    setConfirmingReveal(false);
    setError(null);
    const task = openState.task;
    const key = taskKey(part.id, task.id);
    try {
      const { response, solution } = await getSolution({ slug: lesson.slug, partId: part.id, taskId: task.id }).unwrap();
      const filled = response ?? openState.entry.response ?? null;
      setTaskEntry(key, { response: filled, markedResponse: filled, result: null, revealed: true, solution });
      remount([key]);
      setFeedbackSignal((n) => n + 1);
      await persist();
    } catch (e) {
      console.error('Revealing the solution failed:', e);
      setError(e?.data?.error ?? "The solution couldn't be loaded. Please try again.");
    }
  };

  // ─── reset (the current part) ──────────────────────────────────────────
  const confirmReset = async () => {
    setConfirmingReset(false);
    const keys = (part.tasks ?? []).map((t) => taskKey(part.id, t.id));
    clearTasks(keys);
    remount(keys);
    await persist();
    setNotice({ color: 'success', text: 'This part has been cleared, so you can start it again.' });
  };

  // ─── navigation ────────────────────────────────────────────────────────
  const goTo = async (index) => {
    setNotice(null);
    setError(null);
    updateProgress({ currentPart: index });
    await persist();
  };

  const handleNext = () => {
    if (!partDone) {
      setNotice({ color: 'warning', text: 'Finish every task in this part before moving on.' });
      return;
    }
    if (partIndex < parts.length - 1) {
      goTo(partIndex + 1);
      return;
    }
    // Finish on the last part
    setNotice(
      lessonComplete
        ? {
            color: 'success',
            text: `You've finished this lesson.${lesson.reviewCount ? ' Its review cards are in the Review tab.' : ''}`,
            link: nextLesson?.href ? { href: nextLesson.href, text: `Next lesson: ${nextLesson.title}` } : null,
          }
        : { color: 'warning', text: 'Some earlier parts still have tasks to finish. Go Back to find them.' },
    );
  };

  // ─── render ────────────────────────────────────────────────────────────
  const saveLabel = { saved: 'Saved', unsaved: 'Unsaved changes', saving: 'Saving…', error: 'Save failed' }[saveState];
  const hasTasks = states.length > 0;

  // fade={false} on alerts and modals: no show/hide animation (styling preference)
  const footer = (
    <>
      {confirmingReset && (
        <Alert color="warning" fade={false} style={{ margin: '0.5rem 0 0' }}>
          <strong>Clear every task in this part?</strong>
          <p style={{ margin: '0.25rem 0 0.75rem' }}>Your answers in this part will be emptied and it will start again from task 1. Other parts aren&apos;t affected.</p>
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button color="danger" size="sm" onClick={confirmReset}>
              Clear this part
            </Button>
            <Button color="secondary" size="sm" outline onClick={() => setConfirmingReset(false)}>
              Cancel
            </Button>
          </div>
        </Alert>
      )}
      {notice && (
        <Alert color={notice.color} fade={false} style={{ margin: '0.5rem 0 0' }} toggle={() => setNotice(null)}>
          {notice.text}
          {notice.link && (
            <>
              {' '}
              <Link href={notice.link.href}>{notice.link.text}</Link>
            </>
          )}
        </Alert>
      )}
      {error && (
        <Alert color="danger" fade={false} style={{ margin: '0.5rem 0 0' }} toggle={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1rem', flexWrap: 'wrap' }}>
        <Button color="secondary" outline onClick={persist} disabled={!progress}>
          Save
        </Button>
        <span style={{ fontSize: '0.85rem', color: saveState === 'error' ? '#dc3545' : '#6c757d', minWidth: '6.5rem' }}>{saveLabel}</span>
        <Button color="info" style={{ flex: 1 }} onClick={handleSubmit} disabled={marking || !hasTasks}>
          {marking ? 'Marking…' : 'Submit'}
        </Button>
        <Button color="secondary" outline onClick={() => setConfirmingReset(true)} disabled={!progress || !hasTasks}>
          Reset
        </Button>
        <Button color="secondary" outline onClick={handleSolution} disabled={revealing || !hasTasks}>
          {revealing ? 'Loading…' : 'Solution'}
        </Button>
      </div>
    </>
  );

  return (
    <>
      <div style={{ position: 'relative' }}>
        {part.video && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '-3rem',
                right: '5rem',
                textAlign: 'right',
                lineHeight: 1.2,
                fontSize: '0.875rem',
                color: '#17a2b8',
                fontWeight: '500',
              }}
            >
              <div>Are you a visual learner?</div>
              <div>
                Watch a video for this part<span style={{ fontSize: '1.2rem' }}>→</span>
              </div>
            </div>
            <Button
              color="info"
              outline
              className="rounded-circle"
              onClick={() => setVideoOpen(true)}
              style={{
                position: 'absolute',
                top: '-3.5rem',
                right: '1rem',
                width: '3rem',
                height: '3rem',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                boxShadow: '0 0 8px rgba(23,162,184,0.7)',
              }}
              title="Watch a video for this part"
              aria-label="Watch a video for this part"
            >
              🎥
            </Button>
          </>
        )}

        <ThreePaneResponsive
          instructions={
            <LessonInstructions
              part={part}
              partIndex={partIndex}
              totalParts={parts.length}
              states={states}
              onBack={() => goTo(partIndex - 1)}
              onNext={handleNext}
            />
          }
          mainContent={<LessonTasks part={part} states={states} versions={versions} onChange={handleChange} footer={footer} />}
          feedbackData={{
            feedback: <LessonFeedback part={part} states={states} slug={lesson.slug} openReview={openReview} feedbackSignal={feedbackSignal} />,
          }}
        />
      </div>

      {/* the part's video: Wistia, played the same way as "See how it works" on the home page */}
      <Modal isOpen={videoOpen} toggle={() => setVideoOpen(false)} size="lg" centered fade={false}>
        <div style={{ aspectRatio: '16 / 9', width: '100%' }}>
          {videoOpen && <ReactPlayer url={part.video} controls playing width="100%" height="100%" />}
        </div>
      </Modal>

      <Modal isOpen={confirmingReveal} toggle={() => setConfirmingReveal(false)} centered fade={false}>
        <ModalHeader toggle={() => setConfirmingReveal(false)}>Have another go first?</ModalHeader>
        <ModalBody>
          <p>
            You&apos;ll learn much more by working the task out yourself, even if it takes a few tries. Attempting it is what makes sure
            you&apos;ve really understood this part of the lesson.
          </p>
          <p style={{ marginBottom: 0 }}>
            If you reveal the solution, the answer is filled in for you and the task counts as done. The worked solution appears in the
            Feedback tab.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="info" onClick={() => setConfirmingReveal(false)}>
            Keep trying
          </Button>
          <Button color="secondary" outline onClick={revealSolution}>
            Reveal solution anyway
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
