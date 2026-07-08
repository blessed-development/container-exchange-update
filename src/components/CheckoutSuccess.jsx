import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock3, MessageCircle, Phone, ShieldCheck, Truck } from 'lucide-react';
import './CheckoutPage.css';

const CheckoutSuccess = () => {
  const orderRef = useMemo(
    () => `CE-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    []
  );

  const nextSteps = [
    {
      icon: Clock3,
      title: 'Fast confirmation',
      copy: 'A container specialist reviews your request and availability shortly.',
    },
    {
      icon: Truck,
      title: 'Delivery matched',
      copy: 'We confirm the best local delivery option before finalizing shipping.',
    },
    {
      icon: MessageCircle,
      title: 'Clear follow-up',
      copy: 'You receive pricing, timing, and any final details before dispatch.',
    },
  ];

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
          <div className="success-hero">
            <div className="success-icon">
              <CheckCircle size={54} />
            </div>

            <div className="success-kicker">Request received</div>

            <h1>Reservation Confirmed</h1>

            <p>
              Thank you. Your container request is in. Our team will confirm availability,
              delivery details, and final shipping cost before anything moves forward.
            </p>
          </div>

          <div className="success-ref">
            <span>Order Reference</span>
            <strong>{orderRef}</strong>
          </div>

          <div className="success-next">
            {nextSteps.map((step) => {
              const StepIcon = step.icon;

              return (
                <article className="success-step" key={step.title}>
                  <div className="success-step-icon">
                    <StepIcon size={17} />
                  </div>

                  <div>
                    <h2>{step.title}</h2>
                    <p>{step.copy}</p>
                  </div>
                </article>
              );
            })}
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
