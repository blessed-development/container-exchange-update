import React from 'react';
import { useCart } from '../context/CartContext';

const OrderSummary = () => {
  const { cart, getSubtotal, getGrandTotal } = useCart();
  const subtotal = getSubtotal();
  const tax = subtotal * 0.09;
  const total = getGrandTotal();

  const formatMoney = (num) => {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="co-summary-box premium-buy-panel">
      <div className="premium-price-row">
        <div>
          <div className="premium-price-label">TOTAL</div>
          <div className="premium-price">{formatMoney(total)}</div>
        </div>
        <div className="premium-stock-pill">✓ In Stock</div>
      </div>

      <div className="premium-total-box">
        <div>
          <div className="premium-total-label">SUBTOTAL</div>
          <div className="premium-tax-note">Sales tax calculated at checkout</div>
        </div>
        <div className="premium-total-price">{formatMoney(subtotal)}</div>
      </div>

      <div className="premium-actions-row">
        <div className="premium-qty">
          <button className="premium-qty-btn">−</button>
          <span className="premium-qty-value">1</span>
          <button className="premium-qty-btn">+</button>
        </div>
        <button className="premium-cart-btn add-btn">Add to Cart</button>
      </div>

      <button className="premium-call-btn quote-btn">
        📞 Request a Quote
      </button>
    </div>
  );
};

export default OrderSummary;
