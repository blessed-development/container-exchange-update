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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <Link to={`/product/${container.id}${zipCode ? `?zip=${zipCode}` : ''}`}>
        <div className="group bg-card border border-border hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col">
          {/* Rectangular Image — 16:9 */}
          <div className="relative aspect-video overflow-hidden bg-muted flex-shrink-0">
            <img
              src={container.image_url}
              alt={container.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {container.is_bestseller && (
                <Badge className="bg-primary text-primary-foreground font-mono text-xs tracking-wider rounded-full shadow-lg shadow-primary/30">
                  BESTSELLER
                </Badge>
              )}
              <Badge className={`${CONDITION_COLORS[container.condition]} font-mono text-xs tracking-wider rounded-full`}>
                {container.condition?.toUpperCase()}
              </Badge>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-accent/80 via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
              <span className="text-white font-semibold text-sm flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                VIEW DETAILS <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-5 flex flex-col flex-1">
            {/* Tags row */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{gradeLabel}</span>
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{container.size}ft</span>
              {container.height === 'high_cube' && (
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">HIGH CUBE</span>
              )}
            </div>

            {/* Name */}
            <h3 className="font-bold text-foreground text-base leading-tight mb-2 group-hover:text-primary transition-colors">
              {container.name}
            </h3>

            {/* Short desc */}
            {container.short_description && (
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2 flex-1">{container.short_description}</p>
            )}

            {/* Price + CTA */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
              <div>
                <span className="text-xs text-muted-foreground">Starts at</span>
                <p className="text-xl font-black text-primary font-mono">
                  ${container.base_price?.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {container.is_available ? (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    Limited
                  </span>
                )}
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Get Quote
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}