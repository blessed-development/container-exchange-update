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
          height:64px;
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

        .ce-title svg{
          color:#22c55e;
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
        }

        .ce-body{
          flex:1;
          overflow-y:auto;
          padding:20px 22px;
        }

        .ce-item{
          position:relative;
          display:grid;
          grid-template-columns:84px minmax(0,1fr);
          gap:14px;
          padding:0 0 26px;
          margin-bottom:22px;
          border-bottom:1px solid rgba(255,255,255,.06);
        }

        .ce-left{
          display:flex;
          flex-direction:column;
          gap:11px;
          align-items:flex-start;
        }

        .ce-img{
          width:84px;
          height:58px;
          border-radius:13px;
          object-fit:cover;
          background:#111827;
          display:block;
        }

        .ce-qty{
          display:flex;
          align-items:center;
          gap:10px;
        }

        .ce-qty button{
          width:30px;
          height:30px;
          border:1px solid rgba(255,255,255,.08);
          border-radius:10px;
          background:#111827;
          color:#fff;
          font-size:18px;
          font-weight:800;
          cursor:pointer;
        }

        .ce-qty span{
          min-width:13px;
          text-align:center;
          font-size:15px;
          font-weight:800;
        }

        .ce-info{
          min-width:0;
          padding-right:24px;
          display:flex;
          flex-direction:column;
          align-items:flex-start;
        }

        .ce-name{
          display:block;
          width:100%;
          margin:0 0 6px;
          color:#fff;
          font-size:15px;
          font-weight:850;
          line-height:1.2;
          letter-spacing:-.02em;
          white-space:normal;
          overflow:visible;
        }

        .ce-sub{
          display:block;
          width:100%;
          margin:0;
          color:rgba(203,213,225,.67);
          font-size:12.5px;
          line-height:1.38;
          white-space:normal;
          clear:both;
        }

        .ce-price{
          margin-top:14px;
          align-self:flex-end;
          color:#18d45c;
          font-size:17px;
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
          {cart.map((item) => (
            <div className="ce-item" key={item.id}>
              <div className="ce-left">
                <img className="ce-img" src={getImage(item)} alt={item.title || 'Container'} />

                <div className="ce-qty">
                  <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              </div>

              <div className="ce-info">
                <button className="ce-remove" onClick={() => removeItem(item.id)}>
                  ×
                </button>

                <div className="ce-name">{item.title}</div>
                <div className="ce-sub">{cleanSub(item.sub || item.grade)}</div>
                <div className="ce-price">{formatMoney(item.unitPrice)}</div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="ce-footer">
            <div className="ce-subtotal">
              <span>Subtotal</span>
              <span className="ce-total">{formatMoney(getSubtotal())}</span>
            </div>

            <div className="ce-tax">Sales tax calculated at checkout</div>

            <button className="ce-checkout" onClick={onCheckout}>
              Checkout →
            </button>

            <button className="ce-continue" onClick={() => setIsDrawerOpen(false)}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
