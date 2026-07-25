import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';

const pinLink = (city) => `/inventory?location=${encodeURIComponent(city)}`;

const locations = [
  { city: 'Dallas', region: 'Texas, USA', country: 'USA', image: '/images/locations/dallas-tx.png' },
  { city: 'Houston', region: 'Texas, USA', country: 'USA', image: '/images/locations/houston-tx.png' },
  { city: 'Atlanta', region: 'Georgia, USA', country: 'USA', image: '/images/locations/atlanta-ga.png' },
  { city: 'Chicago', region: 'Illinois, USA', country: 'USA', image: '/images/locations/chicago-il.png' },
  { city: 'Los Angeles / Long Beach', region: 'California, USA', country: 'USA', image: '/images/locations/los-angeles-long-beach-ca.png' },
  { city: 'Miami', region: 'Florida, USA', country: 'USA', image: '/images/locations/miami-fl.png' },
  { city: 'New York / Newark', region: 'New York & New Jersey, USA', country: 'USA', image: '/images/locations/new-york-newark-ny.png' },
  { city: 'Seattle', region: 'Washington, USA', country: 'USA', image: '/images/locations/seattle-wa.png' },
  { city: 'Toronto', region: 'Ontario, Canada', country: 'Canada', image: '/images/locations/toronto-on.png' },
  { city: 'Vancouver / Delta', region: 'British Columbia, Canada', country: 'Canada', image: '/images/locations/vancouver-delta-bc.png' },
  { city: 'Montreal', region: 'Quebec, Canada', country: 'Canada', image: '/images/locations/montreal-qc.png' },
  { city: 'Calgary', region: 'Alberta, Canada', country: 'Canada', image: '/images/locations/calgary-ab.png' },
];

export default function LocationsGrid() {
  return (
    <section className="w-full overflow-hidden bg-[#080808] px-5 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-10 flex flex-col justify-between gap-5 lg:mb-12 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#58beb7]">
              Our most popular locations
            </div>

            <h2 className="max-w-5xl text-[clamp(38px,4.2vw,64px)] font-extrabold leading-[0.94] tracking-[-0.06em]">
              Where to Buy <span className="text-[#ff5a12]">Shipping Containers?</span>
            </h2>
          </div>

          <p className="max-w-md text-sm font-medium leading-relaxed text-[#8fa1b6] lg:pb-1">
            Explore inventory near the container markets customers rely on most across the United States and Canada.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {locations.map((location) => (
            <a
              key={location.city}
              href={pinLink(location.city)}
              className="group relative isolate min-h-[310px] overflow-hidden rounded-[28px] border border-[#2b3036] bg-[#111111] shadow-[0_22px_60px_rgba(0,0,0,.3)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#ff6a2b]/55 hover:shadow-[0_32px_80px_rgba(0,0,0,.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6a2b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#080808]"
            >
              <img
                src={location.image}
                alt={`${location.city} container market`}
                loading="lazy"
                className="absolute inset-0 -z-10 h-full w-full object-cover brightness-[.72] saturate-[.84] transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,16,.03)_14%,rgba(4,10,16,.34)_50%,rgba(4,10,16,.96)_100%)]" />

              <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur-md">
                {location.country}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="mb-3 flex items-center gap-2 text-[#ff6a2b]">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/70">Popular market</span>
                </div>

                <h3 className="max-w-[18rem] text-[30px] font-extrabold leading-[.98] tracking-[-0.055em] text-white">
                  {location.city}
                </h3>
                <p className="mt-2 text-[13px] font-semibold text-white/70">{location.region}</p>

                <div className="mt-5 flex items-center gap-2 text-[13px] font-extrabold text-white transition-colors group-hover:text-[#ff8b60]">
                  View local inventory
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
