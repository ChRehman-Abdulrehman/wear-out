import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { imgUrl } from '@/lib/img';

function autoSpeed() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 0;
  }
  return 0.08;
}

export default function WorksWheel({
  products = [],
  title = 'Featured Collection',
  tagline = 'Fresh fits. Wear your confidence.',
  actionLabel = 'Shop all',
  actionTo = '/shirts',
  hero = false,
  dark = false,
  hideHeader = false,
  scrollAngle = 0,
  className,
}) {
  const navigate = useNavigate();
  const items = products.slice(0, 12);
  const count = items.length;
  const step = count ? 360 / count : 0;

  const [rot, setRot] = useState(0);
  const rotRef = useRef(0);
  const velRef = useRef(autoSpeed());
  const dragging = useRef(false);
  const lastX = useRef(0);
  const startX = useRef(0);
  const moved = useRef(false);
  const raf = useRef(0);
  const wheelRef = useRef(null);
  const [radius, setRadius] = useState(hero ? 230 : 200);

  useEffect(() => {
    const measure = () => {
      const w = wheelRef.current?.offsetWidth || 340;
      setRadius(Math.max(96, Math.min(w * (hero ? 0.36 : 0.34), hero ? 280 : 240)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [hero]);

  useEffect(() => {
    const loop = () => {
      if (!dragging.current) {
        rotRef.current += velRef.current;
        velRef.current += (0.08 - velRef.current) * 0.02;
        setRot(rotRef.current);
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const onDown = useCallback((e) => {
    dragging.current = true;
    moved.current = false;
    startX.current = e.clientX;
    lastX.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const onMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    if (Math.abs(e.clientX - startX.current) > 6) moved.current = true;
    rotRef.current += dx * 0.35;
    velRef.current = dx * 0.35;
    setRot(rotRef.current);
  }, []);

  const onUp = useCallback(
    (e) => {
      dragging.current = false;
      if (moved.current || !e.clientX) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const card = el && el.closest('[data-product-id]');
      if (card) navigate(`/product/${card.dataset.productId}`);
    },
    [navigate]
  );

  const go = useCallback(
    (id) => {
      if (!moved.current && id) navigate(`/product/${id}`);
    },
    [navigate]
  );

  if (!count) return null;

  return (
    <section className={cn('relative', className)} aria-label="Featured products wheel — drag or tap a card to open it">
      <div className="mx-auto px-4">
        {!hideHeader && (
          <div className={cn('flex items-end justify-between mb-6 sm:mb-8', hero ? 'max-w-5xl mx-auto' : 'max-w-7xl')}>
            <div>
              <h2 className="font-display text-4xl sm:text-6xl text-metallic tracking-wider">{title}</h2>
              <p className="mt-2 text-slate-500">{tagline}</p>
            </div>
            <Link
              to={actionTo}
              className="hidden sm:inline text-gold text-sm sm:text-base font-semibold uppercase tracking-widest hover:underline"
            >
              {actionLabel} →
            </Link>
          </div>
        )}

        <div
          ref={wheelRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onPointerCancel={onUp}
          className={cn(
            'relative mx-auto select-none cursor-grab active:cursor-grabbing touch-none',
            hero ? 'h-[52vh] min-h-[430px] max-h-[680px] lg:max-w-5xl' : 'h-[300px] sm:h-[380px] md:h-[440px] max-w-7xl'
          )}
          style={{ perspective: '900px' }}
        >
          {items.map((p, i) => {
            const ang = (i * step + rot + scrollAngle) * (Math.PI / 180);
            const x = Math.sin(ang) * radius;
            const y = Math.cos(ang) * radius * 0.42;
            const facing = Math.cos(ang);
            const scale = 0.6 + 0.4 * ((facing + 1) / 2);
            const opacity = 0.35 + 0.65 * ((facing + 1) / 2);
            const z = 100 + Math.round(facing * 100);
            const isFront = facing > 0.92;
            return (
              <button
                type="button"
                key={p._id || i}
                data-product-id={p._id}
                onClick={() => go(p._id)}
                aria-label={`Open ${p.name} — Rs ${Number(p.price).toLocaleString()}`}
                className={cn(
                  'group absolute left-1/2 top-1/2 w-28 h-36 sm:w-36 sm:h-48 md:w-40 md:h-52',
                  'rounded-xl overflow-hidden border text-left shadow-lg',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:z-[400]',
                  dark ? 'bg-coal shadow-2xl' : 'bg-white',
                  isFront ? 'border-gold shadow-gold' : 'border-gold/20'
                )}
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                  opacity,
                  zIndex: z,
                }}
              >
                <div className="w-full h-full bg-slate-100">
                  <img
                    src={imgUrl(p.image || (p.images && p.images[0]))}
                    alt={p.name}
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                </div>
                <div
                  className={cn(
                    'absolute bottom-0 inset-x-0 px-2.5 pb-2 pt-8 bg-gradient-to-t from-black/85 to-transparent',
                    'transition-opacity duration-200',
                    isFront ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                  )}
                >
                  <p className="text-white text-xs sm:text-sm font-medium truncate">{p.name}</p>
                  <div className="flex items-center justify-between gap-1 mt-1">
                    <p className="text-gold text-[11px] sm:text-xs">
                      Rs {(p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : Number(p.price)).toLocaleString()}
                      {p.salePrice > 0 && p.salePrice < p.price && (
                        <span className="ml-1 text-slate-400 line-through">Rs {Number(p.price).toLocaleString()}</span>
                      )}
                    </p>
                    {isFront && (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                        View & Order
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          <div
            className={cn(
              'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center',
              dark ? 'text-gold' : 'text-ink'
            )}
          >
            <div
              className={cn(
                'w-20 h-20 sm:w-24 sm:h-24 rounded-full border flex flex-col items-center justify-center shadow',
                dark ? 'border-gold/50 bg-ink/85 backdrop-blur text-gold' : 'border-gold/40 bg-white/85 backdrop-blur'
              )}
            >
              <span className="font-display text-gold text-xs sm:text-sm tracking-widest">WEAR</span>
              <span className="font-display text-xs sm:text-sm tracking-widest">OUT</span>
            </div>
            <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400">Drag · Tap to open</p>
          </div>
        </div>

        {!hideHeader && (
          <div className="sm:hidden mt-4 text-center">
            <Link to={actionTo} className="text-gold text-sm font-semibold uppercase tracking-widest hover:underline">
              {actionLabel} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}