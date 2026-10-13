import { markAnswer, markChoice, markOrder, markPlace, markSketch, buildResult } from './deterministic.js';
import { markWithLLM } from './llm.js';

const MARKERS = {
  answer: markAnswer,
  choice: markChoice,
  order: markOrder,
  place: markPlace,
  sketch: markSketch,
  working: (part, response, question) => markWithLLM(question, part, response),
  explain: (part, response, question) => markWithLLM(question, part, response),
};

/*
Marks every part of a parts-based question.
`question` is the full DB document, `responses[i]` is the student's response to parts[i].
Returns { results: [PartResult], marksAwarded, marksAvailable, status, feedback: [blocks] }
*/
export async function markQuestion(question, responses = []) {
  const results = await Promise.all(
    question.parts.map(async (part, i) => {
      const marker = MARKERS[part.type];
      if (!marker) return buildResult(part, 0, [{ type: 'paragraph', content: `Unknown part type "${part.type}".` }], {}, false);
      try {
        return await marker(part, responses[i], question);
      } catch (error) {
        console.error(`Marking part ${i} (${part.type}) of ${question.title} failed:`, error);
        return {
          ...buildResult(part, 0, [], {}, false),
          status: 'error',
          feedback: [{ type: 'paragraph', content: "This part couldn't be marked right now. Please try again." }],
        };
      }
    }),
  );

  const marksAwarded = results.reduce((sum, r) => sum + r.marksAwarded, 0);
  const marksAvailable = results.reduce((sum, r) => sum + r.marksAvailable, 0);
  const status = results.every((r) => r.status === 'correct') ? 'complete' : 'incomplete';

  return { results, marksAwarded, marksAvailable, status, feedback: summaryBlocks(question, results, marksAwarded, marksAvailable) };
}

// One combined block list for the right-hand Feedback tab
function summaryBlocks(question, results, marksAwarded, marksAvailable) {
  const blocks = [{ type: 'heading', level: 3, content: `${marksAwarded} / ${marksAvailable} marks` }];
  results.forEach((result, i) => {
    const part = question.parts[i];
    const label = part.label ?? (question.parts.length > 1 ? `Part ${i + 1}` : 'Your answer');
    const status = result.status === 'unanswered' ? 'not answered' : `${result.marksAwarded} / ${result.marksAvailable}`;
    blocks.push({ type: 'heading', level: 5, content: `${label}: ${status}` });
    blocks.push(...result.feedback);
  });
  return blocks;
}
