import React from 'react';
import { Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatMoney = (value) => {
  const amount = Number(value || 0);

  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const OrderSummary = ({ onCheckout }) => {
  const { getSubtotal, getGrandTotal } = useCart();

  const subtotal = getSubtotal();
  const total = getGrandTotal();

  return (
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

        <button type="button" className="checkout-btn" onClick={onCheckout}>
          Proceed to Checkout
        </button>

        <p className="shipping-note">
          Shipping Internationally? <a href="/delivery">Learn more</a>
        </p>
      </section>

      <section className="price-lock-banner">
        <h3>
          <Lock size={14} />
          Lock In Your Price - Don't Wait!
        </h3>

        <p>
          Container prices fluctuate — <strong>Order Now</strong> to secure this low price.
        </p>

        <p>
          Delivery cost is additional. To save you money, we'll negotiate with local carriers
          for the lowest shipping rate.
        </p>
      </section>
    </aside>
  );
};

export default OrderSummary;
