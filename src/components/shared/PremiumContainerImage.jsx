import React from 'react';

const VARIANT_CLASSES = {
  card: {
    // Inventory card/grid image: original Unsplash-style 1200x800 frame
    frame: 'aspect-[3/2] rounded-2xl shadow-sm bg-white',
    image: 'object-contain object-center p-0',
  },

  list: {
    // Inventory list view image
    frame: 'aspect-[3/2] sm:h-full rounded-none shadow-none bg-white',
    image: 'object-contain object-center p-0',
  },

  gallery: {
    // Product detail gallery: 1448x1086 style, close to 4:3
    frame: 'aspect-[4/3] rounded-2xl shadow-xl bg-white',
    image: 'object-contain object-center p-0',
  },

  thumbnail: {
    frame: 'w-16 h-16 rounded-xl shadow-none bg-white',
    image: 'object-contain object-center p-0',
  },

  feature: {
    frame: 'aspect-[3/2] rounded-2xl shadow-sm bg-white',
    image: 'object-contain object-center p-0',
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