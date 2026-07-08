import React, { useState } from 'react';

const ShippingForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (typeof onNext === 'function') {
      onNext(formData);
    }
  };

  return (
    <section className="cart-panel">
      <div className="cart-panel-title">
        <h1>Shipping Address</h1>
      </div>

      <form onSubmit={handleSubmit} className="shipping-form">
        <div className="form-grid two">
          <label>
            <span>First Name *</span>
            <input name="firstName" value={formData.firstName} onChange={handleChange} required />
          </label>

          <label>
            <span>Last Name *</span>
            <input name="lastName" value={formData.lastName} onChange={handleChange} required />
          </label>
        </div>

        <label>
          <span>Email Address *</span>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          <span>Phone Number *</span>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>

        <label>
          <span>Street Address *</span>
          <input name="address" value={formData.address} onChange={handleChange} required />
        </label>

        <div className="form-grid two">
          <label>
            <span>City *</span>
            <input name="city" value={formData.city} onChange={handleChange} required />
          </label>

          <label>
            <span>State *</span>
            <input name="state" value={formData.state} onChange={handleChange} required />
          </label>
        </div>

        <label>
          <span>ZIP Code *</span>
          <input name="zipCode" value={formData.zipCode} onChange={handleChange} required />
        </label>

        <button type="submit" className="checkout-btn">
          Continue to Payment →
        </button>
      </form>
    </section>
  );
};

export default ShippingForm;
