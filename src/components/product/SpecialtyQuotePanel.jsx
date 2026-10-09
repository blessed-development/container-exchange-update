import React, { useEffect, useMemo, useState } from 'react';
import { Check, Lock, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ZipCodeSearch from '@/components/shared/ZipCodeSearch';
import { inventoryProducts } from '@/data/inventoryProducts';
import { getSavedSelectedLocation } from '@/lib/locationEngine';
import { useCart } from '@/context/CartContext';
import './ShippingCalculator.css';

const dimensionsFor = (product) => {
  return `${product?.size || 20} × 8 × ${product?.height === 'high_cube' ? '9.6' : '8.6'}`;
};

const labelFor = (product) =>
  `${product?.size || 20}ft ${product?.height === 'high_cube' ? 'High Cube' : 'Standard'}`;

const fmt = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const EMPTY_LOCATION = { city: '', state: '', postalCode: '', country: '' };

const productFamily = (product) => {
  const doorType = String(product?.door_type || '').toLowerCase();
  if (doorType.includes('reefer')) return 'reefer';
  if (doorType.includes('both ends')) return 'double-door';
  if (doorType.includes('full side')) return 'full-side';
  if (doorType.includes('four')) return 'four-door-side';
  if (Number(product?.size) === 45) return '45-high-cube';
  return product?.id || 'specialty';
};

const conditionKey = (product) =>
  String(product?.condition || '').toLowerCase() === 'new' ? 'new' : 'used';

export default function SpecialtyQuotePanel({ product, onProductSwap, onLocationChange }) {
  const navigate = useNavigate();
  const { addToCart, setIsDrawerOpen } = useCart();
  const [location, setLocation] = useState(() => getSavedSelectedLocation() || EMPTY_LOCATION);
  const onLocationChangeRef = React.useRef(onLocationChange);
  const family = productFamily(product);
  const activeCondition = conditionKey(product);
  const isNew = activeCondition === 'new';
  const gradeLabel = isNew ? 'IICL Certified' : 'Used Reefer';

  const familyProducts = useMemo(
    () => inventoryProducts.filter((item) => item.is_specialty && productFamily(item) === family),
    [family]
  );
  const conditionProducts = familyProducts.filter((item) => conditionKey(item) === activeCondition);
  const availableConditions = new Set(familyProducts.map(conditionKey));
  const sortedVariants = [...conditionProducts].sort((a, b) => {
    const aHeight = a.height === 'high_cube' ? 1 : 0;
    const bHeight = b.height === 'high_cube' ? 1 : 0;
    return Number(a.size) - Number(b.size) || aHeight - bHeight;
  });

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    const syncLocation = (event) => {
      const nextLocation = event?.detail || getSavedSelectedLocation() || EMPTY_LOCATION;
      setLocation(nextLocation);
      onLocationChangeRef.current?.(nextLocation);
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
  }, []);

  const selectProduct = (nextProduct) => {
    if (!nextProduct || nextProduct.id === product?.id) return;
    if (onProductSwap) {
      onProductSwap(nextProduct);
      return;
    }
    navigate(`/product/${nextProduct.id}`);
  };

  const selectCondition = (nextCondition) => {
    selectProduct(familyProducts.find((item) => conditionKey(item) === nextCondition));
  };

  const hasCheckoutLocation = Boolean(location?.postalCode);

  const addCurrentProductToCart = () => {
    if (!hasCheckoutLocation) return;

    addToCart({
      productId: product?.id,
      title: product?.name,
      sub: product?.short_description,
      condition: activeCondition,
      grade: isNew ? 'IICL' : 'Used Reefer',
      size: labelFor(product),
      unitPrice: Number(product?.preview_price || 0),
      qty: 1,
      image: product?.image_url,
      img: product?.image_url,
      url: `/product/${product?.id}`,
      rating: product?.preview_rating,
      reviewCount: product?.preview_rating_count,
      location,
    });
    setIsDrawerOpen(true);
  };

  const requestQuote = () => {
    if (!hasCheckoutLocation) return;
    navigate(`/contact?${params.toString()}`);
  };

  const params = new URLSearchParams({
    container: product?.name || 'Specialty shipping container',
    ...(location?.postalCode ? { zip: location.postalCode } : {}),
    ...(location?.marketDisplayName ? { location: location.marketDisplayName } : {}),
    source: 'Specialty product configurator',
  });

  return (
    <aside className="widget specialty-configurator">
      <div className="buy-header">
        <div className="premium-buy-tabs" aria-label="Container condition">
          <button
            type="button"
            disabled={!availableConditions.has('new')}
            className={`premium-buy-tab premium-buy-tab--new ${isNew ? 'active' : ''}`}
            onClick={() => selectCondition('new')}
          >
            <strong>BUY</strong>
            <span>NEW (One-Trip)</span>
            <small>Shipping Containers</small>
            {isNew && <span className="premium-buy-tab-check" aria-label="Selected"><Check size={12} strokeWidth={3} /></span>}
          </button>
          <button
            type="button"
            disabled={!availableConditions.has('used')}
            className={`premium-buy-tab premium-buy-tab--used ${!isNew ? 'active' : ''}`}
            onClick={() => selectCondition('used')}
          >
            <strong>BUY</strong>
            <span>USED (Working)</span>
            <small>Refrigerated Containers</small>
            {!isNew && <span className="premium-buy-tab-check" aria-label="Selected"><Check size={12} strokeWidth={3} /></span>}
          </button>
        </div>
      </div>

      <div className="step-label">ENTER ZIP / POSTAL CODE</div>
      <ZipCodeSearch
        variant="hero"
        appearance="calculator"
        showAction={false}
        showCurrentLocationControl
        className="calculator-location-search"
        placeholder="Enter your ZIP / Postal Code"
      />

      <div className="section-header"><span>CONTAINER SPECIFICATIONS</span></div>
      <div className={`main-tabs specialty-specification-tab specialty-specification-tab--${Math.min(sortedVariants.length, 3)}`} aria-label="Available specialty container specifications">
        {sortedVariants.map((variant) => {
          const active = variant.id === product?.id;
          return (
            <button key={variant.id} type="button" className={`main-tab ${active ? 'active' : ''}`} onClick={() => selectProduct(variant)}>
              <span className="tab-title">{labelFor(variant)}</span>
              <span className="tab-sub">{dimensionsFor(variant)}</span>
              <span className="tab-price">{fmt(variant.preview_price)}</span>
              {active && <span className="main-tab-active-check" aria-hidden="true"><Check size={9} /></span>}
            </button>
          );
        })}
      </div>

      <div className="section-header"><span>GRADE</span></div>
      <div className="section-card grade-section-card specialty-grade-card">
        <div className="grade-upgrade-grid">
          <div className="grade-upgrade-btn active" role="status">
            <span className="grade-name">{gradeLabel}</span>
            <span className="grade-active-check" aria-hidden="true"><Check size={11} /></span>
          </div>
        </div>
      </div>

      <div className="section-header"><span>SELECTION TYPE</span></div>
      <div className="selection-type standalone-selection-type">
        <div className="selection-btn active" role="status">
          <span className="selection-dot"><Check size={10} /></span>
          <span>First off the Stack</span>
        </div>
      </div>

      <div className="checkout">
        <div className="checkout-inner">
          <div className="tax-note"><Lock size={13} /> Sales tax calculated at checkout.</div>
          <hr className="divider" />
          <div className="total-row">
            <span className="total-lbl">Total</span>
            <div className="flex flex-col items-end">
              <span className="total-price">{fmt(product?.preview_price)}</span>
            </div>
          </div>
          <div className="relative mt-4 checkout-action-lock">
            {!hasCheckoutLocation && (
              <div className="absolute inset-0 z-20 rounded-[18px] bg-black/20 backdrop-blur-[9px] flex items-center justify-center border border-white/5">
                <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-[12px] font-medium tracking-[0.01em] shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
                  Enter ZIP to unlock checkout
                </div>
              </div>
            )}
            <div className={`transition-all duration-300 ${!hasCheckoutLocation ? 'blur-[5px] pointer-events-none select-none' : ''}`}>
              <div className="cart-row">
                <button type="button" className="add-btn ce-signature-button" disabled={!hasCheckoutLocation} onClick={addCurrentProductToCart}>
                  <ShoppingCart size={17} />
                  Add to Cart
                </button>
              </div>
              <button type="button" className="quote-btn ce-secondary-button" disabled={!hasCheckoutLocation} onClick={requestQuote}>
                Request a Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
