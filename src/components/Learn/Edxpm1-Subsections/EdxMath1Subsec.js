import React from 'react'
import {useParams, useLoaderData, useNavigate} from 'react-router-dom';
import { Card, CardBody, CardColumns, CardImg, CardText } from 'reactstrap';
import axios from 'axios';

export const EdxMath1SubsecLoader = async({params}) =>{
  const {data} = await axios.get(`//localhost:4000/api/subsections/edxpurey1/${params.subsection}`)
  console.log(`the data is ${JSON.stringify(data)}`)
  return data

}


const EdxMath1Subsec = () => {
  const navigate = useNavigate();
  const {subsection} = useParams();
  
  const title = subsection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const data = useLoaderData(); 

console.log(data)
console.log( ` Object values are this ${Object.values(data)}`);


const videos = Object.values(data).map(video => {
  const vidTitle= video.toLowerCase().split(' ').join('-')
  return (
    <div className='sub-subsection'  key={video}>
      <CardColumns className='sub-subsection-column' style={{width:'26em', height:'2em'}}>
        <Card className='sub-subsection-card' onClick={()=>navigate(vidTitle)}>
          <CardBody  style={{height:'3em', alignContent:'center', justifyContent:'center', marginBottom:'1%'}}>
            <CardText style={{display:'flex', justifyContent:'flex-start', alignContent:'center'}}>
              <h5>{video}</h5>

            </CardText>
          </CardBody>
        </Card>
      </CardColumns>

      <Card >
      <CardBody style={{height:'3.2em', display:'flex', alignContent:'center', justifyContent:'center'}}>
        <CardImg src={require('../../../styles/Icons/tick.png')}
        
        />

      </CardBody>
    </Card>

    </div>
  )
  
})


 
 
  
  return (
    <>
    <div className='subsection-container'>
      
      <h1>{title}</h1>
    
      {videos}
      
   

    
   
    </div>
 
    </>
  )
}

export default EdxMath1Subsec