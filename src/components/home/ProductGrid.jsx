import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ImageSlider from '@/components/shared/ImageSlider';

const PRODUCTS = [
  {
    id: 'new-20-iicl',
    name: 'New 20ft One-Trip Shipping Container | IICL',
    subtitle: 'IICL Certified • Standard Height',
    rating: 5.0,
    reviewCount: 184,
    description:
      'Unit is in NEW One Trip A Grade condition. Roof, seals, doors, and floors are in smooth working condition as expected of a new unit.',
    images: [
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
    ],
  },
  {
    id: 'new-40hc-iicl',
    name: 'New 40HC One-Trip Shipping Container | IICL',
    subtitle: 'IICL Certified • High Cube',
    rating: 5.0,
    reviewCount: 124,
    description:
      'Extra height one-trip container built for secure storage, commercial use, and projects needing more interior clearance.',
    images: [
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80',
    ],
  },
  {
    id: 'used-40hc-wwt',
    name: 'Used 40HC Wind & Water Tight Shipping Container | WWT',
    subtitle: 'Wind & Water Tight • High Cube',
    rating: 4.8,
    reviewCount: 198,
    description:
      'A dependable used high cube container option for customers who need secure storage with extra vertical space.',
    images: [
      'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
    ],
  },
];

export default function ProductGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-4">
            FEATURED
          </span>

          <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            Popular <span className="text-primary">Containers</span>
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
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
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col sm:flex-row"
    >
      <Link
        to={`/product/${product.id}`}
        className="sm:w-[38%] flex-shrink-0 relative bg-muted overflow-hidden block"
        style={{ minHeight: '240px' }}
      >
        <ImageSlider images={product.images} className="absolute inset-0" />

        <div className="absolute top-4 left-4 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-[10px] font-black tracking-[0.14em]">
          BEST SELLER
        </div>
      </Link>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm font-bold text-foreground">
              {product.rating.toFixed(1)}
            </span>

            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < stars
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-muted text-muted-foreground'
                  }`}
                />
              ))}
            </div>

            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-black text-foreground text-[24px] leading-tight mb-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mb-4">
            {product.subtitle}
          </p>

          <p className="text-[15px] leading-6 text-foreground/70 line-clamp-2 mb-5">
            {product.description}
          </p>
        </div>

        <div className="flex gap-3">
          <Link to={`/product/${product.id}`} className="flex-1">
            <Button className="w-full rounded-xl h-11 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 gap-2">
              View Container
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
