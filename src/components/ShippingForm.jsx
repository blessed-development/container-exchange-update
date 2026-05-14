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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="co-panel">
      <div className="co-panel-title">📦 Shipping Address</div>
      <form onSubmit={handleSubmit}>
        <div className="co-row">
          <div className="co-field">
            <label>First Name *</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="co-field">
            <label>Last Name *</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div className="co-field">
          <label>Email Address *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="co-field">
          <label>Phone Number *</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>

        <div className="co-field">
          <label>Street Address *</label>
          <input name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="co-row">
          <div className="co-field">
            <label>City *</label>
            <input name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="co-field">
            <label>State *</label>
            <input name="state" value={formData.state} onChange={handleChange} required />
          </div>
        </div>

        <div className="co-row">
          <div className="co-field">
            <label>ZIP Code *</label>
            <input name="zipCode" value={formData.zipCode} onChange={handleChange} required />
          </div>
        </div>

        <div className="co-panel-actions">
          <button type="submit" className="co-primary-btn">Continue to Payment →</button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
