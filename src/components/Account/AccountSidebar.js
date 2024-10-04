import React,{useState, useEffect} from 'react';
import {NavLink } from 'react-router-dom';
import {
    Navbar,
    NavbarBrand,
    Nav, 
    NavItem

} from 'reactstrap';

import { auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';



const AccountSidebar = (args) => {
    
    const [user, setUser] = useState('');


    // useEffect(()=>{
    //     onAuthStateChanged(auth, (user)=>{
    //         if(user) {
    //             setUser(auth.currentUser)
    //         }
    //         if (!user){
    //             navigate('/login');

    //         }

    //     },[onAuthStateChanged] )

        
    // })

    const navigate = useNavigate()
    // const navigate = useNavigate('/')


  return (
    <div >
        <Navbar {...args} >
        <Nav vertical className=' dropdown-menu account-sidebar-container' style={{height: '90%'}} >
            
        <NavItem className='dropdown-item '>
            <NavLink className='router-nav-link' to={`/account`}>
                Profile
            </NavLink>
            </NavItem>
            <NavItem className='dropdown-item'>
                Education
            </NavItem>
            <NavItem>
                Payments & Billing
            </NavItem>
            <NavItem>

            </NavItem>
            
    
        </Nav>
        </Navbar>
        
         

        
    
    </div>

  )
}

export default AccountSidebar