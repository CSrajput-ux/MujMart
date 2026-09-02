"use client";

import React, { useState, useEffect } from "react";
import { transactionsApi, type Transaction } from "@/lib/api";
import StatusPill from "@/components/ui/StatusPill";

export default function EscrowAdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await transactionsApi.list();
      // Only keep transactions that are in the escrow flow
      const escrowFlow = res.transactions.filter(t => 
        ["pending_payment", "verifying_payment", "escrow", "ready_for_payout", "completed"].includes(t.status)
      );
      setTransactions(escrowFlow);
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  };

  // Manual payment verification is now handled automatically by Razorpay

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
      case "ready_for_payout": return "red"; // Urgent for admin
      case "completed": return "green";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_payment": return "Awaiting Buyer";
      case "verifying_payment": return "Check UTR";
      case "escrow": return "In Escrow";
      case "ready_for_payout": return "Payout Pending";
      case "completed": return "Completed";
      default: return status;
    }
  };

  if (loading) return <div>Loading Escrow...</div>;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: 0 }}>Escrow Payments</h1>
        <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>Verify buyer payments and release payouts to sellers.</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F0DDD4", fontSize: 12, color: "#6B7280", textTransform: "uppercase" }}>
              <th style={{ padding: "16px 24px", fontWeight: 600 }}>Item</th>
              <th style={{ padding: "16px 24px", fontWeight: 600 }}>Buyer UTR</th>
              <th style={{ padding: "16px 24px", fontWeight: 600 }}>Seller Payout</th>
              <th style={{ padding: "16px 24px", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} style={{ borderBottom: "1px solid #F0DDD4" }}>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1A0A00" }}>{t.listing?.title}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>₹{t.amount.toLocaleString()}</div>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", background: "#F3F4F6", padding: "4px 8px", borderRadius: 6, display: "inline-block" }}>
                    {t.utrNumber || "N/A"}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>by {t.buyer?.alias}</div>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#15803D" }}>₹{(t.sellerAmount || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>to {t.seller?.upiId || "No UPI set"} ({t.seller?.alias})</div>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <StatusPill label={getStatusLabel(t.status)} variant={getStatusColor(t.status) as any} size="sm" />
                </td>
                <td style={{ padding: "16px 24px", textAlign: "right" }}>
                  {t.status === "verifying_payment" && (
                    <span style={{ fontSize: 12, color: "#E8521A" }}>Automated via Razorpay</span>
                  )}
                  {t.status === "ready_for_payout" && (
                    <button 
                      onClick={() => handlePayout(t.id)}
                      style={{ padding: "8px 16px", background: "#15803D", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      disabled={!t.seller?.upiId}
                    >
                      {t.seller?.upiId ? "Mark Paid" : "No UPI"}
                    </button>
                  )}
                  {t.status === "pending_payment" && <span style={{ fontSize: 12, color: "#9CA3AF" }}>Waiting...</span>}
                  {t.status === "escrow" && <span style={{ fontSize: 12, color: "#9CA3AF" }}>In Escrow</span>}
                  {t.status === "completed" && <span style={{ fontSize: 12, color: "#9CA3AF" }}>Done</span>}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>
                  No escrow transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
