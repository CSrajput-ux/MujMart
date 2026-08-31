"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search laptops, books, cycles...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value.trim().length > 2) {
      timeoutRef.current = setTimeout(() => {
        // Would navigate or filter in production
      }, 300);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{ position: "relative" }}>
        {/* Search icon */}
        <svg
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            width: 18,
            height: 18,
            color: "#6B7280",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label="Search listings"
          style={{
            width: "100%",
            paddingLeft: 44,
            paddingRight: 16,
            paddingTop: 14,
            paddingBottom: 14,
            background: "#fff",
            border: "1px solid #F0DDD4",
            borderRadius: 14,
            fontSize: 14,
            color: "#1A0A00",
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            transition: "all 0.2s",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#E8521A";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(232,82,26,0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#F0DDD4";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)";
          }}
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6B7280",
              padding: 0,
              width: 18,
              height: 18,
            }}
            aria-label="Clear search"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search type hints */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 10,
        }}
      >
        {["Laptops", "Books", "Cycles", "Gaming"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setQuery(type);
              router.push(`/search?q=${encodeURIComponent(type)}`);
            }}
            style={{
              fontSize: 12,
              color: "#6B7280",
              fontFamily: "'DM Sans', sans-serif",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E8521A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            {type}
          </button>
        ))}
      </div>
    </form>
  );
}
