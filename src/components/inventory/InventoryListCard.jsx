import React, { useEffect, useState } from 'react';
import { Star, Eye, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '@/components/shared/QuickViewModal';
import ZipRequiredModal from '@/components/shared/ZipRequiredModal';

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
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showZipModal, setShowZipModal] = useState(false);
  const [savedLocation, setSavedLocation] = useState(() =>
    getSavedSelectedLocation()
  );

  useEffect(() => {
    const syncLocation = (event) => {
      setSavedLocation(event?.detail || getSavedSelectedLocation());
    };

    window.addEventListener('ce-location-change', syncLocation);
    window.addEventListener('storage', syncLocation);
    window.addEventListener('focus', syncLocation);
    window.addEventListener('pageshow', syncLocation);

    return () => {
      window.removeEventListener('ce-location-change', syncLocation);
      window.removeEventListener('storage', syncLocation);
      window.removeEventListener('focus', syncLocation);
      window.removeEventListener('pageshow', syncLocation);
    };
  }, []);

  const stars = Math.round(container.rating || 5);
  const gradeLabel = GRADE_LABELS[container.grade] || container.grade;
  const hasZip = Boolean(savedLocation?.postalCode);
  const hasWideCatalogImage = [
    'new-20-iicl',
    'new-40hc-iicl',
    'used-20-wwt',
    'used-40-wwt',
    'used-40hc-wwt',
  ].includes(
    container?.id
  );

  const displayPrice = getLocalizedPrice(
    container.base_price || container.price || 0,
    savedLocation
  );

  const openProduct = (e) => {
    e.stopPropagation();

    if (!hasZip) {
      setShowZipModal(true);
      return;
    }

    navigate(`/product/${container.id}`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.35 }}
        onClick={openProduct}
        className="bg-card border border-border hover:border-primary/25 hover:shadow-xl rounded-[26px] overflow-hidden flex flex-col sm:flex-row sm:h-[344px] cursor-pointer transition-all duration-300"
      >
        <div
          className={`relative h-[260px] sm:h-full ${hasWideCatalogImage ? 'sm:w-[38%]' : 'sm:w-[38%]'} overflow-hidden bg-muted`}
        >
          {container.is_bestseller && (
            <div className="absolute top-4 left-4 z-10 rounded-full px-3 py-[7px] text-[11px] font-black tracking-[.08em] text-white bg-gradient-to-b from-orange-500 to-orange-700 shadow-lg">
              BESTSELLER
            </div>
          )}

          <img
            src={
              container.inventory_image_url ||
              container.image_url ||
              'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80'
            }
            alt={container.name}
            className="w-full h-full object-contain object-center hover:scale-[1.02] transition-transform duration-500"
          />
        </div>

        <div className="flex-1 min-w-0 px-6 pt-5 pb-5 flex flex-col justify-between">
          <div>
            <h3 className="text-[18px] leading-[1.14] font-[820] tracking-[-0.03em] text-foreground mb-[8px]">
              {container.name}
            </h3>

            {container.short_description && (
              <div className="text-[14px] font-[560] leading-[1.35] text-muted-foreground mb-[14px]">
                {container.short_description}
              </div>
            )}

            <div className="flex items-center gap-1.5 mb-[14px]">
              <span className="text-[14px] font-[850]">
                {(container.rating || 5).toFixed(1)}
              </span>

              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-[14px] h-[14px] ${
                      i < stars
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted-foreground'
                    }`}
                  />
                ))}
              </div>

              <span className="text-[12px] text-muted-foreground">
                ({container.review_count || 0})
              </span>
            </div>

            <div className="mb-[16px]">
              {!hasZip ? (
                <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1">
                  Starting From
                </div>
              ) : (
                <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-green-600 mb-1">
                  {savedLocation?.city}, {savedLocation?.state}
                </div>
              )}

              <div className="text-[34px] leading-none font-black text-primary tracking-[-0.05em]">
                ${Number(displayPrice || 0).toLocaleString()}
              </div>
            </div>

            <div className="space-y-[7px] text-[13px]">
              {[
                ['Condition', container.condition],
                ['Door Type', container.door_type || 'Double Doors at 1 End'],
                ['Grade', gradeLabel],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <span className="font-[760] w-[92px] flex-shrink-0">
                    {label}:
                  </span>

                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="h-[42px] rounded-[14px] font-[760] gap-2"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </Button>

            <a
              href="tel:+18005551234"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[14px] border border-primary/30 bg-primary/10 px-4 text-sm font-[760] text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              <Phone className="w-4 h-4" />
              (800) 555-1234
            </a>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <QuickViewModal
          container={container}
          onClose={() => setShowModal(false)}
        />
      )}

      {showZipModal && (
        <ZipRequiredModal
          open={true}
          onClose={() => setShowZipModal(false)}
          onSuccess={(location) => {
            setShowZipModal(false);
            setSavedLocation(location || getSavedSelectedLocation());
          }}
        />
      )}
    </>
  );
}
