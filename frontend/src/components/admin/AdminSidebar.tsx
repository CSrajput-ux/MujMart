"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/lib/DemoContext";

import { LayoutDashboard, ShieldCheck, Package, Users, AlertTriangle, Home, Coins, Settings } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} />, badge: null },
  { href: "/admin/escrow", label: "Escrow Payments", icon: <ShieldCheck size={18} />, badge: "New" },
  { href: "/admin/listings", label: "Listings", icon: <Package size={18} />, badge: "347" },
  { href: "/admin/users", label: "Users", icon: <Users size={18} />, badge: null },
  { href: "/admin/disputes", label: "Disputes", icon: <AlertTriangle size={18} />, badge: "4" },
  { href: "/admin/rent", label: "Rent Approvals", icon: <Home size={18} />, badge: "7" },
  { href: "/admin/margins", label: "Margins", icon: <Coins size={18} />, badge: null },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={18} />, badge: null },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isDemo, demoUser, exitDemoMode } = useDemo();

  return (
    <aside
      style={{
        width: 250,
        background: "#fff",
        borderRight: "1px solid #F0DDD4",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Demo banner inside sidebar */}
      {isDemo && demoUser && (
        <div
          style={{
            padding: "8px 16px",
            background: "rgba(245,158,11,0.1)",
            borderBottom: "1px solid rgba(245,158,11,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#F59E0B",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            🧪 Demo Mode
          </span>
          <button
            onClick={exitDemoMode}
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#F59E0B",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 6,
              padding: "2px 8px",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Exit
          </button>
        </div>
      )}

      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid #F0DDD4",
        }}
      >
        <Link
          href="/admin"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <img
            src="/logo.jpg"
            alt="MUJMart Logo"
            style={{ width: 34, height: 34, borderRadius: 8, objectFit: "contain", background: "#fff" }}
          />
          <div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 17,
                color: "#1A0A00",
                display: "block",
                lineHeight: 1.2,
              }}
            >
              MUJ<span style={{ color: "#E8521A" }}>Mart</span>
            </span>
            <span
              style={{
                fontSize: 10,
                color: "#6B7280",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav
        style={{
          flex: 1,
          padding: "12px 12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
                background: isActive ? "#FFF0EA" : "transparent",
                color: isActive ? "#E8521A" : "#6B7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#F3F4F6";
                  e.currentTarget.style.color = "#1A0A00";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#6B7280";
                }
              }}
            >
              <span style={{ width: 20, textAlign: "center", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 50,
                    fontSize: 10,
                    fontWeight: 600,
                    background: isActive ? "#E8521A" : "rgba(239,68,68,0.1)",
                    color: isActive ? "#fff" : "#EF4444",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        style={{
          padding: "12px 12px",
          borderTop: "1px solid #F0DDD4",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            fontSize: 13,
            color: "#6B7280",
            textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: 10,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FFF0EA";
            e.currentTarget.style.color = "#E8521A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#6B7280";
          }}
        >
          <span style={{ fontSize: 14 }}>←</span>
          <span>Back to Marketplace</span>
        </Link>
      </div>
    </aside>
  );
}
