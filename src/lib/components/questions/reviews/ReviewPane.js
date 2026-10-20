'use client';
import { useState } from 'react';
import { Alert, Button, Spinner } from 'reactstrap';
import { useGetQuestionReviewsQuery, useGetLessonReviewsQuery, useRateReviewCardMutation } from '@/lib/redux/slices/apiSlice';
import { localToday, whenDue } from '@/lib/reviews/localDay';
import { lessonCardsTitle } from '@/lib/reviews/cards';
import ReviewCard from './ReviewCard';

/*
The question page's Review tab (design: src/lib/docs/question-reviews.md section 7).
  locked        "Finish this question to unlock its review cards"
  cards due     "Start review" -> a session, one card at a time; Again sends a card to the back
  caught up     next review date + "Practise anyway" (practice doesn't move the schedule,
                except that Again brings a card back tomorrow)
  finished      a short summary
The session queue is a snapshot taken when it starts, so the refetch after each rating
(which keeps the tab's due count up to date) can't reshuffle cards mid-session.

Also the lesson page's Review tab: pass `lessonSlug` instead of `title`. A lesson's cards
unlock when the whole lesson is complete and are shuffled for each session, so they don't
follow the order of the lesson's parts (src/lib/docs/lessons.md).
*/

const frame = {
  padding: '1.5rem',
  height: '80vh',
  background: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  margin: '1rem auto',
  boxSizing: 'border-box',
  overflowY: 'auto',
};
const heading = { textAlign: 'center', marginBottom: '1rem', textDecoration: 'underline', fontWeight: 'bold', color: '#17a2b8' };

// Fisher-Yates
const shuffled = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export default function ReviewPane({ title: questionTitle, lessonSlug }) {
  const [today] = useState(localToday);
  const isLesson = Boolean(lessonSlug);
  // the "title" the check/rate routes know these cards by: a question title, or 'lesson:<slug>'
  const title = isLesson ? lessonCardsTitle(lessonSlug) : questionTitle;
  const questionReviews = useGetQuestionReviewsQuery({ title: questionTitle, today }, { skip: isLesson });
  const lessonReviews = useGetLessonReviewsQuery({ slug: lessonSlug, today }, { skip: !isLesson });
  const { data, isLoading, error } = isLesson ? lessonReviews : questionReviews;
  const what = isLesson ? 'lesson' : 'question';
  const [rateCard, { isLoading: rating }] = useRateReviewCardMutation();

  const [session, setSession] = useState(null); // { mode, queue, position, reviewed, again, nextDue }
  const [rateError, setRateError] = useState(null);

  const start = (mode) => {
    const cards = mode === 'review' ? data.cards.filter((c) => c.isDue) : data.cards;
    setRateError(null);
    setSession({ mode, queue: isLesson ? shuffled(cards) : cards, position: 0, reviewed: 0, again: 0, finished: false });
  };

  const handleRate = async (ratingValue) => {
    const card = session.queue[session.position];
    setRateError(null);
    try {
      const result = await rateCard({ title, cardId: card.id, rating: ratingValue, mode: session.mode, today }).unwrap();
      setSession((s) => {
        const queue = ratingValue === 'again' ? [...s.queue, card] : s.queue; // see it again this session
        const position = s.position + 1;
        return {
          ...s,
          queue,
          position,
          reviewed: s.reviewed + 1,
          again: s.again + (ratingValue === 'again' ? 1 : 0),
          lastDue: result.due,
          finished: position >= queue.length,
        };
      });
    } catch {
      setRateError("Couldn't save that rating. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div style={{ ...frame, textAlign: 'center' }}>
        <Spinner color="info" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div style={frame}>
        <Alert color="danger" fade={false}>
          Review cards couldn&apos;t be loaded. Try refreshing the page.
        </Alert>
      </div>
    );
  }

  return (
    <div style={frame}>
      <h1 style={heading}>Review</h1>

      {!data.hasCards && <Message>No review cards for this {what} yet.</Message>}

      {data.hasCards && !data.unlocked && (
        <Message icon="bi-lock-fill">
          {isLesson
            ? 'Finish every part of this lesson to unlock its review cards. They come in a random order, to check you really know the ideas, not just the order of the lesson.'
            : 'Finish this question to unlock its review cards. Once it\u2019s complete (or you reveal the solution), short review cards will help you keep the method fresh.'}
        </Message>
      )}

      {data.unlocked && !session && (
        <Overview data={data} today={today} what={what} onStart={() => start('review')} onPractise={() => start('practice')} />
      )}

      {session && !session.finished && (
        <>
          {session.mode === 'practice' && (
            <Alert color="info" fade={false} style={{ padding: '0.5rem 0.75rem' }}>
              Practice: this doesn&apos;t change your review schedule (except that Again brings a card back tomorrow).
            </Alert>
          )}
          <p style={{ color: '#6c757d', margin: '0 0 0.75rem' }}>
            Card {session.position + 1} of {session.queue.length}
          </p>
          <ReviewCard
            key={`${session.mode}-${session.position}`}
            card={session.queue[session.position]}
            title={title}
            onRate={handleRate}
            busy={rating}
          />
          {rateError && (
            <Alert color="danger" fade={false} style={{ marginTop: '0.75rem' }}>
              {rateError}
            </Alert>
          )}
        </>
      )}

      {session?.finished && (
        <Summary session={session} data={data} today={today} onBack={() => setSession(null)} />
      )}
    </div>
  );
}

function Message({ children, icon }) {
  return (
    <p style={{ fontSize: '1.05rem', color: '#495057', textAlign: 'center', margin: '2rem 1rem' }}>
      {icon && <i className={`bi ${icon}`} aria-hidden="true" style={{ display: 'block', fontSize: '2rem', color: '#17a2b8', marginBottom: '0.5rem' }} />}
      {children}
    </p>
  );
}

// before a session: what's due, or "all caught up" with the next date
function Overview({ data, today, what, onStart, onPractise }) {
  if (data.dueCount > 0) {
    return (
      <div style={{ textAlign: 'center', margin: '2rem 1rem' }}>
        <p style={{ fontSize: '1.1rem' }}>
          You have <strong>{data.dueCount}</strong> card{data.dueCount === 1 ? '' : 's'} to review for this {what}.
        </p>
        <Button color="info" onClick={onStart}>
          Start review
        </Button>
      </div>
    );
  }
  return (
    <div style={{ textAlign: 'center', margin: '2rem 1rem' }}>
      <i className="bi bi-check-circle-fill" aria-hidden="true" style={{ fontSize: '2rem', color: '#198754' }} />
      <p style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>
        <strong>All caught up.</strong>
        {data.nextDue && ` Next review ${whenDue(today, data.nextDue)}.`}
      </p>
      <Button color="secondary" outline size="sm" onClick={onPractise}>
        Practise anyway
      </Button>
    </div>
  );
}

function Summary({ session, data, today, onBack }) {
  const unique = session.reviewed - session.again;
  return (
    <div style={{ textAlign: 'center', margin: '2rem 1rem' }}>
      <i className="bi bi-check-circle-fill" aria-hidden="true" style={{ fontSize: '2rem', color: '#198754' }} />
      <p style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>
        <strong>{session.mode === 'practice' ? 'Practice finished.' : 'Review finished.'}</strong> {unique} card{unique === 1 ? '' : 's'} done
        {session.again > 0 && `, ${session.again} to see again tomorrow`}.
      </p>
      {data.nextDue && data.dueCount === 0 && <p style={{ color: '#6c757d' }}>Next review {whenDue(today, data.nextDue)}.</p>}
      <Button color="secondary" outline size="sm" onClick={onBack}>
        Back
      </Button>
    </div>
  );
}
