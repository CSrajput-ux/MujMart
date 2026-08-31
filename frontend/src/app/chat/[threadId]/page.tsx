"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/marketplace/Navbar";
import { threadsApi, type Thread, type ChatMessage } from "@/lib/api";
import { useDemo } from "@/lib/DemoContext";

// Mock socket for demo mode
let mockMessages: ChatMessage[] = [];

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const BUYER_ALIASES = ["🐻 Bear", "🐼 Panda", "🦊 Fox", "🐺 Wolf"];
const SELLER_ALIASES = ["🦅 Eagle", "🦉 Owl", "🦜 Parrot", "🦁 Lion"];

function getAlias(role: "buyer" | "seller", threadId: string): string {
  const hash = threadId.charCodeAt(0) % 4;
  return role === "buyer" ? BUYER_ALIASES[hash] : SELLER_ALIASES[hash];
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = params?.threadId as string;
  const { isDemo, demoUser } = useDemo();

  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [myRole, setMyRole] = useState<"buyer" | "seller">("buyer");
  const [dealStatus, setDealStatus] = useState<string>("open");
  const [isTyping, setIsTyping] = useState(false);
  const [filterWarning, setFilterWarning] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const myAlias = getAlias(myRole, threadId || "default");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    async function load() {
      try {
        if (isDemo) {
          // Demo mode: use mock thread
          setThread({
            id: threadId,
            listingId: "1",
            buyerId: "buyer1",
            sellerId: "seller1",
            status: "open",
            createdAt: new Date().toISOString(),
            myRole: "buyer",
            listing: { title: "Sony WH-1000XM4 Headphones", price: 12500 },
            buyer: { alias: "Demo Student" },
            seller: { alias: "TechGuru42" },
          });
          setMyRole("buyer");
          setDealStatus("open");

          // Load demo messages
          if (mockMessages.length === 0) {
            mockMessages = [
              {
                id: "m1",
                content: "Hi! Is this still available?",
                isFiltered: false,
                createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
                role: "buyer",
                isMe: true,
              },
              {
                id: "m2",
                content: "Yes it is! Would you take ₹11,500?",
                isFiltered: false,
                createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
                role: "seller",
                isMe: false,
              },
            ];
          }
          setMessages([...mockMessages]);
        } else {
          const [threadData, messagesData] = await Promise.all([
            threadsApi.get(threadId),
            threadsApi.messages(threadId),
          ]);
          setThread(threadData.thread);
          setMyRole(threadData.thread.myRole || "buyer");
          setDealStatus(threadData.thread.status);
          setMessages(messagesData.messages);
        }
      } catch (e) {
        console.error("Load chat error:", e);
        // Demo fallback
        setThread({
          id: threadId,
          listingId: "1",
          buyerId: "b1",
          sellerId: "s1",
          status: "open",
          createdAt: new Date().toISOString(),
          myRole: "buyer",
          listing: { title: "Campus Item", price: 0 },
        });
        setMyRole("buyer");
        setDealStatus("open");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    if (threadId) load();
  }, [threadId, isDemo]);

  const handleSend = async () => {
    if (!input.trim() || sending || dealStatus === "closed" || dealStatus === "rejected") return;

    const content = input.trim();
    setSending(true);
    setInput("");

    // Content filter check (client-side preview)
    const blocked = /(\+?\d[\s\-.]?){9,13}\d|@[a-zA-Z0-9._]{1,30}\s|whatsapp/i.test(content);

    if (blocked) {
      setFilterWarning("⚠️ Message contained contact info and was filtered. Keep negotiations on MUJMart!");
      setTimeout(() => setFilterWarning(""), 4000);
    }

    const newMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: blocked ? content.replace(/(\+?\d[\s\-.]?){9,13}\d|@[a-zA-Z0-9._]{1,30}|whatsapp/gi, "[BLOCKED]") : content,
      isFiltered: blocked,
      createdAt: new Date().toISOString(),
      role: myRole,
      isMe: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    mockMessages.push(newMsg);

    // Simulate seller reply in demo after delay
    if (isDemo && myRole === "buyer") {
      setTimeout(() => {
        const replies = [
          "That sounds fair! When can we meet?",
          "I can do that. How about tomorrow at the library?",
          "Deal! Let's finalize at the cafeteria.",
          "Sure, please accept and we can meet in Block C.",
        ];
        const reply: ChatMessage = {
          id: `temp-${Date.now()}-r`,
          content: replies[Math.floor(Math.random() * replies.length)],
          isFiltered: false,
          createdAt: new Date().toISOString(),
          role: "seller",
          isMe: false,
        };
        setMessages((prev) => [...prev, reply]);
        mockMessages.push(reply);
      }, 1500);
    }

    setSending(false);
    inputRef.current?.focus();
  };

  const handleDealAction = async (action: "accepted" | "rejected") => {
    try {
      if (!isDemo) {
        await threadsApi.updateStatus(threadId, action);
      }
      setDealStatus(action);
      const statusMsg: ChatMessage = {
        id: `status-${Date.now()}`,
        content: action === "accepted"
          ? "✅ Deal accepted! Please meet in a safe campus area to complete the exchange."
          : "❌ Deal declined.",
        isFiltered: false,
        createdAt: new Date().toISOString(),
        role: myRole,
        isMe: true,
      };
      setMessages((prev) => [...prev, statusMsg]);
    } catch (e) {
      console.error("Deal action error:", e);
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "70vh" }}>
          <div style={{ width: 36, height: 36, border: "3px solid #E8521A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </main>
    );
  }

  const isClosed = dealStatus === "closed" || dealStatus === "rejected" || dealStatus === "accepted";

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ maxWidth: 760, margin: "0 auto", width: "100%", padding: "24px 16px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0DDD4", padding: "16px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#E8521A", padding: 4 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A0A00", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {thread?.listing?.title || "Negotiation"}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
              <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                You are: <strong style={{ color: "#E8521A" }}>{myAlias}</strong>
              </span>
              <span style={{ padding: "2px 8px", borderRadius: 50, fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", background: dealStatus === "accepted" ? "#DCFCE7" : dealStatus === "rejected" ? "#FEE2E2" : dealStatus === "open" ? "#FFF0EA" : "#F3F4F6", color: dealStatus === "accepted" ? "#15803D" : dealStatus === "rejected" ? "#B91C1C" : dealStatus === "open" ? "#E8521A" : "#6B7280" }}>
                {dealStatus.toUpperCase()}
              </span>
            </div>
          </div>
          {thread?.listing?.price !== undefined && thread.listing.price > 0 && (
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#E8521A", margin: 0 }}>
                ₹{thread.listing.price.toLocaleString("en-IN")}
              </p>
              <p style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>Listed price</p>
            </div>
          )}
        </div>

        {/* Content filter warning */}
        {filterWarning && (
          <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 16px", marginBottom: 10 }}>
            <p style={{ fontSize: 12, color: "#92400E", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{filterWarning}</p>
          </div>
        )}

        {/* Privacy notice */}
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "10px 16px", marginBottom: 12, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#1D4ED8", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
            🔒 Identities are anonymous. Sharing phone numbers or external handles is blocked.
          </p>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #F0DDD4",
            padding: 20,
            marginBottom: 12,
            minHeight: 320,
            maxHeight: 480,
          }}
        >
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                Start the conversation! Introduce yourself anonymously.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: msg.isMe ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {/* Avatar */}
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.role === "buyer" ? "#FFF0EA" : "#F0F9FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                {msg.role === "buyer" ? "🐻" : "🦅"}
              </div>

              <div style={{ maxWidth: "70%" }}>
                {!msg.isMe && (
                  <p style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", margin: "0 0 4px 4px" }}>
                    {getAlias(msg.role, threadId)}
                  </p>
                )}
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: msg.isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.isMe ? "#E8521A" : "#F3F4F6",
                    color: msg.isMe ? "#fff" : "#1A0A00",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                    border: msg.isFiltered ? "1px solid #FDE68A" : "none",
                  }}
                >
                  {msg.content}
                  {msg.isFiltered && (
                    <span style={{ fontSize: 10, display: "block", marginTop: 4, opacity: 0.8 }}>⚠️ filtered</span>
                  )}
                </div>
                <p style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", margin: "4px 4px 0", textAlign: msg.isMe ? "right" : "left" }}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F0F9FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🦅</div>
              <div style={{ padding: "10px 16px", background: "#F3F4F6", borderRadius: "18px 18px 18px 4px", display: "flex", gap: 4, alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#9CA3AF", animation: `bounce 1s infinite ${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Seller deal actions */}
        {myRole === "seller" && dealStatus === "open" && (
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button
              onClick={() => handleDealAction("accepted")}
              style={{ flex: 1, padding: "12px", background: "#22C55E", color: "#fff", border: "none", borderRadius: 50, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              ✅ Accept Deal
            </button>
            <button
              onClick={() => handleDealAction("rejected")}
              style={{ flex: 1, padding: "12px", background: "#fff", color: "#EF4444", border: "1.5px solid #FECACA", borderRadius: 50, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              ❌ Decline
            </button>
          </div>
        )}

        {/* Accepted state */}
        {dealStatus === "accepted" && (
          <div style={{ background: "#DCFCE7", border: "1px solid #BBF7D0", borderRadius: 12, padding: "14px 20px", marginBottom: 12, textAlign: "center" }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#15803D", fontSize: 14, margin: 0 }}>
              🎉 Deal Accepted! Meet in a safe public campus area to complete the exchange.
            </p>
          </div>
        )}

        {/* Input */}
        {!isClosed && (
          <div style={{ display: "flex", gap: 10, paddingBottom: 24, alignItems: "center" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              onFocus={() => setIsTyping(false)}
              placeholder="Type a message... (no contact details)"
              style={{
                flex: 1,
                padding: "12px 18px",
                border: "1.5px solid #F0DDD4",
                borderRadius: 50,
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
                color: "#1A0A00",
                background: "#fff",
                transition: "border-color 0.2s",
              }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = "#E8521A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#F0DDD4")}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: input.trim() ? "#E8521A" : "#F0DDD4",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        {isClosed && dealStatus !== "accepted" && (
          <div style={{ textAlign: "center", paddingBottom: 24 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280", fontSize: 13 }}>
              This conversation is {dealStatus}. <a href="/search" style={{ color: "#E8521A", textDecoration: "none" }}>Browse more listings →</a>
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </main>
  );
}
