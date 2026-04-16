import React from 'react';
import { BadgeDollarSign, Truck, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const REASONS = [
  {
    icon: BadgeDollarSign,
    title: 'Best Price Guarantee',
    desc: 'We match or beat any competitor quote on the same container grade and location.',
  },
  {
    icon: Truck,
    title: 'Free Delivery Accessories',
    desc: 'Every purchase includes free accessories to help you get started on day one.',
  },
  {
    icon: Clock,
    title: '3–7 Day Delivery',
    desc: 'Fast, reliable delivery direct to your site from our nearest depot location.',
  },
  {
    icon: MapPin,
    title: '60+ Depot Locations',
    desc: 'Nationwide coverage across the USA means a depot is always close to you.',
  },
];

export default function WhyBuyFromUs() {
  return (
    <section className="py-16 bg-accent text-white border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.07] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <r.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-sm text-white">{r.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}