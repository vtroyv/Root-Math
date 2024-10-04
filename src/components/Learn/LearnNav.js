import React,{useEffect} from 'react'
import { Nav, Navbar, NavbarBrand,NavItem,NavLink, UncontrolledDropdown, DropdownToggle, DropdownItem,DropdownMenu, Button } from 'reactstrap';
import {Link, NavLink as Navlinkto} from 'react-router-dom'
import {UserAuth} from '../../firebase/fbMethodContext';
import { useNavigate } from 'react-router-dom';


//findout why the function on the drop down item isnt working

const LearnNav = () => {
  const {logout} = UserAuth;
  const navigate = useNavigate();
  


  






  const handleLogout =async ()=>{
    await logout()
    navigate('/')
  }
  return (
    <div>
          <Navbar color="info" light={true} fixed='top' expand={true} style={{borderRadius:'0px'}}>
         < NavbarBrand className='px-2'><Link to="/" style={{textDecoration: 'none', fontWeight:'bold', color:'white'}}>RootMath</Link></NavbarBrand>
            <Nav light>
             <NavLink>
              EXAMS
             </NavLink>

              <NavLink> <Link to='quizzes' style={{textDecoration:"none"}}>QUIZZES</Link></NavLink>
              

             
              <UncontrolledDropdown nav inNavbar>

                <DropdownToggle nav caret>
                  COURSES 

                </DropdownToggle>

              <DropdownMenu right>

                <DropdownItem onClick={()=>navigate('edx-maths-1')}>Edexcel Pure Maths year 12</DropdownItem>
                <DropdownItem>Edexcel Pure Maths year 13</DropdownItem>
                <DropdownItem>Edexcel Statistics year 12/13</DropdownItem>
                <DropdownItem>Edexcel Mechanics year 12/13</DropdownItem>

                <DropdownItem divider />
                <DropdownItem>Add Course</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                ACCOUNT
              </DropdownToggle>
              <DropdownMenu right>

                
                  <Link to ='/account' style={{textDecoration: 'none'}}>
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

export default LearnNav