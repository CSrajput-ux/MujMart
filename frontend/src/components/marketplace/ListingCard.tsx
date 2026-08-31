"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import type { Listing } from "@/lib/api";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { addToCart, cartItems } = useCart();
  const { requireAuth } = useAuth();
  const inCart = cartItems.some((item) => item.id === listing.id);

  // Mock discount generation
  const originalPrice = listing.type === "sell" || listing.type === "resale" ? Math.round(listing.price * 1.5) : listing.price;
  const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - listing.price) / originalPrice) * 100) : 0;

  return (
    <Link href={`/listing/${listing.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        className="listing-card-hover"
        style={{
          background: "#fff",
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid #E5E7EB",
          transition: "all 0.2s ease",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image area */}
        <div
          style={{
            height: 140,
            background: "#F3F4F6",
            position: "relative",
            overflow: "hidden",
            padding: 12,
          }}
          className="card-image-container"
        >
          <img
            src={listing.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000"}
            alt={listing.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              borderRadius: 6,
            }}
          />
        </div>

        {/* Card body */}
        <div
          style={{
            padding: "14px",
            background: "#fff",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Category & Time */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#E8521A",
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {listing.category}
            </span>
            <span style={{ fontSize: 11, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 4 }}>
              🕒 3d ago
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#1A0A00",
              margin: "0 0 12px 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {listing.title}
          </h3>

          {/* Price & Discount */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            {listing.type === "free" ? (
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#E8521A" }}>FREE</span>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {discountPercent > 0 && <span style={{ fontSize: 12, color: "#EF4444", textDecoration: "line-through", fontWeight: 600 }}>Rs{originalPrice}</span>}
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#E8521A" }}>
                  Rs{listing.price.toLocaleString("en-IN")}
                  {listing.type === "rent" && <span style={{ fontSize: 11, fontWeight: 400, color: "#6B7280" }}>/day</span>}
                </span>
              </div>
            )}
            
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <span style={{ padding: "2px 6px", borderRadius: 50, border: "1px solid #EF4444", color: "#EF4444", fontSize: 11, fontWeight: 600 }}>
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!inCart) {
                requireAuth(() => addToCart(listing));
              }
            }}
            style={{
              width: "100%",
              padding: "10px",
              background: inCart ? "#F3F4F6" : "#E8521A",
              color: inCart ? "#1A0A00" : "#fff",
              border: inCart ? "1px solid #E5E7EB" : "none",
              borderRadius: 6,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: inCart ? "default" : "pointer",
              transition: "background 0.2s",
              marginBottom: 12,
            }}
            onMouseEnter={(e) => !inCart && (e.currentTarget.style.background = "#FF6B35")}
            onMouseLeave={(e) => !inCart && (e.currentTarget.style.background = "#E8521A")}
          >
            {inCart ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Added to Cart
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Add to Cart
              </>
            )}
          </button>

          {/* Footer: Verified & ID */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6B7280" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              Verified
            </span>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>ID: {listing.id.padStart(4, "0").substring(0, 4)}</span>
          </div>
        </div>
      </div>
      <style>{`
        .listing-card-hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
        .listing-card-hover:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); transform: translateY(-2px); }
        @media (max-width: 768px) {
          .card-image-container { height: 110px !important; padding: 8px !important; }
        }
      `}</style>
    </Link>
  );
}
