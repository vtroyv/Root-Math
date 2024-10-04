import React, {useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import LearnNav from './LearnNav';


import { onAuthStateChanged } from 'firebase/auth';
import {auth} from '../../firebase/firebaseConfig';
import { useNavigate , useLocation} from 'react-router-dom';
import {logout} from '../../redux/authSlice'

import { useDispatch, useSelector } from 'react-redux';







const Learn = () => {


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();


  //useSelector means that if this variable changes our reaact component will rerender, this will trigger the useEffect causing us to be navigated out
  const loggedIn = useSelector(state => state.auth.loggedIn);


  
  useEffect(()=>{
    onAuthStateChanged(auth, (user) =>{
      

      if(!user){
        dispatch(logout())
        console.log('logged out')
      }
      
    });

    if(!loggedIn){
      navigate('/')
    }

    
  },[dispatch, loggedIn, navigate])


 


  // window.addEventListener('beforeUnload', preventGoBack)

 
  


// const preventGoBack = () =>{
// History.pushState(null, document.title, Location.href);
// Window.addEventListener('popstate', function (event)
// {
//   History.pushState(null, document.title, Location.href);
// });
// }

 
 




  return (
    <>
    <div className="learn-container" >

      <div className="learnBar-container">
      <LearnNav />

      
      </div>
      
    
     <br />
     <br />

      <div className="learn-outlet" >
      <div className='breadcrumb-nav'>
      <Breadcrumbs />
      </div>
      
      <Outlet />
      </div>

    </div>
    </>
  )
}

export default Learn