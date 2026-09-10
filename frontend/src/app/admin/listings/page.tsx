"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import StatusPill from "@/components/ui/StatusPill";
import { adminApi, type Listing } from "@/lib/api";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      try {
        const res = await adminApi.listings({ limit: 100 });
        setListings(res.listings);
      } catch (err) {
        console.error("Failed to load listings", err);
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, []);

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "price", label: "Price", sortable: true },
    { key: "status", label: "Status" },
    { key: "seller", label: "Seller", sortable: true },
    { key: "date", label: "Date", sortable: true },
  ];

  const data = listings.map((l) => {
    let variant: "success" | "danger" | "warning" | "orange" = "success";
    if (l.status === "removed") variant = "danger";
    if (l.status === "expired") variant = "warning";
    if (l.status === "sold") variant = "orange";
    
    return {
      id: l.id,
      title: l.title,
      type: l.type,
      price: l.price === 0 ? "FREE" : `₹${l.price.toLocaleString("en-IN")}`,
      status: <StatusPill label={l.status.charAt(0).toUpperCase() + l.status.slice(1)} variant={variant} />,
      seller: l.seller?.alias || "Unknown",
      date: new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateListing(id, newStatus);
      setListings(listings.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (e) {
      alert("Failed to update listing status");
    }
  };

  if (loading) return <div style={{ padding: 24, color: "#6B7280" }}>Loading listings...</div>;

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
        actions={(row) => {
          const listing = listings.find(l => l.id === row.id);
          const isRemoved = listing?.status === "removed";
          return (
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            {!isRemoved && (
              <button
                onClick={() => handleUpdateStatus(row.id as string, "removed")}
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
                Remove
              </button>
            )}
            {isRemoved && (
              <button
                onClick={() => handleUpdateStatus(row.id as string, "active")}
                style={{
                  padding: "4px 12px",
                  fontSize: 11,
                  color: "#10B981",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: 50,
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                Restore
              </button>
            )}
          </div>
        )}}
      />
    </div>
  );
}
