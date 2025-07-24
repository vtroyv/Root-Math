//Import the RTK Query methods form the React-specific entry point

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
/* PURPOSE
We are no longer using redux as the main UI state management, we will now be using zustand, therefore this file will simply define the RTK queries and mutations
It will also be responsible for implementing caching.
 
 */

//Define our single API slice object

export const apiSlice = createApi({
    //The cache reducer expectes to be added at `state.api` (already default- this is optional)
    reducerPath: 'api', 
    //All of our requests will have URLs starting with '/api'
    baseQuery: fetchBaseQuery({baseUrl: '/api'}), 
    //the 'endpoints' represent operations and requests for this servrer
    endpoints: builder => ({
        //The `getQuestions` endpont is a "query" operation that returns data.
        getQuestions: builder.query({
            query: () => '/questions'
        }),

        //The `gradeQuestion` endpoint is a "mutation" operation that updates the DB, and returns feedback data
        gradeQuestion: builder.mutation({
            query: (questionData) => ({
                url: '/feedback',
                method: 'POST',
                body: questionData

            })
        }),
        lessonQuestionFeedback: builder.mutation({
            query: (lessonData) => ({
                url: `/lessontasks/${lessonData.slug}/${lessonData.partID}/${lessonData.task}`, 
                method:'POST', 
                body: lessonData
            })
        })
        ,

        getLessonContent: builder.query({
            query: (params)=> `/lessons/${params.collection}/${params.lessonContent}`
        }),

        // Note we use a place holder in the query below, simply due to the way our api routes have been nested.
        getLessonData: builder.query({
            query: (params) => `lessons/lesson-data/placeholder/${params.lessonData}`
        })
        ,
        dynamicLessonData: builder.mutation({
            query: ({params, userId, examBoard}) => ({
                url: `lessons/lesson-data/placeholder/${params.lessonData}`, 
                method:'POST', 
                body: {userId,examBoard}
            })
        }),
        updateLessonProgress: builder.mutation({
            query: (userProgress) =>({
                url: 'lessonprogress', 
                method:'POST', 
                body: userProgress
                
            })
        }),

        dynamicQuestionData: builder.mutation({
            query: ({params, userId, examBoard}) => ({
                url: `questions/${params.title}`, 
                method: 'POST',
                body: {userId, examBoard}
            })
        }), 

        gradeSketchQuestion: builder.mutation({
            query: (questionData) => ({
                url: '/feedback/sketch', 
                method:'POST', 
                body: questionData
            })
        }),

        createUser: builder.mutation({
            query:(userData) =>({
                url:'/users', 
                method:'POST',
                body:userData
            })
        }),

        askTutor: builder.mutation({
            query:(prompt) =>({
                url:'/tutor/asktutor', 
                method:'POST',
                body:prompt
            })
        })

       

    })
})


export const { 

    useGetQuestionsQuery,
    useGradeQuestionMutation,
    useGradeSketchQuestionMutation,
    useGetLessonContentQuery, 
    useGetLessonDataQuery, 
    useLessonQuestionFeedbackMutation, 
    useCreateUserMutation, 
    useDynamicLessonDataMutation, 
    useDynamicQuestionDataMutation,
    useUpdateLessonProgressMutation, 
    useAskTutorMutation
    } = apiSlice;



