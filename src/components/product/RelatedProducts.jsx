import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { inventoryProducts } from '@/data/inventoryProducts';
import { useCart } from '@/context/CartContext';

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function RelatedProducts() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const openProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    addToCart({
      id: product.id,
      title: product.name,
      sub: `${product.condition} · ${product.size} ft · ${product.grade}`,
      unitPrice: Number(product.base_price || 0),
      qty: 1,
      img: product.image_url,
      image: product.image_url,
      url: `/product/${product.id}`,
      rating: product.rating,
      reviewCount: product.review_count,
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-6">
        Related Products
      </h2>

      <div className="flex gap-5 overflow-x-auto pb-5 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {inventoryProducts.map((product) => (
          <article
            key={product.id}
            onClick={() => openProduct(product)}
            className="snap-start shrink-0 w-[300px] sm:w-[320px] lg:w-[340px] bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 cursor-pointer"
          >
            <div className="h-44 overflow-hidden bg-muted">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-4 flex flex-col min-h-[270px]">
              <h3 className="font-black text-foreground text-[15px] leading-tight mb-1 line-clamp-2 hover:text-orange-400 transition-colors">
                {product.name}
              </h3>

              <p className="text-xs text-muted-foreground leading-snug mb-2 line-clamp-2">
                {product.short_description}
              </p>

              <p className="text-xs text-muted-foreground leading-snug mb-2">
                {product.condition} · {product.size} ft · {product.grade}
              </p>

              <div className="flex items-center gap-1 text-[12px] text-amber-400 mb-3">
                <span>★★★★★</span>
                <span className="text-muted-foreground">
                  ({product.review_count || 42})
                </span>
              </div>

              <p className="text-xl font-black text-orange-500 tracking-tight mb-4">
                {formatMoney(product.base_price)}
              </p>

              <div className="mt-auto">
                <Button
                  type="button"
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full h-10 rounded-xl font-bold text-sm bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 border border-orange-400/20 shadow-[0_8px_30px_rgba(255,115,0,0.22)] transition-all duration-300"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
