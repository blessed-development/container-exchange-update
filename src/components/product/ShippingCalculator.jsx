import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, Building2, Loader2, ShoppingCart, Phone, ChevronDown } from 'lucide-react';
import { isValidZipCode, calculateDeliveryFee } from '@/lib/zipUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SIZE_OPTIONS } from './SizeSelector';

const GRADE_OPTIONS = [
  { key: 'AS_IS', label: 'AS IS',               adjust: -100 },
  { key: 'WWT',   label: 'Wind & Water Tight',   adjust:  200 },
  { key: 'CW',    label: 'Cargo Worthy (CW)',     adjust:  400 },
  { key: 'IICL',  label: 'IICL',                 adjust:    0 },
];

const CONDITION_IMAGES = {
  used: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&q=80',
  new:  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=300&q=80',
};

export default function ShippingCalculator({
  container,
  initialZip = '',
  selectedSizeIndex,
  onSizeChange,
  condition,
  onConditionChange,
}) {
  const [zip, setZip] = useState(initialZip);
  const [zipOpen, setZipOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [grade, setGrade] = useState('IICL');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (initialZip && isValidZipCode(initialZip)) runCalculate(initialZip);
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

  const handleZipSubmit = (e) => { e.preventDefault(); runCalculate(zip); };

  const sizeOption   = SIZE_OPTIONS[selectedSizeIndex];
  const gradeAdjust  = GRADE_OPTIONS.find(g => g.key === grade)?.adjust ?? 0;
  const basePrice    = (condition === 'new' ? sizeOption.newPrice : sizeOption.usedPrice) + gradeAdjust;
  const deliveryFee  = deliveryMethod === 'delivery' ? (deliveryInfo?.fee || 0) : 0;
  const totalPrice   = (basePrice + deliveryFee) * qty;

  const locationLabel = deliveryInfo
    ? deliveryInfo.city
    : (zip && isValidZipCode(zip) ? zip : 'Enter ZIP to calculate');

  return (
    <div className="flex flex-col gap-2.5">

      {/* ── SIZE TABS ── */}
      <div className="grid grid-cols-3 border border-border rounded-2xl overflow-hidden bg-card">
        {SIZE_OPTIONS.map((opt, i) => {
          const active = selectedSizeIndex === i;
          return (
            <button
              key={i}
              onClick={() => onSizeChange(i)}
              className={`flex flex-col items-center gap-0.5 py-4 px-2 border-r border-border last:border-r-0 transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              }`}
            >
              <span className={`text-[9px] font-bold tracking-widest uppercase ${active ? 'text-white/70' : 'text-muted-foreground/60'}`}>
                BUY
              </span>
              <span className="text-[13px] font-bold leading-tight">{opt.label}</span>
              <span className={`font-mono text-[9px] ${active ? 'text-white/75' : 'text-muted-foreground/55'}`}>
                {opt.dims}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── ZIP BAR ── */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden">
        <button
          onClick={() => setZipOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-sm">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">Delivering to</span>
            <span className="font-semibold text-foreground">{locationLabel}</span>
          </div>
          <span className="text-xs font-bold text-primary flex items-center gap-1">
            Change
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${zipOpen ? 'rotate-180' : ''}`} />
          </span>
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
              <form onSubmit={handleZipSubmit} className="flex gap-2 p-3">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="Enter ZIP code"
                  className="flex-1 h-10 text-sm"
                  autoFocus
                />
                <Button type="submit" size="sm" className="h-10 px-5 bg-primary hover:bg-primary/90 font-semibold">
                  {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PRICE HERO ── */}
      <div className="border border-border rounded-2xl bg-card px-5 py-4 flex items-center justify-between">
        <span className="font-mono text-4xl font-bold text-primary tracking-tight">
          ${basePrice.toLocaleString()}.00
        </span>
        <span className="text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-full px-5 py-2">
          BUY NOW
        </span>
      </div>

      {/* ── CONDITION ── */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-foreground">CONDITION</span>
          <span className="text-sm font-semibold text-foreground">
            {condition === 'new' ? 'New' : 'Used'} {sizeOption.label}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 p-3">
          {['used', 'new'].map((cond) => {
            const active = condition === cond;
            const price = cond === 'new' ? sizeOption.newPrice : sizeOption.usedPrice;
            return (
              <button
                key={cond}
                onClick={() => onConditionChange(cond)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  active
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border hover:border-border/80 bg-muted/20'
                }`}
              >
                <img
                  src={CONDITION_IMAGES[cond]}
                  alt={cond}
                  className="w-[68px] h-[52px] object-cover rounded-lg flex-shrink-0 bg-muted"
                />
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight">
                    {cond === 'new' ? 'New' : 'Used'} {sizeOption.label}
                  </p>
                  <p className="text-sm font-bold font-mono text-foreground mt-1">
                    ${price.toLocaleString()}.00
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GRADE ── */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-foreground">GRADE</span>
          <span className="text-sm font-semibold text-foreground">
            {GRADE_OPTIONS.find(g => g.key === grade)?.label}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 p-3">
          {GRADE_OPTIONS.map((opt) => {
            const active = grade === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setGrade(opt.key)}
                className={`py-3 px-1 rounded-xl border-2 text-center transition-all ${
                  active
                    ? 'border-green-500 bg-green-500/10 text-foreground'
                    : 'border-border bg-muted/20 text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                <span className="text-[10px] font-bold leading-tight block">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SELECTION TYPE ── */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-foreground">SELECTION TYPE</span>
        </div>
        <div className="p-3">
          <button className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 border-green-500 bg-green-500/10 text-sm font-bold text-foreground">
            <span className="w-6 h-6 rounded flex items-center justify-center bg-green-500 text-white text-xs flex-shrink-0">✓</span>
            First off the Stack (FO)
          </button>
        </div>
      </div>

      {/* ── DELIVERY METHOD ── */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-foreground">DELIVERY METHOD</span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          {[
            { key: 'delivery', label: 'Home Delivery', Icon: Truck },
            { key: 'pickup',   label: 'Self Pickup',   Icon: Building2 },
          ].map(({ key, label, Icon }) => {
            const active = deliveryMethod === key;
            return (
              <button
                key={key}
                onClick={() => setDeliveryMethod(key)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-[13px] font-semibold transition-all ${
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/20 text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CHECKOUT ── */}
      <div className="border border-border rounded-2xl bg-card overflow-hidden">
        <div className="p-5 flex flex-col gap-4">
          {/* Price breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{sizeOption.label} · {condition === 'new' ? 'New' : 'Used'}</span>
              <span className="font-mono font-semibold">${(basePrice - gradeAdjust).toLocaleString()}</span>
            </div>
            {gradeAdjust !== 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grade adjustment</span>
                <span className="font-mono font-semibold">{gradeAdjust > 0 ? '+' : ''}${gradeAdjust.toLocaleString()}</span>
              </div>
            )}
            {deliveryInfo && deliveryMethod === 'delivery' && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery · {deliveryInfo.city}</span>
                <span className="font-mono font-semibold">${deliveryFee.toLocaleString()}</span>
              </div>
            )}
            {deliveryMethod === 'pickup' && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Self pickup</span>
                <span className="font-mono font-semibold text-green-600">Free</span>
              </div>
            )}
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-0.5">Total</p>
              <p className="text-[10px] text-muted-foreground/70">Tax calculated at checkout</p>
            </div>
            <span className="font-mono text-3xl font-bold text-primary tracking-tight">
              ${totalPrice.toLocaleString()}
            </span>
          </div>

          {/* Qty + CTA */}
          <div className="grid grid-cols-[96px_1fr] gap-2">
            <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted/30 h-12">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-full flex items-center justify-center text-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
              >−</button>
              <span className="flex-1 text-center font-mono text-sm font-semibold select-none">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-10 h-full flex items-center justify-center text-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
              >+</button>
            </div>
            <Button className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md shadow-primary/20 gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          </div>

          <Link to="/contact">
            <Button variant="outline" className="w-full h-11 rounded-xl font-semibold text-sm hover:border-primary hover:text-primary transition-all">
              Request a Quote
            </Button>
          </Link>
        </div>
      </div>

      {/* ── CALL STRIP ── */}
      <div className="flex items-center gap-3.5 px-1 py-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Phone className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground leading-none mb-1.5">Questions? We're here to help</p>
          <a href="tel:+18889779085" className="text-[13px] font-bold text-foreground hover:text-primary transition-colors">
            (888) 977-9085
          </a>
        </div>
      </div>

    </div>
  );
}