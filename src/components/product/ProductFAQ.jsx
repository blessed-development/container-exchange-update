import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'How much does a 20 foot shipping container weigh?',
    a: 'A standard 20ft empty shipping container weighs approximately 4,850 lbs (2,200 kg). High cube versions weigh slightly more.',
  },
  {
    q: 'How much does a 20 foot shipping container cost?',
    a: 'Prices vary based on condition and location. Used 20ft containers typically range from $1,500–$3,000, while new (one-trip) containers range from $3,000–$5,000. Contact us for current pricing in your area.',
  },
  {
    q: 'How much capacity is in a 20 ft container?',
    a: 'A standard 20ft container has an internal volume of approximately 1,172 cubic feet (33.2 cubic meters). It can hold about 10-11 standard pallets.',
  },
  {
    q: 'How large is a 20-foot shipping container?',
    a: "External dimensions: 20ft long x 8ft wide x 8.5ft high (standard) or 9.5ft high (high cube). Internal dimensions are slightly smaller.",
  },
  {
    q: 'How many pallets are in a 20ft container?',
    a: 'A standard 20ft container can hold 10 standard American pallets (48"x40") or 11 European pallets (47"x31") when properly stacked.',
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left hover:text-primary transition-colors"
      >
        <span className="font-semibold text-foreground text-base">{faq.q}</span>
        <span className="flex-shrink-0 w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:border-primary transition-colors">
          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-muted-foreground text-sm leading-relaxed pb-5">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-black text-foreground mb-6">FAQ's</h2>
      <div className="border border-border rounded-2xl px-6 divide-y divide-border">
        {FAQS.map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
}