"use client";

import React from "react";
import DataTable from "@/components/admin/DataTable";
import StatusPill from "@/components/ui/StatusPill";

export default function AdminListingsPage() {
  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "price", label: "Price", sortable: true },
    { key: "status", label: "Status" },
    { key: "seller", label: "Seller", sortable: true },
    { key: "date", label: "Date", sortable: true },
  ];

  const data = [
    { title: "Sony WH-1000XM4", type: "Sell", price: "₹12,500", status: <StatusPill label="Active" variant="success" />, seller: "TechGuru42", date: "Mar 15" },
    { title: "Engineering Maths Book", type: "Resale", price: "₹350", status: <StatusPill label="Active" variant="success" />, seller: "BookWorm99", date: "Mar 14" },
    { title: "Study Desk + Chair", type: "Rent", price: "₹200/day", status: <StatusPill label="Featured" variant="orange" />, seller: "FurnitureKing", date: "Mar 13" },
    { title: 'Firefox Cycle 26"', type: "Sell", price: "₹4,500", status: <StatusPill label="Active" variant="success" />, seller: "CycleRider", date: "Mar 12" },
    { title: "Old Mattress Topper", type: "Free", price: "FREE", status: <StatusPill label="Reported" variant="warning" />, seller: "GiveawayGuru", date: "Mar 11" },
    { title: 'Samsung Monitor 24"', type: "Sell", price: "₹8,900", status: <StatusPill label="Active" variant="success" />, seller: "ScreenDeals", date: "Mar 16" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: 0 }}>
          Listings
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
          Manage all marketplace listings
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Search listings..."
        actions={() => (
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button
              style={{
                padding: "4px 12px",
                fontSize: 11,
                color: "#E8521A",
                border: "1px solid rgba(232,82,26,0.3)",
                borderRadius: 50,
                background: "transparent",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              Feature
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
                transition: "all 0.2s",
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
