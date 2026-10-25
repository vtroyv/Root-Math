'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Alert, Button, Input, Label } from 'reactstrap';
import { useUser } from '@clerk/nextjs';
import { useGetDueReviewsQuery } from '@/lib/redux/slices/apiSlice';
import { SPECS } from '@/lib/mastery/specs';
import { coursesForUser, findCourse, courseLabel } from '@/lib/courses/courses';
import { localToday, daysBetween, whenDue } from '@/lib/reviews/localDay';

/*
Reviews: everything with review cards due, across all courses (src/lib/docs/reviews-page.md).
  ?course=edx-maths-1   opens filtered to that course (the Progress page's link does this)
  ?tab=lessons          opens on the Lessons tab
Same look as the course pages: a header panel (cards due + Start with the most overdue), Course and Skill
filters (the student's own courses, src/lib/courses/courses.js), a Questions | Lessons toggle, and the due
list as a card. Each row links to the question's or lesson's Review tab (?tab=review).
Lesson cards unlock once the whole lesson is complete.
Data: GET /api/reviews/due (src/lib/reviews/due.js, most overdue first), filtered here in the browser.
*/

const TABS = [
  { id: 'questions', label: 'Questions', icon: 'bi-question-square' },
  { id: 'lessons', label: 'Lessons', icon: 'bi-journal-text' },
];

export default function ReviewsPage({ searchParams }) {
  const { user } = useUser();
  const courses = coursesForUser(user);

  const [tab, setTab] = useState(searchParams?.tab === 'lessons' ? 'lessons' : 'questions');
  const [courseId, setCourseId] = useState(findCourse(searchParams?.course) ? searchParams.course : '');
  const [skill, setSkill] = useState('');
  const [today] = useState(localToday);
  // refetch on every visit: cards turn due overnight without anything else changing
  const { data, isFetching, error } = useGetDueReviewsQuery(today, { refetchOnMountOrArgChange: true });

  // skills can only be chosen once a course is picked
  const skills = SPECS[courseId]?.areas ?? [];
  const changeCourse = (value) => {
    setCourseId(value);
    setSkill('');
  };

  const matches = (entry) => (!courseId || entry.courseId === courseId) && (!skill || entry.skillId === skill);
  const lists = {
    questions: (data?.questions ?? []).filter(matches),
    lessons: (data?.lessons ?? []).filter(matches),
  };
  const due = {
    questions: lists.questions.filter((entry) => entry.cardsDue > 0),
    lessons: lists.lessons.filter((entry) => entry.cardsDue > 0),
  };
  const allDue = [...due.questions, ...due.lessons];
  const cardsDue = allDue.reduce((sum, entry) => sum + entry.cardsDue, 0);
  // the most overdue across both lists (each list is already most overdue first)
  const first = [...allDue].sort((a, b) => (a.dueSince ?? '9999').localeCompare(b.dueSince ?? '9999'))[0];

  return (
    <div className="learn-page">
      <section className="learn-hero">
        <div>
          <p className="learn-hero__kicker">Spaced repetition</p>
          <h1 className="learn-home__title">Reviews</h1>
          <p className="learn-hero__sub learn-hero__sub--small">
            Short, regular reviews stop what you&apos;ve learned from fading. Start with the ones that have waited longest.
          </p>
        </div>

        {data && (
          <div className="learn-hero__progress">
            <div className="learn-due-count">
              <span className="learn-due-count__number">{cardsDue}</span>
              <span>{cardsDue === 1 ? 'card due' : 'cards due'}</span>
            </div>
            <div>
              <p className="learn-course__count">
                {plural(due.questions.length, 'question')} · {plural(due.lessons.length, 'lesson')}
              </p>
              {first?.href ? (
                <Button tag={Link} href={`${first.href}?tab=review`} color="info" className="learn-hero__cta">
                  Start with {first.label} <i className="bi bi-arrow-right" aria-hidden="true" />
                </Button>
              ) : (
                <p className="learn-course__note">
                  <i className="bi bi-check-circle-fill learn-status--complete" aria-hidden="true" /> All caught up
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      <div className="learn-reviews__controls">
        <div role="group" aria-label="Questions or lessons" className="learn-home__filter learn-reviews__tabs">
          {TABS.map((t) => {
            const isSelected = t.id === tab;
            return (
              <Button
                key={t.id}
                color={isSelected ? 'info' : 'secondary'}
                outline={!isSelected}
                aria-pressed={isSelected}
                onClick={() => setTab(t.id)}
              >
                <i className={`bi ${t.icon}`} aria-hidden="true" /> {t.label}
                {due[t.id].length > 0 && <span className="learn-count">{due[t.id].length}</span>}
              </Button>
            );
          })}
        </div>

        <div className="learn-reviews__filters">
          <Filter
            id="filter-course"
            label="Course"
            value={courseId}
            onChange={changeCourse}
            allText="All courses"
            options={courses.map((c) => [c.id, courseLabel(c)])}
          />
          <Filter
            id="filter-skill"
            label="Skill"
            value={skill}
            onChange={setSkill}
            allText={courseId ? 'All skills' : 'Pick a course first'}
            options={skills.map((a) => [a.id, a.name])}
            disabled={!courseId}
          />
        </div>
      </div>

      {isFetching && !data ? (
        <div className="learn-hero learn-hero--loading" aria-hidden="true" />
      ) : error && !data ? (
        <Alert color="danger" fade={false}>
          Your reviews couldn&apos;t be loaded. Try refreshing the page.
        </Alert>
      ) : (
        <DueReviews
          kind={tab === 'lessons' ? 'lesson' : 'question'}
          shown={lists[tab]}
          due={due[tab]}
          today={today}
          filtered={Boolean(courseId || skill)}
        />
      )}
    </div>
  );
}

const plural = (n, word) => `${n} ${n === 1 ? word : `${word}s`}`;

// a labelled dropdown; options = [[value, text], ...], '' = all
function Filter({ id, label, value, onChange, allText, options, disabled = false }) {
  return (
    <div className="learn-reviews__filter">
      <Label for={id}>{label}</Label>
      <Input id={id} type="select" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        <option value="">{allText}</option>
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </Input>
    </div>
  );
}

// the due list for one tab, as a card. kind = 'question' | 'lesson'
function DueReviews({ kind, shown, due, today, filtered }) {
  const title = kind === 'lesson' ? 'Lessons to review' : 'Questions to review';

  return (
    <section className="learn-topic learn-reviews__list">
      <div className="learn-topic__head">
        <h2 className="learn-topic__name">{title}</h2>
        {due.length > 0 && (
          <p className="learn-topic__note learn-reviews__head-note">
            {plural(due.length, kind)} · most overdue first
          </p>
        )}
      </div>

      {shown.length === 0 ? (
        <p className="learn-empty">
          <i className="bi bi-lock" aria-hidden="true" />
          No review cards yet{filtered ? ' that match these filters' : ''}.{' '}
          {kind === 'lesson' ? 'Finish a whole lesson to unlock its review cards.' : 'Finish a question to unlock its review cards.'}
        </p>
      ) : due.length === 0 ? (
        <AllCaughtUp shown={shown} today={today} />
      ) : (
        <ul className="learn-list">
          {due.map((entry) => (
            <li key={entry.href ?? entry.label}>
              <DueRow entry={entry} kind={kind} today={today} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function AllCaughtUp({ shown, today }) {
  const nextDue = shown.map((entry) => entry.nextDue).filter(Boolean).sort()[0];
  return (
    <p className="learn-empty">
      <i className="bi bi-check-circle-fill learn-status--complete" aria-hidden="true" />
      All caught up.{nextDue && ` Next review ${whenDue(today, nextDue)}.`}
    </p>
  );
}

function DueRow({ entry, kind, today }) {
  const course = findCourse(entry.courseId);
  const where = [course && courseLabel(course), entry.skillName].filter(Boolean).join(' · ');
  const late = overdue(today, entry.dueSince);

  const content = (
    <>
      <span className="learn-row__lesson">
        <i className={`bi ${kind === 'lesson' ? 'bi-journal-text' : 'bi-question-square'} learn-status`} aria-hidden="true" />
        <span>
          <span className="learn-row__title">{entry.label}</span>
          {where && <span className="learn-row__sub">{where}</span>}
        </span>
      </span>
      <span className="learn-row__meta">
        <span className="learn-pill">{plural(entry.cardsDue, 'card')}</span>
        <span className={late.days > 0 ? 'learn-overdue' : undefined}>{late.text}</span>
        {entry.href && <i className="bi bi-chevron-right" aria-hidden="true" />}
      </span>
    </>
  );

  return entry.href ? (
    <Link href={`${entry.href}?tab=review`} className="learn-row">
      {content}
    </Link>
  ) : (
    <span className="learn-row">{content}</span>
  );
}

// "Due today", "1 day overdue", "5 days overdue"
function overdue(today, day) {
  const days = -daysBetween(today, day);
  if (days <= 0) return { days: 0, text: 'Due today' };
  return { days, text: `${days} ${days === 1 ? 'day' : 'days'} overdue` };
}
