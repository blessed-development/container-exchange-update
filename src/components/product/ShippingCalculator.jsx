import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, Info, ShoppingCart } from 'lucide-react';
import { isValidZipCode, calculateDeliveryFee } from '@/lib/zipUtils';
import { motion, AnimatePresence } from 'framer-motion';

// Prices per size: [usedPrice, newPrice]
const SIZE_PRICES = {
  "20' Standard": { used: 1350, new: 2500 },
  "40' Standard": { used: 1750, new: 3350 },
  "40' High Cube": { used: 1950, new: 3350 },
};

const CONDITION_OPTIONS = [
  {
    key: 'used',
    label: 'Used',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&q=80',
  },
  {
    key: 'new',
    label: 'New',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&q=80',
  },
];

const GRADE_OPTIONS = [
  { key: 'AS_IS',  label: 'AS IS',              adjust: -100 },
  { key: 'WWT',   label: 'Wind & Water Tight',  adjust: 200  },
  { key: 'CW',    label: 'Cargo Worthy (CW)',   adjust: 400  },
  { key: 'IICL',  label: 'IICL',               adjust: 0    },
];

export default function ShippingCalculator({ container, initialZip = '', selectedSizeName }) {
  const [zip, setZip] = useState(initialZip);
  const [zipOpen, setZipOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [condition, setCondition] = useState('new');
  const [grade, setGrade] = useState('IICL');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (initialZip && isValidZipCode(initialZip)) {
      runCalculate(initialZip);
    }
  }, [initialZip]);

  const runCalculate = (zipCode) => {
    if (!isValidZipCode(zipCode)) return;
    setIsCalculating(true);
    setTimeout(() => {
      const info = calculateDeliveryFee(zipCode, container?.size || '20');
      setDeliveryInfo(info);
      setIsCalculating(false);
      setZipOpen(false);
    }, 600);
  };

  const handleZipSubmit = (e) => {
    e.preventDefault();
    runCalculate(zip);
  };

  const sizePrices = SIZE_PRICES[selectedSizeName] || { used: container?.base_price ?? 0, new: container?.base_price ?? 0 };
  const gradeAdjust = GRADE_OPTIONS.find(g => g.key === grade)?.adjust ?? 0;
  const basePrice = condition === 'new' ? sizePrices.new : sizePrices.used;
  const containerPrice = basePrice + gradeAdjust;
  const totalPrice = containerPrice * qty;

  const locationLabel = deliveryInfo
    ? deliveryInfo.city
    : (zip && isValidZipCode(zip) ? zip : 'Enter ZIP to calculate');

  return (
    <div className="flex flex-col gap-2.5">

      {/* ZIP BAR */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <button
          onClick={() => setZipOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Delivering to</span>
            <span className="text-sm font-semibold text-foreground font-mono">{locationLabel}</span>
          </div>
          <span className="text-xs font-bold text-primary tracking-wide">
            {zipOpen ? 'Close' : 'Change'}
          </span>
        </button>
        <AnimatePresence initial={false}>
          {zipOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border"
            >
              <form onSubmit={handleZipSubmit} className="flex gap-2 p-3">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="Enter ZIP code"
                  className="flex-1 font-mono h-10 text-sm"
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 h-10 px-5 text-xs font-bold tracking-widest">
                  {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'APPLY'}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PRICE HERO */}
      <div className="border border-border rounded-xl bg-card px-5 py-4 flex items-center justify-between">
        <span className="font-mono text-[32px] font-bold text-primary leading-none tracking-tight">
          ${containerPrice.toLocaleString()}<span className="text-lg">.00</span>
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5">
          Buy Now
        </span>
      </div>

      {/* CONDITION */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Condition</span>
          <span className="text-xs font-semibold text-foreground/60">
            {CONDITION_OPTIONS.find(c => c.key === condition)?.label} {selectedSizeName}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 p-3">
          {CONDITION_OPTIONS.map((opt) => {
            const price = opt.key === 'new' ? sizePrices.new : sizePrices.used;
            return (
              <button
                key={opt.key}
                onClick={() => setCondition(opt.key)}
                className={`flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all text-left ${
                  condition === opt.key
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border bg-muted/30 hover:border-muted-foreground/30'
                }`}
              >
                <img
                  src={opt.image}
                  alt={opt.label}
                  className="w-14 h-11 object-cover rounded-md flex-shrink-0 bg-muted"
                />
                <div>
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    {opt.label} {selectedSizeName}
                  </p>
                  <p className="text-[15px] font-bold font-mono text-foreground mt-0.5 leading-none">
                    ${(price + gradeAdjust).toLocaleString()}<span className="text-xs">.00</span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* GRADE */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Grade</span>
          <span className="text-xs font-semibold text-foreground/60">
            {GRADE_OPTIONS.find(g => g.key === grade)?.label}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 p-3">
          {GRADE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setGrade(opt.key)}
              className={`py-2.5 px-1.5 rounded-lg border-2 text-center transition-all ${
                grade === opt.key
                  ? 'border-green-500 bg-green-500/10 text-foreground'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
              }`}
            >
              <span className="text-[10px] font-bold leading-tight block">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SELECTION TYPE */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Selection Type</span>
        </div>
        <div className="p-3">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-green-500 bg-green-500/10 transition-all">
            <span className="text-base leading-none">✅</span>
            <span className="text-sm font-semibold text-foreground">First off the Stack (FO)</span>
          </button>
        </div>
      </div>

      {/* CHECKOUT */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Sales tax calculated at checkout</span>
          </div>

          <hr className="border-border" />

          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Total</span>
            <span className="font-mono text-[26px] font-bold text-primary leading-none tracking-tight">
              ${totalPrice.toLocaleString()}<span className="text-base">.00</span>
            </span>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-2">
            {/* Quantity */}
            <div className="flex items-stretch border border-border rounded-lg overflow-hidden bg-muted/30 h-11">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 flex items-center justify-center text-xl font-light text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
              >
                −
              </button>
              <span className="flex-1 flex items-center justify-center font-mono text-sm font-semibold text-foreground">
                {qty}
              </span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-9 flex items-center justify-center text-xl font-light text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <Button className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm tracking-wide gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}