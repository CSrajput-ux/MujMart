import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Brand Column */}
        <div>
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-text">M</span>
            </div>
            <span className="footer-brand-name">MUJMart</span>
          </div>
          <p className="footer-tagline">
            The campus marketplace for MUJ students.
          </p>

          {/* Social links */}
          <div className="footer-socials">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-link"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="social-link"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Marketplace Column */}
        <div>
          <h4 className="footer-col-title">Marketplace</h4>
          <ul className="footer-links">
            {[
              { label: "Browse", href: "/" },
              { label: "Sell", href: "/post" },
              { label: "Resale", href: "/?type=resale" },
              { label: "Rent", href: "/?type=rent" },
              { label: "Free", href: "/?type=free" },
            ].map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="footer-col-title">Support</h4>
          <ul className="footer-links">
            <li><Link href="/help" className="footer-link">Help Center</Link></li>
            <li><Link href="/safety-tips" className="footer-link footer-link-highlight">Safety Tips</Link></li>
            <li><Link href="/report-issue" className="footer-link">Report Issue</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="footer-col-title">Legal</h4>
          <ul className="footer-links">
            {[
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Community Rules", href: "#" },
            ].map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © {new Date().getFullYear()} MUJMart. Made with ❤️ for MUJ students.
        </p>
        <p className="footer-copy">
          Manipal University Jaipur · Campus Marketplace
        </p>
      </div>

      <style>{`
        .site-footer {
          background: #FDFAF8;
          border-top: 1px solid #F0DDD4;
          padding: 48px 0 36px;
          margin-top: auto;
        }
        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 40px;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .footer-logo {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #E8521A, #FF6B35);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(232,82,26,0.3);
          flex-shrink: 0;
        }
        .footer-logo-text {
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 16px;
        }
        .footer-brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: #E8521A;
          letter-spacing: -0.3px;
        }
        .footer-tagline {
          font-size: 13px;
          color: #6B7280;
          font-family: 'DM Sans', sans-serif;
          line-height: 1.6;
          max-width: 200px;
          margin: 0 0 20px 0;
        }
        .footer-socials {
          display: flex;
          gap: 10px;
        }
        .social-link {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #FFF0EA;
          border: 1px solid #F0DDD4;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E8521A;
          text-decoration: none;
          transition: all 0.2s;
        }
        .social-link:hover {
          background: #E8521A;
          color: #fff;
          border-color: #E8521A;
        }
        .footer-col-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #1A0A00;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #6B7280;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #E8521A;
        }
        .footer-link-highlight {
          color: #E8521A;
        }
        .footer-bottom {
          max-width: 1200px;
          margin: 32px auto 0;
          padding: 20px 24px 0;
          border-top: 1px solid #F0DDD4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copy {
          font-size: 12px;
          color: #9CA3AF;
          font-family: 'DM Sans', sans-serif;
          margin: 0;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
          .footer-bottom {
            flex-direction: column;
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
