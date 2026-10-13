import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock3, Mail, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import './CheckoutPage.css';
import { COMPANY_CONTACT } from '@/config/companyContact';

const CheckoutSuccess = () => {
  const orderRef = useMemo(
    () => window.sessionStorage.getItem('ce-last-reservation-reference') || `RES-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    []
  );

  const nextSteps = [
    {
      icon: Clock3,
      title: 'Request received',
      copy: 'A container specialist reviews your request and availability shortly.',
    },
    {
      icon: Truck,
      title: 'Availability & delivery review',
      copy: 'We confirm the best local delivery option before finalizing shipping.',
    },
    {
      icon: MessageCircle,
      title: 'Confirmation email',
      copy: 'We send your reservation receipt and follow up with the next steps.',
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
          Reservation Request Received
        </div>
      </header>

      <section className="success-page">
        <div className="success-card">
          <div className="success-hero">
            <div className="success-icon">
              <CheckCircle size={54} />
            </div>

            <div className="success-kicker">Request received</div>

            <h1>Reservation Request Received</h1>

            <p>
              Thank you. We have received your container reservation request. Our team will review
              availability and delivery details, then contact you with the next steps.
            </p>
          </div>

          <div className="success-ref">
            <span>Reservation Reference</span>
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

            <a href={`mailto:${COMPANY_CONTACT.email}`} className="success-secondary">
              <Mail size={15} />
              Email Sales
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutSuccess;
