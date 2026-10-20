'use client';
import { Alert, Spinner } from 'reactstrap';
import { useGetLessonQuery } from '@/lib/redux/slices/apiSlice';
import LessonView from '@/lib/components/learn/lessons/tasks/LessonView';
import LegacyLessonPage from '@/lib/components/learn/lessons/LegacyLessonPage';

/*
/learn/<course>/<chapter>/<lesson slug>   (src/lib/docs/lessons.md)
Loads the lesson and this student's progress from GET /api/lesson/<slug>.
  tasks-format lesson (schemaVersion: 2)  ->  LessonView
  old-format lesson                       ->  the original lesson page, unchanged
?tab=review opens the Review tab (the reviews page links here).
*/
export default function LessonPage({ params, searchParams }) {
  const slug = params.lessonDisplay;
  // refetch on every visit, so progress saved on another device or tab is picked up. Wait for that
  // refetch (isFetching) rather than showing the cached copy, which the student could start editing.
  const { data, error, isFetching } = useGetLessonQuery(slug, { refetchOnMountOrArgChange: true });

  if (isFetching || (!data && !error)) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Spinner color="info" />
      </div>
    );
  }
  if (error) {
    return (
      <Alert color="danger" fade={false} style={{ margin: '2rem auto', maxWidth: '700px' }}>
        {error.status === 401
          ? 'Please sign in to see this lesson.'
          : error.status === 404
            ? "This lesson doesn't exist yet."
            : "This lesson couldn't be loaded. Try refreshing the page."}
      </Alert>
    );
  }
  if (data?.legacy) return <LegacyLessonPage />;

  return (
    <LessonView
      key={slug}
      lesson={data.lesson}
      initialProgress={data.progress}
      nextLesson={data.nextLesson}
      openReview={searchParams?.tab === 'review'}
    />
  );
}
