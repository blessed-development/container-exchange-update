import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PremiumContainerImage from '@/components/shared/PremiumContainerImage';

export default function ContainerGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const allImages = images?.length > 0 ? images : [];

  if (allImages.length === 0) {
    return <PremiumContainerImage variant="gallery" />;
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative mb-3">
        <PremiumContainerImage
          src={allImages[activeIndex]}
          alt="Container"
          variant="gallery"
          loading="eager"
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent/70 text-white rounded-sm flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent/70 text-white rounded-sm flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                i === activeIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`Show image ${i + 1}`}
            >
              <PremiumContainerImage src={img} alt="" variant="thumbnail" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
