import React, { useState } from 'react';
import { Star, Eye, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '@/components/shared/QuickViewModal';

const GRADE_LABELS = {
  'AS_IS': 'As-Is',
  'WWT': 'Wind & Water Tight',
  'CW': 'Cargo Worthy',
  'IICL': 'IICL Certified',
};

export default function InventoryListCard({ container, index }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const stars = Math.round(container.rating || 5);
  const gradeLabel = GRADE_LABELS[container.grade] || container.grade;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.35 }}
        onClick={() => navigate(`/product/${container.id}`)}
        className="bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col sm:flex-row cursor-pointer group"
      >
        {/* LEFT — Image */}
        <div className="sm:w-[32%] flex-shrink-0 bg-muted overflow-hidden relative" style={{ minHeight: '220px' }}>
          <img
            src={container.image_url || 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80'}
            alt={container.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            style={{ minHeight: '220px' }}
          />
          {container.is_bestseller && (
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-mono font-bold tracking-wider bg-primary text-white px-2.5 py-1 rounded-full shadow-lg">BESTSELLER</span>
            </div>
          )}
        </div>

        {/* RIGHT — Details */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="text-[10px] font-mono bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full">{container.size}ft</span>
              {container.height === 'high_cube' && (
                <span className="text-[10px] font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">HIGH CUBE</span>
              )}
              {container.is_available ? (
                <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">● In Stock</span>
              ) : (
                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">Limited</span>
              )}
            </div>

            <h3 className="font-bold text-foreground text-base leading-snug mb-2 group-hover:text-primary transition-colors">{container.name}</h3>

            {/* Stars */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-sm font-bold text-foreground">{(container.rating || 5).toFixed(1)}</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({container.review_count || 0})</span>
            </div>

            {/* Price — prominent */}
            <p className="text-3xl font-black text-foreground mb-3 font-mono tracking-tight">
              ${container.base_price?.toLocaleString() || '—'}
            </p>

            {/* Specs */}
            <div className="space-y-1 text-sm mb-4">
              {[
                ['Condition', container.condition],
                ['Grade', gradeLabel],
                ['Door Type', container.door_type || 'Double Doors at 1 End'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <span className="font-semibold text-muted-foreground w-20 flex-shrink-0 text-xs">{label}</span>
                  <span className="text-foreground/80 text-xs capitalize">{value}</span>
                </div>
              ))}
              {container.short_description && (
                <p className="text-xs text-muted-foreground pt-1 line-clamp-2 italic">{container.short_description}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl border-2 border-border text-foreground text-xs font-bold hover:border-primary hover:text-primary transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
            <a
              href="tel:+18889779085"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              (888) 977-9085
            </a>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <QuickViewModal container={container} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}