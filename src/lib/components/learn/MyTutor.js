"use client";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Input,
} from "reactstrap";
import classnames from "classnames";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

/**
 * MyTutor Component
 *
 * - Home Tab: Displays a "New Chat" button (and some stats).
 * - Messages Tab: Displays either a list of previous chats (when no chat is active)
 *   or a chat view for a conversation (with a Back button to return to the list).
 * - Help Tab: Simple FAQ.
 */
export default function MyTutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1"); // "1"=Home, "2"=Messages, "3"=Help

  // currentConversation holds the messages for the chat view in the Messages tab.
  const [currentConversation, setCurrentConversation] = useState([]);
  // inChatView determines if we are in the chat conversation view vs. the list view.
  const [inChatView, setInChatView] = useState(false);

  // Chat input and typing indicator
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Hard-coded previous chats (simulate saved conversations)
  const [previousChats] = useState([
    {
      id: 1,
      title: "Help with Quadratic Functions",
      messages: [
        { role: "assistant", content: "Hello, how can I help with Quadratic Functions?" },
        { role: "user", content: "I need help factoring them." },
        { role: "assistant", content: "Sure, let's try factoring x² + 5x + 6..." },
      ],
    },
    {
      id: 2,
      title: "Integration Basics",
      messages: [
        { role: "assistant", content: "Hello, let's talk about integration." },
        { role: "user", content: "How do I find indefinite integrals?" },
        { role: "assistant", content: "You can start by reversing differentiation..." },
      ],
    },
  ]);

  // Toggle the widget open/closed
  const toggleWidget = () => setIsOpen(!isOpen);

  // Switch between Home, Messages, and Help tabs
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Start a new chat from Home: set up an initial conversation and switch to Messages in chat view
  const handleNewChat = () => {
    const initialMessage = { role: "assistant", content: "Hello! Let's start a new conversation." };
    setCurrentConversation([initialMessage]);
    setInChatView(true);
    setActiveTab("2");
  };

  // Send a message in the chat view
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    const userMsg = { role: "user", content: userInput };
    setCurrentConversation((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsTyping(true);
    setTimeout(() => {
      const botMsg = {
        role: "assistant",
        content: "Thanks for your question! Here's a helpful response.",
      };
      setCurrentConversation((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // Load a previous chat into the chat view
  const handleLoadChat = (chatId) => {
    const chatToLoad = previousChats.find((c) => c.id === chatId);
    if (chatToLoad) {
      setCurrentConversation(chatToLoad.messages);
      setInChatView(true);
      setActiveTab("2");
    }
  };

  // Back button: return to the list view in the Messages tab.
  const handleBackToList = () => {
    setInChatView(false);
    // Optionally clear the current conversation (if not meant to be saved)
    // setCurrentConversation([]);
  };

  return (
    <>
      {/* Floating toggle button */}
      <Button
        color="info"
        onClick={toggleWidget}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          padding: 0,
          lineHeight: "60px",
          textAlign: "center",
        }}
      >
        {isOpen ? "X" : <i className="bi bi-mortarboard-fill" style={{ fontSize: "1.5rem" }} />}
      </Button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "350px",
            height: "500px",
            zIndex: 9999,
          }}
        >
          <Card
            style={{
              height: "100%",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "none",
              borderRadius: "0.5rem",
            }}
          >
            <CardBody className="d-flex flex-column">
              {/* Main content area */}
              <div className="flex-grow-1" style={{ overflow: "auto" }}>
                <TabContent activeTab={activeTab}>
                  {/* Home Tab: Shows stats and a New Chat button */}
                  <TabPane tabId="1">
                    <h5 style={{ color: "#17a2b8", fontWeight: "bold" }}>Home</h5>
                    <p style={{ marginBottom: "1rem" }}>
                      Welcome! Start a new conversation by clicking the button below.
                    </p>
                    <Button color="info" block onClick={handleNewChat}>
                      New Chat
                    </Button>
                  </TabPane>

                  {/* Messages Tab: Two views */}
                  <TabPane tabId="2">
                    {inChatView ? (
                      // Chat view for current conversation
                      <>
                        <Row style={{ marginBottom: "0.5rem" }}>
                          <Col>
                            <Button color="secondary" size="sm" onClick={handleBackToList}>
                              &larr; Back
                            </Button>
                          </Col>
                        </Row>
                        <h5 style={{ color: "#17a2b8", fontWeight: "bold" }}>Conversation</h5>
                        <div
                          style={{
                            maxHeight: "240px",
                            overflowY: "auto",
                            marginBottom: "1rem",
                          }}
                        >
                          {currentConversation.map((msg, idx) => (
                            <div
                              key={idx}
                              style={{
                                textAlign: msg.role === "assistant" ? "left" : "right",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "inline-block",
                                  padding: "0.5rem 1rem",
                                  borderRadius: "10px",
                                  backgroundColor:
                                    msg.role === "assistant" ? "#e9ecef" : "#17a2b8",
                                  color: msg.role === "assistant" ? "#333" : "#fff",
                                  maxWidth: "80%",
                                }}
                              >
                                {msg.content}
                              </div>
                            </div>
                          ))}
                          {isTyping && (
                            <div style={{ textAlign: "left", marginBottom: "0.5rem" }}>
                              <div
                                style={{
                                  display: "inline-block",
                                  padding: "0.5rem 1rem",
                                  borderRadius: "10px",
                                  backgroundColor: "#e9ecef",
                                  color: "#333",
                                }}
                              >
                                Typing...
                              </div>
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Input
                            type="text"
                            placeholder="Type your message..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") handleSendMessage();
                            }}
                          />
                          <Button color="info" onClick={handleSendMessage}>
                            Send
                          </Button>
                        </div>
                      </>
                    ) : (
                      // List view of previous chats
                      <>
                        <h5 style={{ color: "#17a2b8", fontWeight: "bold" }}>Messages</h5>
                        <p>Select a previous conversation:</p>
                        {previousChats.map((chat) => (
                          <Button
                            key={chat.id}
                            color="light"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              marginBottom: "0.5rem",
                              border: "1px solid #ccc",
                            }}
                            onClick={() => handleLoadChat(chat.id)}
                          >
                            {chat.title}
                          </Button>
                        ))}
                      </>
                    )}
                  </TabPane>

                  {/* Help Tab */}
                  <TabPane tabId="3">
                    <h5 style={{ color: "#17a2b8", fontWeight: "bold" }}>Help</h5>
                    <p>Have questions? Check out our FAQ:</p>
                    <ul>
                      <li>How do I find more practice questions?</li>
                      <li>Where can I see my progress?</li>
                      <li>How do I reset my password?</li>
                    </ul>
                    <p>Or ask our Tutor by starting a new chat.</p>
                  </TabPane>
                </TabContent>
              </div>

              {/* Bottom nav for switching tabs */}
              <Nav pills justified style={{ marginTop: "10px" }}>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => toggleTab("1")}
                    href="#"
                  >
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => toggleTab("2")}
                    href="#"
                  >
                    Messages
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => toggleTab("3")}
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
