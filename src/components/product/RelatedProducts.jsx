import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getLocationFromZip } from '@/lib/zipUtils';

const RELATED = [
  {
    id: 'used-20ft-asis',
    title: 'Used 20 ft Shipping Container',
    subtitle: 'Standard 8 ft 6 in High II Used...',
    locationLabel: 'AS IS Conex Storage Container',
    defaultCity: 'Miami, FL',
    price: '$1,250.00',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80',
  },
  {
    id: 'used-20ft-iicl',
    title: 'Used 20 ft Shipping Container',
    subtitle: 'Standard 8 ft 6 in High II Used...',
    locationLabel: 'IICL Conex Storage Container',
    defaultCity: 'Miami, FL',
    price: '$1,750.00',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80',
  },
  {
    id: 'used-20ft-cw',
    title: 'Used 20 ft Shipping Container',
    subtitle: 'Standard 8 ft 6 in High II Used...',
    locationLabel: 'Cargo Worthy CW Conex Storage Container',
    defaultCity: 'Miami, FL',
    price: '$1,550.00',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80',
  },
  {
    id: 'new-40ft-hc',
    title: 'New 40 ft High Cube Container',
    subtitle: 'High Cube 9 ft 6 in | One-Trip New...',
    locationLabel: 'IICL New One-Trip Conex Box',
    defaultCity: 'Miami, FL',
    price: '$5,400.00',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80',
  },
];

export default function RelatedProducts({ zipCode }) {
  const locationInfo = zipCode ? getLocationFromZip(zipCode) : null;
  const city = locationInfo ? `${locationInfo.city}, ${locationInfo.state}` : null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-2xl font-black text-foreground mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {RELATED.map((product) => (
          <div
            key={product.id}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
          >
            <div className="aspect-video overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-foreground text-sm leading-snug mb-1">{product.title}</h3>
              <p className="text-xs text-muted-foreground mb-1">{product.subtitle}</p>
              <p className="text-xs text-muted-foreground mb-3">
                {product.locationLabel} — {city || product.defaultCity}
              </p>
              <p className="text-xl font-black text-primary font-mono mb-4">{product.price}</p>
              <Link to={`/product/${product.id}`}>
                <Button className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-xl">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

