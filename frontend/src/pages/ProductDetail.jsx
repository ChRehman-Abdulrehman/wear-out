import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import ReviewSection from '../components/ReviewSection';
import StarRating from '../components/StarRating';
import ProductCarousel from '../components/ProductCarousel';
import SEO from '../components/SEO';
import { getProductImages } from '../lib/img';

const SHOE_SIZES = [
  { us: '8', uk: '7', pk: '41' },
  { us: '8.5', uk: '7.5', pk: '42' },
  { us: '9', uk: '8', pk: '42-43' },
  { us: '9.5', uk: '8.5', pk: '43' },
  { us: '10', uk: '9', pk: '43-44' },
  { us: '10.5', uk: '9.5', pk: '44' },
  { us: '11', uk: '10', pk: '44-45' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [shoePhone, setShoePhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getProduct(id)
      .then((p) => {
        setProduct(p);
        setSize(p.sizes?.[0] || '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-slate-400 p-10">Loading…</p>;
  if (!product) return <p className="text-slate-400 p-10">Product not found.</p>;

  const images = getProductImages(product);
  const isShoes = product.category === 'Shoes';

  const handleAdd = () => {
    if (!size) return setError('Please select a size.');
    if (isShoes && !/^\+?[0-9]{7,15}$/.test(shoePhone.replace(/\s/g, '')))
      return setError('Please enter a valid phone number for shoe order.');
    addItem(product, size, qty, isShoes ? shoePhone : undefined);
    setError('');
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!size) return setError('Please select a size.');
    if (isShoes && !/^\+?[0-9]{7,15}$/.test(shoePhone.replace(/\s/g, '')))
      return setError('Please enter a valid phone number for shoe order.');
    navigate('/checkout', { state: { buyNow: { product, size, quantity: qty, shoePhone: isShoes ? shoePhone : undefined } } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <SEO
        title={`${product.name} — Rs ${product.price.toLocaleString()}`}
        description={`${product.name} — Rs ${product.price.toLocaleString()}. ${product.description?.slice(0, 140) || 'Shop premium ' + product.category + ' from Wear Out Pakistan.'} Cash on delivery available.`}
        keywords={`${product.name}, buy ${product.name} Pakistan, ${product.category} Pakistan, Wear Out ${product.category}, streetwear ${product.category}, premium ${product.category} Pakistan, Rs ${product.price.toLocaleString()}`}
        image={product.image}
        url={`/product/${product._id}`}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.image,
          brand: { '@type': 'Brand', name: 'Wear Out' },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'PKR',
            price: product.price,
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://wearout.shop/product/${product._id}`,
          },
        }}
      />
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-slate-100 rounded-xl overflow-hidden border border-gold/20">
          <ProductCarousel images={images} alt={product.name} className="w-full aspect-[3/4]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-gold border border-gold/40 px-2 py-1 rounded">
              {product.category}
            </span>
            {product.inStock ? (
              <span className="text-xs uppercase tracking-wider text-green-700 bg-green-100 border border-green-300 px-2 py-1 rounded">
                ✓ Available in Stock
              </span>
            ) : (
              <span className="text-xs uppercase tracking-wider text-red-600 bg-red-100 border border-red-300 px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>
          <h1 className="font-display text-5xl text-slate-800 mt-4 tracking-wide">{product.name}</h1>
          {product.shopName && (
            <p className="text-sm text-slate-400 mt-1">Sold by <span className="text-gold">{product.shopName}</span></p>
          )}
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating value={product.rating} />
              <span className="text-sm text-slate-400">{Number(product.rating).toFixed(1)}</span>
            </div>
          )}
          <p className="text-gold text-2xl font-semibold mt-2">Rs {product.price.toLocaleString()}</p>
          <p className="text-slate-600 mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <span className="block text-sm text-slate-500 mb-2 uppercase tracking-wider">Select Size</span>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-11 w-11 rounded-md border text-sm font-semibold transition-colors ${
                    size === s
                      ? 'border-gold bg-gold text-ink'
                      : 'border-gold/30 text-slate-800 hover:border-gold'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {isShoes && (
            <div className="mt-4 bg-slate-50 border border-gold/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">Size Conversion</h4>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200">
                    <th className="py-1.5 pr-4">US Size</th>
                    <th className="py-1.5 pr-4">UK Size</th>
                    <th className="py-1.5">PK/EU Size</th>
                  </tr>
                </thead>
                <tbody>
                  {SHOE_SIZES.map((row) => (
                    <tr key={row.us} className={`border-b border-slate-100 ${size === row.us ? 'bg-gold/10 font-semibold' : ''}`}>
                      <td className="py-1.5 pr-4">{row.us}</td>
                      <td className="py-1.5 pr-4">{row.uk}</td>
                      <td className="py-1.5">{row.pk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isShoes && (
            <div className="mt-4">
              <label className="text-sm text-slate-500 mb-1 block uppercase tracking-wider">Phone Number *</label>
              <input
                className="input-field"
                value={shoePhone}
                onChange={(e) => setShoePhone(e.target.value)}
                placeholder="+92..."
                required
              />
              <p className="text-xs text-slate-400 mt-1">Required for shoe orders</p>
            </div>
          )}

          <div className="mt-4">
            <span className="block text-sm text-slate-500 mb-2 uppercase tracking-wider">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-10 rounded-md border border-gold/30 text-slate-800 hover:border-gold text-lg font-bold flex items-center justify-center"
              >
                −
              </button>
              <span className="w-10 text-center text-lg font-semibold text-slate-800">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="h-10 w-10 rounded-md border border-gold/30 text-slate-800 hover:border-gold text-lg font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button onClick={handleAdd} className="btn-outline flex-1" disabled={!product.inStock}>
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn-gold flex-1" disabled={!product.inStock}>
              Buy Now
            </button>
          </div>

          <ul className="mt-8 text-slate-600 text-sm space-y-1">
            <li>• Cash on Delivery — pay product on delivery.</li>
            <li>• Delivery charges paid in advance.</li>
            <li>• Premium quality, bold streetwear fit.</li>
          </ul>
        </div>
      </div>

      <ReviewSection productId={id} />
    </div>
  );
}
