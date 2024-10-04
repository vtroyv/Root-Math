import React, {useState, useEffect} from 'react';
import {
    Form, Input, Label, Button, Badge
} from 'reactstrap';

import {UserAuth} from '../firebase/fbMethodContext'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { getUser } from '../redux/usersSlice';


const Login = () => {
    const [useremail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState('');

    const {signIn} = UserAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.auth.loggedIn)
    useEffect(()=>{
      if(loggedIn) {
        navigate('/learn')
      }

    })



    const handleSubmit = async (event) =>{
      event.preventDefault();
      //you should probably recode this getUser action to be a createAsyncThunk, so that we can update the UI when the action is still pending 
      try{
       const userCred = await signIn(useremail, userPassword);
       const uid = userCred.user.uid;
       console.log(`${uid} at point A on client `);
      //  console.log(`${uid} and ${useremail}`)

      //  const response = await axios.get(`//localhost:4000/api/user/${uid}`);
      const response = await axios.get(`//localhost:4000/api/user/${uid}`);


    const user = response.data; 
    console.log(user);

       dispatch(getUser({
        firstName: user.firstName, 
        surname: user.surname, 
        email: user.email, 
        year: user.year, 
        examBoard: user.examBoard, 
        uid: user.uid, 
        onTrial: user.onTrial, 
        isSubscribed: user.isSubscribed
       }))
       
       
       dispatch(login());


        navigate('/learn');
        
        //gonna try send to backend 
       

      } catch(err){
        setError(err.message);
        console.log(error)

      }

      
    }

  return (
    <>
    <h1>Welcome to <Badge color="info">Root Math</Badge> </h1>
    <br/>
    <br />
    <h3>Don't have an account? <Link className="router-link" to="/signup" >Sign Up</Link></h3>
    <br />
    
    <Form onSubmit={handleSubmit} >
        <Label for="userEmail">
            Email
        </Label>
        <Input type="email"  name="userEmail" value={useremail} placeholder="Enter Email" onChange={(event)=> setUserEmail(event.target.value) } />
        <br />
        <Label for="userPassword">
            Password
        </Label>
        <Input type="password" name="userEmail" value={userPassword} placeholder="Create Password" onChange={(event)=> setUserPassword(event.target.value)}/>
        <Button
    active
    block
    color="info"
    size="lg"
    style={{marginTop: '2rem'}}
  >
    Login
  </Button>
        

    </Form>
    
    </>
  
  )
}

export default Login