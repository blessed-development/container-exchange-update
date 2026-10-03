import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { inventoryProducts } from '@/data/inventoryProducts';
import { getLocalizedPriceInfo, getSavedSelectedLocation } from '@/lib/locationEngine';

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;


const GRADE_LABELS = {
  AS_IS: 'As-Is',
  WWT: 'Wind & Water Tight',
  CW: 'Cargo Worthy',
  IICL: 'IICL Certified',
};

const fallbackImage =
  '/images/products/used-20-cw/hero.webp';

export default function RelatedProducts() {
  const [selectedLocation, setSelectedLocation] = useState(() => getSavedSelectedLocation());

  useEffect(() => {
    const syncLocation = (event) => {
      setSelectedLocation(event?.detail || getSavedSelectedLocation());
    };

    window.addEventListener('ce-location-change', syncLocation);
    window.addEventListener('storage', syncLocation);
    return () => {
      window.removeEventListener('ce-location-change', syncLocation);
      window.removeEventListener('storage', syncLocation);
    };
  }, []);

  const getPriceInfo = (product) =>
    getLocalizedPriceInfo(product.base_price || product.price || 0, selectedLocation, product);

  return (
    <section className="related-products-section max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-3 lg:pt-10 lg:pb-4">
      <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-5">
        Related Products
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {inventoryProducts.map((product) => (
          <article
            key={product.id}
            className="snap-start shrink-0 w-[292px] sm:w-[312px] lg:w-[330px] bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300"
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="relative h-[300px] overflow-hidden bg-muted group">
                <img
                  src={product.image_url || fallbackImage}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />
              </div>
            </Link>

            <div className="p-4 flex flex-col min-h-[198px]">
              <Link to={`/product/${product.id}`} className="block">
                <h3 className="font-black text-foreground text-[16px] leading-tight mb-1.5 line-clamp-2">
                  {product.name}
                </h3>

                <div className="text-[13px] leading-[1.35] text-muted-foreground mb-2 line-clamp-1">
                  {product.short_description ? (
                    product.short_description
                  ) : (
                    <>
                      {product.condition} • {product.size}
                      {product.height === 'high_cube' ? ' High Cube' : ' ft'}
                      {' • '}
                      {GRADE_LABELS[product.grade] || product.grade}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[14px] text-amber-400 mb-3">
                  <span className="tracking-tight">★★★★★</span>
                  <span className="text-muted-foreground text-[13px]">
                    ({product.review_count || 42})
                  </span>
                </div>
              </Link>

              <div className="mt-auto">
                <div className="w-full h-10 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 flex items-center justify-center mb-3">
                  <span className="text-lg font-black text-orange-500 tracking-tight">
                    {getPriceInfo(product).isPublished || getPriceInfo(product).isIndicative ? formatMoney(getPriceInfo(product).price) : 'Request a quote'}
                  </span>
                </div>
                <Link to={`/contact?${new URLSearchParams({ container: product.name, source: 'Related products' }).toString()}`} className="block">
                  <Button type="button" className="w-full h-10 rounded-xl font-bold text-sm ce-signature-button">Request a Quote</Button>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
