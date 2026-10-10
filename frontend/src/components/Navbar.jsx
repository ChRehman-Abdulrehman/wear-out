import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../lib/wishlist';
import { useConfig } from '../context/ConfigContext';
import { useAdminAuth } from '../context/AdminAuth';
import { CATEGORIES } from '../categories';

const realCategories = [
  { name: 'Shirts', to: '/shirts' },
  { name: 'Trousers', to: '/trousers' },
  { name: 'Caps', to: '/caps' },
  { name: 'Un Stitch', to: '/unstitch' },
  { name: 'Watches', to: '/watches' },
  { name: 'Accessories', to: '/accessories' },
  { name: 'Shoes', to: '/shoes' },
];

export default function Navbar() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const config = useConfig();
  const { isAuthenticated } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 text-xs uppercase tracking-wide rounded-md transition-all duration-200 whitespace-nowrap h-[31px] flex items-center ${
      isActive
        ? 'bg-black text-white font-semibold'
        : 'text-slate-600 hover:text-black hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gold/30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/logo.webp" alt="Wear Out" className="h-11 w-auto" fetchPriority="high" />
        </Link>

        <nav className="hidden md:flex items-center gap-1.5">
          <NavLink to="/" end className={linkClass}>
            Home Page
          </NavLink>
          {realCategories
            .filter((c) => !['Caps', 'Watches', 'Accessories'].includes(c.name))
            .map((c) => (
              <NavLink key={c.name} to={c.to} className={linkClass}>
                {c.name}
              </NavLink>
            ))}
          <div className="relative group">
            <button className="px-3 py-1.5 text-xs uppercase tracking-wide rounded-md transition-all duration-200 whitespace-nowrap h-[31px] flex items-center text-slate-600 hover:text-black hover:bg-slate-100">
              Accessories
              <svg className="ml-1 h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
            <div className="absolute left-0 mt-1 hidden group-hover:block bg-white border border-slate-200 rounded-md shadow-lg py-1 min-w-[140px] z-50">
              <NavLink to="/caps" className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">Caps</NavLink>
              <NavLink to="/watches" className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">Watches</NavLink>
              <NavLink to="/accessories" className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">Accessories</NavLink>
            </div>
          </div>
          <div className="relative group">
            <button className="px-3 py-1.5 text-xs uppercase tracking-wide rounded-md transition-all duration-200 whitespace-nowrap h-[31px] flex items-center text-slate-600 hover:text-black hover:bg-slate-100">
              About
              <svg className="ml-1 h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
            <div className="absolute left-0 mt-1 hidden group-hover:block bg-white border border-slate-200 rounded-md shadow-lg py-1 min-w-[160px] z-50">
              <NavLink to="/about" className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">About</NavLink>
              <NavLink to="/contact" className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">Contact</NavLink>
              <NavLink to="/blog" className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">Blog</NavLink>
              <NavLink to="/track" className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">Track Order</NavLink>
              <NavLink to="/returns" className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">Return & Exchange</NavLink>
            </div>
          </div>
          <NavLink to="/bulk-orders" className={linkClass}>
            Bulk Orders
          </NavLink>
        </nav>

        <form onSubmit={onSearch} className="hidden md:flex items-center ml-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-40 lg:w-56 rounded-md border border-slate-400 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/60"
          />
        </form>

        <div className="flex items-center gap-3 ml-3">
          <Link to="/wishlist" className="relative text-slate-700 hover:text-gold" aria-label="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            {wishCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {wishCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative text-slate-700 hover:text-gold" aria-label="Cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {isAuthenticated && (
            <Link to="/admin" className="text-sm text-slate-600 hover:text-gold hidden sm:block">
              Admin
            </Link>
          )}
          <button className="md:hidden text-slate-700" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gold/20 px-4 py-3">
          <form onSubmit={onSearch} className="mb-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-md border border-slate-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/60"
            />
          </form>
          <div className="flex flex-col gap-2">
            <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
              Home Page
            </NavLink>
            {realCategories
              .filter((c) => !['Caps', 'Watches', 'Accessories'].includes(c.name))
              .map((c) => (
                <NavLink key={c.name} to={c.to} className={linkClass} onClick={() => setOpen(false)}>
                  {c.name}
                </NavLink>
              ))}
            <div className="mt-1 border-t border-slate-100 pt-1">
              <p className="px-2 py-1 text-[11px] uppercase tracking-widest text-slate-400">Accessories</p>
              <NavLink to="/caps" className={linkClass} onClick={() => setOpen(false)}>Caps</NavLink>
              <NavLink to="/watches" className={linkClass} onClick={() => setOpen(false)}>Watches</NavLink>
              <NavLink to="/accessories" className={linkClass} onClick={() => setOpen(false)}>Accessories</NavLink>
            </div>
            <NavLink to="/bulk-orders" className={linkClass} onClick={() => setOpen(false)}>
              Bulk Orders
            </NavLink>
            <div className="mt-1 border-t border-slate-100 pt-1">
              <p className="px-2 py-1 text-[11px] uppercase tracking-widest text-slate-400">About</p>
              <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
              <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>Contact</NavLink>
              <NavLink to="/blog" className={linkClass} onClick={() => setOpen(false)}>Blog</NavLink>
              <NavLink to="/track" className={linkClass} onClick={() => setOpen(false)}>Track Order</NavLink>
              <NavLink to="/returns" className={linkClass} onClick={() => setOpen(false)}>Return & Exchange</NavLink>
              <NavLink to="/wishlist" className={linkClass} onClick={() => setOpen(false)}>Wishlist</NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
