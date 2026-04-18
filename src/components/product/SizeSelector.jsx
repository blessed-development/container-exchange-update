import React from 'react';
import { motion } from 'framer-motion';

export const SIZE_OPTIONS = [
  {
    label: '20 ft Standard',
    price: 2500,
    image: 'https://media.base44.com/images/public/69dd889386a20317a3b688c3/d90ecf78e_box.jpeg',
  },
  {
    label: '40 ft Standard',
    price: 3350,
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80',
  },
  {
    label: '40 ft High Cube',
    price: 3350,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80',
  },
];

export default function SizeSelector({ selected, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {SIZE_OPTIONS.map((opt, i) => {
        const isSelected = selected === i;
        return (
          <motion.button
            key={i}
            onClick={() => onChange(i)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`rounded-xl border-2 p-3 text-center transition-all duration-200 shadow-sm ${
              isSelected
                ? 'border-primary bg-primary/10 shadow-primary/20 shadow-md'
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <p className={`font-bold text-sm leading-tight mb-1 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
              {opt.label}
            </p>
            <p className={`font-mono text-xs font-semibold ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
              ${opt.price.toLocaleString()}.00
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}