import React from 'react';
import ZipCodeSearch from '@/components/shared/ZipCodeSearch';
import { Shield, Truck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center bg-accent overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/69dd889386a20317a3b688c3/599ab2c88_generated_4431dbea.png"
          alt="Industrial shipping container close-up"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent/90 to-accent/95" />
        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 bg-white/[0.06] border border-white/[0.1] backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-white/60 tracking-widest">
                60+ DEPOT LOCATIONS NATIONWIDE
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[0.92] mb-6">
              SHIPPING{' '}
              <span className="text-primary">CONTAINERS</span>
              {' '}FOR SALE
            </h1>

            <p className="text-lg text-white/50 max-w-lg mb-10 leading-relaxed">
              Locate available inventory near you. New and used containers delivered directly to your site in 3–7 business days.
            </p>

            {/* ZIP Search */}
            <ZipCodeSearch variant="hero" className="w-full" />

            {/* Value Props */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              {[
                { icon: Shield, label: 'Lowest Price Guarantee' },
                { icon: Truck, label: 'Free Delivery Accessories' },
                { icon: Clock, label: '3–7 Day Delivery' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-white/40">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Bento stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-3"
          >
            {[
              { value: '20+', label: 'Years in Business', sub: 'Trusted nationwide' },
              { value: '60+', label: 'Depot Locations', sub: 'Coast to coast' },
              { value: '10K+', label: 'Containers Sold', sub: 'Happy customers' },
              { value: '4.9★', label: 'Customer Rating', sub: 'Based on 200+ reviews' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20"
              >
                <p className="text-3xl font-black text-primary font-mono mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-white/80">{stat.label}</p>
                <p className="text-xs text-white/35 mt-1">{stat.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}