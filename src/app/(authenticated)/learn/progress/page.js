'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Row, Col, Alert, Button } from 'reactstrap';
import { useUser } from '@clerk/nextjs';
import { useGetMasteryQuery, useGetDueReviewsQuery } from '@/lib/redux/slices/apiSlice';
import { DEFAULT_SPEC_ID } from '@/lib/mastery/specs';
import { coursesForUser, courseLabel } from '@/lib/courses/courses';
import { localToday, whenDue } from '@/lib/reviews/localDay';
import ProgressRadar, { MasteryBar } from '@/lib/components/learn/progress/ProgressRadar';
import { ProgressRing, StatusIcon, ComingSoon } from '@/lib/components/learn/courses/CourseUI';

/*
Progress page (/learn/progress, called the Skill Radar until 22 Oct 2026): a game-style stats page,
in the same design as the course pages (25 Oct 2026).
  top            header panel: overall mastery ring, level and rank; then the student's courses to pick from
  left           the radar (src/lib/components/learn/progress/ProgressRadar.js)
  right column   Insight for the selected skill · Outstanding reviews (a count + link to /learn/reviews) · How to improve
  bottom         the selected skill's Lessons | Questions (reviews live in their own card)
Clicking a radar corner selects that skill (click only: hover previews flickered). The page opens on the weakest skill.
Courses: the student's own (coursesForUser, src/lib/courses/courses.js).
Data: GET /api/mastery (src/lib/mastery/computeMastery.js does the maths).
*/

const pct = (v) => `${Math.round(v * 100)}%`;

export default function ProgressPage() {
  const { user } = useUser();
  const courses = coursesForUser(user);
  const [chosen, setChosen] = useState(null);
  // the course picked, else Year 12 Pure if the student has it, else their first course
  const course = chosen ?? (courses.some((c) => c.id === DEFAULT_SPEC_ID) ? DEFAULT_SPEC_ID : courses[0]?.id ?? DEFAULT_SPEC_ID);
  const [pinned, setPinned] = useState(null); // null = not chosen yet -> weakest skill
  // currentData = the result for the course selected NOW (data would briefly show the previous course)
  const { currentData: data, isFetching, error } = useGetMasteryQuery(course);

  const changeCourse = (id) => {
    setChosen(id);
    setPinned(null);
  };

  const pinnedIndex = pinned ?? (data ? weakestSkill(data.areas) : 0);
  const shown = data?.areas[pinnedIndex];
  const current = courses.find((c) => c.id === course);

  return (
    <div className="learn-page">
      <section className="learn-hero">
        <div>
          <p className="learn-hero__kicker">{current ? `${current.examBoard} · ${current.qualification}` : 'Your progress'}</p>
          <h1 className="learn-home__title">Your Progress</h1>
          <p className="learn-hero__sub">{current ? courseLabel(current) : data?.spec.name}</p>
        </div>

        {data && (
          <div className="learn-hero__progress">
            <ProgressRing percent={Math.round(data.overall * 100)} label={`${pct(data.overall)} overall mastery`} className="learn-hero__ring" />
            <div>
              <p className="learn-progress__level">
                Level {data.level.toFixed(1)} <span>· {data.rank}</span>
              </p>
              <p className="learn-course__note">
                {pct(data.overall)} overall mastery · {data.totals.completed} of {data.totals.questions} questions complete
              </p>
            </div>
          </div>
        )}
      </section>

      <CoursePicker courses={courses} selected={course} onSelect={changeCourse} />

      {isFetching && !data && <div className="learn-hero learn-hero--loading" aria-hidden="true" />}
      {error && !isFetching && (
        <Alert color="danger" fade={false}>
          Your progress couldn&apos;t be loaded. Try refreshing the page.
        </Alert>
      )}

      {data && shown && (
        <>
          <Row>
            <Col xs="12" lg="7">
              <Card title="Your skills" icon="bi-bullseye">
                <ProgressRadar areas={data.areas} pinned={pinnedIndex} onPin={setPinned} />
                <p className="learn-progress__hint">Click a skill to see its details.</p>
              </Card>
            </Col>
            <Col xs="12" lg="5">
              <Insight area={shown} />
              <OutstandingReviews course={course} />
              <HowToImprove />
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

// ─── shared card: teal header band, 2px ink border (same as the course pages) ───

function Card({ title, icon, children }) {
  return (
    <section className="learn-topic">
      <div className="learn-topic__head">
        <h2 className="learn-topic__name">
          {icon && <i className={`bi ${icon}`} aria-hidden="true" />} {title}
        </h2>
      </div>
      <div className="learn-panel__body">{children}</div>
    </section>
  );
}

// ─── course picker ──────────────────────────────────────────────────────

// One row per qualification + year, one button per course. Selected = filled teal.
function CoursePicker({ courses, selected, onSelect }) {
  const groups = [];
  for (const course of courses) {
    const heading = `${course.qualification} · ${course.year}`;
    const group = groups.find((g) => g.heading === heading);
    if (group) group.courses.push(course);
    else groups.push({ heading, courses: [course] });
  }

  return (
    <div role="group" aria-label="Choose a course" className="learn-progress__courses">
      {groups.map((group) => (
        <div key={group.heading} className="learn-progress__course-row">
          <strong>{group.heading}</strong>
          {group.courses.map((c) => {
            const isSelected = c.id === selected;
            return (
              <Button
                key={c.id}
                color={isSelected ? 'info' : 'secondary'}
                outline={!isSelected}
                aria-pressed={isSelected}
                onClick={() => onSelect(c.id)}
              >
                {c.component}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── right column ───────────────────────────────────────────────────────

function Insight({ area }) {
  const { insight } = area;
  const lessonsDone = area.lessons.filter((l) => l.status === 'complete').length;
  const lessonsAvailable = area.lessons.filter((l) => l.status !== 'coming-soon').length;

  return (
    <Card title={`Insight: ${area.name}`} icon="bi-lightbulb">
      <MasteryBar value={area.mastery} />
      <p className="learn-progress__meta">
        {area.total ? `${pct(area.mastery)} mastery` : 'No questions for this skill yet'}
        {' · '}
        {insight.lastPractised ? `last practised ${timeAgo(insight.lastPractised)}` : 'not started yet'}
      </p>

      <ul className="learn-progress__facts">
        <li>
          Questions: {area.completed} of {area.total} complete
          {area.attempted > area.completed ? `, ${area.attempted - area.completed} in progress` : ''}
        </li>
        <li>Lessons: {lessonsAvailable ? `${lessonsDone} of ${lessonsAvailable} complete` : 'none available yet'}</li>
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
        <p className="learn-callout">
          <strong>Next step: </strong>
          {insight.nextStep.href ? <Link href={insight.nextStep.href}>{insight.nextStep.text}</Link> : insight.nextStep.text}
        </p>
      )}

      <p className="learn-progress__covers">Covers: {area.subtopics.join(' · ')}</p>
    </Card>
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
    <Card title="Outstanding reviews" icon="bi-arrow-repeat">
      {error && !data ? (
        <p className="learn-progress__meta">Your reviews couldn&apos;t be loaded.</p>
      ) : !data ? (
        <p className="learn-progress__meta">Loading…</p>
      ) : due > 0 ? (
        <>
          <p className="learn-progress__reviews">
            <strong>{plural(due, 'review')} due:</strong> {breakdown}
          </p>
          <Button tag={Link} href={`/learn/reviews?course=${course}${questionsDue === 0 ? '&tab=lessons' : ''}`} color="info">
            Go to reviews <i className="bi bi-arrow-right" aria-hidden="true" />
          </Button>
        </>
      ) : questions.length + lessons.length > 0 ? (
        <p className="learn-progress__reviews">
          <i className="bi bi-check-circle-fill learn-status--complete" aria-hidden="true" /> You&apos;re all caught up.
          {nextDue && ` Next review ${whenDue(today, nextDue)}.`}
        </p>
      ) : (
        <p className="learn-progress__meta">No reviews yet. Finish a question or a lesson to unlock its review cards.</p>
      )}
    </Card>
  );
}

function HowToImprove() {
  const steps = [
    { icon: 'bi-book', title: 'Complete the lessons', text: 'Each skill’s lessons teach the ideas its questions test.' },
    { icon: 'bi-pencil-square', title: 'Answer the questions', text: 'Your radar grows with every mark you earn on a skill’s questions.' },
    { icon: 'bi-arrow-repeat', title: 'Keep up with reviews', text: 'Short, regular reviews stop what you’ve learned from fading.' },
  ];
  return (
    <Card title="How to improve your skills" icon="bi-graph-up-arrow">
      {steps.map((s) => (
        <div key={s.title} className="learn-progress__step">
          <i className={`bi ${s.icon}`} aria-hidden="true" />
          <div>
            <strong>{s.title}</strong>
            <span>{s.text}</span>
          </div>
        </div>
      ))}
    </Card>
  );
}

// ─── bottom: the selected skill's content, lessons | questions ──────────
// (Reviews aren't here: they have their own "Outstanding reviews" card on the right.)

function SkillBreakdown({ area }) {
  return (
    <Card title={`${area.name}: what's left`} icon="bi-list-check">
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
    </Card>
  );
}

const STATUS_TEXT = { 'in-progress': 'In progress', todo: 'Not started' };

// outstanding items first (with links), then a one-line summary of what's complete
function Column({ title, items, emptyText, doneText }) {
  const outstanding = items.filter((i) => i.status === 'in-progress' || i.status === 'todo');
  const comingSoon = items.filter((i) => i.status === 'coming-soon');
  const complete = items.filter((i) => i.status === 'complete');

  return (
    <div className="learn-progress__column">
      <h3 className="learn-progress__column-title">{title}</h3>

      {items.length === 0 && <p className="learn-progress__meta">{emptyText}</p>}

      {/* everything available is done: a tick */}
      {outstanding.length === 0 && complete.length > 0 && (
        <p className="learn-progress__done">
          <i className="bi bi-check-circle-fill learn-status--complete" aria-hidden="true" /> {doneText}
        </p>
      )}
      {/* items exist but none are available yet (all coming soon): neutral, not a tick */}
      {items.length > 0 && outstanding.length === 0 && complete.length === 0 && (
        <p className="learn-progress__meta">
          None available yet. <ComingSoon />
        </p>
      )}

      {outstanding.length > 0 && (
        <ul className="learn-list learn-progress__list">
          {outstanding.map((item) => {
            const content = (
              <>
                <span className="learn-row__lesson">
                  <StatusIcon status={item.status} />
                  {item.title}
                </span>
                <span className="learn-row__meta">
                  {STATUS_TEXT[item.status]}
                  {item.status === 'in-progress' && typeof item.score === 'number' && <span className="learn-pill">{pct(item.score)}</span>}
                  {item.href && <i className="bi bi-chevron-right" aria-hidden="true" />}
                </span>
              </>
            );
            return (
              <li key={item.href ?? item.title}>
                {item.href ? (
                  <Link href={item.href} className="learn-row">
                    {content}
                  </Link>
                ) : (
                  <span className="learn-row">{content}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {(complete.length > 0 || comingSoon.length > 0) && outstanding.length > 0 && (
        <p className="learn-progress__covers">
          {complete.length > 0 && `✓ ${complete.length} complete`}
          {complete.length > 0 && comingSoon.length > 0 && ' · '}
          {comingSoon.length > 0 && `${comingSoon.length} coming soon`}
        </p>
      )}
      {comingSoon.length > 0 && outstanding.length === 0 && (
        <p className="learn-progress__covers">{comingSoon.length} more coming soon.</p>
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
