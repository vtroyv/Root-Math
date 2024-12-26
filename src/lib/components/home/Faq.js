import React from 'react';
import {Row, Col, Button, UncontrolledCollapse, Card, CardBody} from 'reactstrap';
import Link from 'next/link';


const Faq = () => {
  return (

    <div className='faqs'>
        <h1 style={{paddingTop:'4%', textAlign:'center', fontWeight:'bold', color:'#17a2b8'}}>Got Questions? Answered</h1>
        <h4 style={{textAlign:'center', margin:'1rem', paddingBottom:"2%",  fontWeight:'bold'}}>Here are some of our most frequently asked questions, if any of your questions arent covered below, feel free to ask us directly <Link href='/contact' style={{color:'#17a2b8'}}>here</Link></h4>

        <div className='faq-questions'>
          <Row>

          <Col>
        <Button color='info' outline id='guarantee' style={{margin:'1rem', width:'20rem', height:'5rem'}} >
          <span style={{fontWeight:'bold',}}>How do we get our A/A* guarantee? </span>

        </Button>
        <UncontrolledCollapse toggler='#guarantee'>
          <Card style={{width:'20rem', height:'fit-content', margin:'1rem'}}> 
            <CardBody >
              RootMath uses machine learning and well-researched study techniques to assess each students current working level and then assign them daily & weekly targets,  in order to achieve an A or A*. 
              <br />
              We are so confident in our platforms capabilities that any student that fulfills their given targets and still fails to achieve an A/A* will recieve a full 100% refund!
              You can read more about it <Link style={{color:' #17a2b8'}} href ='/features'>here </Link>
            </CardBody>
          </Card>

        </UncontrolledCollapse>
        </Col>

        <Col>
        <Button color='info'  id='year-12'  outline style={{margin:'1rem', width:'20rem', height:'5rem'}} >
          <span style={{fontWeight:'bold' }}>Is it worth getting RootMath in year 12?</span>

        </Button>
        <UncontrolledCollapse toggler='#year-12'>
          <Card style={{width:'20rem', height:'fit-content', margin:'1rem'}}> 
            <CardBody >
              Absolutely, although you dont have real exams in year 12, its still the year where your performance is used to assign you the  predicted grades that you apply to university with. 
              <br />
              <br />
              Therefore its still very important to get good grades in year 12 which is ever so easy with the help of RootMath!


            </CardBody>
          </Card>

        </UncontrolledCollapse>

        </Col>

        <Col>
        <Button color='info'  id='help-me' outline style={{margin:'1rem', width:'20rem', maxWidth:'20rem', height:'5rem'}} >
          <span style={{fontWeight:'bold', }}>How do I know RootMath will actually help me? </span>

        </Button>
        <UncontrolledCollapse toggler='#help-me'>
          <Card style={{width:'20rem', height:'fit-content', margin:'1rem'}}> 
            <CardBody >
              Definitely! RootMath has been crafted in a way so that it caters to every students needs, regardless of their background or initial knowledge level.
              <br />
              <br />
              Having utilised an arsenal of world class study techinques weve created the perfect platform to help ALL students reach the highest grades. 
              If youd like to find out more about the learning techniques integrated into RootMath you can do so <Link style={{color:'#17a2b8'}} href="/"> here</Link>
            </CardBody>
          </Card>

        </UncontrolledCollapse>
        
        
        </Col>
        </Row>

        
        <Row>
          <Col>
          <Button color='info'  id='tutor' outline style={{margin:'1rem', width:'20rem', maxWidth:'20rem', height:'5rem'}} >
          <span style={{fontWeight:'bold',}}> How does the integrated tutor work?</span>

        </Button>
        <UncontrolledCollapse toggler='#tutor'>
          <Card style={{width:'20rem', height:'fit-content', margin:'1rem'}}> 
            <CardBody >
              RootMath provides students with an AI powered bot that you can ask any question youd ask a real life tutor.
              <br />
              Its purpose is to help bridge the gap between online learning platforms, like ourselves, and standard traditional tution. 
              <br/>
              Our aim is to have students reap all the benefits of traditional tution at a fraction of a cost, if your interested in learning more you can do so <Link style={{color:'#17a2b8'}} href ='/'>here </Link>
            </CardBody>
          </Card>

        </UncontrolledCollapse>
          
          </Col>

          <Col>
          <Button color='info'  id='videos' outline style={{margin:'1rem', width:'20rem', maxWidth:'20rem', height:'5rem'}} >
          <span style={{fontWeight:'bold', }}>What makes RootMaths lessons special? </span>

        </Button>
        <UncontrolledCollapse toggler='#videos'>
          <Card style={{width:'20rem', height:'fit-content', margin:'1rem'}}> 
            <CardBody >
            Our videos use scenarios relateable to our audiences lifestyle to create concrete examples. <br/>
            In addition to engaging animations to grasp students attention with gamification and other effective learning techniques, RootMath helps students transition from concrete examples to abstract thinking.
            <br/> Whats more is that our integrated quizzes and an AI-powered tutor, enable students to experience interactivity and accelerated learning through our lessons.
            </CardBody>
          </Card>

        </UncontrolledCollapse>
          </Col>

          <Col>
          <Button color='info'  id='content' outline style={{margin:'1rem', width:'20rem', maxWidth:'20rem', height:'5rem'}} >
          <span style={{fontWeight:'bold', }}>Does a course include both year 12 and year 13 content?</span>
        </Button>
        <UncontrolledCollapse toggler='#content'>
          <Card style={{width:'20rem', height:'fit-content', margin:'1rem'}}> 
            <CardBody >
              Yes! When you purchase a course on RootMath you choose how long you have access to it. <br />For example, a student starting year 12 can pay to have access until their exams at the end of year 13. Whereas a student in year 13 already, would pay to have access until the end of their exam season that year. <br/>
              No matter how long you decide to use RootMath, each course contains both the relevant year 12/13 materials to help you get the top grade. 
              To find out more visit our pricing page <Link style={{color:'#17a2b8'}} href='/'> here</Link>
            </CardBody>
          </Card>

        </UncontrolledCollapse>
          
          </Col>
        </Row>

          
   

        
        </div>

    
        
    </div>
    
    

  )
}

export default Faq