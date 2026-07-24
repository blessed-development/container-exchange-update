import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const LOGOS = [
  { name: 'Maersk', slug: 'maersk' },
  { name: 'DHL', slug: 'dhl' },
  { name: 'FedEx', slug: 'fedex' },
  { name: 'UPS', slug: 'ups' },
  { name: 'Amazon', slug: 'amazon' },
  { name: 'Walmart', slug: 'walmart' },
  { name: 'Target', slug: 'target' },
  { name: 'Costco', slug: 'costco' },
  { name: 'The Home Depot', slug: 'thehomedepot' },
  { name: "Lowe's", slug: 'lowes' },
  { name: 'IKEA', slug: 'ikea' },
  { name: 'Caterpillar', slug: 'caterpillar' },
  { name: 'John Deere', slug: 'johndeere' },
  { name: 'Toyota', slug: 'toyota' },
  { name: 'Ford', slug: 'ford' },
  { name: 'Volvo', slug: 'volvo' },
  { name: 'Tesla', slug: 'tesla' },
  { name: 'Shell', slug: 'shell' },
  { name: 'BP', slug: 'bp' },
  { name: 'Chevron', slug: 'chevron' },
  { name: 'ExxonMobil', slug: 'exxonmobil' },
  { name: 'Siemens', slug: 'siemens' },
  { name: 'Bosch', slug: 'bosch' },
  { name: 'Honeywell', slug: 'honeywell' },
  { name: 'Hitachi', slug: 'hitachi' },
  { name: 'Panasonic', slug: 'panasonic' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Dell', slug: 'dell' },
  { name: 'Lenovo', slug: 'lenovo' },
  { name: 'Cisco', slug: 'cisco' },
  { name: 'Stripe', slug: 'stripe' },
  { name: 'PayPal', slug: 'paypal' },
];

const VISIBLE_COUNT = 8;
const FLIP_INTERVAL = 1600;

const logoUrl = (slug) =>
  `https://cdn.simpleicons.org/${slug}/FFFFFF`;

export default function FlippingLogoWall() {
  const prefersReducedMotion = useReducedMotion();
  const initialIndexes = useMemo(
    () => Array.from({ length: VISIBLE_COUNT }, (_, index) => index),
    []
  );
  const [visibleIndexes, setVisibleIndexes] = useState(initialIndexes);
  const [activeSlot, setActiveSlot] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlot((currentSlot) => {
        const nextSlot = (currentSlot + 1) % VISIBLE_COUNT;

        setVisibleIndexes((current) => {
          const updated = [...current];
          const currentLogoIndex = current[currentSlot];
          let candidate = (currentLogoIndex + VISIBLE_COUNT) % LOGOS.length;
          const occupied = new Set(current.filter((_, slot) => slot !== currentSlot));

          while (occupied.has(candidate)) {
            candidate = (candidate + 1) % LOGOS.length;
          }

          updated[currentSlot] = candidate;
          return updated;
        });

        return nextSlot;
      });
    }, FLIP_INTERVAL);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <section
      aria-label="Featured company logos"
      className="relative overflow-hidden border-y border-white/10 bg-[#07111f] py-10 sm:py-12 lg:py-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-30%,rgba(249,115,22,0.18),transparent_48%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:gap-x-12 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-16 lg:gap-y-12">
          {visibleIndexes.map((logoIndex, slotIndex) => {
            const logo = LOGOS[logoIndex];

            return (
              <div
                key={`logo-slot-${slotIndex}`}
                className="flex min-h-[64px] items-center justify-center [perspective:900px] sm:min-h-[74px] lg:min-h-[82px]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={`${slotIndex}-${logo.slug}`}
                    src={logoUrl(logo.slug)}
                    alt={`${logo.name} logo`}
                    loading="lazy"
                    draggable="false"
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, rotateX: -88, scale: 0.92 }
                    }
                    animate={{ opacity: 0.72, rotateX: 0, scale: 1 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, rotateX: 88, scale: 0.92 }
                    }
                    transition={{
                      duration: prefersReducedMotion ? 0.15 : 0.52,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="max-h-8 w-auto max-w-[125px] object-contain transition-[opacity,transform] duration-300 hover:scale-105 hover:opacity-100 sm:max-h-9 sm:max-w-[150px] lg:max-h-10 lg:max-w-[175px]"
                    onError={(event) => {
                      event.currentTarget.style.visibility = 'hidden';
                    }}
                  />
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
