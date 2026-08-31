import React from "react";

interface PriceTagProps {
  price: number;
  type?: "sell" | "rent" | "free";
}

export default function PriceTag({ price, type = "sell" }: PriceTagProps) {
  if (type === "free" || price === 0) {
    return (
      <span className="font-[family-name:var(--font-syne)] font-extrabold text-green text-lg">
        FREE
      </span>
    );
  }

  return (
    <span className="font-[family-name:var(--font-syne)] font-extrabold text-orange text-lg">
      ₹{price.toLocaleString("en-IN")}
      {type === "rent" && (
        <span className="text-sm font-normal text-gray-custom">/day</span>
      )}
    </span>
  );
}
