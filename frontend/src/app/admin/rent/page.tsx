"use client";

import React from "react";
import StatusPill from "@/components/ui/StatusPill";

interface RentApproval {
  id: string;
  listing: string;
  seller: string;
  proposedRate: number;
  ceilingRate: number;
  duration: string;
  status: "pending" | "approved" | "rejected";
}

const approvals: RentApproval[] = [
  { id: "R001", listing: "Study Desk + Chair", seller: "FurnitureKing", proposedRate: 200, ceilingRate: 250, duration: "3 days", status: "pending" },
  { id: "R002", listing: "Projector Rental", seller: "TechGuru42", proposedRate: 500, ceilingRate: 400, duration: "1 day", status: "pending" },
  { id: "R003", listing: "Guitar Acoustic", seller: "MusicLover", proposedRate: 100, ceilingRate: 150, duration: "7 days", status: "pending" },
  { id: "R004", listing: "DSLR Camera", seller: "PhotoPro", proposedRate: 800, ceilingRate: 600, duration: "2 days", status: "pending" },
  { id: "R005", listing: "Toolkit Set", seller: "MakerSpace", proposedRate: 50, ceilingRate: 100, duration: "5 days", status: "approved" },
  { id: "R006", listing: "Party Speakers", seller: "SoundWave", proposedRate: 700, ceilingRate: 500, duration: "1 day", status: "rejected" },
  { id: "R007", listing: "Lab Coat", seller: "PreMed101", proposedRate: 30, ceilingRate: 50, duration: "30 days", status: "pending" },
];

export default function AdminRentPage() {
  const pendingCount = approvals.filter((a) => a.status === "pending").length;

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
        {approvals.map((approval) => {
          const overCeiling = approval.proposedRate > approval.ceilingRate;

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
                        approval.status === "approved" ? "success" :
                        approval.status === "rejected" ? "danger" : "warning"
                      }
                    />
                    {overCeiling && <StatusPill label="Over Ceiling" variant="danger" />}
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1A0A00", margin: 0 }}>
                    {approval.listing}
                  </p>
                  <p style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                    by {approval.seller} · {approval.duration}
                  </p>

                  {/* Price comparison */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
                    <div>
                      <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", display: "block" }}>
                        Proposed
                      </span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: overCeiling ? "#EF4444" : "#22C55E" }}>
                        ₹{approval.proposedRate}/day
                      </span>
                    </div>
                    <span style={{ color: "#6B7280", fontSize: 13 }}>vs</span>
                    <div>
                      <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", display: "block" }}>
                        Ceiling
                      </span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A0A00" }}>
                        ₹{approval.ceilingRate}/day
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
