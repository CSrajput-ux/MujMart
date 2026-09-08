"use client";

import React from "react";
import Link from "next/link";

interface ListingTypeCardProps {
  type: "sell" | "resale" | "rent" | "free";
  count: number;
}

const typeConfig = {
  sell: {
    label: "Sell",
    icon: "🏷️",
    textColor: "#E8521A",
    bgColor: "#FFF0EA",
    borderColor: "rgba(232, 82, 26, 0.2)",
    description: "Post items for sale",
  },
  resale: {
    label: "Resale",
    icon: "🔄",
    textColor: "#8B5CF6",
    bgColor: "#F5F0FF",
    borderColor: "rgba(139, 92, 246, 0.2)",
    description: "Second-hand deals",
  },
  rent: {
    label: "Rent",
    icon: "📦",
    textColor: "#D97706",
    bgColor: "#FFFBEA",
    borderColor: "rgba(217, 119, 6, 0.2)",
    description: "Temporary use items",
  },
  free: {
    label: "Free",
    icon: "🎁",
    textColor: "#16A34A",
    bgColor: "#EAFFF2",
    borderColor: "rgba(22, 163, 74, 0.2)",
    description: "Free giveaways",
  },
};

export default function ListingTypeCard({ type, count }: ListingTypeCardProps) {
  const config = typeConfig[type];

  return (
    <Link
      href={`/search?type=${type}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        outline: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: "18px 16px",
          borderRadius: 14,
          background: config.bgColor,
          border: `1.5px solid ${config.borderColor}`,
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          height: "100%",
          boxSizing: "border-box",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.08)";
          e.currentTarget.style.borderColor = config.textColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = config.borderColor;
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>{config.icon}</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.85)",
              color: config.textColor,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {count} {count === 1 ? "listing" : "listings"}
          </span>
        </div>
        <h3
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 16,
            color: config.textColor,
            margin: "4px 0 0 0",
          }}
        >
          {config.label}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "#6B7280",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0,
          }}
        >
          {config.description}
        </p>
      </div>
    </Link>
  );
}

