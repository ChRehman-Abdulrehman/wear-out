import { useState } from 'react';
import { imgUrl } from '../lib/img';

export default function ProductCarousel({ images = [], alt = '', className = '' }) {
  const [current, setCurrent] = useState(0);
  const safeImages = images.length > 0 ? images : ['/assets/hero/figure.svg'];

  const prev = () => setCurrent((c) => (c === 0 ? safeImages.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === safeImages.length - 1 ? 0 : c + 1));

  if (safeImages.length <= 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={imgUrl(safeImages[0])} alt={alt} className="absolute inset-0 w-full h-full object-cover" decoding="async" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <img src={imgUrl(safeImages[current])} alt={alt} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" decoding="async" />

      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
      >
        ‹
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
      >
        ›
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {safeImages.slice(0, 8).map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i); }}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-gold' : 'bg-white/50'}`}
          />
        ))}
        {safeImages.length > 8 && <span className="text-white text-xs">+{safeImages.length - 8}</span>}
      </div>
    </div>
  );
}
