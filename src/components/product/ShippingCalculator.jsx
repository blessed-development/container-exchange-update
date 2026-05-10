import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { SIZE_OPTIONS } from './SizeSelector';

const USED_GRADES = [
  { key: 'AS_IS', label: 'AS IS' },
  { key: 'WWT', label: 'Wind & Water Tight' },
  { key: 'CW', label: 'Cargo Worthy (CW)' },
];

const NEW_GRADES = [
  { key: 'IICL', label: 'IICL Certified' },
];

const CONDITION_IMAGES = {
  used:
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80',
  new:
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80',
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
    if (condition === 'new') {
      setGrade('IICL');
    } else {
      setGrade('AS_IS');
    }
  }, [condition]);

  const gradeOptions =
    condition === 'new' ? NEW_GRADES : USED_GRADES;

  const sizeOption = SIZE_OPTIONS[selectedSizeIndex];

  const basePrice =
    condition === 'new'
      ? sizeOption.newPrice
      : sizeOption.usedPrice;

  const totalPrice = basePrice * qty;

  return (
    <div className="flex flex-col gap-3">

      {/* SIZE TABS */}
      <div className="grid grid-cols-3 rounded-2xl overflow-hidden border border-border bg-card">
        {SIZE_OPTIONS.map((opt, i) => {
          const active = selectedSizeIndex === i;

          return (
            <button
              key={i}
              onClick={() => onSizeChange(i)}
              className={`py-5 px-3 border-r border-border last:border-r-0 transition-all ${
                active
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted/30'
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
                Buy
              </div>

              <div className="text-lg font-extrabold leading-tight mt-1">
                {opt.label}
              </div>

              <div className="font-mono text-[11px] mt-1 opacity-70">
                {opt.dims}
              </div>
            </button>
          );
        })}
      </div>

      {/* PRICE */}
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-bold">
            Container Price
          </div>

          <div className="font-mono text-5xl font-black text-primary mt-2">
            ${basePrice.toLocaleString()}
          </div>
        </div>

        <button className="bg-primary hover:bg-primary/90 text-white font-bold px-7 py-3 rounded-full transition-all">
          BUY NOW
        </button>
      </div>

      {/* CONDITION */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b border-border">
          <span className="text-[11px] tracking-[0.15em] uppercase font-bold text-muted-foreground">
            Condition
          </span>

          <span className="font-semibold">
            {condition === 'new' ? 'New' : 'Used'} Container
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          {['used', 'new'].map((cond) => {
            const active = condition === cond;

            return (
              <button
                key={cond}
                onClick={() => onConditionChange(cond)}
                className={`rounded-2xl border-2 p-3 flex gap-3 items-center transition-all ${
                  active
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border hover:border-border/70'
                }`}
              >
                <img
                  src={CONDITION_IMAGES[cond]}
                  alt={cond}
                  className="w-[82px] h-[62px] rounded-xl object-cover"
                />

                <div className="text-left">
                  <div className="font-bold text-base">
                    {cond === 'new' ? 'New' : 'Used'} {sizeOption.label}
                  </div>

                  <div className="font-mono text-lg mt-1">
                    $
                    {(
                      cond === 'new'
                        ? sizeOption.newPrice
                        : sizeOption.usedPrice
                    ).toLocaleString()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* GRADE */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b border-border">
          <span className="text-[11px] tracking-[0.15em] uppercase font-bold text-muted-foreground">
            Grade Classification
          </span>

          <span className="font-semibold">
            {gradeOptions.find((g) => g.key === grade)?.label}
          </span>
        </div>

        <div
          className={`grid gap-3 p-4 ${
            condition === 'new'
              ? 'grid-cols-1'
              : 'grid-cols-3'
          }`}
        >
          {gradeOptions.map((g) => {
            const active = grade === g.key;

            return (
              <button
                key={g.key}
                onClick={() => setGrade(g.key)}
                className={`rounded-xl border-2 py-4 px-3 font-bold transition-all ${
                  active
                    ? 'border-green-500 bg-green-500/10 text-white'
                    : 'border-border text-muted-foreground hover:border-border/70'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RATING */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-yellow-400 text-yellow-400"
            />
          ))}

          <span className="ml-2 text-sm text-muted-foreground">
            4.9 rating · 217 reviews
          </span>
        </div>

        <p className="text-sm text-muted-foreground mt-4 leading-7">
          Premium quality shipping containers available for
          nationwide delivery. All units are inspected for
          structural integrity and secure cargo transport.
        </p>
      </div>

      {/* TOTAL */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[11px] uppercase tracking-[0.15em] font-bold text-muted-foreground">
              Total
            </div>

            <div className="text-sm text-muted-foreground mt-1">
              Taxes calculated at checkout
            </div>
          </div>

          <div className="font-mono text-4xl font-black text-primary">
            ${totalPrice.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-[110px_1fr] gap-3 mt-6">
          <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted/20 h-14">
            <button
              onClick={() =>
                setQty((q) => Math.max(1, q - 1))
              }
              className="w-12 h-full text-xl"
            >
              −
            </button>

            <span className="flex-1 text-center font-mono font-bold">
              {qty}
            </span>

            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-12 h-full text-xl"
            >
              +
            </button>
          </div>

          <Button className="h-14 rounded-xl text-base font-bold gap-2">
            <ShoppingCart className="w-5 h-5" />
            Add To Cart
          </Button>
        </div>
      </div>

    </div>
  );
}
