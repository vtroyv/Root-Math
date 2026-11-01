"use client";
import React, { useState, useRef, useEffect } from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useParams, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAskTutorMutation } from "@/lib/redux/slices/apiSlice";
import { useLessonStore } from "@/lib/zustand/providers/lesson-state-provider";

/*
The floating AI tutor on every /learn page. Tabs: Chat (the current conversation), Chats
(previous ones) and Help. Messages can use $...$ maths and **bold**.

The replies and previous chats are still hard-coded: /api/tutor/asktutor doesn't answer yet,
so a send waits for it and then shows a stock hint. DEMO is a worked hint conversation for
Completing-the-Square-Exam-Style (for screenshots); it loads only on that question, and
every other page opens on the welcome screen. Colour changes only, no animation, per the
styling preference.
*/

const DEMO = {
  slug: "Completing-the-Square-Exam-Style",
  part: "part (a)",
  messages: [
    { role: "user", content: "I'm stuck on part (a). How do I complete the square when there's a $2$ in front of the $x^2$?" },
    { role: "assistant", hint: 1, content: "That's the step most people get stuck on. Start by taking the $2$ out of **just the first two terms**, and leave the $+13$ where it is. What do you get?" },
    { role: "user", content: "$2(x^2 + 6x) + 13$?" },
    { role: "assistant", hint: 2, content: "That's right ✓ Now complete the square on the bracket only. Halve the $6$, then take away its square so the value doesn't change. What's $x^2 + 6x$ in completed square form?" },
    { role: "user", content: "$(x+3)^2 - 9$, so it's $2(x+3)^2 - 9 + 13$?" },
    { role: "assistant", hint: 3, content: "Nearly! The $-9$ is still **inside** the big bracket, so the $2$ multiplies it too: $$2\\big[(x+3)^2 - 9\\big] + 13$$ What does that simplify to?" },
    { role: "user", content: "oh so $2(x+3)^2 - 18 + 13 = 2(x+3)^2 - 5$" },
    { role: "assistant", content: "Spot on 🎉 That's part (a). Part (b) is quick from here: $(x+3)^2$ can never be negative, so which value of $x$ makes it as small as possible?" },
  ],
};

const PREVIOUS_CHATS = [
  {
    id: 1,
    title: "Quadratic Graphs",
    ago: "2 days ago",
    messages: [
      { role: "user", content: "If the curve just touches the $x$-axis, how many roots is that?" },
      { role: "assistant", hint: 1, content: "Think about what the roots are: the $x$-values where the curve meets the axis. How many different $x$-values does it meet the axis at when it only touches?" },
      { role: "user", content: "just one" },
      { role: "assistant", content: "Exactly, so it has **one repeated root**. For example $y = (x-2)^2$ touches the axis at $x = 2$ only." },
    ],
  },
  {
    id: 2,
    title: "Binomial Estimation",
    ago: "Last week",
    messages: [
      { role: "user", content: "How do I use the expansion of $(1 + x)^8$ to estimate $1.02^8$?" },
      { role: "assistant", hint: 1, content: "Compare $1.02$ with $1 + x$. Which value of $x$ makes them the same?" },
      { role: "user", content: "$x = 0.02$" },
      { role: "assistant", content: "That's it. Put $x = 0.02$ into the first few terms of your expansion and add them up." },
    ],
  },
  {
    id: 3,
    title: "Revision plan",
    ago: "Last week",
    messages: [
      { role: "user", content: "I've only got 1 hour to study tonight, what should I do?" },
      { role: "assistant", content: "Start with the **3 review cards** that are due (about 5 minutes), then spend the rest on Binomial Estimation, your weakest topic on the Progress page." },
    ],
  },
];

const SUGGESTIONS = [
  "I've only got 1 hour to study. What should I prioritise?",
  "I'm stuck on a differentiation question. How do I start?",
  "Can you explain the rules for stretching a graph again?",
];

const QUICK_REPLIES = ["Give me another hint", "Check my working", "Explain it another way"];

const STOCK_REPLY = {
  role: "assistant",
  hint: 1,
  content: "Here's a nudge rather than the answer: what's the first step you'd usually take on a question like this? Tell me what you've tried so far and I'll point you in the right direction.",
};

const HELP = [
  ["What can the tutor help with?", "Any lesson or question on RadixMaths: a hint when you're stuck, a check of your working, or an idea explained another way."],
  ["Will it just give me the answer?", "No. It nudges you one step at a time, so you can do the next one yourself. If you're really stuck, the Model Solution tab has the full working."],
  ["Does it know which question I'm on?", "Yes. Open it on a lesson or question and it starts from there."],
  ["Does it cost extra?", "No, it's included with RadixMaths."],
];

// the slug as a title: "Completing-the-Square-Exam-Style" → "Completing The Square Exam Style"
function urlToTitle(url) {
  return url.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

// **bold** in a message, with the maths drawn by react-latex-next
function MessageText({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
    p.startsWith("**") ? <strong key={i}><Latex>{p.slice(2, -2)}</Latex></strong> : <Latex key={i}>{p}</Latex>,
  );
}

function TutorAvatar({ size = "2rem" }) {
  return (
    <span
      aria-hidden="true"
      style={{ flexShrink: 0, width: size, height: size, borderRadius: "50%", background: "var(--rm-teal)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: `calc(${size} * 0.5)` }}
    >
      <i className="bi bi-mortarboard-fill" />
    </span>
  );
}

function Message({ msg }) {
  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
        <div style={{ maxWidth: "80%", padding: "0.55rem 0.9rem", background: "var(--rm-teal)", color: "#fff", borderRadius: "14px 14px 4px 14px", fontSize: "1.1rem", lineHeight: 1.45 }}>
          <MessageText text={msg.content} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end", marginBottom: "0.75rem" }}>
      <TutorAvatar />
      <div style={{ maxWidth: "85%", padding: "0.55rem 0.9rem", background: "#fff", border: "1.5px solid var(--rm-teal-soft)", borderRadius: "14px 14px 14px 4px", fontSize: "1.1rem", lineHeight: 1.45, color: "var(--rm-ink)" }}>
        {msg.hint && (
          <span className="learn-pill" style={{ display: "inline-block", marginBottom: "0.3rem" }}>
            <i className="bi bi-lightbulb" aria-hidden="true" /> Hint {msg.hint}
          </span>
        )}
        <div>
          <MessageText text={msg.content} />
        </div>
      </div>
    </div>
  );
}

const iconButton = { background: "none", border: "none", padding: "0.25rem", lineHeight: 1, fontSize: "1.2rem", color: "var(--rm-ink)", cursor: "pointer" };
const chip = { background: "var(--rm-teal-wash)", border: "1.5px solid var(--rm-teal-soft)", borderRadius: "999px", padding: "0.25rem 0.75rem", fontSize: "0.95rem", color: "var(--rm-teal-deep)", cursor: "pointer" };

export default function MyTutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "chats" | "help"
  const [currentUrl, setCurrentUrl] = useState("");
  const [validUrl, setValidUrl] = useState(false);

  const [currentConversation, setCurrentConversation] = useState([]);
  const [chatTitle, setChatTitle] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const pathname = usePathname();
  const params = useParams();
  const { user } = useUser();
  const [askTutor] = useAskTutorMutation();
  const messagesRef = useRef(null);

  //zustand hooks
  const lesson = useLessonStore((state) => state.lesson);
  const tasks = useLessonStore((state) => state.tasks);

  useEffect(() => {
    const lastParam = pathname.split("/").pop();
    setCurrentUrl(lastParam);
    // the tutor knows the page only on a lesson or question; add keys here as more pages get it
    const acceptedUrlKeys = ["lessonDisplay", "title"];
    const onPage = acceptedUrlKeys.includes(Object.keys(params).pop());
    setValidUrl(onPage);
    setChatTitle(onPage ? urlToTitle(lastParam) : "New chat");
    setCurrentConversation(lastParam === DEMO.slug ? DEMO.messages : []);
    setActiveTab("chat");
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep the newest message in view (no smooth scrolling)
  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [currentConversation, isTyping, isOpen, activeTab]);

  const handleNewChat = () => {
    setCurrentConversation([]);
    setChatTitle(validUrl ? urlToTitle(currentUrl) : "New chat");
    setActiveTab("chat");
  };

  const handleLoadChat = (chat) => {
    setCurrentConversation(chat.messages);
    setChatTitle(chat.title);
    setActiveTab("chat");
  };

  const handleSendMessage = async (text = userInput) => {
    if (!text.trim() || isTyping) return;
    const userMsg = { role: "user", content: text.trim() };
    const latestConversation = [...currentConversation, userMsg];
    setCurrentConversation(latestConversation);
    setUserInput("");
    setIsTyping(true);

    //Add a if statement, that checks if were on a lessonRoute, if so include the lessonContext
    const promptData = { id: user?.id, title: chatTitle, currentUrl, latestConversation, lessonContext: { lesson, tasks } };
    await askTutor(promptData);

    // the API doesn't reply yet, so show a stock hint
    setTimeout(() => {
      setCurrentConversation((prev) => [...prev, STOCK_REPLY]);
      setIsTyping(false);
    }, 1200);
  };

  const tab = (id, label) => (
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === id}
      onClick={() => setActiveTab(id)}
      style={{
        background: "none",
        border: "none",
        padding: "0.5rem 0 0.4rem",
        fontSize: "1.05rem",
        cursor: "pointer",
        color: activeTab === id ? "var(--rm-teal-deep)" : "var(--rm-ink-faint)",
        fontWeight: activeTab === id ? "bold" : "normal",
        borderBottom: activeTab === id ? "2px solid var(--rm-teal)" : "2px solid transparent",
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close the tutor" : "Open the tutor"}
        aria-expanded={isOpen}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          width: "60px",
          height: "60px",
          padding: 0,
          borderRadius: "50%",
          border: "2px solid var(--rm-ink)",
          boxShadow: "var(--rm-lift-sm)",
          background: "var(--rm-teal)",
          color: "#fff",
          fontSize: "1.6rem",
          cursor: "pointer",
        }}
      >
        <i className={`bi ${isOpen ? "bi-x-lg" : "bi-mortarboard-fill"}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <section
          aria-label="RadixMaths tutor"
          style={{
            position: "fixed",
            bottom: "96px",
            right: "20px",
            zIndex: 9999,
            width: isExpanded ? "min(720px, calc(100vw - 40px))" : "min(400px, calc(100vw - 40px))",
            height: isExpanded ? "min(760px, calc(100dvh - 120px))" : "min(600px, calc(100dvh - 120px))",
            display: "flex",
            flexDirection: "column",
            background: "var(--rm-paper)",
            border: "2px solid var(--rm-ink)",
            borderRadius: "14px",
            boxShadow: "var(--rm-lift)",
            overflow: "hidden",
            fontFamily: "var(--rm-body)",
            color: "var(--rm-ink)",
          }}
        >
          {/* header: who it is, what it's helping with, expand and close */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.75rem 1rem", background: "var(--rm-teal-wash)", borderBottom: "2px solid var(--rm-ink)" }}>
            <TutorAvatar size="2.4rem" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--rm-display)", fontSize: "1.35rem", lineHeight: 1.1 }}>RadixMaths Tutor</div>
              <div style={{ fontSize: "0.95rem", color: "var(--rm-ink-soft)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {validUrl ? (
                  <>
                    Helping with <strong>{urlToTitle(currentUrl)}</strong>
                    {currentUrl === DEMO.slug && ` · ${DEMO.part}`}
                  </>
                ) : (
                  "Hints whenever you're stuck"
                )}
              </div>
            </div>
            <button type="button" onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? "Make smaller" : "Make bigger"} style={iconButton}>
              <i className={`bi ${isExpanded ? "bi-arrows-angle-contract" : "bi-arrows-angle-expand"}`} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close the tutor" style={iconButton}>
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          </div>

          {/* tabs, with New chat on the right */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.1rem", padding: "0 1rem", borderBottom: "1px solid #e6e2da" }}>
            <div role="tablist" aria-label="Tutor" style={{ display: "flex", gap: "1.1rem" }}>
              {tab("chat", "Chat")}
              {tab("chats", "Previous chats")}
              {tab("help", "Help")}
            </div>
            <button type="button" onClick={handleNewChat} style={{ ...iconButton, marginLeft: "auto", fontSize: "1rem", color: "var(--rm-teal-deep)" }}>
              <i className="bi bi-plus-lg" aria-hidden="true" /> New chat
            </button>
          </div>

          {activeTab === "chat" && (
            <>
              <div ref={messagesRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "1rem" }}>
                {currentConversation.length === 0 ? (
                  <div>
                    <h3 style={{ fontFamily: "var(--rm-display)", fontSize: "1.5rem", margin: "0.25rem 0 0.5rem" }}>Hi {user?.firstName ?? "there"} 👋</h3>
                    <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                      I&apos;m your RadixMaths tutor. I&apos;ll give you hints and nudges rather than just the answer, so you can do the next step yourself.
                    </p>
                    <p style={{ fontSize: "0.95rem", color: "var(--rm-ink-faint)", marginBottom: "0.5rem" }}>Try asking:</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {(validUrl ? [`Give me a hint for ${urlToTitle(currentUrl)}`, ...SUGGESTIONS] : SUGGESTIONS).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSendMessage(s)}
                          style={{ textAlign: "left", background: "#fff", border: "1.5px solid var(--rm-teal-soft)", borderRadius: "10px", padding: "0.55rem 0.8rem", fontSize: "1.02rem", color: "var(--rm-ink)", cursor: "pointer" }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--rm-ink-faint)", marginBottom: "0.75rem" }}>{chatTitle}</div>
                    {currentConversation.map((msg, idx) => (
                      <Message key={idx} msg={msg} />
                    ))}
                    {isTyping && (
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: "var(--rm-ink-faint)", fontSize: "1rem" }}>
                        <TutorAvatar /> Thinking…
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* quick replies, the message box and a reminder of what it does */}
              <div style={{ padding: "0.6rem 1rem 0.75rem", borderTop: "1px solid #e6e2da", background: "#fff" }}>
                {currentConversation.length > 0 && (
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    {QUICK_REPLIES.map((q) => (
                      <button key={q} type="button" onClick={() => handleSendMessage(q)} style={chip}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
                  <textarea
                    rows={1}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask for a hint… (use $x^2$ for maths)"
                    aria-label="Message the tutor"
                    style={{ flex: 1, resize: "none", padding: "0.5rem 0.75rem", border: "1.5px solid #ced4da", borderRadius: "10px", fontSize: "1.05rem", fontFamily: "inherit" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    aria-label="Send"
                    disabled={!userInput.trim() || isTyping}
                    style={{ flexShrink: 0, width: "2.6rem", height: "2.6rem", borderRadius: "50%", border: "none", background: userInput.trim() ? "var(--rm-teal)" : "var(--rm-teal-soft)", color: "#fff", fontSize: "1.1rem", cursor: "pointer" }}
                  >
                    <i className="bi bi-send-fill" aria-hidden="true" />
                  </button>
                </div>
                <div style={{ marginTop: "0.4rem", fontSize: "0.85rem", color: "var(--rm-ink-faint)" }}>Hints, not answers. The tutor can make mistakes, so check with the model solution.</div>
              </div>
            </>
          )}

          {activeTab === "chats" && (
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "1rem" }}>
              {PREVIOUS_CHATS.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => handleLoadChat(chat)}
                  style={{ display: "block", width: "100%", textAlign: "left", background: "#fff", border: "1.5px solid var(--rm-teal-soft)", borderRadius: "10px", padding: "0.65rem 0.9rem", marginBottom: "0.6rem", cursor: "pointer", color: "var(--rm-ink)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                    <strong style={{ fontSize: "1.08rem" }}>{chat.title}</strong>
                    <span style={{ fontSize: "0.9rem", color: "var(--rm-ink-faint)", flexShrink: 0 }}>{chat.ago}</span>
                  </div>
                  <div style={{ fontSize: "0.98rem", color: "var(--rm-ink-soft)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <MessageText text={chat.messages[0].content} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === "help" && (
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "1rem" }}>
              {HELP.map(([q, a]) => (
                <div key={q} style={{ marginBottom: "0.9rem" }}>
                  <strong style={{ fontSize: "1.08rem", color: "var(--rm-teal-deep)" }}>{q}</strong>
                  <p style={{ margin: "0.15rem 0 0", fontSize: "1.02rem" }}>{a}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
