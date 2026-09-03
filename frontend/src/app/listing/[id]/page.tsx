"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/marketplace/Navbar";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { listingsApi, threadsApi, transactionsApi, requestsApi, type Listing } from "@/lib/api";

const CONDITION_COLORS: Record<string, { bg: string; text: string }> = {
  New: { bg: "#DCFCE7", text: "#15803D" },
  Good: { bg: "#DBEAFE", text: "#1D4ED8" },
  Fair: { bg: "#FEF9C3", text: "#A16207" },
  Damaged: { bg: "#FEE2E2", text: "#B91C1C" },
};

const TYPE_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  sell: { label: "For Sale", bg: "#FFF0EA", text: "#E8521A", border: "#E8521A" },
  resale: { label: "Resale", bg: "#F5F0FF", text: "#8B5CF6", border: "#8B5CF6" },
  rent: { label: "Rent", bg: "#FFFBEA", text: "#F59E0B", border: "#F59E0B" },
  free: { label: "Free", bg: "#EAFFF2", text: "#22C55E", border: "#22C55E" },
  query: { label: "Query/Task", bg: "#EAF6FF", text: "#3B82F6", border: "#3B82F6" },
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();

  const [listing, setListing] = useState<(Listing & { platformFee?: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedListings, setRelatedListings] = useState<Listing[]>([]);

  // Checkout states
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"processing" | "success">("processing");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  // Request states
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Document preview state
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await listingsApi.get(id);
        setListing(res.listing);
        
        const rel = await listingsApi.list({ category: res.listing.category, limit: 4 });
        setRelatedListings(rel.listings.filter(l => l.id !== id).slice(0, 4));
      } catch (err) {
        console.error("Failed to load listing:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  const handleBuyNow = () => {
    if (!listing) return;
    requireAuth(async () => {
      try {
        setCheckoutLoading(true);
        // Initiate transaction
        const res = await transactionsApi.checkout({ listingId: listing.id });
        setTransactionId(res.transaction.id);
        
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: listing.price * 100, // Amount in paise
          currency: "INR",
          name: "MUJMart",
          description: "Secure Escrow Payment for " + listing.title,
          order_id: res.transaction.razorpayOrderId,
          handler: async function (response: any) {
             try {
                setShowCheckout(true);
                setCheckoutStep("processing");
                await transactionsApi.verifyRazorpay(res.transaction.id, {
                   razorpay_order_id: response.razorpay_order_id,
                   razorpay_payment_id: response.razorpay_payment_id,
                   razorpay_signature: response.razorpay_signature,
                });
                setCheckoutStep("success");
             } catch(e: any) {
                alert("Payment verification failed: " + (e.message || ""));
                setShowCheckout(false);
             }
          },
          modal: {
            ondismiss: function() {
              setCheckoutLoading(false);
            }
          },
          theme: {
            color: "#E8521A"
          }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on('payment.failed', function (response: any) {
           alert(response.error.description);
           setShowCheckout(false);
           setCheckoutLoading(false);
        });
        rzp1.open();

      } catch (e: any) {
        alert(e.message || "Failed to initiate checkout");
        setShowCheckout(false);
        setCheckoutLoading(false);
      }
    });
  };

  const handleNegotiate = async () => {
    if (!listing) return;
    requireAuth(async () => {
      try {
        const { thread } = await threadsApi.create(listing.id);
        router.push(`/chat/${thread.id}`);
      } catch (e) {
        const err = e as Error;
        alert(err.message || "Could not start negotiation");
      }
    });
  };

  const handleRequestAccess = () => {
    if (!listing) return;
    requireAuth(async () => {
      try {
        setRequestLoading(true);
        await requestsApi.create(listing.id);
        setRequestSent(true);
        alert("Application sent to the owner!");
      } catch (err: any) {
        alert(err.message || "Failed to send application");
      } finally {
        setRequestLoading(false);
      }
    });
  };

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "120px 0", color: "#6B7280" }}>Loading...</div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "120px 0" }}>
          <h2>Listing not found</h2>
        </div>
      </main>
    );
  }

  const images = listing.images?.length ? listing.images : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000"];
  const typeConfig = TYPE_CONFIG[listing.type] || TYPE_CONFIG.sell;
  const condColor = CONDITION_COLORS[listing.condition] || CONDITION_COLORS.Good;

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px 80px" }} className="listing-detail-container">
        <nav style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 28, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9CA3AF" }}>
          <a href="/" style={{ color: "#9CA3AF", textDecoration: "none" }}>Home</a>
          <span>›</span>
          <a href="/search" style={{ color: "#9CA3AF", textDecoration: "none" }}>Browse</a>
          <span>›</span>
          <span style={{ color: "#1A0A00", fontWeight: 500 }}>{listing.title.slice(0, 30)}</span>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }} className="listing-grid">
          <div>
            <div style={{ borderRadius: 20, overflow: "hidden", background: "#F9FAFB", border: "1px solid #F0DDD4", aspectRatio: "4/3", position: "relative" }}>
              <img src={images[activeImage]} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              
              <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8 }}>
                <span style={{ padding: "5px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700, background: typeConfig.bg, color: typeConfig.text, border: `1px solid ${typeConfig.border}` }}>{typeConfig.label}</span>
                <span style={{ padding: "5px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700, background: condColor.bg, color: condColor.text }}>{listing.condition}</span>
              </div>

              <a href={images[activeImage]} target="_blank" rel="noopener noreferrer" style={{ position: "absolute", top: 14, right: 14, padding: "6px 12px", borderRadius: 50, background: "rgba(255,255,255,0.9)", color: "#1A0A00", fontSize: 11, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, border: "1px solid rgba(0,0,0,0.1)", backdropFilter: "blur(4px)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6"></path>
                  <path d="M9 21H3v-6"></path>
                  <path d="M21 3l-7 7"></path>
                  <path d="M3 21l7-7"></path>
                </svg>
                View
              </a>
            </div>

            {images.length > 1 && (
              <div style={{ display: "flex", gap: 10, marginTop: 12, overflowX: "auto" }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} style={{ width: 72, height: 72, borderRadius: 10, border: `2px solid ${i === activeImage ? "#E8521A" : "#F0DDD4"}`, cursor: "pointer" }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0DDD4", padding: 24, marginTop: 24 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", marginBottom: 12 }}>Description</h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#4B5563", lineHeight: 1.7 }}>{listing.description}</p>
              
              {listing.deadline && (
                <div style={{ marginTop: 16, padding: 12, background: "#FFFBEA", borderRadius: 8, border: "1px solid #FDE68A", display: "inline-block" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#92400E", fontFamily: "'DM Sans', sans-serif" }}>
                    ⏰ Deadline: {new Date(listing.deadline).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {listing.attachments && listing.attachments.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0DDD4", padding: 24, marginTop: 24 }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", marginBottom: 12 }}>Attachments</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {listing.attachments.map((doc, i) => (
                    <button key={i} onClick={() => setPreviewDoc(doc)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#F9FAFB", borderRadius: 12, border: "1px solid #F0DDD4", cursor: "pointer", transition: "border-color 0.2s", textAlign: "left", width: "100%" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3B82F6")} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#F0DDD4")}>
                      <span style={{ fontSize: 20 }}>📄</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, flex: 1, color: "#1A0A00" }}>Document {i + 1}</span>
                      <span style={{ color: "#3B82F6", fontSize: 13, fontWeight: 600 }}>Live Preview</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #F0DDD4", padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#1A0A00", marginBottom: 6 }}>{listing.title}</h1>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, color: "#E8521A" }}>₹{listing.price.toLocaleString("en-IN")}</span>

              <div style={{ background: "#FDF8F5", borderRadius: 14, padding: 16, margin: "20px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FFF0EA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    {listing.seller?.alias?.charAt(0).toUpperCase() || "S"}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", margin: "0 0 4px 0" }}>{listing.seller?.alias}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                      <span>★ {listing.seller?.repScore?.toFixed(1) || "5.0"}</span>
                      <span>·</span>
                      <span>{listing.seller?.dealCount || 0} deals</span>
                    </div>
                  </div>
                </div>
              </div>

              {listing.type === 'query' ? (
                <button onClick={handleRequestAccess} disabled={requestSent || requestLoading} style={{ width: "100%", padding: "14px", background: requestSent ? "#10B981" : "#3B82F6", color: "#fff", border: "none", borderRadius: 50, fontWeight: 700, cursor: requestSent || requestLoading ? "not-allowed" : "pointer", transition: "0.2s" }}>
                  {requestLoading ? "Sending..." : requestSent ? "Application Sent ✓" : "Apply for Task"}
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={handleBuyNow} style={{ width: "100%", padding: "14px", background: "#E8521A", color: "#fff", border: "none", borderRadius: 50, fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#FF6B35")} onMouseLeave={(e) => (e.currentTarget.style.background = "#E8521A")}>
                    Buy Now (Secure Escrow)
                  </button>
                  <button onClick={handleNegotiate} style={{ width: "100%", padding: "14px", background: "#fff", border: "1.5px solid #F0DDD4", borderRadius: 50, fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#FDF8F5")} onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
                    Negotiate Anonymously
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedListings.length > 0 && (
          <section style={{ marginTop: 56 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#1A0A00", marginBottom: 20 }}>More in {listing.category}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="related-grid">
              {relatedListings.map((rel) => (
                <a key={rel.id} href={`/listing/${rel.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #F0DDD4" }}>
                    <div style={{ position: "relative", paddingTop: "75%" }}>
                      <img src={rel.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000"} alt={rel.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: 16 }}>
                      <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, margin: "0 0 8px 0" }}>{rel.title}</h4>
                      <p style={{ fontSize: 14, color: "#E8521A", fontWeight: 700, margin: 0 }}>₹{rel.price}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Checkout Success Modal */}
        {showCheckout && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
            
            <div style={{ position: "relative", width: "100%", maxWidth: 420, background: "#fff", borderRadius: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.15)", padding: 32 }}>
              
              {checkoutStep === "processing" ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>Verifying your secure payment...</div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#DCFCE7", color: "#15803D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>✓</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 8px 0" }}>Payment Successful</h3>
                  <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px 0", lineHeight: 1.5 }}>Your payment has been verified. The funds are now securely held in escrow until you receive your item.</p>
                  <button onClick={() => router.push("/my-listings")} style={{ padding: "10px 24px", background: "#E8521A", color: "#fff", border: "none", borderRadius: 50, fontWeight: 700, cursor: "pointer" }}>Go to My Deals</button>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Document Preview Modal */}
        {previewDoc && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setPreviewDoc(null)} />
            
            <div style={{ position: "relative", width: "100%", maxWidth: 900, height: "85vh", background: "#fff", borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, margin: 0, color: "#1A0A00" }}>Document Preview</h3>
                <div style={{ display: "flex", gap: 12 }}>
                  <a href={previewDoc} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 16px", background: "#3B82F6", color: "#fff", textDecoration: "none", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Download Original</a>
                  <button onClick={() => setPreviewDoc(null)} style={{ width: 32, height: 32, borderRadius: "50%", background: "#F3F4F6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", fontWeight: "bold" }}>✕</button>
                </div>
              </div>
              <iframe 
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewDoc)}&embedded=true`} 
                style={{ width: "100%", flex: 1, border: "none" }}
                title="Document Preview"
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .listing-grid { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .listing-detail-container { padding: 16px 16px 60px !important; }
          .related-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </main>
  );
}
