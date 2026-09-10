"use client";

import React, { useEffect, useState } from "react";
import StatusPill from "@/components/ui/StatusPill";
import { adminApi, type Dispute } from "@/lib/api";

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
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDisputes() {
      try {
        const res = await adminApi.disputes({ status: "open", limit: 100 } as any);
        setDisputes(res.disputes);
      } catch (err) {
        console.error("Failed to load disputes", err);
      } finally {
        setLoading(false);
      }
    }
    loadDisputes();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await adminApi.updateDispute(id, "resolved");
      setDisputes(disputes.filter(d => d.id !== id));
    } catch (err) {
      alert("Failed to resolve dispute");
    }
  };

  if (loading) return <div style={{ padding: 24, color: "#6B7280" }}>Loading disputes...</div>;

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
        {disputes.length === 0 ? (
           <div style={{ padding: 24, background: "#fff", borderRadius: 14, textAlign: "center", color: "#6B7280" }}>No open disputes 🎉</div>
        ) : disputes.map((dispute) => (
          <div
            key={dispute.id}
            style={{
              borderRadius: 14,
              border: "1px solid #F0DDD4",
              borderLeft: `4px solid ${severityBorder["medium"]}`,
              padding: 20,
              background: severityBg["medium"],
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
                    label={"medium"}
                    variant={"warning"}
                  />
                  <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                    {new Date(dispute.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1A0A00", margin: "0 0 4px 0" }}>
                  {dispute.thread?.listing?.title || "Unknown Listing"}
                </p>
                <p style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "0 0 8px 0" }}>
                  {dispute.reason}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#FFF0EA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#E8521A", fontFamily: "'Syne', sans-serif" }}>
                    {dispute.thread?.buyer?.alias?.charAt(0) || "B"}
                  </span>
                  <span style={{ color: "#1A0A00" }}>{dispute.thread?.buyer?.alias || "Buyer"}</span>
                  <span style={{ color: "#6B7280", margin: "0 2px" }}>vs</span>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#FFF0EA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#E8521A", fontFamily: "'Syne', sans-serif" }}>
                    {dispute.thread?.seller?.alias?.charAt(0) || "S"}
                  </span>
                  <span style={{ color: "#1A0A00" }}>{dispute.thread?.seller?.alias || "Seller"}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button 
                  onClick={() => window.location.href=`/chat/${dispute.threadId}`}
                  style={{ padding: "6px 14px", fontSize: 12, color: "#3B82F6", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 50, background: "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                  View Chat Log
                </button>
                <button 
                  onClick={() => handleResolve(dispute.id)}
                  style={{ padding: "6px 14px", fontSize: 12, color: "#22C55E", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 50, background: "rgba(34,197,94,0.08)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
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
