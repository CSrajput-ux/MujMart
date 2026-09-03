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
  
  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  const [paying, setPaying] = useState(false);

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

  const handleHireClick = (req: ProjectRequest) => {
    setSelectedRequest(req);
    setPaymentModalOpen(true);
  };

  const processPaymentAndHire = async () => {
    if (!selectedRequest) return;
    setPaying(true);
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await requestsApi.updateStatus(selectedRequest.id, "accepted");
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: "accepted" } : r));
      alert("Payment successful! You have hired the freelancer.");
      setPaymentModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to process payment");
    } finally {
      setPaying(false);
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
                      <button onClick={() => handleHireClick(req)} style={{ padding: "8px 16px", background: "#10B981", color: "#fff", borderRadius: 50, border: "none", fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")} onMouseLeave={(e) => (e.currentTarget.style.background = "#10B981")}>
                        Hire
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* General Notifications Section */}
              {notifications.map(notif => {
                const isAccepted = notif.type === "REQUEST_ACCEPTED" && notif.relatedId;
                
                const NotificationContent = (
                  <div key={notif.id} onClick={() => !notif.isRead && handleMarkRead(notif.id)} style={{ background: notif.isRead ? "#F9FAFB" : "#fff", padding: 20, borderRadius: 12, border: "1px solid #F0DDD4", display: "flex", alignItems: "flex-start", gap: 12, cursor: notif.isRead && !isAccepted ? "default" : "pointer", opacity: notif.isRead ? 0.7 : 1, transition: "0.2s" }} onMouseEnter={(e) => { if (isAccepted) e.currentTarget.style.borderColor = "#3B82F6"; }} onMouseLeave={(e) => { if (isAccepted) e.currentTarget.style.borderColor = "#F0DDD4"; }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: notif.isRead ? "transparent" : "#E8521A", marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px 0", color: "#1A0A00", lineHeight: 1.5 }}>
                        {notif.content}
                      </p>
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>{new Date(notif.createdAt).toLocaleString()}</span>
                    </div>
                    {isAccepted && (
                      <div style={{ alignSelf: "center", color: "#3B82F6", fontWeight: 700, fontSize: 13, background: "#EAF6FF", padding: "6px 12px", borderRadius: 50 }}>
                        View Task
                      </div>
                    )}
                  </div>
                );

                return isAccepted ? (
                  <a key={notif.id} href={`/listing/${notif.relatedId}`} style={{ textDecoration: "none" }} onClick={() => !notif.isRead && handleMarkRead(notif.id)}>
                    {NotificationContent}
                  </a>
                ) : NotificationContent;
              })}
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && selectedRequest && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={() => !paying && setPaymentModalOpen(false)} />
          
          <div style={{ position: "relative", width: "100%", maxWidth: 450, background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#1A0A00", marginTop: 0, marginBottom: 8 }}>Advance Payment</h2>
            <p style={{ color: "#6B7280", margin: "0 0 24px 0", fontSize: 14 }}>You must pay a minimum of 30% to hire and unlock project details for the freelancer.</p>
            
            <div style={{ background: "#F9FAFB", padding: 20, borderRadius: 12, marginBottom: 24, border: "1px solid #E5E7EB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: "#4B5563" }}>Project Budget</span>
                <span style={{ fontWeight: 600 }}>₹{selectedRequest.listing?.price || 0}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: "#4B5563" }}>Advance Required</span>
                <span style={{ fontWeight: 600 }}>30%</span>
              </div>
              <div style={{ height: 1, background: "#E5E7EB", margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#1A0A00", fontWeight: 700 }}>Total to Pay</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#E8521A", fontFamily: "'Syne', sans-serif" }}>
                  ₹{Math.round((selectedRequest.listing?.price || 0) * 0.3)}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => setPaymentModalOpen(false)}
                disabled={paying}
                style={{ flex: 1, padding: "12px", background: "#F3F4F6", color: "#4B5563", borderRadius: 12, border: "none", fontWeight: 600, cursor: paying ? "not-allowed" : "pointer" }}
              >
                Cancel
              </button>
              <button 
                onClick={processPaymentAndHire}
                disabled={paying}
                style={{ flex: 2, padding: "12px", background: paying ? "#FCA5A5" : "#10B981", color: "#fff", borderRadius: 12, border: "none", fontWeight: 700, cursor: paying ? "not-allowed" : "pointer" }}
              >
                {paying ? "Processing..." : "Pay Securely & Hire"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
