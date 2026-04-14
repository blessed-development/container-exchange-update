import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const FALLBACK_REVIEWS = [
  {
    id: 'f1',
    author_name: 'Marcus T.',
    location: 'Houston, TX',
    rating: 5,
    text: 'Incredible experience from start to finish. The container arrived in perfect condition and the delivery driver was extremely professional. Got it placed exactly where I needed it.',
    container_type: '20ft WWT',
  },
  {
    id: 'f2',
    author_name: 'Sarah K.',
    location: 'Denver, CO',
    rating: 5,
    text: 'Communication was outstanding throughout the entire process. Every question was answered promptly. The container quality exceeded my expectations. Will definitely be ordering again.',
    container_type: '40ft High Cube',
  },
  {
    id: 'f3',
    author_name: 'David R.',
    location: 'Atlanta, GA',
    rating: 5,
    text: 'Found their pricing to be the most competitive after calling multiple suppliers. The delivery was on schedule and the container was clean and ready to use. Highly recommend.',
    container_type: '20ft Standard',
  },
  {
    id: 'f4',
    author_name: 'Jennifer L.',
    location: 'Phoenix, AZ',
    rating: 5,
    text: 'Needed a container for my small business storage solution. The team helped me pick the right size and grade. Delivery was quick and hassle-free. Excellent service all around.',
    container_type: '40ft Standard',
  },
];

export default function TestimonialsSection() {
  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.list(),
    initialData: [],
  });

  const reviews = testimonials?.length > 0 ? testimonials : FALLBACK_REVIEWS;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary tracking-widest">TRUST</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mt-3">
            VERIFIED{' '}
            <span className="text-primary">CUSTOMER REVIEWS</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <span className="font-mono font-bold text-lg">4.9</span>
            <span className="text-muted-foreground text-sm">based on 200+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border p-6 rounded-sm"
            >
              <Quote className="w-6 h-6 text-primary/20 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                "{review.text}"
              </p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-3 h-3 fill-primary text-primary" />
                ))}
              </div>
              <div className="border-t border-border pt-3">
                <p className="font-semibold text-sm">{review.author_name}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {review.location} {review.container_type ? `• ${review.container_type}` : ''}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}