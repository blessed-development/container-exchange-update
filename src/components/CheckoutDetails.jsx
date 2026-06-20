import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const formatMoney = (value) => {
  return `$${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getItemImage = (item) => {
  return (
    item.image ||
    item.image_url ||
    item.imageUrl ||
    item.photo ||
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&q=80'
  );
};

const CheckoutDetails = () => {
  const navigate = useNavigate();
  const { cart, getSubtotal } = useCart();

  const subtotal = getSubtotal();
  const total = subtotal;

  const [sameBilling, setSameBilling] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    country: 'United States',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  });

  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: 'United States',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;

    setBillingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getShipTo = () => {
    const parts = [
      formData.address,
      formData.city,
      formData.state,
      formData.zip,
    ].filter(Boolean);

    return parts.length ? parts.join(', ') : 'Enter delivery address';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/checkout/success');
  };

  if (!cart.length) {
    navigate('/checkout');
    return null;
  }

  return (
    <main className="checkout-container">
      <header className="checkout-header">
        <Link to="/checkout" className="back-link">
          ← Back to Cart
        </Link>

        <Link to="/" className="checkout-logo">
          Containers<span>Exchange</span>
        </Link>

        <div className="secure-badge">
          <ShieldCheck size={14} />
          Secure Checkout
        </div>
      </header>

      <section className="checkout-main checkout-details-layout">
        <section className="cart-panel checkout-details-panel">
          <div className="cart-panel-title">
            <CreditCard size={21} />
            <h1>Shipping Address</h1>
          </div>

          <form
            id="checkout-form"
            className="details-form"
            onSubmit={handleSubmit}
          >
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="company"
                placeholder="Company name optional"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Country / Region *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option>United States</option>
                <option>Canada</option>
              </select>
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="address"
                placeholder="House number and street name"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="apartment"
                placeholder="Apartment, suite, unit, etc. optional"
                value={formData.apartment}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Town / City *</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP code"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Order Notes</label>
              <textarea
                rows="4"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes about your order, e.g. special delivery instructions."
              />
            </div>

            <div className="billing-section">
              <div className="billing-title">Billing Address</div>

              <label className="billing-check">
                <input
                  type="checkbox"
                  checked={sameBilling}
                  onChange={() => setSameBilling((prev) => !prev)}
                />
                <span>Same as shipping address</span>
              </label>

              {!sameBilling && (
                <div className="billing-fields">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={billingData.firstName}
                        onChange={handleBillingChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={billingData.lastName}
                        onChange={handleBillingChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company name optional"
                      value={billingData.company}
                      onChange={handleBillingChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Country / Region *</label>
                    <select
                      name="country"
                      value={billingData.country}
                      onChange={handleBillingChange}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="House number and street name"
                      value={billingData.address}
                      onChange={handleBillingChange}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="apartment"
                      placeholder="Apartment, suite, unit, etc. optional"
                      value={billingData.apartment}
                      onChange={handleBillingChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Town / City *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={billingData.city}
                      onChange={handleBillingChange}
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={billingData.state}
                        onChange={handleBillingChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input
                        type="text"
                        name="zip"
                        placeholder="ZIP code"
                        value={billingData.zip}
                        onChange={handleBillingChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="return-store-btn"
                onClick={() => navigate('/checkout')}
              >
                ← Back to Cart
              </button>
            </div>
          </form>
        </section>

        <aside className="checkout-sidebar checkout-details-sidebar">
          <section className="total-card details-summary-card">
            <h2>Order Summary</h2>

            <div className="os-head">
              <span>Products</span>
              <span>QTY</span>
              <span>Subtotal</span>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="os-item">
                <div className="os-item-wrap">
                  <img
                    src={getItemImage(item)}
                    alt={item.title || 'Shipping container'}
                    className="os-img"
                  />

                  <div className="os-prod-copy">
                    <div className="os-prod-title">{item.title}</div>
                    <div className="os-prod-sub">
                      {item.sub || item.grade || 'Shipping container'}
                    </div>
                  </div>
                </div>

                <div className="os-qty">{item.qty}</div>

                <div className="os-price">
                  {formatMoney(Number(item.unitPrice || 0) * Number(item.qty || 1))}
                </div>
              </div>
            ))}

            <div className="summary-divider" />

            <div className="total-row">
              <span>Subtotal</span>
              <strong>{formatMoney(subtotal)}</strong>
            </div>

            <div className="total-row os-shipto">
              <span>Ship To</span>
              <em>{getShipTo()}</em>
            </div>

            <div className="total-row tax-row">
              <span>Sales Tax</span>
              <em>Calculated at checkout</em>
            </div>

            <div className="total-row grand-total">
              <span>Total</span>
              <strong>{formatMoney(total)}</strong>
            </div>

            <div className="os-disclaimer">
              <strong>Disclaimer:</strong> By reserving your container, you are not committing
              to a purchase. We will contact you to confirm all the details and finalize the
              pricing.
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="checkout-btn reserve-btn"
            >
              Reserve My Container Now!
            </button>

            <section className="checkout-help checkout-summary-help">
              <p>
                <Lock size={14} />
                Your information is encrypted and securely processed.
              </p>
            </section>
          </section>
        </aside>
      </section>
    </main>
  );
};

export default CheckoutDetails;
