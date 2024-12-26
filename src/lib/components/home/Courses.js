import React from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";
import {Table, Card,CardBody, CardTitle, CardText, CardSubtitle, Row, Col  } from'reactstrap';
import Link from 'next/link';
import Image from 'next/image';
import LessonImage from '../../images/lesson2.png'



const Courses = () => {
  return (
    <div className="courses-container">
        
        <h1 style={{fontWeight:'bold', color:'#17a2b8'}}>Our Courses</h1>
        <h4>RootMath provides content fully covers the specification for the following exam boards: Edexcel, AQA, CIE and OCR</h4>
        <h5 style={{fontWeight:'bold'}} > Is your course not covered?  Dont worry get in touch <Link href='/contact' style={{color:'#17a2b8'}}>here</Link> and well let you know which course matches your curriculum the best</h5>

        <div className='courses-table-container'>
        <Table
        striped
  responsive
  hover={true}
  
>
  <thead>
    <tr>
      <th>
       <h5 style={{fontWeight:'bold', color:'#17a2b8'}}>Exam Board</h5>
      </th>
      <th>
      <h5 style={{fontWeight:'bold', color:'#17a2b8'}}>A Level Maths</h5>
      </th>
      <th>
      <h5 style={{fontWeight:'bold', color:'#17a2b8'}}>A Level Further Maths</h5>
      </th>
      <th>
      <h5 style={{fontWeight:'bold', color:'#17a2b8'}}>GCSE</h5>
      </th>
      
    </tr>
  </thead>
  <tbody>
    <tr >
      <th scope="row">
        Edexcel
      </th>
      <td>
      <i className="bi bi-check-lg" style={{fontSize:'1.2rem'}}></i>
      
      </td>
      <td>
        Coming Soon
        
      </td>
      <td>
        Coming Soon
      </td>
    </tr>
    <tr >
      <th scope="row" >
        AQA
      </th>
      <td>
      <i className="bi bi-check-lg" style={{fontSize:'1.2rem'}}></i>
      </td>
      <td>
       Coming Soon
      </td>
      <td>
        Coming Soon
      </td>
    </tr>
    <tr>
      <th scope="row">
        OCR
      </th>
      <td>
      <i className="bi bi-check-lg" style={{fontSize:'1.2rem'}}></i>
      </td>
      <td>
        Coming Soon
      </td>
      <td>
        Coming Soon
      </td>
    </tr>
    <tr>
        <th scope="row">
            CIE
        </th>
        <td>
             <i className="bi bi-check-lg" style={{fontSize:'1.2rem'}}></i>
        </td>
        <td>
            Coming Soon
        </td>
        <td>
            Coming Soon
        </td>

    </tr>
  </tbody>
</Table>
<div style={{marginTop:'2%', marginBottom:'1.5%'}}>
<h3 style={{fontWeight:'bold', color:'#17a2b8'}}>Each of our Courses comes filled with the following:</h3>
</div>
        </div>

    <div className='course-contents'>
        <Row>
            <Col>
    <Card
    outline
   
  style={{
    width: '18rem',
    minHeight:'24rem', 
    maxHeight:'24rem'
  }}
>
  <CardBody>
    <CardTitle tag="h5">
      <span style={{fontWeight:'bold', }}>Quizzes</span>
    </CardTitle>
    <CardSubtitle
      className="mb-2 text-muted"
      tag="h6"
    >
      <span style={{fontWeight:'bold', }}>Hundreds of questions</span>
    </CardSubtitle>
  </CardBody>
  <Image
    alt="Card cap"
    src={LessonImage}
    width="100"
  />
  <CardBody>
    <CardText>
     Countless questions ranging from basic to exam level and beyond, covering the entire curriculum
    </CardText>
  

  </CardBody>
</Card>
</Col>
<Col>

<Card
  style={{
    width: '18rem',
   minHeight:'24rem',
   maxHeight:'24rem'
  }}
>
  <CardBody>
    <CardTitle tag="h5">
    <span style={{fontWeight:'bold', }}>Lessons</span>
    </CardTitle>
    <CardSubtitle
      className="mb-2 text-muted"
      tag="h6"
    >
        <span style={{fontWeight:'bold', }}>Engaging & detailed yet consise</span>
    </CardSubtitle>
  </CardBody>
  <Image
    alt="Card cap"
    src={LessonImage}
    width="100"
  />
  <CardBody>
    <CardText>
    Each course has stimulating videos explaining concepts for easy student retention.
    </CardText>
  

  </CardBody>
</Card>
</Col>
<Col>
<Card
  style={{
    width: '18rem',
    minHeight:'24rem',
    maxHeight:'24rem'
  }}
>
  <CardBody>
    <CardTitle tag="h5">
    <span style={{fontWeight:'bold', }}>Exam Papers</span>
    </CardTitle>
    <CardSubtitle
      className="mb-2 text-muted"
      tag="h6"
    >
         <span style={{fontWeight:'bold', }}>Just like the real thing </span>
      
    </CardSubtitle>
  </CardBody>
  <Image
    alt="Card cap"
    src={LessonImage}
    width="100"
  />
  <CardBody>
    <CardText>
      Build confidence your completing our exam papers and recieve instant feedback
      </CardText>
  

  </CardBody>
</Card>


</Col>
<Col>
<Card
responsive
  style={{
    width: '18rem',
    minHeight:'24rem',
    maxHeight:'24rem'
  }}
>
  <CardBody>
    <CardTitle tag="h5">
    <span style={{fontWeight:'bold', }}>Designated Tutor</span>
    </CardTitle>
    <CardSubtitle
      className="mb-2 text-muted"
      tag="h6"
    >
      <span style={{fontWeight:'bold', }}>Experience the power of AI </span>
    </CardSubtitle>
  </CardBody>
  <Image
    alt="Card cap"
    src={LessonImage}
    width="100"
  />
  <CardBody>
    <CardText>
       Ask questions, have your weaknesses analysed and recieve instant feedback on your work
    </CardText>
  

  </CardBody>
</Card>
</Col>
</Row>

    </div>
        

        
    </div>
  )
}

export default Courses