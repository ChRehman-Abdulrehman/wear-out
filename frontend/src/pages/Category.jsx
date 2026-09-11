import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api';
import { categoryBySlug } from '../categories';

export default function Category() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, '');
  const cat = categoryBySlug(slug);
  const label = cat ? cat.label : slug;
  const value = cat ? cat.value : slug;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = { category: value };
    if (gender) params.gender = gender;
    api
      .getProducts(params)
      .then((r) => setProducts(r.products || r))
      .finally(() => setLoading(false));
  }, [value, gender]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-metallic tracking-wider mb-2 uppercase">{label}</h1>
      <p className="text-slate-500 mb-8">Premium staples from the Wear Out collection.</p>

      {value === 'Un Stitch' && (
        <div className="flex items-center gap-3 mb-6">
          <label className="text-sm text-slate-600 font-medium">Filter by:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-slate-400">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
