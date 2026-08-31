import React from "react";

type Variant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "orange"
  | "default";

interface StatusPillProps {
  label: string;
  variant?: Variant;
  size?: "sm" | "md";
}

const variantMap: Record<Variant, { bg: string; color: string; border: string }> = {
  success: { bg: "rgba(34,197,94,0.1)", color: "#22C55E", border: "rgba(34,197,94,0.2)" },
  warning: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.2)" },
  danger: { bg: "rgba(239,68,68,0.1)", color: "#EF4444", border: "rgba(239,68,68,0.2)" },
  info: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", border: "rgba(59,130,246,0.2)" },
  purple: { bg: "rgba(139,92,246,0.1)", color: "#8B5CF6", border: "rgba(139,92,246,0.2)" },
  orange: { bg: "#FFF0EA", color: "#E8521A", border: "rgba(232,82,26,0.2)" },
  default: { bg: "#F3F4F6", color: "#6B7280", border: "rgba(107,114,128,0.2)" },
};

export default function StatusPill({
  label,
  variant = "default",
  size = "sm",
}: StatusPillProps) {
  const v = variantMap[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 50,
        border: `1px solid ${v.border}`,
        fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
        whiteSpace: "nowrap",
        background: v.bg,
        color: v.color,
        fontSize: size === "sm" ? 11 : 13,
        padding: size === "sm" ? "2px 8px" : "4px 12px",
      }}
    >
      {label}
    </span>
  );
}
