import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { inventoryProducts } from '../data/inventoryProducts';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'ce_cart';
const DISCOUNT_STORAGE_KEY = 'ce_cart_discount';

const cleanText = (value) =>
  String(value || '')
    .replace(/â€¢/g, '•')
    .replace(/Â·/g, '•')
    .replace(/·/g, '•')
    .replace(/\s*•\s*/g, ' • ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeKey = (value) =>
  cleanText(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '');

const getRouteProductId = (item) => {
  const url = String(item?.url || '');
  const match = url.match(/\/product\/([^/?#]+)/);
  return match?.[1] || '';
};

const getCanonicalSubtitle = (product, item) => {
  const knownSub = cleanText(product?.short_description || item?.sub);

  if (knownSub.includes('High Cube') || knownSub.includes('9ft 6in')) {
    return 'High Cube • 9ft 6in High';
  }

  return 'Standard Height • 8ft 6in High';
};

const findInventoryProduct = (item) => {
  const itemProductId =
    item?.productId ||
    item?.inventoryId ||
    getRouteProductId(item) ||
    (inventoryProducts.some((product) => product.id === item?.id) ? item?.id : '');

  if (itemProductId) {
    const byId = inventoryProducts.find((product) => product.id === itemProductId);
    if (byId) return byId;
  }

  const titleKey = normalizeKey(item?.title || item?.name);
  if (!titleKey) return null;

  return (
    inventoryProducts.find((product) => normalizeKey(product.name) === titleKey) ||
    inventoryProducts.find((product) => {
      const productKey = normalizeKey(product.name);
      return productKey.includes(titleKey) || titleKey.includes(productKey);
    }) ||
    null
  );
};

const normalizeCartItem = (item) => {
  const product = findInventoryProduct(item);

  if (!product) {
    return {
      ...item,
      sub: cleanText(item?.sub),
      title: cleanText(item?.title || item?.name),
      qty: Number(item?.qty || 1),
      unitPrice: Number(item?.unitPrice || item?.price || 0),
    };
  }

  const image = product.image_url || item.image || item.img;

  return {
    ...item,
    productId: product.id,
    title: product.name,
    sub: getCanonicalSubtitle(product, item),
    img: image,
    image,
    url: `/product/${product.id}`,
    rating: product.rating ?? item.rating,
    reviewCount: product.review_count ?? item.reviewCount,
    qty: Number(item?.qty || 1),
    unitPrice: Number(item?.unitPrice || item?.price || product.base_price || 0),
  };
};

const readStoredCart = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored).map(normalizeCartItem) : [];
  } catch {
    return [];
  }
};

const readStoredDiscount = () => {
  try {
    return Number(localStorage.getItem(DISCOUNT_STORAGE_KEY) || 0);
  } catch {
    return 0;
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(readStoredCart);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discount, setDiscount] = useState(readStoredDiscount);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(DISCOUNT_STORAGE_KEY, String(discount));
    } catch {}
  }, [discount]);

  const addToCart = useCallback((item) => {
    const nextItem = normalizeCartItem(item);

    setCart(prev => {
      const existingIndex = prev.findIndex(i => 
        (i.productId && i.productId === nextItem.productId) ||
        (
          i.title === nextItem.title &&
          i.sub === nextItem.sub &&
          i.unitPrice === nextItem.unitPrice
        )
      );
      
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...normalizeCartItem(updated[existingIndex]),
          qty: Number(updated[existingIndex].qty || 1) + Number(nextItem.qty || 1)
        };
        return updated;
      }
      
      return [...prev, { ...nextItem, id: Date.now() + Math.random() }];
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
    return getAfterDiscount();
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
