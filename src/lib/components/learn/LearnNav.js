'use client'
import React,{useEffect} from 'react'
import { Nav, Navbar, NavbarBrand,NavLink, UncontrolledDropdown, DropdownToggle, DropdownItem,DropdownMenu, Button } from 'reactstrap';

import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function LearnNav() {
    
//   const {logout} = UserAuth;
  const router = useRouter()
  


  






  const handleLogout =async ()=>{
    // In this function add logic from the clerkjs api to handle log in's and outs
    // await logout()
    router.push('/')
  }
  return (
    <div className='home-nav'>
          <Navbar color="info" light={true} fixed='top' expand='md' style={{borderRadius:'0px'}}>
         < NavbarBrand className='px-2'><Link href="/" style={{textDecoration: 'none', fontWeight:'bold', color:'white'}}>RootMath</Link></NavbarBrand>
            <Nav light>
             <NavLink>
              EXAMS
             </NavLink>

              <NavLink> <Link href='/learn/questions' style={{textDecoration:"none"}}>QUESTIONS</Link></NavLink>
              

             
              <UncontrolledDropdown nav inNavbar>

                <DropdownToggle nav caret>
                  COURSES 

                </DropdownToggle>

              <DropdownMenu right>

                <DropdownItem onClick={()=>router.push('/learn/edx-maths-1')}>Edexcel Pure Maths year 12</DropdownItem>
                <DropdownItem onClick={()=> router.push('/learn/edx-stats-1')}> Edexcel Statistics year 12</DropdownItem>
                <DropdownItem onClick={()=> router.push('/learn/edx-mech-1')}>Edexcel Mechanics year 12</DropdownItem>
                  <DropdownItem onClick={()=> router.push('/learn/edx-maths-2')}>Edexcel Pure Maths year 13</DropdownItem>
                <DropdownItem onClick={()=> router.push('/learn/edx-stats-2')}>Edexcel Statistics year 13</DropdownItem>
                <DropdownItem onClick={()=> router.push('/learn/edx-mech-2')}>Edexcel Mechanics year 13</DropdownItem>

                <DropdownItem divider />
                <DropdownItem>Add Course</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                ACCOUNT
              </DropdownToggle>
              <DropdownMenu right>

                
                  <Link href='/learn/account' style={{textDecoration: 'none'}}>
                  <DropdownItem>
                    Profile
                    </DropdownItem>
                    </Link>
                  
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem ><button onClick={handleLogout}>Logout</button> </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
           
            
            </Nav>
        </Navbar>
    </div>
  )
}