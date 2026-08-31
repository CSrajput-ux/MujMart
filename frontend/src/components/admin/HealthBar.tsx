import React from "react";

interface HealthBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: "green" | "orange" | "red" | "blue";
}

const barColorMap: Record<string, string> = {
  green: "#22C55E",
  orange: "#E8521A",
  red: "#EF4444",
  blue: "#3B82F6",
};

export default function HealthBar({
  label,
  value,
  maxValue = 100,
  color = "green",
}: HealthBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "#1A0A00",
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#1A0A00",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 8,
          background: "#F3F4F6",
          borderRadius: 50,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percentage}%`,
            background: barColorMap[color],
            borderRadius: 50,
            transition: "width 0.7s ease-out",
          }}
        />
      </div>
    </div>
  );
}
