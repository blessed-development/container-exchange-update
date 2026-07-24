import React, { memo, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import '@/styles/logo-wall.css';

const LOGOS = [
  ['ABC', '01-abc-6639cafe7f7e2.webp'],
  ['Advance Auto Parts', '02-advanced-auto-parts-6639cafecb0fc.webp'],
  ['Air Liquide', '03-air-liquide-6639cb196b89d.webp'],
  ['Alcoa', '04-alcoa-6639cb009bee9.webp'],
  ['BNSF Railway', '05-bnsf-railway-6639cb00a6d28.webp'],
  ['Boeing', '06-boeing-6639cb0181cfa.webp'],
  ['Crown Lift', '07-crown-lift.webp'],
  ['Dow Chemical', '08-dow-chemical-6639cb018692d.webp'],
  ['Federal Express', '09-federal-express-6639cb037d352.webp'],
  ['Ford Motor Company', '10-ford-motor-company-2.webp'],
  ['General Electric', '11-general-electric.webp'],
  ['Girl Scouts', '12-girl-scouts-6639cb03464d7.webp'],
  ['Los Angeles Department of Water and Power', '13-la-dwp-6639caf98bd28.webp'],
  ['La Quinta', '14-la-quinta.webp'],
  ['Lockheed Martin', '15-lockheed-martin-6639caf951aea.webp'],
  ['Mitsubishi', '16-mitsubishi-6639cafa467be.webp'],
  ['NBC', '17-nbc-6639cb10b82d4.webp'],
  ['Nissan', '18-nissan-2.webp'],
  ['Sony Studios', '19-sony-studios-6639cafbbf040.webp'],
  ['SpaceX', '20-spacex-6639cafbbefcf.webp'],
  ['Toll Brothers', '21-toll-brothers.webp'],
  ['Toyota', '22-toyota-2.webp'],
  ['TruGreen', '23-trugreen.webp'],
  ['United States Air Force', '24-u-s-air-force-2.webp'],
  ['United States Army', '25-u-s-army-2.webp'],
  ['United States Coast Guard', '26-u-s-coast-guard-2.webp'],
  ['United States Forest Service', '27-u-s-forest-service-2.webp'],
  ['United States Marine Corps', '28-u-s-marine-corp-2.webp'],
  ['Walmart', '29-walmart-6639cafcac2af.webp'],
  ['Walt Disney', '30-walt-disney-6639cafd04427.webp'],
  ['Young Brothers', '31-young-bros.webp'],
].map(([name, file]) => ({ name, src: `/logos/${file}` }));

function getSlotCount() {
  if (typeof window === 'undefined') return 10;
  if (window.matchMedia('(min-width: 1024px)').matches) return 10;
  if (window.matchMedia('(min-width: 640px)').matches) return 8;
  return 10;
}

function useSlotCount() {
  const [slotCount, setSlotCount] = useState(getSlotCount);

  useEffect(() => {
    const update = () => setSlotCount(getSlotCount());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return slotCount;
}

const LogoSlot = memo(function LogoSlot({ slot, reducedMotion }) {
  const [logoIndex, setLogoIndex] = useState(slot % LOGOS.length);

  useEffect(() => {
    setLogoIndex(slot % LOGOS.length);
  }, [slot]);

  useEffect(() => {
    if (reducedMotion) return undefined;

    let timeoutId;
    const scheduleNext = () => {
      const delay = 1800 + Math.round(Math.random() * 1400);
      timeoutId = window.setTimeout(() => {
        setLogoIndex((current) => (current + 1 + Math.floor(Math.random() * 5)) % LOGOS.length);
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => window.clearTimeout(timeoutId);
  }, [reducedMotion]);

  const logo = LOGOS[logoIndex];

  return (
    <div className="logo-wall__slot" aria-live="off">
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={logo.src}
          className="logo-wall__image"
          src={logo.src}
          alt={`${logo.name} logo`}
          width="220"
          height="90"
          loading="lazy"
          decoding="async"
          draggable="false"
          initial={reducedMotion ? false : { opacity: 0, rotateX: -78, scale: 0.96 }}
          animate={{ opacity: 1, rotateX: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, rotateX: 78, scale: 0.96 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.46, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
    </div>
  );
});

export default function LogoWall() {
  const reducedMotion = useReducedMotion();
  const slotCount = useSlotCount();
  const slots = useMemo(() => Array.from({ length: slotCount }, (_, index) => index), [slotCount]);

  return (
    <section className="logo-wall" aria-label="Serving businesses nationwide">
      <div className="logo-wall__glow logo-wall__glow--blue" aria-hidden="true" />
      <div className="logo-wall__glow logo-wall__glow--orange" aria-hidden="true" />

      <div className="logo-wall__content">
        <header className="logo-wall__header">
          <p className="logo-wall__eyebrow">Trusted nationwide</p>
          <h2>Serving Businesses Nationwide</h2>
          <p>
            Trusted by companies across construction, logistics, manufacturing, retail,
            transportation and infrastructure.
          </p>
        </header>

        <div className="logo-wall__grid">
          {slots.map((slot) => (
            <LogoSlot key={slot} slot={slot} reducedMotion={reducedMotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
