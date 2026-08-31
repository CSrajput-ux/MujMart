import React from "react";
import UserAvatar from "@/components/ui/UserAvatar";

interface SellerCardProps {
  alias: string;
  repScore: number;
  dealCount: number;
}

export default function SellerCard({
  alias,
  repScore,
  dealCount,
}: SellerCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border-custom hover:border-orange/30 transition-all duration-200 cursor-pointer group">
      <UserAvatar name={alias} size="md" />
      <div className="flex-1 min-w-0">
        <p className="font-[family-name:var(--font-syne)] font-semibold text-sm text-text-dark truncate group-hover:text-orange transition-colors">
          {alias}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {/* Rep score */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-pale rounded-full text-xs font-medium text-orange font-[family-name:var(--font-dm)]">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {repScore.toFixed(1)}
          </span>
          {/* Deal count */}
          <span className="text-xs text-gray-custom font-[family-name:var(--font-dm)]">
            {dealCount} {dealCount === 1 ? "deal" : "deals"}
          </span>
        </div>
      </div>
      {/* Arrow */}
      <svg
        className="w-4 h-4 text-gray-custom/40 group-hover:text-orange group-hover:translate-x-0.5 transition-all duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
}
