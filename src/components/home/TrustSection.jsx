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
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-mono text-primary tracking-widest">WHY CONTAINERS EXCHANGE</span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mt-3 mb-6">
              INDUSTRY EXPERTISE.{' '}
              <span className="text-primary">NATIONWIDE REACH.</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
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

          {/* Image + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-sm overflow-hidden mb-8">
              <img
                src="https://media.base44.com/images/public/69dd889386a20317a3b688c3/3ef30518d_generated_9c5f1d0a.png"
                alt="Container terminal aerial view"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center p-4 border border-border rounded-sm bg-card">
                  <p className="text-2xl font-black text-primary font-mono">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-mono tracking-wider mt-1">{stat.label.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}