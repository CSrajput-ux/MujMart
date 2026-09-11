"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/marketplace/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { authApi, listingsApi } from "@/lib/api";

export default function SettingsPage() {
  const { user, login } = useAuth();
  const [upiId, setUpiId] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [upiQrUrl, setUpiQrUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [message, setMessage] = useState("");
  const qrInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.upiId) setUpiId(user.upiId);
    if (user?.phone) setPhone(user.phone);
    if (user?.address) setAddress(user.address);
    if (user?.upiQrUrl) setUpiQrUrl(user.upiQrUrl);
  }, [user]);

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploadingQr(true);
    try {
      const res = await listingsApi.uploadImage(e.target.files[0]);
      const fullUrl = res.url.startsWith("http")
        ? res.url
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${res.url}`;
      setUpiQrUrl(fullUrl);
    } catch {
      setMessage("Failed to upload QR code. Please try again.");
    } finally {
      setUploadingQr(false);
      if (qrInputRef.current) qrInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await authApi.updateProfile({ upiId, phone, address, upiQrUrl });
      login(res.user);
      setMessage("Settings saved successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setMessage(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
        <Navbar />
        <div style={{ padding: "100px 20px", textAlign: "center", color: "#6B7280" }}>
          Please sign in to view settings.
        </div>
      </main>
    );
  }

  // Profile completion check
  const hasPhone = !!(user.phone);
  const hasAddress = !!(user.address);
  const hasUpi = !!(user.upiId || user.upiQrUrl);
  const isProfileComplete = hasPhone && hasAddress && hasUpi;
  const completedCount = [hasPhone, hasAddress, hasUpi].filter(Boolean).length;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "#1A0A00",
    boxSizing: "border-box",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />
      <div style={{ maxWidth: 620, margin: "60px auto", padding: "0 20px 80px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#1A0A00", marginBottom: 8 }}>
          Settings
        </h1>
        <p style={{ color: "#6B7280", marginBottom: 28, fontFamily: "'DM Sans', sans-serif" }}>
          Manage your account preferences and payout methods.
        </p>

        {/* ── Profile Completion Banner ── */}
        <div style={{
          background: isProfileComplete ? "linear-gradient(135deg, #DCFCE7, #BBF7D0)" : "linear-gradient(135deg, #FFF7ED, #FED7AA)",
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: 24,
          border: `1px solid ${isProfileComplete ? "#86EFAC" : "#FDBA74"}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 24 }}>{isProfileComplete ? "✅" : "⚠️"}</span>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: isProfileComplete ? "#15803D" : "#92400E", margin: 0 }}>
                {isProfileComplete ? "Profile Complete — You can post listings!" : `Profile ${completedCount}/3 complete`}
              </p>
              {!isProfileComplete && (
                <p style={{ fontSize: 12, color: "#B45309", fontFamily: "'DM Sans', sans-serif", margin: "2px 0 0 0" }}>
                  Complete your profile to start listing items for sale.
                </p>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { done: hasPhone, label: "📱 Mobile Number" },
              { done: hasAddress, label: "🏠 Address" },
              { done: hasUpi, label: "💳 UPI / QR" },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 50,
                background: item.done ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)",
                border: `1px solid ${item.done ? "#86EFAC" : "#FCA5A5"}`,
                fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                color: item.done ? "#15803D" : "#B91C1C", fontWeight: 600,
              }}>
                <span style={{ fontSize: 14 }}>{item.done ? "✓" : "✗"}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Form Card ── */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #F0DDD4", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#1A0A00", marginBottom: 24 }}>
            Payout & Contact Details
          </h2>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 22 }}>

            {/* Phone */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#4B5563", marginBottom: 8, textTransform: "uppercase" }}>
                📱 Phone Number
                {!hasPhone && <span style={{ fontSize: 10, padding: "2px 8px", background: "#FEF3C7", color: "#D97706", borderRadius: 50, fontWeight: 600, textTransform: "none" }}>Required</span>}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99999 99999"
                style={inputStyle}
              />
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>
                Used for delivery coordination with buyers.
              </p>
            </div>

            {/* Address */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#4B5563", marginBottom: 8, textTransform: "uppercase" }}>
                🏠 Current Address
                {!hasAddress && <span style={{ fontSize: 10, padding: "2px 8px", background: "#FEF3C7", color: "#D97706", borderRadius: 50, fontWeight: 600, textTransform: "none" }}>Required</span>}
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Hostel A, Room 203, MUJ Campus, Jaipur"
                rows={3}
                style={{ ...inputStyle, resize: "none" }}
              />
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>
                Your hostel/home address for item pickup or delivery.
              </p>
            </div>

            {/* UPI ID */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#4B5563", marginBottom: 8, textTransform: "uppercase" }}>
                💳 UPI ID
                {!hasUpi && <span style={{ fontSize: 10, padding: "2px 8px", background: "#FEF3C7", color: "#D97706", borderRadius: 50, fontWeight: 600, textTransform: "none" }}>Required (UPI or QR)</span>}
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. yourname@oksbi"
                style={inputStyle}
              />
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>
                You'll receive payment here when buyers purchase via Escrow.
              </p>
            </div>

            {/* UPI QR */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#4B5563", marginBottom: 8, textTransform: "uppercase" }}>
                📷 UPI QR Code
                <span style={{ fontSize: 10, padding: "2px 8px", background: "#F3F4F6", color: "#6B7280", borderRadius: 50, fontWeight: 600, textTransform: "none" }}>
                  Optional if UPI ID filled
                </span>
              </label>
              <input type="file" ref={qrInputRef} accept="image/*" onChange={handleQrUpload} style={{ display: "none" }} />

              {upiQrUrl ? (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ position: "relative", width: 120, height: 120, borderRadius: 12, overflow: "hidden", border: "2px solid #E8521A", flexShrink: 0 }}>
                    <img src={upiQrUrl} alt="UPI QR Code" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <p style={{ fontSize: 13, color: "#15803D", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                      ✅ QR code uploaded
                    </p>
                    <button
                      type="button"
                      onClick={() => qrInputRef.current?.click()}
                      disabled={uploadingQr}
                      style={{ padding: "8px 16px", background: "#FFF0EA", border: "1px solid #E8521A", color: "#E8521A", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {uploadingQr ? "Uploading…" : "Replace QR"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiQrUrl("")}
                      style={{ padding: "8px 16px", background: "#FEE2E2", border: "1px solid #FCA5A5", color: "#B91C1C", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Remove QR
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => qrInputRef.current?.click()}
                  disabled={uploadingQr}
                  style={{
                    width: "100%", padding: "18px", borderRadius: 12,
                    border: "2px dashed #F0DDD4", background: uploadingQr ? "#F9FAFB" : "#FFFBF9",
                    cursor: uploadingQr ? "wait" : "pointer", textAlign: "center",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => !uploadingQr && (e.currentTarget.style.borderColor = "#E8521A")}
                  onMouseLeave={(e) => !uploadingQr && (e.currentTarget.style.borderColor = "#F0DDD4")}
                >
                  <span style={{ fontSize: 28 }}>{uploadingQr ? "⏳" : "📷"}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, color: "#1A0A00", margin: "8px 0 4px" }}>
                    {uploadingQr ? "Uploading QR code..." : "Upload UPI QR Code"}
                  </p>
                  <p style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                    PNG or JPG · Screenshot of your GPay / PhonePe / Paytm QR
                  </p>
                </button>
              )}
            </div>

            {/* Message */}
            {message && (
              <div style={{
                padding: 14, borderRadius: 10,
                background: message.includes("success") ? "#DCFCE7" : "#FEE2E2",
                color: message.includes("success") ? "#15803D" : "#B91C1C",
                fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "13px 28px", background: saving ? "#F3F4F6" : "#E8521A",
                color: saving ? "#9CA3AF" : "#fff", border: "none", borderRadius: 50,
                fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "'Syne', sans-serif", fontSize: 14, transition: "background 0.2s",
              }}
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
