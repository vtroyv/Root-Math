'use client';
import { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';
import ComputeEngineConfig from '@/lib/utils/ceConfig';
import preprocessLatex from '@/lib/utils/preprocess-latex';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import {
  useGradeQuestionMutation,
  useGetQuestionsQuery
} from '@/lib/redux/slices/apiSlice';
import { useParams } from 'next/navigation';
import {
  Row,
  Button,
  Col,
  Card,
  CardSubtitle,
  ListGroup,
  ListGroupItem,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import classnames from 'classnames';

import FeedbackDisplay from './FeedbackDisplay';



export default function FullResponse({ question }) {
  const questionRef = useRef(null);
  const mathfieldRef = useRef(null);
  const mfe = useRef(new MathfieldElement());
  const questionView = useRef(new MathfieldElement());
  const ceRef = useRef(null);
  const { data, isLoading, isSuccess } = useGetQuestionsQuery();
  const params = useParams();

  const [gradeQuestion, mutationState] = useGradeQuestionMutation();

  // Keep track of the active tab on the right (Instructions vs. Feedback)
  const [activeTab, setActiveTab] = useState('instructions');
  // Store any returned feedback from the API
  const [feedback, setFeedback] = useState('');

  console.log('The question is ', question)

  // Toggle between the two tabs
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const title = question?.title;

  useEffect(() => {
    if (!question) return;

    // Display question LaTeX in a read-only Mathfield
    questionView.current.value = String.raw`${question.latex}`;
    questionView.current.readOnly = true;
    questionRef.current.style.margin = '1%';
    questionRef.current.style.fontWeight = 'bold';
    questionRef.current.style.fontSize = '20px';

    if (!questionRef.current.contains(questionView.current)) {
      questionRef.current.appendChild(questionView.current);
    }

    // Set up the user input Mathfield for responses
    mfe.current.mathModeSpace = '\\,';
    mfe.current.virtualKeyboardMode = 'manual';
    mfe.current.style.display = 'block';
    mfe.current.style.width = '700px';
    /*
    // mfe.current.executeCommand('applyStyle', {color:'red'})
    /This is where we will highlight errors, in red, do note however that this changes the underlying latex and therefore must be accounted for in preprocessing latex function or our compile script
    
    */
    
    

    if (mathfieldRef.current && !mathfieldRef.current.contains(mfe.current)) {
      mathfieldRef.current.appendChild(mfe.current);
    }

    // Example of capturing Enter key presses (insertLineBreak).
    mfe.current.addEventListener('input', function (event) {
      if (event.inputType === 'insertLineBreak') {
        mfe.current.executeCommand('addRowAfter');
        event.preventDefault();
      }
    });
  }, [question]);

  // Set up the Compute Engine
  useEffect(() => {
    if (question) {
      const ceConfig = new ComputeEngineConfig(question?.questionType);
      const ce = ceConfig.getEngine();
      if (ceRef.current) {
        ceRef.current.ce = ce;
      } else {
        ceRef.current = { ce };
      }
    }
  }, [question]);

  const handleSubmit = async () => {
    try {
      const latex = mfe.current.value;
      // Preprocess the LaTeX
      const preprocessedArray = preprocessLatex(latex);

      console.log('The preprocessed latex is given by ', preprocessedArray)
      // Parse the latex into boxed expressions
      const boxedExpressionArray = preprocessedArray.map((item) =>
        ceRef.current.ce.parse(item)
      );

      console.log('The boxedExpression Array is given by ',boxedExpressionArray )

      // Compile expressions to Sympy
      const compiled = boxedExpressionArray.map((bE) => bE.compile('sympy'));
      const compiledStrings = compiled.map((fn) => fn.toString());

      console.log('The compiled strings are ', compiledStrings)

      // Build data for the server
      const dataForFeedback = {
        questionData: question,
        sympyResponse: compiledStrings
      };

      const resp = await gradeQuestion(dataForFeedback).unwrap();
      // For convenience, store just the feedback text in state
      setFeedback(resp?.data?.feedback || '');
      // Auto-switch to 'feedback' tab so the user sees it immediately
      toggleTab('feedback');
    } catch (error) {
      console.log('Error when trying to access the route handler:', error);
    }
  };

  // If no question loaded yet, just show a spinner or fallback
  if (!question) {
    return <h2>Loading question...</h2>;
  }

  return (
    <div className="quiz-display">
      <Row className="quiz-display-row">
        {/* LEFT COLUMN: Title, question, and response textbox */}
        <Col>
          <div>
            <h1>
              {title?.includes('-')
                ? title
                    .split('-')
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(' ')
                : title}
            </h1>
          </div>

          <div className="question" ref={questionRef}></div>
          <div ref={mathfieldRef}></div>

          <br />
          <div>
            <Button block color="info" outline onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Col>

        {/* RIGHT COLUMN: TABS for Instructions / Feedback */}
        <Col className="QR-instructions">
          {/* Nav for tab switching */}
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'instructions' })}
                onClick={() => toggleTab('instructions')}
              >
                Instructions
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'feedback' })}
                onClick={() => toggleTab('feedback')}
              >
                Feedback
              </NavLink>
            </NavItem>
          </Nav>

          {/* TabContent holds the two TabPanes */}
          <TabContent activeTab={activeTab} style={{ marginTop: '1rem' }}>
            {/* Instructions Tab */}
            <TabPane tabId="instructions">
              <Card style={{ borderRadius: '20px', margin: '2%' }}>
                <CardSubtitle>
                  <h5 style={{ fontWeight: 'bold', margin: '1rem' }}>
                    Instructions
                  </h5>
                </CardSubtitle>
                <CardBody
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignContent: 'flex-start'
                  }}
                >
                  <ListGroup>
                    <ListGroupItem color="info" style={{ borderRadius: '0px' }}>
                      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        1) Answer the question in the textbox to the left, just
                        like you would in an exam
                      </h6>
                      <br />

                      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        2) Once you&#39;re finished and happy with your work
                        click submit
                      </h6>
                      <br />

                      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        3) Shortly after you submit your work, you&#39;ll receive
                        feedback
                      </h6>
                      <br />

                      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        4) Use this feedback to correct any mistakes you may
                        have made
                      </h6>
                      <br />

                      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        5) And make sure to ask your personal tutor bot any
                        questions you may have
                      </h6>
                      <br />

                      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        6) Once you&#39;re happy, click &apos;next&apos; to move
                        on to the next question
                      </h6>
                    </ListGroupItem>
                  </ListGroup>
                </CardBody>
              </Card>
            </TabPane>

            {/* Feedback Tab */}
            <TabPane tabId="feedback">
              <Card style={{ borderRadius: '20px', margin: '2%' }}>
                <CardBody>
                  <h4 style={{ fontWeight: 'bold', color: '#17a2b8' }}>
                    Feedback
                  </h4>
                  {typeof feedback === 'object' ? (
  <FeedbackDisplay feedback={feedback} />
) : feedback ? (
  <p>{feedback}</p>  // if feedback might sometimes be a plain string
) : (
  <p>No feedback to display yet. Submit your work!</p>
)}

                </CardBody>
              </Card>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </div>
  );
}
