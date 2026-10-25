'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Alert } from 'reactstrap'
import { useGetCourseOutlineQuery } from '@/lib/redux/slices/apiSlice'
import { courseLabel } from '@/lib/courses/courses'
import { CourseHero, ProgressBar, StatusIcon, ComingSoon, OutlineState } from '@/lib/components/learn/courses/CourseUI'

/*
Chapter page (/learn/<course id>/<chapter>): the chapter's progress ring and Continue button, then one card per
group of lessons (the chapter document's subsections, e.g. "Binomial Building Blocks"), each lesson with its
status. Lessons that aren't built yet are greyed out and not clickable.
Data: the same course outline as the course page (GET /api/courses/<course id>), so the numbers always agree.
*/

const STATUS_TEXT = { 'in-progress': 'In progress', todo: 'Start' }

export default function ChapterPage() {
  const { content, lessonContent } = useParams()
  // refetch on every visit, so a lesson finished a minute ago shows up
  const { data, error, isLoading } = useGetCourseOutlineQuery(content, { refetchOnMountOrArgChange: true })

  const area = data?.areas.find((a) => a.chapters.some((chapter) => chapter.slug === lessonContent))
  const chapter = area?.chapters.find((c) => c.slug === lessonContent)

  return (
    <div className="learn-page">
      <OutlineState isLoading={isLoading} error={error} />

      {data && !chapter && (
        <Alert color="warning">
          We couldn&apos;t find that chapter. <Link href={`/learn/${content}`}>Back to the course</Link>
        </Alert>
      )}

      {chapter && (
        <>
          <CourseHero
            kicker={`${courseLabel(data.course)} · ${area.name}`}
            title={chapter.title}
            completed={chapter.completed}
            total={chapter.total}
            next={chapter.next}
            emptyText="Lessons for this chapter are coming soon."
          />

          <div className="learn-topics">
            {chapter.groups.map((group) => (
              <LessonGroup key={group.heading} group={group} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function LessonGroup({ group }) {
  const built = group.lessons.filter((lesson) => lesson.status !== 'coming-soon')
  const completed = built.filter((lesson) => lesson.status === 'complete').length

  return (
    <section className={`learn-topic${built.length ? '' : ' learn-topic--soon'}`}>
      <div className="learn-topic__head">
        <h2 className="learn-topic__name">{group.heading}</h2>
        {built.length ? (
          <div className="learn-topic__progress">
            <ProgressBar completed={completed} total={built.length} />
            <span>
              {completed} of {built.length} lessons
            </span>
          </div>
        ) : (
          <p className="learn-topic__note">Coming soon</p>
        )}
      </div>

      <ul className="learn-list">
        {group.lessons.map((lesson) => (
          <li key={lesson.slug}>
            {lesson.href ? (
              <Link href={lesson.href} className="learn-row">
                <span className="learn-row__lesson">
                  <StatusIcon status={lesson.status} />
                  {lesson.title}
                </span>
                <span className="learn-row__meta">
                  {STATUS_TEXT[lesson.status]}
                  <i className="bi bi-chevron-right" aria-hidden="true" />
                </span>
              </Link>
            ) : (
              <span className="learn-row learn-row--soon">
                <span className="learn-row__lesson">
                  <StatusIcon status="coming-soon" />
                  {lesson.title}
                </span>
                <ComingSoon />
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
