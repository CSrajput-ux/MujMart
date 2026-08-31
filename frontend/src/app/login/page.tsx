"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/DemoContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [remember, setRemember] = useState(false);
  const router = useRouter();
  const { enterDemoMode } = useDemo();

  const handleDemoLogin = (role: "customer" | "admin") => {
    enterDemoMode(role);
    router.push(role === "admin" ? "/admin" : "/");
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#FDF8F5" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgba(232, 82, 26, 0.08)",
          padding: "40px 32px",
        }}
        className="login-card"
      >
        <div style={{ width: "100%" }}>
          {/* Logo added to the top of the form since we removed the left panel */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
            <img
              src="/logo.jpg"
              alt="MUJMart Logo"
              style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain", background: "#fff" }}
            />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: "#1A0A00" }}>
              MUJMart
            </span>
          </div>

          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: "#1A0A00", margin: "0 0 4px 0", textAlign: "center" }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "0 0 24px 0", textAlign: "center" }}>
            {isLogin ? "Sign in to your MUJMart account" : "Join the MUJ community marketplace"}
          </p>

          {/* Google OAuth */}
          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "11px 20px",
              border: "1.5px solid #F0DDD4",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              color: "#1A0A00",
              fontFamily: "'DM Sans', sans-serif",
              background: "#fff",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#E8521A"; e.currentTarget.style.background = "#FFF0EA"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#F0DDD4"; e.currentTarget.style.background = "#fff"; }}
          >
            <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#F0DDD4" }} />
            <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
              {isLogin ? "or sign in with email" : "or sign up with email"}
            </span>
            <div style={{ flex: 1, height: 1, background: "#F0DDD4" }} />
          </div>

          {/* Form Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            {!isLogin && (
              <>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #F0DDD4",
                      borderRadius: 10,
                      fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif",
                      outline: "none",
                      transition: "border-color 0.2s",
                      color: "#1A0A00",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#E8521A")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#F0DDD4")}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 99999 99999"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #F0DDD4",
                      borderRadius: 10,
                      fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif",
                      outline: "none",
                      transition: "border-color 0.2s",
                      color: "#1A0A00",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#E8521A")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#F0DDD4")}
                  />
                </div>
              </>
            )}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #F0DDD4",
                  borderRadius: 10,
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                  transition: "border-color 0.2s",
                  color: "#1A0A00",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#E8521A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#F0DDD4")}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #F0DDD4",
                  borderRadius: 10,
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                  transition: "border-color 0.2s",
                  color: "#1A0A00",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#E8521A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#F0DDD4")}
              />
            </div>
          </div>

          {/* Remember + Forgot */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#E8521A", cursor: "pointer" }}
              />
              <span style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                Remember me
              </span>
            </label>
            <a href="#" style={{ fontSize: 13, color: "#E8521A", fontFamily: "'DM Sans', sans-serif", textDecoration: "none", fontWeight: 500 }}>
              Forgot Password?
            </a>
          </div>

          {/* Sign In button */}
          <button
            style={{
              width: "100%",
              padding: "11px",
              background: "#E8521A",
              color: "#fff",
              borderRadius: 10,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#FF6B35"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(232,82,26,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#E8521A"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>

          {/* Create account toggle */}
          <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "14px 0 24px 0" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: "#E8521A", fontWeight: 600, border: "none", background: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif" }}
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </p>


        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .login-card { padding: 32px 24px !important; border-radius: 16px !important; }
        }
      `}</style>
    </main>
  );
}
