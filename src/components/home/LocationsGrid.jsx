import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const pinLink = (city) => `/inventory?location=${encodeURIComponent(city)}`;
const locationPageLinks = {
  'Houston, TX': '/buy-shipping-containers-houston-tx',
  'Los Angeles / Long Beach, CA': '/buy-shipping-containers-los-angeles-long-beach-ca',
};
const featuredLocationLinks = {
  Houston: locationPageLinks['Houston, TX'],
  'Los Angeles / Long Beach': locationPageLinks['Los Angeles / Long Beach, CA'],
};
const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);
const formatPrice = (value) => `$${formatNumber(value)}`;

const chipGroups = [
  ['Atlanta, GA', 'Charlotte, NC', 'Columbus, OH', 'El Paso, TX', 'Kansas City, KS', 'Louisville, KY', 'Mobile, AL', 'Norfolk, VA', 'Raleigh, NC', 'Savannah, GA', 'Tampa, FL', 'Halifax / Dartmouth, NS', 'Toronto, ON', 'Saskatoon, SK'],
  ['Bakersfield, CA', 'Chicago, IL', 'Dallas, TX', 'Houston, TX', 'Laredo, TX', 'Memphis, TN', 'Nashville, TN', 'Omaha, NE', 'Salt Lake City, UT', 'Seattle, WA', 'Temecula, CA', 'Calgary, AB', 'Vancouver, BC / Delta, BC'],
  ['Baltimore, MD', 'Cincinnati, OH', 'Denver, CO', 'Indianapolis, IN', 'Las Vegas, NV', 'Miami, FL', 'New Orleans, LA', 'Phoenix, AZ', 'San Antonio, TX', 'St. Louis, MO', 'Wilmington, NC', 'Edmonton, AB', 'Winnipeg, MB'],
  ['Charleston, SC', 'Cleveland, OH', 'Detroit, MI', 'Jacksonville, FL', 'Los Angeles / Long Beach, CA', 'Minneapolis, MN', 'New York, NY / Newark, NJ', 'Portland, OR', 'San Francisco / Oakland, CA', 'Tacoma, WA', 'Worcester / Boston, MA', 'Montreal, QC', 'Regina, SK'],
];

const slides = [
  { city: 'Houston', region: 'TX, USA', offers: 29, inventory: { containers: 2145, priceFrom: 550, priceTo: 8675, rating: 4.9 }, image: '/images/locations/houston-tx.webp' },
  { city: 'Chicago', region: 'IL, USA', offers: 28, inventory: { containers: 2106, priceFrom: 550, priceTo: 18965, rating: 4.9 }, image: '/images/locations/chicago-il.webp' },
  { city: 'Toronto', region: 'ON, Canada', offers: 26, inventory: { containers: 2162, priceFrom: 475, priceTo: 16675, rating: 4.9 }, image: '/images/locations/toronto-on.webp' },
  { city: 'Dallas', region: 'TX, USA', offers: 14, inventory: { containers: 844, priceFrom: 950, priceTo: 9175, rating: 4.9 }, image: '/images/locations/dallas-tx.webp' },
  { city: 'Montreal', region: 'QC, Canada', offers: 17, inventory: { containers: 1492, priceFrom: 575, priceTo: 8075, rating: 4.9 }, image: '/images/locations/montreal-qc.webp' },
  { city: 'Savannah', region: 'GA, USA', offers: 14, inventory: { containers: 1187, priceFrom: 525, priceTo: 6175, rating: 4.9 }, image: '/images/locations/savannah-ga.webp' },
  { city: 'Vancouver / Delta', region: 'BC, Canada', offers: 19, inventory: { containers: 1884, priceFrom: 675, priceTo: 5847, rating: 4.9 }, image: '/images/locations/vancouver-delta-bc.webp' },
  { city: 'Los Angeles / Long Beach', region: 'CA, USA', offers: 24, inventory: { containers: 905, priceFrom: 725, priceTo: 17975, rating: 4.9 }, image: '/images/locations/los-angeles-long-beach-ca.webp' },
  { city: 'Calgary', region: 'AB, Canada', offers: 16, inventory: { containers: 900, priceFrom: 950, priceTo: 5575, rating: 4.9 }, image: '/images/locations/calgary-ab.webp' },
  { city: 'Halifax', region: 'NS, Canada', offers: 14, inventory: { containers: 269, priceFrom: 1437, priceTo: 7250, rating: 4.9 }, image: '/images/locations/halifax-ns.webp' },
];

export default function LocationsGrid() {
  const [active, setActive] = useState([0, 1, 2, 3]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((previous) => previous.map((index) => (index + 4) % slides.length));
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-[#080808] text-white py-12 px-5 overflow-hidden">
      <div className="max-w-[1680px] mx-auto">
        <div className="mb-6">
          <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-[#58beb7] mb-3">
            Our most popular locations
          </div>

          <h2 className="text-[clamp(36px,4.2vw,64px)] font-extrabold leading-[0.94] tracking-[-0.06em]">
            Where to Buy <span className="text-[#ff5a12]">Shipping Containers?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {chipGroups.map((group, index) => {
            const slide = slides[active[index]];
            const slideLink = featuredLocationLinks[slide.city];
            const cardHero = <>
              <img
                src={slide.image}
                alt={slide.city}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover brightness-[.60] saturate-[.82] contrast-[1.08] scale-[1.04] transition-all duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/85" />

              <div className="absolute top-4 right-4 bg-gradient-to-br from-[#ff8b13] to-[#e5351f] text-white text-[11px] font-extrabold px-3.5 py-2.5 rounded-full shadow-lg">
                {slide.offers} Special Offers
              </div>

              <div className="absolute left-7 right-6 bottom-6">
                <h3 className="text-[32px] font-extrabold tracking-[-0.055em] leading-none">
                  {slide.city}
                </h3>
                <p className="mt-2 text-white/75 text-[13px] font-semibold">
                  {slide.region}
                </p>
              </div>
            </>;

            return (
              <article
                key={index}
                className="bg-[#111111] border border-[#2b3036] rounded-[28px] overflow-hidden min-h-[670px] shadow-[0_28px_80px_rgba(0,0,0,.38)] transition-all duration-300 hover:-translate-y-1 hover:border-[#008f7d]/55 hover:shadow-[0_36px_100px_rgba(0,0,0,.48)]"
              >
                {slideLink ? (
                  <Link to={slideLink} className="relative block h-[258px] overflow-hidden bg-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6a2b] focus-visible:ring-inset" aria-label={`View containers in ${slide.city}`}>
                    {cardHero}
                  </Link>
                ) : (
                  <div className="relative h-[258px] overflow-hidden bg-[#1b1b1b]">{cardHero}</div>
                )}

                <div className="p-6 flex flex-col">
                  {slide.inventory ? (
                    <div className="mb-4">
                      <div className="text-[16px] font-extrabold tracking-[-0.038em] leading-tight mb-2">
                        {formatNumber(slide.inventory.containers)} Containers Available
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[13px] font-medium text-[#8fa1b6]">
                        <span>
                          From {formatPrice(slide.inventory.priceFrom)}–{formatPrice(slide.inventory.priceTo)}
                        </span>
                        <span className="whitespace-nowrap text-[#ff6a2b]" aria-label={`${slide.inventory.rating} out of 5 stars`}>
                          ★★★★★ <span className="text-white/85">{slide.inventory.rating.toFixed(1)}</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-[16px] font-extrabold tracking-[-0.038em] leading-tight mb-2">
                        {slide.available}
                      </div>

                      <div className="text-[13px] text-[#8fa1b6] font-medium mb-4">
                        {slide.price}
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-1">
                    {group.map((city) => {
                      const cityPageLink = locationPageLinks[city];
                      const className = 'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[14px] font-semibold text-[#e6f5f2] border border-transparent hover:bg-[#ff6a2b]/10 hover:border-[#ff6a2b]/30 hover:text-white hover:pl-4 transition-all duration-200';
                      const content = <><MapPin className="w-3.5 h-3.5 text-[#ff6a2b] flex-shrink-0" /><span>{city}</span></>;

                      return cityPageLink ? (
                        <Link key={city} to={cityPageLink} onClick={(event) => event.stopPropagation()} className={className}>
                          {content}
                        </Link>
                      ) : (
                        <a key={city} href={pinLink(city)} onClick={(event) => event.stopPropagation()} className={className}>
                          {content}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
