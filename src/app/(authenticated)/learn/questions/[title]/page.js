'use client'

import { useGetQuestionsQuery, useGradeQuestionMutation } from '@/lib/redux/slices/apiSlice';
import FullResponse from '@/lib/components/questions/FullResponse';
import Selection from '@/lib/components/questions/Selection';
import Sketch from '@/lib/components/questions/Sketch';
import Explain from '@/lib/components/questions/Explain';
import FillInBlank from '@/lib/components/questions/FillInBlank';






/* 
/quick note, because all the mathfield elements share the same instance of the computeEngine 
on the page, then let's check if we need to use the useREF hook in our code, because it would be more efficient
to not use it, if once we import the CE and configure it, our mathfield element will contain it already. 

Just some food for thought 
*/

export default function QuestionDisplay({ params }) {
  const { data, isLoading, isSuccess } = useGetQuestionsQuery();
  const title = params.title;
  console.log('The title is', title);

  if (isLoading) {
      return <h1>Loading...</h1>;
  }

  const question = data?.find(obj => obj.title === title);

  if (!question) {
      return <h1>Question not found</h1>;
  }

  const selectComponent = (questionType) =>{
    if (questionType === 'fullResponse' ) {
      return <FullResponse question={question} />

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
          {selectComponent(question.type)}
      </>
  );
}
