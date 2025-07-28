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
            // console.log('the questions are', questions)
        const result = await questions.find({}).map(question => ({...question, _id: question._id.toString()})).toArray()

    //we map _id to the string version of _id as, _id is of type objectID and returning objectID's from server to client returns 
    // an error as it's not serializeable
        // console.log(result)
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

export async function createUserLessonProgress(data, examBoard) {
    try {
      if (examBoard === 'edexcel') {
        userProgress = await db.collection('edx-maths-1-lesson-progress');
  
        // Ensure the unique index exists. (This could also be done during initialization.)
        await userProgress.createIndex({ userId: 1, lessonSlug: 1 }, { unique: true });
  
        // Attempt to insert the new document.
        const result = await userProgress.insertOne(data);
        const insertedId = result.insertedId;
        const result2 = await userProgress.findOne({ _id: insertedId });
        console.log('Successfully added new progress to the DB:', result2);
        return result2;
      }
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error: a document with the same userId and lessonSlug already exists.
        const existingDoc = await userProgress.findOne({
          userId: data.userId,
          lessonSlug: data.lessonSlug,
        });
        console.log('User progress already exists, fetched existing progress:', existingDoc);
        return existingDoc;
      }
      return { error: 'Failed to add new userProgress to DB' };
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
      //how do we know it will be this database below, are you planning to pu
        userProgress = await db.collection('edx-maths-1-lesson-progress')
        const result = await userProgress.findOne({userId, lessonSlug:slug})
        
        return result 
    }
} catch(error) {
    return {error: 'failed to get userLessonProgress from DB'}
    }
}

export async function updateUserLessonProgress(data) {
    const {collection, progress} = data; 

    console.log('the progress is ', progress)
    const {_id, ...progressWithoutId} = progress

    const clonedProgress = JSON.parse(JSON.stringify(progressWithoutId));
  
    try {

    if (collection === 'edx-maths-1') {
        console.log('inside the if statement')
        userProgress = await db.collection('edx-maths-1-lesson-progress');
        const userId = progress.userId;
        const lessonSlug = progress.lessonSlug 
        const filter = {userId, lessonSlug }
        console.log('the filter is ', filter)   
        const result = await userProgress.replaceOne(filter, clonedProgress);
        console.log('The result is ', result)
        return result 
        
    }
 } catch(error){
    return {error: 'failed to update the userProgress in DB'}
 } 
} 

export async function updateUserQuestionProgress(data) {
    const {collectionIdentifier ,progress} = data; 

    const {_id, ...progressWithoutId} = progress;

    const clonedProgress = JSON.parse(JSON.stringify(progressWithoutId))
    /*
    userId, examBoard, title, branch, year must be contained in collectionIdentifier

    */

    const collection = identifyQuesProg(collectionIdentifier) 


    try{
        const userQuestionProgress = await db.collection(collection)
        const {userId, title} = progress;

        const filter = {userId, title}

        const result = await userQuestionProgress.replaceOne(filter, clonedProgress);
        console.log('The result is ', result )
        return result 
    
    } catch(error) {
        return {error: 'failed to update the userProgress in the DB'}
    }


}

export async function getSpecificQuestion(title) {
    
     if(!questions) await init()
    const result = await questions.findOne({title:title})
     return result 
}

export async function getUserQuestionProgress(data) {
    const collection = identifyQuesProg(data); 
    const {userId, title} = data

    const questionProgress = await db.collection(collection);

    const result = await questionProgress.findOne({userId, title})

    return result 

}

export async function createUserQuestionProgress(progressData, collectionData) {
    //the progressData contains the data that should be put as the new userProgress Data, 
    //the collectionData contains the data used to identify what collection 

    const {userId, title }= collectionData
    const collection = identifyQuesProg(collectionData); 
    const userQuestionProgress = await db.collection(collection)
try{
    


    await userQuestionProgress.createIndex({userId:1, title:1},{unique:true});

    const result = await userQuestionProgress.insertOne(progressData); 
    const insertedId = result.insertedId
    const questionProgress = await userQuestionProgress.findOne({_id: insertedId})
    return questionProgress
} catch(error){
    if (error.code === 11000) {
        //duplicate key error: a document with the same userId and title already exists,
        const existingDoc = await userQuestionProgress.findOne({userId, title})
        console.log('User progress already exists, fetched existing progress:', existingDoc)
        return existingDoc
        
    }
    return {error: 'Failed to add new userProgress to DataBase'}
}
    
}

function identifyQuesProg(data) {
      const {userId, examBoard, title, branch, year} = data

    const correctYear = (year == '12') ? 'y1' : 'y2'

    const collection = `${examBoard}-questions-${branch}-${correctYear}-progress`
    return collection
}