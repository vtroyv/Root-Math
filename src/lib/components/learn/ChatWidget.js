'use client'
// ChatWidget.js
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import classnames from 'classnames';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      {/* Floating toggle button, now styled as a round circle */}
      <Button
        color="info"
        onClick={toggleWidget}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,

          // Make the button round:
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          padding: 0,
          lineHeight: '60px',   // vertically center the text
          textAlign: 'center', 
          margin:'1%'
        }}
      >
        {isOpen ? 'X' : <i className="bi bi-mortarboard-fill" style={{fontSize:'1.5rem'}}></i>}
      </Button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '350px',    // widen slightly
            height: '500px',   // increase height
            zIndex: 9999
          }}
        >
          <Card style={{ height: '100%' }}>
            <CardBody className="d-flex flex-column">
              {/* Main “tab content” area */}
              <div className="flex-grow-1">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1" color="info">
                    <h5>Home</h5>
                    <p>Your “home” content goes here.</p>
                  </TabPane>
                  <TabPane tabId="2">
                    <h5>Messages</h5>
                    <p>Your messages or chat UI goes here.</p>
                  </TabPane>
                  <TabPane color="info" tabId="3">
                    <h5>Help</h5>
                    <p>FAQ or help info goes here.</p>
                  </TabPane>
                </TabContent>
              </div>

              {/* Bottom nav for switching tabs */}
              <Nav pills justified style={{ marginTop: '10px' }}>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => toggleTab('1')}
                    href="#"
                  >
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => toggleTab('2')}
                    href="#"
                  >
                    Messages
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '3' })}
                    onClick={() => toggleTab('3')}
                    href="#"
                  >
                    Help
                  </NavLink>
                </NavItem>
              </Nav>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
