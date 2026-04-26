import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, Building2, Loader2, ShoppingCart, Phone, ChevronDown, Check } from 'lucide-react';
import { isValidZipCode, calculateDeliveryFee } from '@/lib/zipUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SIZE_OPTIONS } from './SizeSelector';

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-border w-full" />;
}

export default function ShippingCalculator({
  container,
  initialZip = '',
  // These are now controlled from the parent (ProductDetail)
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

  const sizeOption = SIZE_OPTIONS[selectedSizeIndex];
  const basePrice  = condition === 'new' ? sizeOption.newPrice : sizeOption.usedPrice;
  const deliveryFee = deliveryMethod === 'delivery' ? (deliveryInfo?.fee || 0) : 0;
  const totalPrice  = (basePrice + deliveryFee) * qty;

  const locationLabel = deliveryInfo
    ? deliveryInfo.city
    : (zip && isValidZipCode(zip) ? zip : 'Set delivery location');

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">

      {/* ── HEADER ── */}
      <div className="px-6 pt-6 pb-5 border-b border-border">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight leading-none mb-1.5">
              Buy Container
            </h2>
            <p className="text-[13px] text-muted-foreground leading-none">
              Configure your order below
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[11px] text-muted-foreground leading-none mb-1">From</p>
            <p className="text-2xl font-bold text-primary tabular-nums leading-none">
              ${basePrice.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 flex flex-col gap-7">

        {/* ── SIZE ── */}
        <div>
          <SectionLabel>Container Size</SectionLabel>
          <div className="flex flex-col gap-2">
            {SIZE_OPTIONS.map((opt, i) => {
              const active = selectedSizeIndex === i;
              return (
                <button
                  key={i}
                  onClick={() => onSizeChange(i)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200 text-left group ${
                    active
                      ? 'border-primary/60 bg-primary/[0.06] ring-1 ring-primary/20'
                      : 'border-border bg-transparent hover:border-border/80 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      active ? 'border-primary bg-primary' : 'border-muted-foreground/40 group-hover:border-muted-foreground/70'
                    }`}>
                      {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                    <div>
                      <p className={`text-[13px] font-semibold leading-none mb-1 transition-colors ${active ? 'text-primary' : 'text-foreground'}`}>
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-none">{opt.dims}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[12px] font-semibold tabular-nums leading-none mb-0.5 transition-colors ${active ? 'text-primary' : 'text-foreground/80'}`}>
                      Used ${opt.usedPrice.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground tabular-nums leading-none">
                      New ${opt.newPrice.toLocaleString()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <Divider />

        {/* ── CONDITION ── */}
        <div>
          <SectionLabel>Condition</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'used', label: 'Used Container', sub: 'Wind & water tight' },
              { key: 'new',  label: 'New Container',  sub: 'One-trip / unused' },
            ].map((opt) => {
              const active = condition === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => onConditionChange(opt.key)}
                  className={`flex flex-col items-start px-4 py-3.5 rounded-xl border transition-all duration-200 text-left ${
                    active
                      ? 'border-primary/60 bg-primary/[0.06] ring-1 ring-primary/20'
                      : 'border-border hover:border-border/80 hover:bg-muted/20'
                  }`}
                >
                  <span className={`text-[13px] font-semibold leading-none mb-1.5 ${active ? 'text-primary' : 'text-foreground'}`}>
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground leading-none">{opt.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Divider />

        {/* ── DELIVERY ── */}
        <div>
          <SectionLabel>Delivery</SectionLabel>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { key: 'delivery', label: 'Home Delivery', Icon: Truck },
              { key: 'pickup',   label: 'Self Pickup',   Icon: Building2 },
            ].map(({ key, label, Icon }) => {
              const active = deliveryMethod === key;
              return (
                <button
                  key={key}
                  onClick={() => setDeliveryMethod(key)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? 'border-primary/60 bg-primary/[0.06] text-primary ring-1 ring-primary/20'
                      : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* ZIP row */}
          <button
            onClick={() => setZipOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/60 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-[15px] h-[15px] text-primary flex-shrink-0" />
              <span className="text-[12px] text-muted-foreground">Delivering to</span>
              <span className="text-[12px] font-medium text-foreground">{locationLabel}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground/70 transition-transform duration-200 group-hover:text-muted-foreground ${zipOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence initial={false}>
            {zipOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
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
                  <Button type="submit" size="sm" className="h-10 px-5 bg-primary hover:bg-primary/90 text-[13px] font-semibold">
                    {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Divider />

        {/* ── PRICE SUMMARY ── */}
        <div className="rounded-xl bg-muted/30 border border-border/60 overflow-hidden">
          <div className="px-5 py-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-muted-foreground">{sizeOption.label} · {condition === 'new' ? 'New' : 'Used'}</span>
              <span className="text-[13px] font-medium text-foreground tabular-nums">${basePrice.toLocaleString()}</span>
            </div>
            {deliveryInfo && deliveryMethod === 'delivery' && (
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-muted-foreground">Delivery · {deliveryInfo.city}</span>
                <span className="text-[13px] font-medium text-foreground tabular-nums">${deliveryFee.toLocaleString()}</span>
              </div>
            )}
            {deliveryMethod === 'pickup' && (
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-muted-foreground">Self pickup</span>
                <span className="text-[13px] font-medium text-green-600">Free</span>
              </div>
            )}
            {qty > 1 && (
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-muted-foreground">Quantity</span>
                <span className="text-[13px] font-medium text-foreground">× {qty}</span>
              </div>
            )}
          </div>
          <div className="px-5 py-4 border-t border-border/60 bg-muted/20 flex justify-between items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-0.5">Total</p>
              <p className="text-[10px] text-muted-foreground/70">Tax calculated at checkout</p>
            </div>
            <span className="text-3xl font-bold text-primary tabular-nums tracking-tight">
              ${totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── QUANTITY + CTA ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-muted-foreground w-14 flex-shrink-0">Qty</span>
            <div className="flex items-center border border-border rounded-xl overflow-hidden bg-card h-10 w-28">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors text-xl font-light"
              >−</button>
              <span className="flex-1 text-center text-[13px] font-semibold text-foreground select-none tabular-nums">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors text-xl font-light"
              >+</button>
            </div>
          </div>

          <Button className="w-full h-12 bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground text-[15px] font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-px transition-all duration-200 gap-2.5">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </Button>

          <Link to="/contact">
            <Button variant="outline" className="w-full h-11 rounded-xl border border-border font-semibold text-[13px] text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200">
              Request a Quote
            </Button>
          </Link>
        </div>

        {/* ── CALL STRIP ── */}
        <div className="flex items-center gap-3.5 pt-1 pb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/[0.08] border border-primary/15 flex items-center justify-center flex-shrink-0">
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
    </div>
  );
}