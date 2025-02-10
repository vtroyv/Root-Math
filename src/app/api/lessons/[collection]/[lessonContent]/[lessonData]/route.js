import { getLessonData, createUserLessonProgress } from "@/lib/mongodb/utils";
/*
The we will transform this so were using a POST request instead of a GET request,
the purpose will be to return an obj of the form:

data = {staticLessonData:... , dynamicLessonData:...} 

Therefore we will still be using the getLessonData util but also the UserLessonProgress util 
*/


export async function GET(request, {params}){
    try {
        const paramsData = await params
       
        const {lessonData}= paramsData
        const result = await getLessonData(lessonData)
        console.log('The result is given by ', result)
        const data = result.lessonData[0]
        console.log('The data for this lesson is ', data)

       //Now lets do another request, this should essentially create document of dynamic data for the user if it doesn't exist already or fetch it if it does exist. 
        

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

// export async function POST(request, {params}){
//     //Parse the JSON body from the incoming request
//     const body = await request.json
//     console.log('the body is ')

// }

//Basically when we come back from the gym continue from here, currently wer're aiming to
//return something of the form  data = {staticLessonData:... , dynamicLessonData:...} , 
//and use it to populate the lessonContent, then we will work in integrating the dynamicLessonData, into our work flow, but firstly, 
//let's just create it for a new user and obtain access to it. which will be the purpose of this 
//commented out POST request function above. Once we've obtained it and got access, we will then remove the GET handler above, 
//and change the lessonDisplay page.js to show the lessonState based on the staticLessonData info returned from this new POST request. 