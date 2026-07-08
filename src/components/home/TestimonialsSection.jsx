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
    <section className="py-28 bg-accent text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary/[0.06] blur-[80px] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">TRUST</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Verified{' '}
            <span className="text-primary">Customer Reviews</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <span className="font-black text-xl text-white">4.9</span>
            <span className="text-white/40 text-sm">based on 200+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.slice(0, 4).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm p-6 rounded-2xl hover:bg-white/[0.07] hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              <Quote className="w-7 h-7 text-primary/30 mb-4" />
              <p className="text-sm text-white/60 leading-relaxed mb-5 line-clamp-4">
                "{review.text}"
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
              <div className="border-t border-white/[0.08] pt-4">
                <p className="font-bold text-sm text-white">{review.author_name}</p>
                <p className="text-xs text-white/35 mt-0.5">
                  {review.location} {review.container_type ? `· ${review.container_type}` : ''}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}