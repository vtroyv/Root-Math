import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'



const Home = () => {

  

   

  return (
    <div>
        <div >
        <Navigation />
        </div>
 
      


        <main className="outlet-container" >
        <Outlet />
       
        </main>
        
        
      

    </div>
  )
}

export default Home