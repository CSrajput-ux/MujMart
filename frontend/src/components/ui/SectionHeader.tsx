import React from "react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  seeAllHref,
  seeAllLabel = "See all →",
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="font-[family-name:var(--font-syne)] font-bold text-2xl text-text-dark">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-custom text-sm mt-1 font-[family-name:var(--font-dm)]">
            {subtitle}
          </p>
        )}
      </div>
      {seeAllHref && (
        <Link
          href={seeAllHref}
          className="text-orange text-sm font-medium hover:text-orange-dark transition-colors duration-200 font-[family-name:var(--font-dm)] whitespace-nowrap"
        >
          {seeAllLabel}
        </Link>
      )}
    </div>
  );
}
