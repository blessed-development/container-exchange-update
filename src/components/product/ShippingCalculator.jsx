import React, { useState, useEffect } from 'react';
import './ShippingCalculator.css';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Phone, ShieldCheck } from 'lucide-react';
import { SIZE_OPTIONS } from './SizeSelector';

const USED_GRADES = [
  { key: 'AS_IS', label: 'AS IS', adjust: -100 },
  { key: 'WWT', label: 'Wind & Water Tight', adjust: 200 },
  { key: 'CW', label: 'Cargo Worthy (CW)', adjust: 400 },
];

const NEW_GRADES = [{ key: 'IICL', label: 'IICL', adjust: 0 }];

const CONDITION_IMAGES = {
  used: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&q=80',
  new: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=300&q=80',
};

export default function ShippingCalculator({
  container,
  selectedSizeIndex,
  onSizeChange,
  condition,
  onConditionChange,
}) {
  const [grade, setGrade] = useState('AS_IS');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setGrade(condition === 'new' ? 'IICL' : 'AS_IS');
  }, [condition]);

  const gradeOptions = condition === 'new' ? NEW_GRADES : USED_GRADES;
  const sizeOption = SIZE_OPTIONS[selectedSizeIndex];
  const gradeAdjust = gradeOptions.find((g) => g.key === grade)?.adjust ?? 0;

  const basePrice =
    (condition === 'new' ? sizeOption.newPrice : sizeOption.usedPrice) +
    gradeAdjust;

  const totalPrice = basePrice * qty;

  return (
    <div className="shipping-calculator-wrap">
      <div className="grid grid-cols-3 border border-border rounded-2xl overflow-hidden bg-card">
        {SIZE_OPTIONS.map((opt, i) => {
          const active = selectedSizeIndex === i;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSizeChange(i)}
              className={`flex flex-col items-center gap-0.5 py-4 px-2 border-r border-border last:border-r-0 transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              }`}
            >
              <span
                className={`text-[9px] font-bold tracking-widest uppercase ${
                  active ? 'text-white/70' : 'text-muted-foreground/60'
                }`}
              >
                BUY
              </span>

              <span className="text-[13px] font-bold leading-tight">
                {opt.label}
              </span>

              <span
                className={`font-mono text-[9px] ${
                  active ? 'text-white/75' : 'text-muted-foreground/55'
                }`}
              >
                {opt.dims}
              </span>
            </button>
          );
        })}
      </div>

      <div className="premium-buy-panel">
        <div className="premium-price-row">
          <div>
            <p className="premium-price-label">Starting Price</p>
            <h2 className="premium-price">${basePrice.toLocaleString()}.00</h2>
          </div>

          <div className="premium-stock-pill">
            <ShieldCheck className="w-3.5 h-3.5" />
            In Stock
          </div>
        </div>

        <div className="premium-mini-summary">
          <div className="premium-mini-row">
            <span>
              {sizeOption.label} · {condition === 'new' ? 'New' : 'Used'}
            </span>
            <strong>${(basePrice - gradeAdjust).toLocaleString()}</strong>
          </div>

          {gradeAdjust !== 0 && (
            <div className="premium-mini-row">
              <span>Grade adjustment</span>
              <strong>
                {gradeAdjust > 0 ? '+' : ''}${gradeAdjust.toLocaleString()}
              </strong>
            </div>
          )}

          {qty > 1 && (
            <div className="premium-mini-row">
              <span>Quantity</span>
              <strong>× {qty}</strong>
            </div>
          )}
        </div>

        <div className="premium-total-box">
          <div>
            <p className="premium-total-label">Total</p>
            <p className="premium-tax-note">Sales tax calculated at checkout</p>
          </div>

          <div className="premium-total-price">
            ${totalPrice.toLocaleString()}
          </div>
        </div>

        <div className="premium-actions-row">
          <div className="premium-qty">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="premium-qty-btn"
              type="button"
            >
              −
            </button>

            <span className="premium-qty-value">{qty}</span>

            <button
              onClick={() => setQty((q) => q + 1)}
              className="premium-qty-btn"
              type="button"
            >
              +
            </button>
          </div>

          <Button className="premium-cart-btn">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>

        <a href="tel:+18889779085">
          <Button variant="outline" className="premium-call-btn">
            <Phone className="w-4 h-4" />
            Call (888) 977-9085
          </Button>
        </a>
      </div>

      <div className="border border-border rounded-2xl bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-foreground">
            CONDITION
          </span>

          <span className="text-sm font-semibold text-foreground">
            {condition === 'new' ? 'New' : 'Used'} {sizeOption.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 p-3">
          {['used', 'new'].map((cond) => {
            const active = condition === cond;
            const price =
              cond === 'new' ? sizeOption.newPrice : sizeOption.usedPrice;

            return (
              <button
                key={cond}
                type="button"
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

      <div className="border border-border rounded-2xl bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-foreground">
            GRADE
          </span>

          <span className="text-sm font-semibold text-foreground">
            {gradeOptions.find((g) => g.key === grade)?.label}
          </span>
        </div>

        <div
          className={`grid gap-2 p-3 ${
            condition === 'new' ? 'grid-cols-1' : 'grid-cols-3'
          }`}
        >
          {gradeOptions.map((opt) => {
            const active = grade === opt.key;

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setGrade(opt.key)}
                className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${
                  active
                    ? 'border-green-500 bg-green-500/10 text-foreground'
                    : 'border-border bg-muted/20 text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                <span className="text-[11px] font-bold leading-tight block">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
