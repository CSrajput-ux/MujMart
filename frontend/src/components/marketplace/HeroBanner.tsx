"use client";

import React, { useState, useEffect, useCallback } from "react";
import { heroSlides } from "@/lib/mockData";
import { Flame } from "lucide-react";

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const currentSlide = heroSlides[activeSlide];

  return (
    <section style={{ padding: "20px 0", background: "#FDF8F5" }}>
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          borderRadius: 32,
          background: "linear-gradient(135deg, #FFF9F7 0%, #FFE4D9 100%)",
          padding: "40px 60px",
          position: "relative",
          overflow: "hidden",
          minHeight: 340,
          display: "flex",
          alignItems: "center",
          border: "1px solid #F0DDD4",
          boxShadow: "0 20px 40px rgba(232, 82, 26, 0.05)",
        }}
        className="hero-container"
      >
        {/* Background Image/Decoration */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "55%",
            height: "100%",
            zIndex: 1,
            opacity: 1,
          }}
          className="hero-image-overlay"
        >
          <img
            src="/hero-banner.png"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Subtle fade on the left side of the image to blend with white content area */}
          <div 
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, #FFF9F7 0%, transparent 40%)",
              zIndex: 2
            }}
          />
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 550, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Badges */}
          <div style={{ display: "flex", gap: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                background: "rgba(34,197,94,0.1)",
                borderRadius: 50,
                fontSize: 11,
                fontWeight: 700,
                color: "#16A34A",
                fontFamily: "'DM Sans', sans-serif",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#16A34A" }} />
              STUDENT VERIFIED
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                background: "rgba(232, 82, 26, 0.1)",
                borderRadius: 50,
                fontSize: 11,
                fontWeight: 700,
                color: "#E8521A",
                fontFamily: "'DM Sans', sans-serif",
                border: "1px solid rgba(232, 82, 26, 0.2)",
              }}
            >
              <Flame size={14} /> TRENDING NOW
            </span>
          </div>

          {/* Text Content */}
          <div style={{ transition: "all 0.5s ease" }}>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(32px, 5vw, 48px)",
                color: "#1A0A00",
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ color: "#E8521A" }}>{currentSlide.title.split(' ')[0]}</span> {currentSlide.title.split(' ').slice(1).join(' ')}
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                color: "#4B5563",
                marginTop: 10,
                maxWidth: 440,
                lineHeight: 1.4,
              }}
            >
              The premium marketplace built for MUJ students. Buy, sell, and trade within your campus.
            </p>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
            {["Buy", "Sell", "Rent", "Thrift", "Brands"].map((tag, i) => (
              <span
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#6B7280",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {i > 0 && <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#D1D5DB" }} />}
                {tag}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="hero-buttons" style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <a
              href="#listings"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 32px",
                background: "#E8521A",
                color: "#fff",
                borderRadius: 50,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                textDecoration: "none",
                transition: "all 0.2s",
                boxShadow: "0 10px 20px rgba(232,82,26,0.2)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Start Shopping ›
            </a>
            <a
              href="/search"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 32px",
                background: "#fff",
                color: "#1A0A00",
                borderRadius: 50,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                border: "1.5px solid #F0DDD4",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FDF8F5";
                e.currentTarget.style.borderColor = "#E8521A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderColor = "#F0DDD4";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Explore All ›
            </a>
          </div>

          {/* Dots */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                style={{
                  width: i === activeSlide ? 32 : 10,
                  height: 10,
                  borderRadius: 5,
                  background: i === activeSlide ? "#E8521A" : "#F0DDD4",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .hero-container { padding: 40px !important; min-height: auto !important; }
          .hero-image-overlay { width: 100% !important; opacity: 0.2 !important; }
        }
        @media (max-width: 768px) {
          .hero-container { padding: 32px 20px !important; border-radius: 0 !important; }
          .hero-image-overlay { display: none; }
          .hero-buttons { flex-direction: column !important; width: 100%; gap: 12px !important; }
          .hero-buttons > a { width: 100% !important; justify-content: center !important; }
        }
      `}</style>
    </section>
  );
}
