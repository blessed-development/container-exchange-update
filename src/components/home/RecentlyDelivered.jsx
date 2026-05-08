import React from 'react';
import { MapPin, Calendar, Container } from 'lucide-react';

const DELIVERIES = [
  ['NEW 40HC One-Trip Shipping Container Delivered Los Angeles, CA', 'Los Angeles, CA', 'March 18, 2026'],
  ['Used 20ft WWT Shipping Container Delivered Arlington, TN', 'Arlington, TN', 'March 17, 2026'],
  ['NEW 20ft One-Trip Shipping Container Delivered Dallas, TX', 'Dallas, TX', 'March 16, 2026'],
  ['Used 40ft Cargo Worthy Shipping Container Delivered Houston, TX', 'Houston, TX', 'March 15, 2026'],
  ['NEW 40ft High Cube Shipping Container Delivered Miami, FL', 'Miami, FL', 'March 14, 2026'],
  ['Used 20ft Storage Container Delivered Atlanta, GA', 'Atlanta, GA', 'March 13, 2026'],
  ['NEW 40HC One-Trip Shipping Container Delivered Chicago, IL', 'Chicago, IL', 'March 12, 2026'],
  ['Used 40ft WWT Shipping Container Delivered Phoenix, AZ', 'Phoenix, AZ', 'March 11, 2026'],
  ['NEW 20ft Shipping Container Delivered Denver, CO', 'Denver, CO', 'March 10, 2026'],
  ['Used 20ft Cargo Worthy Container Delivered Nashville, TN', 'Nashville, TN', 'March 09, 2026'],
  ['NEW 40HC One-Trip Shipping Container Delivered Seattle, WA', 'Seattle, WA', 'March 08, 2026'],
  ['Used 40ft Storage Container Delivered Portland, OR', 'Portland, OR', 'March 07, 2026'],
  ['NEW 20ft One-Trip Container Delivered Tampa, FL', 'Tampa, FL', 'March 06, 2026'],
  ['Used 20ft WWT Shipping Container Delivered Memphis, TN', 'Memphis, TN', 'March 05, 2026'],
  ['NEW 40ft Standard Container Delivered Charlotte, NC', 'Charlotte, NC', 'March 04, 2026'],
  ['Used 40HC WWT Container Delivered Las Vegas, NV', 'Las Vegas, NV', 'March 03, 2026'],
  ['NEW 20ft Shipping Container Delivered San Antonio, TX', 'San Antonio, TX', 'March 02, 2026'],
  ['Used 40ft Cargo Worthy Container Delivered Jacksonville, FL', 'Jacksonville, FL', 'March 01, 2026'],
  ['NEW 40HC One-Trip Container Delivered Long Beach, CA', 'Long Beach, CA', 'February 28, 2026'],
  ['Used 20ft Storage Container Delivered Cleveland, OH', 'Cleveland, OH', 'February 27, 2026'],
  ['NEW 40ft High Cube Delivered Detroit, MI', 'Detroit, MI', 'February 26, 2026'],
  ['Used 20ft WWT Container Delivered St. Louis, MO', 'St. Louis, MO', 'February 25, 2026'],
  ['NEW 20ft One-Trip Container Delivered Cincinnati, OH', 'Cincinnati, OH', 'February 24, 2026'],
  ['Used 40ft WWT Container Delivered Kansas City, KS', 'Kansas City, KS', 'February 23, 2026'],
  ['NEW 40HC One-Trip Container Delivered Savannah, GA', 'Savannah, GA', 'February 22, 2026'],
  ['Used 20ft Cargo Worthy Container Delivered Norfolk, VA', 'Norfolk, VA', 'February 21, 2026'],
  ['NEW 40ft Standard Container Delivered Mobile, AL', 'Mobile, AL', 'February 20, 2026'],
  ['Used 40HC WWT Container Delivered Salt Lake City, UT', 'Salt Lake City, UT', 'February 19, 2026'],
  ['NEW 20ft Shipping Container Delivered Columbus, OH', 'Columbus, OH', 'February 18, 2026'],
  ['Used 20ft WWT Container Delivered Raleigh, NC', 'Raleigh, NC', 'February 17, 2026'],
];

const IMAGES = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80',
  'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80',
  'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=900&q=80',
  'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=900&q=80',
];

const deliveryCards = DELIVERIES.map(([headline, city, date], index) => ({
  id: index + 1,
  headline,
  city,
  date,
  image: IMAGES[index % IMAGES.length],
}));

export default function RecentlyDelivered() {
  const loopCards = [...deliveryCards, ...deliveryCards];

  return (
    <section className="bg-[#ff4b00] text-white py-16 overflow-hidden">
      <style>
        {`
          @keyframes deliveredMarquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }

          .delivered-marquee-track {
            animation: deliveredMarquee 70s linear infinite;
          }

          .delivered-marquee-track:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="w-[96vw] max-w-[1760px] mx-auto">
        <h2 className="text-center text-[clamp(38px,4vw,68px)] leading-[0.95] font-extrabold tracking-[-0.055em]">
          Recently Delivered Containers
        </h2>

        <div className="text-center mt-4 mb-8 text-white/75 text-[14px] sm:text-[16px] font-bold tracking-[0.22em] uppercase">
          Updated Daily
        </div>

        <div className="overflow-hidden">
          <div className="delivered-marquee-track flex gap-3 w-max">
            {loopCards.map((item, index) => (
              <article
                key={`${item.id}-${index}`}
                className="relative flex-shrink-0 w-[84vw] sm:w-[46vw] lg:w-[24vw] xl:w-[23vw] h-[320px] rounded-[18px] overflow-hidden bg-[#111] bg-cover bg-center shadow-[0_22px_46px_rgba(0,0,0,.22)] transition-transform duration-300 hover:-translate-y-1"
                style={{ backgroundImage: `url('${item.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />

                <div className="absolute left-5 right-5 bottom-5 z-10 text-shadow">
                  <div className="flex items-start gap-2 text-[14px] leading-tight font-bold">
                    <span className="w-5 h-5 rounded-md bg-[#ff4b00] grid place-items-center flex-shrink-0">
                      <Container className="w-3.5 h-3.5" />
                    </span>
                    {item.headline}
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-[12px] font-medium text-white/80">
                    <Calendar className="w-4 h-4 text-[#ff4b00]" />
                    {item.date}
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[12px] font-medium text-white/80">
                    <MapPin className="w-4 h-4 text-[#ff4b00]" />
                    {item.city}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
