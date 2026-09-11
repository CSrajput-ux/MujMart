"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/marketplace/Navbar";
import { useCart } from "@/lib/CartContext";
import { transactionsApi, listingsApi } from "@/lib/api";

// ─── UPI Payment Modal ─────────────────────────────────────────────────────
interface UpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  cartItems: any[];
}

function UpiPaymentModal({ isOpen, onClose, totalAmount, cartItems }: UpiModalProps) {
  const [step, setStep] = useState<"pay" | "upload" | "submitted">("pay");
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ADMIN_UPI_ID = "7579958087@axl";
  const ADMIN_QR = "/qr.jpeg";

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(ADMIN_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitPayment = async () => {
    setError(null);
    if (!utrNumber.trim()) {
      setError("Please enter your Transaction ID (UTR number)");
      return;
    }
    if (!screenshotFile) {
      setError("Please upload your payment screenshot");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload screenshot first
      const screenshotUrl = await listingsApi.uploadImage(screenshotFile);

      // Process each cart item as a separate transaction
      for (const item of cartItems) {
        // Create checkout (transaction)
        const checkoutRes = await transactionsApi.checkout({
          listingId: item.id,
          agreedPrice: item.price,
        });

        // Submit UPI payment proof
        await transactionsApi.submitUpiPayment(checkoutRes.transaction.id, {
          utrNumber: utrNumber.trim(),
          paymentScreenshotUrl: screenshotUrl.url,
        });
      }

      setStep("submitted");
    } catch (err: any) {
      setError(err.message || "Failed to submit payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff", borderRadius: 20, maxWidth: 480, width: "100%",
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          animation: "slideUp 0.3s ease",
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #E8521A 0%, #FF6B35 100%)",
          borderRadius: "20px 20px 0 0", padding: "24px 28px",
          position: "relative",
        }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: "50%", width: 32, height: 32,
              color: "#fff", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >×</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, background: "rgba(255,255,255,0.2)",
              borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, margin: 0 }}>
                UPI Payment
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, margin: 0 }}>
                Secure manual payment verification
              </p>
            </div>
          </div>

          {/* Amount Badge */}
          <div style={{
            marginTop: 20, background: "rgba(255,255,255,0.15)",
            borderRadius: 12, padding: "12px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              Total Amount to Pay
            </span>
            <span style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22 }}>
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        {step !== "submitted" && (
          <div style={{ display: "flex", alignItems: "center", padding: "16px 28px", gap: 8 }}>
            {[{ n: 1, label: "Scan & Pay" }, { n: 2, label: "Upload Proof" }].map((s, i) => (
              <React.Fragment key={s.n}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: (step === "pay" ? s.n === 1 : s.n === 2) ? "#E8521A" : "#F3F4F6",
                    color: (step === "pay" ? s.n === 1 : s.n === 2) ? "#fff" : "#9CA3AF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700,
                  }}>{s.n}</div>
                  <span style={{
                    fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    color: (step === "pay" ? s.n === 1 : s.n === 2) ? "#E8521A" : "#9CA3AF",
                  }}>{s.label}</span>
                </div>
                {i === 0 && <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div style={{ padding: "8px 28px 28px" }}>
          {/* ── STEP 1: QR + UPI ID ── */}
          {step === "pay" && (
            <div>
              <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "0 0 20px 0", textAlign: "center" }}>
                Scan the QR code or use UPI ID to pay. Then click "Done, I've Paid".
              </p>

              {/* QR Code */}
              <div style={{
                display: "flex", justifyContent: "center", marginBottom: 20,
                padding: 16, background: "#F9FAFB", borderRadius: 16,
                border: "2px dashed #E5E7EB",
              }}>
                <div style={{ position: "relative", width: 200, height: 200 }}>
                  <Image
                    src={ADMIN_QR}
                    alt="MujMart Payment QR Code"
                    fill
                    style={{ objectFit: "contain", borderRadius: 8 }}
                  />
                </div>
              </div>

              {/* UPI ID */}
              <div style={{
                background: "#FFF7F3", border: "1.5px solid #FFD9C7",
                borderRadius: 12, padding: "14px 16px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 16,
              }}>
                <div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    UPI ID
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1A0A00", fontFamily: "'Syne', sans-serif", marginTop: 2 }}>
                    {ADMIN_UPI_ID}
                  </div>
                </div>
                <button
                  onClick={handleCopyUpi}
                  style={{
                    padding: "8px 14px", borderRadius: 8,
                    background: copied ? "#15803D" : "#E8521A",
                    color: "#fff", border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>

              {/* Cart Items Summary */}
              <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
                  Order Summary
                </div>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#374151", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, paddingRight: 8 }}>{item.title}</span>
                    <span style={{ fontWeight: 700, color: "#E8521A", flexShrink: 0 }}>₹{item.price.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep("upload")}
                style={{
                  width: "100%", padding: "14px",
                  background: "linear-gradient(135deg, #E8521A 0%, #FF6B35 100%)",
                  color: "#fff", border: "none", borderRadius: 10,
                  fontSize: 15, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                Done, I've Paid →
              </button>
            </div>
          )}

          {/* ── STEP 2: Upload Proof ── */}
          {step === "upload" && (
            <div>
              <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "0 0 20px 0", textAlign: "center" }}>
                Upload your payment screenshot and enter the Transaction ID from your UPI app.
              </p>

              {/* Screenshot Upload */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
                  Payment Screenshot *
                </label>
                <label
                  htmlFor="screenshot-upload"
                  style={{
                    display: "block", border: `2px dashed ${screenshotPreview ? "#E8521A" : "#D1D5DB"}`,
                    borderRadius: 12, padding: screenshotPreview ? 8 : "32px 16px",
                    cursor: "pointer", textAlign: "center",
                    background: screenshotPreview ? "#FFF7F3" : "#F9FAFB",
                    transition: "all 0.2s",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {screenshotPreview ? (
                    <div style={{ position: "relative", width: "100%", height: 180 }}>
                      <Image src={screenshotPreview} alt="Payment screenshot" fill style={{ objectFit: "contain", borderRadius: 8 }} />
                    </div>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px" }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <div style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                        Click to upload screenshot
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                        PNG, JPG up to 10MB
                      </div>
                    </>
                  )}
                  <input
                    id="screenshot-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    style={{ display: "none" }}
                  />
                </label>
                {screenshotPreview && (
                  <button
                    onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); }}
                    style={{ fontSize: 12, color: "#EF4444", background: "none", border: "none", cursor: "pointer", marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}
                  >
                    ✕ Remove & re-upload
                  </button>
                )}
              </div>

              {/* UTR Number */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
                  Transaction ID / UTR Number *
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 432168957234 or T24030612345"
                  style={{
                    width: "100%", padding: "12px 14px",
                    border: "1.5px solid #E5E7EB", borderRadius: 10,
                    fontSize: 14, fontFamily: "monospace", outline: "none",
                    color: "#111827", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#E8521A"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#E5E7EB"}
                />
                <p style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", margin: "6px 0 0 0" }}>
                  Find this in your UPI app under "Payment History" → transaction details
                </p>
              </div>

              {/* Info Box */}
              <div style={{
                background: "#EFF6FF", border: "1px solid #BFDBFE",
                borderRadius: 10, padding: "12px 14px", marginBottom: 20,
                display: "flex", gap: 10,
              }}>
                <span style={{ fontSize: 16 }}>ℹ️</span>
                <p style={{ fontSize: 12, color: "#1E40AF", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                  Admin will verify your payment within <strong>24 hours</strong>. You'll receive a notification once verified.
                </p>
              </div>

              {error && (
                <div style={{
                  background: "#FEF2F2", border: "1px solid #FECACA",
                  borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                  fontSize: 13, color: "#DC2626", fontFamily: "'DM Sans', sans-serif",
                }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { setStep("pay"); setError(null); }}
                  style={{
                    flex: 1, padding: "13px", background: "#F3F4F6",
                    color: "#374151", border: "none", borderRadius: 10,
                    fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                  }}
                >← Back</button>
                <button
                  onClick={handleSubmitPayment}
                  disabled={isSubmitting}
                  style={{
                    flex: 2, padding: "13px",
                    background: isSubmitting ? "#9CA3AF" : "linear-gradient(135deg, #E8521A 0%, #FF6B35 100%)",
                    color: "#fff", border: "none", borderRadius: 10,
                    fontSize: 14, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                      Submitting...
                    </>
                  ) : "Submit Payment ✓"}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Submitted ── */}
          {step === "submitted" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              {/* Success Icon */}
              <div style={{
                width: 80, height: 80, background: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontSize: 36,
              }}>✅</div>

              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#111827", margin: "0 0 10px 0" }}>
                Payment Submitted!
              </h3>
              <p style={{ fontSize: 14, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "0 0 24px 0", lineHeight: 1.6 }}>
                Your payment proof has been sent to the admin for verification.<br />
                You'll get a notification once it's confirmed — usually within <strong>24 hours</strong>.
              </p>

              <div style={{
                background: "#FFF7F3", border: "1px solid #FFD9C7",
                borderRadius: 12, padding: "14px 16px", marginBottom: 24,
                textAlign: "left",
              }}>
                <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>SUBMITTED DETAILS</div>
                <div style={{ fontSize: 13, color: "#374151", fontFamily: "'DM Sans', sans-serif" }}>
                  <div>UTR: <strong style={{ fontFamily: "monospace", color: "#E8521A" }}>{utrNumber}</strong></div>
                  <div style={{ marginTop: 4 }}>Amount: <strong>₹{totalAmount.toLocaleString("en-IN")}</strong></div>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: "100%", padding: "14px",
                  background: "linear-gradient(135deg, #E8521A 0%, #FF6B35 100%)",
                  color: "#fff", border: "none", borderRadius: 10,
                  fontSize: 15, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                  cursor: "pointer",
                }}
              >
                Close & Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Cart Page ────────────────────────────────────────────────────────
export default function CartPage() {
  const { cartItems, removeFromCart, totalItems, totalPrice } = useCart();
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [mobile, setMobile] = useState("");
  const [coupon, setCoupon] = useState("");
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

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
                      <img src={item.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000"} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#111827", margin: "0 0 4px 0" }}>{item.title}</h3>
                          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#E8521A" }}>₹{item.price.toLocaleString("en-IN")}</span>
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

            {/* Payment Method — UPI Only */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>PAYMENT METHOD</label>
              <div style={{
                padding: "16px", border: "2px solid #E8521A",
                background: "#FFF0EA", borderRadius: 12,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 40, height: 40, background: "#E8521A",
                  borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#E8521A", fontFamily: "'Syne', sans-serif" }}>UPI / QR Payment</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>Pay via any UPI app (GPay, PhonePe, Paytm)</div>
                </div>
                <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", background: "#E8521A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
                </div>
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
                <span style={{ fontSize: 13, color: "#111827", fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: "#4B5563", fontFamily: "'DM Sans', sans-serif" }}>Shipping Fee</span>
                <span style={{ fontSize: 13, color: "#E8521A", fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>Free</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
                <span style={{ fontSize: 15, color: "#111827", fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>Total Amount</span>
                <span style={{ fontSize: 18, color: "#E8521A", fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {checkoutError && (
                <div style={{
                  background: "#FEF2F2", border: "1px solid #FECACA",
                  borderRadius: 10, padding: "10px 14px",
                  fontSize: 13, color: "#DC2626", fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  ⚠️ {checkoutError}
                </div>
              )}
              <button
                id="place-order-btn"
                onClick={() => {
                  setCheckoutError(null);
                  if (totalItems === 0) return;
                  // Validate: must provide delivery type OR address
                  if (!deliveryType && !address.trim()) {
                    setCheckoutError("Please select a Delivery Type or enter your delivery address.");
                    return;
                  }
                  // Validate: mobile number required (10 digits)
                  if (!mobile.trim() || !/^[0-9]{10}$/.test(mobile.trim())) {
                    setCheckoutError("Please enter a valid 10-digit mobile phone number.");
                    return;
                  }
                  setShowUpiModal(true);
                }}
                disabled={totalItems === 0}
                style={{
                  width: "100%", padding: "14px",
                  background: totalItems === 0
                    ? "#D1D5DB"
                    : "linear-gradient(135deg, #E8521A 0%, #FF6B35 100%)",
                  color: "#fff", border: "none", borderRadius: 10,
                  fontSize: 14, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                  cursor: totalItems === 0 ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: totalItems > 0 ? "0 4px 15px rgba(232,82,26,0.35)" : "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { if (totalItems > 0) e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                PAY WITH UPI →
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
              <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>Secure UPI payment &amp; manual verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* UPI Payment Modal */}
      <UpiPaymentModal
        isOpen={showUpiModal}
        onClose={() => setShowUpiModal(false)}
        totalAmount={totalPrice}
        cartItems={cartItems}
      />

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
