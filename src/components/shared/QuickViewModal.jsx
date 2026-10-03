import React from 'react';
import { X, Mail, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import ImageSlider from '@/components/shared/ImageSlider';
import { Link } from 'react-router-dom';
import { getLocalizedPriceInfo, getSavedSelectedLocation } from '@/lib/locationEngine';
import { COMPANY_CONTACT } from '@/config/companyContact';

const GRADE_LABELS = {
  'AS_IS': 'As-Is',
  'WWT': 'Wind & Water Tight',
  'CW': 'Cargo Worthy',
  'IICL': 'IICL Certified',
};

export default function QuickViewModal({ container, onClose }) {
  if (!container) return null;

  const images = [
    container.inventory_image_url || container.image_url,
    ...(container.gallery_urls || []),
  ].filter(Boolean);

  // Fallback images if none stored
  const displayImages = images.length > 0 ? images : [
    '/images/products/new-20-iicl/hero.webp',
    '/images/products/new-20-iicl/side-angle.webp',
    '/images/products/new-20-iicl/interior-1.webp',
  ];

  const gradeLabel = GRADE_LABELS[container.grade] || container.grade;
  const stars = Math.round(container.rating || 5);
  const priceInfo = getLocalizedPriceInfo(
    container.base_price || container.price || 0,
    getSavedSelectedLocation(),
    container
  );

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
            <div className="relative bg-muted rounded-tl-2xl rounded-bl-2xl overflow-hidden" style={{ minHeight: '320px' }}>
              <ImageSlider
                images={displayImages}
                className="h-full w-full"
                imageClassName="scale-[1.06]"
              />
            </div>

            {/* Right — Details */}
            <div className="p-5 flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-black text-foreground leading-tight mb-1.5 pr-8">{container.name}</h2>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm font-bold">{(container.rating || 5).toFixed(1)}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({container.review_count || 0} reviews)</span>
                </div>

                {/* Price */}
                {(priceInfo.isPublished || priceInfo.isIndicative) && (
                  <p className="text-3xl font-black text-primary mb-3">
                    ${priceInfo.price.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Specs */}
              <div className="space-y-1.5 text-sm border border-border rounded-xl p-3.5">
                {[
                  ['Size', `${container.size}ft`],
                  ['Condition', container.condition],
                  ['Height', container.height === 'high_cube' ? 'High Cube (9\'6")' : 'Standard (8\'6")'],
                  ['Door Type', container.door_type || 'Double Doors at 1 End'],
                  ['Grade', gradeLabel],
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
              <div className="flex flex-col sm:flex-row gap-2.5 mt-auto">
                <a href={`mailto:${COMPANY_CONTACT.email}?subject=${encodeURIComponent(`Quote request: ${container.name || 'Shipping Container'}`)}`} className="ce-secondary-link flex-1">
                  <Button variant="outline" className="ce-secondary-button h-11 w-full rounded-xl text-sm font-semibold gap-2 whitespace-nowrap">
                    <Mail className="w-4 h-4" />
                    Email Sales
                  </Button>
                </a>
                <Link to={`/contact?${new URLSearchParams({ container: container.name || 'Shipping Container', source: 'Quick view' }).toString()}`} className="ce-signature-link flex-1">
                  <Button className="ce-signature-button h-11 w-full rounded-xl text-sm font-semibold whitespace-nowrap">
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
