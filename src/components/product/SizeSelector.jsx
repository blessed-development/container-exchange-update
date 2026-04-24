import React from 'react';
import { Check } from 'lucide-react';

export const SIZE_OPTIONS = [
  {
    label: '20ft Standard',
    dims: "20' × 8' × 8'6\"",
    price: 2500,
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=80',
  },
  {
    label: '30ft Standard',
    dims: "30' × 8' × 8'6\"",
    price: 2950,
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80',
  },
  {
    label: '40ft High Cube',
    dims: "40' × 8' × 9'6\"",
    price: 3350,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80',
  },
];

export default function SizeSelector({ selected, onChange }) {
  return (
    <div className="flex flex-col gap-2 mb-5">
      {SIZE_OPTIONS.map((opt, i) => {
        const isSelected = selected === i;
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-left group ${
              isSelected
                ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected ? 'border-primary bg-primary' : 'border-border group-hover:border-primary/50'
              }`}>
                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              <div>
                <p className={`text-sm font-semibold leading-tight transition-colors ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}>{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.dims}</p>
              </div>
            </div>
            <span className={`text-sm font-bold font-mono transition-colors ${
              isSelected ? 'text-primary' : 'text-foreground'
            }`}>
              ${opt.price.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );
}