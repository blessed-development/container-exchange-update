import React, { useEffect, useState } from 'react';
import { Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '@/components/shared/QuickViewModal';

import {
  getSavedSelectedLocation,
  getLocalizedPrice,
} from '../../lib/locationEngine';

const GRADE_LABELS = {
  AS_IS: 'As-Is',
  WWT: 'Wind & Water Tight',
  CW: 'Cargo Worthy',
  IICL: 'IICL Certified',
};

export default function InventoryListCard({ container, index }) {
  const [showModal, setShowModal] = useState(false);
  const [savedLocation, setSavedLocation] = useState(() =>
    getSavedSelectedLocation()
  );

  const navigate = useNavigate();

  useEffect(() => {
    const refreshLocation = () => {
      setSavedLocation(getSavedSelectedLocation());
    };

    window.addEventListener('ce-location-change', refreshLocation);
    window.addEventListener('storage', refreshLocation);

    return () => {
      window.removeEventListener('ce-location-change', refreshLocation);
      window.removeEventListener('storage', refreshLocation);
    };
  }, []);

  const stars = Math.round(container.rating || 5);
  const gradeLabel = GRADE_LABELS[container.grade] || container.grade;

  const hasZip = Boolean(savedLocation?.postalCode);

  const displayPrice = getLocalizedPrice(
    container.base_price || container.price || 0,
    savedLocation
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.35 }}
        onClick={() => navigate(`/product/${container.id}`)}
        className="bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden flex flex-col sm:flex-row cursor-pointer"
      >
        <div
          className="relative sm:w-[35%] flex-shrink-0 bg-muted overflow-hidden"
          style={{ minHeight: '220px' }}
        >
          {container.is_bestseller && (
            <span className="absolute top-4 left-4 z-10 text-[11px] font-mono font-bold tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full shadow-lg">
              BESTSELLER
            </span>
          )}

          <img
            src={
              container.image_url ||
              'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80'
            }
            alt={container.name}
            className="w-full h-full object-cover"
            style={{ minHeight: '220px' }}
          />
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-foreground text-base leading-snug mb-1">
              {container.name}
            </h3>

            {container.short_description && (
              <p className="text-sm text-muted-foreground font-medium mb-3">
                {container.short_description}
              </p>
            )}

            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-sm font-bold text-foreground">
                {(container.rating || 5).toFixed(1)}
              </span>

              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < stars
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted-foreground'
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs text-muted-foreground">
                ({container.review_count || 0})
              </span>
            </div>

            <div className="mb-3">
              {!hasZip && (
                <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1">
                  Starting From
                </div>
              )}

              <p className="text-2xl font-black text-primary">
                ${Number(displayPrice || 0).toLocaleString()}
              </p>
            </div>

            <div className="space-y-1 text-sm mb-4">
              {[
                ['Condition', container.condition],
                ['Door Type', container.door_type || 'Double Doors at 1 End'],
                ['Grade', gradeLabel],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <span className="font-semibold text-foreground w-24 flex-shrink-0">
                    {label}:
                  </span>
                  <span className="text-foreground/80">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="rounded-xl h-10 font-semibold border-2 hover:border-primary hover:text-primary transition-all gap-2"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </Button>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <QuickViewModal
          container={container}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
