import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const formatMoney = (value) => {
  return `$${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const CheckoutDetails = () => {
  const navigate = useNavigate();

  const {
    cart,
    getSubtotal,
    getGrandTotal,
    clearCart,
  } = useCart();

  const subtotal = getSubtotal();
  const total = getGrandTotal();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

      <section className="checkout-main">
        <section className="cart-panel">
          <div className="cart-panel-title">
            <CreditCard size={21} />
            <h1>Customer Details</h1>
          </div>

          <form className="details-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Order Notes</label>
              <textarea
                rows="5"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Delivery instructions or additional details..."
              />
            </div>

            <button type="submit" className="checkout-btn">
              Continue Secure Checkout
            </button>
          </form>
        </section>

        <aside className="checkout-sidebar">
          <section className="total-card">
            <h2>Order Summary</h2>

            {cart.map((item) => (
              <div key={item.id} className="summary-line">
                <div>
                  <strong>{item.title}</strong>
                  <p>
                    Qty {item.qty} · {item.grade}
                  </p>
                </div>

                <span>
                  {formatMoney(
                    Number(item.unitPrice || 0) * Number(item.qty || 1)
                  )}
                </span>
              </div>
            ))}

            <div className="total-row">
              <span>Subtotal</span>
              <strong>{formatMoney(subtotal)}</strong>
            </div>

            <div className="total-row tax-row">
              <span>Sales tax</span>
              <em>Calculated at checkout</em>
            </div>

            <div className="total-row grand-total">
              <span>Total</span>
              <strong>{formatMoney(total)}</strong>
            </div>
          </section>

          <section className="price-lock-banner">
            <h3>
              <Truck size={14} />
              Fast Delivery Coordination
            </h3>

            <p>
              Our logistics team will contact you immediately after order
              submission to coordinate the best delivery rates and timing.
            </p>
          </section>

          <section className="checkout-help">
            <p>
              <Lock size={14} /> Your information is encrypted and securely
              processed.
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
};

export default CheckoutDetails;
