 import React,{useState} from 'react'
 import axios from 'axios';
 import { useParams } from 'react-router-dom';
 
 
 const Upload = () => {
  const [file, setFile] = useState();
  const [caption, setCaption] = useState("");

  const {uid, quizTitle} = useParams();

  

  const imageKey = `${uid}${quizTitle}`;


  
  
  const submit = async event => {
    event.preventDefault()

    const formData = new FormData();
    formData.append("image", file) // this means on the server we do upload.single('image') as it must match the name of the uploaded image. 
    formData.append("imageKey", imageKey)
    await axios.post('http://192.168.68.107:4000/api/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});


  }

  return (
     <>
     <form onSubmit={submit}>
      <input onChange ={e => setFile(e.target.files[0])} type="file" accept="image/*"/>
      <input value={caption} onChange={e => setCaption(e.target.value)} type="text" placeholder='caption'/>
      <button type="submit"> Submit</button>

     </form>
     </>
   )
 }
 
 export default Upload