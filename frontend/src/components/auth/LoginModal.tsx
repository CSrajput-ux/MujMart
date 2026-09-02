"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/DemoContext";
import { signIn } from "next-auth/react";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { enterDemoMode } = useDemo();
  const router = useRouter();

  const handleDemoLogin = (role: "customer" | "admin") => {
    enterDemoMode(role);
    onClose();
    if (role === "admin") {
      router.push("/admin");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err: any) {
      console.error("Google login error:", err);
      setError("Failed to sign in with Google.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        name: isLogin ? undefined : name,
        isRegister: isLogin ? "false" : "true",
      });

      if (res?.error) {
        setError(res.error);
      } else {
        onClose();
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #F0DDD4",
    borderRadius: 10,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    color: "#1A0A00",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
          padding: "40px 32px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        className="hide-scrollbar"
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#6B7280", lineHeight: 1 }}
        >
          ×
        </button>

        <div style={{ width: "100%" }}>
          {/* Logo */}
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

          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: "#1A0A00", margin: "0 0 4px 0", textAlign: "center" }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "0 0 24px 0", textAlign: "center", lineHeight: 1.4 }}>
            {isLogin ? "Sign in to your MUJ campus account." : "Enter your details to create an account."}
          </p>

          {/* Error */}
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "#B91C1C", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>⚠️ {error}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#fff",
              color: "#1A0A00",
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              border: "1px solid #E5E7EB",
              cursor: loading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 20,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#F9FAFB")}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#fff")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.72 18.23 13.47 18.63 12 18.63C9.15 18.63 6.74 16.71 5.88 14.13H2.21V16.98C4.01 20.56 7.69 23 12 23Z" fill="#34A853"/>
              <path d="M5.88 14.13C5.66 13.47 5.53 12.76 5.53 12C5.53 11.24 5.66 10.53 5.88 9.87V7.02H2.21C1.47 8.5 1 10.2 1 12C1 13.8 1.47 15.5 2.21 16.98L5.88 14.13Z" fill="#FBBC05"/>
              <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.35 3.87C17.46 2.11 14.97 1 12 1C7.69 1 4.01 3.44 2.21 7.02L5.88 9.87C6.74 7.29 9.15 5.38 12 5.38Z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
          
          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ padding: "0 10px", fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            {!isLogin && (
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required={!isLogin}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#E8521A")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#F0DDD4")}
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isLogin ? "you@example.com" : "yourname@example.com"}
                required
                style={inputStyle}
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
                placeholder={isLogin ? "Enter your password" : "Min. 6 characters"}
                required
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#E8521A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#F0DDD4")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading ? "#F0DDD4" : "#E8521A",
                color: "#fff",
                borderRadius: 10,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: loading ? "wait" : "pointer",
                transition: "background 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#FF6B35")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#E8521A")}
            >
              {loading && <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "0 0 24px 0" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              style={{ color: "#E8521A", fontWeight: 600, border: "none", background: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif" }}
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </p>


        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
