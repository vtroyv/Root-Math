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
    // cache tags: rating a review card refreshes the question's review data (e.g. the "Review · 2" count)
    tagTypes: ['Reviews'],
    //the 'endpoints' represent operations and requests for this servrer
    endpoints: builder => ({
        //The `getQuestions` endpont is a "query" operation that returns data.
         getQuestions: builder.query({
      // now our hook expects an object like { userId, examBoard }
      query: ({ userId, examBoard }) => ({
        url: '/questions',
        method: 'GET',
        // this becomes /questions?userId=…&examBoard=…
        params: { userId, examBoard },
      }),
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
        updateQuestionProgress: builder.mutation({
            query: (userProgress) => ({
                url: 'question-progress', 
                method:'POST', 
                body: userProgress
            })
        }), 

        // QUESTION NOTE METHODS //
        // ######################################################
        updateQuestionNotes: builder.mutation({
            query: (noteData) => ({
                url: 'question-notes', 
                method:'POST', 
                body: noteData
            })
        }), 

        getQuestionNotes: builder.query({
            query: ({userId, questionUrl}) =>({
                url:'question-notes', 
                method:'GET', 
                params: {userId, questionUrl}
                
            })
        }),

        // similarly creaet a PUT method for updating and a delete method for deleting
        


        // ##################################################
        

        dynamicQuestionData: builder.mutation({
            query: ({params, userId, examBoard}) => ({
                url: `questions/${params.title}`, 
                method: 'POST',
                body: {userId, examBoard}
            })
        }), 

        // ─── Review cards (src/lib/docs/question-reviews.md) ───
        // a question's review cards + due dates for the signed-in student; `today` = local 'YYYY-MM-DD'
        getQuestionReviews: builder.query({
            query: ({title, today}) => ({
                url: `/reviews/question/${encodeURIComponent(title)}`,
                params: {today}
            }),
            providesTags: (result, error, {title}) => [{type: 'Reviews', id: title}]
        }),
        // mark an answer / choice / order card -> { correct, result, explanation }
        checkReviewCard: builder.mutation({
            query: (body) => ({ url: '/reviews/check', method: 'POST', body })
        }),
        // record a rating -> { mode, due, intervalDays }
        rateReviewCard: builder.mutation({
            query: (body) => ({ url: '/reviews/rate', method: 'POST', body }),
            invalidatesTags: (result, error, {title}) => [{type: 'Reviews', id: title}]
        }),

        // Skill Radar: mastery per specification area for the signed-in student
        getMastery: builder.query({
            query: (spec) => ({
                url: '/mastery',
                params: spec ? {spec} : undefined
            })
        }),

        // Marks every part of a parts-based question -> { results, marksAwarded, marksAvailable, status, feedback }
        markQuestion: builder.mutation({
            query: ({title, responses}) => ({
                url: '/mark',
                method: 'POST',
                body: {title, responses}
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
    useUpdateQuestionProgressMutation,
    useAskTutorMutation,
    useUpdateQuestionNotesMutation,
    useMarkQuestionMutation,
    useGetMasteryQuery,
    useGetQuestionReviewsQuery,
    useCheckReviewCardMutation,
    useRateReviewCardMutation
    } = apiSlice;



