import React, { useState } from 'react';
import { Phone } from 'lucide-react';

const SIZE_OPTIONS = [
  { label: "20' Standard", price: '$1,350.00' },
  { label: "40' Standard", price: '$1,750.00' },
  { label: "40' High Cube", price: '$1,950.00' },
];

const CONDITION_OPTIONS = [
  { label: "Used 20'", dims: "20' x 8' x 8'", price: '$1,350.00' },
  { label: "New 20'", dims: "20' x 8' x 8'", price: '$2,500.00' },
];

const GRADE_OPTIONS = [
  { label: 'AS IS', note: 'Save $100' },
  { label: 'Wind & Water Tight', note: 'Add $200' },
  { label: 'Cargo Worthy (CW)', note: 'Add $400' },
];

const SELECTION_OPTIONS = [
  { label: 'First off the Stack (FO)' },
];

function OptionGroup({ label, children }) {
  return (
    <div className="border-b border-border p-5">
      <p className="text-xs font-mono text-muted-foreground tracking-widest mb-3">{label}</p>
      {children}
    </div>
  );
}

function OptionButton({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left ${
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-card text-foreground hover:border-primary/50'
      }`}
    >
      {children}
    </button>
  );
}

export default function ContainerConfigurator() {
  const [size, setSize] = useState(0);
  const [condition, setCondition] = useState(0);
  const [grade, setGrade] = useState(0);
  const [selectionType, setSelectionType] = useState(0);

  return (
    <div className="border border-border rounded-sm bg-card mt-4">
      <div className="p-5 border-b border-border bg-muted/30">
        <p className="text-xs font-mono text-muted-foreground tracking-widest mb-1">STEP 3</p>
        <p className="font-bold text-foreground text-base">Select Container Specifications</p>
      </div>

      {/* Size */}
      <OptionGroup label="SIZE:">
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((opt, i) => (
            <OptionButton key={i} selected={size === i} onClick={() => setSize(i)}>
              <span className="block">{opt.label}</span>
              <span className="block text-xs text-muted-foreground font-mono">{opt.price}</span>
            </OptionButton>
          ))}
        </div>
      </OptionGroup>

      {/* Condition */}
      <OptionGroup label="CONDITION:">
        <div className="flex flex-wrap gap-2">
          {CONDITION_OPTIONS.map((opt, i) => (
            <OptionButton key={i} selected={condition === i} onClick={() => setCondition(i)}>
              <span className="block font-semibold">{opt.label}</span>
              <span className="block text-xs text-muted-foreground">{opt.dims}</span>
              <span className="block text-xs font-mono text-primary">{opt.price}</span>
            </OptionButton>
          ))}
        </div>
      </OptionGroup>

      {/* Grade */}
      <OptionGroup label="GRADE:">
        <div className="flex flex-wrap gap-2">
          {GRADE_OPTIONS.map((opt, i) => (
            <OptionButton key={i} selected={grade === i} onClick={() => setGrade(i)}>
              <span className="block font-semibold">{opt.label}</span>
              <span className="block text-xs text-muted-foreground">{opt.note}</span>
            </OptionButton>
          ))}
        </div>
      </OptionGroup>

      {/* Selection Type */}
      <OptionGroup label="SELECTION TYPE:">
        <div className="flex flex-wrap gap-2">
          {SELECTION_OPTIONS.map((opt, i) => (
            <OptionButton key={i} selected={selectionType === i} onClick={() => setSelectionType(i)}>
              <span className="block font-semibold">{opt.label}</span>
            </OptionButton>
          ))}
        </div>
      </OptionGroup>

      {/* Found it cheaper */}
      <div className="p-5">
        <a
          href="tel:+18889779085"
          className="text-sm text-primary hover:underline flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          Found It Cheaper? (888) 977-9085
        </a>
      </div>
    </div>
  );
}