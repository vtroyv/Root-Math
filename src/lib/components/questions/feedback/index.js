'use client'
import React, {useState, useEffect} from 'react'; 
import {Nav, NavItem, NavLink,TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import QuestionFeedbackPane from './questionFeedbackPane';
import QuestionInstructionPane from './questionInstructionPane';
import QuestionSolutionPane from './questionSolutionPane';
import QuestionNotesPane from './questionNotesPane';
import { useQuestionStore } from '@/lib/zustand/providers/question-state-provider';

export default function Feedback({details}) {
    const [activeTab, setActiveTab] = useState('instructions');
    const toggle= (tab) => {
        if (activeTab !== tab) setActiveTab(tab)
    }
    const {instructions, solution, markScheme} = details ?? {
        'instructions': [{'type':'paragraph', 'content':'test'}], 
        'solution': [{'type':'paragraph', 'content':'test'}], 
        'markScheme': [{'type':'paragraph', 'content':'test'}]
    }

    const updatedFeedback = useQuestionStore((state)=> state.userProgress.feedback)
    console.log('THe updated Feedback is ', updatedFeedback)

    

    
    // now i need to create a listener perhaps with useEffect that toggles to the feedback page, whenever the feedback 
    //array gets updated 
    //also you need to work on properly displaying the feedback 

    useEffect(()=> {
       //Whenever the updated feedback gets changed  
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
                        Review
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

            </TabContent>
            
        </div>
    );
}

