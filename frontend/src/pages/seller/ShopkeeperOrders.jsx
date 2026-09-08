import { useState, useEffect } from 'react';
import api from '../../api';

const STATUSES = ['Pending', 'Confirmed', 'On Delivery', 'Completed', 'Returned', 'Cancelled'];

export default function ShopkeeperOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('wearout_seller_token');

  const load = () => {
    setLoading(true);
    api.sellerGetOrders(token).then(setOrders).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.sellerUpdateOrderStatus(token, id, status);
    await load();
  };

  const copyCustomer = (o) => {
    const c = o.customer || {};
    const shoePhones = o.items?.filter((it) => it.shoePhone).map((it) => it.shoePhone).join(', ');
    const text = `Name: ${c.fullName || ''}\nPhone: ${c.whatsapp || ''}\nEmail: ${c.email || ''}\nCity: ${c.city || ''}\nAddress: ${c.address || ''}${shoePhones ? `\nShoe Phone: ${shoePhones}` : ''}`;
    navigator.clipboard.writeText(text).then(() => alert('Customer data copied!'));
  };

  if (loading) return <p className="text-slate-400">Loading orders…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-4">My Orders</h1>

      {/* Desktop table */}
      <div className="hidden md:block admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Ref</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Size</th>
                <th className="text-left p-3">Qty</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-slate-100">
                  <td className="p-3 text-ink font-medium">{o.reference}</td>
                  <td className="p-3 text-slate-600">{o.customer?.fullName}<br /><span className="text-xs text-slate-400">{o.customer?.whatsapp}</span></td>
                  <td className="p-3 text-slate-600">{o.items?.map((it) => it.name).join(', ')}</td>
                  <td className="p-3 text-slate-500">{o.items?.map((it) => it.size).join(', ')}</td>
                  <td className="p-3 text-slate-500">{o.items?.map((it) => it.quantity).join(', ')}</td>
                  <td className="p-3 text-ink">Rs {(o.total || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1">
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3">
                    <button className="text-gold-dark hover:underline text-xs" onClick={() => copyCustomer(o)}>Copy Info</button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan="8" className="p-4 text-center text-slate-400">No orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {orders.length === 0 && <p className="text-slate-400 text-center py-8">No orders yet.</p>}
        {orders.map((o) => (
          <div key={o._id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-ink font-semibold text-sm">{o.reference}</p>
                <p className="text-slate-500 text-xs">{o.customer?.fullName} • {o.customer?.whatsapp}</p>
              </div>
              <p className="text-gold font-semibold">Rs {(o.total || 0).toLocaleString()}</p>
            </div>
            <div className="text-xs text-slate-600">
              {o.items?.map((it, i) => (
                <p key={i}>{it.name} — {it.size} x {it.quantity}{it.shoePhone && <span className="text-gold ml-1">☎ {it.shoePhone}</span>}</p>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1.5 flex-1">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <button className="text-gold-dark hover:underline text-xs whitespace-nowrap" onClick={() => copyCustomer(o)}>Copy Info</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
