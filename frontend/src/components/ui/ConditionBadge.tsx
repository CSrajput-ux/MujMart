import React from "react";

type Condition = "New" | "Good" | "Fair" | "Damaged";

interface ConditionBadgeProps {
  condition: Condition;
}

const conditionStyles: Record<Condition, string> = {
  New: "bg-green/10 text-green border-green/20",
  Good: "bg-blue/10 text-blue border-blue/20",
  Fair: "bg-amber/10 text-amber border-amber/20",
  Damaged: "bg-red/10 text-red border-red/20",
};

export default function ConditionBadge({ condition }: ConditionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium font-[family-name:var(--font-dm)] transition-all duration-200 ${conditionStyles[condition]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          condition === "New"
            ? "bg-green"
            : condition === "Good"
            ? "bg-blue"
            : condition === "Fair"
            ? "bg-amber"
            : "bg-red"
        }`}
      />
      {condition}
    </span>
  );
}
