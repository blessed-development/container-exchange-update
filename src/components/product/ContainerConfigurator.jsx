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
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const USED_GRADES = [
  { key: 'AS_IS', label: 'AS IS', adjust: 0 },
  { key: 'WWT', label: 'Wind & Water Tight', adjust: 0 },
  { key: 'CW', label: 'Cargo Worthy (CW)', adjust: 0 },
];

const NEW_GRADES = [{ key: 'IICL', label: 'IICL Certified', adjust: 0 }];

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

const fmt = (num) =>
  `$${Number(num || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function ContainerConfigurator({
  container,
  selectedSizeIndex,
  onSizeChange,
  condition,
  onConditionChange,
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
  const [zip, setZip] = useState('33304');
  const [grade, setGrade] = useState(condition === 'new' ? 'IICL' : 'WWT');
  const [qty] = useState(1);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [userChangedConfig, setUserChangedConfig] = useState(false);

  useEffect(() => {
    setGrade(condition === 'new' ? 'IICL' : 'WWT');
  }, [condition]);

  useEffect(() => {
    setUserChangedConfig(false);
  }, [container?.id]);

  const safeSizeIndex = selectedSizeIndex ?? 0;
  const sizeOption = SIZE_OPTIONS[safeSizeIndex] || SIZE_OPTIONS[0];

  const gradeOptions = condition === 'new' ? NEW_GRADES : USED_GRADES;
  const activeGrade =
    gradeOptions.find((g) => g.key === grade) || gradeOptions[0];

  const openedProductPrice = Number(container?.base_price ?? container?.price ?? 0);

  const selectedStandardPrice =
    condition === 'new' ? sizeOption.newPrice : sizeOption.usedPrice;

  const basePrice =
    !userChangedConfig && openedProductPrice > 0
      ? openedProductPrice
      : selectedStandardPrice;

  const unitPrice = basePrice;
  const totalPrice = unitPrice * qty;

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
    setGrade(nextCondition === 'new' ? 'IICL' : 'WWT');
    onConditionChange(nextCondition);
    switchProduct(nextCondition, safeSizeIndex);
  };

  const addToCart = () => {
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

        <div className="zip-bar">
          <div className="zip-collapsed">
            <button
              type="button"
              className="zip-left"
              onClick={() => setZipOpen(true)}
              style={{ background: 'transparent', border: 0, padding: 0, textAlign: 'left' }}
            >
             <MapPin size={15} />

{zipOpen ? (
  <input
    value={zip}
    onClick={(e) => e.stopPropagation()}
    onChange={(e) => setZip(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        setZipOpen(false);
      }
    }}
    placeholder="Enter ZIP / Postal Code"
    className="zip-val"
    style={{
      flex: 1,
      background: 'transparent',
      border: 0,
      outline: 'none',
      padding: 0,
      margin: 0,
      color: 'inherit',
      font: 'inherit',
      fontWeight: 800,
    }}
  />
) : (
  <span className="zip-val">
    Delivering to Fort Lauderdale, FL {zip}
  </span>
)}
            </button>

            <button
              type="button"
              className={`zip-action ${zipOpen ? 'open' : ''}`}
              onClick={() => setZipOpen(!zipOpen)}
            >
              {zipOpen ? 'Close' : 'Change'}
            </button>
          </div>

          <div className={`zip-panel ${zipOpen ? 'open' : ''}`}>
            <button className="zip-loc-btn" type="button">
              Use my current location
            </button>
          </div>
        </div>

        <div className="section-header">
          <span>CONTAINER SPECIFICATIONS</span>
          <strong>{sizeOption.label} Selected</strong>
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
                  {isActive ? fmt(basePrice) : fmt(standardPrice)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="cond-cards-section">
          <div className="cond-cards-head">
            <span className="card-lbl">CONDITION</span>
            <span className="card-val">
              {condition === 'new' ? 'NEW' : 'USED'} — {sizeOption.label}
            </span>
          </div>

          <div className="cond-cards">
            {['new', 'used'].map((cond) => {
              const active = condition === cond;
              const standardPrice =
                cond === 'new' ? sizeOption.newPrice : sizeOption.usedPrice;

              return (
                <div key={cond} className={`cond-card ${active ? 'active' : ''}`}>
                  <img
                    src={CONDITION_IMAGES[cond]}
                    className="cond-img"
                    alt={cond}
                  />

                  <div className="cc-info">
                    <span className="cc-name">
                      {cond === 'new' ? 'NEW' : 'USED'}
                    </span>

                    <span className="cc-price">
                      {active ? fmt(basePrice) : fmt(standardPrice)}
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

        <div className="section-card">
          <button
            type="button"
            className="card-head grade-dropdown-head"
            onClick={() => setGradeOpen(!gradeOpen)}
          >
            <span className="card-lbl">GRADE</span>

            <span className="card-val grade-head-val">
              {activeGrade.label}
              <ChevronDown
                size={15}
                className={`grade-head-arrow ${gradeOpen ? 'open' : ''}`}
              />
            </span>
          </button>

          {gradeOpen && (
            <div className="grade-grid">
              {gradeOptions.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  className={`grade-btn ${grade === g.key ? 'active' : ''}`}
                  onClick={() => {
                    setGrade(g.key);
                    setGradeOpen(false);
                  }}
                >
                  <span className="grade-check">
                    <Check size={10} />
                  </span>

                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="section-card">
          <div className="card-head">
            <span className="card-lbl">SELECTION TYPE</span>
            <span className="card-val">First off the Stack</span>
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
              <span className="total-price">{fmt(totalPrice)}</span>
            </div>

            <div className="cart-row">
              <button type="button" className="add-btn" onClick={addToCart}>
                <ShoppingCart size={17} />
                Add to Cart
              </button>
            </div>

            <button type="button" className="quote-btn">
              Request a Quote
            </button>
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
            <ShoppingCart size={18}/>
            My Cart
            <span className="cart-count">
              {cartCount}
            </span>
          </div>

          <button
            type="button"
            className="drawer-close"
            onClick={() => setIsDrawerOpen(false)}
          >
            <X size={16}/>
          </button>

        </div>

        <div className="drawer-body">

          {cart.length===0 ? (

            <div className="empty-cart">
              Your cart is empty.
            </div>

          ) : (

            cart.map((item)=>(

              <div className="cart-item" key={item.id}>

                <img
                  src={item.image}
                  className="ci-img"
                  alt={item.title}
                />

                <div className="ci-info">

                  <button
                    type="button"
                    className="ci-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    ×
                  </button>

                  <div className="ci-name">
                    {item.title}
                  </div>

                  <div className="ci-meta">
                    {item.sub}
                  </div>

                  <div className="ci-price">
                    {fmt(item.unitPrice)}
                  </div>

                  <div className="ci-qty-row">

                    <button
                      type="button"
                      className="ci-qty-btn"
                      onClick={() => updateQuantity(item.id,-1)}
                    >
                      −
                    </button>

                    <span className="ci-qty-val">
                      {item.qty}
                    </span>

                    <button
                      type="button"
                      className="ci-qty-btn"
                      onClick={() => updateQuantity(item.id,1)}
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
            <span className="drawer-total-val">
              {fmt(grandTotal || subtotal)}
            </span>
          </div>

          <div className="drawer-tax-note"/>

          <button
            type="button"
            className="checkout-btn"
            onClick={openCheckout}
          >
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
