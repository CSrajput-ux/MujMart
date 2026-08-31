import React from "react";
import type { Listing } from "@/lib/api";
import ListingCard from "./ListingCard";

interface ListingGridProps {
  listings: Listing[];
}

export default function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 14,
        }}
        className="listing-grid"
      >
        {listings.map((listing, index) => (
          <div
            key={listing.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .listing-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
        }
        @media (max-width: 380px) {
          .listing-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
