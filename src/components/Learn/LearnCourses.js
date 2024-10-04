import React from 'react'
import {Row, Col, Card, CardTitle, CardText, Button, CardBody} from 'reactstrap';
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';




const LearnCourses = () => {

let examBoard = useSelector(state => state.user.currentUser.examBoard); 
const firstName = useSelector(state => state.user.currentUser.firstName);


examBoard = examBoard.charAt(0).toUpperCase() + examBoard.slice(1);




  return (
  <div className='learn-courses'>
    <h1>Welcome Back {firstName}!</h1>
<Row>
  <Col sm='10'>
    <Card  body >
        <CardBody className='course-card-body' >
            <div>
      <CardTitle tag="h5">
        <h1 style={{color: '#17a2b8'}}>{examBoard} Mathematics</h1>
      </CardTitle>
      
      <CardText>
       <h3><strong>Pure Mathematics</strong> </h3> 
       <h5>Year 12</h5>
      </CardText>
      </div>

      <div style={{width: '7rem', height: '7rem'}}>
        <CircularProgressbar value={0} text={"0%"}/>
      </div>

      </CardBody>
      <Link className="router-link" to="edx-maths-1">
      <Button color="info" block >
       Continue
      </Button>
      </Link>
    </Card>
  </Col>
  
  </Row>
  <br/>

  <Row>
  <Col sm="10">
    <Card body>
    <CardBody className='course-card-body'>
            <div>
      <CardTitle tag="h5">
        <h1 style={{color: '#17a2b8'}}>{examBoard} Mathematics</h1>
      </CardTitle>
      
      <CardText>
       <h3><strong>Pure Mathematics</strong> </h3> 
       <h5>Year 13</h5>
      </CardText>
      </div>

      <div style={{width: '7rem', height: '7rem'}}>
        <CircularProgressbar value={0} text={"0%"}/>
      </div>

      </CardBody>
      <Button color="info">
        Continue
      </Button>
    </Card>
  </Col>
  
  </Row>
  <br />

  <Row >
  <Col sm="10">
    <Card body>
    <CardBody className='course-card-body'>
            <div>
      <CardTitle tag="h5">
        <h1 style={{color: '#17a2b8'}}>{examBoard} Mathematics</h1>
      </CardTitle>
      
      <CardText>
       <h3><strong>Statistics</strong> </h3> 
       <h5>Year 12 </h5>
      </CardText>
      </div>

      <div style={{width: '7rem', height: '7rem'}}>
        <CircularProgressbar value={0} text={"0%"}/>
      </div>

      </CardBody>
      <Button color="info">
       Continue
      </Button>
    </Card>
  </Col>
  
  </Row>
  <br /> 
  {/* your gonna have to replace all these <br /> tags with some css properties in the near future.  */}
  <Row >
  <Col sm="10">
    <Card body>
    <CardBody className='course-card-body'>
            <div>
      <CardTitle tag="h5">
        <h1 style={{color: '#17a2b8'}}>{examBoard} Mathematics</h1>
      </CardTitle>
      
      <CardText>
       <h3><strong>Mechanics</strong> </h3> 
       <h5>Year 12 & Year 13</h5>
      </CardText>
      </div>

      <div style={{width: '7rem', height: '7rem'}}>
        <CircularProgressbar value={0} text={"0%"}/>
      </div>

      </CardBody>
      <Button color="info">
       Continue
      </Button>
    </Card>
  </Col>
  
  </Row>
  <br />
  

    </div>
  )
}

export default LearnCourses