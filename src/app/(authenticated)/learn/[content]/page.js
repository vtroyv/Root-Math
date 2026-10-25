"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetCourseOutlineQuery } from "@/lib/redux/slices/apiSlice";
import { courseLabel } from "@/lib/courses/courses";
import { CourseHero, ProgressBar, StatusIcon, ComingSoon, OutlineState } from "@/lib/components/learn/courses/CourseUI";

/*
Course page (/learn/<course id>): the course's progress ring and Continue button, then one card per topic
(the spec's areas), each listing its chapters with their progress. Chapters with no lessons built yet are
greyed out and not clickable. Topics with no chapters yet list their spec subtopics as coming soon.
Data: GET /api/courses/<course id> (courseOutline in src/lib/courses/courses.js).
*/
export default function CoursePage() {
  const { content } = useParams();
  // refetch on every visit, so a lesson finished a minute ago shows up
  const { data, error, isLoading } = useGetCourseOutlineQuery(content, { refetchOnMountOrArgChange: true });

  return (
    <div className="learn-page">
      <OutlineState isLoading={isLoading} error={error} />

      {data && (
        <>
          <CourseHero
            kicker={`${data.course.examBoard} · ${data.course.qualification}`}
            title={data.course.component}
            subtitle={data.course.year}
            completed={data.completed}
            total={data.total}
            next={data.next}
            emptyText="Lessons for this course are coming soon."
          />

          <h2 className="learn-home__group">Topics in {courseLabel(data.course)}</h2>
          <div className="learn-topics">
            {data.areas.map((area) => (
              <TopicCard key={area.id} courseId={data.course.id} area={area} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TopicCard({ courseId, area }) {
  const hasLessons = area.total > 0;

  return (
    <section className={`learn-topic${hasLessons ? "" : " learn-topic--soon"}`}>
      <div className="learn-topic__head">
        <h3 className="learn-topic__name">{area.name}</h3>
        {hasLessons ? (
          <div className="learn-topic__progress">
            <ProgressBar completed={area.completed} total={area.total} />
            <span>
              {area.completed} of {area.total} lessons
            </span>
          </div>
        ) : (
          <p className="learn-topic__note">Coming soon</p>
        )}
      </div>

      <ul className="learn-list">
        {area.chapters.map((chapter) => (
          <li key={chapter.slug}>
            {chapter.total > 0 ? (
              <Link href={`/learn/${courseId}/${chapter.slug}`} className="learn-row">
                <span>{chapter.title}</span>
                <span className="learn-row__meta">
                  {chapter.completed === chapter.total ? (
                    <StatusIcon status="complete" />
                  ) : (
                    `${chapter.completed} of ${chapter.total}`
                  )}
                  <i className="bi bi-chevron-right" aria-hidden="true" />
                </span>
              </Link>
            ) : (
              <span className="learn-row learn-row--soon">
                <span>{chapter.title}</span>
                <ComingSoon />
              </span>
            )}
          </li>
        ))}

        {area.chapters.length === 0 &&
          area.subtopics.map((subtopic) => (
            <li key={subtopic}>
              <span className="learn-row learn-row--soon">
                <span>{subtopic}</span>
                <ComingSoon />
              </span>
            </li>
          ))}
      </ul>
    </section>
  );
}
