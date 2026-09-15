import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
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
    `px-3 py-1.5 text-xs uppercase tracking-wide border-2 rounded-md transition-all duration-200 ${
      isActive
        ? 'border-black bg-black text-white'
        : 'border-black text-black hover:bg-black hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gold/30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/logo.webp" alt="Wear Out" className="h-9 w-auto" fetchPriority="high" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {realCategories.map((c) => (
            <NavLink key={c.name} to={c.to} className={linkClass}>
              {c.name}
            </NavLink>
          ))}
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          <NavLink to="/bulk-orders" className={linkClass}>
            Bulk Orders
          </NavLink>
          <NavLink to="/blog" className={linkClass}>
            Blog
          </NavLink>
        </nav>

        <form onSubmit={onSearch} className="hidden md:flex items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-40 lg:w-56 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/60"
          />
        </form>

        <div className="flex items-center gap-3">
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
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/60"
            />
          </form>
          <div className="flex flex-col gap-2">
            {realCategories.map((c) => (
              <NavLink key={c.name} to={c.to} className={linkClass} onClick={() => setOpen(false)}>
                {c.name}
              </NavLink>
            ))}
            <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
              About
            </NavLink>
            <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>
              Contact
            </NavLink>
            <NavLink to="/bulk-orders" className={linkClass} onClick={() => setOpen(false)}>
              Bulk Orders
            </NavLink>
            <NavLink to="/blog" className={linkClass} onClick={() => setOpen(false)}>
              Blog
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
