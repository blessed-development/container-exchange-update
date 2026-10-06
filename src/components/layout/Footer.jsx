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
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_.9fr_.9fr_1.1fr]">
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
            <div className="mt-6 border-t border-white/[0.08] pt-5">
              <p className="mb-3 text-xs font-mono font-semibold tracking-widest text-white/30">CONTACT</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/50">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href={`tel:${COMPANY_CONTACT.businessPhoneHref}`} className="text-sm hover:text-white transition-colors">
                    {COMPANY_CONTACT.businessPhone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-white/50">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href={`mailto:${COMPANY_CONTACT.email}`} className="text-sm hover:text-white transition-colors">
                    {COMPANY_CONTACT.email}
                  </a>
                </div>
              </div>
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
