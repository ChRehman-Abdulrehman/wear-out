import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductImages, imgUrl } from '../lib/img';
import { pricing } from '../lib/pricing';

const clamp = {
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

function QtyButton({ onClick, children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="w-7 h-7 grid place-items-center text-ink hover:bg-gold/20 rounded-full transition-colors"
    >
      {children}
    </button>
  );
}

export default function CartDrawer() {
  const { items, total, drawerOpen, closeDrawer, lastAdded, updateQty } = useCart();
  const navigate = useNavigate();

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const last = lastAdded?.product || null;
  const pr = last ? pricing(last) : null;
  const lastItem = lastAdded
    ? items.find((i) => i.product === lastAdded.product._id && i.size === lastAdded.size)
    : null;
  const rawImg = last ? getProductImages(last)[0] || last.image || '' : '';
  const img = rawImg ? imgUrl(rawImg) : '';
  const restItems = items.filter(
    (i) => !(lastAdded && i.product === lastAdded.product._id && i.size === lastAdded.size)
  );

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeDrawer]);

  const go = (path) => {
    closeDrawer();
    navigate(path);
  };

  return (
    <div className={`fixed inset-0 z-[70] ${drawerOpen ? '' : 'pointer-events-none'}`}>
      <div
        onClick={closeDrawer}
        aria-hidden="true"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className={`absolute right-0 top-0 h-full w-full sm:w-[430px] bg-mist border-l-2 border-gold/40 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-gold/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ink">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 className="font-display text-2xl tracking-wider uppercase text-metallic">
              {last ? 'Added to Cart' : 'Your Cart'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="w-9 h-9 grid place-items-center rounded-full text-ink hover:bg-black/5 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {last && lastItem && (
            <div className="bg-bone rounded-xl p-4 border border-gold/30">
              <div className="flex gap-3">
                {img ? (
                  <img
                    src={img}
                    alt={last.name}
                    className="w-20 h-24 object-cover rounded-lg bg-white border border-gold/20 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-24 rounded-lg bg-white border border-gold/20 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink leading-snug">{last.name}</p>
                  <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
                    <span className="text-lg font-bold text-ink">Rs {pr.current.toLocaleString()}</span>
                    {pr.onSale && (
                      <>
                        <span className="text-sm text-slate-400 line-through">Rs {pr.price.toLocaleString()}</span>
                        <span className="text-[11px] font-bold bg-gold/25 text-ink px-1.5 py-0.5 rounded">
                          −{pr.discountPct}%
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {lastItem.size ? `Size: ${lastItem.size}` : 'One size'}
                    {lastItem.shoeSize ? ` · Foot: ${lastItem.shoeSize}` : ''}
                  </div>
                  <div className="mt-2 inline-flex items-center border border-gold/40 rounded-full bg-white">
                    <QtyButton
                      label="Decrease quantity"
                      onClick={() => updateQty(lastItem.product, lastItem.size, lastItem.quantity - 1)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14" />
                      </svg>
                    </QtyButton>
                    <span className="w-8 text-center text-sm font-bold text-ink">{lastItem.quantity}</span>
                    <QtyButton
                      label="Increase quantity"
                      onClick={() => updateQty(lastItem.product, lastItem.size, lastItem.quantity + 1)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </QtyButton>
                  </div>
                </div>
              </div>
              {last.description && (
                <p className="mt-3 text-sm text-slate-600 leading-relaxed" style={clamp}>
                  {last.description}
                </p>
              )}
            </div>
          )}

          {items.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                In your cart ({count} {count === 1 ? 'item' : 'items'})
              </p>
              {restItems.map((i) => (
                <div key={i.product + '|' + i.size} className="flex items-center gap-3 bg-bone/70 rounded-lg p-2.5 border border-gold/20">
                  {i.image ? (
                    <img src={imgUrl(i.image)} alt={i.name} className="w-12 h-14 object-cover rounded bg-white border border-gold/20 shrink-0" />
                  ) : (
                    <div className="w-12 h-14 rounded bg-white border border-gold/20 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">{i.name}</p>
                    <div className="text-xs text-slate-500">
                      {i.size ? `Size: ${i.size}` : 'One size'}
                      {i.shoeSize ? ` · Foot: ${i.shoeSize}` : ''} · Rs {i.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center border border-gold/40 rounded-full bg-white shrink-0">
                    <QtyButton label="Decrease quantity" onClick={() => updateQty(i.product, i.size, i.quantity - 1)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14" />
                      </svg>
                    </QtyButton>
                    <span className="w-7 text-center text-xs font-bold text-ink">{i.quantity}</span>
                    <QtyButton label="Increase quantity" onClick={() => updateQty(i.product, i.size, i.quantity + 1)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </QtyButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Your cart is empty.</p>
          )}
        </div>

        <footer className="border-t border-gold/30 px-5 py-4 space-y-3 bg-bone shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">
              Subtotal ({count} {count === 1 ? 'item' : 'items'})
            </span>
            <span className="text-lg font-bold text-ink">Rs {total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-500">
            Delivery charges calculated at checkout · Cash on Delivery available
          </p>
          <button type="button" onClick={() => go('/checkout')} className="btn-gold w-full py-3 text-base">
            Buy Now
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => go('/cart')}
              className="flex-1 py-2.5 border border-gold/50 rounded-lg text-sm font-semibold text-ink hover:bg-black/5 transition-colors"
            >
              View Cart
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              className="flex-1 py-2.5 text-sm text-slate-600 underline underline-offset-4 hover:text-ink transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
