'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Row, Col, Alert, Spinner, Button, Badge } from 'reactstrap';
import { useGetMasteryQuery, useGetDueReviewsQuery } from '@/lib/redux/slices/apiSlice';
import { DEFAULT_SPEC_ID, SUBSCRIBED_COURSES } from '@/lib/mastery/specs';
import { localToday, whenDue } from '@/lib/reviews/localDay';
import ProgressRadar, { MasteryBar } from '@/lib/components/learn/progress/ProgressRadar';

/*
Progress page (/learn/progress, called the Skill Radar until 22 Oct 2026): a game-style stats page.
  left           the radar (src/lib/components/learn/progress/ProgressRadar.js)
  right column   How to improve · Insight for the selected skill · Outstanding reviews (a count + link to /learn/reviews)
  bottom         the selected skill's Lessons | Questions (reviews live in their own card)
Clicking a radar corner selects that skill (click only: hover previews flickered). The page opens on the weakest skill.
Data: GET /api/mastery (src/lib/mastery/computeMastery.js does the maths).
*/

const INK = '#1f3b4d';
const TEAL_DEEP = '#0e7c8f';
const pct = (v) => `${Math.round(v * 100)}%`;

export default function ProgressPage() {
  const [course, setCourse] = useState(DEFAULT_SPEC_ID);
  const [pinned, setPinned] = useState(null); // null = not chosen yet -> weakest skill
  // currentData = the result for the course selected NOW (data would briefly show the previous course)
  const { currentData: data, isFetching, error } = useGetMasteryQuery(course);

  const changeCourse = (id) => {
    setCourse(id);
    setPinned(null);
  };

  const pinnedIndex = pinned ?? (data ? weakestSkill(data.areas) : 0);
  const shown = data?.areas[pinnedIndex];

  return (
    // same frame as the question page: white card, 8px corners, soft shadow, padding all round
    <div
      style={{
        maxWidth: '1280px',
        margin: '1rem auto',
        padding: '1.5rem',
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ color: '#17a2b8', fontWeight: 'bold', marginBottom: '0.25rem' }}>Your Progress</h1>
      {data && (
        <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
          {data.spec.name} · <strong style={{ color: INK }}>Level {data.level.toFixed(1)}</strong> · {data.rank} ·{' '}
          {pct(data.overall)} overall
        </p>
      )}

      <CourseToggle selected={course} onSelect={changeCourse} />

      {isFetching && !data && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Spinner color="info" />
        </div>
      )}
      {error && !isFetching && (
        <Alert color="danger" fade={false} style={{ margin: '2rem auto', maxWidth: '700px' }}>
          Your progress couldn&apos;t be loaded. Try refreshing the page.
        </Alert>
      )}

      {data && shown && (
        <>
          <Row>
            <Col xs="12" lg="7">
              <Panel title="Your skills">
                <ProgressRadar areas={data.areas} pinned={pinnedIndex} onPin={setPinned} />
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6c757d', margin: '0.25rem 0 0' }}>
                  Click a skill to see its details.
                </p>
              </Panel>
            </Col>
            <Col xs="12" lg="5">
              <HowToImprove />
              <Insight area={shown} />
              <OutstandingReviews course={course} />
            </Col>
          </Row>

          <SkillBreakdown area={shown} />
        </>
      )}
    </div>
  );
}

// the skill with the lowest mastery among those with any content (falls back to the first skill)
function weakestSkill(areas) {
  let best = 0;
  let bestScore = Infinity;
  areas.forEach((a, i) => {
    const hasContent = a.total > 0 || a.lessons.some((l) => l.status !== 'coming-soon');
    if (hasContent && a.mastery < bestScore) {
      best = i;
      bestScore = a.mastery;
    }
  });
  return best;
}

// ─── shared card frame ──────────────────────────────────────────────────

function Panel({ title, children }) {
  return (
    <section
      style={{
        background: '#ffffff',
        border: `2px solid ${INK}`,
        borderRadius: '6px',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
      }}
    >
      <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: TEAL_DEEP, margin: '0 0 0.6rem' }}>{title}</h2>
      {children}
    </section>
  );
}

// ─── course toggle ──────────────────────────────────────────────────────

// One row per year, one button per course. Selected = filled teal.
// Courses are hardcoded in SUBSCRIBED_COURSES (specs.js) until subscriptions exist.
function CourseToggle({ selected, onSelect }) {
  return (
    <div role="group" aria-label="Choose a course" style={{ marginBottom: '1.5rem' }}>
      {SUBSCRIBED_COURSES.map((group) => (
        <div key={group.year} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <strong style={{ minWidth: '4.5rem', color: INK }}>{group.year}</strong>
          {group.courses.map((c) => {
            const isSelected = c.id === selected;
            return (
              <Button
                key={c.id}
                size="sm"
                color={isSelected ? 'info' : 'secondary'}
                outline={!isSelected}
                aria-pressed={isSelected}
                onClick={() => onSelect(c.id)}
              >
                {c.label}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── right column ───────────────────────────────────────────────────────

function HowToImprove() {
  const steps = [
    { icon: 'bi-book', title: 'Complete the lessons', text: 'Each skill’s lessons teach the ideas its questions test.' },
    { icon: 'bi-pencil-square', title: 'Answer the questions', text: 'Your radar grows with every mark you earn on a skill’s questions.' },
    { icon: 'bi-arrow-repeat', title: 'Keep up with reviews', text: 'Short, regular reviews stop what you’ve learned from fading.' },
  ];
  return (
    <Panel title="How to improve your skills">
      {steps.map((s) => (
        <div key={s.title} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <i className={`bi ${s.icon}`} style={{ fontSize: '1.3rem', color: TEAL_DEEP }} aria-hidden="true" />
          <div>
            <strong>{s.title}</strong>
            <div style={{ fontSize: '0.9rem', color: '#495057' }}>{s.text}</div>
          </div>
        </div>
      ))}
    </Panel>
  );
}

function Insight({ area }) {
  const { insight } = area;
  const lessonsDone = area.lessons.filter((l) => l.status === 'complete').length;
  const lessonsAvailable = area.lessons.filter((l) => l.status !== 'coming-soon').length;

  return (
    <Panel title={`Insight: ${area.name}`}>
      <MasteryBar value={area.mastery} />
      <p style={{ fontSize: '0.9rem', color: '#495057', margin: '0.4rem 0 0.6rem' }}>
        {area.total ? `${pct(area.mastery)} mastery` : 'No questions for this skill yet'}
        {' · '}
        {insight.lastPractised ? `last practised ${timeAgo(insight.lastPractised)}` : 'not started yet'}
      </p>

      <ul style={{ paddingLeft: '1.1rem', margin: '0 0 0.6rem', fontSize: '0.95rem' }}>
        <li>
          Questions: {area.completed} of {area.total} complete
          {area.attempted > area.completed ? `, ${area.attempted - area.completed} in progress` : ''}
        </li>
        <li>
          Lessons: {lessonsAvailable ? `${lessonsDone} of ${lessonsAvailable} complete` : 'none available yet'}
        </li>
        {insight.strongest && (
          <li>
            Strongest: <Link href={insight.strongest.href}>{insight.strongest.label}</Link> ({pct(insight.strongest.score)})
          </li>
        )}
        {insight.weakest && (
          <li>
            Needs work: <Link href={insight.weakest.href}>{insight.weakest.label}</Link> ({pct(insight.weakest.score)})
          </li>
        )}
      </ul>

      {insight.nextStep && (
        <p style={{ margin: '0 0 0.6rem', padding: '0.5rem 0.75rem', background: '#e3f4f8', borderLeft: `4px solid ${TEAL_DEEP}` }}>
          <strong>Next step: </strong>
          {insight.nextStep.href ? <Link href={insight.nextStep.href}>{insight.nextStep.text}</Link> : insight.nextStep.text}
        </p>
      )}

      <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Covers: {area.subtopics.join(' · ')}</div>
    </Panel>
  );
}

// A summary for the selected course; the list itself is on /learn/reviews (src/lib/docs/reviews-page.md).
// Counts questions and lessons with cards due, not cards: "8 reviews due: 3 questions · 5 lessons".
function OutstandingReviews({ course }) {
  const [today] = useState(localToday);
  const { data, error } = useGetDueReviewsQuery(today, { refetchOnMountOrArgChange: true });

  const inCourse = (list) => (list ?? []).filter((entry) => entry.courseId === course);
  const questions = inCourse(data?.questions);
  const lessons = inCourse(data?.lessons);
  const questionsDue = questions.filter((q) => q.cardsDue > 0).length;
  const lessonsDue = lessons.filter((l) => l.cardsDue > 0).length;
  const due = questionsDue + lessonsDue;
  const nextDue = [...questions, ...lessons].map((entry) => entry.nextDue).filter(Boolean).sort()[0];
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const breakdown = [questionsDue && plural(questionsDue, 'question'), lessonsDue && plural(lessonsDue, 'lesson')].filter(Boolean).join(' · ');

  return (
    <Panel title="Outstanding reviews">
      {error && !data ? (
        <p style={{ margin: 0, color: '#495057' }}>Your reviews couldn&apos;t be loaded.</p>
      ) : !data ? (
        <Spinner size="sm" color="info" />
      ) : due > 0 ? (
        <>
          <p style={{ margin: '0 0 0.6rem' }}>
            <strong style={{ color: INK }}>{plural(due, 'review')} due:</strong> {breakdown}
          </p>
          <Link href={`/learn/reviews?course=${course}${questionsDue === 0 ? '&tab=lessons' : ''}`} className="btn btn-info btn-sm">
            Go to reviews
          </Link>
        </>
      ) : questions.length + lessons.length > 0 ? (
        <p style={{ margin: 0 }}>
          You&apos;re all caught up.{nextDue && ` Next review ${whenDue(today, nextDue)}.`}
        </p>
      ) : (
        <p style={{ margin: 0, color: '#495057' }}>No reviews yet. Finish a question or a lesson to unlock its review cards.</p>
      )}
    </Panel>
  );
}

// ─── bottom: the selected skill's content, lessons | questions ──────────
// (Reviews aren't here: they have their own "Outstanding reviews" card on the right.)

function SkillBreakdown({ area }) {
  return (
    <Panel title={`${area.name}: what's left`}>
      <Row>
        <Col xs="12" md="6">
          <Column
            title="Lessons"
            items={area.lessons}
            emptyText="No lessons for this skill yet."
            doneText="All relevant lessons for this skill complete."
          />
        </Col>
        <Col xs="12" md="6">
          <Column
            title="Questions"
            items={area.questions.map((q) => ({ ...q, title: q.label }))}
            emptyText="No questions for this skill yet."
            doneText="All relevant questions for this skill complete."
          />
        </Col>
      </Row>
    </Panel>
  );
}

const columnHeading = { fontSize: '1rem', fontWeight: 'bold', color: INK, margin: '0.25rem 0 0.5rem' };

const STATUS = {
  'in-progress': { color: 'warning', text: 'In progress' },
  todo: { color: 'secondary', text: 'Not started' },
  'coming-soon': { color: 'light', text: 'Coming soon' },
};

// outstanding items first (with links), then a one-line summary of what's complete
function Column({ title, items, emptyText, doneText }) {
  const outstanding = items.filter((i) => i.status === 'in-progress' || i.status === 'todo');
  const comingSoon = items.filter((i) => i.status === 'coming-soon');
  const complete = items.filter((i) => i.status === 'complete');

  return (
    <div style={{ marginBottom: '1rem' }}>
      {title && <h3 style={columnHeading}>{title}</h3>}

      {items.length === 0 && <p style={{ color: '#495057' }}>{emptyText}</p>}

      {/* everything available is done: green tick */}
      {outstanding.length === 0 && complete.length > 0 && (
        <p style={{ color: '#198754', fontWeight: 'bold' }}>
          <i className="bi bi-check-circle-fill" aria-hidden="true" /> {doneText}
        </p>
      )}
      {/* items exist but none are available yet (all coming soon): neutral, not a tick */}
      {items.length > 0 && outstanding.length === 0 && complete.length === 0 && (
        <p style={{ color: '#495057', margin: 0 }}>None available yet.</p>
      )}

      {outstanding.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {outstanding.map((item) => (
            <li key={item.href ?? item.title} style={{ padding: '0.35rem 0', borderBottom: '1px solid #e9ecef' }}>
              {item.href ? <Link href={item.href}>{item.title}</Link> : item.title}{' '}
              <Badge color={STATUS[item.status].color} pill>
                {STATUS[item.status].text}
                {item.status === 'in-progress' && typeof item.score === 'number' ? ` · ${pct(item.score)}` : ''}
              </Badge>
            </li>
          ))}
        </ul>
      )}

      {(complete.length > 0 || comingSoon.length > 0) && outstanding.length > 0 && (
        <p style={{ fontSize: '0.85rem', color: '#6c757d', margin: '0.5rem 0 0' }}>
          {complete.length > 0 && `✓ ${complete.length} complete`}
          {complete.length > 0 && comingSoon.length > 0 && ' · '}
          {comingSoon.length > 0 && `${comingSoon.length} coming soon`}
        </p>
      )}
      {comingSoon.length > 0 && outstanding.length === 0 && (
        <p style={{ fontSize: '0.85rem', color: '#6c757d', margin: 0 }}>{comingSoon.length} more coming soon.</p>
      )}
    </div>
  );
}

// "today", "yesterday", "3 days ago", "2 weeks ago", "4 months ago"
function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return 'over a year ago';
}
