// src/components/CartDrawer.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
// import './CheckoutStyles.css';
const CartDrawer = ({ onCheckout }) => {
  const { 
    cart, 
    isDrawerOpen, 
    setIsDrawerOpen, 
    updateQuantity, 
    removeItem, 
    getSubtotal,
    getGrandTotal 
  } = useCart();

  const formatMoney = (num) => {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (!isDrawerOpen) return null;

  return (
    <>
      <div className="drawer-overlay open" onClick={() => setIsDrawerOpen(false)}></div>
      <div className="cart-drawer open">
        <div className="drawer-header">
          <div className="drawer-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Your Cart
            <span className="cart-count">{itemCount}</span>
          </div>
          <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="ci-left">
                  <img className="ci-img" src={item.img} alt={item.title} />
                  <div className="ci-qty-row">
                    <button className="ci-qty-btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
                    <span className="ci-qty-val">{item.qty}</span>
                    <button className="ci-qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
                <div className="ci-info">
                  <button className="ci-x" onClick={() => removeItem(item.id)}>×</button>
                  <div className="ci-name">{item.title}</div>
                  <div className="ci-sub">{item.sub}</div>
                  <div className="ci-price">{formatMoney(item.unitPrice)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-subtotal">
              <span>Subtotal</span>
              <span className="drawer-total-val">{formatMoney(getSubtotal())}</span>
            </div>
            <div className="drawer-tax-note">Sales tax calculated at checkout</div>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
            </button>
            <button className="continue-btn" onClick={() => setIsDrawerOpen(false)}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
