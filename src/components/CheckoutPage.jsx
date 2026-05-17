import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const fallbackImage =
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&q=80';

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getItemImage = (item) =>
  item.image || item.image_url || item.imageUrl || item.photo || fallbackImage;

const emptyAddress = {
  firstName: '',
  lastName: '',
  company: '',
  country: 'United States',
  address: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
};

const CheckoutDetails = () => {
  const navigate = useNavigate();
  const { cart, getSubtotal, getGrandTotal } = useCart();

  const subtotal = getSubtotal();
  const total = getGrandTotal();

  const [shipping, setShipping] = useState(emptyAddress);
  const [billing, setBilling] = useState(emptyAddress);
  const [sameBilling, setSameBilling] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!cart.length) navigate('/checkout');
  }, [cart.length, navigate]);

  const updateShipping = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const updateBilling = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  const shipTo = useMemo(() => {
    const parts = [shipping.city, shipping.state, shipping.zip].filter(Boolean);
    return parts.length ? parts.join(', ') : 'Enter delivery address';
  }, [shipping.city, shipping.state, shipping.zip]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/checkout/success');
  };

  if (!cart.length) return null;

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

          <form id="checkout-details-form" className="details-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input name="firstName" value={shipping.firstName} onChange={updateShipping} placeholder="First name" required />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input name="lastName" value={shipping.lastName} onChange={updateShipping} placeholder="Last name" required />
              </div>
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <input name="company" value={shipping.company} onChange={updateShipping} placeholder="Company name optional" />
            </div>

            <div className="form-group">
              <label>Country / Region *</label>
              <select name="country" value={shipping.country} onChange={updateShipping} required>
                <option>United States</option>
                <option>Canada</option>
              </select>
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input name="address" value={shipping.address} onChange={updateShipping} placeholder="House number and street name" required />
            </div>

            <div className="form-group">
              <input name="apartment" value={shipping.apartment} onChange={updateShipping} placeholder="Apartment, suite, unit, etc. optional" />
            </div>

            <div className="form-group">
              <label>Town / City *</label>
              <input name="city" value={shipping.city} onChange={updateShipping} placeholder="City" required />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>State *</label>
                <input name="state" value={shipping.state} onChange={updateShipping} placeholder="State" required />
              </div>

              <div className="form-group">
                <label>ZIP Code *</label>
                <input name="zip" value={shipping.zip} onChange={updateShipping} placeholder="ZIP code" required />
              </div>
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input name="phone" value={shipping.phone} onChange={updateShipping} placeholder="Phone number" required />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" value={shipping.email} onChange={updateShipping} placeholder="Email address" required />
            </div>

            <div className="form-group">
              <label>Order Notes Optional</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes about your order, e.g. special delivery instructions." />
            </div>

            <div className="billing-section">
              <div className="billing-title">Billing Address</div>

              <label className="billing-check">
                <input type="checkbox" checked={sameBilling} onChange={() => setSameBilling((prev) => !prev)} />
                <span>Same as shipping address</span>
              </label>

              {!sameBilling && (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input name="firstName" value={billing.firstName} onChange={updateBilling} placeholder="First name" required={!sameBilling} />
                    </div>

                    <div className="form-group">
                      <label>Last Name *</label>
                      <input name="lastName" value={billing.lastName} onChange={updateBilling} placeholder="Last name" required={!sameBilling} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Company Optional</label>
                    <input name="company" value={billing.company} onChange={updateBilling} placeholder="Company name" />
                  </div>

                  <div className="form-group">
                    <label>Country / Region *</label>
                    <select name="country" value={billing.country} onChange={updateBilling} required={!sameBilling}>
                      <option>United States</option>
                      <option>Canada</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input name="address" value={billing.address} onChange={updateBilling} placeholder="House number and street name" required={!sameBilling} />
                  </div>

                  <div className="form-group">
                    <input name="apartment" value={billing.apartment} onChange={updateBilling} placeholder="Apartment, suite, unit, etc. optional" />
                  </div>

                  <div className="form-group">
                    <label>Town / City *</label>
                    <input name="city" value={billing.city} onChange={updateBilling} placeholder="City" required={!sameBilling} />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>State *</label>
                      <input name="state" value={billing.state} onChange={updateBilling} placeholder="State" required={!sameBilling} />
                    </div>

                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input name="zip" value={billing.zip} onChange={updateBilling} placeholder="ZIP code" required={!sameBilling} />
                    </div>
                  </div>
                </>
              )}

              <button type="button" className="return-store-btn" onClick={() => navigate('/checkout')}>
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
                  <img src={getItemImage(item)} alt={item.title || 'Shipping container'} className="os-img" />

                  <div className="os-prod-copy">
                    <div className="os-prod-title">{item.title}</div>
                    <div className="os-prod-sub">{item.sub || item.grade || 'Shipping container'}</div>
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
              <em>{shipTo}</em>
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
              <strong>Disclaimer:</strong> By reserving your container, you are not committing to a purchase. We will contact you to confirm all the details and finalize the pricing.
            </div>

            <button type="submit" form="checkout-details-form" className="checkout-btn reserve-btn">
              Reserve My Container Now!
            </button>

            <section className="checkout-help checkout-summary-help">
              <p className="checkout-phone">
                <Phone size={15} />
                Need help? Call <a href="tel:+17132580199">(713) 258-0199</a>
              </p>
            </section>
          </section>
        </aside>
      </section>
    </main>
  );
};

export default CheckoutDetails;
