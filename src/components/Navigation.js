import React,{useState} from 'react';
import {
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavbarToggler,



  Navbar,
  NavLink,

  NavbarBrand,

} from 'reactstrap';

import {  Link } from 'react-router-dom';



function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);



 


  return (
    <div className="home-nav" >
      <Navbar fixed='top' color="info" expand="md"  className='home-navbar' style={{borderRadius:'0px'}}>
         <NavbarBrand className='px-2'><Link to="/" style={{textDecoration: 'none', fontWeight:'bold', color:'white'}}>RootMath</Link></NavbarBrand>

         <NavbarToggler onClick={toggle} className='me-2' />
         
         <Collapse isOpen={isOpen} navbar  >

         
         <Nav className="ms-auto" navbar  style={{borderRadius:'0px'}}>
              {/* <Navlinkto to="/quizzes"> */}
             


              {/* </Navlinkto> */}
                        
              <Link to='/signup' style={{textDecoration:'none'}}>
              <NavLink className='px-2' >
                COURSES
                </NavLink>
                </Link>
                
                <NavLink className='px-2'>
                  TEACHERS
                </NavLink>
          

               

            <UncontrolledDropdown nav inNavbar className='px-2' >
              <DropdownToggle nav caret>
                ABOUT
              </DropdownToggle>
              <DropdownMenu right style={{padding:'0px auto', borderRadius:'5px', }}>

                
                  <Link to ='/features' style={{textDecoration: 'none'}}>
                  <DropdownItem>
                    Features
                    </DropdownItem>
                    </Link>
                  
                <DropdownItem>Pricing</DropdownItem>
               
                <DropdownItem>Mission</DropdownItem>
                <DropdownItem>Blog</DropdownItem>
                <DropdownItem>Frequently Asked Questions</DropdownItem>
                <DropdownItem divider style={{padding:'0px', margin:'0px'}}></DropdownItem>
                <Link to="/contact" style={{textDecoration:'none'}}><DropdownItem>Contact us</DropdownItem></Link>
              </DropdownMenu>
            </UncontrolledDropdown>
            <Link to="/signup" style={{textDecoration:'none'}}> <NavLink className='px-2'> SIGN UP</NavLink></Link>
           
  
              <Link to='/login' style={{textDecoration:'none'}}> <NavLink  style={{MarginRight:'60px'}}>LOGIN</NavLink></Link>
              
          
           
            
            </Nav>
            </Collapse>
        
       
      </Navbar>
    </div>
  );
}

export default Navigation;