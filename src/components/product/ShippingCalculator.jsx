import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, Info, ShoppingCart, Phone } from 'lucide-react';
import { isValidZipCode, calculateDeliveryFee } from '@/lib/zipUtils';
import { motion, AnimatePresence } from 'framer-motion';

// Size tab data with new/used pricing
const SIZE_TABS = [
  {
    label: "20' Standard",
    dims: "20' × 8' × 8'6\"",
    newPrice: 2500,
    usedPrice: 1350,
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=80',
  },
  {
    label: "40' Standard",
    dims: "40' × 8' × 8'6\"",
    newPrice: 3350,
    usedPrice: 1750,
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80',
  },
  {
    label: "40' High Cube",
    dims: "40' × 8' × 9'6\"",
    newPrice: 3350,
    usedPrice: 1950,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80',
  },
];

const GRADE_OPTIONS = [
  { key: 'AS_IS', label: 'AS IS', adjust: -100 },
  { key: 'WWT', label: 'Wind & Water Tight', adjust: 200 },
  { key: 'CW', label: 'Cargo Worthy', adjust: 400 },
  { key: 'IICL', label: 'IICL', adjust: 0 },
];

export default function ShippingCalculator({ container, initialZip = '', onSizeChange }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [condition, setCondition] = useState('new');
  const [grade, setGrade] = useState('IICL');
  const [qty, setQty] = useState(1);
  const [zip, setZip] = useState(initialZip);
  const [zipOpen, setZipOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (initialZip && isValidZipCode(initialZip)) runCalculate(initialZip);
  }, [initialZip]);

  // Notify parent of size/image change
  useEffect(() => {
    if (onSizeChange) onSizeChange(SIZE_TABS[selectedTab]);
  }, [selectedTab]);

  const runCalculate = (zipCode) => {
    if (!isValidZipCode(zipCode)) return;
    setIsCalculating(true);
    setTimeout(() => {
      const info = calculateDeliveryFee(zipCode, container?.size || '20');
      setDeliveryInfo(info);
      setIsCalculating(false);
      setZipOpen(false);
    }, 500);
  };

  const currentTab = SIZE_TABS[selectedTab];
  const gradeAdjust = GRADE_OPTIONS.find(g => g.key === grade)?.adjust ?? 0;
  const basePrice = condition === 'new' ? currentTab.newPrice : currentTab.usedPrice;
  const containerPrice = basePrice + gradeAdjust;
  const totalPrice = containerPrice * qty;

  const locationLabel = deliveryInfo
    ? deliveryInfo.city
    : (zip && isValidZipCode(zip) ? zip : 'Enter ZIP to calculate');

  return (
    <div className="flex flex-col gap-3">

      {/* SIZE TABS */}
      <div className="grid grid-cols-3 border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
        {SIZE_TABS.map((tab, i) => {
          const isActive = selectedTab === i;
          return (
            <button
              key={i}
              onClick={() => setSelectedTab(i)}
              className={`relative flex flex-col items-center gap-0.5 py-3.5 px-2 transition-all duration-200 border-r border-border last:border-r-0 ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <span className={`text-[8px] font-bold tracking-widest uppercase ${isActive ? 'text-white/60' : 'opacity-50'}`}>
                BUY
              </span>
              <span className="text-[12px] font-bold leading-tight">{tab.label}</span>
              <span className={`font-mono text-[9px] ${isActive ? 'text-white/70' : 'opacity-50'}`}>
                {tab.dims}
              </span>
            </button>
          );
        })}
      </div>

      {/* ZIP BAR */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <button
          onClick={() => setZipOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">Delivering to</span>
            <span className="font-mono text-foreground font-semibold">{locationLabel}</span>
          </div>
          <span className="text-xs font-bold text-primary">{zipOpen ? 'Close ↑' : 'Change ↓'}</span>
        </button>
        <AnimatePresence initial={false}>
          {zipOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden border-t border-border"
            >
              <form
                onSubmit={(e) => { e.preventDefault(); runCalculate(zip); }}
                className="flex gap-2 p-3"
              >
                <Input
                  type="text"
                  inputMode="numeric"
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="Enter ZIP code"
                  className="flex-1 font-mono h-10 text-sm"
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 h-10 px-4 text-xs font-bold">
                  {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'APPLY'}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PRICE HERO */}
      <motion.div
        key={`${selectedTab}-${condition}-${grade}`}
        initial={{ opacity: 0.6, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="border border-border rounded-2xl bg-card px-5 py-4 flex items-center justify-between shadow-sm"
      >
        <span className="font-mono text-3xl font-bold text-primary tracking-tight">
          ${containerPrice.toLocaleString()}.00
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5">
          Buy Now
        </span>
      </motion.div>

      {/* CONDITION */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Condition</span>
          <span className="text-xs font-semibold text-foreground/60">
            {condition === 'new' ? 'New' : 'Used'} {currentTab.label}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 p-3">
          {[
            { key: 'used', label: 'Used', price: currentTab.usedPrice, img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&q=80' },
            { key: 'new', label: 'New', price: currentTab.newPrice, img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&q=80' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setCondition(opt.key)}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition-all text-left ${
                condition === opt.key
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-border bg-muted/20 hover:border-muted-foreground/30'
              }`}
            >
              <img src={opt.img} alt={opt.label} className="w-12 h-10 object-cover rounded-lg flex-shrink-0 bg-muted" />
              <div>
                <p className="text-[11px] font-bold text-foreground leading-tight">{opt.label} {currentTab.label}</p>
                <p className="text-sm font-bold font-mono text-foreground mt-0.5">${(opt.price + gradeAdjust).toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* GRADE */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Grade</span>
          <span className="text-xs font-semibold text-foreground/60">{GRADE_OPTIONS.find(g => g.key === grade)?.label}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 p-3">
          {GRADE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setGrade(opt.key)}
              className={`py-2.5 px-1 rounded-xl border-2 text-center transition-all ${
                grade === opt.key
                  ? 'border-green-500 bg-green-500/10 text-foreground'
                  : 'border-border bg-muted/20 text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground'
              }`}
            >
              <span className="text-[9px] font-bold leading-snug block">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SELECTION TYPE */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Selection Type</span>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-green-500 bg-green-500/10">
            <span>✅</span>
            <span className="text-sm font-semibold text-foreground">First off the Stack (FO)</span>
          </div>
        </div>
      </div>

      {/* CHECKOUT */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            Sales tax calculated at checkout
          </div>
          <hr className="border-border" />

          {deliveryInfo && (
            <div className="space-y-1.5 text-sm pb-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Container</span>
                <span className="font-mono font-semibold">${containerPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery to {deliveryInfo.city}</span>
                <span className="font-mono font-semibold">${deliveryInfo.fee?.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</span>
            <motion.span
              key={totalPrice}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="font-mono text-2xl font-bold text-primary tracking-tight"
            >
              ${totalPrice.toLocaleString()}.00
            </motion.span>
          </div>

          <div className="grid grid-cols-[88px_1fr] gap-2">
            <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted/30 h-11">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-full flex items-center justify-center text-xl text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
              >−</button>
              <span className="flex-1 text-center font-mono text-sm font-semibold text-foreground">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-9 h-full flex items-center justify-center text-xl text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
              >+</button>
            </div>
            <Button className="h-11 bg-primary hover:bg-primary/90 text-white font-bold tracking-wide gap-2 text-sm">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          </div>

          <a href="tel:+18889779085" className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border-2 border-green-500 bg-green-500/10 text-green-600 font-bold text-sm hover:bg-green-500/20 transition-colors">
            <Phone className="w-4 h-4" />
            Call (888) 977-9085
          </a>
        </div>
      </div>

    </div>
  );
}