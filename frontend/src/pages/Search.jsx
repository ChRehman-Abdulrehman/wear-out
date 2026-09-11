import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .getProducts({ search: q.trim() })
      .then((r) => setProducts(r.products || r))
      .finally(() => setLoading(false));
  }, [q]);

  const update = (val) => {
    const next = new URLSearchParams(params);
    if (val) next.set('q', val);
    else next.delete('q');
    setParams(next, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mb-8 flex items-center gap-2 max-w-xl"
      >
        <input
          autoFocus
          className="input-field"
          placeholder="Search products…"
          value={q}
          onChange={(e) => update(e.target.value)}
        />
      </form>

      <h1 className="font-display text-4xl text-metallic tracking-wider mb-2 uppercase">
        {q ? `Results for "${q}"` : 'Search'}
      </h1>

      {loading ? (
        <p className="text-slate-400 mt-6">Searching…</p>
      ) : !q ? (
        <p className="text-slate-400 mt-6">Type something to search across all products.</p>
      ) : products.length === 0 ? (
        <p className="text-slate-400 mt-6">No products found for "{q}".</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
