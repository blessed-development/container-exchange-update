import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageSlider from '@/components/shared/ImageSlider';

const PRODUCTS = [
  {
    id: 'new-20-iicl',
    name: 'New 20ft One-Trip Shipping Container | IICL',
    rating: 5.0,
    reviewCount: 184,
    images: [
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&q=85',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=85',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=900&q=85',
    ],
  },
  {
    id: 'new-40hc-iicl',
    name: 'New 40HC One-Trip Shipping Container | IICL',
    rating: 5.0,
    reviewCount: 124,
    images: [
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=85',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&q=85',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=900&q=85',
    ],
  },
  {
    id: 'used-40hc-wwt',
    name: 'Used 40HC Wind & Water Tight Shipping Container | WWT',
    rating: 4.8,
    reviewCount: 198,
    images: [
      'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=900&q=85',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=85',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=900&q=85',
    ],
  },
];

export default function ProductGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }) {
  const stars = Math.round(product.rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group relative block h-[520px] overflow-hidden rounded-[32px] border border-border bg-card hover:border-primary/40 hover:shadow-2xl hover:shadow-black/20 transition-all duration-500"
      >
        <ImageSlider
          images={product.images}
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
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
                      ? 'fill-primary text-primary'
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

          <div className="h-11 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center gap-2 transition-all duration-300 group-hover:scale-[1.01]">
            View Container
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
