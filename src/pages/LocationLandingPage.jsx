import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';

const containerConditions = ['New', 'IICL / Multi-Trip', 'CW', 'WWT', 'AS IS'];

export default function LocationLandingPage({ location }) {
  const reduceMotion = useReducedMotion();
  const subtitle = location.subtitle;

  return (
    <>
      <Helmet>
        <title>{location.seo.title}</title>
        <meta name="description" content={location.seo.description} />
        <link rel="canonical" href={`${window.location.origin}/${location.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={location.seo.title} />
        <meta property="og:description" content={location.seo.description} />
        <meta property="og:image" content={`${window.location.origin}${location.heroImage}`} />
        <meta property="og:url" content={`${window.location.origin}/${location.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#07111f]">
        <img
          src={location.heroImage}
          alt={location.heroAlt}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          style={{ objectPosition: location.heroPosition }}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,10,20,0.94)_0%,rgba(3,10,20,0.72)_38%,rgba(3,10,20,0.2)_68%,rgba(3,10,20,0.28)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(3,10,20,0.74)_0%,transparent_46%,rgba(3,10,20,0.1)_100%)]" />
        <div className="pointer-events-none absolute -left-40 top-1/2 -z-10 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]" />

        <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl items-center px-5 pb-36 pt-28 sm:px-8 sm:pb-32 lg:px-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <p className="mb-7 font-mono text-xs font-semibold tracking-[0.22em] text-primary sm:text-sm">
              {location.regionLabel}
            </p>
            <h1 className={`max-w-4xl font-black leading-[0.94] tracking-[-0.055em] text-white ${location.headingSize}`}>
              <span className="block">Buy Shipping Containers in</span>
              <span className="mt-2 block text-primary">{location.displayName}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg md:text-xl">
              {subtitle}
            </p>
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-6 mx-auto max-w-7xl px-5 sm:bottom-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2" aria-label="Available container conditions">
              {containerConditions.map((condition) => (
                <span key={condition} className="rounded-full border border-primary/45 bg-black/35 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white/95 backdrop-blur-sm sm:px-3.5">
                  {condition}
                </span>
              ))}
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm sm:px-3.5 sm:text-sm" aria-label="Rated 4.9 out of 5">
              <span className="text-[#facc15]" aria-hidden="true">★★★★★</span>
              <span>4.9</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
