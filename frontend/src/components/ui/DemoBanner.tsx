"use client";

import React from "react";
import { useDemo } from "@/lib/DemoContext";

export default function DemoBanner() {
  const { isDemo, demoUser, exitDemoMode } = useDemo();

  if (!isDemo || !demoUser) return null;

  return (
    <div className="sticky top-0 z-50 bg-amber/10 border-b border-amber/30 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🧪</span>
          <span className="text-sm font-semibold text-amber font-[family-name:var(--font-dm)]">
            Demo Mode
          </span>
          <span className="text-sm text-text-dark/70 font-[family-name:var(--font-dm)]">
            — Viewing as{" "}
            <span className="font-semibold text-text-dark">
              {demoUser.name}
            </span>{" "}
            ({demoUser.role === "admin" ? "Admin" : "Customer"})
          </span>
        </div>
        <button
          onClick={exitDemoMode}
          className="px-3 py-1 text-xs font-semibold text-amber border border-amber/30 rounded-full hover:bg-amber/10 transition-all font-[family-name:var(--font-dm)]"
        >
          Exit Demo
        </button>
      </div>
    </div>
  );
}
