import React, { useState } from 'react';
import './ShippingCalculator.css';
import { SIZE_OPTIONS } from './SizeSelector';
import {
  ShoppingCart,
  X,
  Lock,
  ChevronLeft,
  MapPin,
  Check,
  Truck,
} from 'lucide-react';

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

const COUPONS = {
  CONTAINER10: 0.1,
  SAVE200: 200,
  CE2024: 0.05,
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
  const [zipOpen, setZipOpen] = useState(false);
  const [zip, setZip] = useState('33304');
  const [grade, setGrade] = useState(condition === 'new' ? 'IICL' : 'AS_IS');
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [panel, setPanel] = useState('cart');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [payMethod, setPayMethod] = useState('card');
  const [orderRef, setOrderRef] = useState('');

  const sizeOption = SIZE_OPTIONS[selectedSizeIndex];
  const gradeOptions = condition === 'new' ? NEW_GRADES : USED_GRADES;
  const activeGrade = gradeOptions.find((g) => g.key === grade) || gradeOptions[0];

  const unitPrice =
    (condition === 'new' ? sizeOption.newPrice : sizeOption.usedPrice) +
    (activeGrade.adjust || 0);

  const totalPrice = unitPrice * qty;

  const currentTitle = `${condition === 'new' ? 'New' : 'Used'} ${sizeOption.label} Shipping Container`;
  const currentSub = `${sizeOption.size || sizeOption.label} · ${activeGrade.label}`;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.max(0, subtotal - discount) * 0.09;
  const grandTotal = Math.max(0, subtotal - discount) + tax;
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const selectedImage = CONDITION_IMAGES[condition];

  const addToCart = () => {
    const item = {
      id: `${Date.now()}`,
      title: currentTitle,
      sub: currentSub,
      condition,
      grade: activeGrade.label,
      price: unitPrice,
      qty,
      img: selectedImage,
    };

    setCart((prev) => {
      const existing = prev.find(
        (p) => p.title === item.title && p.grade === item.grade
      );

      if (existing) {
        return prev.map((p) =>
          p.id === existing.id ? { ...p, qty: p.qty + qty } : p
        );
      }

      return [...prev, item];
    });

    setDrawerOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const val = COUPONS[code];

    if (!code) {
      setCouponMsg('');
      setDiscount(0);
      return;
    }

    if (val === undefined) {
      setCouponMsg('✗ Invalid coupon code.');
      setDiscount(0);
      return;
    }

    const saved = val < 1 ? subtotal * val : val;
    setDiscount(saved);
    setCouponMsg(`✓ Coupon applied! You save ${fmt(saved)}`);
  };

  const openCheckout = () => {
    setDrawerOpen(false);
    setCheckoutOpen(true);
    setPanel('cart');
  };

  const placeOrder = () => {
    setOrderRef(`CE-${Math.random().toString(36).slice(2, 10).toUpperCase()}`);
    setPanel('success');
  };

  return (
    <>
      <div className="widget">
        {/* ZIP BAR */}
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

        {/* NEW / USED TABS */}
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

        {/* SIZE TABS */}
        <div className="main-tabs">
          {SIZE_OPTIONS.map((opt, index) => (
            <button
              key={opt.label}
              className={`main-tab ${selectedSizeIndex === index ? 'active' : ''}`}
              onClick={() => onSizeChange(index)}
            >
              <span className="tab-title">{opt.label}</span>
              <span className="tab-sub">{opt.dims}</span>
              <span className="tab-price">
                {fmt(condition === 'new' ? opt.newPrice : opt.usedPrice)}
              </span>
            </button>
          ))}
        </div>

        {/* CONDITION CARDS */}
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

        {/* GRADE */}
        <div className="section-card">
          <div className="card-head">
            <span className="card-lbl">GRADE</span>
            <span className="card-val">{activeGrade.label}</span>
          </div>

          <div className="grade-grid">
            {gradeOptions.map((g) => (
              <button
                key={g.key}
                onClick={() => setGrade(g.key)}
                className={`grade-btn ${grade === g.key ? 'active' : ''}`}
              >
                <span>{g.label}</span>
                {g.adjust !== 0 && (
                  <small>{g.adjust > 0 ? '+' : ''}{fmt(g.adjust)}</small>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SELECTION TYPE */}
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

        {/* CHECKOUT FOOTER */}
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
              <button className="add-btn" onClick={addToCart}>
                <ShoppingCart size={17} />
                Add to Cart
              </button>
            </div>

            <button className="quote-btn">Request a Quote</button>
          </div>
        </div>
      </div>

      {/* CART DRAWER */}
      <div
        className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside className={`cart-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingCart size={18} />
            My Cart <span className="cart-count">{cartCount}</span>
          </div>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.img} className="ci-img" alt={item.title} />
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
                  <div className="ci-price">{fmt(item.price)}</div>
                  <div className="ci-qty-row">
                    <button className="ci-qty-btn" onClick={() => updateQty(item.id, -1)}>
                      −
                    </button>
                    <span className="ci-qty-val">{item.qty}</span>
                    <button className="ci-qty-btn" onClick={() => updateQty(item.id, 1)}>
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
            <span className="drawer-total-val">{fmt(grandTotal)}</span>
          </div>
          <div className="drawer-tax-note">Includes estimated tax after coupon.</div>
          <button className="checkout-btn" onClick={openCheckout}>
            Checkout
          </button>
          <button className="continue-btn" onClick={() => setDrawerOpen(false)}>
            Continue Shopping
          </button>
        </div>
      </aside>

      {/* CHECKOUT PAGE */}
      <section className={`checkout-page ${checkoutOpen ? 'open' : ''}`}>
        <div className="co-topbar">
          <button className="co-back" onClick={() => setCheckoutOpen(false)}>
            <ChevronLeft size={16} />
            Back to product
          </button>

          <div className="co-brand">
            Containers <span>Exchange</span>
          </div>

          <div className="co-secure-badge">
            <Lock size={13} />
            Secure Checkout
          </div>
        </div>

        <div className="co-progress">
          <div className={`co-prog-step ${panel === 'cart' ? 'active' : panel !== 'cart' ? 'done' : ''}`}>
            <span className="prog-dot">1</span> Cart
          </div>
          <div className="co-prog-line" />
          <div className={`co-prog-step ${panel === 'details' ? 'active' : panel === 'success' ? 'done' : ''}`}>
            <span className="prog-dot">2</span> Details
          </div>
          <div className="co-prog-line" />
          <div className={`co-prog-step ${panel === 'success' ? 'active' : ''}`}>
            <span className="prog-dot">3</span> Complete
          </div>
        </div>

        <div className="co-layout">
          <main className="co-main">
            {panel === 'cart' && (
              <div className="co-panel">
                <div className="co-panel-title">My Cart</div>

                <div className="cct-wrap">
                  <div className="cct-head">
                    <span>Item</span>
                    <span>Price</span>
                    <span>Qty</span>
                    <span>Total</span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="empty-co-cart">Your cart is empty.</div>
                  ) : (
                    cart.map((item) => (
                      <div className="cct-row" key={item.id}>
                        <div className="cct-prod">
                          <img src={item.img} className="cct-img" alt={item.title} />
                          <div className="cct-prod-info">
                            <div className="cct-title">{item.title}</div>
                            <div className="cct-sub">{item.sub}</div>
                          </div>
                        </div>

                        <div className="cct-price">{fmt(item.price)}</div>

                        <div className="cct-qty">
                          <button className="cct-qty-btn" onClick={() => updateQty(item.id, -1)}>
                            −
                          </button>
                          <span className="cct-qty-val">{item.qty}</span>
                          <button className="cct-qty-btn" onClick={() => updateQty(item.id, 1)}>
                            +
                          </button>
                        </div>

                        <div className="cct-subtotal-cell">
                          <span className="cct-total">{fmt(item.price * item.qty)}</span>
                          <button className="cct-x-inline" onClick={() => removeItem(item.id)}>
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="co-coupon">
                  <input
                    className="co-coupon-input"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button className="co-coupon-btn" onClick={applyCoupon}>
                    Apply
                  </button>
                </div>

                {couponMsg && (
                  <div className={`co-coupon-msg ${couponMsg.startsWith('✓') ? 'ok' : 'err'}`}>
                    {couponMsg}
                  </div>
                )}

                <div className="co-panel-actions">
                  <button className="co-ghost-btn" onClick={() => setCheckoutOpen(false)}>
                    Continue Shopping
                  </button>
                  <button className="co-primary-btn" onClick={() => setPanel('details')}>
                    Continue to Details
                  </button>
                </div>
              </div>
            )}

            {panel === 'details' && (
              <div className="co-panel">
                <div className="co-panel-title">
                  <Truck size={18} />
                  Delivery & Payment Details
                </div>

                <div className="co-form">
                  <div className="co-form-section-lbl">Contact Information</div>

                  <div className="co-row">
                    <div className="co-field">
                      <label>First Name</label>
                      <input />
                    </div>
                    <div className="co-field">
                      <label>Last Name</label>
                      <input />
                    </div>
                  </div>

                  <div className="co-row">
                    <div className="co-field">
                      <label>Email</label>
                      <input type="email" />
                    </div>
                    <div className="co-field">
                      <label>Phone</label>
                      <input />
                    </div>
                  </div>

                  <div className="co-form-section-lbl">Delivery Address</div>

                  <div className="co-field">
                    <label>Street Address</label>
                    <input />
                  </div>

                  <div className="co-row">
                    <div className="co-field">
                      <label>City</label>
                      <input />
                    </div>
                    <div className="co-field">
                      <label>State</label>
                      <input />
                    </div>
                  </div>

                  <div className="co-row">
                    <div className="co-field">
                      <label>ZIP Code</label>
                      <input defaultValue={zip} />
                    </div>
                    <div className="co-field">
                      <label>Delivery Type</label>
                      <select>
                        <option>Standard Delivery</option>
                        <option>Expedited Delivery</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="co-pay-methods">
                  {['card', 'bank'].map((type) => (
                    <div
                      key={type}
                      className={`pay-method ${payMethod === type ? 'active' : ''}`}
                      onClick={() => setPayMethod(type)}
                    >
                      <div className="pay-method-head">
                        <span className={`pay-radio ${payMethod === type ? 'active' : ''}`} />
                        <span className="pay-method-name">
                          {type === 'card' ? 'Credit / Debit Card' : 'Bank Transfer'}
                        </span>
                      </div>

                      {payMethod === type && (
                        <div className="pay-method-body">
                          {type === 'card'
                            ? 'Enter card details securely during final payment confirmation.'
                            : 'Bank transfer instructions will be provided after placing your order.'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="co-panel-actions">
                  <button className="co-ghost-btn" onClick={() => setPanel('cart')}>
                    Back
                  </button>
                  <button className="co-primary-btn" onClick={placeOrder}>
                    Place Order
                  </button>
                </div>
              </div>
            )}

            {panel === 'success' && (
              <div className="co-panel co-success-panel">
                <div className="co-success-icon">
                  <Check size={42} />
                </div>
                <h2>Order Received</h2>
                <p>
                  Thank you. Your container order has been received. Our team will contact
                  you shortly to confirm delivery details.
                </p>
                <div className="co-order-ref">{orderRef}</div>
              </div>
            )}
          </main>

          {panel !== 'success' && (
            <aside className="co-sidebar">
              <div className="co-summary-box">
                <div className="co-summary-hd">Order Summary</div>

                {cart.map((item) => (
                  <div className="co-sum-item" key={item.id}>
                    <img src={item.img} className="co-sum-item-img" alt={item.title} />
                    <div className="co-sum-item-info">
                      <div className="co-sum-item-name">{item.title}</div>
                      <div className="co-sum-item-meta">
                        Qty {item.qty} · {item.grade}
                      </div>
                    </div>
                    <div className="co-sum-item-price">{fmt(item.price * item.qty)}</div>
                  </div>
                ))}

                <hr className="co-sum-divider" />

                <div className="co-sum-row">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="co-sum-row">
                    <span>Discount</span>
                    <span>-{fmt(discount)}</span>
                  </div>
                )}

                <div className="co-sum-row">
                  <span>Estimated Tax</span>
                  <span>{fmt(tax)}</span>
                </div>

                <div className="co-sum-row co-sum-total-row">
                  <span>Total</span>
                  <span>{fmt(grandTotal)}</span>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
