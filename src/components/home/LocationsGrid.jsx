import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const US_CITIES = [
  'Atlanta, GA', 'Bakersfield, CA', 'Baltimore, MD', 'Charleston, SC',
  'Charlotte, NC', 'Chicago, IL', 'Cincinnati, OH', 'Cleveland, OH',
  'Columbus, OH', 'Dallas, TX', 'Denver, CO', 'Detroit, MI',
  'El Paso, TX', 'Houston, TX', 'Indianapolis, IN', 'Jacksonville, FL',
  'Kansas City, KS', 'Laredo, TX', 'Las Vegas, NV', 'Los Angeles, CA',
  'Louisville, KY', 'Memphis, TN', 'Miami, FL', 'Minneapolis, MN',
  'Mobile, AL', 'Nashville, TN', 'New Orleans, LA', 'New York, NY',
  'Norfolk, VA', 'Omaha, NE', 'Phoenix, AZ', 'Portland, OR',
  'Raleigh, NC', 'Salt Lake City, UT', 'San Antonio, TX', 'San Francisco, CA',
  'Savannah, GA', 'Seattle, WA', 'St. Louis, MO', 'Tampa, FL',
];

const CA_CITIES = [
  'Calgary, AB', 'Edmonton, AB', 'Halifax, NS', 'Montreal, QC',
  'Toronto, ON', 'Vancouver, BC', 'Winnipeg, MB', 'Regina, SK', 'Saskatoon, SK',
];

const REGIONS = [
  { label: 'United States', cities: US_CITIES, flag: '🇺🇸' },
  { label: 'Canada', cities: CA_CITIES, flag: '🇨🇦' },
];

export default function LocationsGrid() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="py-24 bg-accent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-4">NATIONWIDE COVERAGE</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Where to Buy{' '}
            <span className="text-primary">Shipping Containers?</span>
          </h2>
          <p className="text-white/50 mt-3 text-base max-w-xl mx-auto">
            We deliver across the United States and Canada. Select your location to check availability.
          </p>
        </div>

        {/* Region toggles */}
        <div className="flex flex-col gap-4 mb-12">
          {REGIONS.map((region) => (
            <div key={region.label} className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.03]">
              <button
                onClick={() => setExpanded(expanded === region.label ? null : region.label)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{region.flag}</span>
                  <span className="font-bold text-lg">{region.label}</span>
                  <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                    {region.cities.length} locations
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${expanded === region.label ? 'rotate-180' : ''}`} />
              </button>

              {expanded === region.label && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-white/10 px-6 py-5"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2.5">
                    {region.cities.map((city) => (
                      <div key={city} className="flex items-center gap-2 group">
                        <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="text-white/60 text-sm group-hover:text-white transition-colors">{city}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* All cities quick grid (collapsed preview) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2.5 border-t border-white/10 pt-10"
        >
          {[...US_CITIES, ...CA_CITIES].slice(0, 24).map((city) => (
            <div key={city} className="flex items-center gap-2 group">
              <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="text-white/50 text-sm group-hover:text-white transition-colors">{city}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}