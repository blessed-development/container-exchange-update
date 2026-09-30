import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';
import { COMPANY_CONTACT } from '@/config/companyContact';

const fallbackImage =
  '/images/products/new-20-iicl/hero.webp';

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

const CheckoutPage = () => {
  const navigate = useNavigate();

  const {
    cart,
    updateQuantity,
    removeItem,
    clearCart,
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

  const handleClearCart = () => {
    if (window.confirm('Remove all containers from your cart?')) {
      clearCart();
    }
  };

  if (!cart.length) {
    return (
      <main className="checkout-container">
        <header className="checkout-header">
          <button type="button" className="back-link ce-secondary-button" onClick={handleBackToStore}>
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
            <button type="button" className="ce-secondary-button" onClick={handleBackToStore}>
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
        <button type="button" className="back-link ce-secondary-button" onClick={handleBackToStore}>
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

      <section className="checkout-main">
        <section className="cart-panel">
          <div className="cart-panel-title">
            <ShoppingCart size={21} />
            <h1>My Cart</h1>
          </div>

          <div className="cart-table-head">
            <span>Item</span>
            <span>Unit Price</span>
            <span>Qty</span>
            <span>Subtotal</span>
          </div>

          <div className="cart-items">
            {cart.map((item) => {
              const lineTotal = Number(item.unitPrice || 0) * Number(item.qty || 1);

              return (
                <article className="cart-line" key={item.id}>
                  <div className="cart-product">
                    <img
                      src={getItemImage(item)}
                      alt={item.title || 'Shipping container'}
                      className="cart-product-image"
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                      }}
                    />

                    <div className="cart-product-copy">
                      {item.url && item.url !== '#' ? (
                        <Link to={item.url} className="cart-product-title">
                          {item.title}
                        </Link>
                      ) : (
                        <h2 className="cart-product-title">{item.title}</h2>
                      )}

                      {item.sub && <p className="cart-product-subtitle">{item.sub}</p>}

                      {item.rating && (
                        <div className="cart-rating">
                          ★★★★★ <span>{item.reviewCount || item.review_count || 23} reviews</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="cart-unit-price">{formatMoney(item.unitPrice)}</div>

                  <div className="cart-qty">
                    <button type="button" className="ce-utility-button" onClick={() => updateQuantity(item.id, -1)}>
                      −
                    </button>

                    <strong>{item.qty}</strong>

                    <button type="button" className="ce-utility-button" onClick={() => updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>

                  <div className="cart-line-total">{formatMoney(lineTotal)}</div>

                  <button
                    type="button"
                    className="cart-remove ce-destructive-button"
                    onClick={() => removeItem(item.id)}
                  >
                    ×
                  </button>
                </article>
              );
            })}
          </div>

          <div className="cart-panel-actions">
            <button type="button" className="return-store-btn ce-secondary-button" onClick={handleBackToStore}>
              ← Return to Store
            </button>
            <button type="button" className="cart-clear-btn ce-destructive-button" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        </section>

        <aside className="checkout-sidebar">
          <section className="total-card">
            <h2>Your Total</h2>

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

            <button type="button" className="checkout-btn ce-signature-button" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </button>

            <p className="shipping-note">
              Shipping Internationally? <Link to="/delivery">Learn more</Link>
            </p>
          </section>

          <section className="price-lock-banner">
            <h3>
              <Lock size={14} />
              Lock In Your Price - Don&apos;t Wait!
            </h3>

            <p>
              Container prices fluctuate — <strong>Order Now</strong> to secure this low price.
            </p>

            <p>
              Delivery cost is additional. To save you money, we&apos;ll negotiate with local
              carriers for the lowest shipping rate.
            </p>
          </section>

          <section className="checkout-help">
            <p>
              Questions about your request?{' '}
              <a href={`mailto:${COMPANY_CONTACT.email}`}>{COMPANY_CONTACT.email}</a>
            </p>
          </section>

        </aside>
      </section>
    </main>
  );
};

export default CheckoutPage;
