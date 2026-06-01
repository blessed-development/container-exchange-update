// Re-export SIZE_OPTIONS for backward compatibility — UI is now inside ShippingCalculator
export const SIZE_OPTIONS = [
  {
    label: '20ft Standard',
    size: 20,
    dims: '20 × 8 × 8.6',
    usedPrice: 1350,
    newPrice: 2900,
  },

  {
    label: '40ft Standard',
    size: 40,
    dims: '40 × 8 × 8.6',
    usedPrice: 1800,
    newPrice: 4750,
  },

  {
    label: '40ft High Cube',
    size: 40,
    dims: '40 × 8 × 9.6',
    usedPrice: 2050,
    newPrice: 5400,
  },
];

// Kept as empty default export to avoid breaking any stray imports
export default function SizeSelector() { return null; }
