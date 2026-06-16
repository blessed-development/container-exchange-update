import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCT_GROUPS = [
  [
    {
      id: 'new-20-iicl',
      name: 'New 20ft One-Trip Shipping Container | IICL',
      rating: 5.0,
      reviewCount: 184,
      image:
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&q=85',
    },
    {
      id: 'new-40-iicl',
      name: 'New 40ft One-Trip Shipping Container | IICL',
      rating: 4.9,
      reviewCount: 102,
      image:
        'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=900&q=85',
    },
    {
      id: 'new-40hc-iicl',
      name: 'New 40HC One-Trip Shipping Container | IICL',
      rating: 5.0,
      reviewCount: 124,
      image:
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=85',
    },
  ],
  [
    {
      id: 'used-20-cw',
      name: 'Used 20ft Cargo Worthy Shipping Container | CW',
      rating: 4.8,
      reviewCount: 142,
      image:
        'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=900&q=85',
    },
    {
      id: 'used-40-cw',
      name: 'Used 40ft Cargo Worthy Shipping Container | CW',
      rating: 4.7,
      reviewCount: 161,
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85',
    },
    {
      id: 'used-40hc-wwt',
      name: 'Used 40HC Wind & Water Tight Shipping Container | WWT',
      rating: 4.8,
      reviewCount: 198,
      image:
        'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=900&q=85',
    },
  ],
];

export default function ProductGrid() {
  const [activeGroup, setActiveGroup] = useState(0);

  const nextGroup = () => {
    setActiveGroup((current) => (current + 1) % PRODUCT_GROUPS.length);
  };

  const prevGroup = () => {
    setActiveGroup((current) =>
      current === 0 ? PRODUCT_GROUPS.length - 1 : current - 1
    );
  };

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-4">
            FEATURED
          </span>

          <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            Best Selling <span className="text-primary">Containers</span>
          </h2>

          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Explore popular container types customers request most often.
          </p>
        </div>

        <button
          type="button"
          onClick={prevGroup}
          className="hidden lg:flex absolute left-[-18px] top-[58%] z-20 h-12 w-12 items-center justify-center rounded-full border border-border bg-card/90 backdrop-blur-xl text-foreground hover:border-primary/50 hover:text-primary hover:scale-105 transition-all"
          aria-label="Previous containers"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextGroup}
          className="hidden lg:flex absolute right-[-18px] top-[58%] z-20 h-12 w-12 items-center justify-center rounded-full border border-border bg-card/90 backdrop-blur-xl text-foreground hover:border-primary/50 hover:text-primary hover:scale-105 transition-all"
          aria-label="Next containers"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeGroup}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {PRODUCT_GROUPS[activeGroup].map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex items-center justify-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={prevGroup}
            className="h-11 w-11 rounded-full border border-border bg-card text-foreground flex items-center justify-center"
            aria-label="Previous containers"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={nextGroup}
            className="h-11 w-11 rounded-full border border-border bg-card text-foreground flex items-center justify-center"
            aria-label="Next containers"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }) {
  const navigate = useNavigate();
  const stars = Math.round(product.rating);

  const handleCardClick = () => {
    navigate(`/product/${product.id}?openZipModal=1`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <button
        type="button"
        onClick={handleCardClick}
        className="group text-left relative block h-[520px] w-full overflow-hidden rounded-[32px] border border-border bg-card hover:border-primary/40 hover:shadow-2xl hover:shadow-black/20 transition-all duration-500"
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />

        <div className="absolute top-5 left-5 rounded-full bg-primary text-primary-foreground px-3.5 py-1.5 text-[10px] font-black tracking-[0.14em]">
          BEST SELLER
        </div>

        <div className="absolute left-6 right-6 bottom-6">
          <h3 className="text-[25px] sm:text-[27px] font-black leading-[1.06] tracking-tight text-white mb-4">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < stars
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-white/25'
                  }`}
                />
              ))}
            </div>

            <span className="text-white font-semibold text-[15px]">
              {product.rating.toFixed(1)}
            </span>

            <span className="text-white/60 text-[13px]">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="h-11 rounded-[14px] bg-primary text-primary-foreground font-extrabold flex items-center justify-center gap-2 transition-all duration-300 group-hover:scale-[1.01]">
            View Container
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </button>
    </motion.div>
  );
}
