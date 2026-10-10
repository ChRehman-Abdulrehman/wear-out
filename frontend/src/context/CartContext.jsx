import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
import { pricing } from '../lib/pricing';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wearout_cart') || '[]');
    } catch {
      return [];
    }
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    localStorage.setItem('wearout_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, size, quantity = 1, shoeSize) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product === product._id && i.size === size);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: pricing(product).current,
          image: product.image,
          size,
          quantity,
          shoeSize: shoeSize || '',
        },
      ];
    });
    setLastAdded({ product, size });
    setDrawerOpen(true);
  };

  const updateQty = (product, size, quantity) => {
    setItems((prev) =>
      prev.map((i) => (i.product === product && i.size === size ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  };

  const removeItem = (product, size) => {
    setItems((prev) => prev.filter((i) => !(i.product === product && i.size === size)));
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQty,
        removeItem,
        clear,
        total,
        count: items.length,
        drawerOpen,
        lastAdded,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
