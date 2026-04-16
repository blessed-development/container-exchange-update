import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Phone, Users, MapPin, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '20+', label: 'Years in Business', sub: 'Since 2002' },
  { value: '60+', label: 'Depot Locations', sub: 'Coast to coast' },
  { value: '10K+', label: 'Containers Sold', sub: 'Happy customers' },
  { value: '75+', label: 'Years Combined Experience', sub: 'Expert team' },
];

const VALUES = [
  { icon: Award, title: 'Quality Guaranteed', desc: 'Every container is inspected and graded before sale. We stand behind every unit with a satisfaction guarantee.' },
  { icon: Users, title: 'Customer First', desc: 'Clear communication, expert guidance, and fast response times from first call to final delivery.' },
  { icon: MapPin, title: 'Nationwide Coverage', desc: '60+ depot locations across the USA and Canada mean we always have inventory near you.' },
  { icon: Clock, title: 'Fast Delivery', desc: '3–7 business days from order to delivery. We keep our promises and update you every step of the way.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-accent text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/[0.05] blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">OUR STORY</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-5">
            About <span className="text-primary">Containers Exchange</span>
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
            Since 2002, we've been connecting businesses and property owners with quality shipping containers backed by nationwide logistics and expert guidance.
          </p>
        </div>
      </div>

      {/* Main Story */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">WHO WE ARE</span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight mb-6">
                Quality and Expertise <span className="text-primary">You Can Trust</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Since 2002, Containers Exchange has helped businesses and property owners across the United States and Canada find the right shipping container for their specific needs.
                </p>
                <p>
                  If you need secure, weather-resistant storage for a construction site, farm, retail location, or residential property, we provide both new (one-trip) and used containers that protect your equipment, inventory, and materials from theft and harsh weather conditions.
                </p>
                <p>
                  With over 75 years of combined industry experience, our team guides you through every step — from choosing the right size (20ft, 40ft, high cube, and more) to arranging fast, dependable delivery from one of our 60+ nationwide depot locations.
                </p>
                <p>
                  You can buy or rent with confidence knowing the process is simple, secure, and stress-free, with clear communication, quick turnaround times, and expert support to ensure you get the right container for your use case.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="tel:+18005551234">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-12 px-7 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all">
                    <Phone className="w-4 h-4 mr-2" /> Call for Best Pricing
                  </Button>
                </a>
                <Link to="/inventory">
                  <Button variant="outline" className="rounded-xl h-12 px-7 hover:-translate-y-0.5 transition-all">
                    Browse Inventory
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-5">
                <img
                  src="https://media.base44.com/images/public/69dd889386a20317a3b688c3/3ef30518d_generated_9c5f1d0a.png"
                  alt="Container terminal"
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/60 to-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="text-center p-5 border border-border rounded-2xl bg-card hover:border-primary/30 hover:-translate-y-0.5 transition-all"
                  >
                    <p className="text-3xl font-black text-primary font-mono">{stat.value}</p>
                    <p className="text-xs font-semibold text-foreground mt-1">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">{stat.sub}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">OUR VALUES</span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Why Customers Choose <span className="text-primary">Us</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-base mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-mono text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full mb-5">WHAT WE OFFER</span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Three Ways to <span className="text-primary">Get a Container</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Buy a Container',
                desc: 'Own it outright. Perfect for long-term use. Huge selection of new and used containers in multiple sizes and grades.',
                bullets: ['Money back guarantee', 'New & used selection', 'Nationwide depot network', 'Transparent pricing'],
                cta: 'Buy Now', link: '/inventory',
              },
              {
                title: 'Rent a Container',
                desc: 'Flexible monthly rentals with same-week delivery. Perfect for temporary storage or project-based needs.',
                bullets: ['1 month free rent', 'Flexible rental terms', 'Same week delivery', 'Easy pickup when done'],
                cta: 'Inquire About Rental', link: '/contact',
              },
              {
                title: 'Rent-to-Own',
                desc: 'Start with low payments and own it outright. No credit check required — everyone qualifies.',
                bullets: ['$1 first month special', 'Everyone qualifies', 'No credit check', 'Early payoff discounts'],
                cta: 'Inquire About RTO', link: '/contact',
              },
            ].map((option, i) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-7 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <h3 className="text-xl font-black mb-3">{option.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{option.desc}</p>
                <ul className="space-y-2 mb-6">
                  {option.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link to={option.link}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-11">
                    {option.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/[0.03] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Get Started?</h2>
          <p className="text-white/50 text-lg mb-8">Call us today for the best pricing and fast delivery to your location.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18005551234">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-13 px-10 text-base shadow-lg shadow-primary/25">
                <Phone className="w-5 h-5 mr-2" /> (800) 555-1234
              </Button>
            </a>
            <Link to="/contact">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl h-13 px-10 text-base">
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}