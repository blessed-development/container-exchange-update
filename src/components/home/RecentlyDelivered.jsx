import React from 'react';
import { MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DELIVERIES = [
  {
    id: 1,
    headline: 'Shipping Containers For Sale Los Angeles CA',
    date: 'March 18, 2026',
    city: 'Los Angeles',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
  },
  {
    id: 2,
    headline: 'Shipping Containers For Sale Oakland Ca',
    date: 'March 17, 2026',
    city: 'Oakland',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80',
  },
  {
    id: 3,
    headline: 'Shipping Containers For Sale Portland',
    date: 'March 16, 2026',
    city: 'Portland',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
  },
];

export default function RecentlyDelivered() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Recently Delivered Containers
          </h2>
          <p className="text-white/70 mt-2 font-semibold tracking-widest text-sm font-mono">
            Updated Daily
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {DELIVERIES.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
              style={{ aspectRatio: '4/3' }}
            >
              <img
                src={item.image}
                alt={item.headline}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-start gap-2 mb-1.5">
                  <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-primary w-4 h-4">
                      <rect width="24" height="24" rx="2" fill="#cc2200"/>
                      <path d="M4 5h16v2H4zm0 4h16v2H4zm0 4h10v2H4z" fill="white"/>
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-sm leading-tight">{item.headline}</p>
                </div>
                <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <MapPin className="w-3 h-3 flex-shrink-0 text-primary" />
                  <span>{item.city}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}