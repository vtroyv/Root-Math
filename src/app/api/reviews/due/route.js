import { auth } from '@clerk/nextjs/server';
import { getAllReviewStates, getQuestionSummaries, getLessonSummaries, getChapters } from '@/lib/mongodb/utils';
import { summariseQuestionReviews, summariseLessonReviews } from '@/lib/reviews/due';
import { SPECS } from '@/lib/mastery/specs';
import { isDay } from '@/lib/reviews/scheduler';

/*
GET /api/reviews/due?today=YYYY-MM-DD
Every question and lesson the signed-in student has unlocked review cards for, across all
courses, with how many cards are due and the course and skill each belongs to:
  { questions: [...], lessons: [...] }   (entry shapes: src/lib/reviews/due.js)
The reviews page, the REVIEWS nav count and the Skill Radar's Outstanding reviews card all
read this, filtering in the browser.
*/
export async function GET(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  const today = new URL(request.url).searchParams.get('today');
  if (!isDay(today)) return Response.json({ error: 'today must be YYYY-MM-DD (the student’s local date)' }, { status: 400 });

  try {
    const states = await getAllReviewStates(userId);
    const idsOf = (kind, field) => [...new Set(states.filter((s) => s.source?.kind === kind).map((s) => s.source[field]))];

    const titles = idsOf('question', 'title');
    const questions = titles.length ? await getQuestionSummaries(titles) : [];

    const slugs = idsOf('lesson', 'slug');
    const lessons = slugs.length ? await getLessonSummaries(slugs) : [];
    // each lesson's chapter (for its link and skill) comes from its course's chapter collection
    const chaptersByCourse = {};
    for (const courseId of new Set(lessons.map((l) => l.collection))) {
      const chapterCollection = SPECS[courseId]?.lessons?.chapterCollection;
      if (chapterCollection) chaptersByCourse[courseId] = await getChapters(chapterCollection);
    }

    return Response.json({
      questions: summariseQuestionReviews(states, questions, today),
      lessons: summariseLessonReviews(states, lessons, chaptersByCourse, today),
    });
  } catch (error) {
    console.error('Loading due reviews failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
