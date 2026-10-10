import { useState } from 'react';
import toast from 'react-hot-toast';
import TicketStubFooter from './ui/ticket-stub-footer';
import { useConfig } from '../context/ConfigContext';
import api from '../api';

const SECTIONS = [
  { label: 'Home', href: '/' },
  { label: 'Shirts', href: '/shirts' },
  { label: 'Trousers', href: '/trousers' },
  { label: 'Caps', href: '/caps' },
  { label: 'Watches', href: '/watches' },
  { label: 'Accessories', href: '/accessories' },
  { label: 'Shoes', href: '/shoes' },
  { label: 'Un Stitch', href: '/unstitch' },
];

const LEGAL = [
  { label: 'All rights reserved' },
  { label: 'Terms of use', href: '#' },
  { label: 'Privacy Policy', href: '#' },
];

export default function TicketFooter() {
  const config = useConfig();
  const c = config?.contact || {};
  const [email, setEmail] = useState('');
  const [sub, setSub] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await api.newsletterSubscribe(email.trim());
      setSub(true);
      setEmail('');
      toast.success("You're subscribed! 🎉");
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not subscribe');
    }
  };

  const connect = [];
  if (c.whatsapp) connect.push({ label: 'WhatsApp', href: `https://wa.me/${c.whatsapp}` });
  if (c.email) connect.push({ label: 'Email Us', href: `mailto:${c.email}` });
  if (c.facebook) connect.push({ label: 'Facebook', href: c.facebook });
  if (c.instagram) connect.push({ label: 'Instagram', href: c.instagram });
  if (c.whatsappCommunity) connect.push({ label: 'WhatsApp Community', href: c.whatsappCommunity });
  if (connect.length === 0) connect.push({ label: 'Contact', href: '/contact' });

  return (
    <div className="border-t border-gold/30">
      <div className="bg-mist border-b border-gold/20">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-ink">Get drop alerts + exclusive deals</p>
          {sub ? (
            <p className="text-sm text-green-700">✓ Subscribed — watch your inbox.</p>
          ) : (
            <form onSubmit={subscribe} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field flex-1 sm:w-64 !py-2 text-sm"
              />
              <button type="submit" className="btn-gold !py-2 px-4 text-sm">Subscribe</button>
            </form>
          )}
        </div>
      </div>
      <TicketStubFooter
        brand="Wear Out"
        company="Wear Out"
        year={new Date().getFullYear()}
        sections={SECTIONS}
        defaultSection={0}
        eyebrow={['New streetwear drops weekly', 'Cash on delivery · Pan-Pakistan', 'Bulk orders for shopkeepers & resellers']}
        headline={['Bold fits.', 'Clean lines.']}
        description="Premium streetwear built to make a statement — COD available across Pakistan, fast dispatch and an easy 7-day exchange."
        cta={{ label: 'Shop the Collection', href: '/shirts' }}
        linkGroups={[
          {
            title: 'Pages',
            links: [
              { label: 'Homepage', href: '/' },
              { label: 'About Us', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Track Order', href: '/track' },
              { label: 'Return & Exchange', href: '/returns' },
              { label: 'Wishlist', href: '/wishlist' },
              { label: 'Bulk Orders', href: '/bulk-orders' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Blog', href: '/blog' },
            ],
          },
          { title: 'Connect', links: connect },
        ]}
        statusLabels={['Open', 'Closed']}
        statusCaption="Store Status"
        count={12480}
        countLabel="Orders Delivered"
        rate={0.4}
        blurb="Shop premium shirts, trousers, caps, watches, accessories and shoes. Cash on delivery everywhere in Pakistan, with bulk & reseller pricing for shopkeepers."
        legal={LEGAL}
        background="#f7f5f0"
        ink="#26211a"
        muted="#6f6758"
        accent="#c9a24b"
        accentDeep="#a97f2c"
        accentInk="#26211a"
      />
    </div>
  );
}