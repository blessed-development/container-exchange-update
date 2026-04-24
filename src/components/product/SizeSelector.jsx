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
    <div className="bg-card rounded-2xl border border-border shadow-sm mb-3 overflow-hidden">
      <div className="px-6 pt-5 pb-3 border-b border-border">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Container Size</p>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {SIZE_OPTIONS.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200 text-left group ${
                isSelected
                  ? 'border-primary/60 bg-primary/[0.06] ring-1 ring-primary/20'
                  : 'border-border bg-transparent hover:border-border/80 hover:bg-muted/20'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40 group-hover:border-muted-foreground/70'
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </div>
                <div>
                  <p className={`text-[13px] font-semibold leading-none mb-1 transition-colors ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}>{opt.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-none">{opt.dims}</p>
                </div>
              </div>
              <span className={`text-[13px] font-bold tabular-nums transition-colors ${
                isSelected ? 'text-primary' : 'text-foreground/80'
              }`}>
                ${opt.price.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}