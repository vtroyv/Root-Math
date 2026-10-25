import { currentUser } from '@clerk/nextjs/server';
import { getBuiltLessons } from '@/lib/mongodb/utils';
import { SPECS } from '@/lib/mastery/specs';
import { coursesForUser } from '@/lib/courses/courses';
import { loadCourseOutline } from '@/lib/courses/server';

// GET /api/courses -> the signed-in student's courses, each with lessons: { total, completed }.
// The course list comes from the student's Clerk publicMetadata (src/lib/courses/courses.js).
// The numbers are the same as the course page's (both come from courseOutline).
export async function GET() {
  const user = await currentUser();
  if (!user) return Response.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const courses = coursesForUser(user);
    const built = courses.some((course) => SPECS[course.id]?.lessons) ? await getBuiltLessons() : [];

    const withProgress = await Promise.all(
      courses.map(async (course) => {
        const { total, completed } = await loadCourseOutline(course, user.id, built);
        return { ...course, lessons: { total, completed } };
      }),
    );

    return Response.json({ courses: withProgress });
  } catch (error) {
    console.error('Courses failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
