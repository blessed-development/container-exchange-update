import React from 'react';
import { X, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import ImageSlider from '@/components/shared/ImageSlider';
import { Link } from 'react-router-dom';

const GRADE_LABELS = {
  'AS_IS': 'As-Is',
  'WWT': 'Wind & Water Tight',
  'CW': 'Cargo Worthy',
  'IICL': 'IICL Certified',
};

export default function QuickViewModal({ container, onClose }) {
  if (!container) return null;

  const images = [
    container.image_url,
    ...(container.gallery_urls || []),
  ].filter(Boolean);

  // Fallback images if none stored
  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80',
    'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=80',
  ];

  const gradeLabel = GRADE_LABELS[container.grade] || container.grade;
  const stars = Math.round(container.rating || 5);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — Large Slider */}
            <div className="relative bg-muted rounded-tl-2xl rounded-bl-2xl overflow-hidden" style={{ minHeight: '360px' }}>
              <ImageSlider images={displayImages} className="absolute inset-0" />
            </div>

            {/* Right — Details */}
            <div className="p-6 flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-black text-foreground leading-snug mb-2">{container.name}</h2>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-sm font-bold">{(container.rating || 5).toFixed(1)}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({container.review_count || 0} reviews)</span>
                </div>

                {/* Price */}
                <p className="text-4xl font-black text-primary mb-4">
                  ${container.base_price?.toLocaleString() || '—'}
                </p>
              </div>

              {/* Specs */}
              <div className="space-y-2 text-sm border border-border rounded-xl p-4">
                {[
                  ['Size', `${container.size}ft`],
                  ['Condition', container.condition],
                  ['Height', container.height === 'high_cube' ? 'High Cube (9\'6")' : 'Standard (8\'6")'],
                  ['Door Type', container.door_type || 'Double Doors at 1 End'],
                  ['Grade', gradeLabel],
                  ['Available', container.is_available ? 'In Stock' : 'Limited'],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-2">
                    <span className="font-semibold text-foreground w-24 flex-shrink-0">{label}:</span>
                    <span className="text-foreground/80">{value}</span>
                  </div>
                ))}
                {container.description && (
                  <p className="text-muted-foreground text-xs pt-2 border-t border-border leading-relaxed">{container.description}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 mt-auto">
                <a href="tel:+18889779085">
                  <Button className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/25 gap-2">
                    <Phone className="w-5 h-5" />
                    Call Now: (888) 977-9085
                  </Button>
                </a>
                <Link to="/contact">
                  <Button variant="outline" className="w-full h-11 font-semibold rounded-xl border-2 hover:border-primary hover:text-primary transition-all">
                    Request a Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}