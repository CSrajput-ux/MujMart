"use client";

import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: string;
  color?: "green" | "red" | "orange" | "blue" | "purple";
}

const dotColorMap: Record<string, string> = {
  green: "#22C55E",
  red: "#EF4444",
  orange: "#E8521A",
  blue: "#3B82F6",
  purple: "#8B5CF6",
};

export default function MetricCard({
  label,
  value,
  trend,
  trendUp,
  icon,
  color = "orange",
}: MetricCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #F0DDD4",
        padding: "18px 20px",
        transition: "box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: dotColorMap[color],
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "#6B7280",
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {label}
          </span>
        </div>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      </div>
      <p
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 24,
          color: "#1A0A00",
          margin: "0 0 4px 0",
        }}
      >
        {value}
      </p>
      {trend && (
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            color: trendUp ? "#22C55E" : "#EF4444",
            margin: 0,
          }}
        >
          {trendUp ? "↑" : "↓"} {trend}
        </p>
      )}
    </div>
  );
}
