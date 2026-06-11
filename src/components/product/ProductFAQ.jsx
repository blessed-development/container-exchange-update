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
  const [hoverIndex, setHoverIndex] = useState(null);
  const [lockedIndex, setLockedIndex] = useState(null);

  const activeIndex = lockedIndex ?? hoverIndex;

  return (
    <section
      className="mt-10 rounded-[28px] border border-border/50 bg-card/35 backdrop-blur-xl overflow-hidden"
      onMouseLeave={() => setHoverIndex(null)}
    >
      <div className="px-5 pt-5 pb-3">
        <p className="text-xs font-mono tracking-[0.2em] text-primary uppercase">
          FAQ Preview
        </p>
      </div>

      <div>
        {FAQS.map((item, index) => {
          const isOpen = activeIndex === index;
          const isLocked = lockedIndex === index;

          return (
            <button
              key={item.question}
              type="button"
              onMouseEnter={() => setHoverIndex(index)}
              onClick={() =>
                setLockedIndex(isLocked ? null : index)
              }
              className={`w-full text-left px-5 py-4 border-t border-border/35 transition-all duration-300 ${
                isOpen
                  ? 'bg-white/[0.035]'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                  {item.question}
                </span>

                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-500 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              <div
                className={`grid transition-all duration-500 ease-out ${
                  isOpen
                    ? 'grid-rows-[1fr] opacity-100 mt-3'
                    : 'grid-rows-[0fr] opacity-0 mt-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-[14px] leading-6 text-muted-foreground max-w-3xl">
                    {item.answer}
                  </p>

                  {isLocked && (
                    <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.16em] text-primary/80">
                      Pinned open
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-5 py-4 border-t border-border/35">
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
