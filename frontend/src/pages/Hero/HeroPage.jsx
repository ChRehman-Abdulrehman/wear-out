import { useEffect, useState } from 'react';
import SEO from '../../components/SEO';
import api from '../../api';
import HeroSection from '../../components/HeroSection';

export default function HeroPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProducts({ featured: 'true' })
      .then((res) => {
        const p = res.products || res;
        setProducts(p.slice(0, 20));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SEO
        title="Wear Out — Streetwear Hero"
        description="Streetwear that speaks. Bold fits, clean lines. Shop premium shirts, trousers, caps, watches, accessories, shoes & unstitched fabric."
        keywords="wear out streetwear hero, streetwear pakistan"
        url="/home-page"
      />
      <HeroSection products={products} loading={loading} />
    </div>
  );
}