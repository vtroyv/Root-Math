import { getSpecificQuestion } from '@/lib/mongodb/utils';
import { markQuestion } from '@/lib/marking';
import { toClientQuestion } from '@/lib/marking/sanitize';
import { clientIp, underRateLimit } from '@/lib/forms/server';
import { SAMPLE_QUESTIONS } from '@/lib/marking/sampleQuestions';

/*
Public, no account needed: serves and marks the sample questions on the /teachers page.
Nothing is saved except the rate limit counter. See docs/teachers-page.md.
*/

const HOUR = 60 * 60 * 1000;
const MAX_MARKS_PER_IP_PER_HOUR = 60;
const LLM_PARTS = ['working', 'explain'];

// null unless the title is on the list and the question can be marked without the LLM.
async function loadSample(title) {
  if (!SAMPLE_QUESTIONS.some((sample) => sample.title === title)) return null;
  const question = await getSpecificQuestion(title);
  if (!question?.parts || question.parts.some((part) => LLM_PARTS.includes(part.type))) return null;
  return question;
}

const notFound = () => Response.json({ error: 'Sample question not found.' }, { status: 404 });

export async function GET(request) {
  try {
    const question = await loadSample(new URL(request.url).searchParams.get('title'));
    return question ? Response.json(toClientQuestion(question)) : notFound();
  } catch (error) {
    console.error('Sample question: could not load:', error);
    return Response.json({ error: 'Could not load the question.' }, { status: 500 });
  }
}

// Body: { title, responses: [response per part] }
export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: 'Invalid request.' }, { status: 400 });

  try {
    if (!(await underRateLimit(`sample:${clientIp(request)}`, MAX_MARKS_PER_IP_PER_HOUR, HOUR))) {
      return Response.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }
    const question = await loadSample(body.title);
    if (!question) return notFound();

    const marked = await markQuestion(question, Array.isArray(body.responses) ? body.responses : []);
    return Response.json(marked);
  } catch (error) {
    console.error('Sample question: marking failed:', error);
    return Response.json({ error: 'Could not mark your answer.' }, { status: 500 });
  }
}
