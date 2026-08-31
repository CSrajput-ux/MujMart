"use client";

import React from "react";
import StatusPill from "@/components/ui/StatusPill";

interface Dispute {
  id: string;
  buyer: string;
  seller: string;
  listing: string;
  amount: string;
  issue: string;
  severity: "high" | "medium" | "low";
  date: string;
}

const disputes: Dispute[] = [
  { id: "D001", buyer: "StudentA", seller: "TechGuru42", listing: "Sony Headphones", amount: "₹12,500", issue: "Item not as described — broken ANC", severity: "high", date: "Mar 17" },
  { id: "D002", buyer: "StudentB", seller: "CycleRider", listing: "Firefox Cycle", amount: "₹4,500", issue: "Seller not responding after payment", severity: "high", date: "Mar 16" },
  { id: "D003", buyer: "StudentC", seller: "BookWorm99", listing: "Engineering Maths", amount: "₹350", issue: "Wrong edition delivered", severity: "medium", date: "Mar 15" },
  { id: "D004", buyer: "StudentD", seller: "GiveawayGuru", listing: "Mattress Topper", amount: "FREE", issue: "Item not available at pickup", severity: "low", date: "Mar 14" },
];

const severityBorder: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#6B7280",
};

const severityBg: Record<string, string> = {
  high: "rgba(239,68,68,0.04)",
  medium: "rgba(245,158,11,0.04)",
  low: "#F9FAFB",
};

export default function AdminDisputesPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: 0 }}>
          Disputes
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
          {disputes.length} active disputes to resolve
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {disputes.map((dispute) => (
          <div
            key={dispute.id}
            style={{
              borderRadius: 14,
              border: "1px solid #F0DDD4",
              borderLeft: `4px solid ${severityBorder[dispute.severity]}`,
              padding: 20,
              background: severityBg[dispute.severity],
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                    {dispute.id}
                  </span>
                  <StatusPill
                    label={dispute.severity}
                    variant={
                      dispute.severity === "high"
                        ? "danger"
                        : dispute.severity === "medium"
                        ? "warning"
                        : "default"
                    }
                  />
                  <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                    {dispute.date}
                  </span>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1A0A00", margin: "0 0 4px 0" }}>
                  {dispute.listing} — {dispute.amount}
                </p>
                <p style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "0 0 8px 0" }}>
                  {dispute.issue}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#FFF0EA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#E8521A", fontFamily: "'Syne', sans-serif" }}>
                    {dispute.buyer.charAt(0)}
                  </span>
                  <span style={{ color: "#1A0A00" }}>{dispute.buyer}</span>
                  <span style={{ color: "#6B7280", margin: "0 2px" }}>vs</span>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#FFF0EA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#E8521A", fontFamily: "'Syne', sans-serif" }}>
                    {dispute.seller.charAt(0)}
                  </span>
                  <span style={{ color: "#1A0A00" }}>{dispute.seller}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button style={{ padding: "6px 14px", fontSize: 12, color: "#3B82F6", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 50, background: "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                  View Chat Log
                </button>
                <button style={{ padding: "6px 14px", fontSize: 12, color: "#22C55E", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 50, background: "rgba(34,197,94,0.08)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                  Resolve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
