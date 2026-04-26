// Re-export SIZE_OPTIONS for backward compatibility — UI is now inside ShippingCalculator
export const SIZE_OPTIONS = [
  {
    label: '20ft Standard',
    size: '20',
    height: 'standard',
    dims: "20' × 8' × 8'6\"",
    usedPrice: 1650,
    newPrice: 3200,
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=80',
  },
  {
    label: '40ft Standard',
    size: '40',
    height: 'standard',
    dims: "40' × 8' × 8'6\"",
    usedPrice: 2400,
    newPrice: 4800,
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80',
  },
  {
    label: '40ft High Cube',
    size: '40',
    height: 'high_cube',
    dims: "40' × 8' × 9'6\"",
    usedPrice: 2800,
    newPrice: 5400,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=80',
  },
];

// Kept as empty default export to avoid breaking any stray imports
export default function SizeSelector() { return null; }