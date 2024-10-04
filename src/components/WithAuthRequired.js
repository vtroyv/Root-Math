import React,{useEffect}  from 'react';
import { useAuth } from "../firebase/authContext"
import { useNavigate } from "react-router-dom";

//isAuthenticated just depends on wheter the user signed in, eg they have a trial or subscribed claim

//isAuthorized must check whether the user has the required level of authorization eg subscribed if it is a route requiring subscription
// eg 


export function WithAuthRequired(props){


   
    const { user, isAuthenticated} = useAuth();
    console.log(`isAuthenticated is ${isAuthenticated}`)
   
        //This will be passed from protectedRoute
        const isSubscribedRoute = props.isSubscribedRoute
        

        // use our context hook to get the user info 
    
        console.log(`in withAuthReq the value of user recieved is ${user}`)

        console.log(`in withAuthReq the vale of isAuthenticated is ${isAuthenticated}`)

      
        const navigate = useNavigate();
      


        useEffect(()=>{
           
            let isAuthorized;

            
            if ( isSubscribedRoute) {
                //to be authenticated the user must either have an active trial or subscription,
                // if neither you need to navigate them to a page to pay for a subscription to continue their progress 


                /*
                if authenticated, 
                is the route subscription only,
                if it is subscription only is the user
                */

                if(user?.isSubscribed){
                    isAuthorized = true;
                    console.log('user is subscribed and can access this page')
                } else if (user?.onTrial && user?.isSubscribed === false){
                    //display a modal or message indicating that the user must he subscribed to access this resource 
                    // console.log('not authorized at point B')
                     navigate('/login')
                }
            }
            

               if (!isAuthenticated){
                console.log('not authenticatedddddddd')

               
                 navigate('/features')
                 

               } else if(!isSubscribedRoute && user?.onTrial){
                isAuthorized = true;
                return

                

               }else if(!isAuthorized){
                console.log('not authorized at point A')
                 navigate('/signup')
               }
            })

         
        // return (isAuthenticated && <Component {...args} /> );

        return (
            <>
            {isAuthenticated? (
                props.component
            ) : (
                <div></div>
            )}
            
            </>
        )


        
}