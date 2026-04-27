import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATS = [
  { val: '48hr',  label: 'Avg. Turnaround' },
  { val: '50+',   label: 'Cities Served' },
  { val: '100%',  label: 'Level Placement' },
  { val: 'F350',  label: 'Ford Tiltbed Fleet' },
];

const TIPS = [
  {
    title: 'Must Be 100% Level',
    desc: 'Ensures cargo doors operate properly and the container remains structurally sound long-term.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    title: 'Elevation Options',
    desc: 'Use cinder blocks, railroad ties, garden pavers, or concrete pillars to elevate and prevent water pooling.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    title: 'Available Locally',
    desc: 'All leveling materials can be found at any local hardware store before your scheduled delivery.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: 'Driver Assistance',
    desc: "Drivers will help position the container onto your leveling materials — just have them ready on site.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-500">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const GALLERY_IMAGES = [
  { src: 'https://starboxusa.com/wp-content/uploads/2023/07/TiltBedTrailer.jpg',          alt: 'Tiltbed Trailer', span2: true },
  { src: 'https://starboxusa.com/wp-content/uploads/2023/07/KlineTiltbed.jpg',            alt: 'Kline Tiltbed' },
  { src: 'https://starboxusa.com/wp-content/uploads/2023/07/IMG_29791.jpg',               alt: 'Container Delivery' },
  { src: 'https://starboxusa.com/wp-content/uploads/2023/07/IMG_20200111_174612_01.jpg',  alt: 'Container Delivery' },
  { src: 'https://starboxusa.com/wp-content/uploads/2023/07/IMG_20200111_174633_01.jpg',  alt: 'Container Delivery' },
  { src: 'https://starboxusa.com/wp-content/uploads/2023/07/MobileTrailerDelivery4.jpg',  alt: '20ft Wrecker' },
];

const FAQS = [
  { q: 'How long does delivery typically take after ordering?',      a: 'Most deliveries are completed within 24–48 hours of order confirmation, depending on your location and container availability. Our logistics team will contact you directly to confirm a delivery window.' },
  { q: 'What type of truck do you use for delivery?',                a: 'We use 40ft tiltbed trailers towed by Ford F350 trucks as our primary delivery method. For tight or confined spaces, we partner with specialized 20ft wrecker companies to ensure precise placement.' },
  { q: 'How much clearance does my property need?',                  a: 'For a 20ft unit: at least 70ft length × 12ft width × 13ft height. For a 40ft unit: 110ft length × 12ft width × 14ft height. These dimensions account for the full truck, trailer, and offloading process.' },
  { q: 'Does my container need a special foundation?',               a: 'No special foundation is required — containers can be placed directly on solid, level ground. If you want to prevent water pooling, we recommend elevating with cinder blocks, railroad ties, or concrete pillars available at your local hardware store.' },
  { q: 'Will the driver place the container exactly where I want it?', a: 'Yes. Our drivers work with you to position the container at your preferred location and will assist placing it on any leveling materials you have on site. Please note that drivers do not supply leveling materials.' },
  { q: 'Is wrecker / tight-space delivery more expensive?',          a: 'Yes. Wrecker and specialized 20ft delivery services typically cost more than standard tiltbed delivery due to the specialized equipment and precision required. A clear quote will always be provided before any delivery is confirmed.' },
  { q: "What if my container doors won't open after delivery?",      a: 'This is almost always caused by the container not being fully level. Re-leveling the container typically resolves the issue immediately. Contact our team and we\'ll guide you through the steps or arrange a service visit.' },
  { q: 'Do you deliver to both residential and commercial locations?', a: 'Absolutely. We deliver to homes, farms, construction sites, warehouses, and businesses. As long as the clearance requirements are met, we can deliver virtually anywhere within our service area.' },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-colors ${open ? 'border-green-500/40' : 'border-border'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-sm text-foreground leading-snug">{faq.q}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 ${open ? 'bg-green-500/10 border-green-500/40 rotate-45' : 'border-border'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`w-3 h-3 ${open ? 'text-green-500' : 'text-muted-foreground'}`}>
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
    <div className="min-h-screen bg-accent text-white">

      {/* HERO */}
      <section className="relative px-6 sm:px-12 pt-28 pb-16 overflow-hidden border-b border-white/[0.08]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-green-500/[0.05] blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-bold text-green-400 tracking-widest uppercase">Delivery Service</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-5">
            We Bring The<br /><span className="text-green-400">Steel To You.</span>
          </h1>
          <p className="text-white/60 text-base font-light leading-relaxed max-w-lg mb-8">
            Professional container delivery using tiltbed trailers and precision wrecker services — wherever you need it placed.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#contact">
              <Button className="bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg h-11 px-6 gap-2 shadow-lg shadow-green-500/20">
                <Phone className="w-4 h-4" />
                Contact Our Team
              </Button>
            </a>
            <a href="#faq">
              <Button variant="outline" className="border-white/20 text-white/70 hover:border-green-500 hover:text-green-400 bg-transparent rounded-lg h-11 px-6 gap-2">
                <HelpCircle className="w-4 h-4" />
                View FAQ
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/[0.08] bg-white/[0.03]">
        {STATS.map((s, i) => (
          <motion.div
            key={s.val}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="px-7 py-5 border-r border-white/[0.08] last:border-r-0 flex flex-col gap-1"
          >
            <span className="font-mono text-2xl font-semibold text-green-400 tracking-tight">{s.val}</span>
            <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-12 py-16 flex flex-col gap-16">

        {/* DELIVERY METHODS */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-bold text-green-400 tracking-[0.12em] uppercase mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-green-400 inline-block" /> How We Deliver
          </p>
          <h2 className="text-3xl font-black tracking-tight mb-2">Two Delivery <span className="text-green-400">Methods</span></h2>
          <p className="text-white/50 text-sm leading-relaxed mb-7">We use specialized equipment matched to your site — whether it's an open lot or a tight residential location.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: '40ft Tiltbed Trailer',
                desc: "Our primary delivery method. We deploy 40ft tiltbed trailers towed by Ford F350 trucks — ideal for open, accessible spaces. Fast, reliable, and our most cost-effective delivery option.",
                tag: 'Standard Delivery',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-400">
                    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                ),
              },
              {
                title: '20ft Wrecker Service',
                desc: "For tight, hard-to-reach spaces where a standard tiltbed can't maneuver. We partner with specialized 20ft wrecker companies to ensure precise placement in confined or residential locations.",
                tag: 'Precision Placement',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-400">
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
                className="bg-white/[0.04] border border-white/[0.08] hover:border-green-500/30 rounded-xl p-6 flex flex-col gap-4 transition-all hover:-translate-y-0.5 duration-200"
              >
                <div className="w-11 h-11 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center">
                  {m.icon}
                </div>
                <div>
                  <p className="font-bold text-base mb-2">{m.title}</p>
                  <p className="text-sm text-white/50 leading-relaxed">{m.desc}</p>
                </div>
                <span className="self-start text-[10px] font-bold text-green-400 tracking-widest uppercase bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                  {m.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CLEARANCE TABLE */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-bold text-green-400 tracking-[0.12em] uppercase mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-green-400 inline-block" /> Space Requirements
          </p>
          <h2 className="text-3xl font-black tracking-tight mb-2">Required <span className="text-green-400">Delivery Clearances</span></h2>
          <p className="text-white/50 text-sm leading-relaxed mb-7">Before your delivery date, ensure your site meets the minimum clearance dimensions for offloading.</p>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.08] text-[11px] font-bold text-white/40 uppercase tracking-widest">
              Minimum Clearance by Container Size
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.04] border-b border-white/[0.08]">
                  {['Size', 'Length Needed', 'Width Needed', 'Height Clearance'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold text-white/30 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { size: '20ft Unit', length: '70 ft', width: '12 ft', height: '13 ft' },
                  { size: '40ft Unit', length: '110 ft', width: '12 ft', height: '14 ft' },
                ].map((row, i) => (
                  <tr key={row.size} className={`border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03] transition-colors`}>
                    <td className="px-6 py-4 font-bold text-green-400 font-mono text-sm">{row.size}</td>
                    <td className="px-6 py-4 font-mono text-sm text-white/50">{row.length}</td>
                    <td className="px-6 py-4 font-mono text-sm text-white/50">{row.width}</td>
                    <td className="px-6 py-4 font-mono text-sm text-white/50">{row.height}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* PLACEMENT */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-bold text-green-400 tracking-[0.12em] uppercase mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-green-400 inline-block" /> Placement Guide
          </p>
          <h2 className="text-3xl font-black tracking-tight mb-3">Getting the <span className="text-green-400">Foundation Right</span></h2>
          <div className="space-y-3 text-sm text-white/50 leading-relaxed mb-8">
            <p>Shipping containers can be placed directly on solid, level ground. Ensuring your container is 100% level is critical — it guarantees smooth operation of the heavy-duty cargo doors and the long-term structural integrity of the unit.</p>
            <p>If positioned on a slight incline or decline, the cargo doors may become difficult to operate and re-leveling will be required. For customers who wish to elevate their container to prevent water pooling near the front cargo doors, leveling materials are available at any local hardware store.</p>
            <p>Our drivers will assist in placing the container on the leveling materials you provide — please note they do not carry these materials on their trucks.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPS.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/[0.04] border border-white/[0.08] hover:border-green-500/25 rounded-xl p-4 flex items-start gap-3 transition-colors"
              >
                <div className="w-9 h-9 flex-shrink-0 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center">
                  {tip.icon}
                </div>
                <div>
                  <p className="font-bold text-sm mb-1">{tip.title}</p>
                  <p className="text-xs text-white/45 leading-relaxed">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* GALLERY */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-bold text-green-400 tracking-[0.12em] uppercase mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-green-400 inline-block" /> Our Fleet in Action
          </p>
          <h2 className="text-3xl font-black tracking-tight mb-2">Delivery <span className="text-green-400">Gallery</span></h2>
          <p className="text-white/50 text-sm leading-relaxed mb-7">Real deliveries from our fleet — tiltbed and wrecker placements across residential, commercial, and industrial sites.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden border border-white/[0.08] group ${img.span2 ? 'col-span-2' : ''}`}
                style={{ aspectRatio: img.span2 ? '16/9' : '4/3' }}
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
        <div id="contact" className="relative bg-white/[0.04] border border-white/[0.08] rounded-xl p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-2xl font-black tracking-tight mb-1">Ready to Schedule Your Delivery?</h3>
            <p className="text-white/50 text-sm mb-5">Our logistics team is standing by — call now or request a quote online.</p>
            <Link to="/contact">
              <Button className="bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg h-11 px-6">
                Request a Quote
              </Button>
            </Link>
          </div>
          <a href="tel:7132580199" className="relative z-10 font-mono text-3xl font-semibold text-green-400 hover:opacity-70 transition-opacity whitespace-nowrap">
            (713) 258-0199
          </a>
        </div>

        {/* FAQ */}
        <section id="faq">
          <p className="text-[10px] font-bold text-green-400 tracking-[0.12em] uppercase mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-green-400 inline-block" /> FAQ
          </p>
          <h2 className="text-3xl font-black tracking-tight mb-2">Delivery <span className="text-green-400">Questions</span></h2>
          <p className="text-white/50 text-sm leading-relaxed mb-7">Everything you need to know before your container arrives.</p>
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