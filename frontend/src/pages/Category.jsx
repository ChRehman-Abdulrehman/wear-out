import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import api from '../api';
import { categoryBySlug, CATEGORIES } from '../categories';

const CATEGORY_KEYWORDS = {
  Shirts: 'buy shirts Pakistan, premium shirts online, oversized shirts, streetwear shirts Pakistan, cotton shirts, Wear Out shirts, men shirts Pakistan, women shirts Pakistan',
  Trousers: 'buy trousers Pakistan, premium trousers online, cargo pants Pakistan, streetwear trousers, men trousers Pakistan, women trousers, Wear Out trousers',
  Caps: 'buy caps Pakistan, snapback caps, streetwear caps, dad hats Pakistan, premium caps online, Wear Out caps',
  Shoes: 'buy shoes Pakistan, sneakers Pakistan, streetwear shoes, premium shoes online, trainers Pakistan, Wear Out shoes, leather shoes Pakistan',
  Watches: 'buy watches Pakistan, premium watches online, streetwear watches, casual watches Pakistan, Wear Out watches',
  Accessories: 'buy accessories Pakistan, streetwear accessories, premium accessories online, bags Pakistan, Wear Out accessories',
  'Un Stitch': 'unstitched fabric Pakistan, unstitched suits, premium lawn Pakistan, 3 piece unstitched, 2 piece unstitched, Wear Out unstitched, Pakistani suits online',
};

export default function Category() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, '');
  const cat = categoryBySlug(slug);
  const label = cat ? cat.label : slug;
  const value = cat ? cat.value : slug;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = { category: value };
    if (gender) params.gender = gender;
    api
      .getProducts(params)
      .then((r) => setProducts(r.products || r))
      .finally(() => setLoading(false));
  }, [value, gender]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO
        title={`${label} Collection — Streetwear Pakistan`}
        description={`Shop premium ${label.toLowerCase()} from Wear Out. Pakistan's boldest streetwear brand. Cash on delivery available. ${label} starting from Rs. 999.`}
        keywords={CATEGORY_KEYWORDS[value] || `buy ${label.toLowerCase()} Pakistan, ${label.toLowerCase()} online Pakistan, Wear Out ${label.toLowerCase()}, streetwear ${label.toLowerCase()} Pakistan`}
        url={`/${slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${label} Collection — Wear Out`,
          description: `Shop premium ${label.toLowerCase()} from Wear Out Pakistan.`,
          url: `https://wearout.shop/${slug}`,
          mainEntity: {
            '@type': 'ItemList',
            name: `${label} Products`,
            numberOfItems: products.length,
            itemListElement: products.slice(0, 20).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://wearout.shop/product/${p._id}`,
              name: p.name,
              offers: {
                '@type': 'Offer',
                price: p.price,
                priceCurrency: 'PKR',
                availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              },
            })),
          },
        }}
      />
      <h1 className="font-display text-5xl text-metallic tracking-wider mb-2 uppercase">{label}</h1>
      <p className="text-slate-500 mb-8">Premium staples from the Wear Out collection.</p>

      {value === 'Un Stitch' && (
        <div className="flex items-center gap-3 mb-6">
          <label className="text-sm text-slate-600 font-medium">Filter by:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-field w-auto min-w-[120px]"
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-slate-400">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} hideCategory />
          ))}
        </div>
      )}
    </div>
  );
}
