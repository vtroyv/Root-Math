'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Alert, Spinner, Nav, NavItem, NavLink, Table, Input, Label } from 'reactstrap';
import classnames from 'classnames';
import { useGetDueReviewsQuery } from '@/lib/redux/slices/apiSlice';
import { SPECS, SUBSCRIBED_COURSES } from '@/lib/mastery/specs';
import { localToday, daysBetween, whenDue } from '@/lib/reviews/localDay';

/*
Reviews: everything with review cards due, across all courses (src/lib/docs/reviews-page.md).
  ?course=edx-maths-1   opens filtered to that course (the Progress page's link does this)
  ?tab=lessons          opens on the Lessons tab
Questions | Lessons tabs, filtered by year, course and skill. Each row links to the question's
or lesson's Review tab (?tab=review). Lesson cards unlock once the whole lesson is complete.
Data: GET /api/reviews/due (src/lib/reviews/due.js), filtered here in the browser.
*/

const INK = '#1f3b4d';

// the filter options, from the courses offered (SUBSCRIBED_COURSES) and their SPECS entries
const COURSES = SUBSCRIBED_COURSES.flatMap((group) =>
  group.courses.map((c) => ({ ...SPECS[c.id], label: c.label, yearLabel: group.year })),
);
const YEARS = [...new Map(COURSES.map((c) => [c.year, c.yearLabel]))]; // [['12', 'Year 12'], ...]
const BRANCHES = [...new Map(COURSES.map((c) => [c.branch, c.label]))]; // [['pure', 'Pure'], ...]
const courseName = (id) => {
  const c = COURSES.find((course) => course.id === id);
  return c ? `${c.label} · ${c.yearLabel}` : '–';
};

export default function ReviewsPage({ searchParams }) {
  const start = SPECS[searchParams?.course];
  const [tab, setTab] = useState(searchParams?.tab === 'lessons' ? 'lessons' : 'questions');
  const [year, setYear] = useState(start?.year ?? '');
  const [branch, setBranch] = useState(start?.branch ?? '');
  const [skill, setSkill] = useState('');
  const [today] = useState(localToday);
  // refetch on every visit: cards turn due overnight without anything else changing
  const { data, isFetching, error } = useGetDueReviewsQuery(today, { refetchOnMountOrArgChange: true });

  // skills can only be chosen once a single course (year + course) is picked
  const course = COURSES.find((c) => c.year === year && c.branch === branch);
  const changeYear = (value) => {
    setYear(value);
    setSkill('');
  };
  const changeBranch = (value) => {
    setBranch(value);
    setSkill('');
  };

  const matches = (entry) => {
    const c = SPECS[entry.courseId];
    return (!year || c?.year === year) && (!branch || c?.branch === branch) && (!skill || entry.skillId === skill);
  };
  const questions = (data?.questions ?? []).filter(matches);
  const lessons = (data?.lessons ?? []).filter(matches);
  const questionsDue = questions.filter((q) => q.cardsDue > 0);
  const lessonsDue = lessons.filter((l) => l.cardsDue > 0);
  const shown = tab === 'lessons' ? lessons : questions;
  const due = tab === 'lessons' ? lessonsDue : questionsDue;

  return (
    // same frame as the Progress page: white card, 8px corners, soft shadow
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
      <h1 style={{ color: '#17a2b8', fontWeight: 'bold', marginBottom: '0.25rem' }}>Reviews</h1>
      <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
        Short, regular reviews stop what you&apos;ve learned from fading. Start with the ones that have waited longest.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <Filter id="filter-year" label="Year" value={year} onChange={changeYear} allText="All years" options={YEARS} />
        <Filter id="filter-course" label="Course" value={branch} onChange={changeBranch} allText="All courses" options={BRANCHES} />
        <Filter
          id="filter-skill"
          label="Skill"
          value={skill}
          onChange={setSkill}
          allText={course ? 'All skills' : 'Pick a year and course first'}
          options={course ? course.areas.map((a) => [a.id, a.name]) : []}
          disabled={!course}
        />
      </div>

      <Nav tabs>
        <NavItem>
          <NavLink className={classnames({ active: tab === 'questions' })} onClick={() => setTab('questions')} style={{ cursor: 'pointer' }}>
            Questions{questionsDue.length > 0 && <strong style={{ color: '#17a2b8' }}> · {questionsDue.length}</strong>}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={classnames({ active: tab === 'lessons' })} onClick={() => setTab('lessons')} style={{ cursor: 'pointer' }}>
            Lessons{lessonsDue.length > 0 && <strong style={{ color: '#17a2b8' }}> · {lessonsDue.length}</strong>}
          </NavLink>
        </NavItem>
      </Nav>

      <div style={{ padding: '1rem 0' }}>
        {isFetching && !data ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner color="info" />
          </div>
        ) : error && !data ? (
          <Alert color="danger" fade={false}>
            Your reviews couldn&apos;t be loaded. Try refreshing the page.
          </Alert>
        ) : (
          <DueReviews kind={tab === 'lessons' ? 'lesson' : 'question'} shown={shown} due={due} today={today} filtered={Boolean(year || branch || skill)} />
        )}
      </div>
    </div>
  );
}

// a labelled dropdown; options = [[value, text], ...], '' = all
function Filter({ id, label, value, onChange, allText, options, disabled = false }) {
  return (
    <div style={{ minWidth: '11rem' }}>
      <Label for={id} style={{ fontWeight: 'bold', color: INK, marginBottom: '0.25rem' }}>
        {label}
      </Label>
      <Input id={id} type="select" bsSize="sm" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
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

// the due list for one tab. kind = 'question' | 'lesson'
function DueReviews({ kind, shown, due, today, filtered }) {
  if (shown.length === 0) {
    return (
      <p style={{ margin: 0, color: '#495057' }}>
        No review cards yet{filtered ? ' that match these filters' : ''}.{' '}
        {kind === 'lesson' ? 'Finish a whole lesson to unlock its review cards.' : 'Finish a question to unlock its review cards.'}
      </p>
    );
  }
  if (due.length === 0) {
    const nextDue = shown.map((q) => q.nextDue).filter(Boolean).sort()[0];
    return (
      <p style={{ margin: 0 }}>
        <i className="bi bi-check-circle-fill" style={{ color: '#198754' }} aria-hidden="true" /> All caught up.
        {nextDue && ` Next review ${whenDue(today, nextDue)}.`}
      </p>
    );
  }

  return (
    <Table size="sm" responsive style={{ marginBottom: 0 }}>
      <thead>
        <tr>
          <th>{kind === 'lesson' ? 'Lesson' : 'Question'}</th>
          <th>Course</th>
          <th>Skill</th>
          <th>Cards due</th>
          <th>Due</th>
        </tr>
      </thead>
      <tbody>
        {due.map((q) => (
          <tr key={q.href ?? q.label}>
            <td>{q.href ? <Link href={`${q.href}?tab=review`}>{q.label}</Link> : q.label}</td>
            <td>{courseName(q.courseId)}</td>
            <td>{q.skillName ?? '–'}</td>
            <td>{q.cardsDue}</td>
            <td>{overdue(today, q.dueSince)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

// "Due today", "1 day overdue", "5 days overdue"
function overdue(today, day) {
  const days = -daysBetween(today, day);
  if (days <= 0) return 'Due today';
  return `${days} ${days === 1 ? 'day' : 'days'} overdue`;
}
