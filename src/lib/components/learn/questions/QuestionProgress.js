'use client';
import { useState } from 'react';
import { Button, DropdownItem } from 'reactstrap';
import { COURSES, courseLabel, findCourse } from '@/lib/courses/courses';
import { ProgressRing } from '@/lib/components/learn/courses/CourseUI';
import { MasteryBar } from '@/lib/components/learn/progress/ProgressRadar';
import { FilterMenu, CourseTree } from './Filters';
import { DIFFICULTIES, tally } from './rows';

/*
The Questions page's Progress card: questions complete out of the questions that really exist in the
ticked courses, by difficulty or by topic. Its course checkboxes are the same as the table's Course
filter, but separate from it; they start on the student's own courses.
*/

const VIEWS = [
  { id: 'difficulty', label: 'By difficulty' },
  { id: 'topic', label: 'By topic' },
];

export default function QuestionProgress({ rows, tree, initialCourses }) {
  const [selected, setSelected] = useState(initialCourses);
  const [view, setView] = useState('difficulty');

  const inCourses = rows.filter((r) => selected.includes(r.courseId));
  const done = inCourses.filter((r) => r.status === 'complete').length;

  let groups;
  if (view === 'difficulty') {
    const byDifficulty = tally(inCourses, (r) => r.difficulty);
    // the four difficulties always, in order (0 / 0 says there are none yet), then anything unexpected
    groups = [
      ...DIFFICULTIES.map((d) => byDifficulty.get(d) ?? { key: d, total: 0, completed: 0 }),
      ...[...byDifficulty.values()].filter((g) => !DIFFICULTIES.includes(g.key)),
    ];
  } else {
    groups = [...tally(inCourses, (r) => r.topic || 'Other').values()].sort((a, b) => a.key.localeCompare(b.key));
  }

  return (
    <section className="learn-topic">
      <div className="learn-topic__head">
        <h2 className="learn-topic__name">
          <i className="bi bi-pie-chart" aria-hidden="true" /> Progress
        </h2>
      </div>
      <div className="learn-panel__body">
        <div className="learn-qprogress__courses">
          <FilterMenu label={coursesText(selected)} active={selected.length > 0} end>
            <CourseTree tree={tree} selected={selected} onChange={setSelected} idPrefix="progress-course" />
            <DropdownItem divider />
            <DropdownItem onClick={() => setSelected(initialCourses)}>My courses</DropdownItem>
          </FilterMenu>
        </div>

        {selected.length === 0 ? (
          <p className="learn-progress__meta">Tick a course to see your progress.</p>
        ) : (
          <>
            <div className="learn-hero__progress">
              <ProgressRing
                completed={done}
                total={inCourses.length}
                label={`${done} of ${inCourses.length} questions complete`}
              />
              <div>
                <p className="learn-course__count">
                  {done} of {inCourses.length}
                </p>
                <p className="learn-course__note">questions complete</p>
              </div>
            </div>

            <div role="group" aria-label="Show progress" className="learn-home__filter learn-qprogress__views">
              {VIEWS.map((v) => (
                <Button
                  key={v.id}
                  size="sm"
                  color={v.id === view ? 'info' : 'secondary'}
                  outline={v.id !== view}
                  aria-pressed={v.id === view}
                  onClick={() => setView(v.id)}
                >
                  {v.label}
                </Button>
              ))}
            </div>

            {groups.length === 0 ? (
              <p className="learn-progress__meta">No questions in these courses yet.</p>
            ) : (
              <ul className="learn-qprogress__list">
                {groups.map((g) => (
                  <li key={g.key}>
                    <span>{g.key}</span>
                    <MasteryBar value={g.total ? g.completed / g.total : 0} />
                    <span className="learn-qprogress__count">
                      {g.completed}/{g.total}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// the course button's text: "All courses", "Pure Mathematics · Year 12", "3 courses" or "Choose courses"
function coursesText(selected) {
  if (!selected.length) return 'Choose courses';
  if (COURSES.every((c) => selected.includes(c.id))) return 'All courses';
  if (selected.length === 1) {
    const course = findCourse(selected[0]);
    return course ? courseLabel(course) : '1 course';
  }
  return `${selected.length} courses`;
}
