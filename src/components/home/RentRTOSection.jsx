import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const OPTIONS = [
  {
    title: 'Find Containers Near You',
    desc: 'Enter your city or ZIP code to discover nearby container availability and local pricing.',
    bullets: ['Search by City or ZIP Code', 'Nearby Container Availability', 'Local Pricing', 'Fast Search Results'],
    cta: 'Search Locations',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Customer searching for nearby container availability on a laptop',
    to: '/inventory',
    highlight: false,
  },
  {
    title: 'Choose the Right Container',
    desc: 'Compare available sizes and conditions to find the container that fits your project and budget.',
    bullets: ['New & Used Selection', 'Multiple Sizes Available', 'Money-Back Guarantee', 'Depot Locations Near You'],
    cta: 'Browse Containers',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Shipping containers available for selection at a container depot',
    to: '/inventory',
    highlight: true,
  },
  {
    title: 'Schedule Your Delivery',
    desc: "After you've chosen your container, our team will help coordinate delivery to your location.",
    bullets: ['Delivery Scheduling', 'Dedicated Customer Support', 'Simple Purchase Process', 'Flexible Delivery Options'],
    cta: 'Request a Quote',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Shipping container delivery truck at a customer location',
    to: '/contact',
    highlight: false,
  },
];

export default function RentRTOSection() {
  return (
    <section className="py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">BUYING MADE SIMPLE</span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            The Easiest Way to <span className="text-primary">Find Your Shipping Container</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-xl mx-auto">
            Finding the right shipping container shouldn't be complicated. Search nearby inventory, compare available options, and let our team help arrange delivery—all from one trusted marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OPTIONS.map((opt, i) => (
            <motion.div
              key={opt.tag}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`rounded-2xl overflow-hidden border transition-all duration-300 shadow-lg hover:shadow-2xl ${
                opt.highlight
                  ? 'border-primary/40 shadow-primary/10'
                  : 'border-border'
              } bg-card`}
            >
              {/* Rectangular image */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img src={opt.image} alt={opt.imageAlt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-white font-black text-lg leading-tight">{opt.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{opt.desc}</p>
                <ul className="space-y-2.5 mb-6">
                  {opt.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
                <Link to={opt.to}>
                  <Button className={`w-full font-semibold rounded-xl h-11 ${
                    opt.highlight
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25'
                      : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                  }`}>
                    {opt.cta} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
