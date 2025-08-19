//The purpose of this route should be to createa a userProgress object for users attempting a question by TOPIC if the user has 
// never attempted that question before, otherwise the purpose should be to fetch it 

import { getSpecificQuestion, getUserQuestionProgress, createUserQuestionProgress } from "@/lib/mongodb/utils";

export async function POST (request, {params}) {
    // const {userProgress } = params
    // console.log('The userProgress is' , userProgress)
    const {userId, examBoard} = await request.json();
    console.log('the sure id is ', userId)

    // console.log('The body is ', body)
    const title = params.title
    let existingUserProgress

    

    try{
        const question = await getSpecificQuestion(title); 
        // console.log('The question is ', question )
        //Now we've got our specific question, next we want to either create a userprogress document for the user, or fetch it 

        try {
          //Now we will try to fetch existing userProgress for this question if it exists, if not we will create it
          //first put together a object to identify where the what the question is and where the userProgress object should be fetched or collected from 

          const fetchData = {
            userId, 
            examBoard, 
            title, 
            branch: question.branch, 
            year: question.year  
          }

          existingUserProgress = await getUserQuestionProgress(fetchData);
          console.log('the existingUser is ', existingUserProgress)

          if (existingUserProgress == null) {
            const newProgressData = createUserProgress(question, userId)
            existingUserProgress = await createUserQuestionProgress(newProgressData, fetchData)
          }
         
          

        } catch(error) {
          console.log('this block is running ')
          console.log({error: error.message})
        }

        console.log('the question is ', question)
        console.log('the userProgess is ', existingUserProgress)

         return new Response(JSON.stringify({question, existingUserProgress}), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}


/**
@param {Object} question
@param {string} userId

 */
function createUserProgress(question, userId) {
  return {
    title: question.title, 
    status: 'Todo', 
    feedback: [], 
    userId, 
    type: question.type, 
    attempts: 0,
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString()
  }
}