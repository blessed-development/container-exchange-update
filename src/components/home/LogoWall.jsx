import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '@/styles/logo-wall.css';

const LOGOS = [
  ['ABC', '01-abc-6639cafe7f7e2.webp'],
  ['Advance Auto Parts', '02-advanced-auto-parts-6639cafecb0fc.webp'],
  ['Air Liquide', '03-air-liquide-6639cb196b89d.webp'],
  ['Alcoa', '04-alcoa-6639cb009bee9.webp'],
  ['BNSF Railway', '05-bnsf-railway-6639cb00a6d28.webp'],
  ['Boeing', '06-boeing-6639cb0181cfa.webp'],
  ['Crown Lift Trucks', '07-crown-lift.webp'],
  ['Dow', '08-dow-chemical-6639cb018692d.webp'],
  ['FedEx', '09-federal-express-6639cb037d352.webp'],
  ['Ford', '10-ford-motor-company-2.webp'],
  ['General Electric', '11-general-electric.webp'],
  ['Girl Scouts', '12-girl-scouts-6639cb03464d7.webp'],
  ['Los Angeles Department of Water and Power', '13-la-dwp-6639caf98bd28.webp'],
  ['La Quinta', '14-la-quinta.webp'],
  ['Lockheed Martin', '15-lockheed-martin-6639caf951aea.webp'],
  ['Mitsubishi', '16-mitsubishi-6639cafa467be.webp'],
  ['NBC', '17-nbc-6639cb10b82d4.webp'],
  ['Nissan', '18-nissan-2.webp'],
  ['Sony Pictures', '19-sony-studios-6639cafbbf040.webp'],
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
].map(([name, filename]) => ({ name, src: `/logos/${filename}` }));

function getSlotCount() {
  if (typeof window === 'undefined') return 10;
  if (window.innerWidth >= 1024) return 10;
  if (window.innerWidth >= 640) return 8;
  return 10;
}

function randomUniqueLogos(count, retained = []) {
  const result = [...new Set(retained)].slice(0, count);
  const available = LOGOS.filter((logo) => !result.includes(logo));

  while (result.length < count && available.length) {
    const index = Math.floor(Math.random() * available.length);
    result.push(available.splice(index, 1)[0]);
  }

  return result;
}

function useSlotCount() {
  const [slotCount, setSlotCount] = useState(getSlotCount);

  useEffect(() => {
    const updateSlotCount = () => setSlotCount(getSlotCount());
    window.addEventListener('resize', updateSlotCount);
    return () => window.removeEventListener('resize', updateSlotCount);
  }, []);

  return slotCount;
}

const Logo = memo(function Logo({ logo, reducedMotion }) {
  return (
    <AnimatePresence initial={false} mode="sync">
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
        initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.65, ease: [0.22, 1, 0.36, 1] }}
      />
    </AnimatePresence>
  );
});

export default function LogoWall() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const slotCount = useSlotCount();
  const slots = useMemo(() => Array.from({ length: slotCount }, (_, index) => index), [slotCount]);
  const [logos, setLogos] = useState(() => randomUniqueLogos(getSlotCount()));
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setLogos((current) => randomUniqueLogos(slotCount, current));
  }, [slotCount]);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.28 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const rotateOne = useCallback(() => {
    setLogos((current) => {
      if (!current.length) return current;

      const slot = Math.floor(Math.random() * current.length);
      const visibleLogos = new Set(current);
      visibleLogos.delete(current[slot]);
      const options = LOGOS.filter((logo) => !visibleLogos.has(logo) && logo !== current[slot]);
      if (!options.length) return current;

      const next = [...current];
      next[slot] = options[Math.floor(Math.random() * options.length)];
      return next;
    });
  }, []);

  useEffect(() => {
    if (!visible || paused || reducedMotion) return undefined;

    let timeoutId;
    const scheduleNext = (delay) => {
      timeoutId = window.setTimeout(() => {
        rotateOne();
        scheduleNext(2100 + Math.round(Math.random() * 900));
      }, delay);
    };

    scheduleNext(0);
    return () => window.clearTimeout(timeoutId);
  }, [paused, reducedMotion, rotateOne, visible]);

  return (
    <section
      ref={sectionRef}
      className="logo-wall"
      aria-label="Serving businesses nationwide"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="logo-wall__glow logo-wall__glow--blue" aria-hidden="true" />
      <div className="logo-wall__glow logo-wall__glow--orange" aria-hidden="true" />

      <div className="logo-wall__content">
        <header className="logo-wall__header">
          <p className="logo-wall__eyebrow">Trusted nationwide</p>
          <h2>Serving Businesses Nationwide</h2>
          <p>Trusted by companies across construction, logistics, manufacturing, retail, transportation and infrastructure.</p>
        </header>

        <div className="logo-wall__grid">
          {slots.map((slot) => (
            <div className="logo-wall__slot" key={slot} aria-live="off">
              {logos[slot] && <Logo logo={logos[slot]} reducedMotion={reducedMotion} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
