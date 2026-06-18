import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShippingCalculator.css';
import { SIZE_OPTIONS } from './SizeSelector';
import {
  ShoppingCart,
  X,
  Lock,
  MapPin,
  Check,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

import {
  lookupPostalCode,
  getCountryLabel,
  cleanPostal,
  isUsZip,
  isCanadianPostal,
  getLocalizedPrice,
  saveSelectedLocation,
  getSavedSelectedLocation,
} from '../../lib/locationEngine';

const GRADE_OPTIONS = [
  { key: 'AS_IS', label: 'AS-IS', shortLabel: 'AS-IS', adjust: 0 },
  { key: 'WWT', label: 'Wind & Water Tight', shortLabel: 'WWT', adjust: 250 },
  { key: 'CW', label: 'Cargo Worthy', shortLabel: 'CW', adjust: 550 },
  { key: 'IICL', label: 'IICL Certified', shortLabel: 'IICL', adjust: 950 },
];

const DEFAULT_GRADE_BY_CONDITION = {
  used: 'WWT',
  new: 'IICL',
};

const CONDITION_IMAGES = {
  used: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&q=80',
  new: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=500&q=80',
};

const PRODUCT_SWITCH_MAP = {
  used: {
    0: 'used-20-wwt',
    1: 'used-40-wwt',
    2: 'used-40hc-wwt',
  },
  new: {
    0: 'new-20-iicl',
    1: 'new-40-iicl',
    2: 'new-40hc-iicl',
  },
};

const EMPTY_LOCATION = {
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const CA_PROVINCES = {
  Ontario: 'ON',
  Quebec: 'QC',
  Québec: 'QC',
  Manitoba: 'MB',
  Alberta: 'AB',
  'British Columbia': 'BC',
  Saskatchewan: 'SK',
  'Nova Scotia': 'NS',
  'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL',
  'Prince Edward Island': 'PE',
  Yukon: 'YT',
  Nunavut: 'NU',
  'Northwest Territories': 'NT',
};

const fmt = (num) =>
  `$${Number(num || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function getRegionAbbreviation(address) {
  const iso =
    address?.['ISO3166-2-lvl4'] ||
    address?.['ISO3166-2-lvl6'] ||
    address?.state_code ||
    '';

  if (typeof iso === 'string' && iso.includes('-')) {
    return iso.split('-').pop();
  }

  return CA_PROVINCES[address?.state] || address?.state_code || address?.state || '';
}

async function reverseGeocode(latitude, longitude) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
  );

  if (!response.ok) {
    throw new Error('Location unavailable.');
  }

  const data = await response.json();
  const address = data?.address || {};
  const country = String(address.country_code || '').toUpperCase();

  if (!['US', 'CA'].includes(country)) {
    throw new Error('Current location must be in the United States or Canada.');
  }

  return {
    city:
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.county ||
      'Current Location',
    state: getRegionAbbreviation(address),
    postalCode: address.postcode || '',
    country,
  };
}

export default function ContainerConfigurator({
  container,
  selectedSizeIndex,
  onSizeChange,
  condition,
  onConditionChange,
  onPricingChange,
}) {
  const navigate = useNavigate();

  const {
    cart,
    addToCart: addCartItem,
    updateQuantity,
    removeItem,
    isDrawerOpen,
    setIsDrawerOpen,
    getSubtotal,
    getGrandTotal,
  } = useCart();

  const [zipOpen, setZipOpen] = useState(false);
  const [location, setLocation] = useState(() => {
    return getSavedSelectedLocation() || EMPTY_LOCATION;
  });

  const [postalInput, setPostalInput] = useState('');
  const [zipError, setZipError] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  const [grade, setGrade] = useState(
    DEFAULT_GRADE_BY_CONDITION[condition] || 'WWT'
  );
  const [qty] = useState(1);
  const [userChangedConfig, setUserChangedConfig] = useState(false);

  const hasCheckoutLocation = Boolean(location?.postalCode);

  useEffect(() => {
    setGrade(DEFAULT_GRADE_BY_CONDITION[condition] || 'WWT');
  }, [condition]);

  useEffect(() => {
    setUserChangedConfig(false);
  }, [container?.id]);

  useEffect(() => {
    const syncSavedLocation = (event) => {
      const nextLocation = event?.detail || getSavedSelectedLocation();

      if (nextLocation?.postalCode) {
        setLocation(nextLocation);
      }
    };

    syncSavedLocation();

    window.addEventListener('ce-location-change', syncSavedLocation);
    window.addEventListener('storage', syncSavedLocation);
    window.addEventListener('focus', syncSavedLocation);
    window.addEventListener('pageshow', syncSavedLocation);

    return () => {
      window.removeEventListener('ce-location-change', syncSavedLocation);
      window.removeEventListener('storage', syncSavedLocation);
      window.removeEventListener('focus', syncSavedLocation);
      window.removeEventListener('pageshow', syncSavedLocation);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('openZip') !== '1') return;

    const timer = setTimeout(() => {
      setZipOpen(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [container?.id]);

  useEffect(() => {
    const raw = postalInput.trim().toUpperCase();
    const clean = cleanPostal(raw);

    if (!clean) {
      setZipError('');
      return;
    }

    const ready = isUsZip(clean) || isCanadianPostal(clean);

    if (!ready) {
      setZipError('');
      return;
    }

    const timer = setTimeout(async () => {
      setZipError('');
      setIsLookingUp(true);

      try {
        const resolved = await lookupPostalCode(raw);
        setLocation(resolved);
        saveSelectedLocation(resolved);
        window.dispatchEvent(
          new CustomEvent('ce-location-change', {
            detail: resolved,
          })
        );
        setPostalInput('');
        setZipOpen(false);
      } catch (error) {
        setZipError(error.message || 'Enter a valid ZIP / Postal Code.');
      } finally {
        setIsLookingUp(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [postalInput]);

  const safeSizeIndex = selectedSizeIndex ?? 0;
  const sizeOption = SIZE_OPTIONS[safeSizeIndex] || SIZE_OPTIONS[0];

  const gradeOptions = GRADE_OPTIONS;
  const referenceGradeKey = DEFAULT_GRADE_BY_CONDITION[condition] || 'WWT';
  const referenceGrade =
    gradeOptions.find((g) => g.key === referenceGradeKey) || gradeOptions[1];
  const activeGrade =
    gradeOptions.find((g) => g.key === grade) || referenceGrade;
  const activeGradeDeltaFromReference =
    Number(activeGrade.adjust || 0) - Number(referenceGrade.adjust || 0);

  const openedProductPrice = Number(container?.base_price ?? container?.price ?? 0);

  const selectedStandardPrice =
    condition === 'new' ? sizeOption.newPrice : sizeOption.usedPrice;

  const basePrice =
    !userChangedConfig && openedProductPrice > 0
      ? openedProductPrice
      : selectedStandardPrice;

  const applyLocalPrice = (price) => getLocalizedPrice(price, location);
  const getPriceWithGrade = (price) =>
    Math.max(0, Number(price || 0) + activeGradeDeltaFromReference);

  const unitPrice = applyLocalPrice(getPriceWithGrade(basePrice));
  const totalPrice = unitPrice * qty;

  const getGradeDisplay = (option) => {
    const difference = Number(option.adjust || 0) - Number(activeGrade.adjust || 0);

    if (difference === 0) {
      return { text: 'Included', tone: 'included' };
    }

    if (difference < 0) {
      return { text: `Save ${fmt(Math.abs(difference)).replace('.00', '')}`, tone: 'save' };
    }

    return { text: `+${fmt(difference).replace('.00', '')}`, tone: 'add' };
  };

  useEffect(() => {
    if (typeof onPricingChange === 'function') {
      onPricingChange({
        price: unitPrice,
        hasLocalPrice: Boolean(location?.postalCode),
        location,
      });
    }
  }, [
    unitPrice,
    location?.postalCode,
    location?.city,
    location?.state,
    location?.country,
    onPricingChange,
  ]);

  const currentTitle =
    container?.name ||
    `${condition === 'new' ? 'New' : 'Used'} ${sizeOption.label} Shipping Container`;

  const currentSub =
    container?.short_description ||
    (sizeOption.height === 'high_cube'
      ? 'High Cube • 9ft 6in High'
      : 'Standard Height • 8ft 6in High');

  const selectedImage =
    container?.image_url || container?.image || CONDITION_IMAGES[condition];

  const subtotal = getSubtotal();
  const grandTotal = getGrandTotal();
  const cartCount = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0);

  const locationLabel = location.postalCode
    ? `${location.city}${location.state ? `, ${location.state}` : ''} ${
        location.postalCode
      }, ${getCountryLabel(location.country)}`
    : 'Enter your ZIP / Postal Code';

  const useCurrentLocation = () => {
    setZipError('');

    if (!navigator.geolocation) {
      setZipError('Current location is not supported by this browser.');
      return;
    }

    setIsLookingUp(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const resolved = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );

          setLocation(resolved);
          saveSelectedLocation(resolved);
          window.dispatchEvent(
            new CustomEvent('ce-location-change', {
              detail: resolved,
            })
          );
          setPostalInput('');
          setZipOpen(false);
        } catch (error) {
          setZipError(error.message || 'Location unavailable.');
        } finally {
          setIsLookingUp(false);
        }
      },
      () => {
        setZipError('Location permission denied or unavailable.');
        setIsLookingUp(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
      }
    );
  };

  const switchProduct = (nextCondition, nextSizeIndex) => {
    setUserChangedConfig(true);

    const targetId = PRODUCT_SWITCH_MAP?.[nextCondition]?.[nextSizeIndex];

    if (targetId && targetId !== container?.id) {
      navigate(`/product/${targetId}`);
    }
  };

  const handleSizeSwitch = (index) => {
    onSizeChange(index);
    switchProduct(condition, index);
  };

  const handleConditionSwitch = (nextCondition) => {
    setGrade(DEFAULT_GRADE_BY_CONDITION[nextCondition] || 'WWT');
    onConditionChange(nextCondition);
    switchProduct(nextCondition, safeSizeIndex);
  };

  const addToCart = () => {
    if (!hasCheckoutLocation) return;

    addCartItem({
      id: `${container?.id || condition}-${safeSizeIndex}-${grade}-${Date.now()}`,
      title: currentTitle,
      sub: currentSub,
      condition,
      grade: activeGrade.label,
      size: sizeOption.label,
      unitPrice,
      qty,
      image: selectedImage,
      url: container?.id ? `/product/${container.id}` : '#',
      location,
    });

    setIsDrawerOpen(true);
  };

  const openCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className="widget">
        <div className="buy-header">
          <div className="premium-buy-tabs">
            <button
              type="button"
              className={`premium-buy-tab ${condition === 'new' ? 'active' : ''}`}
              onClick={() => handleConditionSwitch('new')}
            >
              <strong>BUY</strong>
              <span>NEW (One-Trip)</span>
              <small>Shipping Containers</small>
            </button>

            <button
              type="button"
              className={`premium-buy-tab ${condition === 'used' ? 'active' : ''}`}
              onClick={() => handleConditionSwitch('used')}
            >
              <strong>BUY</strong>
              <span>USED (Wind/Water Tight)</span>
              <small>Shipping Containers</small>
            </button>
          </div>
        </div>

        <div className={`step-label ${location?.postalCode ? 'is-complete' : ''}`}>
          {location?.postalCode ? '✓ Delivery location set' : 'STEP 1 — ENTER ZIP / POSTAL CODE'}
        </div>

        <div className="zip-bar">
          <div className="zip-collapsed" onClick={() => setZipOpen(!zipOpen)}>
            <div className="zip-left">
              <MapPin size={15} />
              <span className="zip-location-text">{locationLabel}</span>
            </div>

            <div className={`zip-action ${zipOpen ? 'open' : ''}`}>
              {zipOpen ? 'Close' : 'Change'}
            </div>
          </div>

          <div className={`zip-panel ${zipOpen ? 'open' : ''}`}>
            <div className="zip-row zip-row-single">
              <input
                className="zip-input"
                placeholder="Enter your ZIP / Postal Code"
                value={postalInput}
                onChange={(e) => setPostalInput(e.target.value)}
              />
            </div>

            {isLookingUp && <div className="zip-status">Detecting location...</div>}
            {zipError && <div className="zip-error">{zipError}</div>}

            <button
              type="button"
              className="zip-loc-btn"
              onClick={useCurrentLocation}
              disabled={isLookingUp}
            >
              Use my current location
            </button>
          </div>
        </div>

        <div className="section-header">
          <span>CONTAINER SPECIFICATIONS</span>
        </div>

        <div className="main-tabs">
          {SIZE_OPTIONS.map((opt, index) => {
            const isActive = safeSizeIndex === index;
            const standardPrice =
              condition === 'new' ? opt.newPrice : opt.usedPrice;

            return (
              <button
                key={opt.label}
                type="button"
                className={`main-tab ${isActive ? 'active' : ''}`}
                onClick={() => handleSizeSwitch(index)}
              >
                <span className="tab-title">{opt.label}</span>
                <span className="tab-sub">{opt.dims}</span>
                <span className="tab-price">
                  {isActive
                    ? fmt(unitPrice)
                    : fmt(applyLocalPrice(getPriceWithGrade(standardPrice)))}
                </span>
              </button>
            );
          })}
        </div>

        <div className="cond-cards-section">
          <div className="cond-cards-head">
            <span className="card-lbl">CONDITION</span>
          </div>

          <div className="cond-cards">
            {['new', 'used'].map((cond) => {
              const active = condition === cond;
              const standardPrice =
                cond === 'new' ? sizeOption.newPrice : sizeOption.usedPrice;

              return (
                <div key={cond} className={`cond-card ${active ? 'active' : ''}`}>
                  <img src={CONDITION_IMAGES[cond]} className="cond-img" alt={cond} />

                  <div className="cc-info">
                    <span className="cc-name">{cond === 'new' ? 'NEW' : 'USED'}</span>
                    <span className="cc-price">
                      {active ? fmt(unitPrice) : fmt(applyLocalPrice(standardPrice))}
                    </span>
                  </div>

                  <span className="cc-check">
                    <Check size={10} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="section-card grade-section-card">
          <div className="card-head grade-static-head">
            <span className="card-lbl">GRADE</span>
          </div>

          <div className="grade-grid grade-upgrade-grid">
            {gradeOptions.map((g) => {
              const isActive = grade === g.key;
              const gradeDisplay = getGradeDisplay(g);

              return (
                <button
                  key={g.key}
                  type="button"
                  className={`grade-btn grade-upgrade-btn ${
                    isActive ? 'active' : ''
                  }`}
                  onClick={() => setGrade(g.key)}
                >
                  <span className="grade-name">{g.label}</span>
                  <span className={`grade-delta ${gradeDisplay.tone}`}>
                    {gradeDisplay.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="section-card">
          <div className="card-head">
            <span className="card-lbl">SELECTION TYPE</span>
          </div>

          <div className="selection-type">
            <button type="button" className="selection-btn active">
              <span className="selection-dot">
                <Check size={10} />
              </span>
              <span>First off the Stack</span>
            </button>
          </div>
        </div>

        <div className="checkout">
          <div className="checkout-inner">
            <div className="tax-note">
              <Lock size={13} />
              Sales tax calculated at checkout.
            </div>

            <hr className="divider" />

            <div className="total-row">
              <span className="total-lbl">Total</span>

              <div className="flex flex-col items-end">
                <span className="total-price">{fmt(totalPrice)}</span>
              </div>
            </div>

            <div className="checkout-action-lock relative mt-4">
              {!hasCheckoutLocation && (
                <div className="absolute inset-0 z-20 rounded-[18px] bg-black/20 backdrop-blur-[9px] flex items-center justify-center border border-white/5">
                  <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-[12px] font-medium tracking-[0.01em] shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
                    Enter ZIP to unlock checkout
                  </div>
                </div>
              )}

              <div
                className={`transition-all duration-300 ${
                  !hasCheckoutLocation
                    ? 'blur-[5px] pointer-events-none select-none'
                    : ''
                }`}
              >
                <div className="cart-row">
                  <button
                    type="button"
                    className="add-btn"
                    disabled={!hasCheckoutLocation}
                    onClick={addToCart}
                  >
                    <ShoppingCart size={17} />
                    Add to Cart
                  </button>
                </div>

                <button
                  type="button"
                  className="quote-btn"
                  disabled={!hasCheckoutLocation}
                >
                  Request a Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      <aside className={`cart-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingCart size={18} />
            My Cart <span className="cart-count">{cartCount}</span>
          </div>

          <button
            type="button"
            className="drawer-close"
            onClick={() => setIsDrawerOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} className="ci-img" alt={item.title} />

                <div className="ci-info">
                  <button
                    type="button"
                    className="ci-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    ×
                  </button>

                  <div className="ci-name">{item.title}</div>
                  <div className="ci-meta">{item.sub}</div>
                  <div className="ci-price">{fmt(item.unitPrice)}</div>

                  <div className="ci-qty-row">
                    <button
                      type="button"
                      className="ci-qty-btn"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      −
                    </button>

                    <span className="ci-qty-val">{item.qty}</span>

                    <button
                      type="button"
                      className="ci-qty-btn"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="drawer-footer">
          <div className="drawer-subtotal">
            <span>Subtotal</span>
            <span className="drawer-total-val">{fmt(grandTotal || subtotal)}</span>
          </div>

          <div className="drawer-tax-note" />

          <button type="button" className="checkout-btn" onClick={openCheckout}>
            Checkout
          </button>

          <button
            type="button"
            className="continue-btn"
            onClick={() => setIsDrawerOpen(false)}
          >
            Continue Shopping
          </button>
        </div>
      </aside>
    </>
  );
}
