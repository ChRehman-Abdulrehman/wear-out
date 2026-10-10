import { Link } from 'react-router-dom';
import { useRecent } from '../lib/recent';
import { pricing } from '../lib/pricing';

// "Recently viewed" + "You may also like" strip for product pages
export default function RelatedStrip({ currentId, category }) {
  const recent = useRecent(currentId).slice(0, 8);

  if (recent.length === 0) return null;

  return (
    <section className="mt-16 border-t border-gold/20 pt-10">
      <h2 className="font-display text-3xl text-metallic tracking-wider mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recent.map((p) => {
          const pr = pricing(p);
          return (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="group bg-white border border-gold/20 rounded-xl overflow-hidden hover:border-gold/60 transition-colors shadow-sm"
            >
              <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                )}
                {pr.onSale && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded">−{pr.discountPct}%</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm text-slate-700 truncate">{p.name}</p>
                <p className="text-gold font-semibold text-sm">Rs {pr.current.toLocaleString()}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
