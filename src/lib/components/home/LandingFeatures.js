import React from 'react'
import { Row, Col } from 'reactstrap'
import Image from 'next/image'
import RootMath from '../../images/RootMath4.png'

const LandingFeatures = () => {
  return (
    <>
    
    <div className='landing-features'>
        
        <div style={{color:'white', textAlign:'center', padding:'2%'}}>
       <h1 style={{fontWeight:'bold', marginTop:'20px'}}>Why RootMath?</h1> 
       <h4 style={{fontWeight:'bold'}}>Having been designed by those who know what its like to struggle with Maths</h4>
       <h4 style={{fontWeight:'bold'}}>Our second to none teaching style combined with our integration with AI </h4>
       <h4 style={{fontWeight:'bold'}}> Enabled us to create a platform that is flexible and adapts to meet each students specific needs!</h4>
       </div>

       <div style={{display:'flex', justifyContent:'center', marginTop:'-5rem'}}>
       <Image src={RootMath} alt="Why Root Math"/>
       </div>


       <Row style={{marginLeft:'5%', marginRight:'5%', marginTop:'-8%', paddingBottom:'2%'}}> 
       <Col>
        <div className='thought' style={{display:'flex', flexDirection:'column' }}>

            <h4>Engaging Content</h4>
            <span>Each video touches on themes reveleant to the students, in a fun and comedic manner</span>
            <h6 style={{fontWeight:'bold'}}>This makes content much easier to digest and remember</h6>
        </div>
       </Col>
       <Col>
        <div className='thought' style={{display:'flex', flexDirection:'column' }}>

            <h4>All-in-One!</h4>
            <span>RootMath is all you need to achieve the top grades</span>
            <span>No more textbooks or money on overprived tutors</span>
            <h6 style={{fontWeight:'bold'}}>RootMaths got you covered!</h6>
        </div>
       </Col>
       <Col>
        <div className='thought' style={{display:'flex', flexDirection:'column' }}>

            <h4>Accelerated Learning</h4>
            <span>RootMath breaks down the hardest topics into easy to understand chunks, in addition to, helpful hints from our AI powered assistant </span>
            <h6 style={{fontWeight:'bold'}}>RootMath helps students digest maths in a way unseen </h6>
        </div>
       </Col>




       </Row>

    

    </div>
    </>
  )
}

export default LandingFeatures