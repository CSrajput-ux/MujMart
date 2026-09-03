"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/marketplace/Navbar";
import { notificationsApi, requestsApi, type Notification, type ProjectRequest } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [notifRes, reqRes] = await Promise.all([
          notificationsApi.list(),
          requestsApi.incoming()
        ]);
        setNotifications(notifRes);
        setRequests(reqRes);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleAcceptRequest = async (id: string) => {
    try {
      await requestsApi.updateStatus(id, "accepted");
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "accepted" } : r));
      alert("Hired successfully! The task has been assigned.");
    } catch (err: any) {
      alert(err.message || "Failed to hire user");
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
        <Navbar />
        <div style={{ padding: "120px 24px", textAlign: "center", color: "#6B7280" }}>Please log in to view notifications</div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px 64px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", marginBottom: 24 }}>Notifications</h1>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6B7280" }}>Loading...</div>
          ) : notifications.length === 0 && requests.length === 0 ? (
            <div style={{ background: "#fff", padding: 48, borderRadius: 16, border: "1px solid #F0DDD4", textAlign: "center" }}>
              <span style={{ fontSize: 32, display: "block", marginBottom: 16 }}>📭</span>
              <p style={{ color: "#6B7280", margin: 0 }}>You have no notifications yet.</p>
            </div>
          ) : (
            <>
              {/* Project Requests Section */}
              {requests.filter(r => r.status === "pending").length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: "#1A0A00", marginBottom: 12 }}>Pending Requests</h2>
                  {requests.filter(r => r.status === "pending").map(req => (
                    <div key={req.id} style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #E8521A", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ margin: "0 0 4px 0", fontWeight: 500, color: "#1A0A00" }}>
                          <a href={`/profile/${req.requester?.id}`} style={{ color: "#3B82F6", textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}>
                            {req.requester?.alias || req.requester?.name}
                          </a> applied for task:
                        </p>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{req.listing?.title}</p>
                      </div>
                      <button onClick={() => handleAcceptRequest(req.id)} style={{ padding: "8px 16px", background: "#10B981", color: "#fff", borderRadius: 50, border: "none", fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")} onMouseLeave={(e) => (e.currentTarget.style.background = "#10B981")}>
                        Hire
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* General Notifications Section */}
              {notifications.map(notif => (
                <div key={notif.id} onClick={() => !notif.isRead && handleMarkRead(notif.id)} style={{ background: notif.isRead ? "#F9FAFB" : "#fff", padding: 20, borderRadius: 12, border: "1px solid #F0DDD4", display: "flex", alignItems: "flex-start", gap: 12, cursor: notif.isRead ? "default" : "pointer", opacity: notif.isRead ? 0.7 : 1 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: notif.isRead ? "transparent" : "#E8521A", marginTop: 6 }} />
                  <div>
                    <p style={{ margin: "0 0 4px 0", color: "#1A0A00" }}>{notif.content}</p>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>{new Date(notif.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
