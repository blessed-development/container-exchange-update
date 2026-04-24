import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, Building2, Loader2, ShoppingCart, Phone, ChevronDown, Check } from 'lucide-react';
import { isValidZipCode, calculateDeliveryFee } from '@/lib/zipUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const GRADE_OPTIONS = [
  { key: 'AS_IS', label: 'AS IS', adjust: -100 },
  { key: 'WWT', label: 'Wind & Water Tight', adjust: 200 },
  { key: 'CW', label: 'Cargo Worthy', adjust: 400 },
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
    ? deliveryInfo.city
    : (zip && isValidZipCode(zip) ? zip : 'Set delivery location');

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* ── HEADER ── */}
      <div className="px-6 pt-6 pb-5 border-b border-border">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Buy Container</h2>
        <p className="text-sm text-muted-foreground mt-1">Select your configuration below</p>
      </div>

      <div className="px-6 py-5 flex flex-col gap-6">

        {/* ── CONDITION ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Condition</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { key: 'new', label: 'New', sub: 'One-trip / unused' },
              { key: 'used', label: 'Used', sub: 'Wind & water tight' },
            ].map((opt) => {
              const isSelected = condition === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setCondition(opt.key)}
                  className={`flex flex-col items-start gap-0.5 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40 hover:bg-muted/20'
                  }`}
                >
                  <span className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{opt.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── GRADE ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Grade</p>
          <div className="grid grid-cols-2 gap-2">
            {GRADE_OPTIONS.map((opt) => {
              const isSelected = grade === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setGrade(opt.key)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40 hover:bg-muted/20'
                  }`}
                >
                  <span className={`text-xs font-semibold leading-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {opt.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── DELIVERY ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Delivery Method</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { key: 'delivery', label: 'Home Delivery', icon: Truck },
              { key: 'pickup', label: 'Self Pickup', icon: Building2 },
            ].map(({ key, label, icon: Icon }) => {
              const isSelected = deliveryMethod === key;
              return (
                <button
                  key={key}
                  onClick={() => setDeliveryMethod(key)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* ZIP */}
          <button
            onClick={() => setZipOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-muted/40 hover:bg-muted/60 border border-border transition-colors"
          >
            <div className="flex items-center gap-2.5 text-sm">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">Delivering to</span>
              <span className="font-medium text-foreground">{locationLabel}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${zipOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence initial={false}>
            {zipOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleZipSubmit} className="flex gap-2 pt-2.5">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={zip}
                    onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="Enter ZIP code"
                    className="flex-1 h-10 text-sm"
                    autoFocus
                  />
                  <Button type="submit" size="sm" className="h-10 px-5 bg-primary hover:bg-primary/90 text-sm font-semibold">
                    {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── PRICE BREAKDOWN ── */}
        <div className="rounded-xl bg-muted/40 border border-border p-4 flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Container price</span>
            <span className="font-medium text-foreground">${containerPrice.toLocaleString()}</span>
          </div>
          {deliveryInfo && deliveryMethod === 'delivery' && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Delivery to {deliveryInfo.city}</span>
              <span className="font-medium text-foreground">${deliveryFee.toLocaleString()}</span>
            </div>
          )}
          {deliveryMethod === 'pickup' && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Self pickup</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
          )}
          {qty > 1 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-medium text-foreground">× {qty}</span>
            </div>
          )}
          <div className="border-t border-border pt-2.5 flex justify-between items-baseline">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary tracking-tight">${totalPrice.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground">Sales tax calculated at checkout</p>
        </div>

        {/* ── QUANTITY + CTA ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-16 flex-shrink-0">Quantity</span>
            <div className="flex items-center border border-border rounded-xl overflow-hidden bg-card h-10">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium text-lg"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold text-foreground select-none">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium text-lg"
              >
                +
              </button>
            </div>
          </div>

          <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 gap-2.5">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </Button>

          <Link to="/contact">
            <Button variant="outline" className="w-full h-11 rounded-xl border-2 font-semibold text-sm hover:border-primary hover:text-primary transition-all duration-200">
              Request a Quote
            </Button>
          </Link>
        </div>

        {/* ── CALL STRIP ── */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Have questions? Call us</p>
            <a href="tel:+18889779085" className="text-sm font-bold text-foreground hover:text-primary transition-colors">
              (888) 977-9085
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}