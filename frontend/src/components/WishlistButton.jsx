import toast from 'react-hot-toast';
import { useWishlist } from '../lib/wishlist';

export default function WishlistButton({ productId, className = '' }) {
  const { has, toggle } = useWishlist();
  const active = has(productId);

  return (
    <button
      type="button"
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggle(productId);
        toast.success(added ? 'Saved to wishlist ♥' : 'Removed from wishlist');
      }}
      className={`inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/90 border border-gold/30 shadow-sm hover:border-gold/60 hover:scale-110 transition-all ${className}`}
    >
      <svg viewBox="0 0 24 24" className={`h-4 w-4 ${active ? 'text-red-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
