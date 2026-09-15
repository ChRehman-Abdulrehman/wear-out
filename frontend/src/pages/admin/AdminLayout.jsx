import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuth';
import WoLogo from '../../components/WoLogo';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/blog', label: 'Blog' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/shopkeepers', label: 'Shopkeepers' },
  { to: '/admin/featured-requests', label: 'Featured Requests' },
  { to: '/admin/courier', label: 'Courier Hub' },
  { to: '/admin/logistics', label: 'Logistics AI' },
  { to: '/admin/analytics', label: 'Analytics' },
];

export default function AdminLayout() {
  const { logout, email } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-mist text-slate-800 flex">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <WoLogo mode="nav" size={34} />
          <span className="font-display text-xl text-ink tracking-widest">WEAR OUT</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-gold/10 text-gold-dark' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200">
          <p className="text-xs text-slate-400 truncate mb-2">{email}</p>
          <button onClick={handleLogout} className="w-full text-sm btn-outline !py-2">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
