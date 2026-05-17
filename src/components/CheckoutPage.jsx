import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const fallbackImage =
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&q=80';

const formatMoney = (value) => {
  const amount = Number(value || 0);

  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getItemImage = (item) => {
  return item.image || item.image_url || item.imageUrl || item.photo || fallbackImage;
};

const CheckoutDetails = () => {
  const navigate = useNavigate();

  const { cart, getSubtotal, getGrandTotal } = useCart();

  const subtotal = getSubtotal();
  const total = getGrandTotal();

  const [sameBilling, setSameBilling] = useState(true);

  const shippingAddress = useMemo(() => {
    return 'Enter delivery address';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/checkout/success');
  };

  return (
    <main className="checkout-container">
      <header className="checkout-header">
        <button
          type="button"
          className="back-link"
          onClick={() => navigate('/checkout')}
        >
          ← Back to Cart
        </button>

        <Link to="/" className="checkout-logo">
          Containers<span>Exchange</span>
        </Link>

        <div className="secure-badge">
          <ShieldCheck size={14} />
          Secure Checkout
        </div>
      </header>

      <section className="checkout-main checkout-details-layout">

        {/* LEFT PANEL */}

        <section className="cart-panel checkout-details-panel">

          <div className="cart-panel-title">
            <Lock size={20} />
            <h1>Shipping Address</h1>
          </div>

          <form className="details-form" onSubmit={handleSubmit}>

            <div className="form-grid">
              <div className="form-group">
                <label>FIRST NAME *</label>
                <input type="text" placeholder="First name" />
              </div>

              <div className="form-group">
                <label>LAST NAME *</label>
                <input type="text" placeholder="Last name" />
              </div>
            </div>

            <div className="form-group">
              <label>COMPANY NAME</label>
              <input type="text" placeholder="Company name optional" />
            </div>

            <div className="form-group">
              <label>COUNTRY / REGION *</label>

              <select>
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
              </select>
            </div>

            <div className="form-group">
              <label>STREET ADDRESS *</label>
              <input type="text" placeholder="House number and street name" />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Apartment, suite, unit, etc. optional"
              />
            </div>

            <div className="form-group">
              <label>TOWN / CITY *</label>
              <input type="text" placeholder="City" />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>STATE *</label>
                <input type="text" placeholder="State" />
              </div>

              <div className="form-group">
                <label>ZIP CODE *</label>
                <input type="text" placeholder="ZIP code" />
              </div>
            </div>

            <div className="form-group">
              <label>PHONE *</label>
              <input type="text" placeholder="Phone number" />
            </div>

            <div className="form-group">
              <label>EMAIL ADDRESS *</label>
              <input type="email" placeholder="Email address" />
            </div>

            <div className="form-group">
              <label>ORDER NOTES (OPTIONAL)</label>

              <textarea placeholder="Notes about your order, e.g. special delivery instructions." />
            </div>

            {/* BILLING ADDRESS */}

            <div className="billing-section">

              <div className="billing-title">
                Billing Address
              </div>

              <label className="billing-check">
                <input
                  type="checkbox"
                  checked={sameBilling}
                  onChange={() => setSameBilling(!sameBilling)}
                />

                <span>Same as shipping address</span>
              </label>

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

        {/* RIGHT SIDEBAR */}

        <aside className="checkout-sidebar checkout-details-sidebar">

          <section className="total-card details-summary-card">

            <h2>Order Summary</h2>

            <div className="os-head">
              <span>PRODUCTS</span>
              <span>QTY</span>
              <span>SUBTOTAL</span>
            </div>

            {cart.map((item) => {

              const lineTotal =
                Number(item.unitPrice || 0) *
                Number(item.qty || 1);

              return (
                <div className="os-item" key={item.id}>

                  <div className="os-item-wrap">

                    <img
                      src={getItemImage(item)}
                      alt={item.title}
                      className="os-img"
                    />

                    <div>
                      <div className="os-prod-title">
                        {item.title}
                      </div>

                      <div className="os-prod-sub">
                        {item.sub}
                      </div>
                    </div>

                  </div>

                  <div className="os-qty">
                    {item.qty}
                  </div>

                  <div className="os-price">
                    {formatMoney(lineTotal)}
                  </div>

                </div>
              );
            })}

            <div className="summary-divider" />

            <div className="total-row">
              <span>Subtotal</span>
              <strong>{formatMoney(subtotal)}</strong>
            </div>

            <div className="total-row">
              <span>Ship To</span>
              <em>{shippingAddress}</em>
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
              <strong>Disclaimer:</strong> By reserving your container,
              you are not committing to a purchase.
              We will contact you to confirm all the details
              and finalize the pricing.
            </div>

            <button
              type="submit"
              className="checkout-btn reserve-btn"
              onClick={handleSubmit}
            >
              Reserve My Container Now!
            </button>

          </section>

          <section className="price-lock-banner">
            <h3>
              <Lock size={14} />
              Fast Delivery Coordination
            </h3>

            <p>
              Our logistics team will contact you immediately after
              order submission to coordinate delivery rates and timing.
            </p>
          </section>

          <section className="checkout-help">

            <p className="checkout-phone">
              <Phone size={15} />
              Need help? Call <a href="tel:+17132580199">(713) 258-0199</a>
            </p>

          </section>

        </aside>

      </section>
    </main>
  );
};

export default CheckoutDetails;
