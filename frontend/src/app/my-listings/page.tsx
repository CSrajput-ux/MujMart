"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/marketplace/Navbar";
import { useDemo } from "@/lib/DemoContext";
import { useAuth } from "@/lib/AuthContext";
import { listingsApi, transactionsApi, Listing, Transaction } from "@/lib/api";
import { Clock, AlertTriangle, Package, Lock } from "lucide-react";

type Tab = "active" | "purchases" | "sold";

export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const { isDemo, demoUser } = useDemo();
  const { user, requireAuth } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [myPurchases, setMyPurchases] = useState<Transaction[]>([]);
  const [mySales, setMySales] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      if (!user) return;
      try {
        setLoading(true);
        const [listingsRes, txnsRes, salesRes] = await Promise.all([
          listingsApi.list({ seller: user.id, limit: 50 }),
          transactionsApi.list("buyer"),
          transactionsApi.list("seller")
        ]);
        setMyListings(listingsRes.listings || []);
        setMyPurchases(txnsRes.transactions || []);
        setMySales(salesRes.transactions || []);
      } catch (err) {
        console.error("Failed to load my deals:", err);
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, [user]);

  const handleConfirmReceipt = async (id: string) => {
    if (!confirm("Are you sure you have received the item? This will release funds to the seller.")) return;
    try {
      await transactionsApi.confirmReceipt(id);
      alert("Confirmed! Admin will now release payout to seller.");
      setMyPurchases(prev => prev.map(p => p.id === id ? { ...p, status: "ready_for_payout" } : p));
    } catch (e: any) {
      alert(e.message || "Failed to confirm receipt");
    }
  };


  if (!user && !isDemo) {
    return (
      <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
        <Navbar />
        <div style={{ maxWidth: 500, margin: "100px auto", textAlign: "center", padding: "0 24px" }}>
          <div style={{ width: 80, height: 80, margin: "0 auto 20px", background: "#FFF0EA", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={36} color="#E8521A" />
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: "0 0 12px 0" }}>
            Sign in to view your listings
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280", margin: "0 0 24px 0" }}>
            Create listings, track your deals, and manage your campus sales.
          </p>
        </div>
      </main>
    );
  }

  // Earnings summary
  const completedSales = mySales.filter(s => s.status === "completed" || s.status === "ready_for_payout");
  const totalEarned = completedSales.reduce((sum, s) => sum + s.amount, 0);
  const platformFee = totalEarned * 0.05;
  const netEarned = totalEarned - platformFee;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "active", label: "My Listings", count: myListings.length },
    { key: "purchases", label: "My Purchases", count: myPurchases.length },
    { key: "sold", label: "Sold", count: mySales.length },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: 0 }}>
              My Listings
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
              Hi {user?.name || demoUser?.name || "Student"} · Alias: <strong style={{ color: "#E8521A" }}>@{user?.alias || demoUser?.name?.split(" ")[0] || "You"}</strong>
            </p>
          </div>
          <a
            href="/post"
            style={{ padding: "10px 22px", background: "#E8521A", color: "#fff", borderRadius: 50, fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif", textDecoration: "none", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FF6B35")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#E8521A")}
          >
            + New Listing
          </a>
        </div>

        {/* Earnings Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }} className="earnings-grid">
          {[
            { label: "Total Earned", value: `₹${totalEarned.toLocaleString("en-IN")}`, color: "#22C55E", icon: "💰" },
            { label: "Platform Fee (5%)", value: `₹${platformFee.toFixed(0)}`, color: "#F59E0B", icon: "📊" },
            { label: "Net Earnings", value: `₹${netEarned.toFixed(0)}`, color: "#E8521A", icon: "🏦" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 22 }}>{stat.icon}</span>
                <p style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {stat.label}
                </p>
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: stat.color, margin: 0 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#F3F4F6", borderRadius: 12, padding: 4, width: "fit-content" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "8px 20px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeTab === tab.key ? "#fff" : "transparent",
                color: activeTab === tab.key ? "#1A0A00" : "#6B7280",
                boxShadow: activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {tab.label}
              <span style={{ marginLeft: 6, fontSize: 11, color: activeTab === tab.key ? "#E8521A" : "#9CA3AF" }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Active Listings */}
        {activeTab === "active" && (
          <div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#6B7280" }}>Loading your listings...</div>
            ) : myListings.length === 0 ? (
              <EmptyState icon={<Package size={32} color="#E8521A" />} title="No active listings" description="Post your first listing to start selling on campus." ctaText="Post Listing" ctaHref="/post" />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }} className="my-listing-grid">
                {myListings.map((listing) => (
                  <MyListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Purchases */}
        {activeTab === "purchases" && (
          <div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#6B7280" }}>Loading your purchases...</div>
            ) : myPurchases.length === 0 ? (
              <EmptyState icon="🛍️" title="No purchases yet" description="You haven't bought anything via Escrow yet." ctaText="Browse Items" ctaHref="/search" />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }} className="my-listing-grid">
                {myPurchases.map((txn) => (
                  <div key={txn.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", overflow: "hidden" }}>
                    <div style={{ height: 140, overflow: "hidden", position: "relative" }}>
                      <img src={txn.listing?.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000"} alt={txn.listing?.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700, background: txn.status === "completed" ? "#DCFCE7" : "#FEF9C3", color: txn.status === "completed" ? "#15803D" : "#A16207", fontFamily: "'DM Sans', sans-serif" }}>
                        {txn.status === "completed" ? "COMPLETED" : "IN PROGRESS"}
                      </div>
                    </div>
                    <div style={{ padding: 14 }}>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#1A0A00", margin: "0 0 4px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{txn.listing?.title}</p>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#E8521A", margin: "0 0 12px 0" }}>₹{txn.amount.toLocaleString("en-IN")}</p>
                      
                      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                        {txn.status === "pending_payment" && "Waiting for UTR"}
                        {txn.status === "verifying_payment" && "Admin verifying payment"}
                        {txn.status === "escrow" && "Funds secured by Admin"}
                        {txn.status === "ready_for_payout" && "Item received. Awaiting seller payout"}
                        {txn.status === "completed" && "Transaction completed"}
                      </div>

                      {txn.status === "escrow" && (
                        <button
                          onClick={() => handleConfirmReceipt(txn.id)}
                          style={{ width: "100%", padding: "8px", background: "#E8521A", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                        >
                          Confirm Item Received
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sold */}
        {activeTab === "sold" && (
          <div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#6B7280" }}>Loading your sales...</div>
            ) : mySales.length === 0 ? (
              <EmptyState icon="💸" title="No sales yet" description="You haven't sold anything via Escrow yet." ctaText="Post Listing" ctaHref="/post" />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }} className="my-listing-grid">
                {mySales.map((txn) => (
                  <div
                    key={txn.id}
                    style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", overflow: "hidden", opacity: txn.status === "completed" ? 0.8 : 1 }}
                  >
                    <div style={{ height: 140, overflow: "hidden", position: "relative" }}>
                      <img src={txn.listing?.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000"} alt={txn.listing?.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: txn.status === "completed" ? "grayscale(30%)" : "none" }} />
                      <div style={{ position: "absolute", inset: 0, background: txn.status === "completed" ? "rgba(0,0,0,0.15)" : "none", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                        <span style={{ background: txn.status === "completed" ? "#22C55E" : "#E8521A", color: "#fff", padding: "4px 14px", borderRadius: 50, fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                          {txn.status === "completed" ? "SOLD & PAID" : txn.status.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: 14 }}>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#1A0A00", margin: "0 0 4px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{txn.listing?.title}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#22C55E", margin: "0 0 8px 0" }}>₹{txn.sellerAmount?.toLocaleString("en-IN") || (txn.amount - txn.amount * 0.05).toLocaleString("en-IN")} earned</p>
                      <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>
                        {txn.status === "pending_payment" && "Waiting for buyer to pay"}
                        {txn.status === "verifying_payment" && "Admin verifying payment"}
                        {txn.status === "escrow" && "Deliver item to buyer"}
                        {txn.status === "ready_for_payout" && "Waiting for admin payout"}
                        {txn.status === "completed" && "Payment sent to your UPI"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .earnings-grid { grid-template-columns: 1fr 1fr !important; }
          .my-listing-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .earnings-grid { grid-template-columns: 1fr !important; }
          .my-listing-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </main>
  );
}

function MyListingCard({ listing }: { listing: Listing }) {
  const daysLeft = 7 - Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / 86400000);
  const urgency = daysLeft <= 2;

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", overflow: "hidden" }}>
      <div style={{ height: 140, overflow: "hidden", position: "relative" }}>
        <img src={listing.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000"} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700, background: "#DCFCE7", color: "#15803D", fontFamily: "'DM Sans', sans-serif" }}>
          ACTIVE
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#1A0A00", margin: "0 0 4px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {listing.title}
        </p>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#E8521A", margin: "0 0 12px 0" }}>
          {listing.price === 0 ? "FREE" : `₹${listing.price.toLocaleString("en-IN")}`}
        </p>

        <p style={{ fontSize: 11, color: urgency ? "#EF4444" : "#9CA3AF", fontFamily: "'DM Sans', sans-serif", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: 4 }}>
          {urgency ? <><AlertTriangle size={12} /> Expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}</> : <><Clock size={12} /> {Math.max(0, daysLeft)} days left</>}
        </p>

        <div style={{ display: "flex", gap: 8 }}>
          <a
            href={`/listing/${listing.id}`}
            style={{ flex: 1, padding: "7px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#E8521A", border: "1px solid #F0DDD4", borderRadius: 8, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
          >
            View
          </a>
          <button
            style={{ flex: 1, padding: "7px", fontSize: 12, fontWeight: 600, color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, background: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, ctaText, ctaHref }: { icon: React.ReactNode; title: string; description: string; ctaText: string; ctaHref: string }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#FFF0EA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#1A0A00", marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>{description}</p>
      <a href={ctaHref} style={{ padding: "10px 24px", background: "#E8521A", color: "#fff", borderRadius: 50, fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif", textDecoration: "none" }}>
        {ctaText}
      </a>
    </div>
  );
}
