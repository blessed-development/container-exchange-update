// src/components/CheckoutPage.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, updateQuantity, removeItem, getSubtotal, getGrandTotal } = useCart();

  const formatMoney = (num) => {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const subtotal = getSubtotal();
  const total = getGrandTotal();

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <button className="back-link" onClick={() => window.location.href = '/'}>
          ← Back to Store
        </button>
        <div className="logo">Containers Exchange</div>
        <div className="secure-badge">🔒 Secure Checkout</div>
      </div>

      <div className="checkout-main">
        <div className="cart-section">
          <h2>My Cart</h2>
          
          <div className="cart-table">
            <div className="cart-header">
              <span>ITEM</span>
              <span>UNIT PRICE</span>
              <span>QTY</span>
              <span>SUBTOTAL</span>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">Your cart is empty</div>
            ) : (
              cart.map((item) => (
                <div className="cart-row" key={item.id}>
                  <div className="item-info">
                    <img src={item.img} alt={item.title} className="item-image" />
                    <div className="item-details">
                      <div className="item-title">{item.title}</div>
                      <div className="item-specs">{item.sub}</div>
                    </div>
                  </div>
                  <div className="item-price">{formatMoney(item.unitPrice)}</div>
                  <div className="item-qty">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <div className="item-subtotal">{formatMoney(item.unitPrice * item.qty)}</div>
                  <button className="remove-item" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              ))
            )}
          </div>

          <button className="return-btn" onClick={() => window.location.href = '/'}>
            ← Return to Store
          </button>
        </div>

        <div className="summary-section">
          <div className="total-card">
            <h3>Your Total</h3>
            
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            
            <div className="total-row tax-row">
              <span>Sales tax</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className="total-row grand-total">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
            
            <button className="checkout-btn" onClick={() => alert('Proceed to checkout')}>
              Proceed to Checkout →
            </button>
            
            <div className="shipping-note">
              Shipping Internationally? <a href="#">Learn more</a>
            </div>
          </div>

          <div className="price-lock-banner">
            <div className="lock-title">🔒 Lock In Your Price - Don't Wait!</div>
            <p>Container prices fluctuate — <strong>Order Now</strong> to secure this low price.</p>
            <p>Delivery cost is additional. To save you money, we'll negotiate with local carriers for the lowest shipping rate.</p>
          </div>

          <div className="help-section">
            Want faster service? <a href="tel:7132580199">Give us a ring!</a> Don't forget to ask about specials in your area to see if you can save even more.
          </div>

          <div className="contact-info">
            Need help? Call <a href="tel:7132580199">(713) 258-0199</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
