import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { inventoryProducts } from '@/data/inventoryProducts';

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function RelatedProducts() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-6">
        Related Products
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {inventoryProducts.map((product) => (
          <article
            key={product.id}
            className="snap-start shrink-0 w-[290px] sm:w-[315px] lg:w-[330px] bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300"
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="h-48 overflow-hidden bg-muted">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>

            <div className="p-4 pb-3">
              <h3 className="font-black text-foreground text-[15px] leading-tight mb-1 line-clamp-2">
                {product.name}
              </h3>

              <p className="text-xs text-muted-foreground leading-snug mb-2 line-clamp-2">
                {product.short_description}
              </p>

              <p className="text-xs text-muted-foreground leading-snug mb-3">
                {product.condition} · {product.size} ft · {product.grade}
              </p>

              <p className="text-xl font-black text-orange-500 tracking-tight mb-4">
                {formatMoney(product.base_price)}
              </p>

              <Link to={`/product/${product.id}`}>
                <Button className="w-full h-10 rounded-xl font-bold text-sm bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 border border-orange-400/20 shadow-[0_8px_30px_rgba(255,115,0,0.22)] transition-all duration-300">
                  Add to Cart
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
