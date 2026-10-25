"use client";
import { useState } from "react";
import Link from "next/link";
import { Row, Col, Button, Alert } from "reactstrap";
import { useUser } from "@clerk/nextjs";
import { useGetCoursesQuery } from "@/lib/redux/slices/apiSlice";
import { ProgressRing } from "@/lib/components/learn/courses/CourseUI";

/*
Learn landing page (/learn): "Welcome back", a filter by qualification (A level Maths, Further Maths, ...)
and a card per course the student has, grouped by qualification and year.
Courses and lesson progress come from GET /api/courses (src/lib/courses/courses.js).
A course's circle is the % of its built lessons the student has completed.
Cards match the course pages' cards: a teal header band and a 2px ink border.
*/

const ALL = "all";

const COMPONENT_ICONS = {
  "Pure Mathematics": "bi-calculator",
  Statistics: "bi-bar-chart-line",
  Mechanics: "bi-speedometer2",
};

export default function LearnCourses() {
  const { user } = useUser();
  // refetch on every visit, so a lesson finished a minute ago shows up in the circle
  const { data, error, isLoading } = useGetCoursesQuery(undefined, { refetchOnMountOrArgChange: true });
  const [filter, setFilter] = useState(ALL);

  const courses = data?.courses ?? [];
  const qualifications = [...new Set(courses.map((course) => course.qualification))];
  const shown = filter === ALL ? courses : courses.filter((course) => course.qualification === filter);

  // one section per qualification + year, in course-list order: "A level Maths · Year 12", ...
  const groups = [];
  for (const course of shown) {
    const heading = `${course.qualification} · ${course.year}`;
    const group = groups.find((g) => g.heading === heading);
    if (group) group.courses.push(course);
    else groups.push({ heading, courses: [course] });
  }

  return (
    <div className="learn-home">
      <h1 className="learn-home__title">Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!</h1>
      <p className="learn-home__lead">Pick up where you left off, or start something new.</p>

      {qualifications.length > 0 && <CourseFilter options={qualifications} selected={filter} onSelect={setFilter} />}

      {isLoading && (
        <Row>
          {[0, 1, 2].map((i) => (
            <Col key={i} md={6} xl={4}>
              <div className="learn-course learn-course--loading" aria-hidden="true" />
            </Col>
          ))}
        </Row>
      )}

      {error && <Alert color="danger">Your courses couldn&apos;t be loaded. Refresh the page to try again.</Alert>}

      {data && courses.length === 0 && (
        <p className="learn-home__lead">You&apos;re not enrolled on any courses yet.</p>
      )}

      {groups.map((group) => (
        <section key={group.heading}>
          <h2 className="learn-home__group">{group.heading}</h2>
          <Row>
            {group.courses.map((course) => (
              <Col key={course.id} md={6} xl={4}>
                <CourseCard course={course} />
              </Col>
            ))}
          </Row>
        </section>
      ))}
    </div>
  );
}

// "All courses" plus one button per qualification. Selected = filled teal (same as the Progress page toggle).
function CourseFilter({ options, selected, onSelect }) {
  return (
    <div role="group" aria-label="Filter your courses" className="learn-home__filter">
      {[{ value: ALL, label: "All courses" }, ...options.map((q) => ({ value: q, label: q }))].map((option) => {
        const isSelected = option.value === selected;
        return (
          <Button
            key={option.value}
            color={isSelected ? "info" : "secondary"}
            outline={!isSelected}
            aria-pressed={isSelected}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

function CourseCard({ course }) {
  const { total, completed } = course.lessons;
  const hasLessons = total > 0;
  const icon = COMPONENT_ICONS[course.component] ?? "bi-journal-text";

  return (
    <div className={`learn-course${hasLessons ? "" : " learn-course--soon"}`}>
      <div className="learn-course__head">
        <span className="learn-course__icon">
          <i className={`bi ${icon}`} aria-hidden="true" />
        </span>
        <div>
          <h3 className="learn-course__name">{course.component}</h3>
          <p className="learn-course__sub">
            {course.examBoard} · {course.year}
          </p>
        </div>
      </div>

      <div className="learn-course__body">
        <div className="learn-course__stats">
          {hasLessons ? (
            <ProgressRing completed={completed} total={total} />
          ) : (
            <div className="learn-ring learn-ring--soon" aria-hidden="true">
              <i className="bi bi-hourglass-split" />
            </div>
          )}
          <div>
            <p className="learn-course__count">
              {hasLessons ? `${completed} of ${total} lessons` : "Lessons coming soon"}
            </p>
            <p className="learn-course__note">
              {!hasLessons
                ? "We're writing this course now."
                : completed === total
                  ? "All done. Keep it fresh with your reviews."
                  : completed > 0
                    ? "complete. Keep going!"
                    : "You haven't started yet."}
            </p>
          </div>
        </div>

        {hasLessons ? (
          <Button tag={Link} href={`/learn/${course.id}`} color="info" block>
            {completed > 0 ? "Continue" : "Start"} <i className="bi bi-arrow-right" aria-hidden="true" />
          </Button>
        ) : (
          <Button color="secondary" outline block disabled>
            Coming soon
          </Button>
        )}
      </div>
    </div>
  );
}
