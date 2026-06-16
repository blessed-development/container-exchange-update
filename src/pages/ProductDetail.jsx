import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import ContainerConfigurator from '@/components/product/ContainerConfigurator';
import ProductFAQ from '@/components/product/ProductFAQ';
import RelatedProducts from '@/components/product/RelatedProducts';
import ZipRequiredModal from '@/components/shared/ZipRequiredModal';
import { inventoryProducts } from '@/data/inventoryProducts';
import { SIZE_OPTIONS } from '@/components/product/SizeSelector';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronRight, Loader2, ChevronDown } from 'lucide-react';

import {
  getLocalizedPrice,
  getSavedSelectedLocation,
} from '@/lib/locationEngine';

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
    desc: 'Each Unit is in NEW One Trip A Grade condition. Roof, Seals, Doors, & Floors are in smooth working condition as expected of a new unit.',
    description:
      'Each unit comes standard with a lockbox on the door to prevent lock cutting. Forklift pockets on both sides of the container for easy moving. Plywood lacquered floors are marine grade treated planks and reinforced from the bottom to prevent intrusion.',
  },
};

const SAMPLE_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=85',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=85',
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&q=85',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=85',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=85',
];

const normalize = (value) =>
  String(value || '').toLowerCase().replace(/[\s_-]/g, '');

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

const buildSeoProductTitle = (title) => {
  return String(title || '')
    .replace(/\s*\|\s*(WWT|CW|IICL|AS[-_\s]?IS).*$/i, '')
    .replace(/\bShipping Container\b/i, 'Shipping Containers')
    .replace(/^Used\b/i, 'USED')
    .replace(/^New\b/i, 'NEW')
    .trim();
};

export default function ProductDetail() {
  const { id } = useParams();

  const urlParams = new URLSearchParams(window.location.search);
  const zipCode = urlParams.get('zip') || '';

  const container =
    inventoryProducts.find((item) => item.id === id) || null;

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [condition, setCondition] = useState('used');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [showZipModal, setShowZipModal] = useState(false);

  const [savedLocation, setSavedLocation] = useState(() =>
    getSavedSelectedLocation()
  );

  const [localizedPricing, setLocalizedPricing] = useState({
    hasLocalPrice: Boolean(getSavedSelectedLocation()?.postalCode),
    price: null,
    location: getSavedSelectedLocation(),
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    setActiveImageIndex(0);

    const syncLocation = () => {
      const saved = getSavedSelectedLocation();

      setSavedLocation(saved);

      setLocalizedPricing((prev) => ({
        ...prev,
        hasLocalPrice: Boolean(saved?.postalCode),
        location: saved,
      }));
    };

    syncLocation();

    window.addEventListener('ce-location-change', syncLocation);
    window.addEventListener('storage', syncLocation);
    window.addEventListener('focus', syncLocation);
    window.addEventListener('pageshow', syncLocation);

    return () => {
      window.removeEventListener('ce-location-change', syncLocation);
      window.removeEventListener('storage', syncLocation);
      window.removeEventListener('focus', syncLocation);
      window.removeEventListener('pageshow', syncLocation);
    };
  }, [id]);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('openZipModal') !== '1') return;

    const timer = setTimeout(() => {
      setShowZipModal(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [id]);

  const isLoading = false;

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

  const productImage =
    container.image_url || selectedSize.image;

  const baseDisplayPrice =
    container.base_price ||
    container.price ||
    0;

  const activeLocation =
    localizedPricing?.location?.postalCode
      ? localizedPricing.location
      : savedLocation;

  const hasActiveZip =
    Boolean(activeLocation?.postalCode);

  const heroPrice =
    getLocalizedPrice(baseDisplayPrice, activeLocation);

  const showStartingFrom =
    !hasActiveZip;

  const allImages = [
    productImage,
    ...(container.gallery_urls || []),
    ...SAMPLE_GALLERY_IMAGES,
  ].filter(Boolean);

  const activeImage = allImages[activeImageIndex] || productImage;

  const showHeroOverlay = activeImageIndex === 0;

  const seoHeroTitle = buildSeoProductTitle(productTitle);

  const seoLocation =
    activeLocation?.city && activeLocation?.state
      ? `${activeLocation.city}, ${activeLocation.state}`
      : 'Your Area';
  useEffect(() => {
  if (!seoHeroTitle || !seoLocation) return;

  document.title =
    `${seoHeroTitle} For Sale in ${seoLocation} | Containers Exchange`;

  return () => {
    document.title = 'Containers Exchange';
  };
}, [seoHeroTitle, seoLocation]);

  const productDescription =
    gradeInfo.description || container.short_description || '';

 return (
<>
<Helmet>

<title>
{seoHeroTitle && seoLocation
  ? `${seoHeroTitle} For Sale in ${seoLocation} | Containers Exchange`
  : `${productTitle} | Containers Exchange`}
</title>

<meta
  name="description"
  content={
    seoHeroTitle && seoLocation
      ? `Buy ${seoHeroTitle.toLowerCase()} for sale in ${seoLocation}. View local pricing, delivery, sizes and container specifications.`
      : `Browse ${productTitle} shipping container pricing and availability.`
  }
/>

<link
  rel="canonical"
  href={window.location.href}
/>

<meta property="og:type" content="product" />

<meta
  property="og:title"
  content={`${seoHeroTitle} For Sale in ${seoLocation}`}
/>

<meta
  property="og:description"
  content={`Buy ${seoHeroTitle.toLowerCase()} in ${seoLocation}.`}
/>

<meta
  property="og:image"
  content={productImage}
/>

<meta
  property="og:url"
  content={window.location.href}
/>

<meta
  name="twitter:card"
  content="summary_large_image"
/>

<meta
  name="twitter:title"
  content={`${seoHeroTitle} For Sale in ${seoLocation}`}
/>

<meta
  name="twitter:description"
  content={`Buy ${seoHeroTitle.toLowerCase()} in ${seoLocation}.`}
/>

<meta
  name="twitter:image"
  content={productImage}
/>

</Helmet>

<div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="sr-only">
            <Link to="/">
              Home
            </Link>

            <ChevronRight className="w-3 h-3" />

            <Link to="/inventory">
              Inventory
            </Link>

            <ChevronRight className="w-3 h-3" />

            <span>
              {productTitle}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="relative overflow-hidden rounded-[30px] bg-muted shadow-2xl group">
              <img
                key={activeImage}
                src={activeImage}
                alt={productTitle}
                className="w-full h-[430px] object-cover brightness-[0.88] contrast-[1.06] transition-all duration-700 ease-out group-hover:scale-[1.025] animate-in fade-in"
              />

              {showHeroOverlay && (
                <>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/22 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/38 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-transparent to-transparent" />
                  </div>

                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <Badge className="bg-orange-500/15 text-orange-500 border border-orange-500/30 font-mono rounded-full px-3">
                        {String(container.condition || condition).toUpperCase()}
                      </Badge>

                      <Badge className="bg-white/12 backdrop-blur-md text-white border border-white/10 font-mono rounded-full px-3">
                        {container.size}ft
                      </Badge>

                      {String(container.grade || '').toUpperCase() && (
                        <Badge
                          variant="outline"
                          className="bg-white/10 backdrop-blur-md text-white border-white/10 font-mono rounded-full px-3"
                        >
                          {String(container.grade || '').toUpperCase()}
                        </Badge>
                      )}
                    </div>

                    <h1 className="text-[32px] md:text-[44px] font-black text-white leading-[1.02] tracking-[-0.045em] max-w-[640px] mb-6">
                      {seoHeroTitle}
                    </h1>

                    <div className="text-[19px] md:text-[24px] font-bold tracking-[-0.02em] text-white mb-6">
                      For Sale in
                      <span className="text-primary ml-2">
                        {seoLocation}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(container.rating || 5)
                                ? 'fill-orange-500 text-orange-500'
                                : 'text-white/30'
                            }`}
                          />
                        ))}
                      </div>

                      <span className="text-base font-black text-white">
                        {container.rating || 5}
                      </span>

                      <span className="text-sm text-white/80">
                        ({container.review_count || 42} reviews)
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {allImages.slice(0, 10).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`shrink-0 w-[74px] h-[58px] rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                    activeImageIndex === index
                      ? 'border-orange-500 ring-2 ring-orange-500/25'
                      : 'border-border hover:border-orange-400/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productTitle} preview ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </button>
              ))}
            </div>

            <div className="mt-6 pb-6">
              <div className="mb-8 flex items-center gap-4">
                {showStartingFrom && (
                  <div className="inline-flex items-center rounded-full bg-green-600/90 px-3 py-1">
                    <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-white font-bold">
                      Starting From
                    </span>
                  </div>
                )}

                <div className="text-4xl font-black tracking-tight text-orange-500 leading-none">
                  ${Number(heroPrice).toLocaleString()}
                </div>
              </div>

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

              {productDescription && (
                <button
                  type="button"
                  onClick={() => setDescriptionOpen(!descriptionOpen)}
                  aria-expanded={descriptionOpen}
                  className="group mb-6 md:mb-10 w-full rounded-[22px] border border-white/10 bg-white/[0.025] px-5 py-3 md:py-4 text-left transition-all duration-300 hover:border-primary/25 hover:bg-white/[0.04]"
                >
                  <div className="relative">
                    <p
                      className={`text-[14px] md:text-base leading-6 md:leading-7 text-muted-foreground transition-all duration-300 ${
                        descriptionOpen ? '' : 'line-clamp-2'
                      }`}
                    >
                      {productDescription}
                    </p>

                    {!descriptionOpen && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/95 to-transparent" />
                    )}
                  </div>

                  <div className="mt-2 inline-flex items-center gap-1.5 text-[12px] md:text-[13px] font-semibold text-primary/90 transition-colors group-hover:text-primary">
                    <span>
                      {descriptionOpen ? 'Show less' : 'Read more'}
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        descriptionOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
              )}

             <div className="hidden lg:block -mt-4">
  <ProductFAQ />
</div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <ContainerConfigurator
              container={container}
              initialZip={zipCode}
              selectedSizeIndex={selectedSizeIndex}
              onSizeChange={setSelectedSizeIndex}
              condition={condition}
              onConditionChange={setCondition}
              onPricingChange={setLocalizedPricing}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <RelatedProducts zipCode={zipCode} />
      </div>

      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-8">
        <ProductFAQ />
      </div>

      {showZipModal && (
        <ZipRequiredModal
          open={showZipModal}
          onClose={() => setShowZipModal(false)}
          onSuccess={(location) => {
            const resolvedLocation = location || getSavedSelectedLocation();

            setShowZipModal(false);
            setSavedLocation(resolvedLocation);

            setLocalizedPricing((prev) => ({
              ...prev,
              hasLocalPrice: Boolean(resolvedLocation?.postalCode),
              location: resolvedLocation,
            }));
          }}
        />
      )}
    </div>
</>
);
}
s
