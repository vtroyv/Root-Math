import React from 'react'
import { WithAuthRequired } from './WithAuthRequired'



const ProtectedRoute = (props) => {
 //wrap the component we get with the HoC we just wrote 
const  WrappedComponent = () =>  WithAuthRequired(props)



 
    return (
        <>
         <WrappedComponent />
         
        </>

    )
}

export default ProtectedRoute

