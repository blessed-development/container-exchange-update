import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const REVIEWS = [
  {
    id: 1,
    name: 'Mark Cobb',
    initials: 'MC',
    avatar: 'https://i.pravatar.cc/48?img=11',
    time: '12 months ago',
    rating: 5,
    text: 'The whole On-Site Storage Solutions staff were great to work with, from my first phone call to the day of delivery. They were professional, responsive, and made the whole process seamless.',
  },
  {
    id: 2,
    name: 'Nikunj Patel',
    initials: 'NP',
    avatar: null,
    time: '12 months ago',
    rating: 5,
    text: 'Their service was good as they said.',
  },
  {
    id: 3,
    name: 'Andres Pena',
    initials: 'AP',
    avatar: null,
    time: '6 months ago',
    rating: 5,
    text: '20ft Conex box. Came across the ad on Facebook marketplace, Rene was very responsive and helpful throughout the entire process. Great experience overall.',
  },
  {
    id: 4,
    name: 'Raven Ramos',
    initials: 'RR',
    avatar: null,
    time: '4 months ago',
    rating: 5,
    text: 'Very clean storages, friendly service and the manager Sal was very knowledgeable on everything and was able to help me find exactly what I needed at a great price.',
  },
  {
    id: 5,
    name: 'James Thornton',
    initials: 'JT',
    avatar: null,
    time: '3 weeks ago',
    rating: 5,
    text: 'Ordered a 40ft high cube for my property. Delivery was on time, driver was very careful placing it. Excellent communication from start to finish.',
  },
  {
    id: 6,
    name: 'Lisa Nguyen',
    initials: 'LN',
    avatar: null,
    time: '8 months ago',
    rating: 5,
    text: 'Best price I found after calling around. Container arrived in great shape and the team was super easy to work with. Would definitely order again.',
  },
];

const CARDS_VISIBLE = 3;

export default function ReviewsSlider() {
  const [index, setIndex] = useState(0);

  const maxIndex = REVIEWS.length - CARDS_VISIBLE;

  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));

  const visible = REVIEWS.slice(index, index + CARDS_VISIBLE);

  return (
    <section className="py-24 bg-accent text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/[0.05] blur-[80px] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            We've Got a Lot of{' '}
            <span className="text-primary">Happy Customers</span>
          </h2>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Prev button */}
          <button
            onClick={prev}
            disabled={index === 0}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-hidden">
            <AnimatePresence mode="popLayout">
              {visible.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </AnimatePresence>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            disabled={index >= maxIndex}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-primary w-6' : 'bg-white/25'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const MAX_LEN = 120;
  const isLong = review.text.length > MAX_LEN;
  const displayText = !expanded && isLong ? review.text.slice(0, MAX_LEN) + '…' : review.text;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="bg-white/[0.06] border border-white/[0.1] rounded-2xl p-5 flex flex-col gap-3"
    >
      {/* Top row: avatar + name + google badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {review.avatar ? (
            <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">{review.initials}</span>
            </div>
          )}
          <div>
            <p className="font-bold text-white text-sm leading-tight">{review.name}</p>
            <p className="text-white/40 text-xs">{review.time}</p>
          </div>
        </div>
        {/* Google G badge */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
          <span className="font-black text-sm" style={{ color: '#4285F4' }}>G</span>
        </div>
      </div>

      {/* Stars + verified */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#1DA1F2" />
          <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Review text */}
      <p className="text-white/65 text-sm leading-relaxed flex-1">
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-primary hover:underline ml-1 text-xs font-semibold"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>
    </motion.div>
  );
}