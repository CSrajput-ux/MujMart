"use client";

import React from "react";
import Navbar from "@/components/marketplace/Navbar";

const WHATSAPP_NUMBER = "917579948087";
const EMAIL = "csjadon5@gmail.com";

const faqs = [
  {
    q: "How do I post a listing?",
    a: "Go to the 'Post' page from the Navbar. Fill in all required details including type, photos, pricing and delivery options.",
  },
  {
    q: "How do payments work?",
    a: "MUJMart uses an Escrow system. The buyer pays first, funds are held securely, then released to the seller once the buyer confirms receipt.",
  },
  {
    q: "Can I edit or delete my listing?",
    a: "Yes! Go to 'My Listings', find the listing and use the Edit or Delete options. Listings expire automatically after 7 days.",
  },
  {
    q: "What if I have a dispute with a buyer/seller?",
    a: "Open the chat thread for that transaction and use the 'Report Issue' button, or contact us directly via WhatsApp or email.",
  },
  {
    q: "Is MUJMart only for MUJ students?",
    a: "Yes, MUJMart is exclusively for Manipal University Jaipur students to ensure a safe and trusted campus marketplace.",
  },
];

export default function HelpCenterPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF0EA 0%, #FFD9C8 100%)",
          borderBottom: "1px solid #F0DDD4",
          padding: "56px 24px 48px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛟</div>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 32,
            color: "#1A0A00",
            margin: "0 0 12px",
          }}
        >
          Help Center
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            color: "#6B7280",
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Have a question or need help? Reach us directly on WhatsApp or email — we typically respond within a few hours.
        </p>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Contact Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 52 }} className="contact-grid">

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20MUJMart%20Support%2C%20I%20need%20help%20with%3A%20`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div className="contact-card contact-card-wa">
              <div className="contact-icon-wrap" style={{ background: "#DCFCE7" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#22C55E">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: "#1A0A00", margin: "16px 0 6px" }}>
                WhatsApp
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6B7280", margin: "0 0 14px", lineHeight: 1.5 }}>
                Chat with us directly for quick support
              </p>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#22C55E" }}>
                +91 75799 48087 →
              </span>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${EMAIL}?subject=MUJMart%20Support%20Query&body=Hi%20MUJMart%20team%2C%0A%0AI%20need%20help%20with%3A%0A`}
            style={{ textDecoration: "none" }}
          >
            <div className="contact-card contact-card-email">
              <div className="contact-icon-wrap" style={{ background: "#EFF6FF" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: "#1A0A00", margin: "16px 0 6px" }}>
                Email Us
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6B7280", margin: "0 0 14px", lineHeight: 1.5 }}>
                Send us a detailed query — we reply within 24 hrs
              </p>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#3B82F6" }}>
                {EMAIL} →
              </span>
            </div>
          </a>
        </div>

        {/* FAQ */}
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#1A0A00", margin: "0 0 24px" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1A0A00", margin: "0 0 8px" }}>
                Q: {faq.q}
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div style={{ marginTop: 40, padding: "28px", background: "linear-gradient(135deg, #FFF0EA, #FFD9C8)", borderRadius: 16, border: "1px solid #F0DDD4", textAlign: "center" }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", margin: "0 0 8px" }}>Still need help?</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6B7280", margin: "0 0 18px" }}>
            Report a bug or issue and attach a screenshot or video.
          </p>
          <a href="/report-issue" style={{ display: "inline-block", padding: "11px 28px", background: "#E8521A", color: "#fff", borderRadius: 50, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Report an Issue →
          </a>
        </div>
      </div>

      <style>{`
        .contact-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #F0DDD4;
          padding: 28px 24px;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          height: 100%;
          box-sizing: border-box;
        }
        .contact-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }
        .contact-card-wa:hover { border-color: #86EFAC; }
        .contact-card-email:hover { border-color: #93C5FD; }
        .contact-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 600px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
