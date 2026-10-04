import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  DoorOpen,
  Ruler,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageSeo from '@/components/seo/PageSeo';

const SIZES = [
  {
    name: '20ft Standard',
    exterior: "20' × 8' × 8'6\"",
    interior: "About 19'4\" × 7'8\" × 7'10\"",
    bestFor: 'Dense equipment, tools, job sites, and compact storage areas.',
  },
  {
    name: '40ft Standard',
    exterior: "40' × 8' × 8'6\"",
    interior: "About 39'5\" × 7'8\" × 7'10\"",
    bestFor: 'Larger inventory, equipment, and long-term business storage.',
  },
  {
    name: '40ft High Cube',
    exterior: "40' × 8' × 9'6\"",
    interior: "About 39'5\" × 7'8\" × 8'10\"",
    bestFor: 'Bulky items, taller shelving, and projects that benefit from extra height.',
  },
];

const GRADES = [
  ['New / One-Trip', 'A newer-looking container that has made one cargo journey. A good choice where appearance, condition, or future modification matters.'],
  ['IICL', 'A higher used-container condition commonly chosen where appearance and shipping suitability matter.'],
  ['Cargo Worthy', 'A used container suitable for cargo transport when it holds the applicable current certification.'],
  ['Wind & Water Tight', 'A practical storage choice designed to keep normal weather out; it is not automatically certified for ocean transport.'],
  ['AS-IS', 'A lower-cost option that may show more wear or need repair. Confirm the individual unit’s condition before purchase.'],
];

const PREP = [
  'Your ZIP or postal code and preferred container size.',
  'What you plan to store, including the tallest and widest item.',
  'A delivery path clear of low wires, trees, parked vehicles, gates, and buildings.',
  'A stable, reasonably level placement area that supports the container at its corners.',
];

function SectionLabel({ children }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.16em] text-primary">
      <span className="h-px w-5 bg-primary" />
      {children}
    </p>
  );
}

export default function BuyersGuide() {
  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Shipping Container Buyer’s Guide | Sizes, Conditions & Delivery"
        description="Understand shipping container sizes, conditions, grades, door clearances, and delivery preparation before requesting a quote."
        path="/buyers-guide"
        image="/images/recent-deliveries/denver-co-new-40ft-one-trip.webp"
      />

      <header className="relative overflow-hidden bg-[#061226] py-24 text-white sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-primary/[0.08] blur-[110px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <SectionLabel>CONTAINER BUYER’S GUIDE</SectionLabel>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            Choose the Right <span className="text-primary">Container</span> With Confidence
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            Compare the sizes and conditions that matter, plan for delivery, and request a quote with the details our team needs to help.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/inventory">
              <Button className="h-12 rounded-xl px-7 font-semibold">Browse Containers <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <a href="#delivery-prep">
              <Button variant="outline" className="h-12 rounded-xl border-white/20 bg-white/[0.03] px-7 text-white hover:bg-white/10 hover:text-white">Plan Delivery</Button>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionLabel>START WITH THE RIGHT SIZE</SectionLabel>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Size is more than the length on the side.</h2>
              <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
                Plan around the space you need inside, the actual door opening, and the room available for delivery. Measurements are planning figures; the exact unit quoted may vary slightly by manufacturer and condition.
              </p>
              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/[0.05] p-5 text-sm leading-relaxed text-muted-foreground">
                <DoorOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p><strong className="text-foreground">Measure the door opening, not only the interior.</strong> A tall item can fit inside on paper but still be too large to pass through the cargo doors.</p>
              </div>
            </motion.div>
            <motion.figure initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
              <img src="/images/recent-deliveries/denver-co-new-40ft-one-trip.webp" alt="New shipping container at a depot" loading="lazy" decoding="async" className="h-80 w-full object-cover sm:h-96" />
              <figcaption className="px-5 py-4 text-sm text-muted-foreground">Container photos are representative. Confirm the exact unit and condition in your quote.</figcaption>
            </motion.figure>
          </div>

          <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:px-6">
            {SIZES.map((size, index) => (
              <motion.article key={size.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
                <Ruler className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-lg font-black text-foreground">{size.name}</h3>
                <p className="mt-3 font-mono text-xs font-semibold text-primary">{size.exterior}</p>
                <p className="mt-2 text-xs text-muted-foreground">{size.interior}</p>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{size.bestFor}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/25 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <SectionLabel>CONDITIONS & GRADES</SectionLabel>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Match the condition to the job.</h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">Used containers naturally show signs of previous service. The right choice depends on whether you need storage, a cleaner appearance, transport certification, or the lowest initial cost.</p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {GRADES.map(([name, description], index) => (
                <motion.article key={name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-border bg-card p-6">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 font-black text-foreground">{name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </motion.article>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Condition language can vary by supplier and depot. We confirm the exact available unit, condition, delivery, and final quote details before purchase.</p>
          </div>
        </section>

        <section id="delivery-prep" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
              <div>
                <SectionLabel>DELIVERY PREPARATION</SectionLabel>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Make delivery straightforward.</h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">A container must fit the route to your site as well as the final placement area. Sharing access details early helps identify the appropriate delivery method.</p>
                <Link to="/delivery" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Read the delivery guide <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-center gap-3"><Truck className="h-5 w-5 text-primary" /><h3 className="font-black text-foreground">Before you request a quote</h3></div>
                <ul className="mt-6 space-y-4">
                  {PREP.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#07111f] py-20 text-white sm:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <ClipboardCheck className="mx-auto h-6 w-6 text-primary" />
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Ready to find the right container?</h2>
            <p className="mt-4 text-white/60">Start with your location, choose a size and condition, and we’ll help confirm the next steps.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/inventory"><Button className="h-12 rounded-xl px-7 font-semibold">Browse Inventory</Button></Link>
              <Link to="/contact?source=Buyer%27s%20Guide"><Button variant="outline" className="h-12 rounded-xl border-white/20 bg-white/[0.03] px-7 text-white hover:bg-white/10 hover:text-white">Request a Quote</Button></Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
