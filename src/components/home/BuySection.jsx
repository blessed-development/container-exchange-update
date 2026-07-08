import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BuySection() {
  return (
    <section className="py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">THE MARKETPLACE</span>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight mb-5">
              Premium Containers,{' '}
              <span className="text-primary">Delivered</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Purchase with confidence. Every container is inspected, graded, and backed by our satisfaction guarantee.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'Money Back Guarantee',
                'Wide New & Used Selection',
                'Depot Locations Near You',
                'Transparent Pricing',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/inventory">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-13 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                Browse Inventory <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Right image card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://media.base44.com/images/public/69dd889386a20317a3b688c3/2350032b9_generated_79e70e6c.png"
                alt="Buy shipping containers"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/50 to-transparent" />
              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3">
                <p className="text-white text-xs font-mono opacity-70">NEXT AVAILABLE DELIVERY</p>
                <p className="text-white font-bold text-sm">3–7 Business Days</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}