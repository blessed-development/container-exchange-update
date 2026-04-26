import React from 'react';

export const SIZE_OPTIONS = [
  {
    label: '20\' Standard',
    dims: "20' × 8' × 8'6\"",
    price: 2500,
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=80',
  },
  {
    label: '40\' Standard',
    dims: "40' × 8' × 8'6\"",
    price: 3350,
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80',
  },
  {
    label: '40\' High Cube',
    dims: "40' × 8' × 9'6\"",
    price: 3350,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80',
  },
];

export default function SizeSelector({ selected, onChange }) {
  return (
    <div className="grid grid-cols-3 border border-border rounded-xl overflow-hidden mb-2.5 bg-card">
      {SIZE_OPTIONS.map((opt, i) => {
        const isSelected = selected === i;
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`flex flex-col items-center gap-0.5 py-3 px-2 border-r border-border last:border-r-0 transition-colors ${
              isSelected
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
            }`}
          >
            <span className={`text-[9px] font-bold tracking-widest uppercase ${isSelected ? 'text-white/70' : 'text-muted-foreground/60'}`}>
              Buy
            </span>
            <span className="text-[13px] font-bold leading-tight">{opt.label}</span>
            <span className={`font-mono text-[9px] ${isSelected ? 'text-white/75' : 'text-muted-foreground/55'}`}>
              {opt.dims}
            </span>
          </button>
        );
      })}
    </div>
  );
}