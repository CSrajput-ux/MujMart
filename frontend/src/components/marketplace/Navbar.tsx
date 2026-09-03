"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/DemoContext";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { notificationsApi, requestsApi } from "@/lib/api";

export default function Navbar() {
  const { isDemo, demoUser } = useDemo();
  const { totalItems } = useCart();
  const { user, requireAuth, showAuthModal, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  React.useEffect(() => {
    if (user) {
      Promise.all([notificationsApi.list(), requestsApi.incoming()]).then(([notifs, reqs]) => {
        const pendingReqs = reqs.filter(r => r.status === 'pending').length;
        const unreadNotifs = notifs.filter(n => !n.isRead).length;
        setUnreadCount(pendingReqs + unreadNotifs);
      }).catch(console.error);
    }
  }, [user]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Rent", path: "/search?type=rent" },
    { label: "Tasks", path: "/search?type=query" },
    { label: "Browse", path: "/search" },
    { label: "My Deals", path: "/my-listings" },
    { label: "Messages", path: "/chat/t1" },
    { label: "Cart", path: "/cart" },
  ];

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 60,
          width: "100%",
          background: "rgba(253,248,245,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #F0DDD4",
          padding: "0 20px",
          maxWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="navbar-container"
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 20,
            color: "#E8521A",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <img
            src="/logo.jpg"
            alt="MUJMart Logo"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              objectFit: "contain",
              background: "#fff",
              display: "flex"
            }}
          />
          MUJMart
        </Link>

        {/* Desktop Nav Links */}
        <div
          className="desktop-nav"
          style={{
            display: "none",
            gap: 24,
            alignItems: "center",
          }}
        >
          {navItems.map((item) => {
            const isProtected = ["Messages", "Cart", "My Deals"].includes(item.label);

            return (
              <a
                key={item.label}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  if (isProtected) {
                    requireAuth(() => router.push(item.path));
                  } else {
                    router.push(item.path);
                  }
                }}
                style={{
                  fontSize: 13,
                  color: "#5C3A1E",
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  transition: "color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8521A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#5C3A1E")}
              >
                {item.label === "Cart" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                )}
                {item.label}
                {item.label === "Cart" && totalItems > 0 && (
                  <span style={{ background: "#E8521A", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 10, marginLeft: -2 }}>
                    {totalItems}
                  </span>
                )}
              </a>
            );
          })}
        </div>

        {/* Right buttons / Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="desktop-nav" style={{ display: "none", alignItems: "center", gap: 12 }}>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "#5C3A1E",
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "#FFF0EA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#E8521A",
                      fontWeight: 700,
                      fontSize: 12,
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    {user.name.charAt(0)}
                  </span>
                  {user.name}
                </div>
                
                <a href="/notifications" style={{ position: "relative", color: "#5C3A1E", textDecoration: "none", display: "flex", alignItems: "center", marginRight: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {unreadCount > 0 && (
                    <span style={{ position: "absolute", top: -8, right: -10, background: "#E8521A", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 10 }}>
                      {unreadCount}
                    </span>
                  )}
                </a>

                <a href="/settings" style={{ fontSize: 13, color: "#6B7280", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Settings</a>
                <button
                  onClick={logout}
                  style={{ fontSize: 13, color: "#E8521A", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Log out
                </button>
              </div>
            ) : isDemo && demoUser ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#5C3A1E",
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#FFF0EA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#E8521A",
                    fontWeight: 700,
                    fontSize: 12,
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {demoUser.name.charAt(0)}
                </span>
                {demoUser.name} (Demo)
              </div>
            ) : (
              <button
                onClick={showAuthModal}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#5C3A1E",
                  background: "transparent",
                  border: "1.5px solid #F0DDD4",
                  borderRadius: 10,
                  padding: "7px 18px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#E8521A";
                  e.currentTarget.style.color = "#E8521A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#F0DDD4";
                  e.currentTarget.style.color = "#5C3A1E";
                }}
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => requireAuth(() => router.push("/post"))}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                background: "#E8521A",
                borderRadius: 10,
                padding: "8px 20px",
                textDecoration: "none",
                fontFamily: "'Syne', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FF6B35")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#E8521A")}
            >
              + Post Listing
            </button>
          </div>

          {/* Hamburger Icon */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              padding: 8,
              background: "none",
              border: "none",
              color: "#E8521A",
              cursor: "pointer",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            style={{
              position: "fixed",
              top: 60,
              left: 0,
              width: "100%",
              background: "#fff",
              borderBottom: "1px solid #F0DDD4",
              zIndex: 49,
              padding: "20px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {navItems.map((item) => {
              const isProtected = ["Messages", "Cart", "My Deals"].includes(item.label);
              return (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    if (isProtected) {
                      requireAuth(() => router.push(item.path));
                    } else {
                      router.push(item.path);
                    }
                  }}
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#5C3A1E",
                    textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 0",
                  }}
                >
                  {item.label === "Cart" && (
                    <div style={{ position: "relative" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                      {totalItems > 0 && (
                        <span style={{ position: "absolute", top: -8, right: -8, background: "#E8521A", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 10 }}>
                          {totalItems}
                        </span>
                      )}
                    </div>
                  )}
                  {item.label}
                </a>
              );
            })}
            <div style={{ height: 1, background: "#F0DDD4", margin: "8px 0" }} />
            {user ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#E8521A", fontWeight: 700 }}>
                  <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFF0EA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {user.name.charAt(0)}
                  </span>
                  {user.name}
                </div>
                <a
                  href="/notifications"
                  style={{ width: "100%", padding: "12px", background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 10, fontWeight: 600, cursor: "pointer", textDecoration: "none", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span style={{ background: "#E8521A", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 10 }}>
                      {unreadCount}
                    </span>
                  )}
                </a>
                <a
                  href="/settings"
                  style={{ width: "100%", padding: "12px", background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 10, fontWeight: 600, cursor: "pointer", textDecoration: "none", textAlign: "center", display: "block" }}
                >
                  Settings
                </a>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  style={{ width: "100%", padding: "12px", background: "#FFF0EA", color: "#E8521A", border: "1px solid #F0DDD4", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}
                >
                  Log out
                </button>
              </>
            ) : isDemo && demoUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#E8521A", fontWeight: 700 }}>
                <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFF0EA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {demoUser.name.charAt(0)}
                </span>
                {demoUser.name} (Demo)
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); showAuthModal(); }}
                style={{ width: "100%", padding: "12px", background: "#FFF0EA", color: "#E8521A", border: "1px solid #F0DDD4", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => { setMobileMenuOpen(false); requireAuth(() => router.push("/post")); }}
              style={{ width: "100%", padding: "12px", background: "#E8521A", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}
            >
              + Post Listing
            </button>
          </div>
        )}

        <style>{`
          @media (min-width: 768px) {
            .desktop-nav { display: flex !important; }
            .navbar-container { padding: 0 40px !important; }
          }
          @media (max-width: 767px) {
            .mobile-hamburger { display: block !important; }
          }
        `}</style>
      </nav>
    </>
  );
}
