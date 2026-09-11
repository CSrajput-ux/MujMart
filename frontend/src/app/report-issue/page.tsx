"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/marketplace/Navbar";
import { listingsApi } from "@/lib/api";

const WHATSAPP_NUMBER = "917579948087";
const EMAIL = "csjadon5@gmail.com";

export default function ReportIssuePage() {
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitMethod, setSubmitMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const res = await listingsApi.uploadImage(file);
      const url = res.url.startsWith("http")
        ? res.url
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${res.url}`;
      setFileUrl(url);
      setFileName(file.name);
    } catch {
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please describe your issue before submitting.");
      return;
    }

    const fullMsg = fileUrl
      ? `${message}\n\nAttachment: ${fileUrl}`
      : message;

    if (submitMethod === "whatsapp") {
      const waMsg = encodeURIComponent(`🐛 MUJMart Issue Report\n\n${fullMsg}`);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`, "_blank");
    } else {
      const subject = encodeURIComponent("MUJMart Issue Report");
      const body = encodeURIComponent(`Hi MUJMart Team,\n\nI'd like to report an issue:\n\n${fullMsg}\n\nThanks`);
      window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`, "_blank");
    }
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    color: "#1A0A00",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)",
          borderBottom: "1px solid #FECACA",
          padding: "56px 24px 48px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🐛</div>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 32,
            color: "#1A0A00",
            margin: "0 0 12px",
          }}
        >
          Report an Issue
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            color: "#6B7280",
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Found a bug or problem? Describe it below, attach a screenshot or video, and send it to us directly.
        </p>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 24px 80px" }}>
        {submitted ? (
          // Success state
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: "0 0 12px" }}>
              Report Sent!
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>
              Thank you for reporting this issue. We'll look into it and get back to you soon.
            </p>
            <button
              onClick={() => { setSubmitted(false); setMessage(""); setFileUrl(""); setFileName(""); }}
              style={{ padding: "12px 28px", background: "#E8521A", color: "#fff", border: "none", borderRadius: 50, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              Report Another Issue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Message */}
            <div>
              <label style={{ display: "block", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#1A0A00", marginBottom: 8, textTransform: "uppercase" }}>
                📝 Describe the Issue <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What happened? What did you expect? Include as much detail as possible..."
                rows={6}
                style={{ ...inputStyle, resize: "vertical" }}
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label style={{ display: "block", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#1A0A00", marginBottom: 8, textTransform: "uppercase" }}>
                📎 Attach Screenshot or Video
                <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400, textTransform: "none", marginLeft: 8 }}>
                  (Optional but helpful)
                </span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*,.png,.jpg,.jpeg,.gif,.webp,.mp4,.mov,.webm"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />

              {fileUrl ? (
                // Preview
                <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: "16px 20px", background: "#F9FAFB", display: "flex", alignItems: "center", gap: 14 }}>
                  {fileUrl.match(/\.(mp4|mov|webm)$/i) ? (
                    <video src={fileUrl} style={{ width: 80, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} muted />
                  ) : (
                    <img src={fileUrl} alt="Preview" style={{ width: 80, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#1A0A00", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      ✅ {fileName}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6B7280", margin: 0 }}>
                      File uploaded successfully
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFileUrl(""); setFileName(""); }}
                    style={{ background: "#FEE2E2", border: "none", color: "#B91C1C", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    width: "100%", padding: "24px", borderRadius: 12,
                    border: "2px dashed #E5E7EB", background: uploading ? "#F9FAFB" : "#fff",
                    cursor: uploading ? "wait" : "pointer", textAlign: "center",
                    boxSizing: "border-box",
                  }}
                  className="upload-drop"
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{uploading ? "⏳" : "📸"}</div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, color: "#1A0A00", margin: "0 0 4px" }}>
                    {uploading ? "Uploading..." : "Click to upload screenshot or video"}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9CA3AF", margin: 0 }}>
                    PNG, JPG, GIF, MP4, MOV · Max 10MB
                  </p>
                </button>
              )}
            </div>

            {/* Submit Method Toggle */}
            <div>
              <label style={{ display: "block", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#1A0A00", marginBottom: 10, textTransform: "uppercase" }}>
                📤 Send Via
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { id: "whatsapp", label: "WhatsApp", emoji: "💬", desc: "+91 75799 48087" },
                  { id: "email", label: "Email", emoji: "📧", desc: EMAIL },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSubmitMethod(opt.id as "whatsapp" | "email")}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: `2px solid ${submitMethod === opt.id ? "#E8521A" : "#E5E7EB"}`,
                      background: submitMethod === opt.id ? "#FFF0EA" : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 20, display: "block", marginBottom: 4 }}>{opt.emoji}</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: submitMethod === opt.id ? "#E8521A" : "#1A0A00", display: "block" }}>
                      {opt.label}
                    </span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#6B7280" }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={uploading || !message.trim()}
              style={{
                padding: "14px",
                background: uploading || !message.trim() ? "#F3F4F6" : "#E8521A",
                color: uploading || !message.trim() ? "#9CA3AF" : "#fff",
                border: "none",
                borderRadius: 50,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                cursor: uploading || !message.trim() ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: uploading || !message.trim() ? "none" : "0 4px 16px rgba(232,82,26,0.3)",
              }}
            >
              {submitMethod === "whatsapp" ? "💬 Send via WhatsApp" : "📧 Send via Email"}
            </button>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9CA3AF", textAlign: "center", margin: 0 }}>
              Clicking submit will open {submitMethod === "whatsapp" ? "WhatsApp" : "your email app"} with your report pre-filled.
            </p>
          </form>
        )}
      </div>

      <style>{`
        .upload-drop:hover {
          border-color: #E8521A !important;
          background: #FFFBF9 !important;
        }
      `}</style>
    </main>
  );
}
