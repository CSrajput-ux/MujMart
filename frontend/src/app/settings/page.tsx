"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/marketplace/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { authApi } from "@/lib/api";

export default function SettingsPage() {
  const { user, login } = useAuth();
  const [upiId, setUpiId] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.upiId) {
      setUpiId(user.upiId);
    }
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage("");
    
    try {
      const res = await authApi.updateProfile({ upiId, phone });
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
        <div style={{ padding: "100px 20px", textAlign: "center", color: "#6B7280" }}>Please sign in to view settings.</div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />
      
      <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 20px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#1A0A00", marginBottom: 8 }}>Settings</h1>
        <p style={{ color: "#6B7280", marginBottom: 32 }}>Manage your account preferences and payout methods.</p>
        
        <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #F0DDD4", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#1A0A00", marginBottom: 20 }}>Payout Details</h2>
          
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#4B5563", marginBottom: 8, textTransform: "uppercase" }}>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99999 99999"
                style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #E5E7EB", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
              />
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>
                Your phone number will be used for delivery coordination.
              </p>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#4B5563", marginBottom: 8, textTransform: "uppercase" }}>Your UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. yourname@oksbi"
                style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #E5E7EB", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
              />
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>
                This is where you will receive money when someone buys your items via Escrow.
              </p>
            </div>
            
            {message && (
              <div style={{ marginBottom: 20, padding: 12, borderRadius: 8, background: message.includes("success") ? "#DCFCE7" : "#FEE2E2", color: message.includes("success") ? "#15803D" : "#B91C1C", fontSize: 14, fontWeight: 600 }}>
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={saving}
              style={{ padding: "12px 24px", background: saving ? "#F3F4F6" : "#E8521A", color: saving ? "#9CA3AF" : "#fff", border: "none", borderRadius: 50, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
