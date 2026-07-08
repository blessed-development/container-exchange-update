import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

const pinLink = (city) => `/inventory?location=${encodeURIComponent(city)}`;

const chipGroups = [
  ['Atlanta, GA','Charlotte, NC','Columbus, OH','El Paso, TX','Kansas City, KS','Louisville, KY','Mobile, AL','Norfolk, VA','Raleigh, NC','Savannah, GA','Tampa, FL','Halifax / Dartmouth, NS','Toronto, ON','Saskatoon, SK'],
  ['Bakersfield, CA','Chicago, IL','Dallas, TX','Houston, TX','Laredo, TX','Memphis, TN','Nashville, TN','Omaha, NE','Salt Lake City, UT','Seattle, WA','Temecula, CA','Calgary, AB','Vancouver, BC / Delta, BC'],
  ['Baltimore, MD','Cincinnati, OH','Denver, CO','Indianapolis, IN','Las Vegas, NV','Miami, FL','New Orleans, LA','Phoenix, AZ','San Antonio, TX','St. Louis, MO','Wilmington, NC','Edmonton, AB','Winnipeg, MB'],
  ['Charleston, SC','Cleveland, OH','Detroit, MI','Jacksonville, FL','Los Angeles / Long Beach, CA','Minneapolis, MN','New York, NY / Newark, NJ','Portland, OR','San Francisco / Oakland, CA','Tacoma, WA','Worcester / Boston, MA','Montreal, QC','Regina, SK']
];

const slides = [
  { city:'Houston', region:'TX, USA', offers:29, available:'1681 containers available', price:'from $600 to $17,650', img:'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&w=1100&q=82' },
  { city:'Chicago', region:'IL, USA', offers:28, available:'1929 containers available', price:'from $475 to $21,925', img:'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1100&q=82' },
  { city:'Toronto', region:'ON, Canada', offers:26, available:'2511 containers available', price:'from $500 to $6,340', img:'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=1100&q=82' },
  { city:'Dallas', region:'TX, USA', offers:14, available:'557 containers available', price:'from $975 to $12,575', img:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1100&q=82' },
];

export default function LocationsGrid() {
  const [active, setActive] = useState([0, 1, 2, 3]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => prev.map((v, i) => (v + 1 + i) % slides.length));
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
            const slide = slides[active[index]] || slides[index];

            return (
              <article
                key={index}
                className="bg-[#111111] border border-[#2b3036] rounded-[28px] overflow-hidden min-h-[670px] shadow-[0_28px_80px_rgba(0,0,0,.38)] transition-all duration-300 hover:-translate-y-1 hover:border-[#008f7d]/55 hover:shadow-[0_36px_100px_rgba(0,0,0,.48)]"
              >
                <div className="relative h-[258px] overflow-hidden bg-[#1b1b1b]">
                  <img
                    src={slide.img}
                    alt={slide.city}
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
                </div>

                <div className="p-6 flex flex-col">
                  <div className="text-[16px] font-extrabold tracking-[-0.038em] leading-tight mb-2">
                    {slide.available}
                  </div>

                  <div className="text-[13px] text-[#8fa1b6] font-medium mb-4">
                    {slide.price}
                  </div>

                  <div className="flex flex-col gap-1">
                    {group.map((city) => (
                      <a
                        key={city}
                        href={pinLink(city)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[14px] font-semibold text-[#e6f5f2] border border-transparent hover:bg-[#ff6a2b]/10 hover:border-[#ff6a2b]/30 hover:text-white hover:pl-4 transition-all duration-200"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#ff6a2b] flex-shrink-0" />
                        <span>{city}</span>
                      </a>
                    ))}
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
