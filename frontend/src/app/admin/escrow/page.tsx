"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { transactionsApi, type Transaction } from "@/lib/api";
import StatusPill from "@/components/ui/StatusPill";

export default function EscrowAdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [screenshotModal, setScreenshotModal] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await transactionsApi.list();
      const escrowFlow = res.transactions.filter((t) =>
        ["pending_payment", "verifying_payment", "escrow", "ready_for_payout", "completed"].includes(t.status)
      );
      setTransactions(escrowFlow);
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (id: string) => {
    if (!confirm("Kya aapne payment screenshot verify kar liya? Confirm karne par order 'escrow' mein chala jayega.")) return;
    setVerifyingId(id);
    try {
      await transactionsApi.verifyPayment(id);
      await loadTransactions();
    } catch (e: any) {
      alert(e.message || "Failed to verify payment");
    } finally {
      setVerifyingId(null);
    }
  };

  const handlePayout = async (id: string) => {
    if (!confirm("Have you successfully transferred the funds to the seller's UPI?")) return;
    try {
      await transactionsApi.completePayout(id);
      loadTransactions();
    } catch (e: any) {
      alert(e.message || "Failed to payout");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verifying_payment": return "orange";
      case "escrow": return "blue";
      case "ready_for_payout": return "red";
      case "completed": return "green";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_payment": return "Awaiting Payment";
      case "verifying_payment": return "⚡ Verify Now";
      case "escrow": return "In Escrow";
      case "ready_for_payout": return "Payout Pending";
      case "completed": return "Completed";
      default: return status;
    }
  };

  // Count verifying_payment transactions (urgent)
  const urgentCount = transactions.filter((t) => t.status === "verifying_payment").length;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
      <div style={{ fontSize: 14, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>Loading payments...</div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: 0 }}>
            Payment Verification
          </h1>
          {urgentCount > 0 && (
            <div style={{
              background: "#FEF3C7", border: "1px solid #FCD34D",
              borderRadius: 20, padding: "4px 12px",
              fontSize: 12, fontWeight: 700, color: "#92400E",
              fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
              animation: "pulse 2s infinite",
            }}>
              🔔 {urgentCount} payment{urgentCount > 1 ? "s" : ""} waiting for verification
            </div>
          )}
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 6 }}>
          Verify buyer UPI payment screenshots and release escrow payouts to sellers.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Pending Payment", count: transactions.filter(t => t.status === "pending_payment").length, color: "#6B7280", bg: "#F3F4F6" },
          { label: "Needs Verification", count: urgentCount, color: "#D97706", bg: "#FEF3C7" },
          { label: "In Escrow", count: transactions.filter(t => t.status === "escrow").length, color: "#1D4ED8", bg: "#EFF6FF" },
          { label: "Payout Pending", count: transactions.filter(t => t.status === "ready_for_payout").length, color: "#DC2626", bg: "#FEF2F2" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, fontFamily: "'Syne', sans-serif" }}>{stat.count}</div>
            <div style={{ fontSize: 12, color: stat.color, fontFamily: "'DM Sans', sans-serif", marginTop: 2, opacity: 0.8 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F0DDD4", fontSize: 12, color: "#6B7280", textTransform: "uppercase" }}>
              <th style={{ padding: "16px 20px", fontWeight: 600 }}>Product</th>
              <th style={{ padding: "16px 20px", fontWeight: 600 }}>Buyer & Payment Proof</th>
              <th style={{ padding: "16px 20px", fontWeight: 600 }}>Amount</th>
              <th style={{ padding: "16px 20px", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                style={{
                  borderBottom: "1px solid #F0DDD4",
                  background: t.status === "verifying_payment" ? "#FFFBEB" : "#fff",
                  transition: "background 0.2s",
                }}
              >
                {/* Product */}
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {t.listing?.images && (t.listing.images as string[])[0] && (
                      <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, position: "relative" }}>
                        <Image
                          src={(t.listing.images as string[])[0]}
                          alt={t.listing.title || ""}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1A0A00", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.listing?.title}
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
                        {t.listing?.category} • {t.listing?.condition}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Buyer & Payment Proof */}
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>
                    {t.buyer?.alias}
                  </div>
                  {t.utrNumber ? (
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>UTR: </span>
                      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", background: "#F3F4F6", padding: "2px 6px", borderRadius: 4, color: "#1A0A00" }}>
                        {t.utrNumber}
                      </span>
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>No UTR yet</div>
                  )}
                  {t.paymentScreenshotUrl && (
                    <button
                      onClick={() => setScreenshotModal(t.paymentScreenshotUrl!)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        background: "#E8521A", color: "#fff",
                        border: "none", borderRadius: 6, padding: "5px 10px",
                        fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                      </svg>
                      View Screenshot
                    </button>
                  )}
                </td>

                {/* Amount */}
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#E8521A", fontFamily: "'Syne', sans-serif" }}>
                    ₹{t.amount.toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: 11, color: "#15803D", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                    Seller gets: ₹{(t.sellerAmount || 0).toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
                    via {t.seller?.upiId || "No UPI set"} ({t.seller?.alias})
                  </div>
                </td>

                {/* Status */}
                <td style={{ padding: "16px 20px" }}>
                  <StatusPill label={getStatusLabel(t.status)} variant={getStatusColor(t.status) as any} size="sm" />
                </td>

                {/* Action */}
                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                  {t.status === "verifying_payment" && (
                    <button
                      onClick={() => handleVerifyPayment(t.id)}
                      disabled={verifyingId === t.id}
                      style={{
                        padding: "8px 16px",
                        background: verifyingId === t.id ? "#9CA3AF" : "linear-gradient(135deg, #15803D, #16A34A)",
                        color: "#fff", border: "none", borderRadius: 8,
                        fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                        cursor: verifyingId === t.id ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
                      }}
                    >
                      {verifyingId === t.id ? "Verifying..." : "✓ Verify Payment"}
                    </button>
                  )}
                  {t.status === "ready_for_payout" && (
                    <button
                      onClick={() => handlePayout(t.id)}
                      style={{
                        padding: "8px 16px",
                        background: "#E8521A",
                        color: "#fff", border: "none", borderRadius: 8,
                        fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                        cursor: "pointer", whiteSpace: "nowrap",
                      }}
                      disabled={!t.seller?.upiId}
                    >
                      {t.seller?.upiId ? "Mark Paid Out" : "No UPI"}
                    </button>
                  )}
                  {t.status === "pending_payment" && (
                    <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>Waiting for buyer...</span>
                  )}
                  {t.status === "escrow" && (
                    <span style={{ fontSize: 12, color: "#1D4ED8", fontFamily: "'DM Sans', sans-serif" }}>In Escrow</span>
                  )}
                  {t.status === "completed" && (
                    <span style={{ fontSize: 12, color: "#15803D", fontFamily: "'DM Sans', sans-serif" }}>✓ Done</span>
                  )}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 60, textAlign: "center", color: "#6B7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Screenshot Fullscreen Modal */}
      {screenshotModal && (
        <div
          onClick={() => setScreenshotModal(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(0,0,0,0.9)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, cursor: "zoom-out",
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", textAlign: "center", marginBottom: 8 }}>
              Payment Screenshot — Click anywhere to close
            </div>
            <div style={{ position: "relative", width: "min(500px, 90vw)", height: "min(700px, 80vh)" }}>
              <Image
                src={screenshotModal}
                alt="Payment Screenshot"
                fill
                style={{ objectFit: "contain", borderRadius: 12 }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
