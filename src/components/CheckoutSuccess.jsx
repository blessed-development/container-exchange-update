import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Phone, ShieldCheck } from 'lucide-react';
import './CheckoutPage.css';

const CheckoutSuccess = () => {
  const orderRef = `CE-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

  return (
    <main className="checkout-container">
      <header className="checkout-header">
        <Link to="/" className="back-link">
          ← Back to Store
        </Link>

        <Link to="/" className="checkout-logo">
          Containers<span>Exchange</span>
        </Link>

        <div className="secure-badge">
          <ShieldCheck size={14} />
          Reservation Confirmed
        </div>
      </header>

      <section className="success-page">
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle size={52} />
          </div>

          <h1>Reservation Confirmed</h1>

          <p>
            Thank you. Your container request has been received. Our team will contact you shortly to confirm delivery details, availability, and final shipping cost.
          </p>

          <div className="success-ref">
            <span>Order Reference</span>
            <strong>{orderRef}</strong>
          </div>

          <div className="success-actions">
            <Link to="/inventory" className="success-primary">
              Continue Shopping
            </Link>

            <a href="tel:+17132580199" className="success-secondary">
              <Phone size={15} />
              Call (713) 258-0199
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutSuccess;
