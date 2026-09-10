"use client";

import React, { useEffect, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import { adminApi } from "@/lib/api";

export default function AdminRentPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRentListings() {
      try {
        const res = await adminApi.listings({ type: "rent", limit: 100 } as any);
        // Filter out those that might need approval if you want, but for now we'll just show them
        setApprovals(res.listings);
      } catch (err) {
        console.error("Failed to load rent listings", err);
      } finally {
        setLoading(false);
      }
    }
    loadRentListings();
  }, []);

  const pendingCount = approvals.filter((a) => a.status === "pending" || a.status === "active").length;

  if (loading) return <div style={{ padding: 24, color: "#6B7280" }}>Loading rent approvals...</div>;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: 0 }}>
          Rent Approvals
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
          {pendingCount} pending approvals
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {approvals.length === 0 ? (
          <div style={{ padding: 24, background: "#fff", borderRadius: 14, textAlign: "center", color: "#6B7280" }}>No rent approvals pending 🎉</div>
        ) : approvals.map((approval) => {
          const overCeiling = false; // logic would go here if ceiling is defined

          return (
            <div
              key={approval.id}
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #F0DDD4",
                padding: 20,
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                      {approval.id}
                    </span>
                    <StatusPill
                      label={approval.status}
                      variant={
                        approval.status === "active" ? "success" :
                        approval.status === "removed" ? "danger" : "warning"
                      }
                    />
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1A0A00", margin: 0 }}>
                    {approval.title}
                  </p>
                  <p style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                    by {approval.seller?.alias || "Unknown"}
                  </p>

                  {/* Price comparison */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
                    <div>
                      <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", display: "block" }}>
                        Proposed Rate
                      </span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: overCeiling ? "#EF4444" : "#22C55E" }}>
                        ₹{approval.price}/day
                      </span>
                    </div>
                  </div>
                </div>

                {approval.status === "pending" && (
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button style={{ padding: "6px 14px", fontSize: 12, color: "#22C55E", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 50, background: "rgba(34,197,94,0.08)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                      Approve
                    </button>
                    <button style={{ padding: "6px 14px", fontSize: 12, color: "#E8521A", border: "1px solid rgba(232,82,26,0.3)", borderRadius: 50, background: "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                      Custom Rate
                    </button>
                    <button style={{ padding: "6px 14px", fontSize: 12, color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 50, background: "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
