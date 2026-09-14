import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageSeo from '@/components/seo/PageSeo';

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
        q: 'Can I get location-specific pricing?',
        a: 'Yes. Enter your ZIP or postal code on the inventory page to see nearby availability and location-specific starting prices.',
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
      <PageSeo title="Shipping Container FAQs | Containers Exchange" description="Get answers to common shipping container questions about sizes, conditions, buying, delivery, and pricing." path="/faq" />
      {/* Header */}
      <div className="bg-[#061226] text-white py-24 relative overflow-hidden">
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
            <Link to="/inventory">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-12 px-8 shadow-lg shadow-primary/25">
                Browse Inventory
              </Button>
            </Link>
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
