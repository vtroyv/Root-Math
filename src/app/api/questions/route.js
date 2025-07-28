import { getQuestions, getUserProgForAllQuestions } from "@/lib/mongodb/utils";

export async function GET(request) {
  const {searchParams} = new URL(request.url)

  const userId = searchParams.get('userId')
  const examBoard = searchParams.get('examBoard')

  console.log('Thre request is ', request)
  
  try {
    const { questions } = await getQuestions();

    if (!questions) throw new Error("Failed to fetch questions!");
    
    const progList = await getUserProgForAllQuestions(userId, examBoard);

    //me chosing map here is more a stylistic choice + simple apis/methods
    const statusByTitle = new Map(progList.map(p => [p.title, p.status]))
    
    //now i merge the status into each question 

    const enriched= questions.map(q => ({
      ...q, 
      status: statusByTitle.get(q.title) ?? 'Todo'
    }))


    return new Response(JSON.stringify(enriched), {
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
