// src/components/CartDrawer.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import './CheckoutStyles.css';

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
      {/* Overlay */}
      <div className="drawer-overlay open" onClick={() => setIsDrawerOpen(false)}></div>
      
      {/* Drawer */}
      <div className="cart-drawer open">
        {/* Header */}
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

        {/* Body */}
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
                  <img 
                    className="ci-img" 
                    src={item.img} 
                    alt={item.title}
                    onError={(e) => {
                      e.target.style.background = '#2a2a32';
                      e.target.style.objectFit = 'cover';
                    }}
                  />
                  <div className="ci-qty-row">
                    <button 
                      className="ci-qty-btn" 
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      −
                    </button>
                    <span className="ci-qty-val">{item.qty}</span>
                    <button 
                      className="ci-qty-btn" 
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="ci-info">
                  <button 
                    className="ci-x" 
                    onClick={() => removeItem(item.id)}
                  >
                    ×
                  </button>
                  <div className="ci-name">{item.title}</div>
                  <div className="ci-sub">{item.sub}</div>
                  <div className="ci-price">{formatMoney(item.unitPrice)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - only show if cart has items */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-subtotal">
              <span>Subtotal</span>
              <span className="drawer-total-val">{formatMoney(getSubtotal())}</span>
            </div>
            <div className="drawer-tax-note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Sales tax calculated at checkout
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
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
