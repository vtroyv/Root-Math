// CHANGED 13 Oct 2026: db.js now exports a function (getMongoClient) instead of a promise,
// so a failed connection can be retried. See the comment at the top of db.js.
import getMongoClient from "./db";

let client
let db
let questions 
let lessons
let lessonData
let users 
let userProgress



/*
CHANGED 13 Oct 2026:
  1. Calls getMongoClient() each time it isn't connected yet, so if an earlier
     attempt failed, this one tries again (see db.js).
  2. The real MongoDB error is now logged and included in the thrown message.
     Before, it was replaced with a generic "Failed to establish connection to
     database", which hid the actual cause (bad IP access list, network, wrong URI...).
  3. Every exported function below now starts with `await init()`.
     Before, only getQuestions and getSpecificQuestion did; the rest used `db`
     directly, so if the first connection at startup failed, `db` stayed undefined
     and those functions (lessons, progress, users) kept failing even after the
     network came back. Once connected, init() returns immediately, so it's free.
*/
async function init() {
    if (db) return
    try {
        client = await getMongoClient()
        db = await client.db('RootMath')
        questions = await db.collection('quizzes')

    } catch (error) {
        console.error('MongoDB connection failed:', error)
        throw new Error(`Failed to establish connection to database: ${error.message}`)
    }
}

//so we import the client promise that we created in our db.js file,
// then db = await client.db is mongodb's way of accessing our database

// CHANGED 13 Oct 2026: added .catch. This start-up connection attempt had no error
// handler, so a failure here printed the "unhandledRejection" errors in your terminal.
// Now it just logs; the next request will retry through init().
;(async () => {
    await init()
})().catch(() => console.error('MongoDB: start-up connection failed; will retry on the next request.'))

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
        // CHANGED 13 Oct 2026: log the real cause. The generic message below hid a MongoDB
        // "read ECONNRESET" (IP not on the Atlas Network Access list) behind "Failed to fetch questions!"
        console.error('getQuestions failed:', error)
        return {error: 'Failed to fetch questions!'}
    }
}

export async function getUserProgForAllQuestions(userId, examBoard) {
    await init() // CHANGED 13 Oct 2026: connect (or retry) before using db - see init() above
    //could i acheive this with mongoDB aggregation -> at some later date come back and see if this is possible, 
    //therefore i could save myself from doing two separate api requests to get my desired data.

   switch (examBoard) {
    case 'edexcel':
        const progressCollection1 = db.collection('edexcel-questions-pure-y1-progress')
        const prog1 = await progressCollection1.find({userId}).project({_id:0, title:1, status:1}).toArray();
        return prog1
   }

}

export async function getLessonContent(data) {
    try {
       await init() // CHANGED 13 Oct 2026: connect (or retry) before using db - see init() above
       
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
        await init() // CHANGED 13 Oct 2026: connect (or retry) before using db - see init() above
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
        await init() // CHANGED 13 Oct 2026: connect (or retry) before using db - see init() above
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
      await init() // CHANGED 13 Oct 2026: connect (or retry) before using db - see init() above
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
    await init() // CHANGED 13 Oct 2026: connect (or retry) before using db - see init() above
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
    await init() // CHANGED 13 Oct 2026: connect (or retry) before using db - see init() above
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
    await init() // CHANGED 13 Oct 2026: connect (or retry) before using db - see init() above
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
    await init() // CHANGED 13 Oct 2026: connect (or retry) before using db - see init() above
    const collection = identifyQuesProg(data); 
    const {userId, title} = data

    const questionProgress = await db.collection(collection);

    const result = await questionProgress.findOne({userId, title})

    return result 

}

// NEW 13 Oct 2026 (Skill Radar): every question-progress document for one user in one
// progress collection. collectionData needs { userId, examBoard, branch, year }.
export async function getUserProgressForCollection(collectionData) {
    await init()
    const collection = identifyQuesProg(collectionData)
    return db.collection(collection)
        .find({ userId: collectionData.userId })
        .project({ _id: 0, title: 1, status: 1, marks: 1, attempts: 1, updatedAt: 1 })
        .toArray()
}

// NEW 13 Oct 2026 (Skill Radar): chapter documents ({ name, subsections: { group: [lesson titles] } })
export async function getChapters(collectionName) {
    await init()
    return db.collection(collectionName).find({}).project({ _id: 0, name: 1, subsections: 1 }).toArray()
}

// NEW 13 Oct 2026 (Skill Radar): which lessons are actually built (have content in lesson-data)
export async function getBuiltLessons() {
    await init()
    return db.collection('lesson-data').find({}).project({ _id: 0, slug: 1, title: 1, collection: 1 }).toArray()
}

// NEW 13 Oct 2026 (Skill Radar): one student's lesson progress ({ lessonSlug, completed, updatedAt })
export async function getUserLessonProgressList(collectionName, userId) {
    await init()
    return db.collection(collectionName).find({ userId }).project({ _id: 0, lessonSlug: 1, completed: 1, updatedAt: 1 }).toArray()
}

// ─── Lessons in the tasks format (NEW 20 Oct 2026, src/lib/docs/lessons.md) ───
// Progress lives in `<lesson.collection>-lesson-progress` (e.g. edx-maths-1-lesson-progress),
// one document per student per lesson, whatever the student's exam board.

// one lesson document, with its answer keys and review cards (server only)
export async function getLessonBySlug(slug) {
    await init()
    return db.collection('lesson-data').findOne({ slug })
}

// the fields the reviews page needs, for the given lesson slugs
export async function getLessonSummaries(slugs) {
    await init()
    return db.collection('lesson-data').find({ slug: { $in: slugs } }).project({ _id: 0, slug: 1, title: 1, collection: 1 }).toArray()
}

export async function getLessonProgressDoc(collectionName, userId, lessonSlug) {
    await init()
    return db.collection(collectionName).findOne({ userId, lessonSlug }, { projection: { _id: 0 } })
}

let lessonProgressIndexes = {}
// replace (or create) one student's progress for one lesson
export async function saveLessonProgressDoc(collectionName, progress) {
    await init()
    const collection = db.collection(collectionName)
    lessonProgressIndexes[collectionName] ??= collection
        .createIndex({ userId: 1, lessonSlug: 1 }, { unique: true })
        .catch((error) => { delete lessonProgressIndexes[collectionName]; throw error })
    await lessonProgressIndexes[collectionName]
    // eslint-disable-next-line no-unused-vars
    const { _id, ...doc } = progress
    await collection.replaceOne({ userId: doc.userId, lessonSlug: doc.lessonSlug }, doc, { upsert: true })
}

// ─── Review cards (NEW 14 Oct 2026) ─────────────────────────────────────
// One document per student per card in `reviewStates` (see src/lib/docs/question-reviews.md).
// Card *content* lives on the question document's `review` array; only schedules live here.

let reviewIndexesReady
function ensureReviewIndexes(collection) {
    // created once per server process: one schedule per student per card, and fast "what's due?"
    if (!reviewIndexesReady) {
        reviewIndexesReady = Promise.all([
            collection.createIndex({ userId: 1, cardKey: 1 }, { unique: true }),
            collection.createIndex({ userId: 1, due: 1 }),
        ]).catch((error) => { reviewIndexesReady = undefined; throw error })
    }
    return reviewIndexesReady
}

// one student's schedules for the given cards
export async function getReviewStates(userId, cardKeys) {
    await init()
    return db.collection('reviewStates').find({ userId, cardKey: { $in: cardKeys } }).project({ _id: 0 }).toArray()
}

// every schedule one student has (only what the reviews page needs), for "what's due across everything?"
export async function getAllReviewStates(userId) {
    await init()
    return db.collection('reviewStates').find({ userId }).project({ _id: 0, cardKey: 1, source: 1, due: 1 }).toArray()
}

// the fields needed to place questions in a course and skill, for the given titles
export async function getQuestionSummaries(titles) {
    if (!questions) await init()
    return questions.find({ title: { $in: titles } }).project({ _id: 0, title: 1, branch: 1, year: 1, topic: 1 }).toArray()
}

// insert new schedules, ignoring any that already exist (e.g. two tabs unlocking at once)
export async function createReviewStates(states) {
    if (!states.length) return
    await init()
    const collection = db.collection('reviewStates')
    await ensureReviewIndexes(collection)
    try {
        await collection.insertMany(states.map((s) => ({ ...s })), { ordered: false })
    } catch (error) {
        const errors = error.writeErrors ?? [error]
        if (!errors.every((e) => e.code === 11000)) throw error // only duplicates are expected
    }
}

// save one student's schedule for one card
export async function saveReviewState(state) {
    await init()
    // eslint-disable-next-line no-unused-vars
    const { _id, ...rest } = state
    await db.collection('reviewStates').replaceOne({ userId: state.userId, cardKey: state.cardKey }, rest)
}

export async function createUserQuestionProgress(progressData, collectionData) {
    await init() // CHANGED 13 Oct 2026: connect (or retry) before using db - see init() above
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