import React, { useEffect, useMemo, useState } from 'react';
import { Check, FileText, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ZipCodeSearch from '@/components/shared/ZipCodeSearch';
import { inventoryProducts } from '@/data/inventoryProducts';
import { getSavedSelectedLocation } from '@/lib/locationEngine';
import './ShippingCalculator.css';

const dimensionsFor = (product) => {
  const height = product?.height === 'high_cube' ? "9'6\" H" : "8'6\" H";
  return `${product?.size || 20}' L × 8' W × ${height}`;
};

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
  const [location, setLocation] = useState(() => getSavedSelectedLocation() || EMPTY_LOCATION);
  const onLocationChangeRef = React.useRef(onLocationChange);
  const family = productFamily(product);
  const activeCondition = conditionKey(product);
  const isNew = activeCondition === 'new';
  const gradeLabel = isNew ? 'IICL Certified' : 'Used Reefer';
  const gradeNote = isNew
    ? 'New one-trip specialty configuration'
    : 'Working-condition details confirmed by quote';

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
          const label = `${variant.size}ft${variant.height === 'high_cube' ? ' High Cube' : ''}`;
          return (
            <button key={variant.id} type="button" className={`main-tab ${active ? 'active' : ''}`} onClick={() => selectProduct(variant)}>
              <span className="tab-title">{label}</span>
              <span className="tab-sub">{dimensionsFor(variant)}</span>
              <span className="tab-price">${Number(variant.preview_price || 0).toLocaleString()}</span>
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
            <span className="grade-delta included">{gradeNote}</span>
            <span className="grade-active-check" aria-hidden="true"><Check size={11} /></span>
          </div>
        </div>
      </div>

      <div className="section-header"><span>SELECTION TYPE</span></div>
      <div className="selection-type standalone-selection-type">
        <div className="selection-btn active" role="status">
          <span className="selection-dot"><Check size={10} /></span>
          <span>Quote confirmation required</span>
        </div>
      </div>

      <div className="checkout">
        <div className="checkout-inner">
          <div className="tax-note"><Lock size={13} /> Quote-only configuration</div>
          <hr className="divider" />
          <div className="total-row">
            <span className="total-lbl">Preview Price</span>
            <div className="flex flex-col items-end">
              <span className="total-price">${Number(product?.preview_price || 0).toLocaleString()}</span>
              <span className="mt-1 text-right text-[10px] font-medium text-muted-foreground">Construction display only</span>
            </div>
          </div>
          <Link to={`/contact?${params.toString()}`} className="ce-signature-link mt-4 block">
            <span className="ce-signature-button flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Request a Quote
            </span>
          </Link>
          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">No payment is collected from this page. Final price and configuration are confirmed by quote.</p>
        </div>
      </div>
    </aside>
  );
}
