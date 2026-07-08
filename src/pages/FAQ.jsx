import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_CATEGORIES = [
  {
    category: 'Buying a Container',
    faqs: [
      {
        q: 'What sizes of shipping containers do you sell?',
        a: 'We offer 10ft, 20ft, and 40ft shipping containers. Within those sizes we carry both standard height (8\'6") and high cube (9\'6") options. The most popular sizes are the 20ft standard and 40ft high cube.',
      },
      {
        q: 'What is the difference between new and used containers?',
        a: 'New (one-trip) containers have been used once to ship goods from overseas and are in near-perfect condition. Used containers have had multiple trips and show normal wear — dents, surface rust, and minor cosmetic damage — but are structurally sound. Used containers are significantly cheaper and still provide excellent storage.',
      },
      {
        q: 'What do the container grades mean (WWT, CW, IICL)?',
        a: 'AS-IS: Sold as-is, may have structural issues. WWT (Wind & Water Tight): Guaranteed not to leak, may have cosmetic damage. CW (Cargo Worthy): Certified for international shipping, structurally sound. IICL: Premium condition, meets the highest international standards.',
      },
      {
        q: 'Do you offer a money-back guarantee?',
        a: 'Yes. We stand behind the quality and grade of every container we sell. If a container arrives and doesn\'t match the described grade, we will work with you to make it right.',
      },
      {
        q: 'Can I get exclusive phone discounts?',
        a: 'Yes! Calling us directly often gets you access to unadvertised specials, location-specific deals, and bulk discounts. Call (800) 555-1234 for the best price.',
      },
    ],
  },
  {
    category: 'Delivery & Logistics',
    faqs: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 3–7 business days after your order is confirmed. We will contact you to schedule a delivery window and the driver will call you the day of delivery.',
      },
      {
        q: 'How is the container delivered?',
        a: 'Containers are delivered on a tilt-bed truck. The driver will tilt the bed and slide the container off onto your chosen location. You need a flat, firm surface — gravel, concrete, or compacted dirt all work well.',
      },
      {
        q: 'What do I need to prepare for delivery?',
        a: 'You need approximately 100ft of clearance for the truck to maneuver. The ground should be relatively level and firm enough to support the weight of the container (approx. 5,000–8,000 lbs empty). The driver will place it as close to your desired spot as safely possible.',
      },
      {
        q: 'Do you deliver to my area?',
        a: 'We have 60+ depot locations across the USA and Canada. Enter your ZIP code on our inventory page to see available containers and pricing near you.',
      },
      {
        q: 'Is there a delivery fee?',
        a: 'Delivery fees vary by distance from the nearest depot. Use our ZIP code tool on any product page to get an instant delivery fee estimate for your location.',
      },
    ],
  },
  {
    category: 'Renting & Rent-to-Own',
    faqs: [
      {
        q: 'Do you offer container rentals?',
        a: 'Yes! We offer flexible monthly container rentals. We currently have a special promotion for 1 month free rent. Contact us to learn about rental rates and availability in your area.',
      },
      {
        q: 'What is Rent-to-Own (RTO)?',
        a: 'Rent-to-Own lets you make monthly payments toward owning the container outright. No credit check is required — everyone qualifies. We offer a $1 first month special on RTO agreements, and early payoff discounts are available.',
      },
      {
        q: 'How long are rental terms?',
        a: 'We offer flexible rental terms ranging from month-to-month up to multi-year agreements. RTO terms are available in 12, 24, 36, and 48-month options.',
      },
      {
        q: 'Can I return a rented container if I no longer need it?',
        a: 'Yes. We will arrange pickup of the container at the end of your rental term. Simply contact us to schedule a pickup date.',
      },
    ],
  },
  {
    category: 'Container Use Cases',
    faqs: [
      {
        q: 'What can I use a shipping container for?',
        a: 'Common uses include: job site storage, farm equipment storage, retail storage, on-site inventory management, residential storage, climate-controlled storage (with modifications), workshops, and converted living spaces.',
      },
      {
        q: 'Are shipping containers weatherproof?',
        a: 'Yes. WWT-grade and above containers are guaranteed to be wind and water tight. They are made of Corten steel, which is designed to resist rust and weather. They can withstand extreme temperatures, heavy rain, and high winds.',
      },
      {
        q: 'Can I modify the container — add doors, windows, electricity?',
        a: 'Absolutely. Containers are highly modifiable. We can discuss modification options during your consultation, or you can work with a local contractor to add doors, windows, insulation, electricity, and more.',
      },
      {
        q: 'Do I need a permit to place a container on my property?',
        a: 'Permit requirements vary by city, county, and state. We recommend checking with your local municipality before placing a container. Many residential and agricultural uses do not require permits, but commercial zoning may have different rules.',
      },
    ],
  },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-sm pr-4">{faq.q}</span>
        <ChevronDown className={`w-4 h-4 text-primary flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3 bg-muted/10 text-sm text-muted-foreground leading-relaxed border-t border-border">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-accent text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary/[0.05] blur-[80px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">FAQ</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-5">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            Everything you need to know about buying, renting, and receiving a shipping container.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-14">
        {FAQ_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
                {cat.category.toUpperCase()}
              </span>
            </div>
            <div className="space-y-3">
              {cat.faqs.map((faq) => (
                <FaqItem key={faq.q} faq={faq} />
              ))}
            </div>
          </motion.div>
        ))}

        {/* Still have questions */}
        <div className="bg-accent text-white rounded-2xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/[0.04] pointer-events-none" />
          <h2 className="text-2xl font-black mb-3 relative">Still have questions?</h2>
          <p className="text-white/50 mb-7 relative">Our team is happy to help you find the right container for your needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <a href="tel:+18005551234">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-12 px-8 shadow-lg shadow-primary/25">
                <Phone className="w-4 h-4 mr-2" /> Call (800) 555-1234
              </Button>
            </a>
            <Link to="/contact">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl h-12 px-8">
                Send a Message
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}