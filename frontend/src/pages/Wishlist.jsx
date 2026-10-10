import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../lib/wishlist';
import { clearWishlist } from '../lib/wishlist';
import api from '../api';

export default function Wishlist() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    Promise.all(ids.map((id) => api.getProduct(id).catch(() => null)))
      .then((list) => { if (alive) setProducts(list.filter(Boolean)); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [ids]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO title="My Wishlist" description="Your saved Wear Out products." url="/wishlist" />
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="font-display text-5xl text-metallic tracking-wider">WISHLIST</h1>
        {ids.length > 0 && (
          <button className="btn-outline !py-2 text-sm" onClick={() => { clearWishlist(); window.dispatchEvent(new Event('wearout-wishlist')); }}>
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">♡</p>
          <p className="text-slate-500">Your wishlist is empty.</p>
          <Link to="/" className="btn-gold inline-flex mt-6">Start Shopping →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
