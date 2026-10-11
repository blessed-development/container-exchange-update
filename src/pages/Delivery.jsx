import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageSeo from '@/components/seo/PageSeo';

const STATS = [
  { val: '3–7',   label: 'Business-Day Estimate' },
  { val: 'ZIP',    label: 'Location-Based Pricing' },
  { val: 'Site',   label: 'Access Review' },
  { val: 'Route',  label: 'Carrier Coordinated' },
];

const TIPS = [
  {
    title: 'Keep the Site Level',
    desc: 'A level placement area supports normal cargo-door operation and helps reduce unnecessary strain over time.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    title: 'Elevation Options',
    desc: 'Use cinder blocks, railroad ties, garden pavers, or concrete pillars to elevate and prevent water pooling.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    title: 'Available Locally',
    desc: 'All leveling materials can be found at any local hardware store before your scheduled delivery.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: 'Driver Assistance',
    desc: "Drivers will help position the container onto your leveling materials — just have them ready on site.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const GALLERY_IMAGES = [
  { src: '/images/delivery/tiltbed-offload.webp', alt: 'Cream shipping container being transported on an unbranded tilt-deck trailer at a delivery yard', span2: true },
  { src: '/images/delivery/standard-placement.webp', alt: 'Used blue 20-foot shipping container on a neutral tilt-bed delivery truck' },
  { src: '/images/delivery/crane-placement.webp', alt: 'One-trip high-cube shipping container on a delivery trailer at a container yard' },
  { src: '/images/delivery/level-foundation.webp', alt: 'Shipping container delivered to a residential driveway on a neutral tilt-deck trailer' },
  { src: '/images/delivery/rural-route.webp', alt: 'Shipping containers on a tilt-bed trailer during delivery preparation' },
];

const FAQS = [
  { q: 'How long does delivery typically take after ordering?',      a: 'Most confirmed orders are scheduled for delivery within 3–7 business days after payment confirmation. Timing depends on local availability, carrier routing, site access, weather, and scheduling. We will confirm the delivery plan before dispatch.' },
  { q: 'What type of truck is used for delivery?',                   a: 'Delivery equipment is selected for the container size, route, and site-access conditions. Tilt-bed equipment is commonly used for accessible sites; tight or confined locations may require a specialized carrier or different placement approach.' },
  { q: 'How much clearance does my property need?',                  a: 'For a 20ft unit: at least 70ft length × 12ft width × 13ft height. For a 40ft unit: 110ft length × 12ft width × 14ft height. These dimensions account for the full truck, trailer, and offloading process.' },
  { q: 'Does my container need a special foundation?',               a: 'No special foundation is required — containers can be placed directly on solid, level ground. If you want to prevent water pooling, we recommend elevating with cinder blocks, railroad ties, or concrete pillars available at your local hardware store.' },
  { q: 'Will the driver place the container exactly where I want it?', a: 'The carrier will review the requested placement with you and will make a reasonable effort to place the container safely. Final placement depends on access, ground conditions, overhead clearance, equipment, and the driver’s safety assessment. Drivers do not supply leveling materials.' },
  { q: 'Is wrecker / tight-space delivery more expensive?',          a: 'Yes. Wrecker and specialized 20ft delivery services typically cost more than standard tiltbed delivery due to the specialized equipment and precision required. A clear quote will always be provided before any delivery is confirmed.' },
  { q: "What if my container doors won't open after delivery?",      a: 'This is almost always caused by the container not being fully level. Re-leveling the container typically resolves the issue immediately. Contact our team and we\'ll guide you through the steps or arrange a service visit.' },
  { q: 'Do you deliver to both residential and commercial locations?', a: 'We coordinate delivery to eligible residential and commercial locations, including farms, construction sites, warehouses, and businesses. Availability depends on the delivery market, access conditions, and carrier scheduling.' },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-colors ${open ? 'border-primary/50' : 'border-border'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-sm text-foreground leading-snug">{faq.q}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 ${open ? 'bg-primary/10 border-primary/40 rotate-45' : 'border-border'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`w-3 h-3 ${open ? 'text-primary' : 'text-muted-foreground'}`}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
      </button>
      {open && (
        <div className="border-t border-border px-5 py-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function Delivery() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageSeo title="Shipping Container Delivery | Containers Exchange" description="Learn how shipping container delivery works, including site preparation, scheduling, and delivery requirements." path="/delivery" />

      {/* HERO */}
      <section className="relative px-6 sm:px-12 pt-28 pb-16 overflow-hidden border-b border-border bg-muted/25">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,106,26,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,106,26,0.05) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span className="text-[11px] font-bold text-primary tracking-widest uppercase">Delivery Service</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-5">
            We Bring The<br /><span className="text-primary">Steel To You.</span>
          </h1>
          <p className="text-muted-foreground text-base font-light leading-relaxed max-w-lg mb-8">
            Delivery coordination for shipping containers, with equipment and placement planning matched to your location and site access.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#contact">
              <Button className="ce-signature-button font-bold rounded-lg h-11 px-6 gap-2">
                <Mail className="w-4 h-4" />
                Contact Our Team
              </Button>
            </a>
            <a href="#faq">
              <Button variant="outline" className="ce-secondary-button rounded-lg h-11 px-6 gap-2">
                <HelpCircle className="w-4 h-4" />
                View FAQ
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-card">
        {STATS.map((s, i) => (
          <motion.div
            key={s.val}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="px-7 py-5 border-r border-border last:border-r-0 flex flex-col gap-1"
          >
            <span className="font-mono text-2xl font-semibold text-primary tracking-tight">{s.val}</span>
            <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 flex flex-col gap-16">

        {/* DELIVERY METHODS */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-bold text-primary tracking-[0.12em] uppercase mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-primary inline-block" /> How We Deliver
          </p>
          <h2 className="text-3xl font-black tracking-tight mb-2">Two Delivery <span className="text-primary">Methods</span></h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">Delivery arrangements are matched to the container, route, and site conditions—whether the destination is an open lot or a tighter residential location.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Tilt-Bed Delivery',
                desc: 'Tilt-bed equipment is commonly used for open, accessible delivery sites. The carrier and equipment are confirmed after reviewing the container, route, and site access.',
                tag: 'Accessible Sites',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary">
                    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                ),
              },
              {
                title: 'Specialized Placement',
                desc: "For tight or hard-to-reach sites where standard tilt-bed equipment cannot maneuver, we may coordinate a specialized carrier and confirm the available placement approach before dispatch.",
                tag: 'Tight-Site Review',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                ),
              },
            ].map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border hover:border-primary/30 rounded-xl p-6 flex flex-col gap-4 transition-all hover:-translate-y-0.5 duration-200 shadow-sm"
              >
                <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                  {m.icon}
                </div>
                <div>
                  <p className="font-bold text-base mb-2">{m.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                </div>
                <span className="self-start text-[10px] font-bold text-primary tracking-widest uppercase bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                  {m.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CLEARANCE TABLE */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-bold text-primary tracking-[0.12em] uppercase mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-primary inline-block" /> Space Requirements
          </p>
          <h2 className="text-3xl font-black tracking-tight mb-2">Required <span className="text-primary">Delivery Clearances</span></h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">Use these planning dimensions when preparing your site. Final clearance needs depend on carrier equipment, route, slope, and the planned placement method.</p>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Minimum Clearance by Container Size
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {['Size', 'Length Needed', 'Width Needed', 'Height Clearance'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { size: '20ft Unit', length: '70 ft', width: '12 ft', height: '13 ft' },
                  { size: '40ft Unit', length: '110 ft', width: '12 ft', height: '14 ft' },
                ].map((row, i) => (
                  <tr key={row.size} className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors`}>
                    <td className="px-6 py-4 font-bold text-primary font-mono text-sm">{row.size}</td>
                    <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{row.length}</td>
                    <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{row.width}</td>
                    <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{row.height}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* PLACEMENT */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-bold text-primary tracking-[0.12em] uppercase mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-primary inline-block" /> Placement Guide
          </p>
          <h2 className="text-3xl font-black tracking-tight mb-3">Getting the <span className="text-primary">Foundation Right</span></h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed mb-8">
            <p>Shipping containers can be placed on solid, level ground. A level placement area supports normal door operation and helps reduce strain on the container structure over time.</p>
            <p>If positioned on a slight incline or decline, the cargo doors may become difficult to operate and re-leveling will be required. For customers who wish to elevate their container to prevent water pooling near the front cargo doors, leveling materials are available at any local hardware store.</p>
            <p>Ask us to include any leveling or placement concerns when your delivery is being planned. Drivers do not supply leveling materials, and final placement remains subject to the carrier’s safety assessment.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPS.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border hover:border-primary/25 rounded-xl p-4 flex items-start gap-3 transition-colors shadow-sm"
              >
                <div className="w-9 h-9 flex-shrink-0 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                  {tip.icon}
                </div>
                <div>
                  <p className="font-bold text-sm mb-1">{tip.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* GALLERY */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-bold text-primary tracking-[0.12em] uppercase mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-primary inline-block" /> Delivery in Action
          </p>
          <h2 className="text-3xl font-black tracking-tight mb-2">Delivery <span className="text-primary">Gallery</span></h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">Examples of the equipment, placement, and site preparation involved in container delivery.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-border bg-muted group shadow-sm"
                style={{ aspectRatio: '16 / 9' }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <div id="contact" className="relative bg-card border border-border rounded-xl p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-2xl font-black tracking-tight mb-1">Ready to Schedule Your Delivery?</h3>
            <p className="text-muted-foreground text-sm mb-5">Request a quote online or email our team for delivery help.</p>
            <Link to="/contact?source=Delivery%20page%20quote%20request">
              <Button className="ce-signature-button font-bold rounded-lg h-11 px-6">
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <section id="faq">
          <p className="text-[10px] font-bold text-primary tracking-[0.12em] uppercase mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-primary inline-block" /> FAQ
          </p>
          <h2 className="text-3xl font-black tracking-tight mb-2">Delivery <span className="text-primary">Questions</span></h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">Everything you need to know before your container arrives.</p>
          <div className="flex flex-col gap-2">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} faq={faq} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
