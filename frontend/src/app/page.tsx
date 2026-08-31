"use client";

import React, { useState } from "react";
import Navbar from "@/components/marketplace/Navbar";
import HeroBanner from "@/components/marketplace/HeroBanner";
import CategoryChips from "@/components/marketplace/CategoryChips";
import ListingTypeCard from "@/components/marketplace/ListingTypeCard";
import ListingGrid from "@/components/marketplace/ListingGrid";
import SearchBar from "@/components/marketplace/SearchBar";
import { listingsApi, Listing } from "@/lib/api";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        const res = await listingsApi.list({ limit: 12 });
        setAllListings(res.listings || []);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, []);

  const filteredListings =
    selectedCategory === "All"
      ? allListings
      : allListings.filter((l) => l.category === selectedCategory);

  const typeCounts = {
    sell: allListings.filter((l) => l.type === "sell").length,
    resale: allListings.filter((l) => l.type === "resale").length,
    rent: allListings.filter((l) => l.type === "rent").length,
    free: allListings.filter((l) => l.type === "free").length,
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />
      <HeroBanner />

      {/* Search Section */}
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 40px",
          marginTop: -24,
          position: "relative",
          zIndex: 20,
        }}
      >
        <SearchBar />
      </section>

      {/* Listing Type Cards */}
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 40px",
          marginTop: 48,
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 22,
              color: "#1A0A00",
              margin: 0,
            }}
          >
            Explore by Type
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#6B7280",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 4,
            }}
          >
            Find what you need by listing type
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 12,
          }}
          className="type-cards-grid"
        >
          {(["sell", "resale", "rent", "free"] as const).map((type) => (
            <ListingTypeCard key={type} type={type} count={typeCounts[type]} />
          ))}
        </div>
      </section>

      {/* Category Filter + Listings Grid */}
      <section
        id="listings"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 40px",
          marginTop: 48,
          paddingBottom: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 22,
                color: "#1A0A00",
                margin: 0,
              }}
            >
              Fresh Listings
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#6B7280",
                fontFamily: "'DM Sans', sans-serif",
                marginTop: 4,
              }}
            >
              Trending on campus right now
            </p>
          </div>
          <a
            href="/search"
            style={{
              fontSize: 13,
              color: "#E8521A",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            See all →
          </a>
        </div>

        <div style={{ marginBottom: 20 }}>
          <CategoryChips
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <ListingGrid listings={filteredListings} />

        {loading && (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#6B7280" }}>
            Loading...
          </div>
        )}

        {!loading && filteredListings.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "64px 0",
              color: "#6B7280",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
            }}
          >
            No listings found in this category.
          </div>
        )}
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#fff",
          borderTop: "1px solid #F0DDD4",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "40px 40px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
              gap: 32,
            }}
            className="footer-grid"
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    background: "#E8521A",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  M
                </span>
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: "#1A0A00",
                  }}
                >
                  MUJ<span style={{ color: "#E8521A" }}>Mart</span>
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                The campus marketplace for
                <br />
                MUJ students.
              </p>
            </div>

            {/* Links */}
            {[
              {
                title: "Marketplace",
                links: ["Browse", "Sell", "Rent", "Free"],
              },
              {
                title: "Support",
                links: ["Help Center", "Safety Tips", "Report Issue"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Community Rules"],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#1A0A00",
                    marginBottom: 12,
                  }}
                >
                  {section.title}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {section.links.map((link) => (
                    <li key={link} style={{ marginBottom: 8 }}>
                      <a
                        href="#"
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          textDecoration: "none",
                          fontFamily: "'DM Sans', sans-serif",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#E8521A")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#6B7280")
                        }
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid #F0DDD4",
              marginTop: 32,
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "#6B7280",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              © 2026 MUJMart. Made for MUJ students, by MUJ students.
            </p>
          </div>
        </div>
      </footer>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .type-cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
