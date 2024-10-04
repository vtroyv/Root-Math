import { getQuestions } from "@/lib/mongodb/questions";

export async function GET() {
  try {
    const { questions } = await getQuestions();
    if (!questions) throw new Error("Failed to fetch questions!");

    return new Response(JSON.stringify(questions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
