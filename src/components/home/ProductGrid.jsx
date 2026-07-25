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
        '/images/products/new-20-iicl/hero.webp',
    },
    {
      id: 'new-40-iicl',
      name: 'New 40ft One-Trip Shipping Container | IICL',
      rating: 4.9,
      reviewCount: 102,
      image:
        '/images/products/new-40-iicl/hero.webp',
    },
    {
      id: 'new-40hc-iicl',
      name: 'New 40HC One-Trip Shipping Container | IICL',
      rating: 5.0,
      reviewCount: 124,
      image:
        '/images/products/new-40hc-iicl/hero.webp',
    },
  ],
  [
    {
      id: 'used-20-cw',
      name: 'Used 20ft Cargo Worthy Shipping Container | CW',
      rating: 4.8,
      reviewCount: 142,
      image:
        '/images/products/used-20-cw/hero.webp',
    },
    {
      id: 'used-40-cw',
      name: 'Used 40ft Cargo Worthy Shipping Container | CW',
      rating: 4.7,
      reviewCount: 161,
      image:
        '/images/products/used-40-cw/hero.webp',
    },
    {
      id: 'used-40hc-wwt',
      name: 'Used 40HC Wind & Water Tight Shipping Container | WWT',
      rating: 4.8,
      reviewCount: 198,
      image:
        '/images/products/used-40hc-wwt/hero.webp',
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
  const isFeatured = index === 1;

  const handleCardClick = () => {
    navigate(`/product/${product.id}?openZipModal=1`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={isFeatured ? 'lg:-translate-y-3' : ''}
    >
      <button
        type="button"
        onClick={handleCardClick}
        className={`group block h-[530px] w-full overflow-hidden rounded-[28px] border text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 ${
          isFeatured ? 'border-primary/35 bg-card shadow-xl shadow-black/15' : 'border-border bg-card hover:border-primary/40'
        }`}
      >
        <div className="relative flex h-[58%] items-center justify-center overflow-hidden bg-[#e8e6e0] p-4 sm:p-5">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/15 to-transparent" />
          <div className="absolute left-5 top-5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-black tracking-[0.14em] text-primary-foreground shadow-lg shadow-primary/25">
            BEST SELLER
          </div>
        </div>

        <div className="flex h-[42%] flex-col justify-between bg-[#111214] px-6 py-5 text-white">
          <div>
            <p className="mb-2 text-[10px] font-black tracking-[0.15em] text-primary">READY FOR DELIVERY</p>
            <h3 className="line-clamp-2 text-[23px] font-black leading-[1.08] tracking-[-0.035em] text-white">
              {product.name}
            </h3>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-white/50">{product.reviewCount} reviews</span>
            </div>

            <div className="flex h-11 items-center justify-center gap-2 rounded-[13px] bg-primary text-sm font-extrabold text-primary-foreground transition-all duration-300 group-hover:bg-primary/90 group-hover:shadow-lg group-hover:shadow-primary/25">
              View Container
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
