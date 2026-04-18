import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const SIZES = [
  { label: "20' Standard", price: 2500 },
  { label: "40' Standard", price: 3350 },
  { label: "40' High Cube", price: 3350 },
];

const CONDITIONS = [
  {
    label: 'Used',
    desc: 'Save money / Good condition',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&q=80',
    priceAdj: 0,
  },
  {
    label: 'New (One-Trip)',
    desc: 'Like new / Premium',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&q=80',
    priceAdj: 500,
  },
];

const GRADES = ['AS IS', 'Wind & Water Tight', 'Cargo Worthy (CW)', 'IICL'];

export default function ProductConfigurator() {
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedCondition, setSelectedCondition] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [selectionType] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const total = (SIZES[selectedSize].price + CONDITIONS[selectedCondition].priceAdj) * quantity;

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">

      {/* STEP 2 Header */}
      <div className="bg-muted/40 border-b border-border px-5 py-3 flex items-center gap-2">
        <span className="bg-primary text-primary-foreground text-xs font-bold font-mono px-2.5 py-0.5 rounded">Step 2:</span>
        <span className="font-bold text-sm text-foreground">Select Container Specifications</span>
      </div>

      {/* SIZE */}
      <Section label="Size:" value={SIZES[selectedSize].label}>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((s, i) => (
            <SelectBox key={i} selected={selectedSize === i} onClick={() => setSelectedSize(i)}>
              <p className="font-semibold text-sm">{s.label}</p>
              <p className="text-xs font-mono text-primary mt-1">${s.price.toLocaleString()}.00</p>
            </SelectBox>
          ))}
        </div>
      </Section>

      {/* CONDITION */}
      <Section label="Condition:">
        <div className="grid grid-cols-2 gap-3">
          {CONDITIONS.map((c, i) => (
            <button
              key={i}
              onClick={() => setSelectedCondition(i)}
              className={`relative rounded-xl border-2 overflow-hidden text-left transition-all ${
                selectedCondition === i ? 'border-primary shadow-md shadow-primary/20' : 'border-border hover:border-primary/40'
              }`}
            >
              <div className="h-24 overflow-hidden">
                <img src={c.image} alt={c.label} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-foreground">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
              {selectedCondition === i && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* GRADE */}
      <Section label="Grade:" value={GRADES[selectedGrade]}>
        <div className="grid grid-cols-2 gap-2">
          {GRADES.map((g, i) => (
            <SelectBox key={i} selected={selectedGrade === i} onClick={() => setSelectedGrade(i)}>
              <p className="font-semibold text-sm">{g}</p>
            </SelectBox>
          ))}
        </div>
      </Section>

      {/* SELECTION TYPE */}
      <Section label="Selection Type:" value="First off the Stack (FO)">
        <SelectBox selected={true} onClick={() => {}}>
          <p className="font-semibold text-sm">First off the Stack</p>
        </SelectBox>
      </Section>

      {/* SALES TAX + TOTAL */}
      <div className="px-5 py-4 border-t border-border space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5" />
          Sales Tax Calculated at Checkout
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="font-black text-lg text-primary">Total</span>
          <span className="font-black text-2xl text-primary font-mono">
            ${total.toLocaleString()}.00
          </span>
        </div>
      </div>

      {/* QUANTITY + ADD TO CART */}
      <div className="px-5 pb-5 flex gap-3">
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2.5 hover:bg-muted transition-colors text-foreground"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2.5 font-mono font-bold text-sm border-x border-border min-w-[48px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2.5 hover:bg-muted transition-colors text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <Button className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-lg gap-2">
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

function Section({ label, value, children }) {
  return (
    <div className="border-t border-border px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground">
          {label}{value && <span className="text-muted-foreground font-normal ml-1">{value}</span>}
        </span>
      </div>
      {children}
    </div>
  );
}

function SelectBox({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-xl border-2 text-left transition-all ${
        selected
          ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
          : 'border-border hover:border-primary/40 bg-card'
      }`}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      )}
      {children}
    </button>
  );
}