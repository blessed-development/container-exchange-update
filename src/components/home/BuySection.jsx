import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BuySection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary tracking-widest">THE MARKETPLACE</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mt-3">
            PREMIUM CONTAINERS,{' '}
            <span className="text-primary">DELIVERED</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-lg">
            Purchase with confidence. Every container is inspected, graded, and backed by our satisfaction guarantee.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-card border border-border p-8 rounded-sm hover:border-primary/30 transition-all duration-300">
            <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-sm bg-muted">
              <img
                src="https://media.base44.com/images/public/69dd889386a20317a3b688c3/2350032b9_generated_79e70e6c.png"
                alt="Buy shipping containers"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Buy Shipping Containers</h3>
            <ul className="space-y-3 mb-6">
              {[
                'Money Back Guarantee',
                'Wide New & Used Selection',
                'Depot Locations Near You',
                'Transparent Pricing',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/inventory">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wider h-12">
                BROWSE INVENTORY <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}