"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import StatusPill from "@/components/ui/StatusPill";
import { adminApi, type User } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await adminApi.users({ limit: 100 });
        setUsers(res.users);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const columns = [
    { key: "alias", label: "Alias", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "listings", label: "Listings", sortable: true },
    { key: "deals", label: "Deals", sortable: true },
    { key: "status", label: "Status" },
  ];

  const data = users.map((u) => ({
    id: u.id,
    alias: u.alias,
    email: u.email,
    listings: u._count?.listings?.toString() || "0",
    deals: u.dealCount?.toString() || "0",
    status: <StatusPill label={u.isBanned ? "Banned" : "Active"} variant={u.isBanned ? "danger" : "success"} />,
  }));

  const handleBan = async (id: string, currentlyBanned: boolean) => {
    if (confirm(`Are you sure you want to ${currentlyBanned ? 'unban' : 'ban'} this user?`)) {
      try {
        await adminApi.banUser(id, !currentlyBanned);
        setUsers(users.map(u => u.id === id ? { ...u, isBanned: !currentlyBanned } : u));
      } catch (e) {
        alert("Failed to update user ban status");
      }
    }
  };

  if (loading) return <div style={{ padding: 24, color: "#6B7280" }}>Loading users...</div>;

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
        actions={(row) => {
          const user = users.find(u => u.id === row.id);
          const isBanned = user?.isBanned;
          return (
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button
              onClick={() => handleBan(row.id as string, isBanned)}
              style={{
                padding: "4px 12px",
                fontSize: 11,
                color: isBanned ? "#10B981" : "#EF4444",
                border: `1px solid ${isBanned ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                borderRadius: 50,
                background: "transparent",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              {isBanned ? "Unban" : "Ban"}
            </button>
          </div>
        )}}
      />
    </div>
  );
}
