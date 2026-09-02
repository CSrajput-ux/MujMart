"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/marketplace/Navbar";
import CategoryChips from "@/components/marketplace/CategoryChips";
import ListingGrid from "@/components/marketplace/ListingGrid";
import { listingsApi, Listing } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "All";
  const typeParam = searchParams.get("type") || "";

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState("recent");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [conditionFilter, setConditionFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        const res = await listingsApi.list({
          q: query || undefined,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          type: typeParam || undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sort: sortBy as any,
          limit: 50,
        });
        
        let filtered = res.listings || [];
        if (conditionFilter.length > 0) {
          filtered = filtered.filter(l => conditionFilter.includes(l.condition));
        }
        setListings(filtered);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, [query, selectedCategory, typeParam, sortBy, priceRange, conditionFilter]);

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 20px 64px" }} className="search-container">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24, flexDirection: "row" }} className="search-header">
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: 0 }}>
              {query ? `Results for "${query}"` : "Browse All Listings"}
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
              {loading ? "Searching..." : `${listings.length} ${listings.length === 1 ? "listing" : "listings"} found`}
            </p>
          </div>

          <div className="filter-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 14px",
                border: "1px solid #F0DDD4",
                borderRadius: 10,
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
                background: "#fff",
                color: "#1A0A00",
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "8px 14px",
                border: showFilters ? "1px solid #E8521A" : "1px solid #F0DDD4",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                background: showFilters ? "#FFF0EA" : "#fff",
                color: showFilters ? "#E8521A" : "#6B7280",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {showFilters && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", padding: 24, marginBottom: 24 }} className="animate-fade-in">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }} className="filter-grid">
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#1A0A00", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Price Range</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} placeholder="Min" style={{ width: "100%", padding: "8px 12px", border: "1px solid #F0DDD4", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#1A0A00" }} />
                  <span style={{ color: "#6B7280" }}>—</span>
                  <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} placeholder="Max" style={{ width: "100%", padding: "8px 12px", border: "1px solid #F0DDD4", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#1A0A00" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#1A0A00", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Condition</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["New", "Good", "Fair", "Damaged"].map((c) => (
                    <button key={c} onClick={() => setConditionFilter((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])} style={{ padding: "5px 12px", borderRadius: 50, fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", background: conditionFilter.includes(c) ? "#E8521A" : "#F3F4F6", color: conditionFilter.includes(c) ? "#fff" : "#6B7280", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <ListingGrid listings={listings} />

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 14, color: "#6B7280" }}>Loading listings...</p>
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }} className="animate-fade-in">
            <div style={{ width: 80, height: 80, margin: "0 auto 16px", background: "#FFF0EA", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg style={{ width: 40, height: 40, color: "rgba(232,82,26,0.4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#1A0A00", marginBottom: 8 }}>No listings found</h3>
            <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>Try adjusting your filters or search with different keywords.</p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .search-container { padding-top: 20px !important; padding-bottom: 32px !important; }
          .search-header { flex-direction: column !important; align-items: stretch !important; }
          .filter-actions { width: 100% !important; justify-content: space-between !important; }
          .filter-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#FDF8F5", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 32, height: 32, border: "3px solid #E8521A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div>}>
      <SearchContent />
    </Suspense>
  );
}
