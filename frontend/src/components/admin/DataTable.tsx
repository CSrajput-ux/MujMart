"use client";

import React, { useState } from "react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, React.ReactNode>[];
  actions?: (row: Record<string, React.ReactNode>) => React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export default function DataTable({
  columns,
  data,
  actions,
  searchable = true,
  searchPlaceholder = "Search...",
}: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  let filteredData = data;
  if (search) {
    filteredData = data.filter((row) =>
      Object.values(row).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(search.toLowerCase())
      )
    );
  }

  if (sortKey) {
    filteredData = [...filteredData].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "");
      const bVal = String(b[sortKey] ?? "");
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #F0DDD4",
        overflow: "hidden",
      }}
    >
      {searchable && (
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #F0DDD4",
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              width: "100%",
              maxWidth: 320,
              padding: "8px 14px",
              border: "1px solid #F0DDD4",
              borderRadius: 10,
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
              transition: "border-color 0.2s",
              color: "#1A0A00",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#E8521A")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#F0DDD4")}
          />
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F0DDD4" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: col.sortable ? "pointer" : "default",
                    whiteSpace: "nowrap",
                    transition: "color 0.2s",
                    userSelect: "none",
                  }}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span style={{ marginLeft: 4 }}>
                      {sortDir === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
              {actions && (
                <th
                  style={{
                    padding: "10px 16px",
                    textAlign: "right",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: "1px solid rgba(240,221,212,0.5)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,240,234,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: "10px 16px",
                      fontSize: 13,
                      color: "#1A0A00",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td style={{ padding: "10px 16px", textAlign: "right" }}>
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  style={{
                    padding: "40px 16px",
                    textAlign: "center",
                    fontSize: 13,
                    color: "#6B7280",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid #F0DDD4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: "#6B7280",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0,
          }}
        >
          {filteredData.length} results
        </p>
      </div>
    </div>
  );
}
