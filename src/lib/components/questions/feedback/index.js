'use client'
import React, {useState, useEffect, useRef} from 'react';
import {Nav, NavItem, NavLink,TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import QuestionFeedbackPane from './questionFeedbackPane';
import QuestionInstructionPane from './questionInstructionPane';
import QuestionSolutionPane from './questionSolutionPane';
import QuestionNotesPane from './questionNotesPane';
import { useQuestionStore } from '@/lib/zustand/providers/question-state-provider';
import ReviewPane from '../reviews/ReviewPane';
import { useGetQuestionReviewsQuery } from '@/lib/redux/slices/apiSlice';
import { localToday } from '@/lib/reviews/localDay';

// "Review" tab label with the number of cards due, e.g. "Review · 2".
// Uses the same cached query as ReviewPane, so it adds no extra request.
function ReviewTabLabel({title}) {
    const [today] = useState(localToday)
    const {data} = useGetQuestionReviewsQuery({title, today}, {skip: !title})
    return <>Review{data?.dueCount > 0 && <strong style={{color: '#17a2b8'}}> · {data.dueCount}</strong>}</>
}

// reviewTitle = the question's title, used by the Review tab (review cards, src/lib/docs/question-reviews.md)
// openReview = start on the Review tab (the question was opened from the reviews page with ?tab=review)
export default function Feedback({details, reviewTitle, openReview = false}) {
    const [activeTab, setActiveTab] = useState(openReview ? 'Review' : 'instructions');
    const toggle= (tab) => {
        if (activeTab !== tab) setActiveTab(tab)
    }
    const {instructions, solution, markScheme} = details ?? {
        'instructions': [{'type':'paragraph', 'content':'test'}], 
        'solution': [{'type':'paragraph', 'content':'test'}], 
        'markScheme': [{'type':'paragraph', 'content':'test'}]
    }

    const updatedFeedback = useQuestionStore((state)=> state.userProgress?.feedback)
    const previousFeedback = useRef(updatedFeedback)

    

    
    // now i need to create a listener perhaps with useEffect that toggles to the feedback page, whenever the feedback 
    //array gets updated 
    //also you need to work on properly displaying the feedback 

    useEffect(()=> {
       //Whenever the updated feedback gets changed (but not on first load, so the page opens on Instructions)
       if (previousFeedback.current === updatedFeedback) return
       previousFeedback.current = updatedFeedback
       toggle('feedback')

    },[updatedFeedback])
    return (

        
        <div style={{height:'100%', display:'flex', flexDirection:'column'}}>
            <Nav tabs>
                 <NavItem>
                    <NavLink
                    className={classnames({active: activeTab === 'instructions'})}
                    onClick ={()=> toggle('instructions')}
                    style={{cursor:'pointer'}}
                    >
                    Instructions
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                    className={classnames({active: activeTab === 'feedback'})}
                    onClick ={()=> toggle('feedback')}
                    style={{cursor:'pointer'}}
                    >
                    Feedback
                    </NavLink>
                </NavItem>
                 <NavItem>
                    <NavLink
                    className={classnames({active: activeTab === 'solution-explanation'})}
                    onClick ={()=> toggle('solution-explanation')}
                    style={{cursor:'pointer'}}
                    >
                    Model Solution & Explanation
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                    className={classnames({active: activeTab === 'notes'})}
                    onClick={()=> toggle('notes')}
                    style={{cursor:'pointer'}}
                    >
                        Notes
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                    className={classnames({active: activeTab === 'comments'})}
                    onClick={()=> toggle('comments')}
                    style={{cursor: 'pointer'}}
                    >
                        Comments
                    </NavLink>
                </NavItem>
                 <NavItem>
                    <NavLink
                    className={classnames({active: activeTab === 'Review'})}
                    onClick={()=> toggle('Review')}
                    style={{cursor: 'pointer'}}
                    >
                        <ReviewTabLabel title={reviewTitle} />
                    </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={activeTab} style={{padding:'1rem', flex:1}}>
                <TabPane tabId="feedback">
                    <QuestionFeedbackPane />

                </TabPane>
                <TabPane tabId='instructions'>
                    < QuestionInstructionPane instructions={instructions}/>
                </TabPane>
                <TabPane tabId='solution-explanation'>
                    <QuestionSolutionPane solution={solution} markScheme ={markScheme}/>

                </TabPane>
                 <TabPane tabId='notes'>
                    <QuestionNotesPane />

                </TabPane>
                <TabPane tabId='Review'>
                    {reviewTitle
                        ? <ReviewPane title={reviewTitle} />
                        : <p style={{padding: '1rem'}}>Review cards aren&apos;t available for this question.</p>}
                </TabPane>

            </TabContent>
            
        </div>
    );
}

