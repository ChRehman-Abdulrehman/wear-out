import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import api from '../api';
import { imgUrl } from '../lib/img';
import { pricing } from '../lib/pricing';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, total: cartTotal, clear } = useCart();

  const buyNow = location.state?.buyNow;
  const isBuyNow = !!buyNow;

  const items = isBuyNow
    ? [{ ...buyNow.product, product: buyNow.product._id, size: buyNow.size, quantity: buyNow.quantity, shoeSize: buyNow.shoeSize || '' }]
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
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [applying, setApplying] = useState(false);

  const subtotal = isBuyNow
    ? pricing(buyNow.product).current * buyNow.quantity
    : cartTotal;

  useEffect(() => {
    api.getConfig().then(setConfig).catch(() => {});
  }, []);

  // Keep an applied coupon in sync with the current subtotal
  useEffect(() => {
    if (!coupon) return;
    let alive = true;
    api
      .validateCoupon(coupon.code, subtotal)
      .then((r) => { if (alive) setCoupon({ code: r.code, discount: r.discount }); })
      .catch(() => { if (alive) { setCoupon(null); setCouponInput(''); setCouponMsg(''); } });
    return () => { alive = false; };
  }, [subtotal]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setApplying(true);
    setCouponMsg('');
    try {
      const r = await api.validateCoupon(code, subtotal);
      setCoupon({ code: r.code, discount: r.discount });
      toast.success(`Coupon ${r.code} applied — you save Rs ${r.discount.toLocaleString()}!`);
    } catch (err) {
      setCoupon(null);
      setCouponMsg(err?.response?.data?.message || 'Invalid coupon code');
    } finally {
      setApplying(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput('');
    setCouponMsg('');
  };

  const discount = coupon ? coupon.discount : 0;
  const threshold = Number(config.freeShippingThreshold) || 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const freeShip = threshold > 0 && afterDiscount >= threshold;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Name is required';
    else if (!/^[a-zA-Z\s]+$/.test(form.fullName.trim())) e.fullName = 'Name must contain only letters';
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120) e.age = 'Enter a valid age (1-120)';
    if (!form.city.trim()) e.city = 'City is required';
    else if (!/^[a-zA-Z\s]+$/.test(form.city.trim())) e.city = 'City must contain only letters';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!/^\+?[0-9]{7,15}$/.test(form.whatsapp.replace(/\s/g, ''))) e.whatsapp = 'Enter a valid phone number (7-15 digits)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Allow control/navigation keys, block only unwanted character keys
  const isControlKey = (e) =>
    ['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Control', 'Shift', 'Alt', 'Meta', 'CapsLock'].includes(e.key) ||
    e.ctrlKey || e.altKey || e.metaKey;

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
          shoeSize: it.shoeSize || '',
        })),
        deliveryCharge: config.deliveryCharge,
        couponCode: coupon ? coupon.code : '',
      };
      const res = await api.createOrder(payload);
      setOrderRef(res.order?.reference || '');
      setDone(true);
      if (!isBuyNow) clear();
    } catch (err) {
      toast.error('Order failed: ' + (err?.response?.data?.message || 'Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    const waNumber = String(config?.contact?.whatsapp || '').replace(/[^0-9]/g, '');
    const waHref = waNumber
      ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
          `Hi Wear Out! 👋\nI just placed an order.\n• Reference: ${orderRef}\n• Name: ${form.fullName}\n• Amount: Rs ${(Math.max(0, subtotal - discount) + (Number(config.deliveryCharge) || 0)).toLocaleString()}`
        )}`
      : null;
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
        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <button className="btn-gold" onClick={() => navigate('/')}>
            Back to Home
          </button>
          <button className="btn-outline" onClick={() => navigate('/track')}>
            Track Order
          </button>
          {waHref && (
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white hover:bg-[#1da851] transition-colors">
              Confirm on WhatsApp
            </a>
          )}
        </div>
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
                placeholder="e.g. Ahmed Khan"
                onKeyDown={(e) => { if (!isControlKey(e) && (/[0-9]/.test(e.key) || /[!@#$%^&*()_+=\[\]{};':"\\|,.<>/?`~]/.test(e.key))) e.preventDefault(); }}
                onChange={(e) => setForm({ ...form, fullName: e.target.value.replace(/[^a-zA-Z\s]/g, '') })} />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="text-sm text-slate-600">Age *</label>
              <input type="number" min="1" max="120" className="input-field" value={form.age}
                placeholder="e.g. 25"
                onKeyDown={(e) => { if (!isControlKey(e) && (e.key === '-' || e.key === '+' || e.key === '.' || e.key === 'e')) e.preventDefault(); }}
                onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ''); setForm({ ...form, age: v }); }} />
              {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="text-sm text-slate-600">City *</label>
              <input className="input-field" value={form.city}
                placeholder="e.g. Lahore"
                onKeyDown={(e) => { if (!isControlKey(e) && (/[0-9]/.test(e.key) || /[!@#$%^&*()_+=\[\]{};':"\\|,.<>/?`~]/.test(e.key))) e.preventDefault(); }}
                onChange={(e) => setForm({ ...form, city: e.target.value.replace(/[^a-zA-Z\s]/g, '') })} />
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm text-slate-600">WhatsApp Number *</label>
              <input className="input-field" value={form.whatsapp}
                placeholder="+923001234567"
                inputMode="tel"
                onKeyDown={(e) => { if (!isControlKey(e) && e.key !== '+' && !/[0-9]/.test(e.key)) e.preventDefault(); }}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/[^0-9+]/g, '') })} />
              {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>}
            </div>
            <div>
              <label className="text-sm text-slate-600">Email *</label>
              <input type="email" className="input-field" value={form.email}
                placeholder="example@gmail.com"
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
              placeholder="House #, Street, Area, City"
              onKeyDown={(e) => { if (!isControlKey(e) && e.key !== '-' && e.key !== '#' && e.key !== '/' && e.key !== '.' && e.key !== ',' && !/[a-zA-Z0-9\s]/.test(e.key)) e.preventDefault(); }}
              onChange={(e) => setForm({ ...form, address: e.target.value.replace(/[^a-zA-Z0-9\s,.\-#/]/g, '') })} />
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
          {/* Coupon */}
          <div className="mt-5 pt-4 border-t border-gold/15">
            <label className="text-sm text-slate-600 block mb-2">Coupon Code</label>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-md px-3 py-2">
                <span className="text-sm text-green-800">
                  <span className="font-semibold">{coupon.code}</span> — you save Rs {discount.toLocaleString()}
                </span>
                <button type="button" className="text-xs text-red-500 hover:underline ml-2" onClick={removeCoupon}>Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  className="input-field flex-1 uppercase"
                  placeholder="e.g. SAVE10"
                  value={couponInput}
                  onChange={(e) => { setCouponInput(e.target.value); setCouponMsg(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }}
                />
                <button type="button" className="btn-outline !py-2 px-4" onClick={applyCoupon} disabled={applying}>
                  {applying ? '…' : 'Apply'}
                </button>
              </div>
            )}
            {couponMsg && <p className="text-red-500 text-xs mt-1">{couponMsg}</p>}
          </div>

          <div className="border-t border-gold/15 mt-4 pt-3 space-y-1 text-sm text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs {subtotal.toLocaleString()}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700 font-medium">
                <span>Coupon ({coupon.code})</span>
                <span>− Rs {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery (prepaid)</span>
              {freeShip ? (
                <span className="text-green-600 font-semibold">FREE 🎉</span>
              ) : (
                <span>Rs {(Number(config.deliveryCharge) || 0).toLocaleString()}</span>
              )}
            </div>
            {threshold > 0 && !freeShip && (
              <p className="text-xs text-gold-dark bg-gold/10 border border-gold/20 rounded px-2 py-1.5">
                Add Rs {(threshold - afterDiscount).toLocaleString()} more to unlock FREE delivery
              </p>
            )}
            <div className="flex justify-between border-t border-gold/15 pt-2 text-ink font-semibold text-base">
              <span>Total</span>
              <span>Rs {(afterDiscount + (freeShip ? 0 : Number(config.deliveryCharge) || 0)).toLocaleString()}</span>
            </div>
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
