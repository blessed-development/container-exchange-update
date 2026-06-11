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
      'Delivery is arranged based on ZIP code, container size, and site accessibility. Placement is usually completed using tilt-bed delivery.',
  },

  {
    question: 'Can I choose the exact container?',
    answer:
      'Availability depends on inventory. Exact selection may be available in some locations before dispatch.',
  },
];

export default function ProductFAQ() {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <section
      className="mt-10 rounded-[28px] border border-border/40 bg-card/35 backdrop-blur-xl overflow-hidden"
      onMouseLeave={() => setHoverIndex(null)}
    >
      <div className="px-5 pt-5 pb-2">
        <p className="text-xs font-mono tracking-[0.18em] text-primary uppercase">
          FAQ Preview
        </p>
      </div>

      <div>
        {FAQS.map((item, index) => {
          const isOpen = hoverIndex === index;

          return (
            <div
              key={item.question}
              onMouseEnter={() => setHoverIndex(index)}
              className={`border-t border-border/30 transition-all duration-500 ease-out ${
                isOpen
                  ? 'bg-white/[0.03]'
                  : ''
              }`}
            >
              <div className="px-5 py-4 cursor-default">

                <div className="flex items-center justify-between">

                  <span className="text-[15px] font-medium text-foreground">
                    {item.question}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-all duration-500 ${
                      isOpen
                        ? 'rotate-180'
                        : ''
                    }`}
                  />

                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    isOpen
                      ? 'max-h-[220px] opacity-100 mt-3'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-[14px] leading-6 text-muted-foreground">
                    {item.answer}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-4 border-t border-border/30">

        <Link
          to="/faq"
          className="inline-flex items-center text-sm font-semibold text-primary hover:opacity-80 transition"
        >
          Read more →
        </Link>

      </div>
    </section>
  );
}
