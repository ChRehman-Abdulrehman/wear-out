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
  const taglineOpacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 1]);
  const taglineY = useTransform(scrollYProgress, [0.6, 0.9], [20, 0]);

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
        <div className="absolute inset-0 z-0 bg-mist/10" />

        <div className="relative z-10 flex flex-col items-center justify-center px-4">
          <h1
            className="leading-none text-[clamp(2.25rem,12vw,8rem)]"
            style={{
              fontFamily: 'Orbitron, "Arial Black", sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              transform: 'skewX(-8deg)',
              textTransform: 'uppercase',
            }}
          >
            {word.split('').map((ch, i) => (
              <HeroLetter key={i} progress={scrollYProgress} index={i} char={ch} />
            ))}
          </h1>

          <motion.div style={{ opacity: taglineOpacity, y: taglineY }} className="mt-6">
            <p className="text-gold tracking-[0.4em] uppercase text-sm sm:text-base drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">Wear Your Confidence</p>
            <p className="text-black mt-4 max-w-md mx-auto drop-shadow-[0_1px_3px_rgba(255,255,255,0.85)]">
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
