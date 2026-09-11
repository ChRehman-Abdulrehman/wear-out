import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BrandHero from '../components/BrandHero';
import SEO from '../components/SEO';
import api from '../api';
import { useConfig } from '../context/ConfigContext';
import { CATEGORIES } from '../categories';
import { getProductImages } from '../lib/img';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const config = useConfig();
  const hasScrolled = useRef(false);

  useEffect(() => {
    api
      .getProducts({ featured: 'true' })
      .then((res) => {
        const p = res.products || res;
        setProducts(p.slice(0, 8));
        const allImages = [];
        p.forEach((prod) => {
          const imgs = getProductImages(prod);
          imgs.forEach((img) => allImages.push({ url: img, product: prod }));
        });
        setFeaturedImages(allImages.slice(0, 20));
      })
      .finally(() => setLoading(false));
  }, []);

  // Auto-scroll to hero buttons (Shop Now / Our Story)
  useEffect(() => {
    if (hasScrolled.current) return;
    const timer = setTimeout(() => {
      hasScrolled.current = true;
      const targetY = window.innerHeight * 0.55;
      const startY = window.scrollY;
      const diff = targetY - startY;
      if (diff <= 0) return;
      const duration = Math.min(Math.max(diff / 800, 1.2), 2.5);
      const startTime = performance.now();
      function step(now) {
        const elapsed = (now - startTime) / (duration * 1000);
        if (elapsed >= 1) { window.scrollTo(0, targetY); return; }
        const ease = 1 - Math.pow(1 - elapsed, 3);
        window.scrollTo(0, startY + diff * ease);
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, 600);
    return () => clearTimeout(timer);
  }, [loading]);

  const realCats = (config?.categories || []).filter((c) => !c.comingSoon);

  return (
    <div>
      <SEO
        title="Premium Streetwear Pakistan"
        description="Wear Out — Pakistan's boldest streetwear brand. Shop premium shirts, trousers, caps, shoes & unstitched fabric. Cash on delivery. Bold fits, clean lines, unapologetic confidence."
        keywords="streetwear Pakistan, premium clothing Pakistan, buy shirts online Pakistan, trousers Pakistan, caps Pakistan, shoes Pakistan, unstitched fabric Pakistan, COD Pakistan, bold fashion Pakistan, urban clothing Pakistan"
        url="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Wear Out — Premium Streetwear Pakistan',
          description: "Pakistan's boldest streetwear brand. Shop premium shirts, trousers, caps, shoes & unstitched fabric.",
          url: 'https://wearout.shop',
          mainEntity: {
            '@type': 'ItemList',
            name: 'Featured Products',
            itemListElement: products.slice(0, 8).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://wearout.shop/product/${p._id}`,
              name: p.name,
            })),
          },
        }}
      />
      <BrandHero />

      {/* Featured 50 images grid */}
      {featuredImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="font-display text-3xl sm:text-4xl text-metallic tracking-wider mb-6 text-center">FEATURED COLLECTION</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {featuredImages.map((item, i) => (
              <Link
                key={i}
                to={`/product/${item.product._id}`}
                className="relative aspect-square overflow-hidden rounded-lg group bg-slate-100"
              >
                <img
                  src={item.url}
                  alt={item.product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                  <span className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity truncate w-full bg-gradient-to-t from-black/60 to-transparent">
                    {item.product.name} — Rs {item.product.price.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl text-metallic tracking-wider">DROP 001</h2>
            <p className="text-slate-500 mt-1">Fresh fits. Wear your confidence.</p>
          </div>
          <Link to="/shirts" className="text-gold text-sm uppercase tracking-widest hover:underline">
            Shop all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map((n) => (
              <div key={n} className="bg-white border border-gold/20 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-slate-400">No products yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-white border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="font-display text-4xl text-metallic text-center mb-10 tracking-wider">SHOP BY CATEGORY</h2>
          <div className="grid grid-cols-3 md:flex md:flex-wrap md:justify-center gap-3">
            {realCats.map((c) => {
              const cat = CATEGORIES.find((x) => x.value === c.name);
              const slug = cat ? cat.slug : c.name.toLowerCase();
              return (
                <Link
                  key={c.name}
                  to={`/${slug}`}
                  className="block border-2 border-black rounded-lg px-4 py-3 text-center font-display text-xs sm:text-sm uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all duration-200"
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
