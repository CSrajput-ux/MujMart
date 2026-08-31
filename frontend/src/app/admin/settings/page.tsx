"use client";

import React, { useState } from "react";

export default function AdminSettingsPage() {
  const [blockedKeywords, setBlockedKeywords] = useState(
    "drugs, weapons, alcohol, tobacco, gambling"
  );

  const rules = [
    { label: "Require verified email", enabled: true, desc: "Users must verify their email to register" },
    { label: "Auto-moderate listings", enabled: true, desc: "AI checks listings for policy violations" },
    { label: "Anonymous chat by default", enabled: true, desc: "Hide real names in chat" },
    { label: "Allow free listings", enabled: true, desc: "Students can list items for free" },
    { label: "Require rent approval", enabled: true, desc: "Admin approves before rent listing goes live" },
    { label: "Require approval for new listings (Review Mode)", enabled: false, desc: "New products are submitted for review instead of going live instantly" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: 0 }}>
          Settings
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
          Platform rules and configuration
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Platform Rules */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", padding: 24 }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", margin: "0 0 16px 0" }}>
            Platform Rules
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rules.map((rule, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "12px 14px",
                  background: "#F9FAFB",
                  borderRadius: 10,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#1A0A00", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                    {rule.label}
                  </p>
                  <p style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "2px 0 0 0" }}>
                    {rule.desc}
                  </p>
                </div>
                <div
                  style={{
                    width: 42,
                    height: 24,
                    borderRadius: 50,
                    background: rule.enabled ? "#E8521A" : "#E5E7EB",
                    position: "relative",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      left: rule.enabled ? 20 : 2,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                      transition: "left 0.2s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Keywords */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", padding: 24 }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", margin: "0 0 12px 0" }}>
            Blocked Keywords
          </h3>
          <p style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "0 0 12px 0" }}>
            Listings containing these keywords will be auto-flagged for review
          </p>
          <textarea
            value={blockedKeywords}
            onChange={(e) => setBlockedKeywords(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #F0DDD4",
              borderRadius: 10,
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
              resize: "none",
              color: "#1A0A00",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#E8521A")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#F0DDD4")}
          />
          <button
            style={{
              marginTop: 12,
              padding: "8px 20px",
              background: "#E8521A",
              color: "#fff",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FF6B35")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#E8521A")}
          >
            Save Keywords
          </button>
        </div>

        {/* Privacy Policy */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", padding: 24 }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", margin: "0 0 12px 0" }}>
            Privacy Policy
          </h3>
          <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, margin: 0 }}>
            MUJMart collects minimal personal data to facilitate campus
            marketplace transactions. We use your verified email for
            authentication and do not share personal information with third
            parties. All chat messages are encrypted and alias-based to
            protect student identity. Listings data is stored securely and
            can be deleted upon request.
          </p>
          <button
            style={{
              marginTop: 14,
              padding: "8px 20px",
              border: "1px solid #F0DDD4",
              color: "#1A0A00",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#E8521A";
              e.currentTarget.style.color = "#E8521A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#F0DDD4";
              e.currentTarget.style.color = "#1A0A00";
            }}
          >
            Edit Policy
          </button>
        </div>
      </div>
    </div>
  );
}
