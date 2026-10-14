'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { Alert, Button } from 'reactstrap';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import BlockRenderer from '@/lib/components/learn/lessons/BlockRenderer';
import NextQuestions from '../other-question-components/NextQuestions';
import { useDrawerStore } from '@/lib/zustand/providers/question-drawer-state-provider';
import { useQuestionStore } from '@/lib/zustand/providers/question-state-provider';
import { useDispatch } from 'react-redux';
import {
  apiSlice,
  useGetQuestionsQuery,
  useMarkQuestionMutation,
  useUpdateQuestionProgressMutation,
} from '@/lib/redux/slices/apiSlice';
import PartRenderer from './PartRenderer';

/*
Renders any parts-based question (`question.parts`). A single-part question is
just a list of one.

Progress lives in Zustand at userProgress.componentProgress[i]:
  { response,          // what the student has entered for part i
    result,            // latest marking result for part i
    markedResponse }   // the response that `result` was for (to detect edits since)

Edits autosave to MongoDB after a short pause; Submit marks every part via /api/mark.
*/

const AUTOSAVE_MS = 1500;
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

const formatTitle = (title = '') =>
  title
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');

export default function QuestionParts({ question }) {
  const router = useRouter();
  const { user } = useUser();
  const progress = useQuestionStore((s) => s.userProgress);
  const updateProgress = useQuestionStore((s) => s.updateProgress);
  const setComponentProgressAt = useQuestionStore((s) => s.setComponentProgressAt);
  const openDrawer = useDrawerStore((s) => s.open);

  const [markQuestion, { isLoading: isMarking }] = useMarkQuestionMutation();
  const [saveProgress] = useUpdateQuestionProgressMutation();
  const dispatch = useDispatch();

  const [saveState, setSaveState] = useState('saved'); // saved | unsaved | saving | error
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0); // bumped on Reset to remount the parts
  const [confirmingReset, setConfirmingReset] = useState(false); // shows the "clear answers?" alert
  const [notice, setNotice] = useState(null); // short success message, e.g. after a reset

  const parts = question.parts ?? [];
  const componentProgress = progress?.componentProgress ?? [];
  // a lone working/explain/choice part stretches to fill the panel (full-height answer box or full-panel options)
  const fill = parts.length === 1 && ['working', 'explain', 'choice'].includes(parts[0].type);
  const examBoard = user?.unsafeMetadata?.examBoard;

  // ─── saving ────────────────────────────────────────────────────────────
  const persist = async (toSave) => {
    if (!toSave?.userId || !user) return; // progress never loaded -> nothing valid to save
    setSaveState('saving');
    try {
      await saveProgress({
        collectionIdentifier: { userId: user.id, examBoard, title: question.title, branch: question.branch, year: question.year },
        progress: { ...toSave, updatedAt: new Date().toISOString() },
      }).unwrap();
      setSaveState('saved');
      // completing (or revealing) can unlock review cards: refresh the Review tab without a reload
      if (toSave.status === 'complete' || toSave.solutionRevealed) {
        dispatch(apiSlice.util.invalidateTags([{ type: 'Reviews', id: question.title }]));
      }
    } catch (e) {
      console.error('Saving progress failed:', e);
      setSaveState('error');
    }
  };

  // "Reveal solution" (Solution tab) sets solutionRevealed in the store; save it straight away
  // so the question's review cards unlock (see /api/reviews/question/[title]). Only saves on
  // the change from not-revealed to revealed, not when an already-revealed question loads.
  const revealed = progress?.solutionRevealed === true;
  const wasRevealed = useRef(revealed);
  useEffect(() => {
    if (revealed && !wasRevealed.current) persist(useQuestionStore.getState().userProgress);
    wasRevealed.current = revealed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  // autosave a moment after the student stops editing
  const timer = useRef(null);
  useEffect(() => {
    if (saveState !== 'unsaved') return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => persist(useQuestionStore.getState().userProgress), AUTOSAVE_MS);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentProgress, saveState]);

  const handleChange = (index, response) => {
    setComponentProgressAt(index, { response });
    setSaveState('unsaved');
  };

  // ─── marking ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError(null);
    setNotice(null);
    clearTimeout(timer.current);
    const responses = parts.map((_, i) => componentProgress[i]?.response);
    try {
      const marked = await markQuestion({ title: question.title, responses }).unwrap();
      const latest = useQuestionStore.getState().userProgress ?? {};
      const newProgress = {
        ...latest,
        componentProgress: parts.map((_, i) => ({
          ...(latest.componentProgress?.[i] ?? {}),
          result: marked.results[i],
          markedResponse: responses[i],
        })),
        attempts: (latest.attempts ?? 0) + 1,
        status: marked.status,
        marks: { awarded: marked.marksAwarded, available: marked.marksAvailable },
        feedback: [...(latest.feedback ?? []), marked.feedback],
      };
      updateProgress(newProgress);
      await persist(newProgress);
    } catch (e) {
      console.error('Marking failed:', e);
      setError(e?.data?.error ?? 'Marking failed. Please try again.');
    }
  };

  // Reset button -> show the confirm alert (replaces the browser's window.confirm pop-up)
  const handleReset = () => {
    setNotice(null);
    setConfirmingReset(true);
  };

  // confirmed: clears answers + results but keeps attempts and the feedback history
  const confirmReset = async () => {
    setConfirmingReset(false);
    const latest = useQuestionStore.getState().userProgress ?? {};
    const newProgress = { ...latest, componentProgress: [] };
    updateProgress(newProgress);
    setVersion((v) => v + 1);
    await persist(newProgress);
    setNotice('Your answers have been cleared. Your attempt history is kept.');
  };

  // ─── next question drawer ──────────────────────────────────────────────
  const { data: allQuestions } = useGetQuestionsQuery(user ? { userId: user.id, examBoard } : skipToken);
  const problems = (Array.isArray(allQuestions) ? allQuestions : [])
    .filter((q) => q.title !== question.title)
    .sort((a, b) => (a.topic === question.topic ? 0 : 1) - (b.topic === question.topic ? 0 : 1))
    .map((q) => ({ id: q._id, slug: q.title, title: formatTitle(q.title), topic: q.topic, difficulty: q.difficulty }));

  // ─── render ────────────────────────────────────────────────────────────
  const saveLabel = { saved: 'Saved', unsaved: 'Unsaved changes', saving: 'Saving…', error: 'Save failed' }[saveState];

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          height: '100%',
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{ color: '#17a2b8', fontWeight: 'bold', textAlign: 'center', margin: '0 0 0.5rem' }}>
          {formatTitle(question.title)}
        </h1>
        {progress?.marks && (
          <p style={{ textAlign: 'center', margin: '0 0 0.5rem', color: '#6c757d' }}>
            Last attempt: {progress.marks.awarded} / {progress.marks.available} marks · Attempts: {progress.attempts}
          </p>
        )}

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '0.5rem',
            ...(fill && { display: 'flex', flexDirection: 'column', minHeight: 0 }),
          }}
        >
          {question.stem?.map((block, i) => <BlockRenderer key={i} block={block} />)}
          {!question.stem && question.latex && (
            <p style={{ fontSize: '1.25rem' }}>
              <Latex>{`$${question.latex}$`}</Latex>
            </p>
          )}

          {parts.map((part, i) => {
            const entry = componentProgress[i] ?? {};
            return (
              <PartRenderer
                key={`${version}-${i}`}
                part={part}
                index={i}
                showLabel={parts.length > 1}
                response={entry.response}
                result={entry.result}
                stale={!!entry.result && !same(entry.response, entry.markedResponse)}
                onChange={(response) => handleChange(i, response)}
                fill={fill}
              />
            );
          })}
        </div>

        {/* fade={false} on every alert: no show/hide animation, per the no-animation styling preference */}
        {confirmingReset && (
          <Alert color="warning" fade={false} style={{ margin: '0.5rem 0 0' }}>
            <strong>Clear all your answers for this question?</strong>
            <p style={{ margin: '0.25rem 0 0.75rem' }}>
              Every part will be emptied so you can start again. Your attempts and past feedback are kept.
            </p>
            <div style={{ display: 'flex', gap: '5px' }}>
              <Button color="danger" size="sm" onClick={confirmReset}>
                Clear answers
              </Button>
              <Button color="secondary" size="sm" outline onClick={() => setConfirmingReset(false)}>
                Cancel
              </Button>
            </div>
          </Alert>
        )}
        {notice && (
          <Alert color="success" fade={false} style={{ margin: '0.5rem 0 0' }} toggle={() => setNotice(null)}>
            {notice}
          </Alert>
        )}
        {error && (
          <Alert color="danger" fade={false} style={{ margin: '0.5rem 0 0' }} toggle={() => setError(null)}>
            {error}
          </Alert>
        )}
        {!progress && (
          <Alert color="warning" fade={false} style={{ margin: '0.5rem 0 0' }}>
            Your progress couldn&apos;t be loaded, so answers won&apos;t be saved. Try refreshing.
          </Alert>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Button color="secondary" outline onClick={() => persist(useQuestionStore.getState().userProgress)} disabled={!progress}>
            Save
          </Button>
          <span style={{ fontSize: '0.85rem', color: saveState === 'error' ? '#dc3545' : '#6c757d', minWidth: '7rem' }}>
            {saveLabel}
          </span>
          <Button color="info" style={{ flex: 1 }} onClick={handleSubmit} disabled={isMarking}>
            {isMarking ? 'Marking…' : 'Submit'}
          </Button>
          <Button color="secondary" outline onClick={handleReset} disabled={!progress}>
            Reset
          </Button>
          <Button color="secondary" outline onClick={openDrawer}>
            Next
          </Button>
        </div>
      </div>
      <NextQuestions problems={problems} onSelect={(q) => router.push(`/learn/questions/${q.slug}`)} />
    </div>
  );
}
