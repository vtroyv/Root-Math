'use client'
import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useUser } from '@clerk/nextjs';

export default function Progress() {
  const {user} = useUser();
  const {id, unsafeMetadata} = user; 



  // Now i should create a useEffect hook here to fetch this information on loading 
  // Example stats — customize these to match your data

  const totalQuestions = 3435;
  const completedTotal = 2;
  const percentage = Math.round((completedTotal / totalQuestions) * 100);

  // Per-difficulty stats
  const easyTotal = 853;
  const easyCompleted = 1;
  const mediumTotal = 1789;
  const mediumCompleted = 1;
  const examTotal = 500;
  const examCompleted = 0;
  const challengeTotal = 293;
  const challengeCompleted = 0;

  return (
    <div>
      <Card
        style={{
          marginTop: '1rem',
          marginBottom:'1rem', 
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // lighter shadow
        //   border: '1px solid black',
        border:'none',
          borderRadius: '0.5rem', // more rounded corners
        }}
      >
        <CardBody>
          <Row style={{ alignItems: 'center' }}>
            {/* Left column: heading + large progress circle */}
            <Col sm="6" style={{ textAlign: 'center' }}>
              <h4 style={{ fontWeight: 'bold', color: '#17a2b8' }}>Progress</h4>
              <div style={{ width: '150px', height: '150px', margin: '1rem auto' }}>
                <CircularProgressbar
                  value={percentage}
                  text={`${completedTotal}/${totalQuestions}`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: '#17a2b8',
                    textColor: '#17a2b8',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>
            </Col>

            {/* Right column: stats for each difficulty */}
            <Col sm="6">
              <p>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Easy</span>: {easyCompleted}/{easyTotal}
              </p>
              <p>
                <span style={{ color: 'orange', fontWeight: 'bold' }}>Medium</span>: {mediumCompleted}/{mediumTotal}
              </p>
              <p>
                <span style={{ color: 'red', fontWeight: 'bold' }}>Exam</span>: {examCompleted}/{examTotal}
              </p>
              <p>
                <span style={{ color: 'purple', fontWeight: 'bold' }}>Challenge</span>: {challengeCompleted}/{challengeTotal}
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
}
