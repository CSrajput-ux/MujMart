"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <AdminSidebar />
      <main
        style={{
          marginLeft: 250,
          minHeight: "100vh",
          padding: "28px 32px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
