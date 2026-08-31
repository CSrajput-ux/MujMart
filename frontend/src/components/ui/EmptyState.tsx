import React from "react";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      {icon ? (
        <div className="mb-4 text-orange/30">{icon}</div>
      ) : (
        <div className="w-20 h-20 rounded-full bg-orange-pale flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-orange/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
      )}
      <h3 className="font-[family-name:var(--font-syne)] font-bold text-xl text-text-dark mb-2">
        {title}
      </h3>
      <p className="text-gray-custom text-sm max-w-sm mb-6 font-[family-name:var(--font-dm)]">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-orange text-white rounded-full font-[family-name:var(--font-syne)] font-semibold text-sm hover:bg-orange-light active:bg-orange-dark transition-all duration-200 hover:shadow-lg hover:shadow-orange/25 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
