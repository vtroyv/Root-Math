import clientPromise from "./db";

let client
let db
let questions 
let lessons
let lessonData
let users 
let userProgress

async function init() {
    if (db) return 
    try {
        client = await clientPromise
        db = await client.db('RootMath')
        questions = await db.collection('quizzes')
        
    } catch (error) {
        throw new Error('Failed to establish connection to database')
    }
}

//so we import the client promise that we created in our db.js file,
// then db = await client.db is mongodb's way of accessing our database

;(async () => {
    await init()
})()

//we then call this init function to establish the connection

export async function getQuestions() {
    try {
        if(!questions) await init()
            console.log('the questions are', questions)
        const result = await questions.find({}).map(question => ({...question, _id: question._id.toString()})).toArray()

    //we map _id to the string version of _id as, _id is of type objectID and returning objectID's from server to client returns 
    // an error as it's not serializeable
        console.log(result)
        return {questions: result}
    } catch(error) {
        return {error: 'Failed to fetch questions!'}
    }

}

export async function getLessonContent(data) {
    try {
       
       lessons = await db.collection(data.collection)
       console.log('The lessons are ', lessons)
       const result = await lessons.find({}).map(lesson => ({...lesson, _id:lesson._id.toString()})).toArray()
       const selectedContent = result.filter(lesson => lesson.name === data.lessonContent)
       return {lessons: selectedContent}

    } catch(error) {
        return {error: 'Failed to fetch lessons!'}
    }
}

export async function getLessonData(data) {
    try{
        // console.log('The data passed to the mongo function is ', data)
        lessonData = await db.collection('lesson-data')
        //console.log('The lessoData from the collection is ', lessonData)
        
        const result = await lessonData.find({}).map(lesson => ({...lesson, _id:lesson._id.toString()})).toArray()
        //console.log('The result after putting collection documents in array is ', result )
        const selectedLessonData = result.filter(lesson => lesson.slug === data)
       // console.log('The selectedLessonData is ', selectedLessonData)
        return {lessonData: selectedLessonData}
        
    } catch(error) {
        return {error: 'Failed to fetch lesson data!'}
    }
}

export async function createUser(data) {
    try {
        users = await db.collection('users')
        const result = await users.insertOne(data)
        //console.log('the result from adding the user to the DB is ', result)
        return result 

    } catch(error) {
        return {error:'Failed to fetch the data'}
    }
}

export async function createUserLessonProgress(data, examBoard){
    //This function should take in data in particular the usersID, and create a progress for the user if it doesn't exist for that particular lesson, or if it exists simply return it. 
     //I think we need to convert javascript obj to json before adding to mongoDB
    try {
        
        //Once more determine colleciton using examBoard
        if (examBoard === 'edexcel'){
           
            userProgress = await db.collection('edx-maths-1-lesson-progress')
            const result = await userProgress.insertOne(data)
            const insertedId = result.insertedId;
            const result2 = await userProgress.findOne({_id: insertedId})
            console.log('successfully added thew new progress to the DB ',result2 )
            return result2
        }
    } catch(error) {
        return {error:'failed to add new userProgress to DB'}
    }
    
}

export async function getUserLessonProgress(data) {
    //This function should take in the data and userID
    
    const {userId, examBoard, slug} = data

 
    
    //year 12 userProgress userProgress statements.
    //Later on you may wish to add to this as you separate, lessonProgress for differerent years and examBoards 
    try {

    
    if(examBoard === 'edexcel' ) {
        //use the userId, and slug to attempt to fetch the dynamicData. 
      
        userProgress = await db.collection('edx-maths-1-lesson-progress')
        const result = await userProgress.findOne({userId, lessonSlug:slug})
        
        return result 
    }
} catch(error) {
    return {error: 'failed to get userLessonProgress from DB'}
}

    
}