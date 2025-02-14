import { updateUserLessonProgress } from "@/lib/mongodb/utils";

export async function POST(request){
    const body = await request.json();
    console.log('The body is ', body);

    try{
    const result = await updateUserLessonProgress(body)
    if (result.acknowledged){
        return new Response(JSON.stringify(true), 
        {
            headers: {'Content-Type': 'application'}, 
        }
    )
    }
    } catch(error) {
        return new Response(
            JSON.stringify({message:'error', error: error.message}),
            {
                headers:{ 'Content-Type': 'application/json'}, 
                status:500,
            }
        )

    }

}