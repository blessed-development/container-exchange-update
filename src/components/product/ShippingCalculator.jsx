import React, { useMemo, useState } from 'react';
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

const NEW_GRADES = [
  { key: 'IICL', label: 'IICL Certified', adjust: 0 },
];

const CONDITION_IMAGES = {
  used:
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&q=80',
  new:
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=500&q=80',
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

export default function ShippingCalculator({
  container,
  selectedSizeIndex,
  onSizeChange,
  condition,
  onConditionChange,
}) {
  const [zipOpen, setZipOpen] = useState(false);
  const [zip, setZip] = useState('');
  const [grade, setGrade] = useState(
    condition === 'new' ? 'IICL' : 'AS_IS'
  );
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

  const gradeOptions =
    condition === 'new' ? NEW_GRADES : USED_GRADES;

  const activeGrade =
    gradeOptions.find((g) => g.key === grade) ||
    gradeOptions[0];

  const unitPrice =
    (condition === 'new'
      ? sizeOption.newPrice
      : sizeOption.usedPrice) +
    (activeGrade.adjust || 0);

  const totalPrice = unitPrice * qty;

  const currentTitle = `${
    condition === 'new' ? 'New' : 'Used'
  } ${sizeOption.label} Shipping Container`;

  const currentSub = `${
    sizeOption.size || sizeOption.label
  } · ${activeGrade.label}`;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const tax = Math.max(0, subtotal - discount) * 0.09;

  const grandTotal =
    Math.max(0, subtotal - discount) + tax;

  const cartCount = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

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
        (p) =>
          p.title === item.title &&
          p.grade === item.grade
      );

      if (existing) {
        return prev.map((p) =>
          p.id === existing.id
            ? { ...p, qty: p.qty + qty }
            : p
        );
      }

      return [...prev, item];
    });

    setDrawerOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: Math.max(1, item.qty + delta),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );
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

    setCouponMsg(
      `✓ Coupon applied! You save ${fmt(saved)}`
    );
  };

  const openCheckout = () => {
    setDrawerOpen(false);
    setCheckoutOpen(true);
    setPanel('cart');
  };

  const placeOrder = () => {
    setOrderRef(
      `CE-${Math.random()
        .toString(36)
        .slice(2, 10)
        .toUpperCase()}`
    );

    setPanel('success');
  };

  return (
    <>
      <div className="widget">

        <div className="main-tabs">
          {SIZE_OPTIONS.map((opt, index) => (
            <button
              key={opt.label}
              className={`main-tab ${
                selectedSizeIndex === index
                  ? 'active'
                  : ''
              }`}
              onClick={() => onSizeChange(index)}
            >
              <span className="tab-sub">Buy</span>

              <span className="tab-title">
                {opt.label}
              </span>

              <span className="tab-sub">
                {opt.dims}
              </span>
            </button>
          ))}
        </div>

        <div className="checkout">
          <div className="checkout-inner">

            <div className="total-row">
              <span className="total-price">
                {fmt(unitPrice)}
              </span>

              <button
                className="add-btn"
                onClick={addToCart}
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>

        <div className="cond-cards-section">

          <div className="cond-cards-head">
            <span className="card-lbl">
              Condition
            </span>

            <span className="card-val">
              {condition === 'new'
                ? 'New'
                : 'Used'}{' '}
              {sizeOption.label}
            </span>
          </div>

          <div className="cond-cards">
            {['used', 'new'].map((cond) => {
              const active = condition === cond;

              const price =
                cond === 'new'
                  ? sizeOption.newPrice
                  : sizeOption.usedPrice;

              return (
                <button
                  key={cond}
                  className={`cond-card ${
                    active ? 'active' : ''
                  }`}
                  onClick={() => {
                    onConditionChange(cond);

                    setGrade(
                      cond === 'new'
                        ? 'IICL'
                        : 'AS_IS'
                    );
                  }}
                >
                  <img
                    src={CONDITION_IMAGES[cond]}
                    className="cond-img"
                  />

                  <div className="cc-info">
                    <span className="cc-name">
                      {cond === 'new'
                        ? 'New'
                        : 'Used'}{' '}
                      {sizeOption.label}
                    </span>

                    <span className="cc-price">
                      {fmt(price)}
                    </span>
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

          <div className="card-head">
            <span className="card-lbl">
              Grade
            </span>

            <span className="card-val">
              {activeGrade.label}
            </span>
          </div>

          <div className="grade-grid">
            {gradeOptions.map((g) => (
              <button
                key={g.key}
                onClick={() => setGrade(g.key)}
                className={`grade-btn ${
                  grade === g.key
                    ? 'active'
                    : ''
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

        </div>

        <div className="checkout">

          <div className="checkout-inner">

            <div className="tax-note">
              <Lock size={13} />
              Taxes and delivery calculated at
              checkout.
            </div>

            <hr className="divider" />

            <div className="total-row">
              <span className="total-lbl">
                Total
              </span>

              <span className="total-price">
                {fmt(totalPrice)}
              </span>
            </div>

            <div className="cart-row">

              <div className="qty-wrap">
                <button
                  className="qty-btn"
                  onClick={() =>
                    setQty(Math.max(1, qty - 1))
                  }
                >
                  −
                </button>

                <span className="qty-num">
                  {qty}
                </span>

                <button
                  className="qty-btn"
                  onClick={() => setQty(qty + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="add-btn"
                onClick={addToCart}
              >
                <ShoppingCart size={17} />
                Add to Cart
              </button>

            </div>

            <button className="quote-btn">
              Add to Quote
            </button>

          </div>
        </div>
      </div>

      <div
        className={`drawer-overlay ${
          drawerOpen ? 'open' : ''
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        className={`cart-drawer ${
          drawerOpen ? 'open' : ''
        }`}
      >
        <div className="drawer-header">

          <div className="drawer-title">
            <ShoppingCart size={18} />
            My Cart

            <span className="cart-count">
              {cartCount}
            </span>
          </div>

          <button
            className="drawer-close"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={16} />
          </button>

        </div>

        <div className="drawer-body">

          {cart.length === 0 ? (
            <div className="empty-cart">
              Your cart is empty.
            </div>
          ) : (
            cart.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >
                <img
                  src={item.img}
                  className="ci-img"
                />

                <div className="ci-info">

                  <button
                    className="ci-remove"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    ×
                  </button>

                  <div className="ci-name">
                    {item.title}
                  </div>

                  <div className="ci-meta">
                    {item.sub}
                    <br />
                    Grade: {item.grade}
                  </div>

                  <div className="ci-price">
                    {fmt(item.price)}
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
              {fmt(grandTotal)}
            </span>
          </div>

          <button
            className="checkout-btn"
            onClick={openCheckout}
          >
            Checkout
          </button>

        </div>
      </aside>

      <section
        className={`checkout-page ${
          checkoutOpen ? 'open' : ''
        }`}
      >

        <div className="co-topbar">

          <button
            className="co-back"
            onClick={() =>
              setCheckoutOpen(false)
            }
          >
            <ChevronLeft size={16} />
            Back to product
          </button>

          <div className="co-brand">
            Containers <span>Exchange</span>
          </div>

        </div>

        <div className="co-layout">

          <main className="co-main">

            {panel === 'success' ? (
              <div className="co-panel co-success-panel">

                <div className="co-success-icon">
                  <Check size={42} />
                </div>

                <h2>Order Received</h2>

                <p>
                  Thank you. Your container order
                  has been received.
                </p>

                <div className="co-order-ref">
                  {orderRef}
                </div>

              </div>
            ) : (
              <div className="co-panel">

                <div className="co-panel-title">
                  <Truck size={18} />
                  Delivery & Payment Details
                </div>

                <div className="co-form">

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

                  <button
                    className="co-primary-btn"
                    onClick={placeOrder}
                  >
                    Place Order
                  </button>

                </div>

              </div>
            )}

          </main>

        </div>
      </section>
    </>
  );
}
