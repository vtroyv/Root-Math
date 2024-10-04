import React from 'react'
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom'

const EdxMath1Videos = () => {
    const {video} = useParams()
    const vidTitle = video.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    //make sure to use the .join() method
  return (
   
    <div className='subsection-container'>
        <div style={{padding:'0.5%'}}>
         <h1>{vidTitle}</h1>
         </div>
        <div className='videoplayer'>
           
       <ReactPlayer url='https://takamotoyagami.wistia.com/medias/2ci7172egn' controls={true}  />
       </div>
    </div>
  )
}

export default EdxMath1Videos