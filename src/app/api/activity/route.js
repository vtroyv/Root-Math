import { auth } from '@clerk/nextjs/server';
import { getActivity } from '@/lib/mongodb/utils';
import { isDay } from '@/lib/activity/goals';
import { logActivity } from '@/lib/activity/log';

/*
The signed-in student's daily activity (src/lib/activity/goals.js).
GET  /api/activity?from=YYYY-MM-DD&to=YYYY-MM-DD  ->  [{ day, questions, reviews, lessons, minutes }]
POST /api/activity  { minutes, today }  adds active minutes (src/lib/components/learn/StudyTimer.js)
Questions, reviews and lessons are logged by /api/mark, /api/reviews/rate and /api/lesson/<slug>/progress.
*/
export async function GET(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  if (!isDay(from) || !isDay(to) || from > to) return Response.json({ error: 'from and to must be YYYY-MM-DD, from first' }, { status: 400 });

  try {
    const days = await getActivity(userId, from, to);
    return Response.json(
      days.map((d) => ({
        day: d.day,
        questions: d.questions?.length ?? 0,
        reviews: d.reviews ?? 0,
        lessons: d.lessons?.length ?? 0,
        minutes: d.minutes ?? 0,
      })),
    );
  } catch (error) {
    console.error('Loading activity failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Not signed in' }, { status: 401 });

  try {
    // read as text: navigator.sendBeacon bodies don't always arrive as application/json
    const { minutes, today } = JSON.parse(await request.text());
    // the timer sends at most 5 minutes at a time; anything bigger isn't from it
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 15) return Response.json({ error: 'minutes must be 1 to 15' }, { status: 400 });
    await logActivity(userId, today, { minutes });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
