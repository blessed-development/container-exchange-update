import React from 'react';
import { useCart } from '../../context/CartContext';

const CheckoutPage = () => {
  const { cart, updateQuantity, removeItem, getSubtotal, getGrandTotal } = useCart();

  const formatMoney = (num) => {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const subtotal = getSubtotal();
  const total = getGrandTotal();

  if (cart.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => window.location.href = '/'}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        {/* Cart Items */}
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '10px' }}>Product</th>
                <th style={{ padding: '10px' }}>Price</th>
                <th style={{ padding: '10px' }}>Quantity</th>
                <th style={{ padding: '10px' }}>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    <div>
                      <div><strong>{item.title}</strong></div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{item.sub}</div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{formatMoney(item.unitPrice)}</td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ margin: '0 5px' }}>-</button>
                    {item.qty}
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ margin: '0 5px' }}>+</button>
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{formatMoney(item.unitPrice * item.qty)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button onClick={() => window.location.href = '/'} style={{ marginTop: '20px', padding: '10px 20px' }}>
            ← Continue Shopping
          </button>
        </div>

        {/* Order Summary */}
        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
          <h3>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', color: '#666' }}>
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', color: '#666' }}>
            <span>Tax</span>
            <span>Calculated at checkout</span>
          </div>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', fontSize: '18px', fontWeight: 'bold' }}>
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
          <button style={{ width: '100%', padding: '15px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
