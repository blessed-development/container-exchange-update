import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ContainerGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const allImages = images?.length > 0 ? images : [];

  if (allImages.length === 0) {
    return (
      <div className="aspect-[4/3] bg-muted rounded-sm flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm">NO IMAGE</span>
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-[4/3] bg-muted rounded-2xl overflow-hidden mb-3 shadow-xl">
        <img
          src={allImages[activeIndex]}
          alt="Container"
          className="w-full h-full object-cover"
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent/70 text-white rounded-sm flex items-center justify-center hover:bg-accent transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent/70 text-white rounded-sm flex items-center justify-center hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}