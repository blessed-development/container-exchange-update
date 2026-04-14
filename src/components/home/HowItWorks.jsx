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
    <section id="how-it-works" className="py-24 bg-accent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary tracking-widest">THE PROCESS</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-3">
            THREE STEPS TO{' '}
            <span className="text-primary">DEPLOYMENT</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {STEPS.map((step, i) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative p-8 border border-white/5 bg-white/[0.02] rounded-sm group hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-black text-white/5 font-mono group-hover:text-primary/10 transition-colors">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 border border-primary/20 rounded-sm flex items-center justify-center bg-primary/5">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
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