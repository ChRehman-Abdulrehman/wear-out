import { useState, useEffect, useCallback } from 'react';

const KEY = 'wearout_wishlist';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function getWishlist() {
  return read();
}

export function isInWishlist(id) {
  return read().includes(id);
}

export function toggleWishlist(id) {
  const list = read();
  const i = list.indexOf(id);
  if (i > -1) list.splice(i, 1);
  else list.push(id);
  localStorage.setItem(KEY, JSON.stringify(list));
  return i === -1; // true = added
}

export function clearWishlist() {
  localStorage.setItem(KEY, '[]');
}

export function useWishlist() {
  const [ids, setIds] = useState(read);

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener('wearout-wishlist', sync);
    return () => window.removeEventListener('wearout-wishlist', sync);
  }, []);

  const toggle = useCallback((id) => {
    const added = toggleWishlist(id);
    window.dispatchEvent(new Event('wearout-wishlist'));
    return added;
  }, []);

  const has = useCallback((id) => ids.includes(id), [ids]);

  return { ids, has, toggle, count: ids.length };
}
