"use client";

import React from "react";
import MetricCard from "@/components/admin/MetricCard";

export default function AdminMarginsPage() {
  const marginBreakdown = [
    { category: "Electronics", revenue: "₹8,200", margin: "₹820", rate: "10%", status: "Collected" },
    { category: "Books", revenue: "₹2,100", margin: "₹105", rate: "5%", status: "Collected" },
    { category: "Furniture", revenue: "₹3,400", margin: "₹340", rate: "10%", status: "Pending" },
    { category: "Cycles", revenue: "₹4,500", margin: "₹450", rate: "10%", status: "Collected" },
    { category: "Gaming", revenue: "₹1,200", margin: "₹120", rate: "10%", status: "Unpaid" },
    { category: "Other", revenue: "₹800", margin: "₹40", rate: "5%", status: "Collected" },
  ];

  const statusColors: Record<string, { bg: string; color: string }> = {
    Collected: { bg: "rgba(34,197,94,0.1)", color: "#22C55E" },
    Pending: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B" },
    Unpaid: { bg: "rgba(239,68,68,0.1)", color: "#EF4444" },
  };

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
        <MetricCard label="Total Revenue" value="₹20,200" trend="+18%" trendUp color="green" />
        <MetricCard label="Total Margin" value="₹1,875" trend="+12%" trendUp color="orange" />
        <MetricCard label="Unpaid Margins" value="₹120" trend="1 pending" trendUp={false} color="red" />
      </div>

      {/* Margin table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0DDD4" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1A0A00", margin: 0 }}>
            Category Breakdown
          </h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F0DDD4" }}>
              {["Category", "Revenue", "Margin", "Rate", "Status", ""].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "10px 20px",
                    textAlign: i === 5 ? "right" : "left",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {h || "Actions"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {marginBreakdown.map((row, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid rgba(240,221,212,0.5)", transition: "background 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,240,234,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <td style={{ padding: "10px 20px", fontSize: 13, fontWeight: 500, color: "#1A0A00", fontFamily: "'DM Sans', sans-serif" }}>
                  {row.category}
                </td>
                <td style={{ padding: "10px 20px", fontSize: 13, color: "#1A0A00", fontFamily: "'DM Sans', sans-serif" }}>
                  {row.revenue}
                </td>
                <td style={{ padding: "10px 20px", fontSize: 13, fontWeight: 700, color: "#E8521A", fontFamily: "'Syne', sans-serif" }}>
                  {row.margin}
                </td>
                <td style={{ padding: "10px 20px", fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                  {row.rate}
                </td>
                <td style={{ padding: "10px 20px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 50,
                      fontSize: 11,
                      fontWeight: 500,
                      background: statusColors[row.status]?.bg,
                      color: statusColors[row.status]?.color,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: "10px 20px", textAlign: "right" }}>
                  <button
                    style={{
                      fontSize: 12,
                      color: "#E8521A",
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Edit Rate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
