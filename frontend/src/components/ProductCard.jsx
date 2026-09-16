import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import ProductCarousel from './ProductCarousel';
import { getProductImages } from '../lib/img';

export default function ProductCard({ product, hideCategory = false }) {
  const images = getProductImages(product);

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-white border border-gold/20 rounded-xl overflow-hidden hover:border-gold/60 transition-colors shadow-sm"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <ProductCarousel images={images} alt={product.name} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        {!hideCategory && (
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-gold border border-gold/40 px-2 py-1 rounded pointer-events-none">
            {product.category}
          </span>
        )}
        {product.inStock && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider text-green-700 bg-green-100 border border-green-300 px-2 py-1 rounded pointer-events-none">
            In Stock
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider text-red-600 bg-red-100 border border-red-300 px-2 py-1 rounded pointer-events-none">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-display tracking-wide text-lg text-slate-800 group-hover:text-gold transition-colors line-clamp-2 min-h-[3.5rem] capitalize">
          {product.name}
        </h2>
        {product.shopName && (
          <p className="text-xs text-slate-400 mt-0.5">Sold by {product.shopName}</p>
        )}
        {product.rating > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <StarRating value={product.rating} />
            <span className="text-xs text-slate-400">{Number(product.rating).toFixed(1)}</span>
          </div>
        )}
        <p className="text-gold font-semibold mt-1">Rs {product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
