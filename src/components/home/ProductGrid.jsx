import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PRODUCTS = [
  {
    id: 'used-40ft-hc',
    name: 'Used 40ft High Cube Container — Wind & Water Tight',
    rating: 4.8,
    reviewCount: 156,
    condition: 'Used',
    doorType: 'Double Doors at 1 End',
    grade: 'Wind & Water Tight',
    sku: 'U48SDVD1DDWWT',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
  },
  {
    id: 'used-20ft-cw',
    name: 'Used 20ft Container — Cargo Worthy (CW)',
    rating: 4.9,
    reviewCount: 134,
    condition: 'Used',
    doorType: 'Double Doors at 1 End',
    grade: 'Cargo Worthy',
    sku: 'U28SDVD1DDCW',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80',
  },
  {
    id: 'used-10ft-mini',
    name: 'Used 10ft Mini Container — Wind & Water Tight',
    rating: 4.7,
    reviewCount: 72,
    condition: 'Used',
    doorType: 'Double Doors at 1 End',
    grade: 'Wind & Water Tight',
    sku: 'U105SDVD1DDWWT',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
  },
];

export default function ProductGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-4">FEATURED</span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            Popular{' '}
            <span className="text-primary">Containers</span>
          </h2>
        </div>

        {/* 3-column product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Centered phone button */}
        <div className="flex justify-center">
          <a href="tel:+18889779085">
            <Button className="h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all gap-3">
              <Phone className="w-5 h-5" />
              (888) 977-9085
            </Button>
          </a>
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
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-card border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 rounded-2xl overflow-hidden group"
    >
      {/* 3:2 image */}
      <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: '3/2' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-foreground text-sm leading-snug mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-sm font-bold text-foreground">{product.rating.toFixed(1)}</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Details */}
        <div className="space-y-1 mb-4 text-xs">
          {[
            ['Condition', product.condition],
            ['Door Type', product.doorType],
            ['Grade', product.grade],
            ['SKU', product.sku],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <span className="text-muted-foreground w-20 flex-shrink-0">{label}:</span>
              <span className={`font-medium text-foreground ${label === 'SKU' ? 'font-mono text-muted-foreground' : ''}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Quick View button only */}
        <Link to={`/inventory`}>
          <Button variant="outline" className="w-full rounded-xl h-9 text-sm font-semibold hover:border-primary/40 hover:text-primary transition-all">
            Quick View
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}