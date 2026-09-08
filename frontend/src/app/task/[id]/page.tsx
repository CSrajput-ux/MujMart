"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/marketplace/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { listingsApi, threadsApi, type Listing } from "@/lib/api";

const getFullUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

const getFilename = (url: string, index: number, defaultType: string = "File") => {
  try {
    const cleanUrl = url.split("?")[0];
    const parts = cleanUrl.split("/");
    const last = parts[parts.length - 1];
    if (last && last.includes(".")) {
      return decodeURIComponent(last);
    }
  } catch (e) {}
  return `${defaultType} ${index + 1}`;
};

export default function TaskWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;
  const { user, requireAuth } = useAuth();

  const [listing, setListing] = useState<(Listing & { platformFee?: number; isAuthorized?: boolean }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "deliverables">("details");
  
  // Submission form state
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Preview modals
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    async function loadTaskData() {
      if (!taskId) return;
      try {
        setLoading(true);
        const res = await listingsApi.get(taskId);
        setListing(res.listing);
      } catch (err) {
        console.error("Failed to load task details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTaskData();
  }, [taskId]);

  const handleOpenChat = () => {
    if (!listing) return;
    requireAuth(async () => {
      try {
        setChatLoading(true);
        const res = await threadsApi.create(listing.id);
        router.push(`/chat/${res.thread.id}`);
      } catch (err: any) {
        alert(err.message || "Failed to start chat with client");
      } finally {
        setChatLoading(false);
      }
    });
  };

  const handleDeliverableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionLink.trim()) {
      alert("Please provide a submission link (GitHub, Google Drive, or Demo URL).");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "140px 24px", color: "#6B7280" }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: "3px solid #E8521A",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Loading assignment workspace...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
        <Navbar />
        <div style={{ maxWidth: 600, margin: "100px auto", textAlign: "center", padding: "0 24px" }}>
          <span style={{ fontSize: 48 }}>🔍</span>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#1A0A00", marginTop: 16 }}>
            Task Workspace Not Found
          </h1>
          <p style={{ color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "8px 0 24px" }}>
            The requested task could not be found or you may not have access permissions.
          </p>
          <button
            onClick={() => router.push("/notifications")}
            style={{
              padding: "10px 24px",
              background: "#E8521A",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              cursor: "pointer",
            }}
          >
            ← Back to Notifications
          </button>
        </div>
      </main>
    );
  }

  let rawImages: string[] = [];
  if (Array.isArray(listing.images)) {
    rawImages = listing.images;
  } else if (typeof listing.images === "string" && (listing.images as string).trim()) {
    try {
      const parsed = JSON.parse(listing.images);
      rawImages = Array.isArray(parsed) ? parsed : [listing.images];
    } catch {
      rawImages = [listing.images];
    }
  }

  let rawAttachments: string[] = [];
  if (Array.isArray(listing.attachments)) {
    rawAttachments = listing.attachments;
  } else if (typeof listing.attachments === "string" && (listing.attachments as string).trim()) {
    try {
      const parsed = JSON.parse(listing.attachments);
      rawAttachments = Array.isArray(parsed) ? parsed : [listing.attachments];
    } catch {
      rawAttachments = [listing.attachments];
    }
  }

  const validImages = rawImages
    .filter((img) => img && typeof img === "string" && img.trim() !== "")
    .map((img) => getFullUrl(img));

  const validAttachments = rawAttachments
    .filter((doc) => doc && typeof doc === "string" && doc.trim() !== "")
    .map((doc) => getFullUrl(doc));

  const advanceAmount = Math.round((listing.price || 0) * 0.3);
  const remainingAmount = (listing.price || 0) - advanceAmount;
  const totalFilesCount = validImages.length + validAttachments.length;

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5", paddingBottom: 80 }}>
      <Navbar />

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "32px 24px 0" }}>
        {/* Breadcrumb Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#9CA3AF",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: 20,
          }}
        >
          <a href="/notifications" style={{ color: "#6B7280", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            <span>← Notifications</span>
          </a>
          <span>/</span>
          <span style={{ color: "#1A0A00", fontWeight: 600 }}>Task Workspace</span>
          <span>/</span>
          <span style={{ color: "#E8521A", fontWeight: 700 }}>{listing.title.slice(0, 32)}</span>
        </nav>

        {/* Unlocked Hero Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #1A0A00 0%, #2D1405 100%)",
            borderRadius: 24,
            padding: "36px 40px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -20,
              top: -20,
              width: 240,
              height: 240,
              background: "radial-gradient(circle, rgba(232,82,26,0.35) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  background: "rgba(34, 197, 94, 0.2)",
                  border: "1px solid rgba(34, 197, 94, 0.4)",
                  borderRadius: 50,
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#4ADE80",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.04em",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
                🔓 PROJECT & ALL FILES UNLOCKED
              </span>

              <span
                style={{
                  padding: "6px 14px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 50,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#FED7AA",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {listing.category || "Projects & Assignments"}
              </span>

              {listing.status === "hired" && (
                <span
                  style={{
                    padding: "6px 14px",
                    background: "rgba(59, 130, 246, 0.2)",
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    borderRadius: 50,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#93C5FD",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  ASSIGNED TO YOU
                </span>
              )}
            </div>

            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(24px, 4vw, 36px)",
                lineHeight: 1.2,
                margin: "0 0 16px 0",
                maxWidth: 800,
              }}
            >
              {listing.title}
            </h1>

            {/* Financial & Escrow Overview Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
                marginTop: 24,
                padding: "20px",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div>
                <span style={{ display: "block", fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
                  Total Project Budget
                </span>
                <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#fff" }}>
                  ₹{listing.price.toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: 12, color: "#4ADE80", fontFamily: "'DM Sans', sans-serif" }}>
                  ✓ 30% Advance Escrow (Secured)
                </span>
                <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#4ADE80" }}>
                  ₹{advanceAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <span style={{ display: "block", fontSize: 12, color: "#FDBA74", fontFamily: "'DM Sans', sans-serif" }}>
                  Remaining Upon Completion
                </span>
                <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#FDBA74" }}>
                  ₹{remainingAmount.toLocaleString("en-IN")}
                </span>
              </div>

              {listing.deadline && (
                <div>
                  <span style={{ display: "block", fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
                    Deadline
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", color: "#fff", display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    ⏰ {new Date(listing.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Workspace Layout Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 28,
            alignItems: "start",
          }}
          className="workspace-grid"
        >
          {/* Main Content Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Navigation Tabs */}
            <div
              style={{
                display: "flex",
                gap: 8,
                background: "#fff",
                padding: "6px",
                borderRadius: 14,
                border: "1px solid #F0DDD4",
              }}
            >
              {[
                { id: "details", label: "📋 Assignment Specification & Attached Files" },
                { id: "deliverables", label: "🚀 Submit Deliverables & Work" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "none",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: activeTab === tab.id ? "#E8521A" : "transparent",
                    color: activeTab === tab.id ? "#fff" : "#6B7280",
                    boxShadow: activeTab === tab.id ? "0 4px 12px rgba(232,82,26,0.25)" : "none",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: Complete Unlocked Details, Scope & Client Uploaded Files */}
            {activeTab === "details" && (
              <>
                {/* Milestone Progress Bar */}
                <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #F0DDD4", padding: "24px 28px" }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#1A0A00", margin: "0 0 16px 0" }}>
                    Workflow & Milestones
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="milestones-row">
                    {[
                      { step: "1", title: "Advance Secured", status: "completed", desc: "30% locked in escrow" },
                      { step: "2", title: "Details Unlocked", status: "completed", desc: "Files & tasks accessible" },
                      { step: "3", title: "Work in Progress", status: "active", desc: "Code, write & test" },
                      { step: "4", title: "Review & Payout", status: "pending", desc: "Remaining 70% payout" },
                    ].map((m) => (
                      <div
                        key={m.step}
                        style={{
                          padding: "14px",
                          borderRadius: 12,
                          background:
                            m.status === "completed"
                              ? "#F0FDF4"
                              : m.status === "active"
                              ? "#FFF0EA"
                              : "#F9FAFB",
                          border:
                            m.status === "completed"
                              ? "1.5px solid #86EFAC"
                              : m.status === "active"
                              ? "1.5px solid #E8521A"
                              : "1px solid #E5E7EB",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background:
                                m.status === "completed"
                                  ? "#16A34A"
                                  : m.status === "active"
                                  ? "#E8521A"
                                  : "#9CA3AF",
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {m.status === "completed" ? "✓" : m.step}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              fontFamily: "'Syne', sans-serif",
                              color:
                                m.status === "completed"
                                  ? "#15803D"
                                  : m.status === "active"
                                  ? "#E8521A"
                                  : "#6B7280",
                            }}
                          >
                            {m.title}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                          {m.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Complete Unlocked Description & ALL Client Uploaded Files Embedded */}
                <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #F0DDD4", padding: "28px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#1A0A00", margin: 0 }}>
                      Complete Project Scope & Requirements
                    </h2>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "#DCFCE7",
                        color: "#166534",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      UNLOCKED
                    </span>
                  </div>

                  {/* Text Problem Statement */}
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      color: "#374151",
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                      background: "#FDF8F5",
                      padding: "20px",
                      borderRadius: 14,
                      border: "1px solid #F0DDD4",
                      marginBottom: 24,
                    }}
                  >
                    {listing.description}
                  </div>

                  {/* Embedded Client Uploaded Photos & Screenshots inside the Scope Card */}
                  {validImages.length > 0 && (
                    <div style={{ marginBottom: 24, paddingTop: 16, borderTop: "1px dashed #F0DDD4" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#1A0A00", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                          <span>📸</span> Client Photos & Question Screenshots ({validImages.length})
                        </h3>
                        <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                          Click to preview / zoom
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                          gap: 14,
                        }}
                      >
                        {validImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() => setPreviewImage(imgUrl)}
                            style={{
                              position: "relative",
                              aspectRatio: "4/3",
                              borderRadius: 12,
                              overflow: "hidden",
                              border: "1.5px solid #F0DDD4",
                              cursor: "pointer",
                              background: "#F9FAFB",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-3px)";
                              e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.1)";
                              e.currentTarget.style.borderColor = "#E8521A";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                              e.currentTarget.style.borderColor = "#F0DDD4";
                            }}
                          >
                            <img
                              src={imgUrl}
                              alt={`Client Photo ${idx + 1}`}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                                display: "flex",
                                alignItems: "flex-end",
                                padding: "8px 10px",
                              }}
                            >
                              <span
                                style={{
                                  color: "#fff",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  fontFamily: "'DM Sans', sans-serif",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                🔍 Photo {idx + 1}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Embedded Client Uploaded Documents & Attachments inside the Scope Card */}
                  {validAttachments.length > 0 && (
                    <div style={{ paddingTop: 16, borderTop: "1px dashed #F0DDD4" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#1A0A00", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                          <span>📁</span> Client Uploaded Files & Documents ({validAttachments.length})
                        </h3>
                        <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                          Download or live preview
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {validAttachments.map((doc, idx) => {
                          const filename = getFilename(doc, idx, "Assignment Document");
                          const isPdf = doc.toLowerCase().endsWith(".pdf");
                          const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(doc);

                          return (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px 16px",
                                background: "#FDF8F5",
                                borderRadius: 12,
                                border: "1.5px solid #F0DDD4",
                                transition: "all 0.2s",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontSize: 24 }}>{isPdf ? "📕" : isImage ? "🖼️" : "📄"}</span>
                                <div>
                                  <p style={{ margin: "0 0 2px 0", fontWeight: 700, fontSize: 14, color: "#1A0A00", fontFamily: "'DM Sans', sans-serif" }}>
                                    {filename}
                                  </p>
                                  <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                                    Uploaded by client during listing creation
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: "flex", gap: 8 }}>
                                <button
                                  onClick={() => isImage ? setPreviewImage(doc) : setPreviewDoc(doc)}
                                  style={{
                                    padding: "6px 14px",
                                    background: "#fff",
                                    border: "1px solid #F0DDD4",
                                    borderRadius: 8,
                                    color: "#1A0A00",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    fontFamily: "'DM Sans', sans-serif",
                                    cursor: "pointer",
                                  }}
                                >
                                  Live Preview
                                </button>
                                <a
                                  href={doc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    padding: "6px 14px",
                                    background: "#E8521A",
                                    color: "#fff",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    fontFamily: "'DM Sans', sans-serif",
                                    textDecoration: "none",
                                  }}
                                >
                                  Download ⬇
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Empty files state when neither images nor attachments were attached */}
                  {validImages.length === 0 && validAttachments.length === 0 && (
                    <div
                      style={{
                        padding: "20px 16px",
                        background: "#FFFBEA",
                        borderRadius: 12,
                        border: "1px solid #FDE68A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20 }}>💡</span>
                        <p style={{ margin: 0, fontSize: 13, color: "#92400E", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                          No files were attached by the client when posting. You can ask them directly in chat!
                        </p>
                      </div>
                      <button
                        onClick={handleOpenChat}
                        disabled={chatLoading}
                        style={{
                          padding: "6px 14px",
                          background: "#3B82F6",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "'DM Sans', sans-serif",
                          cursor: "pointer",
                        }}
                      >
                        💬 Request Files in Chat
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB 2: Submit Deliverables & Work */}
            {activeTab === "deliverables" && (
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #F0DDD4", padding: "32px" }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#1A0A00", margin: "0 0 8px 0" }}>
                  Submit Assignment Work
                </h2>
                <p style={{ color: "#6B7280", fontSize: 14, fontFamily: "'DM Sans', sans-serif", margin: "0 0 24px 0" }}>
                  Submit your completed work (code repository, Google Drive folder, report, or demo link). Once the client verifies, the remaining 70% payout will be credited to your balance.
                </p>

                {submitted ? (
                  <div
                    style={{
                      background: "#F0FDF4",
                      border: "1.5px solid #86EFAC",
                      borderRadius: 16,
                      padding: "32px 24px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "#22C55E",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        margin: "0 auto 16px",
                      }}
                    >
                      ✓
                    </div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#166534", margin: "0 0 8px 0" }}>
                      Work Submitted Successfully!
                    </h3>
                    <p style={{ color: "#15803D", fontSize: 14, fontFamily: "'DM Sans', sans-serif", maxWidth: 500, margin: "0 auto 20px" }}>
                      The client has been notified to review your submission. Once confirmed, your final payout of ₹{remainingAmount.toLocaleString("en-IN")} will be released.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      style={{
                        padding: "8px 18px",
                        background: "#fff",
                        border: "1.5px solid #86EFAC",
                        borderRadius: 8,
                        color: "#166534",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Update Submission
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDeliverableSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#1A0A00",
                          marginBottom: 8,
                        }}
                      >
                        Deliverable URL (GitHub / Google Drive / Cloud Link) *
                      </label>
                      <input
                        type="url"
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                        placeholder="https://github.com/your-username/project-repo"
                        required
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          borderRadius: 12,
                          border: "1px solid #F0DDD4",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#1A0A00",
                          marginBottom: 8,
                        }}
                      >
                        Notes & Submission Comments
                      </label>
                      <textarea
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="Explain what has been completed, setup instructions, or notes for the client..."
                        rows={4}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          borderRadius: 12,
                          border: "1px solid #F0DDD4",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14,
                          outline: "none",
                          resize: "vertical",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        padding: "16px 28px",
                        background: submitting ? "#9CA3AF" : "#E8521A",
                        color: "#fff",
                        borderRadius: 12,
                        border: "none",
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: 15,
                        cursor: submitting ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        alignSelf: "flex-start",
                      }}
                    >
                      {submitting ? "Submitting Work..." : "Submit Deliverables for Review 🚀"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar: Poster Card & Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 80 }}>
            {/* Poster Info Card */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid #F0DDD4",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: "0 0 16px 0",
                }}
              >
                Project Poster / Client
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "#FFF0EA",
                    color: "#E8521A",
                    fontWeight: 800,
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {listing.seller?.alias?.charAt(0).toUpperCase() || "C"}
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#1A0A00", margin: "0 0 4px 0" }}>
                    {listing.seller?.alias || "Client"}
                  </h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                    <span>★ {listing.seller?.repScore?.toFixed(1) || "5.0"}</span>
                    <span>•</span>
                    <span>{listing.seller?.dealCount || 0} deals</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={handleOpenChat}
                  disabled={chatLoading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#3B82F6",
                    color: "#fff",
                    borderRadius: 12,
                    border: "none",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: chatLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {chatLoading ? "Opening Chat..." : "Chat with Client"}
                </button>

                <button
                  onClick={() => setActiveTab("deliverables")}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#E8521A",
                    color: "#fff",
                    borderRadius: 12,
                    border: "none",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                  }}
                >
                  Submit Final Work 🚀
                </button>
              </div>
            </div>

            {/* Escrow Protection Info */}
            <div
              style={{
                background: "#EAFFF2",
                borderRadius: 16,
                border: "1px solid #BBF7D0",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#15803D" }}>
                <span style={{ fontSize: 18 }}>🛡️</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14 }}>
                  MUJMart Escrow Guarantee
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#166534", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
                The 30% advance payment is already secured. Complete and submit your project to receive the final 70% direct payout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Image Preview Modal */}
      {previewImage && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }} onClick={() => setPreviewImage(null)} />
          
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 12 }}>
              <a
                href={previewImage}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{
                  padding: "8px 18px",
                  background: "#E8521A",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Download Original ⬇
              </a>
              <button
                onClick={() => setPreviewImage(null)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
            <img
              src={previewImage}
              alt="Full Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: 16,
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        </div>
      )}

      {/* Document Live Preview Modal */}
      {previewDoc && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }} onClick={() => setPreviewDoc(null)} />
          
          <div style={{ position: "relative", width: "100%", maxWidth: 900, height: "85vh", background: "#fff", borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, margin: 0, color: "#1A0A00" }}>
                  Document Live Preview
                </h3>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <a href={previewDoc} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "#3B82F6", color: "#fff", textDecoration: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                  Download Original ⬇
                </a>
                <button onClick={() => setPreviewDoc(null)} style={{ width: 34, height: 34, borderRadius: "50%", background: "#E5E7EB", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", fontWeight: "bold" }}>✕</button>
              </div>
            </div>
            <div style={{ flex: 1, padding: 0, background: "#F3F4F6", overflow: "hidden" }}>
              <iframe src={previewDoc} style={{ width: "100%", height: "100%", border: "none" }} title="Document Preview" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .workspace-grid {
            grid-template-columns: 1fr !important;
          }
          .milestones-row {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
