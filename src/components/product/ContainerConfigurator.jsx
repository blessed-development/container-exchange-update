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
  { key: 'AS_IS', label: 'AS IS', adjust: -100 },
  { key: 'WWT', label: 'Wind & Water Tight', adjust: 200 },
  { key: 'CW', label: 'Cargo Worthy (CW)', adjust: 400 },
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
  const [grade, setGrade] = useState(condition === 'new' ? 'IICL' : 'AS_IS');
  const [qty, setQty] = useState(1);
  const [gradeOpen, setGradeOpen] = useState(false);
  
  useEffect(() => {
    setGrade(condition === 'new' ? 'IICL' : 'AS_IS');
  }, [condition]);

  const sizeOption = SIZE_OPTIONS[selectedSizeIndex];
  const gradeOptions = condition === 'new' ? NEW_GRADES : USED_GRADES;
  const activeGrade = gradeOptions.find((g) => g.key === grade) || gradeOptions[0];

  const unitPrice =
    (condition === 'new' ? sizeOption.newPrice : sizeOption.usedPrice) +
    (activeGrade.adjust || 0);

  const totalPrice = unitPrice * qty;

  const currentTitle = `${condition === 'new' ? 'New' : 'Used'} ${sizeOption.label} Shipping Container`;
  const currentSub = `${sizeOption.size || sizeOption.label} · ${activeGrade.label}`;
  const selectedImage = CONDITION_IMAGES[condition];

  const subtotal = getSubtotal();
  const grandTotal = getGrandTotal();
  const cartCount = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0);

  const handleSizeSwitch = (index) => {
    onSizeChange(index);

    const targetId = PRODUCT_SWITCH_MAP?.[condition]?.[index];

    if (targetId && targetId !== container?.id) {
      navigate(`/product/${targetId}`);
    }
  };

  const addToCart = () => {
    addCartItem({
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
  };

  const openCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className="widget">
        <div className="zip-bar">
          <div className="zip-collapsed" onClick={() => setZipOpen(!zipOpen)}>
            <div className="zip-left">
              <MapPin size={15} />
              <span>Delivering to Fort Lauderdale, FL</span>
              <span className="zip-val">{zip || 'Not set'}</span>
            </div>
            <div className={`zip-action ${zipOpen ? 'open' : ''}`}>Change</div>
          </div>

          <div className={`zip-panel ${zipOpen ? 'open' : ''}`}>
            <div className="zip-row">
              <input
                className="zip-input"
                placeholder="Enter ZIP code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
              <button className="zip-apply" onClick={() => setZipOpen(false)}>
                Apply
              </button>
            </div>
            <button className="zip-loc-btn">Use my current location</button>
          </div>
        </div>

        <div className="step-label">STEP 2 — SELECT CONTAINER TYPE</div>

        <div className="condition-tabs">
          <button
            className={`condition-tab ${condition === 'new' ? 'active' : ''}`}
            onClick={() => {
              onConditionChange('new');
              setGrade('IICL');
            }}
          >
            <span>NEW (One-Trip)</span>
            <small>SHIPPING CONTAINERS</small>
          </button>

          <button
            className={`condition-tab ${condition === 'used' ? 'active' : ''}`}
            onClick={() => {
              onConditionChange('used');
              setGrade('AS_IS');
            }}
          >
            <span>USED (Wind/Water Tight)</span>
            <small>SHIPPING CONTAINERS</small>
          </button>
        </div>

        <div className="section-header">
          <span>CONTAINER SPECIFICATIONS</span>
          <strong>{sizeOption.label} Selected</strong>
        </div>

        <div className="main-tabs">
          {SIZE_OPTIONS.map((opt, index) => (
            <button
              key={opt.label}
              className={`main-tab ${selectedSizeIndex === index ? 'active' : ''}`}
              onClick={() => handleSizeSwitch(index)}
            >
              <span className="tab-title">{opt.label}</span>
              <span className="tab-sub">{opt.dims}</span>
              <span className="tab-price">
                {fmt(condition === 'new' ? opt.newPrice : opt.usedPrice)}
              </span>
            </button>
          ))}
        </div>

        <div className="cond-cards-section">
          <div className="cond-cards-head">
            <span className="card-lbl">CONDITION</span>
            <span className="card-val">
              {condition === 'new' ? 'New' : 'Used'} — {sizeOption.label}
            </span>
          </div>

          <div className="cond-cards">
            {['new', 'used'].map((cond) => {
              const active = condition === cond;
              const price = cond === 'new' ? sizeOption.newPrice : sizeOption.usedPrice;

              return (
                <button
                  key={cond}
                  className={`cond-card ${active ? 'active' : ''}`}
                  onClick={() => {
                    onConditionChange(cond);
                    setGrade(cond === 'new' ? 'IICL' : 'AS_IS');
                  }}
                >
                  <img src={CONDITION_IMAGES[cond]} className="cond-img" alt={cond} />
                  <div className="cc-info">
                    <span className="cc-name">
                      {cond === 'new' ? 'New' : 'Used'} {sizeOption.label}
                    </span>
                    <span className="cc-price">{fmt(price)}</span>
                  </div>
                  <span className="cc-check">
                    <Check size={10} />
                  </span>
                </button>
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
      <span className="grade-head-tick">
        <Check size={10} />
      </span>

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
          <span>{g.label}</span>

          {g.adjust !== 0 && (
            <small>
              {g.adjust > 0 ? '+' : ''}
              {fmt(g.adjust)}
            </small>
          )}
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
            <button className="selection-btn active">
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
              <button className="add-btn" onClick={addToCart}>
                <ShoppingCart size={17} />
                Add to Cart
              </button>
            </div>

            <button className="quote-btn">Request a Quote</button>
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

          <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>
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
                  <button className="ci-remove" onClick={() => removeItem(item.id)}>
                    ×
                  </button>

                  <div className="ci-name">{item.title}</div>

                  <div className="ci-meta">
                    {item.sub}
                    <br />
                    Grade: {item.grade}
                  </div>

                  <div className="ci-price">{fmt(item.unitPrice)}</div>

                  <div className="ci-qty-row">
                    <button
                      className="ci-qty-btn"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      −
                    </button>

                    <span className="ci-qty-val">{item.qty}</span>

                    <button
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

          <div className="drawer-tax-note">Sales tax calculated at checkout.</div>

          <button className="checkout-btn" onClick={openCheckout}>
            Checkout
          </button>

          <button className="continue-btn" onClick={() => setIsDrawerOpen(false)}>
            Continue Shopping
          </button>
        </div>
      </aside>
    </>
  );
}
