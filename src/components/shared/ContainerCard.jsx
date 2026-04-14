import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const GRADE_LABELS = {
  'AS_IS': 'As-Is',
  'WWT': 'Wind & Water Tight',
  'CW': 'Cargo Worthy',
  'IICL': 'IICL Certified',
};

const CONDITION_COLORS = {
  'new': 'bg-primary text-primary-foreground',
  'used': 'bg-secondary text-secondary-foreground',
  'refurbished': 'bg-accent text-accent-foreground',
};

export default function ContainerCard({ container, zipCode, index = 0 }) {
  const gradeLabel = GRADE_LABELS[container.grade] || container.grade;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/product/${container.id}${zipCode ? `?zip=${zipCode}` : ''}`}>
        <div className="group bg-card border border-border hover:border-primary/30 transition-all duration-300 rounded-sm overflow-hidden">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={container.image_url}
              alt={container.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {container.is_bestseller && (
                <Badge className="bg-primary text-primary-foreground font-mono text-xs tracking-wider">
                  BESTSELLER
                </Badge>
              )}
              <Badge className={`${CONDITION_COLORS[container.condition]} font-mono text-xs tracking-wider`}>
                {container.condition?.toUpperCase()}
              </Badge>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-accent/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white font-semibold tracking-wider text-sm flex items-center gap-2">
                VIEW DETAILS <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            {/* Grade tag */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground tracking-wider">{gradeLabel}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-mono text-muted-foreground">{container.size}FT</span>
              {container.height === 'high_cube' && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs font-mono text-primary">HC</span>
                </>
              )}
            </div>

            {/* Name */}
            <h3 className="font-semibold text-foreground text-sm leading-tight mb-3 group-hover:text-primary transition-colors">
              {container.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span className="text-sm font-medium">{container.rating}</span>
              <span className="text-xs text-muted-foreground">({container.review_count})</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <div>
                <span className="text-xs text-muted-foreground font-mono">STARTS AT</span>
                <p className="text-xl font-bold text-primary font-mono">
                  ${container.base_price?.toLocaleString()}
                </p>
              </div>
              {container.is_available ? (
                <span className="text-xs font-mono text-green-600 bg-green-50 px-2 py-1 rounded-sm">
                  IN STOCK
                </span>
              ) : (
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-sm">
                  LIMITED
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}