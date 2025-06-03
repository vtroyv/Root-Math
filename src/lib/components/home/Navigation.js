'use client';
import React, { useState } from 'react';
import Link from 'next/link';
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

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="home-nav">
      <Navbar
        fixed="top"
        color="info"
        expand="md"
        className="home-navbar"
        style={{ borderRadius: '0px' }}
      >
        {/* Use the tag prop to render NavbarBrand as Link */}
        <NavbarBrand tag={Link} href="/" className="px-2" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'white' }}>
          RootMath
        </NavbarBrand>

        <NavbarToggler onClick={toggle} className="me-2" />

        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar style={{ borderRadius: '0px' }}>
            {/* Use Link with NavLink for non-anchor elements */}
            <Link href="/courses" passHref legacyBehavior>
              <NavLink className="px-2" style={{ cursor: 'pointer' }}>
                COURSES
              </NavLink>
            </Link>

            <Link href="/teachers" passHref legacyBehavior>
              <NavLink className="px-2" style={{ cursor: 'pointer' }}>
                TEACHERS
              </NavLink>
            </Link>

            {/* Use DropdownItem with tag prop */}
            <UncontrolledDropdown nav inNavbar className="px-2">
              <DropdownToggle nav caret>
                ABOUT
              </DropdownToggle>
              <DropdownMenu right style={{ padding: '0px auto', borderRadius: '5px' }}>
                <DropdownItem tag={Link} href="/features">
                  Features
                </DropdownItem>
                <DropdownItem tag={Link} href="/pricing">
                  Pricing
                </DropdownItem>
                <DropdownItem tag={Link} href="/mission">
                  Mission
                </DropdownItem>
                <DropdownItem tag={Link} href="/blog">
                  Blog
                </DropdownItem>
                
                <DropdownItem divider style={{ padding: '0px', margin: '0px' }}></DropdownItem>
                <DropdownItem tag={Link} href="/contact">
                  Contact us
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            {/* Use Link with NavLink */}
            <Link href="/sign-up" passHref legacyBehavior>
              <NavLink className="px-2" style={{ cursor: 'pointer' }}>
                SIGN UP
              </NavLink>
            </Link>

            <Link href="/sign-in" passHref legacyBehavior>
              <NavLink className="px-2" style={{ cursor: 'pointer', marginRight: '60px' }}>
                LOGIN
              </NavLink>
            </Link>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Navigation;
