import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import WorksWheel from './ui/works-wheel';

const TRUST = [
  '100% Cash on Delivery',
  'Pan-Pakistan Delivery',
  'Fast Dispatch — 24–48 hrs',
  'Easy 7-Day Exchange',
];

export default function HeroSection({ products = [], loading = false }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  // Scroll-linked: wheel spins as the user scrolls past the hero
  const spin = useTransform(scrollYProgress, [0, 1], [0, 340]);
  // Parallax: copy moves up faster, wheel glides up and spins but STAYS visible
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.35]);
  const wheelY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const [scrollAngle, setScrollAngle] = useState(0);
  useMotionValueEvent(spin, 'change', (v) => setScrollAngle(v));

  const heading = useMemo(
    () => (
      <>
        <motion.p
          style={{ y: titleY }}
          className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-dark animate-pulse" />
          New Season — Streetwear Drops Live
        </motion.p>

        <motion.h1 style={{ y: titleY, opacity: titleOpacity }} className="mt-5 leading-[0.92] tracking-wide">
          <span className="block text-6xl sm:text-7xl md:text-8xl font-display text-ink">Streetwear that</span>
          <span className="block text-6xl sm:text-7xl md:text-8xl font-display text-metallic">Speaks.</span>
        </motion.h1>
        <span className="mt-3 block h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-gold via-gold-light to-gold" />

        <motion.p style={{ y: titleY, opacity: titleOpacity }} className="mt-5 text-slate-600 max-w-md mx-auto">
          Bold fits, clean lines, zero apologies. Premium shirts, cargo trousers, caps, sneakers & unstitched fabric —
          made for the ones who walk loud.
        </motion.p>

        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/shirts"
            className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-sm sm:text-base font-semibold uppercase tracking-widest text-gold hover:bg-neutral-800 transition-colors min-h-[46px]"
          >
            Shop the Collection →
          </Link>
          <Link
            to="/bulk-orders"
            className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm sm:text-base font-semibold uppercase tracking-widest text-black hover:bg-gold-light transition-colors min-h-[46px]"
          >
            Bulk & Wholesale
          </Link>
        </motion.div>
      </>
    ),
    [titleY, titleOpacity]
  );

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-gradient-to-b from-bone via-mist to-mist"
        aria-label="Wear Out hero"
      >
        {/* soft brand glows — drift on scroll */}
        <motion.div aria-hidden="true" style={{ y: glowY }} className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-24 w-[440px] h-[440px] rounded-full bg-gold/10 blur-[110px]" />
          <div className="absolute -bottom-40 -left-32 w-[460px] h-[460px] rounded-full bg-bronze/10 blur-[120px]" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-10 md:pt-20 md:pb-14 flex flex-col items-center justify-center text-center min-h-[calc(100vh-4rem)]">
          {heading}

          <motion.div style={{ y: titleY, opacity: titleOpacity }} className="mt-8">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-500">
              {TRUST.map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4 text-gold-dark">
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Scroll-driven featured wheel — centered, spins as you scroll */}
          {loading ? (
            <div className="flex w-full h-[430px] items-center justify-center text-slate-400 animate-pulse">
              Loading featured drops…
            </div>
          ) : products.length === 0 ? (
            <div className="flex w-full h-[430px] items-center justify-center text-slate-400">
              No products yet — check back soon.
            </div>
          ) : (
            <motion.div style={{ y: wheelY }} className="w-full mt-8">
              <WorksWheel hero hideHeader products={products} scrollAngle={scrollAngle} />
            </motion.div>
          )}

          <motion.p
            style={{ opacity: hintOpacity }}
            className="mt-6 inline-flex flex-col items-center gap-1 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-400"
          >
            Scroll to explore
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5 text-gold animate-bounce">
              <path fillRule="evenodd" d="M10 3a1 1 0 0 1 1 1v11.6l4.3-4.3a1 1 0 1 1 1.4 1.4l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 15.6V4a1 1 0 0 1 1-1Z" clipRule="evenodd" />
            </svg>
          </motion.p>
        </div>
      </section>

      {/* Stats strip */}
      {!loading && products.length > 0 && (
        <section aria-label="Store highlights" className="border-y border-gold/20 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            {[
              { value: 'COD', label: 'Pay at Your Door' },
              { value: '24–48h', label: 'Dispatch Time' },
              { value: '7-Day', label: 'Easy Exchange' },
              { value: 'Premium', label: 'Quality Streetwear' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5">
                <p className="font-display text-2xl sm:text-3xl text-metallic tracking-wider">{s.value}</p>
                <p className="text-[11px] sm:text-xs uppercase tracking-widest text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}