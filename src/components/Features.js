import React from 'react';
import { Badge } from 'reactstrap';



const Features = () => {
  
  


  return (
    <>
    <div className ='features'>
      <h1> <Badge color='info'>RootMath makes A level Maths simple</Badge></h1>
      <p>RootMath help's students undergo, the transformation, from being intimidated by A level Maths, to achieving the highest grades.
         Through the use of AI, we are able to identify, create, suggest and customize content tailored to improving each individual students weaknesses.
         RootMath also offers instant feedback on handwritten responses, emulating the marking and feedback of real examiners.   </p>
     
     <img src={require('../styles/images/featuresDevice.png')} style={{marginTop:'-20px'}}/>
    
    </div>

    </>
  )
   
}
export default Features