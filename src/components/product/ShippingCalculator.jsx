import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, Building2, Loader2, Info, ShoppingCart } from 'lucide-react';
import { isValidZipCode, calculateDeliveryFee, getLocationFromZip } from '@/lib/zipUtils';
import { motion, AnimatePresence } from 'framer-motion';

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
  { key: 'AS_IS', label: 'AS IS', adjust: -100 },
  { key: 'WWT', label: 'Wind & Water Tight', adjust: 200 },
  { key: 'CW', label: 'Cargo Worthy (CW)', adjust: 400 },
  { key: 'IICL', label: 'IICL', adjust: 0 },
];

export default function ShippingCalculator({ container, initialZip = '', overridePrice, selectedSizeName }) {
  const [zip, setZip] = useState(initialZip);
  const [zipOpen, setZipOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
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

  const gradeAdjust = GRADE_OPTIONS.find(g => g.key === grade)?.adjust ?? 0;
  const basePrice = overridePrice ?? container?.base_price ?? 0;
  const containerPrice = basePrice + gradeAdjust;
  const deliveryFee = deliveryMethod === 'delivery' ? (deliveryInfo?.fee || 0) : 0;
  const totalPrice = (containerPrice + deliveryFee) * qty;

  const locationLabel = deliveryInfo
    ? `${deliveryInfo.city}`
    : (zip && isValidZipCode(zip) ? zip : 'Enter ZIP to calculate');

  return (
    <div className="flex flex-col gap-2.5">

      {/* ZIP BAR */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <button
          onClick={() => setZipOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Delivering to</span>
            <span className="font-mono text-foreground font-medium">{locationLabel}</span>
          </div>
          <span className="text-xs font-bold text-primary">
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
                  className="flex-1 font-mono h-10"
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
      <div className="border border-border rounded-xl bg-card px-5 py-4 flex items-center justify-between">
        <span className="font-mono text-3xl font-bold text-primary tracking-tight">
          ${containerPrice.toLocaleString()}.00
        </span>
        <span className="text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5">
          Buy Now
        </span>
      </div>

      {/* CONDITION */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Condition</span>
          <span className="text-xs font-semibold text-foreground/70">
            {CONDITION_OPTIONS.find(c => c.key === condition)?.label} {selectedSizeName}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 p-3">
          {CONDITION_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setCondition(opt.key)}
              className={`flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all text-left ${
                condition === opt.key
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-border bg-muted/30 hover:border-border/80'
              }`}
            >
              <img
                src={opt.image}
                alt={opt.label}
                className="w-14 h-11 object-cover rounded-md flex-shrink-0 bg-muted"
              />
              <div>
                <p className="text-xs font-bold text-foreground">{opt.label} {selectedSizeName}</p>
                <p className="text-sm font-bold font-mono text-foreground mt-0.5">
                  ${(basePrice + gradeAdjust).toLocaleString()}.00
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* GRADE */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Grade</span>
          <span className="text-xs font-semibold text-foreground/70">
            {GRADE_OPTIONS.find(g => g.key === grade)?.label}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 p-3">
          {GRADE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setGrade(opt.key)}
              className={`py-2.5 px-1 rounded-lg border-2 text-center transition-all ${
                grade === opt.key
                  ? 'border-green-500 bg-green-500/10 text-foreground'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-border/80 hover:text-foreground'
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
          <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Selection Type</span>
        </div>
        <div className="p-3">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-green-500 bg-green-500/10 text-sm font-semibold text-foreground transition-all">
            <span className="text-base">✅</span>
            First off the Stack (FO)
          </button>
        </div>
      </div>

      {/* DELIVERY METHOD */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Delivery Method</span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          {[
            { key: 'delivery', label: 'Delivery', icon: Truck },
            { key: 'pickup', label: 'Customer Pickup', icon: Building2 },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setDeliveryMethod(key)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 text-xs font-bold transition-all ${
                deliveryMethod === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-border/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* CHECKOUT */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            Sales tax calculated at checkout
          </div>
          <hr className="border-border" />

          {/* Price breakdown */}
          {deliveryInfo && (
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Container</span>
                <span className="font-mono font-semibold">${containerPrice.toLocaleString()}</span>
              </div>
              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery to {deliveryInfo.city}</span>
                  <span className="font-mono font-semibold">${deliveryFee.toLocaleString()}</span>
                </div>
              )}
              {deliveryMethod === 'pickup' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pickup</span>
                  <span className="font-mono font-semibold text-green-600">FREE</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</span>
            <span className="font-mono text-2xl font-bold text-primary tracking-tight">
              ${totalPrice.toLocaleString()}.00
            </span>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-2">
            {/* Quantity */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted/30">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-full flex items-center justify-center text-lg text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
              >
                −
              </button>
              <span className="flex-1 text-center font-mono text-sm font-medium text-foreground">
                {qty}
              </span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-8 h-full flex items-center justify-center text-lg text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <Button className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wide gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          </div>

          {deliveryInfo?.estimatedDays && deliveryMethod === 'delivery' && (
            <p className="text-xs text-muted-foreground font-mono text-center">
              Est. delivery: {deliveryInfo.estimatedDays} business days
            </p>
          )}
        </div>
      </div>

    </div>
  );
}