import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

export default function Footer() {
  const config = useConfig();
  const c = config?.contact || {};
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gold/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/assets/logo.webp" alt="Wear Out" className="h-9 w-auto" />
          </div>
          <p className="text-slate-500 text-sm">Wear Your Confidence. Premium streetwear, built to stand out.</p>
        </div>

        <div>
          <h4 className="text-gold font-semibold mb-3 uppercase text-sm">Shop</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/shirts" className="hover:text-gold">Shirts</Link></li>
            <li><Link to="/trousers" className="hover:text-gold">Trousers</Link></li>
            <li><Link to="/caps" className="hover:text-gold">Caps</Link></li>
            <li><Link to="/unstitch" className="hover:text-gold">Un Stitch</Link></li>
            <li><Link to="/watches" className="hover:text-gold">Watches</Link></li>
            <li><Link to="/accessories" className="hover:text-gold">Accessories</Link></li>
            <li><Link to="/shoes" className="hover:text-gold">Shoes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold font-semibold mb-3 uppercase text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/bulk-orders" className="hover:text-gold">Bulk Orders / Resellers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold font-semibold mb-3 uppercase text-sm">Connect</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            {c.whatsapp && (
              <li>
                <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-gold">
                  WhatsApp
                </a>
              </li>
            )}
            {c.email && (
              <li>
                <a href={`mailto:${c.email}`} className="hover:text-gold">
                  Email Us
                </a>
              </li>
            )}
            {c.facebook && (
              <li>
                <a href={c.facebook} target="_blank" rel="noreferrer" className="hover:text-gold">
                  Facebook
                </a>
              </li>
            )}
            {c.instagram && (
              <li>
                <a href={c.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">
                  Instagram
                </a>
              </li>
            )}
            {c.whatsappCommunity && (
              <li>
                <a href={c.whatsappCommunity} target="_blank" rel="noreferrer" className="hover:text-gold">
                  WhatsApp Community
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/10 py-4 text-center text-xs text-slate-400">
        © {year} Wear Out. All rights reserved.
      </div>
    </footer>
  );
}
