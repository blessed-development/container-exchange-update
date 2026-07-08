import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const GRADE_LABELS = {
  'AS_IS': 'As-Is',
  'WWT': 'Wind & Water Tight',
  'CW': 'Cargo Worthy',
  'IICL': 'IICL',
};

export default function FeaturedCard({ container, index = 0 }) {
  const gradeLabel = GRADE_LABELS[container.grade] || container.grade;
  const conditionLabel = container.condition
    ? container.condition.charAt(0).toUpperCase() + container.condition.slice(1)
    : '—';
  const doorType = container.door_type || 'Double Doors at 1 End';
  const sku = container.sku || `${container.condition?.toUpperCase()?.slice(0,1)}${container.size}SDV1DD${container.grade}`;

  const rating = container.rating ?? 5.0;
  const reviewCount = container.review_count ?? 1;
  const stars = Math.round(rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-card border border-border hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 rounded-2xl overflow-hidden"
    >
      {/* 16:9 Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {container.image_url ? (
          <img
            src={container.image_url}
            alt={container.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground font-mono text-sm">NO IMAGE</span>
          </div>
        )}
        {container.is_bestseller && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-mono font-bold tracking-widest bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-lg shadow-primary/30">
              BESTSELLER
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-foreground text-base leading-tight mb-3 line-clamp-2">
          {container.name}
        </h3>

        {/* Star rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < stars ? 'fill-primary text-primary' : 'fill-muted text-muted'}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Details */}
        <div className="space-y-1.5 mb-5 text-sm">
          <div className="flex gap-2">
            <span className="text-muted-foreground w-24 flex-shrink-0">Condition:</span>
            <span className="font-medium text-foreground">{conditionLabel}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-24 flex-shrink-0">Door Type:</span>
            <span className="font-medium text-foreground">{doorType}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-24 flex-shrink-0">Grade:</span>
            <span className="font-medium text-foreground">{gradeLabel}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-24 flex-shrink-0">SKU:</span>
            <span className="font-mono text-xs text-muted-foreground">{sku}</span>
          </div>
        </div>

        {/* Two buttons */}
        <div className="flex gap-2">
          <Link to={`/product/${container.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-xl h-10 text-sm font-semibold border-border hover:border-primary/40 hover:-translate-y-0.5 transition-all"
            >
              Quick View
            </Button>
          </Link>
          <a href="tel:+18889779085" className="flex-1">
            <Button
              className="w-full rounded-xl h-10 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              (888) 977-9085
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}