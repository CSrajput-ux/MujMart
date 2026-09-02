"use client";

import React from "react";

import { Tag, RefreshCw, Package, Gift } from "lucide-react";

interface ListingTypeCardProps {
  type: "sell" | "resale" | "rent" | "free";
  count: number;
}

const typeConfig = {
  sell: {
    label: "Sell",
    icon: <Tag size={28} />,
    textColor: "#E8521A",
    bgColor: "#FFF0EA",
    description: "Post items for sale",
  },
  resale: {
    label: "Resale",
    icon: <RefreshCw size={28} />,
    textColor: "#8B5CF6",
    bgColor: "#F5F0FF",
    description: "Second-hand deals",
  },
  rent: {
    label: "Rent",
    icon: <Package size={28} />,
    textColor: "#F59E0B",
    bgColor: "#FFFBEA",
    description: "Temporary use items",
  },
  free: {
    label: "Free",
    icon: <Gift size={28} />,
    textColor: "#22C55E",
    bgColor: "#EAFFF2",
    description: "Free giveaways",
  },
};

export default function ListingTypeCard({ type, count }: ListingTypeCardProps) {
  const config = typeConfig[type];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "18px 16px",
        borderRadius: 14,
        background: config.bgColor,
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span style={{ display: "flex", color: config.textColor }}>{config.icon}</span>
      <h3
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 16,
          color: config.textColor,
          margin: 0,
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
      <span
        style={{
          fontSize: 11,
          color: "#6B7280",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span style={{ fontWeight: 600, color: config.textColor }}>{count}</span>{" "}
        listings
      </span>
    </div>
  );
}
