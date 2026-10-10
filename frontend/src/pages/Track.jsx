import { useState } from 'react';
import SEO from '../components/SEO';
import api from '../api';

const STATUS_FLOW = ['Order Placed', 'Processing', 'On Delivery', 'Completed'];
const STATUS_LABEL = {
  'Order Placed': 'Order Placed',
  Processing: 'Processing',
  'On Delivery': 'Out for Delivery',
  Completed: 'Delivered',
  Returned: 'Returned',
  Cancelled: 'Cancelled',
};

function Timeline({ status }) {
  const idx = STATUS_FLOW.indexOf(status);
  const failed = status === 'Cancelled' || status === 'Returned';

  if (failed) {
    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          {STATUS_FLOW.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center">
              <div className={`h-3 w-3 rounded-full ${i <= idx ? 'bg-slate-400' : 'bg-slate-200'}`} />
              <span className="text-[10px] text-slate-400 mt-1 text-center hidden sm:block">{STATUS_LABEL[s]}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs font-semibold text-red-600 mt-2">This order was {STATUS_LABEL[status].toLowerCase()}.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center">
        {STATUS_FLOW.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div className={`absolute top-1.5 right-1/2 w-full h-0.5 ${i <= idx ? 'bg-gold' : 'bg-slate-200'}`} />
            )}
            <div className={`relative z-10 h-3.5 w-3.5 rounded-full border-2 ${i <= idx ? 'bg-gold border-gold' : 'bg-white border-slate-300'}`}>
              {i <= idx && <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white">✓</span>}
            </div>
            <span className={`text-[10px] mt-1 text-center ${i <= idx ? 'text-ink font-medium' : 'text-slate-400'} hidden sm:block`}>
              {STATUS_LABEL[s]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Track() {
  const [mode, setMode] = useState('reference');
  const [reference, setReference] = useState('');
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setOrders([]);
    setLoading(true);
    try {
      const payload = mode === 'reference' ? { reference } : { phone };
      const r = await api.trackOrder(payload);
      setOrders(r.orders);
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Could not find your order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SEO title="Track Your Order" description="Track your Wear Out order by reference or phone number." url="/track" />
      <h1 className="font-display text-5xl text-metallic tracking-wider text-center">TRACK ORDER</h1>
      <p className="text-slate-500 text-center mt-2">Enter your order reference (e.g. WO-XXXX) or the phone number you ordered with.</p>

      <form onSubmit={submit} className="bg-white border border-gold/20 rounded-xl p-6 mt-8 shadow-sm">
        <div className="flex gap-2 mb-4">
          <button type="button" onClick={() => setMode('reference')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'reference' ? 'bg-black text-white' : 'bg-slate-100 text-slate-600'}`}>
            Order Reference
          </button>
          <button type="button" onClick={() => setMode('phone')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'phone' ? 'bg-black text-white' : 'bg-slate-100 text-slate-600'}`}>
            Phone Number
          </button>
        </div>

        {mode === 'reference' ? (
          <input className="input-field uppercase" placeholder="e.g. WO-ABC123" value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())} />
        ) : (
          <input className="input-field" placeholder="+923001234567" inputMode="tel" value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))} />
        )}

        <button type="submit" className="btn-gold w-full mt-4" disabled={loading}>
          {loading ? 'Searching…' : 'Track Order'}
        </button>
        {msg && <p className="text-red-500 text-sm mt-3 text-center">{msg}</p>}
      </form>

      <div className="space-y-6 mt-8">
        {orders.map((o) => (
          <div key={o._id} className="bg-white border border-gold/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <p className="font-mono font-semibold text-ink">{o.reference}</p>
                <p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                o.status === 'Completed' ? 'bg-green-100 text-green-700' :
                o.status === 'Cancelled' || o.status === 'Returned' ? 'bg-red-100 text-red-600' :
                'bg-gold/10 text-gold-dark'}`}>
                {STATUS_LABEL[o.status] || o.status}
              </span>
            </div>

            <Timeline status={o.status} />

            <div className="border-t border-gold/15 mt-4 pt-3 text-sm text-slate-600 space-y-1">
              <div className="flex justify-between"><span>Items</span><span>{o.items?.length || 0}</span></div>
              <div className="flex justify-between"><span>For {o.customer?.fullName}</span><span>Rs {Number(o.totalAmount).toLocaleString()}</span></div>
              {Number(o.deliveryCharge) > 0 && (
                <div className="flex justify-between"><span>Delivery (prepaid)</span><span>Rs {Number(o.deliveryCharge).toLocaleString()}</span></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
