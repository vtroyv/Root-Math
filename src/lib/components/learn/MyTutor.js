"use client";
import React, { useState, useRef, useEffect} from "react";
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
import { useInView } from "react-intersection-observer";
import classnames from "classnames";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useParams, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAskTutorMutation } from "@/lib/redux/slices/apiSlice";
import { useLessonStore } from "@/lib/zustand/providers/lesson-state-provider";

export default function MyTutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("1"); // "1"=Home, "2"=Messages, "3"=Help
  const [currentUrl, setCurrentUrl] =useState('');
  const [validUrl, setValidUrl] = useState(false);

  const [currentConversation, setCurrentConversation] = useState([]);
  const [inChatView, setInChatView] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

 const pathname = usePathname();
 const params = useParams();
 const acceptedUrlKeys = ['lessonDisplay', 'title'] // can add to this as we develop futher 
 const { isLoaded, isSignedIn, user } = useUser();
 const [askTutor, mutationState] = useAskTutorMutation();
 
 //zustand hooks
 const lesson = useLessonStore(state => state.lesson);
const tasks = useLessonStore(state=> state.tasks);





 

  useEffect(() => {


    // Optionally extract the last segment:
    const segments = pathname.split("/");
    // Handle trailing slash by checking the last element.

    const lastParam = segments.pop()
    setCurrentUrl(lastParam);
    const lastParamKey = Object.keys(params).pop();
    //This will check that the user is on a page with either a question, or a lesson and not on the homepage or navigation pages
    // As starting off initially we'd like to only have the chatbot available on the lesson pages or question pages
    //We can add more keys to the acceptedUrlKeys array to allow for more pages to have the chatbot at later stages
    if (acceptedUrlKeys.includes(lastParamKey)){
      setValidUrl(true);
    }


    

  }, [pathname]);
  

  //The purpose of this function is to write the url in a form where it can be used as the title of a chat bot!
  function urlToTitle(url){
    let title = url.split('-').map(word=> word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    return title;
  }


  


  // Hard-coded previous chats
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

  // Ref for the scroll container
  const scrollContainerRef = useRef(null);

  // Set up a state to hold the actual DOM element for the New Chat button.
  const [newChatElem, setNewChatElem] = useState(null);

  // Use react-intersection-observer to know if the New Chat button is in view.
  const { ref: inViewRef, inView: isBottomVisible } = useInView({
    threshold: 0,
  });

  // Combine the inViewRef with our own ref state.
  const setRefs = (node) => {
    inViewRef(node);
    setNewChatElem(node);
  };

  // Scroll to the New Chat button.
  const scrollDown = () => {
    newChatElem?.scrollIntoView({ behavior: "smooth" });
  };

  // Toggle widget open/closed
  const toggleWidget = () => setIsOpen(!isOpen);
  // Toggle expanded view
  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Switch between tabs
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Start a new chat
  const handleNewChat = () => {
    const initialMessage = {
      role: "assistant",
      content: "Ask here for a hint, I'll assist you!",
    };
    setCurrentConversation([initialMessage]);
    setInChatView(true);
    setActiveTab("2");
  };

  // Send a chat message
  const handleSendMessage = async () => {


    const lessonContext = {lesson, tasks}
    
    const {id} = user;
    const title = urlToTitle(currentUrl);
   


    if (!userInput.trim()) return;
    const userMsg = { role: "user", content: userInput };
    setCurrentConversation((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsTyping(true);

    // Now isTyping should stay true until the bots response is stored and ready to be displaye in the chat
    let latestConversation = [...currentConversation, userMsg];
    //Add a if statement, that checks if were on a lessonRoute, if so include the lessonContext
    const promptData = {id, title, currentUrl, latestConversation, lessonContext }
    const response = await askTutor(promptData);

    


    


     setTimeout(() => {
      const botMsg = {
        role: "assistant",
        content: "Thanks for your question! Here's a helpful response.",
      };
      setCurrentConversation((prev) => [...prev, botMsg]);
      
      setIsTyping(false);
    }, 1500);




  


  };



  // Load a previous chat
  const handleLoadChat = (chatId) => {
    const chatToLoad = previousChats.find((c) => c.id === chatId);
    if (chatToLoad) {
      setCurrentConversation(chatToLoad.messages);
      setInChatView(true);
      setActiveTab("2");
    }
  };

  // Return to chat list
  const handleBackToList = () => {
    setInChatView(false);
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
            width: isExpanded ? "700px" : "350px",
            height: isExpanded ? "700px" : "500px",
            zIndex: 9999,
          }}
        >
          <Card
            style={{
              height: "100%",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "none",
              borderRadius: "0.5rem",
              position: "relative",
            }}
          >
            <CardBody className="d-flex flex-column" style={{ height: "100%", padding: "1rem" }}>
              {/* Expand icon at the top */}
              <Button
                onClick={toggleExpand}
                color="link"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 10,
                }}
              >
                <i className="bi bi-arrows-angle-expand" style={{ fontSize: "1.5rem" }} />
              </Button>

              {/* Scrollable main content */}
              <div
                ref={scrollContainerRef}
                className="flex-grow-1"
                style={{
                  overflowY: "auto",
                  marginTop: "40px",
                  paddingBottom: "5px",
                }}
              >
                <TabContent activeTab={activeTab}>
                  {/* HOME TAB */}
                  <TabPane tabId="1">
                    <h5 style={{ color: "#17a2b8", fontWeight: "bold" }}>Your Personal Tutor</h5>
                    <p>
                      Welcome to your personal tutor on RootMath! Ask any question about the platform and get personalized insights.
                    </p>
                    <p>Your tutor tracks your progress—so the more you interact, the better the guidance.</p>
                    <p>Example questions:</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <Card
                        style={{
                          borderRadius: "1.5rem",
                          padding: "0.5rem 1rem",
                          backgroundColor: "#f0f8ff",
                          border: "none",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      >
                        <p style={{ margin: 0 }}>I&apos;ve only got 1 hour to study—what should I prioritize?</p>
                      </Card>
                      <Card
                        style={{
                          borderRadius: "1.5rem",
                          padding: "0.5rem 1rem",
                          backgroundColor: "#f0f8ff",
                          border: "none",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      >
                        <p style={{ margin: 0 }}>I&apos;m stuck on a differentiation problem—how do I start?</p>
                      </Card>
                      <Card
                        style={{
                          borderRadius: "1.5rem",
                          padding: "0.5rem 1rem",
                          backgroundColor: "#f0f8ff",
                          border: "none",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          I watched the graph transformation video but didn&apos;t catch the rules for stretching. Can you explain it again?
                        </p>
                      </Card>
                    </div>

                    {/* New Chat button wrapped with the combined ref */}
                    <div ref={setRefs}>
                      <Button
                        color="info"
                        block
                        onClick={handleNewChat}
                        style={{ marginTop: "0.5rem" }}
                      >
                        New Chat
                      </Button>
                    </div>

                    {/* Sticky arrow at the bottom-right */}
                    <div
                      style={{
                        position: "sticky",
                        bottom: "10px",
                        display: "flex",
                        justifyContent: "flex-end",
                        zIndex: 999,
                      }}
                    >
                      <Button
                        color="link"
                        onClick={scrollDown}
                        style={{
                          marginRight: "20px",
                          display: isBottomVisible ? "none" : "block",
                        }}
                      >
                        <i className="bi bi-arrow-down-circle-fill" style={{ fontSize: "1.5rem" }} />
                      </Button>
                    </div>
                  </TabPane>

                  {/* MESSAGES TAB */}
                  <TabPane tabId="2">
                    {inChatView ? (
                      <>
                        <Row style={{ marginBottom: "0.5rem" }}>
                          <Col>
                            <Button color="secondary" size="sm" onClick={handleBackToList}>
                              &larr; Back
                            </Button>
                          </Col>
                        </Row>
                        <h5 style={{ color: "#17a2b8", fontWeight: "bold" }}>{urlToTitle(currentUrl)}</h5>
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
                                  backgroundColor: msg.role === "assistant" ? "#e9ecef" : "#17a2b8",
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

                  {/* HELP TAB */}
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
              <Nav
                pills
                justified
                style={{
                  marginTop: "10px",
                  flexShrink: 0,
                }}
              >
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
