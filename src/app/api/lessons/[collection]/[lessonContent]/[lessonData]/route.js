import { getLessonData } from "@/lib/mongodb/utils";

export async function GET(request, {params}){
    try {
        const paramsData = await params
       
        const {lessonData}= paramsData

     

        const result = await getLessonData(lessonData)
        const data = result.lessonData[0]
        console.log('The data for this lesson is ', data)

        return new Response(JSON.stringify(data), {
            status:200, 
            headers:{"Content-Type": "application/json"}
        }) 

    } catch(error) {
    return new Response(JSON.stringify({error: error.message}), {
        status:500, 
    headers: {"Content-Type": "application/json"}, 
   })
    }
}
