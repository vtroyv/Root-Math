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
        })

    })
})


export const { useGetQuestionsQuery } = apiSlice;



