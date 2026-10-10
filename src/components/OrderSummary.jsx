import React from 'react';
import { Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatDeliveryEstimate, getDeliveryEstimate } from '../lib/deliveryEstimate';
import { getSavedSelectedLocation } from '../lib/locationEngine';

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
  const deliveryEstimate = getDeliveryEstimate(getSavedSelectedLocation());

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

        <div className="total-row delivery-estimate-row">
          <span>Estimated delivery</span>
          <strong>{formatDeliveryEstimate(deliveryEstimate)}</strong>
        </div>

        <p className="delivery-estimate-note">
          Final delivery cost is confirmed after route and site-access review.
        </p>

        <div className="total-row grand-total">
          <span>Total before delivery</span>
          <strong>{formatMoney(total)}</strong>
        </div>

        <button type="button" className="checkout-btn ce-signature-button" onClick={onCheckout}>
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
