"use client";

import React from "react";
import MetricCard from "@/components/admin/MetricCard";
import HealthBar from "@/components/admin/HealthBar";
import StatusPill from "@/components/ui/StatusPill";

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 24,
              color: "#1A0A00",
              margin: 0,
            }}
          >
            Dashboard
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "#6B7280",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 4,
            }}
          >
            Admin overview · Last updated 2 min ago
          </p>
        </div>
        <span
          style={{
            padding: "6px 14px",
            background: "#FFF0EA",
            color: "#E8521A",
            fontSize: 12,
            borderRadius: 50,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Admin Panel
        </span>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <MetricCard label="Total Revenue" value="₹18,430" trend="+23%" trendUp icon="💰" color="green" />
        <MetricCard label="Active Listings" value="347" trend="+12" trendUp icon="📦" color="blue" />
        <MetricCard label="Deals Today" value="18" trend="+5" trendUp icon="🤝" color="orange" />
        <MetricCard label="Open Disputes" value="7" trend="-2" trendUp={false} icon="⚠️" color="red" />
      </div>

      {/* Two column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        {/* Revenue chart */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #F0DDD4",
            padding: 24,
          }}
        >
          <h3
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "#1A0A00",
              margin: "0 0 20px 0",
            }}
          >
            Weekly Revenue
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 12,
              height: 180,
            }}
          >
            {[
              { day: "Mon", val: 65 },
              { day: "Tue", val: 45 },
              { day: "Wed", val: 80 },
              { day: "Thu", val: 55 },
              { day: "Fri", val: 90 },
              { day: "Sat", val: 70 },
              { day: "Sun", val: 40 },
            ].map((d) => (
              <div
                key={d.day}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "flex-end",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${d.val}%`,
                      background: "rgba(232,82,26,0.8)",
                      borderRadius: "6px 6px 0 0",
                      transition: "all 0.5s ease",
                      minHeight: 4,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#E8521A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(232,82,26,0.8)";
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6B7280",
                    fontFamily: "'DM Sans', sans-serif",
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Actions */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #F0DDD4",
            padding: 24,
          }}
        >
          <h3
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "#1A0A00",
              margin: "0 0 16px 0",
            }}
          >
            Urgent Actions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { text: "Illegal listing in Rent", severity: "danger" as const, action: "Review" },
              { text: "Price gouging alert", severity: "warning" as const, action: "Check" },
              { text: "Pending rent approvals (7)", severity: "orange" as const, action: "Approve" },
              { text: "New dispute filed", severity: "danger" as const, action: "Resolve" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: "10px 12px",
                  background: "#F9FAFB",
                  borderRadius: 10,
                  transition: "background 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,240,234,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#F9FAFB";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <StatusPill
                    label={
                      item.severity === "danger"
                        ? "🔴"
                        : item.severity === "warning"
                        ? "🟡"
                        : "🟠"
                    }
                    variant={item.severity}
                    size="sm"
                  />
                  <span
                    style={{
                      fontSize: 13,
                      color: "#1A0A00",
                      fontFamily: "'DM Sans', sans-serif",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
                <button
                  style={{
                    fontSize: 12,
                    color: "#E8521A",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    padding: 0,
                  }}
                >
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div
        style={{
          marginTop: 24,
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #F0DDD4",
          padding: 24,
        }}
      >
        <h3
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "#1A0A00",
            margin: "0 0 16px 0",
          }}
        >
          Platform Health
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px 32px",
          }}
        >
          <HealthBar label="Deal Success Rate" value={87} color="green" />
          <HealthBar label="Margin Collection" value={72} color="orange" />
          <HealthBar label="User Satisfaction" value={94} color="green" />
          <HealthBar label="Dispute Resolution" value={65} color="red" />
        </div>
      </div>
    </div>
  );
}
