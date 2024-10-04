import {createApi, } from '@reduxjs/toolkit/query/react';
import axios from 'axios';


const axiosBaseQuery = ({baseUrl} = {baseUrl:''}) => async({url, method, data, params}) =>{
    try{
        const result = await axios({url:baseUrl + url, method, data, params})
        return {data: result.data}
    } catch(axiosError) {
        let err= axiosError
        return {
            error: {status: err.response?.status, data: err.response?.data || err.message,}
        }
    }
}


const learnApi = createApi({
    baseQuery: axiosBaseQuery({ baseUrl: '//localhost:4000/api/' }),
    tagTypes: ['Quizzes'],
    endpoints: (build) => ({
      getQuestions: build.query({
        query: () => ({ url: 'quizzes', method: 'GET' }),
      }),
    }),
    keepUnusedDataFor: 15, // 5 seconds
  });
  
  export const { useGetQuestionsQuery} = learnApi;
  
  export default learnApi;
