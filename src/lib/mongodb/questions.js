import clientPromise from "./db";

let client
let db
let questions 
let lessons

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
    // an error as it's nto serializeable
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