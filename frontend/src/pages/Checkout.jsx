import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';
import { imgUrl } from '../lib/img';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, total: cartTotal, clear } = useCart();

  const buyNow = location.state?.buyNow;
  const isBuyNow = !!buyNow;

  const items = isBuyNow
    ? [{ ...buyNow.product, product: buyNow.product._id, size: buyNow.size, quantity: buyNow.quantity, shoePhone: buyNow.shoePhone || '' }]
    : cartItems;

  const [config, setConfig] = useState({ deliveryCharge: 0 });
  const [form, setForm] = useState({
    fullName: '',
    age: '',
    city: '',
    address: '',
    whatsapp: '',
    email: '',
    gender: 'Male',
  });
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  useEffect(() => {
    api.getConfig().then(setConfig).catch(() => {});
  }, []);

  useEffect(() => {
    if (done) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [done]);

  if (items.length === 0 && !done) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-5xl text-metallic">CHECKOUT</h1>
        <p className="text-slate-500 mt-4">Your cart is empty.</p>
      </div>
    );
  }

  const subtotal = isBuyNow
    ? buyNow.product.price * buyNow.quantity
    : cartTotal;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.age || Number(form.age) < 1) e.age = 'Valid age required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!/^\+?[0-9]{7,15}$/.test(form.whatsapp.replace(/\s/g, ''))) e.whatsapp = 'Enter a valid phone number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onPlaceOrder = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setShowPopup(true); // require delivery-charge acknowledgement
  };

  const confirmAndSubmit = async () => {
    setShowPopup(false);
    setSubmitting(true);
    try {
      const payload = {
        customer: {
          fullName: form.fullName,
          age: Number(form.age),
          city: form.city,
          address: form.address,
          whatsapp: form.whatsapp.replace(/\s/g, ''),
          email: form.email,
          gender: form.gender,
        },
        items: items.map((it) => ({
          product: it.product,
          size: it.size,
          quantity: it.quantity,
          shoePhone: it.shoePhone || '',
        })),
        deliveryCharge: config.deliveryCharge,
      };
      const res = await api.createOrder(payload);
      setOrderRef(res.order?.reference || '');
      setDone(true);
      if (!isBuyNow) clear();
    } catch (err) {
      alert('Order failed: ' + (err?.response?.data?.message || 'Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="font-display text-5xl text-metallic">ORDER CONFIRMED</h1>
        <p className="text-slate-600 mt-4">
          Thanks, {form.fullName}! Your order <span className="text-gold">{orderRef}</span> is placed.
        </p>
        <p className="text-slate-500 mt-2 text-sm">
          Pay the delivery charge in advance; the product is paid on delivery.
        </p>
        <button className="btn-gold mt-8" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-metallic mb-8">CHECKOUT</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* form */}
        <form onSubmit={onPlaceOrder} className="md:col-span-2 space-y-4 bg-white border border-gold/20 rounded-xl p-6 shadow-sm">
          <h2 className="text-gold font-semibold uppercase tracking-wider">Delivery Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">Full Name *</label>
              <input className="input-field" value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="text-sm text-slate-600">Age *</label>
              <input type="number" className="input-field" value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })} />
              {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="text-sm text-slate-600">City *</label>
              <input className="input-field" value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })} />
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm text-slate-600">WhatsApp Number *</label>
              <input className="input-field" value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+92..." />
              {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>}
            </div>
            <div>
              <label className="text-sm text-slate-600">Email *</label>
              <input className="input-field" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm text-slate-600">Gender *</label>
              <select className="input-field" value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600">Full Address *</label>
            <textarea className="input-field min-h-[80px]" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} />
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
          </div>
          <button type="submit" disabled={submitting} className="btn-gold w-full">
            {submitting ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>

        {/* summary */}
        <div className="bg-white border border-gold/20 rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-gold font-semibold uppercase tracking-wider mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.product + it.size} className="flex items-center gap-3">
                <img src={imgUrl(it.image)} alt={it.name} className="h-12 w-10 object-cover rounded" />
                <div className="flex-1 text-sm">
                  <p className="text-slate-800">{it.name}</p>
                  <p className="text-slate-400">Size {it.size} × {it.quantity}</p>
                </div>
                <span className="text-gold text-sm">Rs {(it.price * it.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gold/15 mt-4 pt-3 space-y-1 text-sm text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Delivery (prepaid)</span><span>Rs {config.deliveryCharge.toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      {/* Delivery-charge confirmation popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center px-4" onClick={() => setShowPopup(false)}>
          <div className="bg-white border border-gold/40 rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-3xl text-metallic">Cash on Delivery</h3>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
              You pay the <span className="text-gold font-semibold">product amount on delivery</span>. However, the
              <span className="text-gold font-semibold"> delivery charge of Rs {config.deliveryCharge.toLocaleString()}</span> must be
              paid in advance to confirm your order.
            </p>
            <div className="flex gap-3 mt-6">
              <button className="btn-outline flex-1" onClick={() => setShowPopup(false)}>Cancel</button>
              <button className="btn-gold flex-1" onClick={confirmAndSubmit} disabled={submitting}>
                {submitting ? 'Processing…' : 'Pay Delivery & Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
