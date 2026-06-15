import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageSlider from '@/components/shared/ImageSlider';

const PRODUCTS = [
  {
    id: 'new-20-iicl',
    badge: 'BEST SELLER',
    name: 'New 20ft One-Trip Shipping Container | IICL',
    subtitle: 'IICL Certified • Standard Height',
    rating: 5.0,
    reviewCount: 184,
    description:
      'Unit is in NEW One Trip A Grade condition. Roof, seals, doors, and floors are in smooth working condition as expected of a new unit.',
    images: [
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&q=85',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=85',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=900&q=85',
    ],
  },
  {
    id: 'new-40hc-iicl',
    badge: 'BEST SELLER',
    name: 'New 40HC One-Trip Shipping Container | IICL',
    subtitle: 'IICL Certified • High Cube',
    rating: 5.0,
    reviewCount: 124,
    description:
      'Extra height one-trip container built for secure storage, commercial use, and projects needing more interior clearance.',
    images: [
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=85',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&q=85',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=900&q=85',
    ],
  },
  {
    id: 'used-40hc-wwt',
    badge: 'BEST SELLER',
    name: 'Used 40HC Wind & Water Tight Shipping Container | WWT',
    subtitle: 'Wind & Water Tight • High Cube',
    rating: 4.8,
    reviewCount: 198,
    description:
      'A dependable used high cube container option for customers who need secure storage with extra vertical space.',
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
            Best Selling{' '}
            <span className="text-primary">
              Containers
            </span>
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
        className="group block h-full overflow-hidden rounded-[28px] border border-border bg-card hover:border-primary/35 hover:shadow-2xl hover:shadow-black/10 transition-all duration-500"
      >
        <div className="relative h-[260px] overflow-hidden bg-muted">
          <ImageSlider
            images={product.images}
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          <div className="absolute top-4 left-4 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-[10px] font-black tracking-[0.14em]">
            BEST SELLER
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-sm font-black text-white">
              {product.rating.toFixed(1)}
            </span>

            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < stars
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          <h3 className="text-[22px] font-black leading-[1.05] tracking-tight mb-2 text-white group-hover:text-white transition-colors">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            {product.subtitle}
          </p>

          <p className="text-[15px] leading-6 text-foreground/70 line-clamp-1 mb-6">
            {product.description}
          </p>

          <div className="inline-flex items-center gap-2 text-primary text-[12px] font-black tracking-[0.18em] uppercase">
            View Container
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
