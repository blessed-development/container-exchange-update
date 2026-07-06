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

  const formatMoney = (num) =>
    `$${Number(num || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getImage = (item) =>
    item.img ||
    item.image ||
    item.image_url ||
    item.imageUrl ||
    item.photo ||
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&q=80';

  const cleanSub = (item) => {
    const sub = item?.sub || '';

    if (sub.includes('High Cube') || sub.includes('9ft 6in')) {
      return 'High Cube • 9ft 6in High';
    }

    if (sub.includes('Standard Height') || sub.includes('8ft 6in')) {
      return 'Standard Height • 8ft 6in High';
    }

    if (String(item?.title || '').includes('40HC')) {
      return 'High Cube • 9ft 6in High';
    }

    return 'Standard Height • 8ft 6in High';
  };

  const itemCount = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  if (!isDrawerOpen) return null;

  return (
    <>
      <style>{`
        .ce-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.58);
          z-index:9998;
        }

        .ce-drawer{
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

        .ce-head{
          height:62px;
          padding:0 22px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          border-bottom:1px solid rgba(255,255,255,.08);
        }

        .ce-title{
          display:flex;
          align-items:center;
          gap:10px;
          font-size:18px;
          font-weight:850;
        }

        .ce-count{
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

        .ce-close{
          border:0;
          background:transparent;
          color:rgba(255,255,255,.65);
          cursor:pointer;
          font-size:20px;
        }

        .ce-body{
          flex:1;
          overflow-y:auto;
          padding:16px 22px 8px;
        }

        .ce-item{
          position:relative;
          display:grid;
          grid-template-columns:74px minmax(0,1fr);
          gap:12px;
          padding:0 0 14px;
          margin-bottom:12px;
          border-bottom:1px solid rgba(255,255,255,.055);
        }

        .ce-left{
          display:flex;
          flex-direction:column;
          gap:7px;
          align-items:flex-start;
        }

        .ce-img{
          width:74px;
          height:52px;
          border-radius:11px;
          object-fit:cover;
          background:#111827;
          display:block;
        }

        .ce-qty{
          width:74px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:0;
        }

        .ce-qty button{
          width:26px;
          height:26px;
          border:1px solid rgba(255,255,255,.08);
          border-radius:9px;
          background:#111827;
          color:#fff;
          font-size:15px;
          font-weight:800;
          cursor:pointer;
        }

        .ce-qty span{
          min-width:14px;
          text-align:center;
          font-size:14px;
          font-weight:850;
        }

        .ce-info{
          min-width:0;
          padding-right:24px;
          display:flex;
          flex-direction:column;
          align-items:flex-start;
        }

        .ce-name{
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          width:100%;
          margin:0 0 4px;
          color:#fff;
          font-size:14px;
          font-weight:850;
          line-height:1.14;
          letter-spacing:-.02em;
          overflow:hidden;
        }

        .ce-sub{
          display:block;
          width:100%;
          margin:0;
          color:rgba(203,213,225,.58);
          font-size:13px;
          font-weight:600;
          line-height:1.22;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .ce-price{
          margin-top:10px;
          align-self:flex-end;
          color:#18d45c;
          font-size:16px;
          font-weight:900;
        }

        .ce-remove{
          position:absolute;
          top:-2px;
          right:0;
          width:24px;
          height:24px;
          border:0;
          background:transparent;
          color:rgba(255,255,255,.45);
          font-size:18px;
          cursor:pointer;
        }

        .ce-footer{
          padding:18px 22px 24px;
          border-top:1px solid rgba(255,255,255,.08);
        }

        .ce-subtotal{
          display:flex;
          justify-content:space-between;
          font-size:18px;
          font-weight:850;
          margin-bottom:6px;
        }

        .ce-total{
          color:#ff443d;
          font-size:24px;
          font-weight:950;
        }

        .ce-tax{
          color:rgba(203,213,225,.66);
          font-size:12.5px;
          margin-bottom:28px;
        }

        .ce-checkout{
          width:100%;
          height:48px;
          border:0;
          border-radius:16px;
          background:linear-gradient(180deg,#35df62,#22c55e);
          color:#fff;
          font-size:15px;
          font-weight:900;
          cursor:pointer;
        }

        .ce-continue{
          width:100%;
          margin-top:18px;
          border:0;
          background:transparent;
          color:rgba(203,213,225,.78);
          font-size:14px;
          font-weight:800;
          cursor:pointer;
        }
      `}</style>

      <div className="ce-overlay" onClick={() => setIsDrawerOpen(false)} />

      <div className="ce-drawer">
        <div className="ce-head">
          <div className="ce-title">
            Your Cart <span className="ce-count">{itemCount}</span>
          </div>

          <button className="ce-close" onClick={() => setIsDrawerOpen(false)}>
            ×
          </button>
        </div>

        <div className="ce-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="ce-item" key={item.id}>
                <div className="ce-left">
                  <img className="ce-img" src={getImage(item)} alt={item.title || 'Container'} />

                  <div className="ce-qty">
                    <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                      −
                    </button>

                    <span>{item.qty}</span>

                    <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>
                </div>

                <div className="ce-info">
                  <button
                    type="button"
                    className="ce-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    ×
                  </button>

                  <div className="ce-name">{item.title}</div>

                  <div className="ce-sub">{cleanSub(item)}</div>

                  <div className="ce-price">{formatMoney(item.unitPrice)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="ce-footer">
            <div className="ce-subtotal">
              <span>Subtotal</span>
              <span className="ce-total">{formatMoney(getSubtotal())}</span>
            </div>

            <div className="ce-tax">Sales tax calculated at checkout</div>

            <button type="button" className="ce-checkout" onClick={onCheckout}>
              Checkout →
            </button>

            <button
              type="button"
              className="ce-continue"
              onClick={() => setIsDrawerOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
