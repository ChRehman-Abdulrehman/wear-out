import { useState, useEffect } from 'react';

const KEY = 'wearout_recent';

export function trackView(product) {
  if (!product?._id) return;
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    const filtered = list.filter((p) => p._id !== product._id);
    filtered.unshift({
      _id: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || 0,
      image: product.image,
      category: product.category,
      rating: product.rating,
      inStock: product.inStock,
    });
    localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, 12)));
    window.dispatchEvent(new Event('wearout-recent'));
  } catch {
    /* ignore */
  }
}

export function getRecent(excludeId) {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return excludeId ? list.filter((p) => p._id !== excludeId) : list;
  } catch {
    return [];
  }
}

export function useRecent(excludeId) {
  const [items, setItems] = useState(() => getRecent(excludeId));
  useEffect(() => {
    const sync = () => setItems(getRecent(excludeId));
    window.addEventListener('wearout-recent', sync);
    return () => window.removeEventListener('wearout-recent', sync);
  }, [excludeId]);
  return items;
}
