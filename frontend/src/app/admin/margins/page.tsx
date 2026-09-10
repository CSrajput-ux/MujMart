"use client";

import React, { useEffect, useState } from "react";
import MetricCard from "@/components/admin/MetricCard";
import { adminApi } from "@/lib/api";

export default function AdminMarginsPage() {
  const [data, setData] = useState<{ transactions: any[], totals: any } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await adminApi.transactions(1);
        setData(res);
      } catch (err) {
        console.error("Failed to load margin data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statusColors: Record<string, { bg: string; color: string }> = {
    completed: { bg: "rgba(34,197,94,0.1)", color: "#22C55E" },
    ready_for_payout: { bg: "rgba(34,197,94,0.1)", color: "#22C55E" },
    pending_payment: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B" },
    verifying_payment: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B" },
    escrow: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B" },
    refunded: { bg: "rgba(239,68,68,0.1)", color: "#EF4444" },
  };

  if (loading) return <div style={{ padding: 24, color: "#6B7280" }}>Loading margins...</div>;
  if (!data) return null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: 0 }}>
          Margins
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
          Revenue breakdown and margin tracking
        </p>
      </div>

      {/* Overview cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14, marginBottom: 28 }}>
        <MetricCard label="Total Deal Value" value={`₹${data.totals?.totalRevenue?.toLocaleString("en-IN") || 0}`} trend="" trendUp color="green" />
        <MetricCard label="Total Margin Collected" value={`₹${data.totals?.totalMargins?.toLocaleString("en-IN") || 0}`} trend="" trendUp color="orange" />
        <MetricCard label="Avg Deal Size" value={`₹${Math.round(data.totals?.avgDealSize || 0).toLocaleString("en-IN")}`} trend="" trendUp color="blue" />
      </div>

      {/* Margin table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0DDD4" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1A0A00", margin: 0 }}>
            Recent Margin Transactions
          </h3>
        </div>
        {data.transactions.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#6B7280" }}>No transactions yet</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #F0DDD4" }}>
                {["Listing", "Amount", "Margin", "Buyer", "Status"].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "10px 20px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((txn, i) => (
                <tr
                  key={txn.id || i}
                  style={{ borderBottom: "1px solid rgba(240,221,212,0.5)", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,240,234,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "10px 20px", fontSize: 13, fontWeight: 500, color: "#1A0A00", fontFamily: "'DM Sans', sans-serif" }}>
                    {txn.listing?.title || "Unknown"}
                  </td>
                  <td style={{ padding: "10px 20px", fontSize: 13, color: "#1A0A00", fontFamily: "'DM Sans', sans-serif" }}>
                    ₹{txn.amount?.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "10px 20px", fontSize: 13, fontWeight: 700, color: "#E8521A", fontFamily: "'Syne', sans-serif" }}>
                    ₹{txn.platformMargin?.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "10px 20px", fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                    {txn.buyer?.alias || "Unknown"}
                  </td>
                  <td style={{ padding: "10px 20px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 50,
                        fontSize: 11,
                        fontWeight: 500,
                        background: statusColors[txn.status]?.bg || "#F9FAFB",
                        color: statusColors[txn.status]?.color || "#6B7280",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {txn.status.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
