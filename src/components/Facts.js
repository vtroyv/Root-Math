import React from 'react'

import {
    Card,
    CardBody,
  
    Button, 
    CardSubtitle, 
    CardText, 
    CardTitle,
    Row,
    Col,

} from 'reactstrap'

const Facts = () => {

  


  return (
    <div className="facts" >
      <Row>
        <Col md='4'>
       
       <Card color="info" outline className="facts-card h-95">
    
    <CardBody>
      <CardTitle tag="h4" style={{textAlign: 'center' ,fontWeight:'bold'}}>
        Syllabus Specific
      </CardTitle>
      <CardSubtitle
        className="mb-2 text-muted"
        tag="h6"
       
      >
        <span style={{ fontWeight:'bold' }}>All Major Exam Boards</span>
      </CardSubtitle>
      <CardText>
       RootMath has been built to cater for all students studying maths A level in the UK, despite different exam boards. <br/>
      Each video, question and exam paper has been specifically handpicked & tailored to ensure each student recieves preperation for every topic on their specification.
      </CardText>

      <Button size="md" color="info" outline className=" ">Learn more</Button>
        

     
     
    </CardBody>
  </Card>
  </Col>
  <Col md='4'>
  <Card color="info" outline className="facts-card h-95">
    
    <CardBody>
      <CardTitle tag="h4" style={{textAlign: 'center', fontWeight:'bold' }} >
        Instant Marking
      </CardTitle>
      <CardSubtitle
        className="mb-2 text-muted"
        tag="h6"
      >
       <span style={{fontWeight:'bold'}}>AI vs Tutors</span>
      </CardSubtitle>
      <CardText>
        Here at RootMath we've tapped into the power of AI, to enable students to experience the benefits of one-on-one tution minus the time and cost.
        <br/>


        <ul>
            <li>
                Real time marking & Feedback
                
            </li>
            <li>
            Personally customized study plans
            </li>
            <li>
              Real time support on questions
            </li>
           
            
        </ul>
       
      </CardText>
      <Button size="md" color="info" outline className=" ">Learn more</Button>

     
    </CardBody>
  </Card>
  </Col>
  <Col md='4'> 
  <Card color="info" outline className="facts-card h-95">
    
    <CardBody>
      <CardTitle tag="h4" style={{textAlign: 'center', fontWeight:'bold'}}>
        Content Packed
      </CardTitle>
      <CardSubtitle
        className="mb-2 text-muted"
        tag="h6"
      >
        <span style={{fontWeight:'bold'}}>Everything you need in one place</span>
      </CardSubtitle>
      <CardText>
        This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
      </CardText>
     
    </CardBody>
  </Card>
  </Col>
  </Row>
 

 

    </div>
  )
}

export default Facts