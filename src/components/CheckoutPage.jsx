// src/components/CheckoutPage.jsx
import React, { useState, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import './CheckoutStyles.css';

const CheckoutPage = () => {
  const { addToCart, setIsCheckoutOpen, isCheckoutOpen, getGrandTotal } = useCart();
  
  // ========== UI State ==========
  const [mainTab, setMainTab] = useState('new'); // 'new' | 'used'
  const [condIdx, setCondIdx] = useState(2); // 0=20', 1=40', 2=40HC
  const [condCard, setCondCard] = useState('new'); // 'new' | 'used'
  const [grade, setGrade] = useState(400);
  const [gradeLabel, setGradeLabel] = useState('IICL');
  const [qty, setQty] = useState(1);
  const [zipCode, setZipCode] = useState('33304');
  const [zipDisplay, setZipDisplay] = useState('Fort Lauderdale, FL 33304');
  const [zipPanelOpen, setZipPanelOpen] = useState(false);
  const [isCheckoutOpenLocal, setIsCheckoutOpenLocal] = useState(false);
  
  // ========== Price Data ==========
  const prices = {
    new: {
      0: { used: 1350, new: 2500, label: "20' Standard", dims: "20' × 8' × 8' 6\"" },
      1: { used: 1750, new: 3350, label: "40' Standard", dims: "40' × 8' × 8' 6\"" },
      2: { used: 1950, new: 3350, label: "40' High Cube", dims: "40' × 8' × 9' 6\"" },
    },
    used: {
      0: { used: 1100, new: 2100, label: "20' Standard", dims: "20' × 8' × 8' 6\"" },
      1: { used: 1450, new: 2800, label: "40' Standard", dims: "40' × 8' × 8' 6\"" },
      2: { used: 1650, new: 2950, label: "40' High Cube", dims: "40' × 8' × 9' 6\"" },
    }
  };

  // ========== Helper Functions ==========
  const formatMoney = (num) => {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCurrentTotal = useCallback(() => {
    const data = prices[mainTab][condIdx];
    const base = condCard === 'new' ? data.new : data.used;
    return base + grade;
  }, [mainTab, condIdx, condCard, grade, prices]);

  const getItemImage = () => {
    return condCard === 'new'
      ? 'https://onsite-cdn.sfo3.cdn.digitaloceanspaces.com/wp-content/uploads/2023/10/08100424/new-20-foot-shipping-containerPRIMARY.webp'
      : 'https://onsite-cdn.sfo3.cdn.digitaloceanspaces.com/wp-content/uploads/2022/01/31061525/20ft-shipping-containers.webp';
  };

  const getItemTitle = () => {
    const data = prices[mainTab][condIdx];
    if (condCard === 'new') {
      return `NEW ${data.label} One-Trip Shipping Container`;
    }
    return `USED ${data.label} Wind & Water Tight Shipping Container`;
  };

  const getItemSubtitle = () => {
    const data = prices[mainTab][condIdx];
    const gradeShort = {
      'AS IS': 'AS IS',
      'Wind & Water Tight': 'WWT',
      'Cargo Worthy (CW)': 'CW',
      'IICL': 'IICL'
    }[gradeLabel] || gradeLabel;
    
    const height = data.label.includes("High Cube") ? "High Cube 9ft 6in High" : "Standard 8ft 6in High";
    const condition = condCard === 'new' ? 'New' : 'Used';
    return `${height} | ${condition} ${gradeShort} | ${zipDisplay}`;
  };

  // ========== Event Handlers ==========
  const handleAddToCart = () => {
    addToCart({
      title: getItemTitle(),
      sub: getItemSubtitle(),
      unitPrice: getCurrentTotal(),
      qty: qty,
      img: getItemImage(),
    });
  };

  const handleApplyZip = () => {
    if (zipCode) {
      setZipDisplay(zipCode);
      setZipPanelOpen(false);
    }
  };

  const openCheckout = () => {
    setIsCheckoutOpenLocal(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpenLocal(false);
  };

  return (
    <>
      <div className="widget">
        {/* Stock Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px 4px' }}>
          <div className="stock-badge"><span className="stock-dot"></span> In Stock</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>4.9 ★★★★★</div>
        </div>

        {/* Step 1 — ZIP Code */}
        <div className="sec-lbl">Step 1 — Enter Zip / Postal Code</div>
        <div className="zip-bar">
          <div className="zip-collapsed" onClick={() => setZipPanelOpen(!zipPanelOpen)}>
            <div className="zip-left">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Delivering to &nbsp;<span className="zip-val">{zipDisplay}</span>
            </div>
            <span className="zip-action">
              Change
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>
          {zipPanelOpen && (
            <div className="zip-panel open">
              <div className="zip-row">
                <input 
                  className="zip-input" 
                  value={zipCode} 
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="ZIP or postal code"
                />
                <button className="zip-apply" onClick={handleApplyZip}>Apply</button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2 — Main Tabs */}
        <div className="sec-lbl" style={{ marginTop: '6px' }}>Step 2 — Select Container Type</div>
        <div className="main-tabs">
          <button 
            className={`main-tab ${mainTab === 'new' ? 'active' : ''}`} 
            onClick={() => {
              setMainTab('new');
              setCondCard('new');
            }}
          >
            <span className="tab-title">NEW (One-Trip)</span>
            <span className="tab-sub">Shipping Containers</span>
          </button>
          <button 
            className={`main-tab ${mainTab === 'used' ? 'active' : ''}`} 
            onClick={() => {
              setMainTab('used');
              setCondCard('used');
            }}
          >
            <span className="tab-title">USED (Wind/Water Tight)</span>
            <span className="tab-sub">Shipping Containers</span>
          </button>
        </div>

        {/* Step 3 — Container Size Tabs */}
        <div className="cond-section">
          <div className="cond-section-head">
            <span className="cond-section-lbl">Container Specifications</span>
            <span className="cond-section-val">{prices[mainTab][condIdx].label} Selected</span>
          </div>
          <div className="cond-tabs">
            {[0, 1, 2].map((idx) => (
              <button 
                key={idx} 
                className={`cond-tab ${condIdx === idx ? 'active' : ''}`} 
                onClick={() => setCondIdx(idx)}
              >
                <div className="ct-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span className="ct-name">{prices[mainTab][idx].label}</span>
                <span className="ct-dims">{prices[mainTab][idx].dims}</span>
                <span className="ct-price">{formatMoney(condCard === 'new' ? prices[mainTab][idx].new : prices[mainTab][idx].used)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4 — Condition Cards */}
        <div className="cond-cards-section">
          <div className="cond-cards-head">
            <span className="card-lbl">Condition</span>
            <span className="card-val">{condCard === 'new' ? 'New' : 'Used'} — {prices[mainTab][condIdx].label}</span>
          </div>
          <div className="cond-cards">
            <div 
              className={`cond-card ${condCard === 'new' ? 'active' : ''}`} 
              onClick={() => {
                setCondCard('new');
                setMainTab('new');
              }}
            >
              <img 
                className="cond-img" 
                src="https://onsite-cdn.sfo3.cdn.digitaloceanspaces.com/wp-content/uploads/2023/10/08100424/new-20-foot-shipping-containerPRIMARY.webp" 
                alt="New" 
              />
              <div className="cc-info">
                <div className="cc-name"><strong>New</strong></div>
                <div className="cc-price">{formatMoney(prices[mainTab][condIdx].new)}</div>
              </div>
              <div className="cc-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <div 
              className={`cond-card ${condCard === 'used' ? 'active' : ''}`} 
              onClick={() => {
                setCondCard('used');
                setMainTab('used');
              }}
            >
              <img 
                className="cond-img" 
                src="https://onsite-cdn.sfo3.cdn.digitaloceanspaces.com/wp-content/uploads/2022/01/31061525/20ft-shipping-containers.webp" 
                alt="Used" 
              />
              <div className="cc-info">
                <div className="cc-name"><strong>Used</strong></div>
                <div className="cc-price">{formatMoney(prices[mainTab][condIdx].used)}</div>
              </div>
              <div className="cc-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 — Grade Selection */}
        <div className="section-card">
          <div className="card-head">
            <span className="card-lbl">Grade</span>
            <span className="card-val">{gradeLabel}</span>
          </div>
          <div className="grade-grid">
            {[
              { label: 'AS IS', offset: -100, mod: 'save', modText: '−$100' },
              { label: 'Wind & Water Tight', offset: 0, mod: 'base', modText: 'Base' },
              { label: 'Cargo Worthy (CW)', offset: 200, mod: 'add', modText: '+$200' },
              { label: 'IICL', offset: 400, mod: 'add', modText: '+$400' }
            ].map((g) => (
              <button 
                key={g.label} 
                className={`grade-btn ${gradeLabel === g.label ? 'active' : ''}`} 
                onClick={() => {
                  setGrade(g.offset);
                  setGradeLabel(g.label);
                }}
              >
                {g.label}
                <span className={`grade-mod ${g.mod}`}>{g.modText}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Checkout Section */}
        <div className="checkout">
          <div className="checkout-inner">
            <div className="tax-note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Sales tax calculated at checkout
            </div>
            <hr className="divider" />
            <div className="total-row">
              <span className="total-lbl">Total</span>
              <span className="total-price">{formatMoney(getCurrentTotal())}</span>
            </div>
            <div className="cart-row">
              <div className="qty-wrap">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <input className="qty-num" type="number" value={qty} readOnly />
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button className="add-btn" onClick={handleAddToCart}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <span>Add to Cart</span>
              </button>
            </div>
            <button className="quote-btn" onClick={openCheckout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Request a Quote
            </button>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer onCheckout={openCheckout} />
    </>
  );
};

export default CheckoutPage;
