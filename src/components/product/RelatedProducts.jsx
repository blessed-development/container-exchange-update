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

const fallbackImage =
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=85';

export default function RelatedProducts() {
  const { addToCart } = useCart();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      title: product.name,
      sub: `${product.condition} · ${product.size} ft · ${product.grade}`,
      unitPrice: Number(product.base_price || product.price || 0),
      qty: 1,
      img: product.image_url || fallbackImage,
      image: product.image_url || fallbackImage,
      url: `/product/${product.id}`,
      rating: product.rating,
      reviewCount: product.review_count,
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-3 lg:pt-10 lg:pb-4">
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

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-black text-white text-[16px] leading-tight mb-1 line-clamp-2 drop-shadow">
                    {product.name}
                  </h3>

                  <p className="text-white/90 text-[12px] leading-snug mb-1">
                    {product.condition} · {product.size} ft · {product.grade}
                  </p>

                  <div className="flex items-center gap-1.5 text-[14px] text-amber-400">
                    <span className="tracking-tight">★★★★★</span>
                    <span className="text-white/90 text-[13px]">
                      ({product.review_count || 42})
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="p-4 flex flex-col min-h-[170px]">
              <div className="mt-auto">
                <p className="text-xl font-black text-orange-500 tracking-tight mb-3">
                  {formatMoney(product.base_price || product.price)}
                </p>

                <Link to={`/product/${product.id}`} className="block mb-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 rounded-xl font-bold text-sm border-orange-500/30 text-orange-500 hover:bg-orange-500/10 hover:text-orange-500 transition-all duration-300"
                  >
                    Quick View
                  </Button>
                </Link>

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
