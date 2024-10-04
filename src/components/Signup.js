import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Form,Label, Input, Button, Badge , Alert, Row, Col} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '../redux/authSlice';

import { UserAuth } from '../firebase/fbMethodContext';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';







//apart from some client side validation and server side validaiton this is complete. 
//next you need to be focusing on how to use onauthstatechanged but on the server side, for protected routes etc or


const Signup = () => {

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [examBoard, setExamBoard] = useState('');
    const [firstName, setFirstName]= useState('');
    const [surname, setSurname] = useState('');
    const [year, setYear] = useState();
    const [error, setError] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);

    const dispatch = useDispatch();
    
    const onDissmiss = () => setAlertVisible(false);
    const {signUp} = UserAuth();


  

    const navigate = useNavigate();

    const isLoading = useSelector(state => state.user.isLoading)
    

    useEffect(()=>{
      


    if(!isLoading){
      console.log(`isLoading is ${isLoading}`);

      dispatch(login());
      console.log('we have no dispatched');

      navigate('/learn');
      console.log('successfully navigated to learn page')
    }

    }, [dispatch, isLoading, navigate])




    const registerUser = createAsyncThunk('user/registerUser', async (userData)=>{
      const {email,password, user}= userData;
      const firebaseUser = await signUp(email,password);

      if(firebaseUser){
        user.uid = firebaseUser.user.uid;
        const {data} = await axios.post('//localhost:4000/api/user', {
          uid: user.uid, 
          email: user.email, 
          password: user.password, 
          firstName: user.firstName, 
          surname: user.surname, 
          examBoard: user.examBoard, 
          year: user.year
        })

        console.log(data);
        return data;




      }

    });







    const handleSubmit = async (event) =>{
        event.preventDefault();
        // try {
        //   //basic form validation: 

        //   if (userPassword !== confirmPassword){
        //     throw new Error('Make sure Passwords Match!');
        //   }


        //     await createUser(userEmail, userPassword);
        //     navigate('/learn');
             
            
        // } 
        try{
            //basic form validation: 

          if (userPassword !== confirmPassword){
            throw new Error('Make sure Passwords Match!');
          }

         


          dispatch(registerUser( {email: userEmail, password: userPassword, user:{
            email:userEmail, password: userPassword, firstName: firstName, surname: surname, year:year, examBoard:examBoard }}));
            console.log('filled redux store with details of current user')

            //now above this will return the data which will then be dispatched to the usersSLice under the action user/registerUser, so all we gotta do is handle the lifecycles now in our userSlice reducer
            //now user a selector to potentially show a loading symbol when state.user.isLoading = true; 
            //also have a selector to the isLoading, so that when it has a value of false, we then dispatch login and call navigate. 





          //essentially whats happening is because our dispatch is running synchronous operations it takes a little while, so whats happening is 
          //the navigate below is occuring while the dispatch above is still running, 
          //what you need to do is use the redux-thunk lifecycle methods or whatever they're called. 
          //also take a look back at how asycnhronous actions work in dispatch and whether it causes the sycnhronous actions to occur ahead while waiting
          //for the asycnhronous to complete. 


          // dispatch(login());
          // navigate('/learn');




        //   const req = await axios.post("//localhost:4000/api/user", {
        //     email: userEmail,
        //     password: userPassword,
        //     firstName: firstName,
        //     surname: surname,
        //     examBoard: examBoard,
        //     year: year


        //   });


        //   const response = await req.data

        

        //   console.log(response)

        //  dispatch(getUser(response));
        //  dispatch(login())

    //     const user = await createUserWithEmailAndPassword(auth, userEmail, userPassword );
    //     dispatch(getUser({
    //       uid: user.uid, 
    // firstName:firstName,
    // lastName: surname,
    // email: userEmail, 
    // year: year,
    // examBoard, 
    // onTrial: true,
    // isSubscribed:false,
    //     }))
    //     dispatch(login())




         

        } catch(error){
         setError(error.message)
         setAlertVisible(true)
        }

    }

  
  return (
    <>
    <h1><Badge color="info">Welcome to Root Math Where Maths is Fun</Badge></h1>
    <br/>
    <br />
    <h3>Do you already have an account? <Link className="router-link" to="/login" >Login</Link></h3>

    {error && <Alert color='info' isOpen={alertVisible} toggle={onDissmiss}>{error}</Alert>}
    <Form onSubmit={handleSubmit} >
      <br />
      <Row className="row-cols-lg-auto g-3 align-items-center">
        <Col>
        <Label for="firstName" >
          First Name
        </Label>
        <Input 
        id="firstName"
        name='name'
        placeholder="First Name"
        type="text"
        value = {firstName}
        onChange = {(event)=>{setFirstName(event.target.value)}}
        required
        />
        
        </Col>
        <Col>
        <Label for="surname" >
          Last Name
        </Label>
        <Input 
        id="surname"
        name='surname'
        placeholder="Surname"
        type="text"
       
        value={surname}
        onChange={(event)=>{setSurname(event.target.value)}}
        required 
        />
        
        </Col>
        <Col>
        < Label for="yearGroup">
          Year 
        </Label>
        <Input
        type="select"
        name="yearGroup"
        value={year}
        onChange={(event)=> {setYear(event.target.value)}}
        required
        > 
        <option value="" >
          --select year--
        </option>
        <option value={12}>
          Year 12
        </option>
        <option value={13}>
          Year 13
        </option>
        </Input>
        
        </Col>

      </Row>
      <br />

        <Label for="userEmail">
            Email
        </Label>
        <Input type="email" value={userEmail} placeholder="Enter Email" onChange={(event)=> setUserEmail(event.target.value) } required/>
        <br />
        <Label for="examBoard">
          Exam Board
        </Label>
        <Input type="select" 
        name="ExamBoard"  
        id="examBoard" 
        value={examBoard}
        onChange={(event)=>{setExamBoard(event.target.value)}}
        required
        >
          <option value="">
            --select exam board--
          </option>
          <option value="edexcel">
            Edexcel
          </option>
          <option value="ocr">
            OCR
          </option>
          <option value="aqa">
            AQA
          </option>
          <option value="cambridge-international">
            Cambridge International
          </option>

        </Input>
        
        <br />
       

       
        <Label for="school">
          School
        </Label>
        <Input type="search">
        
        </Input>

        <br />
        <Label for="userPassword">
            Password
        </Label>
        <Input type="password" value={userPassword} placeholder="Create Password" onChange={(event)=> setUserPassword(event.target.value)} required/>
        <br />
        <Input type="password" value={confirmPassword} placeholder="Confirm Password" onChange={(event)=> setConfirmPassword(event.target.value)} required/>
     
        <Button
    
    
    color="info"
    size="lg"
    style={{marginTop: '2rem'}}
    id="test"
    outline
  >
    Sign Up
  </Button>
 
        

    </Form>
    </>
  
  )
}

export default Signup