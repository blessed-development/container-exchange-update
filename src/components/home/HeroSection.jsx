import React from 'react';
import ZipCodeSearch from '@/components/shared/ZipCodeSearch';
import { Shield, Truck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-accent overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/__generating__/img_669c970b25cb.png"
          alt="Industrial shipping container close-up"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/40 via-accent/70 to-accent" />
      </div>

      {/* Structural Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-white/[0.03]"
            style={{ left: `${(i + 1) * (100 / 13)}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-white/60 tracking-widest">
              60+ DEPOT LOCATIONS NATIONWIDE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95] mb-6">
            SHIPPING{' '}
            <span className="text-primary">CONTAINERS</span>
            <br />
            FOR SALE
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Locate available inventory near you. New and used containers delivered directly to your site in 3–7 business days.
          </p>

          {/* ZIP Search */}
          <ZipCodeSearch variant="hero" className="max-w-xl mx-auto" />

          {/* Value Props */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-12"
          >
            {[
              { icon: Shield, label: 'Lowest Price Guarantee' },
              { icon: Truck, label: 'Free Delivery Accessories' },
              { icon: Clock, label: '3–7 Day Delivery' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-white/40">
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
}