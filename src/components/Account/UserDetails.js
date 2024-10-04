import React,{useState, useEffect} from 'react'
import { Button,Collapse, Card, CardBody, CardTitle, CardText, Input} from 'reactstrap'
import { UserAuth } from '../../firebase/fbMethodContext';
import { auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../redux/usersSlice';
import {logout as signout} from '../../redux/authSlice';


const UserDetails = () => {
  const navigate = useNavigate();
  const loggedIn = useSelector(state => state.auth.loggedIn);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [newEmail, setNewEmail]= useState('');
  const [password, setPassword] = useState(''); 


  useEffect( ()=>{
  onAuthStateChanged(auth, (user) =>{
    setEmail(user.email)
  })
  if (!loggedIn) {
    navigate('/')
  }
  
  })



  const toggle = () =>{
    setIsOpen(!isOpen);
    setNewEmail('');
    setPassword('');
  }

  const {logout} = UserAuth();
  
 const handleLogout =() =>{
  logout()
  dispatch(clearUser());
  dispatch(signout())
  
  navigate('/');

 }
  

 
  return (
    <div > 
      <h1>Account</h1>
    
      <p><strong>Email</strong> 
      <span style={{marginLeft: '5px'}}> 
         {!isOpen && <Button size="sm" outline="true" color="info" onClick={toggle}>Change</Button>}
      </span>
        </p>

      <p>{email}</p>
      <Collapse isOpen={isOpen} >
        <Card style={{padding:"1%"}}>
          <CardTitle> Change Email</CardTitle>
          <CardText>New Email *</CardText>
          <Input placeholder='new Email'
          onChange={''}
          value={newEmail}
          />
          <br />

          <CardText>Confirm Password *</CardText>
          <Input
          placeholder="confirm password" 
          type="password"
          onChange={''}
          value={password}
        
          />
          <br />

          <div style={{display:'flex', justifyContent:'end', gap: '10px'}}>
            <Button size = "sm" onClick={toggle}>Cancel</Button>    
            <Button size="sm" color="info" onClick={''}>Save</Button>
          </div>
        </Card>

      </Collapse>

      <br />
     
      
      <Button color ="info" onClick={handleLogout} outline="true">
        Sign Out

      </Button>
      
      
      </div>
  )
}

export default UserDetails