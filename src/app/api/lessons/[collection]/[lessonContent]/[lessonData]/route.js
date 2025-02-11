import { getLessonData, createUserLessonProgress, getUserLessonProgress } from "@/lib/mongodb/utils";
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
        // console.log('The result is given by ', result)
        const data = result.lessonData[0]
        // console.log('The data for this lesson is ', data)

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

export async function POST(request, {params}){
    //First lets get the lessonData then use the createUserLessonProgress code!
    const {userId, examBoard} = await request.json();    
    let result2;
    try { 
        //Fetch the static lessonData
        const paramsData = await params
        // console.log('The params are ', paramsData)
        const {lessonData} = paramsData
        const result1 = await getLessonData(lessonData)
        const staticLessonData = result1.lessonData[0]
        // console.log('the staticLessonData is ', staticLessonData)

        //Sort out Fetch of dynamic UserData

        //Now i want to start by attempting to fetch it using userID and lessonslug 
        const slug = staticLessonData.slug 
        const fetchData  = {slug, userId, examBoard}


        try {
            

            result2 = await getUserLessonProgress(fetchData)
            console.log('because the result2, already existed now it was successfully fetched and is ', result2)
            
            if (result2 == null) {
                const newProgressData = createUserProgress(staticLessonData, userId)
                 result2 = await createUserLessonProgress(newProgressData, examBoard)

                console.log('The returned result from mongoBD of adding the user to the database is ', result2)
                
            }

        } catch(error) {
           //If it returns an error we create the progressData for theuser,--- does it even return an error 
        }

        const userProgressData = result2
        
       //Now return this data to the front end and begin adjusting the front end so that it renders the staticlessondata, 
       //and changes like progress and feedback are added and displayed from the dynamicLessonData.
       const  data = {staticLessonData, userProgressData }
       console.log('The data i wish to send back to client is ', data)
       

        return new Response(JSON.stringify(data), 
    {
        status:200,
        headers: {'Content-Type':'application/json'}
    })
    } catch(error) {
        return new Response(JSON.stringify({message:'we have an error'}))
    }

}



/*Basically when we come back from the gym continue from here, currently wer're aiming to
//return something of the form  data = {staticLessonData:... , dynamicLessonData:...} , 
//and use it to populate the lessonContent, then we will work in integrating the dynamicLessonData, into our work flow, but firstly, 
//let's just create it for a new user and obtain access to it. which will be the purpose of this 
//commented out POST request function above. Once we've obtained it and got access, we will then remove the GET handler above, 
and change the lessonDisplay page.js to show the lessonState based on the staticLessonData info returned from this new POST request. */

/**
 * Takes in static lesson data and a userId,
 * and returns an object ready for insertion into your MongoDB user progress collection.
 *
 * @param {Object} staticLessonData - The lesson object with fields like slug, parts, etc.
 * @param {string} userId - The identifier for the current user.
 * @returns {Object} - The user progress object.
 */
function createUserProgress(staticLessonData, userId) {
    const { slug: lessonSlug, parts } = staticLessonData;
    
    // Map over each part in the lesson.
    const partsProgress = parts.map((part) => {
      // Filter the blocks to only those that represent tasks.
      const tasks = part.blocks
        .filter((block) => block.type === "task")
        .map((task, index) => {
          // Generate a unique taskId.
          // Note: if part.id is an object (e.g., { $numberInt: "1" }), extract the value.
          const partId = typeof part.id === "object" && part.id.$numberInt 
            ? part.id.$numberInt 
            : part.id;
          return {
            taskId: `part-${partId}-task-${index + 1}`,
            title: task.title,
            instructions: task.instructions,
            hint: task.hint,
            expected: task.gpt,  // You might rename this field to "expectedAnswer" if you prefer.
            // Initial status fields for when the user hasn't answered yet.
            status: "locked",   // Could also be "not attempted" or similar.
            answer: null,
            correct: null,
            feedback: null,
            submittedAt: null
          };
        });
        
      return {
        partId: typeof part.id === "object" && part.id.$numberInt 
                  ? part.id.$numberInt 
                  : part.id,
        title: part.title,
        tasks
      };
    });
    
    // Return the overall progress object.
    return {
      lessonSlug,
      userId,
      parts: partsProgress,
      completed: false,  // Overall lesson completion flag.
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
