"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/marketplace/Navbar";
import { listingsApi, Listing } from "@/lib/api";

interface ProfileUser {
  id: string;
  alias: string;
  repScore: number;
  dealCount: number;
  role: string;
  createdAt: string;
  _count?: { listings: number };
}

const TRUST_BADGES = [
  { min: 1, icon: "🌱", label: "New Member" },
  { min: 5, icon: "⭐", label: "Trusted Seller" },
  { min: 15, icon: "🔥", label: "Power Seller" },
  { min: 30, icon: "🏆", label: "Campus Legend" },
];

function getBadge(dealCount: number) {
  return (
    TRUST_BADGES.slice()
      .reverse()
      .find((b) => dealCount >= b.min) || TRUST_BADGES[0]
  );
}

function StarRating({ score }: { score: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            fontSize: 16,
            color: i <= Math.round(score) ? "#F59E0B" : "#E5E7EB",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.id as string;

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In demo mode, use mock data
    setTimeout(() => {
      setUser({
        id: userId,
        alias: "TechGuru42",
        repScore: 4.8,
        dealCount: 12,
        role: "student",
        createdAt: "2026-01-15T00:00:00.000Z",
        _count: { listings: 4 },
      });
      setListings([]);
      setLoading(false);
    }, 400);
  }, [userId]);

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <div style={{ width: 36, height: 36, border: "3px solid #E8521A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
        <Navbar />
        <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#1A0A00" }}>
            User Not Found
          </h1>
          <a href="/" style={{ color: "#E8521A", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
            ← Back to Marketplace
          </a>
        </div>
      </main>
    );
  }

  const badge = getBadge(user.dealCount);
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 24px 80px" }}>
        {/* Profile Header Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFF9F7 0%, #FFE4D9 100%)",
            borderRadius: 24,
            border: "1px solid #F0DDD4",
            padding: "36px 40px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 32,
            position: "relative",
            overflow: "hidden",
          }}
          className="profile-header"
        >
          {/* Background decoration */}
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(232,82,26,0.06)",
            }}
          />

          {/* Avatar */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #E8521A, #FF6B35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 40,
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(232,82,26,0.3)",
            }}
          >
            {user.alias.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  color: "#1A0A00",
                  margin: 0,
                }}
              >
                {user.alias}
              </h1>
              <span
                style={{
                  padding: "4px 14px",
                  background: "#FFF0EA",
                  color: "#E8521A",
                  borderRadius: 50,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  border: "1px solid rgba(232,82,26,0.2)",
                }}
              >
                {badge.icon} {badge.label}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <StarRating score={user.repScore} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B7280" }}>
                {user.repScore.toFixed(1)} rep score
              </span>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {[
                { label: "Deals Completed", value: user.dealCount, icon: "🤝" },
                { label: "Active Listings", value: user._count?.listings || 0, icon: "📦" },
                { label: "Member Since", value: memberSince, icon: "📅" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#1A0A00", margin: 0 }}>
                    {stat.icon} {stat.value}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9CA3AF", margin: "2px 0 0 0" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reputation bar */}
          <div style={{ textAlign: "center", flexShrink: 0 }} className="rep-column">
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `conic-gradient(#E8521A ${(user.repScore / 5) * 360}deg, #F0DDD4 0deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "#FFF9F7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#1A0A00", lineHeight: 1 }}>
                  {user.repScore.toFixed(1)}
                </span>
                <span style={{ fontSize: 8, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>/ 5.0</span>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>
              Rep Score
            </p>
          </div>
        </div>

        {/* Listings Section */}
        <div style={{ marginTop: 24 }}>
          {loading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#6B7280" }}>Loading listings...</div>
          ) : listings.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#6B7280" }}>No active listings</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }} className="listings-grid">
              {listings.map((listing) => (
                <a key={listing.id} href={`/listing/${listing.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #F0DDD4" }}>
                    <div style={{ position: "relative", paddingTop: "75%" }}>
                      <img src={listing.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000"} alt={listing.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: 16 }}>
                      <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, margin: "0 0 8px 0" }}>{listing.title}</h4>
                      <p style={{ fontSize: 14, color: "#E8521A", fontWeight: 700, margin: 0 }}>₹{listing.price}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-header { flex-direction: column !important; padding: 24px !important; }
          .rep-column { display: none; }
          .profile-listings-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .profile-listings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
