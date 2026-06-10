import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    question: 'What condition will my container be in?',
    answer:
      'Each container is inspected based on its listed grade. New one-trip units are typically in A Grade condition, while used containers may show cosmetic wear but remain suitable for storage depending on the grade selected.',
  },
  {
    question: 'How does delivery work?',
    answer:
      'After checkout or quote request, delivery is arranged based on your ZIP code, container size, and site access. A tilt-bed or roll-off style truck is commonly used for placement.',
  },
  {
    question: 'Can I choose the exact container?',
    answer:
      'Most orders are fulfilled first-off-the-stack unless exact selection is available in your area. Photos and condition details can be confirmed before delivery when available.',
  },
];

export default function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mt-10 rounded-[28px] border border-border/70 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-5 py-5 border-b border-border/60">
        <p className="text-xs font-mono tracking-[0.18em] text-primary uppercase mb-1">
          FAQ Preview
        </p>

        <h2 className="text-xl font-black tracking-[-0.03em]">
          Common questions
        </h2>
      </div>

      <div>
        {FAQS.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <button
              key={item.question}
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full text-left px-5 py-4 border-b border-border/50 last:border-b-0 group"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] font-bold tracking-[-0.01em] text-foreground">
                  {item.question}
                </span>

                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {isOpen && (
                <p className="mt-3 text-[14px] leading-6 text-muted-foreground max-w-3xl">
                  {item.answer}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <div className="px-5 py-4">
        <Link
          to="/faq"
          className="inline-flex text-sm font-bold text-primary hover:opacity-80 transition-opacity"
        >
          Read more →
        </Link>
      </div>
    </section>
  );
}
