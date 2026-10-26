'use client';
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Button,
  Col,
  DropdownItem,
  Input,
  InputGroup,
  InputGroupText,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from 'reactstrap';
import { useUser } from '@clerk/nextjs';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetQuestionsQuery } from '@/lib/redux/slices/apiSlice';
import { courseTree, coursesForUser, courseLabel, findCourse } from '@/lib/courses/courses';
import { StatusIcon } from '@/lib/components/learn/courses/CourseUI';
import { FilterMenu, CourseTree } from './Filters';
import QuestionProgress from './QuestionProgress';
import ActivityMap from './ActivityMap';
import { DIFFICULTIES, NO_COURSE, PAGE_SIZE, STATUSES, filterRows, pageWindow, toRows } from './rows';

/*
Questions page (/learn/questions), in the same design as the course, Reviews and Progress pages (25 Oct 2026).
Docs: src/lib/docs/questions-page.md
  top     header panel: how many questions are left in the student's courses + the next one to try
  left    the question table: search, filter chips, Status | Question | Course | Topic | Difficulty, 20 a page.
          Status also filters by access: locked questions are in courses not on the student's account,
          and are hidden until the student asks to see them.
  right   Progress (QuestionProgress.js) and the activity map (ActivityMap.js)
Data: GET /api/questions (each question has its status and courseId); rows and filters in ./rows.js.
*/

const DEFAULT_FILTERS = { status: '', access: 'unlocked', topics: [], difficulty: '', courseIds: [], search: '' };
const ACCESS = [
  { id: 'unlocked', label: 'Unlocked', icon: 'bi-unlock' },
  { id: 'locked', label: 'Locked', icon: 'bi-lock-fill' },
  { id: 'all', label: 'Both', icon: 'bi-collection' },
];

export default function QuestionBank() {
  const { isLoaded, user } = useUser();
  const args = isLoaded && user ? { userId: user.id, examBoard: user.unsafeMetadata?.examBoard } : skipToken;
  const { data, isLoading, error } = useGetQuestionsQuery(args);

  // a string key, so the memos below only rerun when the student's courses actually change
  const coursesKey = coursesForUser(user).map((c) => c.id).join(',');
  const myCourseIds = useMemo(() => coursesKey.split(',').filter(Boolean), [coursesKey]);
  const rows = useMemo(() => toRows(data ?? [], new Set(myCourseIds)), [data, myCourseIds]);
  const tree = useMemo(() => {
    const t = courseTree();
    if (rows.some((r) => r.courseId === NO_COURSE)) t.push({ key: NO_COURSE, label: 'Not in a course', courseId: NO_COURSE });
    return t;
  }, [rows]);

  if (!isLoaded || isLoading) return <div className="learn-page"><div className="learn-hero learn-hero--loading" aria-hidden="true" /></div>;

  return (
    <div className="learn-page">
      <Hero rows={rows} />
      {error ? (
        <Alert color="danger" fade={false}>
          The questions couldn&apos;t be loaded. Try refreshing the page.
        </Alert>
      ) : (
        <Row>
          <Col xs="12" lg="8">
            <QuestionTable rows={rows} tree={tree} />
          </Col>
          <Col xs="12" lg="4">
            <QuestionProgress rows={rows} tree={tree} initialCourses={myCourseIds} />
            <ActivityMap />
          </Col>
        </Row>
      )}
    </div>
  );
}

// ─── header panel ───────────────────────────────────────────────────────

function Hero({ rows }) {
  const open = rows.filter((r) => !r.locked);
  const left = open.filter((r) => r.status !== 'complete');
  const next = left.find((r) => r.status === 'in-progress') ?? left[0];

  return (
    <section className="learn-hero">
      <div>
        <p className="learn-hero__kicker">Question bank</p>
        <h1 className="learn-home__title">Questions</h1>
        <p className="learn-hero__sub learn-hero__sub--small">
          Exam-style questions for every topic in your courses, marked as you go. Filter by course, topic or difficulty, or search for one.
        </p>
      </div>

      {open.length > 0 && (
        <div className="learn-hero__progress">
          <div className="learn-due-count">
            <span className="learn-due-count__number">{left.length}</span>
            <span>to do</span>
          </div>
          <div>
            <p className="learn-course__count">
              {open.length - left.length} of {open.length} questions
            </p>
            <p className="learn-course__note">complete in your courses</p>
            {next ? (
              <Button tag={Link} href={next.href} color="info" className="learn-hero__cta">
                {next.status === 'in-progress' ? 'Continue' : 'Try'}: {next.label} <i className="bi bi-arrow-right" aria-hidden="true" />
              </Button>
            ) : (
              <p className="learn-course__note">
                <i className="bi bi-check-circle-fill learn-status--complete" aria-hidden="true" /> All done! Keep it fresh with your reviews.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── the table ──────────────────────────────────────────────────────────

function QuestionTable({ rows, tree }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const cardRef = useRef(null);

  // every filter change goes back to page 1
  const set = (changes) => {
    setFilters((f) => ({ ...f, ...changes }));
    setPage(1);
  };
  const toggleTopic = (topic) =>
    set({ topics: filters.topics.includes(topic) ? filters.topics.filter((t) => t !== topic) : [...filters.topics, topic] });

  const topics = useMemo(() => [...new Set(rows.map((r) => r.topic).filter(Boolean))].sort(), [rows]);
  const shown = filterRows(rows, filters);
  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const pageRows = shown.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const hiddenLocked = filters.access === 'unlocked' ? rows.filter((r) => r.locked).length : 0;

  const goTo = (n) => {
    setPage(n);
    // back to the top of the table if it has scrolled off the screen
    if (cardRef.current && cardRef.current.getBoundingClientRect().top < 0) cardRef.current.scrollIntoView({ block: 'start' });
  };

  const chips = activeChips(filters, set, toggleTopic);

  return (
    <section className="learn-topic" ref={cardRef}>
      <div className="learn-topic__head">
        <h2 className="learn-topic__name">
          <i className="bi bi-list-check" aria-hidden="true" /> All questions
        </h2>
        <p className="learn-topic__note learn-reviews__head-note">
          {plural(shown.length, 'question')}
          {filters.access === 'unlocked' ? ' unlocked' : filters.access === 'locked' ? ' locked' : ''}
        </p>
      </div>

      <div className="learn-questions__toolbar">
        <InputGroup className="learn-questions__search">
          <InputGroupText>
            <i className="bi bi-search" aria-hidden="true" />
          </InputGroupText>
          <Input
            type="search"
            placeholder="Search by name, topic, difficulty or course"
            aria-label="Search questions"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
          />
        </InputGroup>

        {chips.length > 0 && (
          <div className="learn-questions__chips">
            {chips.map((chip) => (
              <Button key={chip.key} size="sm" color="info" outline onClick={chip.clear} aria-label={`Remove filter ${chip.text}`}>
                {chip.text} <i className="bi bi-x-lg" aria-hidden="true" />
              </Button>
            ))}
            <Button size="sm" color="link" onClick={() => set(DEFAULT_FILTERS)}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      <Table responsive className="learn-qtable">
        <thead>
          <tr>
            <th scope="col">
              <FilterMenu label="Status" active={Boolean(filters.status) || filters.access !== 'unlocked'}>
                <DropdownItem header>Progress</DropdownItem>
                {[{ id: '', label: 'Any' }, ...STATUSES].map((s) => (
                  <DropdownItem key={s.id || 'any'} active={filters.status === s.id} onClick={() => set({ status: s.id })}>
                    {s.id && <StatusIcon status={s.id} />} {s.label}
                  </DropdownItem>
                ))}
                <DropdownItem divider />
                <DropdownItem header>
                  Access <i className="bi bi-info-circle" aria-hidden="true" />
                </DropdownItem>
                {ACCESS.map((a) => (
                  <DropdownItem key={a.id} active={filters.access === a.id} onClick={() => set({ access: a.id })}>
                    <i className={`bi ${a.icon} learn-status`} aria-hidden="true" /> {a.label}
                  </DropdownItem>
                ))}
                <p className="learn-filter-menu__note">
                  <i className="bi bi-info-circle" aria-hidden="true" /> <strong>Unlocked</strong> questions are in the courses on your account.{' '}
                  <strong>Locked</strong> ones are in courses you haven&apos;t added yet: add the course to try them.
                </p>
              </FilterMenu>
            </th>
            <th scope="col">Question</th>
            <th scope="col">
              <FilterMenu label="Course" active={filters.courseIds.length > 0}>
                <CourseTree tree={tree} selected={filters.courseIds} onChange={(ids) => set({ courseIds: ids })} idPrefix="table-course" />
                <DropdownItem divider />
                <DropdownItem onClick={() => set({ courseIds: [] })}>Any course</DropdownItem>
              </FilterMenu>
            </th>
            <th scope="col">
              <FilterMenu label="Topic" active={filters.topics.length > 0}>
                <div className="learn-tree">
                  <ul>
                    {topics.map((topic, i) => (
                      <li key={topic}>
                        <div className="learn-tree__row">
                          <input
                            id={`topic-${i}`}
                            type="checkbox"
                            className="form-check-input"
                            checked={filters.topics.includes(topic)}
                            onChange={() => toggleTopic(topic)}
                          />
                          <label htmlFor={`topic-${i}`}>{topic}</label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <DropdownItem divider />
                <DropdownItem onClick={() => set({ topics: [] })}>Any topic</DropdownItem>
              </FilterMenu>
            </th>
            <th scope="col">
              <FilterMenu label="Difficulty" active={Boolean(filters.difficulty)} end>
                {['', ...DIFFICULTIES].map((d) => (
                  <DropdownItem key={d || 'any'} active={filters.difficulty === d} onClick={() => set({ difficulty: d })}>
                    {d || 'Any'}
                  </DropdownItem>
                ))}
              </FilterMenu>
            </th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row) => (
            <QuestionRow key={row.title} row={row} />
          ))}
        </tbody>
      </Table>

      {shown.length === 0 && (
        <p className="learn-empty">
          <i className="bi bi-search" aria-hidden="true" />
          {rows.length ? 'No questions match these filters.' : 'No questions yet.'}
          {chips.length > 0 || filters.search ? (
            <Button color="link" onClick={() => set(DEFAULT_FILTERS)}>
              Clear filters
            </Button>
          ) : null}
        </p>
      )}

      <div className="learn-questions__foot">
        <span>
          {shown.length > 0 && `Showing ${(current - 1) * PAGE_SIZE + 1}–${Math.min(current * PAGE_SIZE, shown.length)} of ${shown.length}`}
          {hiddenLocked > 0 && (
            <>
              {shown.length > 0 && ' · '}
              {plural(hiddenLocked, 'locked question')} hidden.{' '}
              <Button color="link" size="sm" className="learn-questions__inline" onClick={() => set({ access: 'all' })}>
                Show them
              </Button>
            </>
          )}
        </span>
        {pages > 1 && <Pager current={current} pages={pages} onGo={goTo} />}
      </div>
    </section>
  );
}

function QuestionRow({ row }) {
  return (
    <tr className={row.locked ? 'learn-qtable__locked' : undefined}>
      <td>{row.locked ? <i className="bi bi-lock-fill learn-status" role="img" aria-label="Locked" /> : <StatusIcon status={row.status} />}</td>
      <td>
        {row.locked ? (
          <>
            {row.label} <span className="learn-pill">Locked</span>
          </>
        ) : (
          <Link href={row.href}>{row.label}</Link>
        )}
      </td>
      <td>{row.course ? courseLabel(row.course) : 'Not in a course'}</td>
      <td>{row.topic}</td>
      <td>{row.difficulty}</td>
    </tr>
  );
}

// First « ‹ 3 4 5 6 7 › » Last
function Pager({ current, pages, onGo }) {
  const link = (n, props) => (
    <PaginationItem disabled={n < 1 || n > pages || n === current}>
      <PaginationLink tag="button" onClick={() => onGo(n)} {...props} />
    </PaginationItem>
  );
  return (
    <Pagination aria-label="Question pages" size="sm" className="learn-pages" listClassName="mb-0">
      {link(1, { first: true, 'aria-label': 'First page' })}
      {link(current - 1, { previous: true, 'aria-label': 'Previous page' })}
      {pageWindow(current, pages).map((n) => (
        <PaginationItem key={n} active={n === current}>
          <PaginationLink tag="button" onClick={() => onGo(n)} aria-current={n === current ? 'page' : undefined}>
            {n}
          </PaginationLink>
        </PaginationItem>
      ))}
      {link(current + 1, { next: true, 'aria-label': 'Next page' })}
      {link(pages, { last: true, 'aria-label': 'Last page' })}
    </Pagination>
  );
}

// one removable chip per filter that's on (search has its own box)
function activeChips(filters, set, toggleTopic) {
  const chips = [];
  const status = STATUSES.find((s) => s.id === filters.status);
  if (status) chips.push({ key: 'status', text: `Status: ${status.label}`, clear: () => set({ status: '' }) });
  if (filters.access !== 'unlocked') {
    chips.push({ key: 'access', text: filters.access === 'locked' ? 'Locked only' : 'Locked and unlocked', clear: () => set({ access: 'unlocked' }) });
  }
  if (filters.courseIds.length) {
    const only = filters.courseIds.length === 1 && findCourse(filters.courseIds[0]);
    const text = only ? `${only.qualification}: ${courseLabel(only)}` : `${filters.courseIds.length} courses`;
    chips.push({ key: 'courses', text, clear: () => set({ courseIds: [] }) });
  }
  filters.topics.forEach((topic) => chips.push({ key: `topic-${topic}`, text: topic, clear: () => toggleTopic(topic) }));
  if (filters.difficulty) chips.push({ key: 'difficulty', text: filters.difficulty, clear: () => set({ difficulty: '' }) });
  return chips;
}

const plural = (n, word) => `${n} ${n === 1 ? word : `${word}s`}`;
