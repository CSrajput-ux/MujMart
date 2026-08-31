"use client";

import React from "react";
import DataTable from "@/components/admin/DataTable";
import StatusPill from "@/components/ui/StatusPill";

export default function AdminUsersPage() {
  const columns = [
    { key: "alias", label: "Alias", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "listings", label: "Listings", sortable: true },
    { key: "deals", label: "Deals", sortable: true },
    { key: "status", label: "Status" },
  ];

  const data = [
    { alias: "TechGuru42", email: "tech@example.com", listings: "4", deals: "12", status: <StatusPill label="Active" variant="success" /> },
    { alias: "BookWorm99", email: "book@example.com", listings: "2", deals: "8", status: <StatusPill label="Active" variant="success" /> },
    { alias: "FurnitureKing", email: "furn@example.com", listings: "5", deals: "25", status: <StatusPill label="Active" variant="success" /> },
    { alias: "CycleRider", email: "cycle@example.com", listings: "1", deals: "5", status: <StatusPill label="Warned" variant="warning" /> },
    { alias: "GiveawayGuru", email: "give@example.com", listings: "3", deals: "3", status: <StatusPill label="Active" variant="success" /> },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: 0 }}>
          Users
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
          Student list, warnings, and bans
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Search users..."
        actions={() => (
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button
              style={{
                padding: "4px 12px",
                fontSize: 11,
                color: "#F59E0B",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 50,
                background: "transparent",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              Warn
            </button>
            <button
              style={{
                padding: "4px 12px",
                fontSize: 11,
                color: "#EF4444",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 50,
                background: "transparent",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              Ban
            </button>
          </div>
        )}
      />
    </div>
  );
}
