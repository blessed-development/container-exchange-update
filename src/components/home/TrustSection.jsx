import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '20+', label: 'Years Experience' },
  { value: '60+', label: 'Depot Locations' },
  { value: '10K+', label: 'Containers Sold' },
  { value: '4.9', label: 'Customer Rating' },
];

export default function TrustSection() {
  return (
    <section className="py-28 bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">WHY CONTAINERS EXCHANGE</span>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight mb-6">
              Industry Expertise.{' '}
              <span className="text-primary">Nationwide Reach.</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
              <p>
                With over two decades of experience in container logistics, Containers Exchange connects buyers with quality shipping containers from our nationwide network of 60+ depot locations.
              </p>
              <p>
                Whether you need secure, weather-resistant storage for a construction site, farm, retail location, or residential property, we provide both new (one-trip) and used containers that protect your equipment, inventory, and materials.
              </p>
              <p>
                Our expert team guides you through every step — from choosing the right size and grade to arranging fast, dependable delivery. Buy with confidence knowing the process is simple, secure, and backed by our satisfaction guarantee.
              </p>
            </div>
          </motion.div>

          {/* Image + Bento Stats */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden mb-6 shadow-2xl">
              <img
                src="https://media.base44.com/images/public/69dd889386a20317a3b688c3/3ef30518d_generated_9c5f1d0a.png"
                alt="Container terminal aerial view"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/70 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="text-center p-5 border border-border rounded-2xl bg-card hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <p className="text-3xl font-black text-primary font-mono">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}