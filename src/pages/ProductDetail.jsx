import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useLocation } from 'react-router-dom';
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
  lookupPostalCode,
  saveSelectedLocation,
} from '@/lib/locationEngine';


const getLocationZip = (location) =>
  location?.postalCode || location?.zip || location?.zipCode || '';

const hasCityState = (location) =>
  Boolean(location?.city && (location?.state || location?.stateCode));

const normalizeLocation = (location) => {
  if (!location) return null;

  const zip = getLocationZip(location);
  const state = location.state || location.stateCode || '';
  const stateCode = location.stateCode || location.state || '';

  return {
    ...location,
    postalCode: zip,
    zip,
    zipCode: zip,
    state,
    stateCode,
    country: location.country || 'US',
  };
};

const getBestLocation = (...locations) => {
  const normalized = locations.map(normalizeLocation).filter(Boolean);
  const rich = normalized.find((location) => getLocationZip(location) && hasCityState(location));

  if (rich) return rich;

  return normalized.find((location) => getLocationZip(location)) || normalized[0] || null;
};

const formatCityState = (location) => {
  if (!location?.city) return 'Your Area';

  const state = location.stateCode || location.state;

  return state ? `${location.city}, ${state}` : location.city;
};

const GRADE_INFO = {
  AS_IS: {
    label: 'As-Is',
    desc: 'The pictured unit is in AS-IS condition. Doors, floors, seals, and roof are functional and the unit is waterproof.',
    description:
      'Budget-friendly containers available in used, as-is condition. Featuring visible exterior wear and prior-use damage, these units are heavily discounted. Recommended for basic storage or temporary shelter where pristine condition is not required.',
  },
  WWT: {
    label: 'Wind & Water Tight',
    desc: 'Each Unit is in Wind & Water Tight condition Doors, floors, seals and roof have been independently inspected and are guaranteed to be fully capable of functional dry storage with a no leak guarantee.',
    description:
      'Units passed inspection by the third party repair staff to be in cargo transport condition for dry storage. This means functional doors, floors, seals, locking capability, and no leaks guaranteed.',
  },
  CW: {
    label: 'Cargo Worthy B Grade',
    desc: 'Each Unit is in USED Cargo Worthy B Grade condition.  required to be waterproof, have functional doors, weight bearing floors, and have less than 1 inch dents. good functional shape for export, dry storage, or other uses requiring a structurally sound shipping container.',
   description:
   'The cargo worthy are 15-19 years old that came into port with goods from overseas. They were inspected prior to the sailing to be in good structure to carry goods across the ocean to the USA offload site. The cargo worthy designation has nothing to do with aesthetics, surface rust content, or any other visual component.', 
  },
  IICL: {
    label: 'NEW IICL',
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
  const location = useLocation();

  const [zipCode, setZipCode] = useState(() => {
    const saved = getSavedSelectedLocation();

    return (
      saved?.postalCode ||
      new URLSearchParams(window.location.search).get('zip') ||
      ''
    );
  });

  const routeContainer =
    inventoryProducts.find((item) => item.id === id) || null;

  const [activeProduct, setActiveProduct] = useState(null);
  const container = activeProduct || routeContainer;

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
    const shouldPreserveScroll =
      location?.state?.preserveScroll ||
      location?.state?.source === 'calculator-configurator' ||
      location?.state?.source === 'calculator-grade';

    if (!shouldPreserveScroll) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }

    setActiveImageIndex(0);

    let cancelled = false;

    const applyLocation = async (incomingLocation = null) => {
      const urlZip = new URLSearchParams(window.location.search).get('zip') || '';
      const saved = incomingLocation || getSavedSelectedLocation();
      const best = getBestLocation(saved, savedLocation);

      let nextLocation = best;
      const nextZip = getLocationZip(best) || urlZip;

      if (nextZip && (!nextLocation || !hasCityState(nextLocation))) {
        try {
          const resolved = await lookupPostalCode(nextZip);
          nextLocation = getBestLocation(resolved, nextLocation);
          saveSelectedLocation(nextLocation);
        } catch {
          nextLocation = normalizeLocation({
            ...(nextLocation || {}),
            postalCode: nextZip,
            zip: nextZip,
            zipCode: nextZip,
          });
        }
      }

      if (cancelled) return;

      setSavedLocation(nextLocation);

      if (nextZip) {
        setZipCode(nextZip);
      }

      setLocalizedPricing((prev) => ({
        ...prev,
        hasLocalPrice: Boolean(nextZip),
        location: getBestLocation(nextLocation, prev.location),
      }));
    };

    const syncLocation = (event) => {
      applyLocation(event?.detail || null);
    };

    syncLocation();

    window.addEventListener('ce-location-change', syncLocation);
    window.addEventListener('storage', syncLocation);
    window.addEventListener('focus', syncLocation);
    window.addEventListener('pageshow', syncLocation);

    return () => {
      cancelled = true;

      window.removeEventListener('ce-location-change', syncLocation);
      window.removeEventListener('storage', syncLocation);
      window.removeEventListener('focus', syncLocation);
      window.removeEventListener('pageshow', syncLocation);
    };
  }, [id]);

  useEffect(() => {
    setActiveProduct(null);
  }, [id]);

  useEffect(() => {
    if (!container) return;

    setSelectedSizeIndex(getInitialSizeIndex(container));
    setActiveImageIndex(0);

    setCondition(
      String(container.condition || '')
        .toLowerCase()
        .includes('new')
        ? 'new'
        : 'used'
    );
  }, [container?.id]);

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

  const activeLocation = getBestLocation(
    localizedPricing?.location,
    savedLocation,
    getSavedSelectedLocation()
  );

  const hasActiveZip =
    Boolean(getLocationZip(activeLocation));

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

  const seoLocation = formatCityState(activeLocation);
  useEffect(() => {
  if (!seoHeroTitle || !seoLocation) return;

  document.title =
    `${seoHeroTitle} For Sale in ${seoLocation} | Containers Exchange`;

  return () => {
    document.title = 'Containers Exchange';
  };
}, [seoHeroTitle, seoLocation]);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get('openZipModal') !== '1') return;

  const saved = getSavedSelectedLocation();

  if (saved?.postalCode) return;

  const timer = setTimeout(() => {
    setShowZipModal(true);
  }, 1800);

  return () => clearTimeout(timer);
}, [id]);

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
  onProductSwap={setActiveProduct}
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
            const nextLocation = location || getSavedSelectedLocation();

            setShowZipModal(false);
            setSavedLocation(nextLocation);

            if (nextLocation?.postalCode) {
              setZipCode(nextLocation.postalCode);
            }

            const normalizedLocation = getBestLocation(nextLocation, getSavedSelectedLocation());

            if (normalizedLocation?.postalCode) {
              saveSelectedLocation(normalizedLocation);
            }

            setLocalizedPricing((prev) => ({
              ...prev,
              hasLocalPrice: Boolean(getLocationZip(normalizedLocation)),
              location: normalizedLocation,
            }));

            window.dispatchEvent(
              new CustomEvent('ce-location-change', {
                detail: normalizedLocation,
              })
            );
          }}
        />
      )}
    </div>
</>
);
}
