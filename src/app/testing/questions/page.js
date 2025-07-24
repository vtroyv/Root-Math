'use client'

import {useEffect, useState, useRef}  from 'react';
import { useGetQuestionsQuery, useGradeQuestionMutation } from '@/lib/redux/slices/apiSlice';
import { useParams } from "next/navigation";
import {useUser} from '@clerk/nextjs';
import TwoPaneResponsive from "@/lib/components/learn/lessons/TwoPaneResponsive";
import ComputeEngineConfig from '@/lib/utils/ceConfig';
import preprocessLatex from '@/lib/utils/preprocess-latex';
import Feedback from '@/lib/components/questions/feedback';
import FullResponse from '@/lib/components/questions/FullResponse';
import Selection from '@/lib/components/questions/Selection';
import Sketch from '@/lib/components/questions/Sketch';
import Explain from '@/lib/components/questions/Explain';
import FillInBlank from '@/lib/components/questions/FillInBlank';
import NewFullResponse from '@/lib/components/questions/questionTypes/newFullResponse';
import SelectionQuestion from '@/lib/components/questions/SelectionQuestion';


export default function QuestionDisplayPage({params}) {
    const {data, isLoading, isSuccess} = useGetQuestionsQuery();
  
    if (isLoading) {
        return <h1>Loading...</h1>
    }

    const question = data?.find(obj => obj.title==='Sum-Product-inequality-proof');

    console.log('The question is ',question)
    if(!question) {
        return <h1>Question not found</h1>
    }

  const selectComponent = (questionType) =>{
    if (questionType === 'fullResponse' ) {
      return <NewFullResponse question={question} />

    } else if (questionType === 'selection') {
      return <Selection question={question}/>

    } else if (questionType === 'sketch') {
      return <Sketch question={question}/>
    
    } else if (questionType ==='explain') {
      return <Explain />

    } else if (questionType === 'fillInBlank') {
      return <FillInBlank />
    } else {
      return <div> No suitible question container for this type of question</div>
    }

  }




    const feedback = <Feedback  details={question.details}/> /* <---- i need to add in props here e.g. instructions for the question etc, then have it displayed accordingly  */
    return (
        <div>
            <TwoPaneResponsive question = {selectComponent(question.type)} feedback = {feedback}/>
        </div>
    );
}

// Now that ive got the TwoPane Responsive set up i need to focus on displaying the question and everything correctly 
