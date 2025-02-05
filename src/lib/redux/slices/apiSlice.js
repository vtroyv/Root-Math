//Import the RTK Query methods form the React-specific entry point

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

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
        gradeSketchQuestion: builder.mutation({
            query: (questionData) => ({
                url: '/feedback/sketch', 
                method:'POST', 
                body: questionData
            })
        }),

    })
})


export const { useGetQuestionsQuery, useGradeQuestionMutation, useGradeSketchQuestionMutation, useGetLessonContentQuery, useGetLessonDataQuery ,useLessonQuestionFeedbackMutation } = apiSlice;



