import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FeaturedCarousel({ products = [] }) {
  const [paused, setPaused] = useState(false);

  if (products.length === 0) {
    return (
      <div className="relative overflow-hidden h-64 w-full bg-slate-100 flex items-center justify-center rounded-xl">
        <p className="text-slate-400">No featured products yet</p>
      </div>
    );
  }

  const items = [...products, ...products];

  return (
    <div className="relative w-full overflow-hidden py-2">
      {/* CSS keyframes for seamless right-to-left loop */}
      <style>{`
        @keyframes wo-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .wo-track {
          display: flex;
          width: max-content;
          animation: wo-marquee 40s linear infinite;
        }
        .wo-track.wo-paused {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className={`wo-track ${paused ? 'wo-paused' : ''}`}>
          {items.map((product, index) => (
            <Link
              key={`${product._id}-${index}`}
              to={`/product/${product._id}`}
              className="group flex-shrink-0 px-2"
              style={{ width: '260px' }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-100 border border-gold/20 group-hover:border-gold/60 group-hover:shadow-xl group-hover:shadow-gold/10 transition-all duration-300">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gradient-to-b from-slate-200 to-slate-100">
                    No Image
                  </div>
                )}

                {/* Hover overlay with order button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-center pb-4">
                  <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-gold text-black font-semibold text-sm px-5 py-2 rounded-full uppercase tracking-wide">
                    View & Order →
                  </span>
                </div>
              </div>

              <div className="p-3 text-center">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {product.name}
                </p>
                <p className="mt-1 text-sm font-bold text-gold">
                  {product.price?.toLocaleString()} PKR
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pause indicator */}
      {paused && (
        <div className="absolute top-2 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
          ⏸ Paused — click to order
        </div>
      )}
    </div>
  );
}
