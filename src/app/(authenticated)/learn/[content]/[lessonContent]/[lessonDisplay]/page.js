'use client';
import ThreePaneLesson from '@/lib/components/learn/ThreePaneLesson';
import LessonDisplay from '@/lib/components/learn/LessonDisplay'; 
// or wherever your LessonDisplay code is

export default function SomeLessonPage() {
  return (
    <ThreePaneLesson
      instructions={
        <div>
          <h2>Lesson Instructions</h2>
          <p>
            Here is where you put instructions, tips, or any text you want
            displayed on the left side.
          </p>
        </div>
      }
      mainContent={<LessonDisplay />} 
      feedback={
        <div>
          <h2>Feedback</h2>
          <p>Show user feedback, hints, or logs here.</p>
        </div>
      }
    />
  );
}
