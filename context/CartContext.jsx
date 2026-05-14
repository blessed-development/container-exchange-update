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

  // Add item to cart
  const addToCart = useCallback((item) => {
    setCart(prev => {
      // Check if item already exists (by title + sub + unitPrice)
      const existingIndex = prev.findIndex(i => 
        i.title === item.title && 
        i.sub === item.sub && 
        i.unitPrice === item.unitPrice
      );
      
      if (existingIndex !== -1) {
        // Update existing item quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + item.qty
        };
        return updated;
      }
      
      // Add new item with unique ID
      return [...prev, { ...item, id: Date.now() + Math.random() }];
    });
    setIsDrawerOpen(true);
  }, []);

  // Update quantity
  const updateQuantity = useCallback((id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  }, []);

  // Remove item
  const removeItem = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
    setDiscount(0);
  }, []);

  // Get subtotal
  const getSubtotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
  }, [cart]);

  // Get total after discount
  const getAfterDiscount = useCallback(() => {
    const subtotal = getSubtotal();
    return Math.max(0, subtotal - discount);
  }, [getSubtotal, discount]);

  // Get grand total with tax (9%)
  const getGrandTotal = useCallback(() => {
    const afterDiscount = getAfterDiscount();
    return afterDiscount + (afterDiscount * 0.09);
  }, [getAfterDiscount]);

  // Apply coupon
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
