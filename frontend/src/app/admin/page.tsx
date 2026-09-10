"use client";

import React, { useState, useEffect } from "react";
import MetricCard from "@/components/admin/MetricCard";
import HealthBar from "@/components/admin/HealthBar";
import StatusPill from "@/components/ui/StatusPill";
import { adminApi } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const statsRes = await adminApi.stats();
        setStats(statsRes.stats);

        const disputesRes = await adminApi.disputes({ status: "open", limit: 5 } as any);
        setDisputes(disputesRes.disputes);
      } catch (err) {
        console.error("Failed to load admin dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <p style={{ color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) return null;

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
            Admin overview · Real-time data
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
        <MetricCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} trend="+23%" trendUp icon="💰" color="green" />
        <MetricCard label="Active Listings" value={stats.activeListings.toString()} trend="+12" trendUp icon="📦" color="blue" />
        <MetricCard label="Deals Today" value={stats.todayDeals.toString()} trend="+5" trendUp icon="🤝" color="orange" />
        <MetricCard label="Open Disputes" value={stats.openDisputes.toString()} trend="-2" trendUp={false} icon="⚠️" color="red" />
      </div>

      {/* Two column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        {/* Revenue chart - Keep UI but we might want real chart data later */}
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
            Weekly Revenue (Demo Chart)
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
            {disputes.map((dispute, i) => (
              <div
                key={dispute.id || i}
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
                    label={"🔴"}
                    variant={"danger"}
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
                    Dispute: {dispute.reason}
                  </span>
                </div>
                <button
                  onClick={() => window.location.href = "/admin/disputes"}
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
                  Resolve
                </button>
              </div>
            ))}
            {disputes.length === 0 && (
              <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>No urgent actions needed. 🎉</p>
            )}
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
          <HealthBar label="Deal Success Rate" value={stats.totalTransactions > 0 ? Math.round((stats.activeListings / (stats.totalListings || 1)) * 100) : 100} color="green" />
          <HealthBar label="System Availability" value={99} color="green" />
        </div>
      </div>
    </div>
  );
}
