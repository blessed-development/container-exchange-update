import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';

const RELATED = [
  {
    id: 'used-20ft-asis',
    title: 'Used 20ft Container',
    label: 'AS IS',
    price: '$1,250',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80',
  },
  {
    id: 'used-20ft-iicl',
    title: 'Used 20ft IICL',
    label: 'IICL Certified',
    price: '$1,750',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80',
  },
  {
    id: 'used-20ft-cw',
    title: 'Used 20ft CW',
    label: 'Cargo Worthy',
    price: '$1,550',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80',
  },
  {
    id: 'new-40ft-hc',
    title: "New 40ft High Cube",
    label: 'IICL One-Trip',
    price: '$3,350',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
  },
];

export default function RelatedProducts() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-2xl font-black text-foreground mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {RELATED.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 transition-shadow duration-300 flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex flex-col flex-1 gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">{product.label}</span>
              <h3 className="font-bold text-foreground text-sm leading-snug">{product.title}</h3>
              <p className="text-xl font-black text-primary font-mono mt-auto">{product.price}</p>
              <div className="flex gap-2 mt-1">
                <Link to={`/product/${product.id}`} className="flex-1">
                  <button className="w-full h-9 rounded-xl border-2 border-border text-foreground text-xs font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1.5">
                    View <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
                <a href="tel:+18889779085" className="flex-1">
                  <button className="w-full h-9 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5">
                    <Phone className="w-3 h-3" /> Call
                  </button>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}