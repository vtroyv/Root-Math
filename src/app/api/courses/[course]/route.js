import { currentUser } from '@clerk/nextjs/server';
import { findCourse, coursesForUser } from '@/lib/courses/courses';
import { loadCourseOutline } from '@/lib/courses/server';

// GET /api/courses/<course id> -> that course's outline for the signed-in student: its topics, their chapters
// and every chapter's lessons, each with a status (courseOutline in src/lib/courses/courses.js).
// Used by the course page and the chapter page.
export async function GET(request, { params }) {
  const user = await currentUser();
  if (!user) return Response.json({ error: 'Not signed in' }, { status: 401 });

  const course = findCourse(params.course);
  if (!course) return Response.json({ error: `Unknown course "${params.course}"` }, { status: 404 });
  if (!coursesForUser(user).some((c) => c.id === course.id)) {
    return Response.json({ error: 'This course isn’t on your account' }, { status: 403 });
  }

  try {
    return Response.json(await loadCourseOutline(course, user.id));
  } catch (error) {
    console.error('Course outline failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
