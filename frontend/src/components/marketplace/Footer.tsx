import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#FDFAF8",
        borderTop: "1px solid #F0DDD4",
        paddingTop: 48,
        paddingBottom: 36,
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
          gap: 40,
        }}
        className="footer-grid"
      >
        {/* Brand Column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #E8521A, #FF6B35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(232,82,26,0.3)",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                M
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: "#E8521A",
                letterSpacing: -0.3,
              }}
            >
              MUJMart
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#6B7280",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.6,
              maxWidth: 200,
              margin: 0,
            }}
          >
            The campus marketplace for MUJ students.
          </p>

          {/* Social links */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {[
              {
                href: "https://instagram.com",
                label: "Instagram",
                icon: (
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                ),
              },
              {
                href: "https://twitter.com",
                label: "Twitter",
                icon: (
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "#FFF0EA",
                  border: "1px solid #F0DDD4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#E8521A",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#E8521A";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "#E8521A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFF0EA";
                  e.currentTarget.style.color = "#E8521A";
                  e.currentTarget.style.borderColor = "#F0DDD4";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Marketplace Column */}
        <div>
          <h4
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "#1A0A00",
              margin: "0 0 16px 0",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Marketplace
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Browse", href: "/" },
              { label: "Sell", href: "/post" },
              { label: "Resale", href: "/?type=resale" },
              { label: "Rent", href: "/?type=rent" },
              { label: "Free", href: "/?type=free" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "#6B7280",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E8521A")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "#1A0A00",
              margin: "0 0 16px 0",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Support
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Help Center", href: "#" },
              { label: "Safety Tips", href: "#", highlight: true },
              { label: "Report Issue", href: "#" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: link.highlight ? "#E8521A" : "#6B7280",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E8521A")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = link.highlight ? "#E8521A" : "#6B7280")
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "#1A0A00",
              margin: "0 0 16px 0",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Legal
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Community Rules", href: "#" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "#6B7280",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E8521A")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: "32px auto 0",
          padding: "20px 24px 0",
          borderTop: "1px solid #F0DDD4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
        className="footer-bottom"
      >
        <p
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} MUJMart. Made with ❤️ for MUJ students.
        </p>
        <p
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0,
          }}
        >
          Manipal University Jaipur · Campus Marketplace
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            text-align: center;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
