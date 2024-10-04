import React,{useEffect, useState} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from '../firebase/firebaseConfig';
import {redirect , useNavigate, Navigate} from 'react-router-dom';


const ProtectedPage = (props) => {
    
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(true)
    const [trial, setTrial] = useState()
    const [isSubscribed, setIsSubscribed] = useState()
    const [loading, setLoading]= useState(true)
    const isSubscribedRoute = props.isSubscribedRoute
    const navigate = useNavigate();

    useEffect(()=>{
         onAuthStateChanged(auth, async (user) =>{
            
            if(user){

                const idTokenResult = await user.getIdTokenResult(true);
             
               
                


               
                    const onTrial  = idTokenResult.claims.trial;
              
                    setTrial(onTrial);
                    console.log(trial);

                    const Subscribed = idTokenResult.claims.subscribed;
                 
                    setIsSubscribed(Subscribed)

                    console.log(isSubscribed)

                    console.log(`Trial is ${onTrial} & Subscribed is ${isSubscribed}`)
            

                    setUser(user);
                   
                   if(trial || isSubscribed) {
                    setIsAuthenticated(true);
                   }

                  
              

            } else {
                setUser(user)

            }
        })


        
        let isAuthorized;

      

          
        if ( isSubscribedRoute) {
           

            if(isSubscribed){
                isAuthorized = true;
                console.log('user is subscribed and can access this page')
            } else if (trial && isSubscribed === false){
              
                 navigate('/login')
            }
        }
        

           if (!isAuthenticated){
            console.log('not authenticated')

            navigate('/login')
            //The code works when I replace this call to the navigate hook above, and replace the <Navigate /> component in the render method below with <div></div>
             

           } else if(!isSubscribedRoute && trial){
            isAuthorized = true;
         

            

           }else if(!isAuthorized){
            console.log('not authorized')
             navigate('/login')
           }
        

        
          

    } )



    return (
        <>
        {loading? (
            <span>Loading...</span>
        ) : isAuthenticated? (
            props.component
        ) : (
          <Navigate to='/' />
        )}
        
        </>
    )
}

export default ProtectedPage