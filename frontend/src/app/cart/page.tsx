"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/marketplace/Navbar";
import { useCart } from "@/lib/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, totalItems, totalPrice } = useCart();
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [mobile, setMobile] = useState("");
  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />
      
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px" }} className="cart-container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 24 }} className="cart-grid">
          
          {/* Left Side: Shopping Cart Content */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexDirection: "column", gap: 12 }} className="cart-title-row">
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: 12 }}>
                Shopping Cart
                <span style={{ fontSize: 13, fontWeight: 600, color: "#E8521A", background: "#FFF0EA", padding: "4px 10px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>
                  {totalItems} items
                </span>
              </h1>
              <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: "#E8521A", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                ← Continue Shopping
              </Link>
            </div>

            {totalItems === 0 ? (
              <div style={{ padding: "80px 0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#4B5563", margin: "0 0 8px 0" }}>Your cart is empty</h3>
                <p style={{ fontSize: 14, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>Browse our products and add items to your cart</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: 16, paddingBottom: 20, borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ width: 100, height: 100, borderRadius: 12, background: "#FFF0EA", overflow: "hidden", flexShrink: 0 }}>
                      <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#111827", margin: "0 0 4px 0" }}>{item.title}</h3>
                          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#E8521A" }}>Rs{item.price.toLocaleString("en-IN")}</span>
                        </div>
                        <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{item.category} • {item.condition}</p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 8px", borderRadius: 6, transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")} onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Order Summary */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 24, height: "fit-content" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#111827", margin: "0 0 24px 0" }}>Order Summary</h2>
            
            {/* Delivery Address */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>DELIVERY ADDRESS</label>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Delivery Type:</label>
                <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#111827", background: "#fff", appearance: "none" }}>
                  <option value="">Select Delivery Type</option>
                  <option value="oncampus">On-campus Delivery</option>
                  <option value="offcampus">Off-campus Delivery</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Or enter your location:</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address details..."
                  rows={3}
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "none", color: "#111827" }}
                />
              </div>
            </div>

            {/* Warning Message */}
            <div style={{ padding: "12px", background: "#F9FAFB", borderRadius: 8, fontSize: 12, color: "#6B7280", fontStyle: "italic", marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>
              Please select delivery type or enter location
            </div>

            {/* Mobile Number */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Enter Mobile Phone Number*</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your phone number (10 digits)..."
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#111827" }}
              />
            </div>

            {/* Payment Method */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>PAYMENT METHOD</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button
                  onClick={() => setPaymentMethod("cod")}
                  style={{
                    padding: "16px",
                    border: `1px solid ${paymentMethod === "cod" ? "#E8521A" : "#E5E7EB"}`,
                    background: paymentMethod === "cod" ? "#FFF0EA" : "#fff",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.2s"
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={paymentMethod === "cod" ? "#E8521A" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                    <circle cx="12" cy="12" r="2"></circle>
                    <path d="M6 12h.01M18 12h.01"></path>
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 600, color: paymentMethod === "cod" ? "#E8521A" : "#374151", fontFamily: "'DM Sans', sans-serif" }}>Cash On Delivery</span>
                </button>
                <button
                  disabled
                  style={{
                    padding: "16px",
                    border: "1px solid #E5E7EB",
                    background: "#F9FAFB",
                    borderRadius: 8,
                    cursor: "not-allowed",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    opacity: 0.7
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>Online Not active yet</span>
                </button>
              </div>
            </div>

            {/* Coupon Code */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>COUPON CODE</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  style={{ flex: 1, padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#111827" }}
                />
                <button style={{ padding: "0 20px", background: "#1F2937", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  Apply
                </button>
              </div>
            </div>

            {/* Summary Totals */}
            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "#4B5563", fontFamily: "'DM Sans', sans-serif" }}>Price ({totalItems} items)</span>
                <span style={{ fontSize: 13, color: "#111827", fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>Rs{totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: "#4B5563", fontFamily: "'DM Sans', sans-serif" }}>Shipping Fee</span>
                <span style={{ fontSize: 13, color: "#E8521A", fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>Free</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
                <span style={{ fontSize: 15, color: "#111827", fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>Total Amount</span>
                <span style={{ fontSize: 18, color: "#E8521A", fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>Rs{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button style={{ width: "100%", padding: "14px", background: "#E8521A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: "'Syne', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#FF6B35")} onMouseLeave={(e) => (e.currentTarget.style.background = "#E8521A")}>
                PLACE ORDER →
              </button>
              <button style={{ width: "100%", padding: "12px", background: "#fff", color: "#E8521A", border: "1px solid #E8521A", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#FFF0EA")} onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Message us for faster delivery
              </button>
            </div>

            <div style={{ marginTop: 24, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8521A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>Secure payment & data protection</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .cart-title-row { flex-direction: column !important; align-items: flex-start !important; }
          .cart-container { padding: 16px 12px !important; }
        }
      `}</style>
    </main>
  );
}
