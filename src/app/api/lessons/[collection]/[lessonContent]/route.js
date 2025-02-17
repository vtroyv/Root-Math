import { getLessonContent } from "@/lib/mongodb/utils";

export async function GET(request,{params}) {
    try{
    const {collection, lessonContent} = await params 
    const data = {collection, lessonContent}
    console.log('The data before sending is ', data)

   const result = await getLessonContent(data)
   console.log('The request is ', )

   
   const lessons = result.lessons[0]
   console.log('The lessons are', lessons)

    return new Response(JSON.stringify(lessons), {
        status: 200, 
        headers : {"Content-Type": "application/json"},
    })
} catch (error) {
    return new Response(JSON.stringify({error: error.message}), {
        status: 500, 
        headers :{ "Content-Type": "application/json" },
    })
}
}
