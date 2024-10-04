import React, {useEffect} from 'react'
import { Form, FormGroup, Label,Input , Card, CardBody, CardTitle, Button} from 'reactstrap'
import Footer from './Footer';
import 'animate.css';


const Contact = () => {

  // MAKE SURE TO CHECK OUT ANIMATE ON SCROLL AND SEE IF YOU EVEN NEED LOADWOW/WOW WHEN REBUILDING

  const loadwow = async()=>{
    const WOW = await import('wowjs');
    new WOW.WOW({live: false}).init();
  }

  useEffect(()=>{
   
    loadwow();
   
  })


  return (
   <>
   <div className='contact-banner' >
    <h1 style={{fontWeight:'bold', color:'white'}}>Contact Page</h1>
    {/* try add some math icons in white from bootstrap icons or something  */}
   </div>
   <div className='contact-container'>
   <div className='contact-middle'>
    <div style={{display:'flex', flexDirection:'column', }}>
    <h1 style={{fontWeight:'bold'}}>Contact Us</h1>
    <h3 style={{fontWeight:'bold'}}>We would love to hear from you!</h3>
    </div>
 
   </div>

   <div className='contact-middle' style={{maxHeight:'10px'}}>

   </div>

   < Card   Card color='info' className='contact-form animate__animated animate__fadeInUp' outline style={{padding:'2%', position:'absolute', borderRadius:'25px', left:'65%', top:'1%',marginTop:'-3%', minWidth:'350px', maxHeight:'750px'}}  data-wow-delay='.3s'> 
    <CardTitle>
      <h1 style={{fontWeight:'bolder', color:'info'}}>Send us a Message</h1>

    </CardTitle>
      <CardBody>
    <Form style={{display:'flex', flexDirection:'column', gap:'20px'}}>
      <FormGroup>
        <Label for='full-name' style={{display:'flex', justifyContent:'flex-start'}}>
          Name
        </Label>
        <Input placeholder="Enter Full Name" type='text' name='full-name' id='full-name' />
        </FormGroup>
        <FormGroup>
        <Label for='email-address' style={{display:'flex', justifyContent:'flex-start'}}>
          Email
        </Label>
        <Input placeholder="Enter Email Address" type='email' name='email' id='email-address' />
        </FormGroup>

        <FormGroup>
        <Label for='phone-number' style={{display:'flex', justifyContent:'flex-start'}}>
          Phone
        </Label>
        <Input placeholder="Enter Phone Number" type='text' name='phone-number' id='phone-number' />
        </FormGroup>

        <FormGroup>
        <Label for='message' style={{display:'flex', justifyContent:'flex-start'}}>
          Message
        </Label>
        <Input placeholder="Leave Your Message" type='textarea' name='message' id='message' style={{maxWidth:'100%', maxHeight:"150px"}}/>
        </FormGroup>

        <Button color='info' >
          Send Message

        </Button>

      
    </Form>
    </CardBody>
    </Card>
    </div>
   
   <Footer />
   

   
  
   </>
  )
}

export default Contact
