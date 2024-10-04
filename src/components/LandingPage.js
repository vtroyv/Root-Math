import React,{useState, useEffect} from 'react';
import {Button, Badge, Modal} from 'reactstrap';
import {Link} from 'react-router-dom';
import ReactPlayer from 'react-player';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.json'

import Facts from './Facts';
import LandingFeatures from './LandingFeatures';
import Courses from './Courses';
import Faq from './Faq';
import Footer from './Footer';



const LandingPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const toggle = () => setModalOpen(!modalOpen);
  const loadwow = async()=>{
    const WOW = await import('wowjs');
    new WOW.WOW({live: false}).init();
  }

  useEffect(()=>{
    loadwow();

  })
    
  
  return (
   <>

 
       {/* start of hero section */}
    <div className="hero-container animate__animated animate__fadeInUp" data-wow-delay=".3s">

      <Modal isOpen={modalOpen} toggle={toggle} size='md' style={{minWidth:'643px'}}>
       
           
           <ReactPlayer url='https://takamotoyagami.wistia.com/medias/2ci7172egn' controls={true} playing={true}/>
         

      </Modal>

   
   
    <div className="hero-text">
        
      <h1><Badge color="info" style={{marginBottom: '2rem'}}>Achieve The Highest Grades Today</Badge></h1>
      

      <h5 style={{fontWeight:'bold',}}>
        No more mass purchasing textbooks <br/> <br />
        No more spending hundred's on tutors <br/> <br />
        No more searching all over the internet <br /> <br />
       </h5>
       <h6 style={{fontWeight:'bold', color:'#17a2b8'}}>Root Math has everything you need to get the highest grades in Maths A level</h6> <br />
       <h4>Start Learning today!</h4>
       <br/>
  
    <Link to='/signup  '><Button color="info" >Register Interest</Button></Link>
    
      </div>
      
      <div 	className=" hero-image d-none d-lg-block"> 
      <button className='image-button' onClick={toggle}>
     <img src={require('../styles/images/1.png')} style={{minWidth:'113%',maxWidth:'115%', Minheight:'90%'}} alt="Introduction Video"/>
     </button>
     
      </div> 
    
      </div> 
      
      {/* end of heo section  */}

      {/* start of facts section */}
      <div className="facts animate__animated animate__fadeInUp" data-wow-delay=".3s">
        <Facts />
      </div>
      {/* end of facts section */}

      {/* start of landing features section */}
      
      
      <LandingFeatures />
    
     
      {/* end of landing features section */}

      {/* start of course section */}
      
      <Courses  />
    
    
      {/* end of course section */}
      {/* start of faq section */}
      <Faq />

      {/* end of faq section */}

      {/* start of footer section */}
     <Footer />

      {/* end of footer section */}

      

      


      </>
  )
}

export default LandingPage