import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PRODUCTS = [
  {
    id: 'new-20ft-iicl',
    name: 'New 20 ft Shipping Container Standard 8 ft 6 in High | New IICL',
    idLine: 'FKLU 212819 | 2261',
    weightLine: 'MAX GROSS 67,200 lbs | TARE 4,850 lbs | CL CAP 62,350 lbs',
    rating: 5.0,
    reviewCount: 1,
    price: '$2,900.00',
    condition: 'N/New',
    doorType: 'Double door at one end',
    grade: 'IICL',
    sku: 'N20SDV1DDIICLFONVAB',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80',
  },
  {
    id: 'used-40ft-hc',
    name: 'Used 40 ft High Cube Shipping Container | Wind & Water Tight',
    idLine: 'TCKU 384721 | 4001',
    weightLine: 'MAX GROSS 67,200 lbs | TARE 8,400 lbs | CL CAP 58,800 lbs',
    rating: 4.8,
    reviewCount: 156,
    price: '$3,200.00',
    condition: 'Used',
    doorType: 'Double Doors at 1 End',
    grade: 'Wind & Water Tight',
    sku: 'U40HCDV1DDWWTFONVAB',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
  },
  {
    id: 'used-20ft-cw',
    name: 'Used 20 ft Shipping Container Standard | Cargo Worthy (CW)',
    idLine: 'MSCU 193847 | 2202',
    weightLine: 'MAX GROSS 67,200 lbs | TARE 4,960 lbs | CL CAP 62,240 lbs',
    rating: 4.9,
    reviewCount: 134,
    price: '$2,100.00',
    condition: 'Used',
    doorType: 'Double Doors at 1 End',
    grade: 'Cargo Worthy',
    sku: 'U20SDV1DDCWFONVAB',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80',
  },
];

export default function ProductGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-4">FEATURED</span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            Popular{' '}
            <span className="text-primary">Containers</span>
          </h2>
        </div>

        {/* Vertical stack */}
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
      {/* LEFT — Image (35-40% width) */}
      <div className="sm:w-[38%] flex-shrink-0 bg-muted overflow-hidden min-h-[220px]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ minHeight: '220px' }}
        />
      </div>

      {/* RIGHT — Text content (60-65% width) */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-foreground text-base leading-snug mb-1">
            {product.name}
          </h3>

          {/* ID line */}
          <p className="text-xs text-muted-foreground font-mono mb-0.5">{product.idLine}</p>

          {/* Weight line */}
          <p className="text-xs text-muted-foreground mb-3">{product.weightLine}</p>

          {/* Star rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm font-bold text-foreground">{product.rating.toFixed(1)}</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <p className="text-3xl font-black text-foreground mb-4">{product.price}</p>

          {/* Details */}
          <div className="space-y-1 mb-5 text-sm">
            {[
              ['Condition', product.condition],
              ['Door Type', product.doorType],
              ['Grade', product.grade],
              ['SKU', product.sku],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-2">
                <span className="font-semibold text-foreground w-24 flex-shrink-0">{label}:</span>
                <span className={`text-foreground/80 ${label === 'SKU' ? 'font-mono text-xs' : ''}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link to="/inventory" className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-xl h-11 font-semibold border-2 hover:border-primary hover:text-primary transition-all"
            >
              Quick View
            </Button>
          </Link>
          <a href="tel:+18889779085" className="flex-1">
            <Button
              className="w-full rounded-xl h-11 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              (888) 977-9085
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}