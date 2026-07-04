import React from 'react';

const VARIANT_CLASSES = {
  card: {
    frame: 'aspect-video rounded-2xl shadow-sm bg-white',
    image: 'object-cover object-center p-0',
  },
  list: {
    frame: 'h-[260px] sm:h-full rounded-none shadow-none bg-white',
    image: 'object-cover object-center p-0',
  },
  gallery: {
    frame: 'aspect-[4/3] rounded-2xl shadow-xl bg-white',
    image: 'object-contain object-center p-0 scale-[1.04]',
  },
  thumbnail: {
    frame: 'w-16 h-16 rounded-xl shadow-none bg-white',
    image: 'object-cover object-center p-0',
  },
  feature: {
    frame: 'aspect-video rounded-2xl shadow-sm bg-white',
    image: 'object-cover object-center p-0',
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
        className={`relative overflow-hidden bg-white flex items-center justify-center ${variantClasses.frame} ${className}`}
      >
        <span className="text-muted-foreground font-mono text-sm">NO IMAGE</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${variantClasses.frame} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full select-none ${variantClasses.image} ${imageClassName}`}
        loading={loading}
      />
    </div>
  );
}
