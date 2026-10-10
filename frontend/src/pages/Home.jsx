import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../api';
import { useConfig } from '../context/ConfigContext';
import { CATEGORIES } from '../categories';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saleBanner, setSaleBanner] = useState('');
  const config = useConfig();

  useEffect(() => {
    api
      .getProducts({ featured: 'true' })
      .then((res) => {
        const p = res.products || res;
        setProducts(p.slice(0, 20));
      })
      .finally(() => setLoading(false));
    api.getPublicSettings().then((s) => setSaleBanner(s?.saleBanner || '')).catch(() => {});
  }, []);

  const realCats = (config?.categories || []).filter((c) => !c.comingSoon);

  return (
    <div>
      <SEO
        title="Premium Streetwear Pakistan"
        description="Wear Out — Pakistan's boldest streetwear brand. Shop premium shirts, trousers, caps, shoes & unstitched fabric. Cash on delivery. Bold fits, clean lines, unapologetic confidence."
        keywords="streetwear Pakistan, premium clothing Pakistan, buy shirts online Pakistan, trousers Pakistan, caps Pakistan, shoes Pakistan, unstitched fabric Pakistan, COD Pakistan, bold fashion Pakistan, urban clothing Pakistan"
        url="/home"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Wear Out — Premium Streetwear Pakistan',
          description: "Pakistan's boldest streetwear brand. Shop premium shirts, trousers, caps, shoes & unstitched fabric.",
          url: 'https://wearout.shop',
          mainEntity: {
            '@type': 'ItemList',
            name: 'Featured Products',
            itemListElement: products.slice(0, 20).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://wearout.shop/product/${p._id}`,
              name: p.name,
            })),
          },
        }}
      />

      {/* Featured */}
      <section className="bg-gradient-to-b from-bone via-mist to-mist py-14">
        <div className="max-w-7xl mx-auto px-4">
          {saleBanner && (
            <div className="mb-8 rounded-md border border-gold/40 bg-gold/10 px-4 py-3 text-center text-sm font-semibold uppercase tracking-widest text-gold-dark">
              🔥 {saleBanner}
            </div>
          )}
          <div className="text-center mb-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-dark animate-pulse" />
              New Season — Streetwear Drops Live
            </p>
            <h1 className="mt-4 font-display text-5xl sm:text-6xl md:text-7xl tracking-wide text-metallic">
              Featured Collection
            </h1>
            <span className="mt-3 block h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-gold via-gold-light to-gold" />
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-black px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-gold hover:bg-neutral-800 transition-colors"
            >
              Visit Home Page →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 rounded-xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-slate-400">No featured products yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="font-display text-4xl text-metallic text-center mb-10 tracking-wider">Shop by Category</h2>
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
