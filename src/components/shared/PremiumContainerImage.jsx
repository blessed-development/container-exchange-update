import React from 'react';

const VARIANT_CLASSES = {
  card: {
    // Inventory card/grid: match the original Unsplash-style 1200x800 frame (3:2)
    frame: 'aspect-[3/2] bg-white',
    image: 'object-cover object-center p-0',
  },
  list: {
    // Inventory list: full left media panel, same wide crop behavior as the original 1200x800 references
    frame: 'h-full w-full bg-white',
    image: 'object-cover object-center p-0',
  },
  gallery: {
    // Product detail gallery: inspection view, keep the full container visible
    frame: 'aspect-[4/3] bg-white',
    image: 'object-contain object-center p-0',
  },
  thumbnail: {
    frame: 'w-16 h-16 bg-white',
    image: 'object-cover object-center p-0',
  },
  feature: {
    frame: 'aspect-[3/2] bg-white',
    image: 'object-cover object-center p-0',
  },
};

export default function PremiumContainerImage({
  src,
  alt = 'Container',
  variant = 'card',
  className = '',
  imageClassName = '',
}) {
  const classes = VARIANT_CLASSES[variant] || VARIANT_CLASSES.card;

  return (
    <div className={`relative overflow-hidden ${classes.frame} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full ${classes.image} ${imageClassName}`}
        loading="lazy"
      />
    </div>
  );
}
