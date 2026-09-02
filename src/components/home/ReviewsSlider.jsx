import React, { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

// Placeholder/demo testimonials — replace with approved customer feedback before launch.
// These entries are original site copy and are not presented as Google, Trustpilot, or verified third-party reviews.
const REVIEWS = [
  { id: 1, name: 'Julia R.', time: '2 months ago', text: 'The 20ft unit was placed exactly where we needed it. The delivery team made the process easy from start to finish.' },
  { id: 2, name: 'Mateo R.', time: '3 months ago', text: 'We needed secure storage for our crew quickly. The container arrived clean, solid, and ready to use.' },
  { id: 3, name: 'Danielle S.', time: '4 months ago', text: 'Clear communication, straightforward pricing, and a container that fits our small business yard perfectly.' },
  { id: 4, name: 'Ethan W.', time: '5 months ago', text: 'Our 40ft container is exactly what the farm needed for seasonal equipment and supplies.' },
  { id: 5, name: 'Priya K.', time: '6 months ago', text: 'The team answered every question before delivery. Placement was careful and the unit looks great on site.' },
  { id: 6, name: 'Noah B.', time: '6 months ago', text: 'A dependable storage solution for our construction materials. The doors operate smoothly and the unit feels secure.' },
  { id: 7, name: 'Carla M.', time: '7 months ago', text: 'We compared several options and this was the simplest experience. Delivery was right on schedule.' },
  { id: 8, name: 'Isaac T.', time: '8 months ago', text: 'The container was a practical addition to our property. It arrived in the condition we expected.' },
  { id: 9, name: 'Megan H.', time: '8 months ago', text: 'From quote to placement, everyone was helpful. Our workshop materials finally have a proper home.' },
  { id: 10, name: 'Luis G.', time: '9 months ago', text: 'Great option for extra inventory storage. The delivery driver worked around our tight driveway with care.' },
  { id: 11, name: 'Avery P.', time: '9 months ago', text: 'The unit has held up well through heavy weather. It is exactly the extra space our team needed.' },
  { id: 12, name: 'Jordan C.', time: '10 months ago', text: 'Professional service and a solid container. The ordering process was easier than we expected.' },
  { id: 13, name: 'Taylor N.', time: '10 months ago', text: 'We use it daily for tools and equipment. It is secure, clean, and a strong value for our operation.' },
  { id: 14, name: 'Riley F.', time: '11 months ago', text: 'The delivery was coordinated well and the container was positioned neatly beside our warehouse.' },
  { id: 15, name: 'Morgan L.', time: '11 months ago', text: 'A reliable solution for job-site storage. The entire process felt organized and straightforward.' },
  { id: 16, name: 'Casey J.', time: '12 months ago', text: 'We appreciate the responsive help choosing the right size. The container has been a great fit.' },
  { id: 17, name: 'Cameron D.', time: '12 months ago', text: 'Our delivery arrived when promised and the unit was ready for work immediately.' },
  { id: 18, name: 'Sydney V.', time: '1 year ago', text: 'A clean, dependable storage container for our growing landscaping business. Very pleased with the experience.' },
  { id: 19, name: 'Blake A.', time: '1 year ago', text: 'The 40ft container gave us room to organize supplies without adding another building to the property.' },
  { id: 20, name: 'Reese O.', time: '1 year ago', text: 'Everything was explained clearly, and delivery day went smoothly. We would use this service again.' },
  { id: 21, name: 'Quinn E.', time: '1 year ago', text: 'The unit is sturdy and well suited to our storage needs. It was placed exactly to our plan.' },
  { id: 22, name: 'Parker I.', time: '1 year ago', text: 'Good communication throughout and no surprises. The container has made our site much easier to manage.' },
  { id: 23, name: 'Logan Y.', time: '1 year ago', text: 'We wanted a simple long-term storage solution, and this container has delivered exactly that.' },
  { id: 24, name: 'Emerson Z.', time: '1 year ago', text: 'The driver was considerate of our property and the unit was set down cleanly and securely.' },
  { id: 25, name: 'Hayden Q.', time: '1 year ago', text: 'A practical, secure solution for our renovation materials. The service was easy to work with.' },
  { id: 26, name: 'Kendall X.', time: '1 year ago', text: 'The team helped us select a container that made sense for our budget and space.' },
  { id: 27, name: 'Rowan U.', time: '1 year ago', text: 'The container has been a useful addition to our operations. Ordering and delivery both felt seamless.' },
  { id: 28, name: 'Finley B.', time: '1 year ago', text: 'It arrived in great condition and gives us the secure overflow storage we were looking for.' },
  { id: 29, name: 'Sage W.', time: '1 year ago', text: 'A well-run delivery experience and a dependable container. It has made our workspace much more organized.' },
  { id: 30, name: 'Arden M.', time: '1 year ago', text: 'The size recommendation was right on target. Our container is secure, useful, and looks right at home.' },
];

function getCardsPerPage() {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function initialsFor(name) {
  return name.replace('.', '').split(' ').map((part) => part[0]).join('').slice(0, 2);
}

export default function ReviewsSlider() {
  const prefersReducedMotion = useReducedMotion();
  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage);
  const [slide, setSlide] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const groups = useMemo(() => {
    const result = [];
    for (let index = 0; index < REVIEWS.length; index += cardsPerPage) result.push(REVIEWS.slice(index, index + cardsPerPage));
    return result;
  }, [cardsPerPage]);
  const slides = useMemo(() => [...groups, groups[0]], [groups]);

  useEffect(() => {
    const updateCardsPerPage = () => setCardsPerPage(getCardsPerPage());
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  useEffect(() => {
    setSlide(0);
    setShouldAnimate(false);
    const frame = window.requestAnimationFrame(() => setShouldAnimate(true));
    return () => window.cancelAnimationFrame(frame);
  }, [cardsPerPage]);

  useEffect(() => {
    if (prefersReducedMotion || groups.length < 2) return undefined;
    const timer = window.setTimeout(() => setSlide((current) => current + 1), 5000);
    return () => window.clearTimeout(timer);
  }, [groups.length, prefersReducedMotion, slide]);

  useEffect(() => {
    if (slide !== groups.length) return undefined;
    const reset = window.setTimeout(() => {
      setShouldAnimate(false);
      setSlide(0);
      window.requestAnimationFrame(() => setShouldAnimate(true));
    }, 620);
    return () => window.clearTimeout(reset);
  }, [groups.length, slide]);

  return (
    <section className="py-24 bg-accent text-white relative overflow-hidden" aria-labelledby="happy-customers-heading">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/[0.05] blur-[80px] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 id="happy-customers-heading" className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            We've Got a Lot of <span className="text-primary">Happy Customers</span>
          </h2>
        </div>

        <div className="overflow-hidden" aria-live="polite">
          <div
            className="flex will-change-transform"
            style={{
              width: `${slides.length * 100}%`,
              transform: `translate3d(-${slide * (100 / slides.length)}%, 0, 0)`,
              transition: shouldAnimate && !prefersReducedMotion ? 'transform 620ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
            }}
          >
            {slides.map((group, groupIndex) => (
              <div
                key={`${groupIndex}-${group[0]?.id ?? 'empty'}`}
                className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                style={{ width: `${100 / slides.length}%` }}
              >
                {group.map((review) => <ReviewCard key={review.id} review={review} />)}
              </div>
            ))}
          </div>
        </div>

        {!prefersReducedMotion && (
          <div className="flex justify-center gap-1.5 mt-8" aria-hidden="true">
            {groups.map((_, index) => (
              <span key={index} className={`h-1.5 rounded-full transition-all duration-300 ${index === slide % groups.length ? 'w-5 bg-primary' : 'w-1.5 bg-white/20'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="min-h-[244px] bg-white/[0.035] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0" aria-hidden="true">
          <span className="text-primary font-bold text-sm">{initialsFor(review.name)}</span>
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">{review.name}</p>
          <p className="text-white/45 text-xs mt-1">{review.time}</p>
        </div>
      </div>

      <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
        ))}
      </div>

      <p className="text-white/65 text-sm leading-relaxed line-clamp-4">{review.text}</p>
    </article>
  );
}
