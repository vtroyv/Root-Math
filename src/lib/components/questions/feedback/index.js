'use client'
import React, {useState} from 'react'; 
import {Nav, NavItem, NavLink,TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import QuestionFeedbackPane from './questionFeedbackPane';
import QuestionInstructionPane from './questionInstructionPane';

export default function Feedback() {
    const [activeTab, setActiveTab] = useState('instructions');
    const toggle= (tab) => {
        if (activeTab !== tab) setActiveTab(tab)
    }

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
            </Nav>

            <TabContent activeTab={activeTab} style={{padding:'1rem', flex:1}}>
                <TabPane tabId="feedback">
                    <QuestionFeedbackPane />

                </TabPane>
                <TabPane tabId='instructions'>
                    < QuestionInstructionPane />
                </TabPane>

            </TabContent>
            
        </div>
    );
}

