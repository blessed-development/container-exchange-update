import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DELIVERIES = [
  {
    id: 1,
    headline: 'Shipping Containers For Sale',
    containerType: '40ft High Cube',
    city: 'Los Angeles, CA',
    date: 'March 18, 2026',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
  },
  {
    id: 2,
    headline: 'Shipping Containers For Sale',
    containerType: '20ft Standard',
    city: 'Oakland, CA',
    date: 'March 17, 2026',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80',
  },
  {
    id: 3,
    headline: 'Shipping Containers For Sale',
    containerType: '40ft Standard',
    city: 'Portland, OR',
    date: 'March 16, 2026',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
  },
  {
    id: 4,
    headline: 'Shipping Containers For Sale',
    containerType: '20ft High Cube',
    city: 'Houston, TX',
    date: 'March 15, 2026',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80',
  },
];

export default function RecentlyDelivered() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  const total = DELIVERIES.length;

  const next = () => setCurrent(c => (c + 1) % total);
  const prev = () => setCurrent(c => (c - 1 + total) % total);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(next, 3500);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused, current]);

  // Visible cards: show 3 cards (current, current+1, current+2)
  const getVisibleIndices = () => [
    current % total,
    (current + 1) % total,
    (current + 2) % total,
  ];

  return (
    <section
      className="py-20 bg-primary relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* BG texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block text-xs font-mono text-white/50 tracking-widest bg-white/10 px-3 py-1 rounded-full mb-3">UPDATED DAILY</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Recently Delivered Containers
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cards — desktop: 3 visible, mobile: 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 overflow-hidden">
          {getVisibleIndices().map((idx, position) => {
            const item = DELIVERIES[idx];
            return (
              <motion.div
                key={`${item.id}-${current}-${position}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: position * 0.05 }}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-xl ${position > 0 ? 'hidden sm:block' : ''}`}
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src={item.image}
                  alt={item.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-bold tracking-widest bg-primary text-white px-2.5 py-1 rounded-full">
                    {item.containerType}
                  </span>
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm leading-tight mb-2">{item.headline}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-white/70 text-xs">
                      <MapPin className="w-3 h-3 text-white/80 flex-shrink-0" />
                      <span>{item.city}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/50 text-xs">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {DELIVERIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Mobile arrows */}
        <div className="flex items-center justify-center gap-3 mt-4 sm:hidden">
          <button onClick={prev} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}