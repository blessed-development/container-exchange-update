import React from 'react';

const VARIANT_CLASSES = {
  card: {
    frame: 'aspect-video rounded-2xl shadow-sm',
    image: 'p-3 sm:p-4',
  },
  list: {
    frame: 'h-[260px] sm:h-full rounded-none shadow-none',
    image: 'p-3 sm:p-4',
  },
  gallery: {
    frame: 'aspect-[4/3] rounded-2xl shadow-xl',
    image: 'p-5 sm:p-6',
  },
  thumbnail: {
    frame: 'w-16 h-16 rounded-xl shadow-none',
    image: 'p-1.5',
  },
  feature: {
    frame: 'aspect-video rounded-2xl shadow-sm',
    image: 'p-4 sm:p-5',
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
  const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.card;

  if (!src) {
    return (
      <div
        className={`relative overflow-hidden bg-muted flex items-center justify-center ${variantClasses.frame} ${className}`}
      >
        <span className="text-muted-foreground font-mono text-sm">NO IMAGE</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-muted ${variantClasses.frame} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain object-center select-none ${variantClasses.image} ${imageClassName}`}
        loading={loading}
      />
    </div>
  );
}
