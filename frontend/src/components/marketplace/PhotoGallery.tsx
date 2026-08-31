"use client";

import React, { useState } from "react";

interface PhotoGalleryProps {
  images: string[];
  title: string;
}

export default function PhotoGallery({ images, title }: PhotoGalleryProps) {
  const [mainImage, setMainImage] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-light">
        <img
          src={images[mainImage]}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500"
        />
        {/* Image counter */}
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm font-[family-name:var(--font-dm)]">
          {mainImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail row */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainImage(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === mainImage
                  ? "border-orange ring-2 ring-orange/20"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${title} - view ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
