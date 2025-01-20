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
      {/* Floating toggle button */}
      <Button
        color="info"
        onClick={toggleWidget}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999
        }}
      >
        {isOpen ? 'X' : 'AI Tutor'}
      </Button>

      {/* Only render the chat card if it's open */}
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
            {/* Make the card body flex so we can pin the nav at the bottom */}
            <CardBody className="d-flex flex-column">
              {/* Main “tab content” area fills the vertical space */}
              <div className="flex-grow-1">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1" color='info'>
                    <h5>Home</h5>
                    <p>Your “home” content goes here.</p>
                  </TabPane>
                  <TabPane tabId="2">
                    <h5>Messages</h5>
                    <p>Your messages or chat UI goes here.</p>
                  </TabPane>
                  <TabPane color='info' tabId="3">
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
