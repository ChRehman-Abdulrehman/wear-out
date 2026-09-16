import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

function HeroLetter({ progress, index, char }) {
  const start = 0.05 + index * 0.04;
  const end = start + 0.2;
  const x = useTransform(progress, [start, end], [index % 2 === 0 ? -40 : 40, 0]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const scale = useTransform(progress, [start, end], [0.6, 1]);
  return (
    <motion.span
      style={{ opacity, x, scale, display: 'inline-block', ...(char === ' ' ? { width: '0.45em' } : {}) }}
      className="hero-metal inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}

export default function BrandHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTagline(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const word = 'WEAR OUT';

  return (
    <section ref={ref} style={{ height: '110vh' }} className="relative bg-gradient-to-b from-bone to-mist">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/featured-hero.webp"
            alt="Wear Out featured collection"
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-black/30" />

        <div className="relative z-10 flex flex-col items-center justify-center px-4">
          <h1
            className="leading-none text-[clamp(2.25rem,12vw,8rem)]"
            style={{
              fontFamily: 'Orbitron, "Arial Black", sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              transform: 'skewX(-8deg)',
              textTransform: 'uppercase',
              textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
              color: '#fff',
            }}
          >
            {word.split('').map((ch, i) => (
              <HeroLetter key={i} progress={scrollYProgress} index={i} char={ch} />
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showTagline ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-6"
          >
            <p className="text-gold tracking-[0.15em] text-sm sm:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">Wear Your Confidence</p>
            <p className="text-white mt-4 max-w-md mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              Premium streetwear built to make a statement. Bold fits, clean lines, unapologetic confidence.
            </p>
            <div className="flex gap-3 justify-center mt-8">
              <Link to="/shirts" className="bg-black text-gold px-5 py-2.5 rounded-md font-semibold hover:bg-neutral-800 transition-colors">
                Shop Now
              </Link>
              <Link to="/about" className="bg-gold text-black px-5 py-2.5 rounded-md font-semibold hover:bg-gold-light transition-colors">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
