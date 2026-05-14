// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discount, setDiscount] = useState(0);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(i => 
        i.title === item.title && 
        i.sub === item.sub && 
        i.unitPrice === item.unitPrice
      );
      
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + item.qty
        };
        return updated;
      }
      
      return [...prev, { ...item, id: Date.now() + Math.random() }];
    });
    setIsDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  }, []);

  const removeItem = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscount(0);
  }, []);

  const getSubtotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
  }, [cart]);

  const getAfterDiscount = useCallback(() => {
    const subtotal = getSubtotal();
    return Math.max(0, subtotal - discount);
  }, [getSubtotal, discount]);

  const getGrandTotal = useCallback(() => {
    const afterDiscount = getAfterDiscount();
    return afterDiscount + (afterDiscount * 0.09);
  }, [getAfterDiscount]);

  const applyCoupon = useCallback((code) => {
    const COUPONS = {
      'CONTAINER10': 0.10,
      'SAVE200': 200,
      'CE2024': 0.05
    };
    
    const value = COUPONS[code.toUpperCase()];
    if (value !== undefined) {
      const subtotal = getSubtotal();
      const newDiscount = value < 1 ? subtotal * value : value;
      setDiscount(newDiscount);
      return { success: true, message: `Coupon applied! You save $${newDiscount.toFixed(2)}` };
    }
    return { success: false, message: 'Invalid coupon code.' };
  }, [getSubtotal]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      isDrawerOpen,
      setIsDrawerOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      discount,
      setDiscount,
      getSubtotal,
      getAfterDiscount,
      getGrandTotal,
      applyCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
};
