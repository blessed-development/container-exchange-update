import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Calendar, Container } from 'lucide-react';

const DELIVERIES = [
  ['NEW 40HC One-Trip Shipping Container Delivered Los Angeles, CA', 'Los Angeles, CA', 'January 22, 2026'],
  ['Used 20ft WWT Shipping Container Delivered Arlington, TN', 'Arlington, TN', 'March 18, 2026'],
  ['NEW 20ft One-Trip Shipping Container Delivered Dallas, TX', 'Dallas, TX', 'February 04, 2026'],
  ['Used 40ft Cargo Worthy Shipping Container Delivered Houston, TX', 'Houston, TX', 'April 09, 2026'],
  ['NEW 40ft High Cube Shipping Container Delivered Miami, FL', 'Miami, FL', 'December 27, 2025'],
  ['Used 20ft Storage Container Delivered Atlanta, GA', 'Atlanta, GA', 'March 03, 2026'],
  ['NEW 40HC One-Trip Shipping Container Delivered Chicago, IL', 'Chicago, IL', 'January 11, 2026'],
  ['Used 40ft WWT Shipping Container Delivered Phoenix, AZ', 'Phoenix, AZ', 'February 19, 2026'],
  ['NEW 20ft Shipping Container Delivered Denver, CO', 'Denver, CO', 'April 21, 2026'],
  ['Used 20ft Cargo Worthy Container Delivered Nashville, TN', 'Nashville, TN', 'December 14, 2025'],
  ['NEW 40HC One-Trip Shipping Container Delivered Seattle, WA', 'Seattle, WA', 'March 29, 2026'],
  ['Used 40ft Storage Container Delivered Portland, OR', 'Portland, OR', 'February 26, 2026'],
  ['NEW 20ft One-Trip Container Delivered Tampa, FL', 'Tampa, FL', 'January 31, 2026'],
  ['Used 20ft WWT Shipping Container Delivered Memphis, TN', 'Memphis, TN', 'April 02, 2026'],
  ['NEW 40ft Standard Container Delivered Charlotte, NC', 'Charlotte, NC', 'December 08, 2025'],
  ['Used 40HC WWT Container Delivered Las Vegas, NV', 'Las Vegas, NV', 'March 12, 2026'],
  ['NEW 20ft Shipping Container Delivered San Antonio, TX', 'San Antonio, TX', 'February 15, 2026'],
  ['Used 40ft Cargo Worthy Container Delivered Jacksonville, FL', 'Jacksonville, FL', 'January 06, 2026'],
  ['NEW 40HC One-Trip Container Delivered Long Beach, CA', 'Long Beach, CA', 'April 17, 2026'],
  ['Used 20ft Storage Container Delivered Cleveland, OH', 'Cleveland, OH', 'December 30, 2025'],
  ['NEW 40ft High Cube Delivered Detroit, MI', 'Detroit, MI', 'March 07, 2026'],
  ['Used 20ft WWT Container Delivered St. Louis, MO', 'St. Louis, MO', 'February 22, 2026'],
  ['NEW 20ft One-Trip Container Delivered Cincinnati, OH', 'Cincinnati, OH', 'January 18, 2026'],
  ['Used 40ft WWT Container Delivered Kansas City, KS', 'Kansas City, KS', 'April 25, 2026'],
  ['NEW 40HC One-Trip Container Delivered Savannah, GA', 'Savannah, GA', 'December 19, 2025'],
  ['Used 20ft Cargo Worthy Container Delivered Norfolk, VA', 'Norfolk, VA', 'March 24, 2026'],
  ['NEW 40ft Standard Container Delivered Mobile, AL', 'Mobile, AL', 'February 09, 2026'],
  ['Used 40HC WWT Container Delivered Salt Lake City, UT', 'Salt Lake City, UT', 'January 27, 2026'],
  ['NEW 20ft Shipping Container Delivered Columbus, OH', 'Columbus, OH', 'April 13, 2026'],
  ['Used 20ft WWT Container Delivered Raleigh, NC', 'Raleigh, NC', 'December 03, 2025'],
];

const IMAGES = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=80',
  'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1000&q=80',
  'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=1000&q=80',
  'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1000&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&q=80',
];

const deliveryCards = DELIVERIES.map(([headline, city, date], index) => ({
  id: index + 1,
  headline,
  city,
  date,
  image: IMAGES[index % IMAGES.length],
}));

export default function RecentlyDelivered() {
  const trackRef = useRef(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      const cards = Array.from(track.children);
      if (!cards.length) return;

      const visible = window.innerWidth <= 640 ? 1 : window.innerWidth <= 1100 ? 2 : 4;
      const max = Math.max(0, cards.length - visible);

      setPosition((prev) => (prev >= max ? 0 : prev + 1));
    }, 4400);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.children[0];
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap || 0);

    track.style.transform = `translateX(-${position * (cardWidth + gap)}px)`;
  }, [position]);

  return (
    <section className="bg-[#ff4b00] text-white overflow-hidden py-[72px]">
      <div className="w-[96vw] max-w-[1760px] mx-auto">
        <h2 className="text-center text-[clamp(38px,4vw,68px)] leading-[0.95] font-extrabold tracking-[-0.055em]">
          Recently Delivered Containers
        </h2>

        <div className="text-center mt-4 mb-8 text-white/75 text-[16px] font-bold tracking-[0.22em] uppercase">
          Updated Daily
        </div>

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-[10px] transition-transform duration-[1050ms] ease-[cubic-bezier(.22,.9,.23,1)] will-change-transform"
          >
            {deliveryCards.map((item) => (
              <article
                key={item.id}
                className="relative flex-shrink-0 basis-full sm:basis-[calc((100%-10px)/2)] lg:basis-[calc((100%-30px)/4)] h-[320px] rounded-[18px] overflow-hidden bg-[#111] bg-cover bg-center shadow-[0_22px_46px_rgba(0,0,0,.22)] transition-transform duration-300 hover:-translate-y-1"
                style={{ backgroundImage: `url('${item.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />

                <div className="absolute z-10 left-[22px] right-5 bottom-5 text-white">
                  <div className="flex items-start gap-2 text-[14px] leading-[1.18] font-semibold">
                    <span className="w-[19px] h-[19px] rounded-[5px] bg-[#ff4b00] grid place-items-center flex-shrink-0">
                      <Container className="w-3.5 h-3.5" />
                    </span>
                    {item.headline}
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[12px] font-medium text-white/80">
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
