'use client'

import { useGetQuestionsQuery, useGradeQuestionMutation } from '@/lib/redux/slices/apiSlice';
import FullResponse from '@/lib/components/questions/FullResponse';
import Selection from '@/lib/components/questions/Selection';
import Sketch from '@/lib/components/questions/Sketch';
import Explain from '@/lib/components/questions/Explain';
import FillInBlank from '@/lib/components/questions/FillInBlank';
import NewFullResponse from '@/lib/components/questions/questionTypes/newFullResponse';
import Feedback from '@/lib/components/questions/feedback';
import TwoPaneResponsive from "@/lib/components/learn/lessons/TwoPaneResponsive";
import { useUser } from '@clerk/nextjs';
import { useEffect,useState } from 'react';
import { useDynamicQuestionDataMutation } from '@/lib/redux/slices/apiSlice';
import { useQuestionStore } from '@/lib/zustand/providers/question-state-provider';





/* 
/quick note, because all the mathfield elements share the same instance of the computeEngine 
on the page, then let's check if we need to use the useREF hook in our code, because it would be more efficient
to not use it, if once we import the CE and configure it, our mathfield element will contain it already. 

Just some food for thought 
*/

export default function QuestionDisplay({ params }) {





  // const { data, isLoading, isSuccess } = useGetQuestionsQuery();
  const { isSignedIn, user} = useUser();
  const [dynamicQuestionData, mutationState] = useDynamicQuestionDataMutation();

  const [question, setQuestion] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const {updateProgress, } = useQuestionStore();

  const progress = useQuestionStore((state) => state.userProgress); //access it like this as i already defined userProgress as state here



  // const title = params.title;
  // console.log('The title is ', title)
    // const question = data?.find(obj => obj.title === title);
  // console.log('The question is', question);

  useEffect(()=> {
    //so currently how im getting the question data is fetching ALL QUESTIONS, then filtering out using params, 
    //INSTEAD LET US ONLY FETCH THIS QUESTION OR EVEN BETTER PASS PERHAPS A PROP 

    const getQuestionData = async () => {
      try {
        if (isSignedIn) {
          const {id, unsafeMetadata} = user
          const {examBoard} = unsafeMetadata

          const dynamicQuestionRouteData = {params, userId: id, examBoard}
          console.log('The dynamicQuestionROute Data is ', dynamicQuestionRouteData)
          
          const {question, existingUserProgress} = await dynamicQuestionData(dynamicQuestionRouteData).unwrap(); //note we use unwrap because it is retruend as {data: {question:..., existingUserProgress...}}
          console.log('the exisitng user progress is ', existingUserProgress)
        setQuestion(question) 
        setUserProgress(existingUserProgress)
        updateProgress(existingUserProgress)
        

   

          

        } 
      } catch(error) {
          console.log('the error is ')
        }

    }

    getQuestionData();
  },[user, isSignedIn])


  useEffect(()=>{
    //now the purpose of this should be to add the useProgress to globalState
    // then in our lower components e.g. FullResponse, we will update the global task state 

    updateProgress(userProgress)
    console.log('Thee current global question state is ', progress)
  }, [userProgress])


 



 if (mutationState.isLoading || mutationState.isUninitialized) {
      return <h1>Loading...</h1>;
  }
  
  //Now this question needs to be stored in some form of state, perhaps react context or zustand as we will 
  //need to read from this in the mytutor component to be able to obtain context of what the user is doing. 
  //It would also be good to write code in each of the question types 
  //To update this shared/global every time the user interacts so the mytutor compoonent can have a up to date 
  //view of the users progess on a lesson/question when ever the user asks a question.

  if (!question) {
      return <h1>Question not found</h1>;
  }

  const selectComponent = (questionType) =>{
    if (questionType === 'fullResponse' ) {
      const feedback = <Feedback  details={question.details}/>
      const fullResponse = <NewFullResponse question={question} />
      return <TwoPaneResponsive question={fullResponse} feedback={feedback} />

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

  //Now essentially i want to have a useEffect that whenever a userProgress for a question is created it adds this to a global state that is updated when the submit button is hit


  return (
      <>
          {/* <h1>
              {question.title.includes('-')
                  ? question.title
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                  : question.title}
          </h1> */}
          {selectComponent(question?.type)}
      </>
  );
}
