// src/components/CartDrawer.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ onCheckout }) => {
  const {
    cart,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeItem,
    getSubtotal,
  } = useCart();

  const formatMoney = (num) => {
    return `$${Number(num || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getImage = (item) => {
    return (
      item.img ||
      item.image ||
      item.image_url ||
      item.imageUrl ||
      item.photo ||
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&q=80'
    );
  };

  const cleanSub = (sub) => {
    if (!sub) return 'Shipping container';

    return String(sub)
      .replace(/Grade:/gi, ' · Grade:')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const itemCount = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  if (!isDrawerOpen) return null;

  return (
    <>
      <style>{`
        .drawer-overlay.open{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.55);
          z-index:9998;
        }

        .cart-drawer.open{
          position:fixed;
          top:0;
          right:0;
          width:min(420px,100vw);
          height:100vh;
          z-index:9999;
          background:#07090d;
          color:#fff;
          display:flex;
          flex-direction:column;
          border-left:1px solid rgba(255,255,255,.08);
          box-shadow:-30px 0 80px rgba(0,0,0,.55);
        }

        .drawer-header{
          height:64px;
          padding:0 22px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          border-bottom:1px solid rgba(255,255,255,.08);
        }

        .drawer-title{
          display:flex;
          align-items:center;
          gap:10px;
          font-size:18px;
          font-weight:850;
        }

        .drawer-title svg{
          color:#22c55e;
        }

        .cart-count{
          min-width:24px;
          height:24px;
          padding:0 7px;
          border-radius:999px;
          background:#22c55e;
          color:#050607;
          font-size:12px;
          font-weight:900;
          display:inline-flex;
          align-items:center;
          justify-content:center;
        }

        .drawer-close{
          border:0;
          background:transparent;
          color:rgba(255,255,255,.65);
          cursor:pointer;
        }

        .drawer-body{
          flex:1;
          overflow-y:auto;
          padding:20px 22px;
        }

        .cart-item{
          position:relative;
          display:grid;
          grid-template-columns:84px minmax(0,1fr);
          gap:14px;
          padding:0 0 24px;
          margin-bottom:22px;
          border-bottom:1px solid rgba(255,255,255,.06);
        }

        .ci-left{
          display:flex;
          flex-direction:column;
          gap:11px;
          align-items:flex-start;
        }

        .ci-img{
          width:84px;
          height:58px;
          border-radius:13px;
          object-fit:cover;
          background:#111827;
          display:block;
          flex-shrink:0;
        }

        .ci-qty-row{
          display:flex;
          align-items:center;
          gap:10px;
        }

        .ci-qty-btn{
          width:30px;
          height:30px;
          border:1px solid rgba(255,255,255,.08);
          border-radius:10px;
          background:#111827;
          color:#fff;
          font-size:18px;
          font-weight:800;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .ci-qty-val{
          min-width:13px;
          color:#fff;
          font-size:15px;
          font-weight:800;
          text-align:center;
        }

        .ci-info{
          position:relative;
          min-width:0;
          padding-right:24px;
          display:flex;
          flex-direction:column;
          align-items:flex-start;
        }

        .ci-name{
          width:100%;
          margin:0 0 5px;
          color:#fff;
          font-size:15px;
          font-weight:850;
          line-height:1.18;
          letter-spacing:-.02em;
          white-space:normal;
        }

        .ci-sub{
          width:100%;
          margin:0;
          color:rgba(203,213,225,.67);
          font-size:12.5px;
          line-height:1.35;
          white-space:normal;
        }

        .ci-price{
          margin-top:14px;
          align-self:flex-end;
          color:#18d45c;
          font-size:17px;
          font-weight:900;
          letter-spacing:-.02em;
        }

        .ci-x{
          position:absolute;
          top:-2px;
          right:0;
          width:24px;
          height:24px;
          border:0;
          border-radius:999px;
          background:transparent;
          color:rgba(255,255,255,.45);
          font-size:18px;
          cursor:pointer;
        }

        .drawer-footer{
          padding:18px 22px 24px;
          border-top:1px solid rgba(255,255,255,.08);
          background:linear-gradient(180deg,rgba(255,255,255,.025),rgba(255,255,255,.01));
        }

        .drawer-subtotal{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          font-size:18px;
          font-weight:850;
          margin-bottom:6px;
        }

        .drawer-total-val{
          color:#ff443d;
          font-size:24px;
          font-weight:950;
        }

        .drawer-tax-note{
          color:rgba(203,213,225,.66);
          font-size:12.5px;
          margin-bottom:28px;
        }

        .checkout-btn{
          width:100%;
          height:48px;
          border:0;
          border-radius:16px;
          background:linear-gradient(180deg,#35df62,#22c55e);
          color:#fff;
          font-size:15px;
          font-weight:900;
          cursor:pointer;
          box-shadow:0 18px 42px rgba(34,197,94,.28);
        }

        .continue-btn{
          width:100%;
          margin-top:18px;
          border:0;
          background:transparent;
          color:rgba(203,213,225,.78);
          font-size:14px;
          font-weight:800;
          cursor:pointer;
        }

        .empty-cart{
          min-height:260px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          color:rgba(203,213,225,.75);
          gap:14px;
          text-align:center;
        }

        @media(max-width:480px){
          .cart-drawer.open{
            width:100vw;
          }

          .cart-item{
            grid-template-columns:82px minmax(0,1fr);
            gap:12px;
          }

          .ci-name{
            font-size:14.5px;
          }

          .ci-price{
            font-size:16px;
          }
        }
      `}</style>

      <div className="drawer-overlay open" onClick={() => setIsDrawerOpen(false)} />

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
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="ci-left">
                  <img className="ci-img" src={getImage(item)} alt={item.title || 'Container'} />

                  <div className="ci-qty-row">
                    <button className="ci-qty-btn" onClick={() => updateQuantity(item.id, -1)}>
                      −
                    </button>

                    <span className="ci-qty-val">{item.qty}</span>

                    <button className="ci-qty-btn" onClick={() => updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>
                </div>

                <div className="ci-info">
                  <button className="ci-x" onClick={() => removeItem(item.id)}>
                    ×
                  </button>

                  <div className="ci-name">{item.title}</div>

                  <div className="ci-sub">{cleanSub(item.sub || item.grade)}</div>

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
              Checkout →
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
