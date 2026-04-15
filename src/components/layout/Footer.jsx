import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

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
    <footer className="bg-accent text-white">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
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

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold tracking-widest text-white/30 mb-6">NAVIGATE</h4>
            <ul className="space-y-3">
              {[
                { label: 'Buy Containers', path: '/inventory' },
                { label: 'How It Works', path: '/#how-it-works' },
                { label: 'Get a Quote', path: '/contact' },
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

          {/* Container Types */}
          <div>
            <h4 className="text-xs font-mono font-semibold tracking-widest text-white/30 mb-6">CONTAINERS</h4>
            <ul className="space-y-3">
              {['20ft Standard', '40ft Standard', '40ft High Cube', '10ft Mini', 'New One-Trip', 'Used WWT'].map((type) => (
                <li key={type}>
                  <Link to="/inventory" className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-mono font-semibold tracking-widest text-white/30 mb-6">CONTACT</h4>
            <div className="space-y-3">
              <a href="tel:+18005551234" className="flex items-center gap-3 text-white/50 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-mono text-sm">(800) 555-1234</span>
              </a>
              <a href="mailto:info@containersexchange.com" className="flex items-center gap-3 text-white/50 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">info@containersexchange.com</span>
              </a>
            </div>
            <div className="mt-6 p-4 border border-white/[0.08] rounded-xl bg-white/[0.03]">
              <p className="text-xs font-mono text-white/35 mb-2">OPERATING HOURS</p>
              <p className="text-sm text-white/65">Mon — Fri: 7AM — 6PM PST</p>
              <p className="text-sm text-white/65">Sat: 8AM — 2PM PST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs font-mono">
            © {new Date().getFullYear()} CONTAINERS EXCHANGE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="text-white/25 hover:text-white/50 text-xs transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="text-white/25 hover:text-white/50 text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}