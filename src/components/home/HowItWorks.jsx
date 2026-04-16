import React from 'react';
import { MapPin, MousePointer, Truck } from 'lucide-react';
import ZipCodeSearch from '@/components/shared/ZipCodeSearch';
import { motion } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    icon: MapPin,
    title: 'Enter Your ZIP Code',
    desc: 'Enter your zip or postal code to find container pricing and availability at depots near your location.',
  },
  {
    num: '02',
    icon: MousePointer,
    title: 'Select Your Container',
    desc: 'Browse affordable options based on your preferred type, size, condition, and grade. Transparent pricing, no hidden fees.',
  },
  {
    num: '03',
    icon: Truck,
    title: 'Schedule Delivery',
    desc: 'Sit back and wait for your container. Delivery takes 3–7 business days after checkout, directly to your site.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-accent text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">THE PROCESS</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Three Steps to{' '}
            <span className="text-primary">Buy Your Container</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {STEPS.map((step, i) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative p-8 border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm rounded-2xl group hover:border-primary/30 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 border border-primary/30 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/15 transition-colors">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-5xl font-black text-white/[0.06] font-mono group-hover:text-primary/10 transition-colors">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="max-w-xl mx-auto">
          <ZipCodeSearch variant="hero" />
        </div>
      </div>
    </section>
  );
}