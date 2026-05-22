import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContainerGallery from '@/components/product/ContainerGallery';
import ContainerConfigurator from '@/components/product/ContainerConfigurator';
import ProductFAQ from '@/components/product/ProductFAQ';
import RelatedProducts from '@/components/product/RelatedProducts';
import { inventoryProducts } from '@/data/inventoryProducts';
import { SIZE_OPTIONS } from '@/components/product/SizeSelector';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronRight, Loader2 } from 'lucide-react';

const GRADE_INFO = {
  AS_IS: {
    label: 'As-Is',
    desc: 'Container may have cosmetic and structural issues. Sold as-is with no guarantees.',
  },
  WWT: {
    label: 'Wind & Water Tight',
    desc: 'Guaranteed not to leak. May have dings, dents, and surface rust. Doors in working order.',
  },
  CW: {
    label: 'Cargo Worthy',
    desc: 'Certified for international shipping. Structurally sound and watertight. Inspected by certified surveyor.',
  },
  IICL: {
    label: 'IICL Certified',
    desc: 'Meets the highest international standards. Minimal wear, premium condition.',
  },
};

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[\s_-]/g, '');

const getInitialSizeIndex = (container) => {
  if (!container) return 0;

  const matchIndex = SIZE_OPTIONS.findIndex((option) => {
    const sameSize = Number(option.size) === Number(container.size);

    const sameHeight =
      !container.height ||
      normalize(option.height) === normalize(container.height);

    return sameSize && sameHeight;
  });

  return matchIndex >= 0 ? matchIndex : 0;
};

export default function ProductDetail() {
  const { id } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const zipCode = urlParams.get('zip') || '';

  const container =
    inventoryProducts.find((item) => item.id === id) || null;

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [condition, setCondition] = useState('used');

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [id]);

  const isLoading = false;

  useEffect(() => {
    if (!container) return;

    setSelectedSizeIndex(getInitialSizeIndex(container));

    setCondition(
      String(container.condition || '')
        .toLowerCase()
        .includes('new')
        ? 'new'
        : 'used'
    );
  }, [container?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!container) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Container not found.
          </p>

          <Link
            to="/inventory"
            className="text-primary hover:underline"
          >
            Browse all containers
          </Link>
        </div>
      </div>
    );
  }

  const gradeInfo = GRADE_INFO[container.grade] || {};
  const selectedSize = SIZE_OPTIONS[selectedSizeIndex];

  const productTitle = container.name;
  const productImage = container.image_url || selectedSize.image;

  const displayPrice =
    container.base_price ||
    container.price ||
    0;

  const allImages = [
    productImage,
    ...(container.gallery_urls || []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              to="/"
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>

            <ChevronRight className="w-3 h-3" />

            <Link
              to="/inventory"
              className="hover:text-primary transition-colors"
            >
              Inventory
            </Link>

            <ChevronRight className="w-3 h-3" />

            <span className="text-foreground font-medium truncate">
              {productTitle}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT COLUMN */}
          <div>
            <ContainerGallery
              images={allImages}
              key={container.id}
            />

            <div className="mt-10">
              {/* TITLE */}
              <h2 className="text-3xl font-black text-foreground mb-5 leading-tight">
                {productTitle}
              </h2>

              {/* BADGES + RATING */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary font-mono rounded-full px-3">
                  {container.size}ft
                </Badge>

                <Badge
                  variant="outline"
                  className="font-mono rounded-full px-3"
                >
                  {container.condition}
                </Badge>

                {String(container.height || '')
                  .toLowerCase()
                  .includes('high') && (
                  <Badge
                    variant="outline"
                    className="font-mono text-primary border-primary rounded-full px-3"
                  >
                    High Cube
                  </Badge>
                )}

                <div className="flex items-center gap-1.5 ml-1">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(container.rating || 5)
                            ? 'fill-orange-500 text-orange-500'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-sm font-semibold">
                    {container.rating || 5}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    ({container.review_count || 42} reviews)
                  </span>
                </div>
              </div>

              {/* PRICE */}
              <div className="mb-6 flex items-center gap-3">
                <div className="inline-flex items-center rounded-full bg-green-600 px-4 py-2 shadow-sm">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white font-black">
                    Starting From
                  </span>
                </div>

                <div className="text-4xl font-black tracking-tight text-orange-500 leading-none">
                  ${Number(displayPrice).toLocaleString()}
                </div>
              </div>

              {/* GRADE */}
              <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 mb-6">
                <p className="text-xs font-mono text-primary tracking-widest mb-2">
                  GRADE CLASSIFICATION
                </p>

                <p className="font-bold text-base mb-1">
                  {gradeInfo.label || container.grade}
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {gradeInfo.desc ||
                    'Reliable shipping container condition for storage or delivery use.'}
                </p>
              </div>

              {/* DESCRIPTION */}
              {container.short_description && (
                <p className="text-muted-foreground leading-relaxed text-base mb-10">
                  {container.short_description}
                </p>
              )}

              <ProductFAQ />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:sticky lg:top-24 self-start">
            <ContainerConfigurator
              container={container}
              initialZip={zipCode}
              selectedSizeIndex={selectedSizeIndex}
              onSizeChange={setSelectedSizeIndex}
              condition={condition}
              onConditionChange={setCondition}
            />
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="border-t border-border">
        <RelatedProducts zipCode={zipCode} />
      </div>
    </div>
  );
}
