import React from 'react';

const VARIANT_CLASSES = {
  card: {
    frame: 'aspect-[3/2] rounded-2xl shadow-sm bg-white',
    image: '!object-contain !object-center !p-0 !scale-100',
  },
  list: {
    frame: 'h-[260px] sm:h-full rounded-none shadow-none bg-white',
    image: '!object-contain !object-center !p-0 !scale-100',
  },
  gallery: {
    frame: 'aspect-[4/3] rounded-2xl shadow-xl bg-white',
    image: '!object-contain !object-center !p-0 !scale-100',
  },
  thumbnail: {
    frame: 'w-16 h-16 rounded-xl shadow-none bg-white',
    image: '!object-contain !object-center !p-0 !scale-100',
  },
  feature: {
    frame: 'aspect-[3/2] rounded-2xl shadow-sm bg-white',
    image: '!object-contain !object-center !p-0 !scale-100',
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
    <div className={`relative flex items-center justify-center overflow-hidden ${classes.frame} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`block w-full h-full max-w-full max-h-full ${classes.image} ${imageClassName}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
