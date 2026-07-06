import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const fallbackImage =
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&q=80';

const formatMoney = (value) => {
  return `$${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getItemImage = (item) => {
  return (
    item.image ||
    item.image_url ||
    item.imageUrl ||
    item.photo ||
    fallbackImage
  );
};



const cleanSub = (item) => {
  const sub = item?.sub || '';

  if (sub.includes('High Cube') || sub.includes('9ft 6in') || String(item?.title || '').includes('40HC')) {
    return 'High Cube • 9ft 6in High';
  }

  if (sub.includes('Standard Height') || sub.includes('8ft 6in')) {
    return 'Standard Height • 8ft 6in High';
  }

  return 'Standard Height • 8ft 6in High';
};

const TAX_RATES = {
  US: {
    AL: 0.04,
    AK: 0,
    AZ: 0.056,
    AR: 0.065,
    CA: 0.0725,
    CO: 0.029,
    CT: 0.0635,
    DE: 0,
    FL: 0.06,
    GA: 0.04,
    HI: 0.04,
    IA: 0.06,
    ID: 0.06,
    IL: 0.0625,
    IN: 0.07,
    KS: 0.065,
    KY: 0.06,
    LA: 0.0445,
    MA: 0.0625,
    MD: 0.06,
    ME: 0.055,
    MI: 0.06,
    MN: 0.06875,
    MO: 0.04225,
    MS: 0.07,
    MT: 0,
    NC: 0.0475,
    ND: 0.05,
    NE: 0.055,
    NH: 0,
    NJ: 0.06625,
    NM: 0.05125,
    NV: 0.0685,
    NY: 0.04,
    OH: 0.0575,
    OK: 0.045,
    OR: 0,
    PA: 0.06,
    RI: 0.07,
    SC: 0.06,
    SD: 0.042,
    TN: 0.07,
    TX: 0.0625,
    UT: 0.0485,
    VA: 0.043,
    VT: 0.06,
    WA: 0.065,
    WI: 0.05,
    WV: 0.06,
    WY: 0.04,
    DC: 0.06,
  },
  CA: {
    AB: 0.05,
    BC: 0.12,
    MB: 0.12,
    NB: 0.15,
    NL: 0.15,
    NS: 0.15,
    NT: 0.05,
    NU: 0.05,
    ON: 0.13,
    PE: 0.15,
    QC: 0.14975,
    SK: 0.11,
    YT: 0.05,
  },
};

const REGION_ALIASES = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
  'district of columbia': 'DC',
  alberta: 'AB',
  'british columbia': 'BC',
  manitoba: 'MB',
  'new brunswick': 'NB',
  'newfoundland and labrador': 'NL',
  'nova scotia': 'NS',
  'northwest territories': 'NT',
  nunavut: 'NU',
  ontario: 'ON',
  'prince edward island': 'PE',
  quebec: 'QC',
  québec: 'QC',
  saskatchewan: 'SK',
  yukon: 'YT',
};

const getCountryCode = (country) =>
  String(country || '').toLowerCase().includes('canada') ? 'CA' : 'US';

const normalizeRegion = (value) => {
  const raw = String(value || '').trim();
  const upper = raw.toUpperCase();

  if (/^[A-Z]{2}$/.test(upper)) return upper;

  return REGION_ALIASES[raw.toLowerCase()] || upper;
};

const calculateSalesTax = ({ amount, country, state }) => {
  const countryCode = getCountryCode(country);
  const region = normalizeRegion(state);
  const rate = TAX_RATES[countryCode]?.[region] ?? 0;

  return {
    amount: Number((Number(amount || 0) * rate).toFixed(2)),
    countryCode,
    region,
    rate,
  };
};

const CheckoutDetails = () => {
  const navigate = useNavigate();
  const { cart, getSubtotal, getGrandTotal, clearCart } = useCart();

  const subtotal = getSubtotal();
  const taxableAmount = getGrandTotal();

  const [sameBilling, setSameBilling] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    country: 'United States',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  });

  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: 'United States',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
  });
  const [showAllItems, setShowAllItems] = useState(false);

  const salesTax = calculateSalesTax({
    amount: taxableAmount,
    country: formData.country,
    state: formData.state,
  });

  const total = taxableAmount + salesTax.amount;
  const taxLabel = salesTax.region
    ? `${salesTax.region} ${(salesTax.rate * 100).toFixed(3).replace(/\.?0+$/, '')}%`
    : 'Enter state/province';
  const visibleCartItems = showAllItems ? cart : cart.slice(0, 3);
  const hiddenItemCount = Math.max(0, cart.length - visibleCartItems.length);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;

    setBillingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getShipTo = () => {
    const parts = [
      formData.address,
      formData.city,
      formData.state,
      formData.zip,
    ]
      .map((part) => String(part || '').trim().replace(/,+$/, ''))
      .filter(Boolean);

    return parts.length ? parts.join(', ') : 'Enter delivery address';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearCart();
    navigate('/checkout/success');
  };

  if (!cart.length) {
    navigate('/checkout');
    return null;
  }

  return (
    <main className="checkout-container">
      <header className="checkout-header">
        <Link to="/checkout" className="back-link">
          ← Back to Cart
        </Link>

        <Link to="/" className="checkout-logo">
          Containers<span>Exchange</span>
        </Link>

        <div className="secure-badge">
          <ShieldCheck size={14} />
          Secure Checkout
        </div>
      </header>

      <section className="checkout-main checkout-details-layout">
        <section className="cart-panel checkout-details-panel">
          <div className="cart-panel-title">
            <CreditCard size={21} />
            <h1>Shipping Address</h1>
          </div>

          <form
            id="checkout-form"
            className="details-form"
            onSubmit={handleSubmit}
          >
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="company"
                placeholder="Company name optional"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Country / Region *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option>United States</option>
                <option>Canada</option>
              </select>
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="address"
                placeholder="House number and street name"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="apartment"
                placeholder="Apartment, suite, unit, etc. optional"
                value={formData.apartment}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Town / City *</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP code"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Order Notes</label>
              <textarea
                rows="4"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes about your order, e.g. special delivery instructions."
              />
            </div>

            <div className="billing-section">
              <div className="billing-title">Billing Address</div>

              <label className="billing-check">
                <input
                  type="checkbox"
                  checked={sameBilling}
                  onChange={() => setSameBilling((prev) => !prev)}
                />
                <span>Same as shipping address</span>
              </label>

              {!sameBilling && (
                <div className="billing-fields">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={billingData.firstName}
                        onChange={handleBillingChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={billingData.lastName}
                        onChange={handleBillingChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company name optional"
                      value={billingData.company}
                      onChange={handleBillingChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Country / Region *</label>
                    <select
                      name="country"
                      value={billingData.country}
                      onChange={handleBillingChange}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="House number and street name"
                      value={billingData.address}
                      onChange={handleBillingChange}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="apartment"
                      placeholder="Apartment, suite, unit, etc. optional"
                      value={billingData.apartment}
                      onChange={handleBillingChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Town / City *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={billingData.city}
                      onChange={handleBillingChange}
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={billingData.state}
                        onChange={handleBillingChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input
                        type="text"
                        name="zip"
                        placeholder="ZIP code"
                        value={billingData.zip}
                        onChange={handleBillingChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="return-store-btn"
                onClick={() => navigate('/checkout')}
              >
                ← Back to Cart
              </button>
            </div>
          </form>
        </section>

        <aside className="checkout-sidebar checkout-details-sidebar">
          <section className="total-card details-summary-card">
            <h2>Order Summary</h2>

            <div className="os-head">
              <span>Products</span>
              <span>QTY</span>
              <span>Subtotal</span>
            </div>

            {visibleCartItems.map((item) => (
              <div key={item.id} className="os-item">
                <div className="os-item-wrap">
                  <img
                    src={getItemImage(item)}
                    alt={item.title || 'Shipping container'}
                    className="os-img"
                    onError={(event) => {
                      event.currentTarget.src = fallbackImage;
                    }}
                  />

                  <div className="os-prod-copy">
                    <div className="os-prod-title">{item.title}</div>

                    <div className="os-prod-sub">
                      {cleanSub(item)}
                    </div>

                    {!!item.rating && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '6px',
                          color: '#fbbf24',
                          fontSize: '12px',
                          lineHeight: 1,
                        }}
                      >
                        <span>★★★★★</span>
                        <span style={{ color: 'rgba(255,255,255,.72)' }}>
                          ({item.reviewCount || item.review_count || 0})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="os-qty">{item.qty}</div>

                <div className="os-price">
                  {formatMoney(Number(item.unitPrice || 0) * Number(item.qty || 1))}
                </div>
              </div>
            ))}

            {cart.length > 3 && (
              <button
                type="button"
                className="os-toggle-items"
                onClick={() => setShowAllItems((current) => !current)}
              >
                {showAllItems
                  ? 'Show fewer items'
                  : `Show all items (${hiddenItemCount} more)`}
              </button>
            )}

            <div className="summary-divider" />

            <div className="total-row">
              <span>Subtotal</span>
              <strong>{formatMoney(subtotal)}</strong>
            </div>

            <div className="total-row os-shipto">
              <span>Ship To</span>
              <em>{getShipTo()}</em>
            </div>

            <div className="total-row tax-row">
              <span>Sales Tax</span>
              <strong>{formatMoney(salesTax.amount)}</strong>
            </div>

            <div className="total-row tax-row">
              <span>Tax Rate</span>
              <em>{taxLabel}</em>
            </div>

            <div className="total-row grand-total">
              <span>Total</span>
              <strong>{formatMoney(total)}</strong>
            </div>

            <div className="os-disclaimer">
              <strong>Disclaimer:</strong> By reserving your container, you are not committing
              to a purchase. We will contact you to confirm all the details and finalize the
              pricing.
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="checkout-btn reserve-btn"
            >
              Reserve My Container Now!
            </button>

            <section className="checkout-help checkout-summary-help">
              <p>
                <Lock size={14} />
                Your information is encrypted and securely processed.
              </p>
            </section>
          </section>
        </aside>
      </section>
    </main>
  );
};

export default CheckoutDetails;
