"use client";

import React, { useRef } from "react";
import { categories } from "@/lib/mockData";

interface CategoryChipsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryChips({
  selected,
  onSelect,
}: CategoryChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            style={{
              padding: "8px 16px",
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: "nowrap",
              fontFamily: "'DM Sans', sans-serif",
              border:
                selected === category
                  ? "none"
                  : "1px solid #F0DDD4",
              background:
                selected === category ? "#E8521A" : "#fff",
              color:
                selected === category ? "#fff" : "#5C3A1E",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
              boxShadow:
                selected === category
                  ? "0 4px 12px rgba(232,82,26,0.25)"
                  : "none",
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
