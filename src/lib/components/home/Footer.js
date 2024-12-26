import React from 'react'
import "bootstrap-icons/font/bootstrap-icons.css";

const Footer = () => {
  return (
    <div className='footer' style={{position:"absolute"}}>
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '5%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start' }}>
        <h1 style={{color:'white' ,fontWeight:'bold',marginBottom:'5%',  fontSize:'60px'}}>
        RootMath
        </h1>
        </div>

        <div style={{position:'absolute', left:'5%', top:20, width:'30%', height:'40%', display:'flex', flexDirection:'Column',gap:'10px',}}>
         
          <h4 style={{fontWeight:"bold", color:'white'}}>Courses</h4>
            <h6 style={{fontWeight:'bold', color:'white'}}>Math A Level</h6>
            <h6 style={{fontWeight:'bold', color:'white'}}>Further Math A Level</h6>
            <h6 style={{fontWeight:'bold', color:'white'}}>GCSE Maths</h6>
            <h6 style={{fontWeight:'bold', color:'white'}}>Pricing</h6>
          

        </div>

        <div style={{position:'absolute', right:'60%', top:20, width:'20%', height:'40%', display:'flex', flexDirection:'Column', gap:'10px'}}>
       
          
          <h6 style={{fontWeight:'bold', color:'white', marginTop:'2.5%'}}>Blog</h6>
          <h6 style={{fontWeight:'bold', color:'white'}}>Annoucements</h6>
          <h6 style={{fontWeight:'bold', color:'white'}}>Careers</h6>
          <h6 style={{fontWeight:'bold', color:'white'}}>Contact</h6>

          
          
          
        </div>






        <div style={{position:'absolute', right:'3%', top:20,  width:'25%', height:'40%', display:'flex', flexDirection:'Column'}}>
          <div>
          <h4 style={{fontWeight:"bold", color:'white'}}>Socials</h4>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            
          <i className="bi bi-instagram" style={{fontSize:'1.5rem', color:'white' }}></i>
          <i className="bi bi-facebook" style={{fontSize:'1.5rem', color:'white'}}></i>
          <i className="bi bi-twitter" style={{fontSize:'1.5rem', color:'white'}}></i>   
          <i className="bi bi-tiktok" style={{fontSize:'1.5rem', color:'white'}}></i>  
          <i className="bi bi-youtube" style={{fontSize:'1.5rem', color:'white'}}></i>
            
          </div>       
            </div>
          </div>

          <div style={{position: 'absolute',
        bottom: 0,
        right: '3%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start', 
        marginBottom:'2.5%', 
  
         
        fontSize:'13px'
         }}>
            <span style={{color:'white'}}>copyright © Root Math limited 2023. Registered company in England and Wales (number: 10010657). VAT Reg. No GB 249 7670 58.</span>
            </div>
          

          



    </div>
  )
}

export default Footer