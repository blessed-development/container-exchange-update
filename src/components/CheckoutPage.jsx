import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Phone, ShieldCheck, ShoppingCart, Star } from 'lucide-react';
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

const getRatingValue = (item) => {
  return Number(item.rating || item.stars || 4.9);
};

const getReviewCount = (item) => {
  return Number(item.reviewCount || item.review_count || item.ratingCount || 23);
};

const RatingStars = ({ rating = 4.9, count = 23 }) => {
  return (
    <div className="cct-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={13}
          fill={star <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke="#f59e0b"
          strokeWidth={1.6}
        />
      ))}

      <span className="cct-rating-count">({count})</span>
    </div>
  );
};

const CheckoutPage = () => {
  const navigate = useNavigate();

  const {
    cart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getGrandTotal,
  } = useCart();

  const subtotal = getSubtotal();
  const total = getGrandTotal();

  const handleBackToStore = () => {
    navigate('/inventory');
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout/details');
  };

  if (!cart.length) {
    return (
      <main className="checkout-container">
        <header className="checkout-header">
          <button type="button" className="back-link" onClick={handleBackToStore}>
            ← Back to Store
          </button>

          <Link to="/" className="checkout-logo">
            Containers<span>Exchange</span>
          </Link>

          <div className="secure-badge">
            <ShieldCheck size={14} />
            Secure Checkout
          </div>
        </header>

        <section className="empty-cart">
          <div className="empty-cart-card">
            <ShoppingCart size={34} />

            <h1>Your cart is empty</h1>

            <p>Add a container to your cart before checkout.</p>

            <button type="button" onClick={handleBackToStore}>
              Continue Shopping
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-container">
      <header className="checkout-header">
        <button type="button" className="back-link" onClick={handleBackToStore}>
          ← Back to Store
        </button>

        <Link to="/" className="checkout-logo">
          Containers<span>Exchange</span>
        </Link>

        <div className="secure-badge">
          <ShieldCheck size={14} />
          Secure Checkout
        </div>
      </header>

      <section className="co-layout co-step-cart">
        <div className="co-main">
          <section className="co-panel">
            <div className="co-panel-title">
              <ShoppingCart size={18} />
              <span>My Cart</span>
            </div>

            <div className="cct-wrap">
              <div className="cct-head">
                <span className="cct-h-product">Item</span>
                <span className="cct-h-price">Unit Price</span>
                <span className="cct-h-qty">QTY</span>
                <span className="cct-h-total">Subtotal</span>
              </div>

              <div className="co-cart-rows">
                {cart.map((item) => {
                  const qty = Number(item.qty || 1);
                  const unitPrice = Number(item.unitPrice || 0);
                  const lineTotal = unitPrice * qty;
                  const subtitle =
                    item.sub ||
                    item.subtitle ||
                    item.description ||
                    item.grade ||
                    'Shipping container';

                  return (
                    <article className="cct-row" key={item.id}>
                      <div className="cct-prod">
                        <img
                          src={getItemImage(item)}
                          alt={item.title || 'Shipping container'}
                          className="cct-img"
                        />

                        <div className="cct-prod-info">
                          {item.url && item.url !== '#' ? (
                            <Link to={item.url} className="cct-title" title={item.title}>
                              {item.title}
                            </Link>
                          ) : (
                            <div className="cct-title" title={item.title}>
                              {item.title}
                            </div>
                          )}

                          <div className="cct-sub" title={subtitle}>
                            {subtitle}
                          </div>

                          <RatingStars
                            rating={getRatingValue(item)}
                            count={getReviewCount(item)}
                          />
                        </div>
                      </div>

                      <div className="cct-price">{formatMoney(unitPrice)}</div>

                      <div className="cct-qty">
                        <button
                          type="button"
                          className="cct-qty-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="cct-qty-val">{qty}</span>

                        <button
                          type="button"
                          className="cct-qty-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="cct-subtotal-cell">
                        <span className="cct-total">{formatMoney(lineTotal)}</span>
                      </div>

                      <button
                        type="button"
                        className="cct-x-inline"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        title="Remove"
                      >
                        ×
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="co-panel-actions">
              <button type="button" className="co-ghost-btn" onClick={handleBackToStore}>
                ← Return to Store
              </button>
            </div>
          </section>
        </div>

        <aside className="co-sidebar">
          <section className="co-summary-box">
            <div className="co-summary-hd">TEST TOTAL</div>
            <div className="co-sum-divider" />

            <div className="co-sum-row">
              <span>Subtotal</span>
              <span id="sc-subtotal">{formatMoney(subtotal)}</span>
            </div>

            <div className="co-sum-row cart-tax-note-row">
              <span>Sales tax</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="co-sum-divider" />

            <div className="co-sum-row co-sum-total-row cart-total-row">
              <span>Total</span>
              <span id="sc-total">{formatMoney(total)}</span>
            </div>

            <button type="button" className="co-place-btn" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </button>

            <p className="shipping-note">
              Shipping Internationally? <Link to="/delivery">Learn more</Link>
            </p>
          </section>

          <section className="lock-banner">
            <div className="lock-title">
              <Lock size={14} />
              <span>Lock In Your Price - Don&apos;t Wait!</span>
            </div>

            <p>
              Container prices fluctuate — <strong>Order Now</strong> to secure this low price.
            </p>

            <p>
              Delivery cost is additional. To save you money, we&apos;ll negotiate with local
              carriers for the lowest shipping rate.
            </p>
          </section>

          <section className="want-faster">
            <p>
              Want faster service? <a href="tel:+17132580199">Give us a ring!</a> Don&apos;t
              forget to ask about specials in your area to see if you can save even more.
            </p>

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

export default CheckoutPage;
