import React from 'react';

const VARIANT_CLASSES = {
  card: {
    // Inventory card/grid: Unsplash-style 1200x800 frame (3:2).
    // Keep the current large white image panel, but prevent edge cropping.
    frame: 'aspect-[3/2] bg-white',
    image: 'object-contain object-center p-0',
  },
  list: {
    // Inventory list view: fills the left media panel without cropping the container.
    frame: 'h-full w-full bg-white',
    image: 'object-contain object-center p-0',
  },
  gallery: {
    // Product detail gallery: inspection view, keep the full container visible.
    frame: 'aspect-[4/3] bg-white',
    image: 'object-contain object-center p-0',
  },
  thumbnail: {
    frame: 'w-16 h-16 bg-white',
    image: 'object-contain object-center p-0',
  },
  feature: {
    frame: 'aspect-[3/2] bg-white',
    image: 'object-contain object-center p-0',
  },
};

export default function PremiumContainerImage({
  src,
  alt = 'Container',
  variant = 'card',
  className = '',
  imageClassName = '',
  loading = 'lazy',
}) {
  const classes = VARIANT_CLASSES[variant] || VARIANT_CLASSES.card;

  if (!src) {
    return (
      <div
        className={`relative overflow-hidden bg-white flex items-center justify-center ${classes.frame} ${className}`}
      >
        <span className="text-muted-foreground font-mono text-sm">NO IMAGE</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${classes.frame} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full select-none ${classes.image} ${imageClassName}`}
        loading={loading}
      />
    </div>
  );
}
