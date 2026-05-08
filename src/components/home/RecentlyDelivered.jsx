import React from 'react';
import { MapPin, Calendar, Container } from 'lucide-react';

const deliveryTitles = [
  "NEW 40HC One-Trip Shipping Container Delivered Los Angeles, CA",
  "Used 20ft WWT Shipping Container Delivered Arlington, TN",
  "NEW 20ft One-Trip Shipping Container Delivered Dallas, TX",
  "Used 40ft Cargo Worthy Shipping Container Delivered Houston, TX",
  "NEW 40ft High Cube Shipping Container Delivered Miami, FL",
  "Used 20ft Storage Container Delivered Atlanta, GA",
  "NEW 40HC One-Trip Shipping Container Delivered Chicago, IL",
  "Used 40ft WWT Shipping Container Delivered Phoenix, AZ",
  "NEW 20ft Shipping Container Delivered Denver, CO",
  "Used 20ft Cargo Worthy Container Delivered Nashville, TN",
  "NEW 40HC One-Trip Shipping Container Delivered Seattle, WA",
  "Used 40ft Storage Container Delivered Portland, OR",
  "NEW 20ft One-Trip Container Delivered Tampa, FL",
  "Used 20ft WWT Shipping Container Delivered Memphis, TN",
  "NEW 40ft Standard Container Delivered Charlotte, NC",
  "Used 40HC WWT Container Delivered Las Vegas, NV",
  "NEW 20ft Shipping Container Delivered San Antonio, TX",
  "Used 40ft Cargo Worthy Container Delivered Jacksonville, FL",
  "NEW 40HC One-Trip Container Delivered Long Beach, CA",
  "Used 20ft Storage Container Delivered Cleveland, OH",
  "NEW 40ft High Cube Delivered Detroit, MI",
  "Used 20ft WWT Container Delivered St. Louis, MO",
  "NEW 20ft One-Trip Container Delivered Cincinnati, OH",
  "Used 40ft WWT Container Delivered Kansas City, KS",
  "NEW 40HC One-Trip Container Delivered Savannah, GA",
  "Used 20ft Cargo Worthy Container Delivered Norfolk, VA",
  "NEW 40ft Standard Container Delivered Mobile, AL",
  "Used 40HC WWT Container Delivered Salt Lake City, UT",
  "NEW 20ft Shipping Container Delivered Columbus, OH",
  "Used 20ft WWT Container Delivered Raleigh, NC"
];

const randomDates = [
  'January 22, 2026',
  'March 18, 2026',
  'February 04, 2026',
  'April 09, 2026',
  'December 27, 2025',
  'March 03, 2026',
  'January 11, 2026',
  'February 19, 2026',
  'April 21, 2026',
  'December 14, 2025',
  'March 29, 2026',
  'February 26, 2026',
  'January 31, 2026',
  'April 02, 2026',
  'December 08, 2025',
  'March 12, 2026',
  'February 15, 2026',
  'January 06, 2026',
  'April 17, 2026',
  'December 30, 2025',
  'March 07, 2026',
  'February 22, 2026',
  'January 18, 2026',
  'April 25, 2026',
  'December 19, 2025',
  'March 24, 2026',
  'February 09, 2026',
  'January 27, 2026',
  'April 13, 2026',
  'December 03, 2025',
];

const deliveryImages = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
  'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80',
  'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=1200&q=80',
  'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1200&q=80',
  'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1200&q=80',
];

const deliveredItems = deliveryTitles.map((title, index) => ({
  id: index + 1,
  title,
  date: randomDates[index],
  city: title.split('Delivered ')[1],
  image: deliveryImages[index % deliveryImages.length],
}));

const deliveredTrack = document.getElementById('deliveredTrack');

if (deliveredTrack) {

  deliveredItems.forEach(item => {

    const card = document.createElement('article');

    card.className = 'delivered-card';

    card.style.backgroundImage = `url('${item.image}')`;

    card.innerHTML = `
      <div class="delivered-info">

        <div class="delivered-name">
          <span class="del-icon">≡</span>
          ${item.title}
        </div>

        <div class="delivered-line">
          <span class="del-date">▢</span>
          ${item.date}
        </div>

        <div class="delivered-line">
          <span class="del-pin">⌖</span>
          ${item.city}
        </div>

      </div>
    `;

    deliveredTrack.appendChild(card);

  });

  let deliveredPos = 0;

  function moveDeliveredSlider() {

    const cards = Array.from(deliveredTrack.children);

    if (!cards.length) return;

    const visible =
      window.innerWidth <= 640
        ? 1
        : (window.innerWidth <= 1100 ? 2 : 4);

    const max = Math.max(0, cards.length - visible);

    deliveredPos = deliveredPos >= max
      ? 0
      : deliveredPos + 1;

    const cardWidth = cards[0].getBoundingClientRect().width;

    const gap = parseFloat(
      getComputedStyle(deliveredTrack).gap || 0
    );

    deliveredTrack.style.transform =
      `translateX(-${deliveredPos * (cardWidth + gap)}px)`;
  }

  setInterval(moveDeliveredSlider, 4400);
}
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
