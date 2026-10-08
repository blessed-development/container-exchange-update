import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { COMPANY_CONTACT } from '@/config/companyContact';

const RECENT_DELIVERIES = [
  { size: "20ft Standard", city: "Denver, CO", mins: 4 },
  { size: "40ft High Cube", city: "Houston, TX", mins: 12 },
  { size: "20ft WWT", city: "Atlanta, GA", mins: 23 },
  { size: "40ft Standard", city: "Chicago, IL", mins: 31 },
  { size: "20ft New", city: "Los Angeles, CA", mins: 45 },
  { size: "40ft HC", city: "Miami, FL", mins: 58 },
  { size: "20ft CW", city: "Seattle, WA", mins: 67 },
  { size: "10ft Mini", city: "Phoenix, AZ", mins: 82 },
];

export default function Footer() {
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % RECENT_DELIVERIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const delivery = RECENT_DELIVERIES[tickerIndex];

  return (
    <footer className="bg-[#07111f] text-white">
      {/* Live Ticker */}
      <div className="border-b border-white/[0.06] py-3.5 overflow-hidden bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3">
          <span className="flex-shrink-0 bg-primary/20 text-primary text-xs font-mono font-bold px-3 py-1 rounded-full tracking-wider">
            LIVE
          </span>
          <div className="flex items-center gap-2 text-white/50 text-sm font-mono">
            <span className="text-white/80 font-semibold">{delivery.size}</span>
            <span className="text-white/25">·</span>
            <span>Delivered to {delivery.city}</span>
            <span className="text-white/25">·</span>
            <span className="text-primary font-semibold">{delivery.mins} mins ago</span>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.2fr_.8fr_.85fr_1.05fr_.95fr] xl:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-primary-foreground font-mono font-black text-sm">CX</span>
              </div>
              <div>
                <span className="font-black text-lg tracking-tight">CONTAINERS</span>
                <span className="text-primary font-black text-lg tracking-tight ml-1.5">EXCHANGE</span>
              </div>
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              Your trusted marketplace for buying shipping containers. Nationwide delivery from 60+ depot locations.
            </p>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>Nationwide Coverage — USA</span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-mono font-semibold tracking-widest text-white/30 mb-6">SHOP</h4>
            <ul className="space-y-3">
              {[
                { label: 'Buy Containers', path: '/inventory' },
                { label: 'How It Works', path: '/buyers-guide' },
                { label: 'About Us', path: '/about' },
                { label: 'FAQ', path: '/faq' },
                { label: 'Get a Quote', path: '/contact' },
              ].map((link) => (
                <li key={`${link.label}-${link.path}`}>
                  <Link to={link.path} className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Container types */}
          <div>
            <h4 className="text-xs font-mono font-semibold tracking-widest text-white/30 mb-6">CONTAINER TYPES</h4>
            <ul className="space-y-3">
              {['20ft Standard', '40ft Standard', '40ft High Cube', 'New One-Trip'].map((type) => (
                <li key={type}>
                  <Link to="/inventory" className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer care */}
          <div>
            <h4 className="text-xs font-mono font-semibold tracking-widest text-white/30 mb-6">CUSTOMER CARE</h4>
            <ul className="space-y-3">
              {[
                { label: 'Delivery & Site Preparation', path: '/delivery' },
                { label: 'Condition Standards', path: '/customer-care/container-standards' },
                { label: 'Payments & Reservations', path: '/customer-care/payments-reservations' },
                { label: 'Returns & Cancellations', path: '/customer-care/returns-cancellations' },
                { label: 'Terms of Sale', path: '/customer-care/terms-of-sale' },
                { label: 'Privacy Policy', path: '/customer-care/privacy' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-mono font-semibold tracking-widest text-white/30 mb-6">CONTACT</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-white/50">
                <Phone className="mt-0.5 w-4 h-4 flex-shrink-0" />
                <a href={`tel:${COMPANY_CONTACT.businessPhoneHref}`} className="text-sm hover:text-white transition-colors">
                  {COMPANY_CONTACT.businessPhone}
                </a>
              </div>
              <div className="flex items-start gap-3 text-white/50">
                <Mail className="mt-0.5 w-4 h-4 flex-shrink-0" />
                <a href={`mailto:${COMPANY_CONTACT.email}`} className="break-words text-sm hover:text-white transition-colors">
                  {COMPANY_CONTACT.email}
                </a>
              </div>
              <Link to="/contact" className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-primary transition-colors hover:text-white">
                Get in touch <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Payment methods */}
      <div className="border-t border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-6 sm:px-6 lg:flex-row">
          <p className="text-center text-xs font-semibold tracking-wide text-white/45 lg:text-left">ACCEPTED PAYMENT METHODS</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5" aria-label="Accepted payment methods">
            <span className="rounded-md bg-[#0070ba] px-3 py-1.5 text-sm font-black italic tracking-tight text-white">PayPal</span>
            <span className="rounded-md bg-white px-2.5 py-1.5 text-sm font-black tracking-tight text-[#1434cb]">VISA</span>
            <span className="flex items-center gap-0.5 rounded-md bg-[#151515] px-2 py-1.5 text-[10px] font-bold text-white">
              <span className="h-4 w-4 rounded-full bg-[#eb001b]" /><span className="-ml-2 h-4 w-4 rounded-full bg-[#f79e1b] opacity-90" />
              <span className="ml-1">mastercard</span>
            </span>
            <span className="rounded-md bg-[#1677b9] px-2 py-1.5 text-[9px] font-black leading-none tracking-tight text-white">AMERICAN<br />EXPRESS</span>
            <span className="rounded-md bg-white px-2.5 py-1.5 text-xs font-black italic tracking-tight text-[#f76f1d]">DISCOVER</span>
            <span className="rounded-md border border-white/20 bg-white/[0.06] px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-white/80">ACH / BANK TRANSFER</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs font-mono">
            © {new Date().getFullYear()} CONTAINERS EXCHANGE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link to="/customer-care/privacy" className="text-white/25 hover:text-white/50 text-xs transition-colors">Privacy Policy</Link>
            <Link to="/customer-care/terms-of-sale" className="text-white/25 hover:text-white/50 text-xs transition-colors">Terms of Sale</Link>
            <Link to="/customer-care/returns-cancellations" className="text-white/25 hover:text-white/50 text-xs transition-colors">Returns & Cancellations</Link>
            <Link to="/customer-care/payments-reservations" className="text-white/25 hover:text-white/50 text-xs transition-colors">Payments & Reservations</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
