import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const US_CITIES = [
  'Atlanta, GA', 'Bakersfield, CA', 'Baltimore, MD', 'Charleston, SC',
  'Charlotte, NC', 'Chicago, IL', 'Cincinnati, OH', 'Cleveland, OH',
  'Columbus, OH', 'Dallas, TX', 'Denver, CO', 'Detroit, MI',
  'El Paso, TX', 'Houston, TX', 'Indianapolis, ID', 'Jacksonville, FL',
  'Kansas City, KS', 'Laredo, TX', 'Las Vegas, NV', 'Los Angeles / Long Beach, CA',
  'Louisville, KY', 'Memphis, TN', 'Miami, FL', 'Minneapolis, MN',
  'Mobile, AL', 'Nashville, TN', 'New Orleans, LA', 'New York, NY / Newark, NJ',
  'Norfolk, VA', 'Omaha, NE', 'Phoenix, AZ', 'Portland, OR',
  'Raleigh, NC', 'Salt Lake City, UT', 'San Antonio, TX', 'San Francisco / Oakland, CA',
  'Savannah, GA', 'Seattle, WA', 'St. Louis, MO', 'Tacoma, WA',
  'Tampa, FL', 'Temecula, CA', 'Wilmington, NC', 'Worcester / Boston, MA',
];

const CA_CITIES = [
  'Halifax / Dartmouth, NS', 'Calgary, AB', 'Edmonton, AB', 'Montreal, QB',
  'Toronto, ON', 'Vancouver, BC / Delta, BC', 'Winnipeg, MB', 'Regina, SK', 'Saskatoon, SK',
];

const ALL_CITIES = [...US_CITIES, ...CA_CITIES];

export default function LocationsGrid() {
  return (
    <section className="py-24 bg-accent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Where to Buy{' '}
            <span className="text-primary">Shipping Containers?</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3"
        >
          {ALL_CITIES.map((city) => (
            <div key={city} className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="text-white/75 text-sm hover:text-white transition-colors">{city}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}