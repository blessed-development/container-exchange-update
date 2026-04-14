import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { label: 'Buy Containers', path: '/inventory' },
  { label: 'How It Works', path: '/#how-it-works' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-accent/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-mono font-bold text-sm">CX</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-lg tracking-tight">CONTAINERS</span>
              <span className="text-primary font-bold text-lg tracking-tight ml-1">EXCHANGE</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-white/70'
                }`}
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+18005551234" className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-mono text-sm">(800) 555-1234</span>
            </a>
            <Link to="/inventory">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wide text-sm">
                GET PRICING
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-accent border-t border-white/5">
          <div className="px-4 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-white/70 hover:text-primary font-medium text-sm tracking-wide py-2"
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
            <a href="tel:+18005551234" className="flex items-center gap-2 text-primary font-mono text-sm py-2">
              <Phone className="w-4 h-4" />
              (800) 555-1234
            </a>
            <Link to="/inventory" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                GET PRICING
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}