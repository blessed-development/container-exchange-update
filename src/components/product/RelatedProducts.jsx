import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { inventoryProducts } from '@/data/inventoryProducts';
import { useCart } from '@/context/CartContext';

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function RelatedProducts() {
  const { addToCart } = useCart();

  const handleAddToCart = (e, product) => {
    e.preventDefault();

    addToCart({
      id: product.id,
      title: product.name,
      sub: `${product.condition} · ${product.size} ft · ${product.grade}`,
      unitPrice: Number(product.base_price || product.price || 0),
      qty: 1,
      img: product.image_url,
      image: product.image_url,
      url: `/product/${product.id}`,
      rating: product.rating,
      reviewCount: product.review_count,
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4 lg:pt-10 lg:pb-6">
      <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-5">
        Related Products
      </h2>

      <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {inventoryProducts.map((product) => (
          <article
            key={product.id}
            className="snap-start shrink-0 w-[300px] sm:w-[320px] lg:w-[340px] rounded-[26px] overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-orange-500/30 transition-all duration-300"
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="relative h-[360px] overflow-hidden bg-muted group">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/5" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-white text-[20px] leading-[1.05] font-black tracking-tight mb-3 line-clamp-3">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[15px] text-amber-400 mb-4">
                    <span>★★★★★</span>
                    <span className="text-white/75 text-[13px]">
                      ({product.review_count || 42})
                    </span>
                  </div>

                  <p className="text-3xl font-black text-orange-500 tracking-tight mb-4">
                    {formatMoney(product.base_price || product.price)}
                  </p>

                  <Button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full h-11 rounded-2xl font-bold text-sm bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 border border-orange-400/20 shadow-[0_12px_34px_rgba(255,115,0,0.24)] transition-all duration-300"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
