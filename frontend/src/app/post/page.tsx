"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/marketplace/Navbar";
import { listingsApi } from "@/lib/api";

type ListingType = "sell" | "resale" | "rent" | "free";

const steps = ["Type", "Photos", "Details", "Pricing", "Delivery"];

const typeConfig: Record<ListingType, { label: string; icon: string; bg: string; border: string; text: string }> = {
  sell: { label: "Sell", icon: "🏷️", bg: "#FFF0EA", border: "#E8521A", text: "#E8521A" },
  resale: { label: "Resale", icon: "🔄", bg: "#F5F0FF", border: "#8B5CF6", text: "#8B5CF6" },
  rent: { label: "Rent", icon: "📦", bg: "#FFFBEA", border: "#F59E0B", text: "#F59E0B" },
  free: { label: "Free", icon: "🎁", bg: "#EAFFF2", border: "#22C55E", text: "#22C55E" },
};

export default function PostListingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [listingType, setListingType] = useState<ListingType | null>(null);
  const [formData, setFormData] = useState({
    title: "", description: "", category: "", condition: "", price: "", deposit: "", rentRate: "", delivery: "pickup",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep((p) => p + 1); };
  const handleBack = () => { if (currentStep > 0) setCurrentStep((p) => p - 1); };
  const updateField = (field: string, value: string) => setFormData((p) => ({ ...p, [field]: value }));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const newImages = [...images];
      for (const file of Array.from(e.target.files)) {
        if (newImages.length >= 8) break;
        const res = await listingsApi.uploadImage(file);
        const isAbsolute = res.url.startsWith('http');
        const fullUrl = isAbsolute ? res.url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${res.url}`;
        newImages.push(fullUrl);
      }
      setImages(newImages);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image. Max size is 5MB.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", border: "1px solid #F0DDD4", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#1A0A00", transition: "border-color 0.2s",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FDF8F5" }}>
      <Navbar />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 24px 64px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A0A00", margin: "0 0 4px 0" }}>Post a Listing</h1>
        <p style={{ fontSize: 13, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: "0 0 28px 0" }}>List something for your fellow MUJ students</p>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 28, overflowX: "auto", paddingBottom: 8 }} className="hide-scrollbar">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 50, fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                background: i === currentStep ? "#E8521A" : i < currentStep ? "#FFF0EA" : "#F3F4F6",
                color: i === currentStep ? "#fff" : i < currentStep ? "#E8521A" : "#6B7280",
                whiteSpace: "nowrap"
              }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                  {i < currentStep ? "✓" : i + 1}
                </span>
                <span className="step-label">{step}</span>
              </div>
              {i < steps.length - 1 && <div style={{ minWidth: 20, flex: 1, height: 2, borderRadius: 50, background: i < currentStep ? "#E8521A" : "#F3F4F6" }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0DDD4", padding: 28 }} className="content-card">
          {currentStep === 0 && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", margin: "0 0 16px 0" }}>What type of listing?</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="type-grid">
                {(Object.keys(typeConfig) as ListingType[]).map((type) => {
                  const c = typeConfig[type];
                  const isSelected = listingType === type;
                  return (
                    <button key={type} onClick={() => setListingType(type)} style={{
                      padding: 20, borderRadius: 12, border: `2px solid ${isSelected ? c.border : "#F0DDD4"}`,
                      background: isSelected ? c.bg : "#fff", textAlign: "left", cursor: "pointer", transition: "all 0.2s",
                    }}>
                      <span style={{ fontSize: 24, display: "block", marginBottom: 8 }}>{c.icon}</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: isSelected ? c.text : "#1A0A00", display: "block" }}>{c.label}</span>
                      <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
                        {type === "sell" && "Sell your items"}
                        {type === "resale" && "Second-hand items"}
                        {type === "rent" && "Rent out temporarily"}
                        {type === "free" && "Give away for free"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", margin: "0 0 16px 0" }}>Add Photos</h2>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                multiple 
                accept="image/jpeg, image/png, image/webp, image/gif" 
                style={{ display: "none" }} 
              />
              
              {images.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12, marginBottom: 20 }}>
                  {images.map((img, idx) => (
                    <div key={idx} style={{ position: "relative", paddingTop: "100%", borderRadius: 12, overflow: "hidden", border: "1px solid #F0DDD4" }}>
                      <img src={img} alt={`Upload ${idx}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => removeImage(idx)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12 }}>✕</button>
                      {idx === 0 && <span style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 4, fontFamily: "'DM Sans', sans-serif" }}>Cover</span>}
                    </div>
                  ))}
                  {images.length < 8 && (
                    <div onClick={() => fileInputRef.current?.click()} style={{ position: "relative", paddingTop: "100%", borderRadius: 12, border: "2px dashed #F0DDD4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB" }}>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#9CA3AF" }}>+</div>
                    </div>
                  )}
                </div>
              )}

              {images.length === 0 && (
                <div onClick={() => fileInputRef.current?.click()} style={{ border: "2px dashed #F0DDD4", borderRadius: 14, padding: 48, textAlign: "center", cursor: uploading ? "wait" : "pointer", transition: "border-color 0.2s", background: uploading ? "#F9FAFB" : "#fff" }}>
                  <div style={{ width: 64, height: 64, margin: "0 auto 16px", background: "#FFF0EA", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 28 }}>{uploading ? "⏳" : "📷"}</span>
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, color: "#1A0A00", margin: "0 0 4px 0" }}>{uploading ? "Uploading..." : "Click to upload photos"}</p>
                  <p style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>Up to 8 photos · 5MB max each · PNG, JPG</p>
                </div>
              )}
              
              <p style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginTop: 12 }}>📌 First photo will be the thumbnail</p>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", margin: 0 }}>Listing Details</h2>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#1A0A00", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Title</label>
                <input type="text" value={formData.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Sony WH-1000XM4 Headphones" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#1A0A00", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Category</label>
                <select value={formData.category} onChange={(e) => updateField("category", e.target.value)} style={{ ...inputStyle, background: "#fff" }}>
                  <option value="">Select category</option>
                  {["Electronics", "Books", "Furniture", "Cycles", "Clothing", "Gaming", "Room Essentials", "Other"].map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#1A0A00", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Condition</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["New", "Good", "Fair", "Damaged"].map((c) => (
                    <button key={c} onClick={() => updateField("condition", c)} style={{ padding: "7px 16px", borderRadius: 50, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", background: formData.condition === c ? "#E8521A" : "#F3F4F6", color: formData.condition === c ? "#fff" : "#6B7280", border: "none", cursor: "pointer", transition: "all 0.2s" }}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#1A0A00", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Description</label>
                <textarea value={formData.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Describe your item..." rows={4} style={{ ...inputStyle, resize: "none" }} />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", margin: 0 }}>Pricing</h2>
              {listingType === "free" ? (
                <div style={{ padding: 24, background: "rgba(34,197,94,0.05)", borderRadius: 12, border: "1px solid rgba(34,197,94,0.2)", textAlign: "center" }}>
                  <span style={{ fontSize: 28 }}>🎁</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#22C55E", marginTop: 8 }}>This listing is free!</p>
                  <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>No price needed.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#1A0A00", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                      {listingType === "rent" ? "Daily Rate (₹)" : "Price (₹)"}
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#6B7280" }}>₹</span>
                      <input type="number" value={listingType === "rent" ? formData.rentRate : formData.price} onChange={(e) => updateField(listingType === "rent" ? "rentRate" : "price", e.target.value)} placeholder="0" style={{ ...inputStyle, paddingLeft: 28 }} />
                    </div>
                  </div>
                  {listingType === "rent" && (
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#1A0A00", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Security Deposit (₹)</label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#6B7280" }}>₹</span>
                        <input type="number" value={formData.deposit} onChange={(e) => updateField("deposit", e.target.value)} placeholder="0" style={{ ...inputStyle, paddingLeft: 28 }} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A0A00", margin: 0 }}>Delivery Options</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { value: "pickup", label: "Campus Pickup", desc: "Buyer picks up from your location" },
                  { value: "delivery", label: "Campus Delivery", desc: "You deliver within campus" },
                  { value: "both", label: "Both", desc: "Flexible — buyer chooses" },
                ].map((option) => (
                  <button key={option.value} onClick={() => updateField("delivery", option.value)} style={{
                    width: "100%", padding: 16, borderRadius: 12, border: `2px solid ${formData.delivery === option.value ? "#E8521A" : "#F0DDD4"}`,
                    background: formData.delivery === option.value ? "#FFF0EA" : "#fff", textAlign: "left", cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, color: "#1A0A00", display: "block" }}>{option.label}</span>
                    <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>{option.desc}</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 8, padding: 16, background: "#FFF0EA", borderRadius: 12 }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, color: "#1A0A00", margin: "0 0 4px 0" }}>Ready to post?</p>
                <p style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>Your listing will go live after a quick review.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
            {currentStep > 0 && (
              <button onClick={handleBack} style={{ padding: "9px 24px", border: "1px solid #F0DDD4", color: "#1A0A00", borderRadius: 50, fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, background: "transparent", cursor: "pointer", transition: "all 0.2s" }}>Back</button>
            )}
            <button 
              onClick={currentStep === steps.length - 1 ? async () => {
                try {
                  setUploading(true);
                  const submitPrice = listingType === 'rent' ? formData.rentRate : formData.price;
                  await listingsApi.create({ ...formData, price: submitPrice, type: listingType!, images });
                  window.location.href = "/my-listings";
                } catch (err) {
                  alert("Failed to create listing: " + (err as Error).message);
                } finally {
                  setUploading(false);
                }
              } : handleNext} 
              disabled={(currentStep === 0 && !listingType) || uploading} 
              style={{
                flex: 1, padding: "9px 24px", borderRadius: 50, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, border: "none", cursor: (currentStep === 0 && !listingType) || uploading ? "not-allowed" : "pointer", transition: "all 0.2s",
                background: (currentStep === 0 && !listingType) || uploading ? "#F3F4F6" : "#E8521A",
                color: (currentStep === 0 && !listingType) || uploading ? "#6B7280" : "#fff",
              }}>
              {uploading ? "Please wait..." : currentStep === steps.length - 1 ? "Post Listing" : "Continue"}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .type-grid { grid-template-columns: 1fr !important; }
          .content-card { padding: 20px !important; }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
