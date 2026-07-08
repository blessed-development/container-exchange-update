import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const OPTIONS = [
  {
    tag: 'RENT',
    title: 'Shipping Containers for Rent',
    desc: 'Flexible monthly rentals with same-week delivery. Perfect for temporary storage, job sites, or seasonal needs.',
    bullets: ['1 Month Free Rent', 'Flexible Rental Terms', 'Same Week Delivery', 'Easy Pickup When Done'],
    cta: 'Claim Your Free Month',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    highlight: false,
  },
  {
    tag: 'BUY',
    title: 'Buy Shipping Containers',
    desc: 'Own it outright. Huge selection of new and used containers. Best prices guaranteed with our price-match promise.',
    bullets: ['Money Back Guaranteed', 'Huge New & Used Selection', 'Depot Location Near You', 'Exclusive Phone Specials'],
    cta: 'Browse & Buy Now',
    image: 'https://media.base44.com/images/public/69dd889386a20317a3b688c3/2350032b9_generated_79e70e6c.png',
    highlight: true,
  },
  {
    tag: 'RENT-TO-OWN',
    title: 'Rent-to-Own Containers',
    desc: 'Start with just $1 your first month. No credit check required — everyone qualifies. Own it with early payoff discounts.',
    bullets: ['Everyone Qualifies', 'No Credit Check Required', 'Early Payoff Discounts', '$1 First Month Special'],
    cta: 'Start for $1',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80',
    highlight: false,
  },
];

export default function RentRTOSection() {
  return (
    <section className="py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">AFFORDABLE CONTAINERS</span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            Three Ways to <span className="text-primary">Get Your Container</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-xl mx-auto">
            Whether you need to buy, rent, or rent-to-own — we have flexible options to fit your budget and timeline.
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
                <img src={opt.image} alt={opt.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-mono font-bold tracking-widest px-3 py-1.5 rounded-full ${
                    opt.highlight ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white backdrop-blur-sm border border-white/20'
                  }`}>
                    {opt.tag}
                  </span>
                </div>
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
                <Link to={opt.tag === 'BUY' ? '/inventory' : '/contact'}>
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