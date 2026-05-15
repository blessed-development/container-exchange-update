import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext';
const CartContext = createContext(null);

const STORAGE_KEY = 'containers_exchange_cart';

const normalizeItem = (item) => {
  const unitPrice = Number(item.unitPrice ?? item.price ?? item.basePrice ?? 0);
  const qty = Math.max(1, Number(item.qty ?? item.quantity ?? 1));

  return {
    id: item.id ?? `${Date.now()}-${Math.random()}`,
    title: item.title ?? item.name ?? 'Shipping Container',
    sub: item.sub ?? item.subtitle ?? item.meta ?? '',
    image: item.image ?? item.image_url ?? item.imageUrl ?? item.photo ?? '',
    unitPrice,
    qty,
    url: item.url ?? item.href ?? '#',
    grade: item.grade ?? '',
    size: item.size ?? '',
    condition: item.condition ?? '',
  };
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // localStorage is optional.
    }
  }, [cart]);

  const addToCart = useCallback((item) => {
    const nextItem = normalizeItem(item);

    setCart((prev) => {
      const existingIndex = prev.findIndex((current) =>
        current.title === nextItem.title &&
        current.sub === nextItem.sub &&
        Number(current.unitPrice) === Number(nextItem.unitPrice)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: Math.max(1, Number(updated[existingIndex].qty || 1)) + nextItem.qty,
        };
        return updated;
      }

      return [...prev, nextItem];
    });

    setIsDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          qty: Math.max(1, Number(item.qty || 1) + delta),
        };
      })
    );
  }, []);

  const setQuantity = useCallback((id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, Number(qty || 1)) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscount(0);
  }, []);

  const getSubtotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + Number(item.unitPrice || 0) * Number(item.qty || 1), 0);
  }, [cart]);

  const getAfterDiscount = useCallback(() => {
    return Math.max(0, getSubtotal() - Number(discount || 0));
  }, [discount, getSubtotal]);

  // Checkout reference shows sales tax as "Calculated at checkout",
  // so grand total currently equals subtotal after discount.
  const getGrandTotal = useCallback(() => {
    return getAfterDiscount();
  }, [getAfterDiscount]);

  const applyCoupon = useCallback((code) => {
    const normalizedCode = String(code || '').trim().toUpperCase();

    const COUPONS = {
      CONTAINER10: 0.1,
      SAVE200: 200,
      CE2024: 0.05,
    };

    const value = COUPONS[normalizedCode];

    if (value === undefined) {
      return { success: false, message: 'Invalid coupon code.' };
    }

    const subtotal = getSubtotal();
    const newDiscount = value < 1 ? subtotal * value : value;
    setDiscount(newDiscount);

    return {
      success: true,
      message: `Coupon applied! You save $${newDiscount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    };
  }, [getSubtotal]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    updateQuantity,
    setQuantity,
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
  }), [
    cart,
    addToCart,
    updateQuantity,
    setQuantity,
    removeItem,
    clearCart,
    isDrawerOpen,
    isCheckoutOpen,
    discount,
    getSubtotal,
    getAfterDiscount,
    getGrandTotal,
    applyCoupon,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

export default CartContext;
