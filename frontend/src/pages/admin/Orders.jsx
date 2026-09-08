import { useEffect, useState } from 'react';
import api from '../../api';

const STATUSES = ['Order Placed', 'On Delivery', 'Completed', 'Returned', 'Cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [copied, setCopied] = useState('');

  const load = () => api.getOrders({ month, year }).then(setOrders);
  useEffect(() => { load(); }, [month, year]);

  const updateStatus = async (id, status, courier) => {
    await api.updateOrderStatus(id, status, courier);
    await load();
  };

  const copy = async (o) => {
    const items = o.items.map((i) => `  - ${i.name} (Size ${i.size} x${i.quantity})${i.shoePhone ? ` [Phone: ${i.shoePhone}]` : ''}`).join('\n');
    const text =
      `WEAR OUT ORDER — ${o.reference}\n` +
      `Name: ${o.customer.fullName}\n` +
      `Age: ${o.customer.age}\n` +
      `City: ${o.customer.city}\n` +
      `Address: ${o.customer.address}\n` +
      `WhatsApp: ${o.customer.whatsapp}\n` +
      `Email: ${o.customer.email}\n` +
      `Gender: ${o.customer.gender}\n` +
      `Courier: ${o.courier || '—'}\n` +
      `Status: ${o.status}\n` +
      `Items:\n${items}\n` +
      `Total: Rs ${(o.totalAmount + o.deliveryCharge).toLocaleString()}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(o._id);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      alert('Clipboard not available');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h1 className="text-2xl font-semibold text-ink">Orders</h1>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <select className="input-field !w-auto" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select className="input-field !w-auto" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="admin-surface overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="text-left p-3">Ref</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Age</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">Address</th>
              <th className="text-left p-3">WhatsApp</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Gender</th>
              <th className="text-left p-3">Products</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Courier</th>
              <th className="text-left p-3">Copy</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-slate-100 align-top">
                <td className="p-3 text-ink font-medium whitespace-nowrap">{o.reference}</td>
                <td className="p-3 text-ink whitespace-nowrap">{o.customer.fullName}</td>
                <td className="p-3 text-slate-600">{o.customer.age}</td>
                <td className="p-3 text-slate-600">{o.customer.city}</td>
                <td className="p-3 text-slate-600 max-w-[180px]">{o.customer.address}</td>
                <td className="p-3 text-slate-600 whitespace-nowrap">{o.customer.whatsapp}</td>
                <td className="p-3 text-slate-600 whitespace-nowrap">{o.customer.email}</td>
                <td className="p-3 text-slate-600">{o.customer.gender}</td>
                <td className="p-3 text-slate-600">
                  {o.items.map((i, idx) => (
                    <div key={idx}>{i.name} <span className="text-slate-400">({i.size} x{i.quantity})</span>{i.shoePhone && <span className="text-gold ml-1">☎ {i.shoePhone}</span>}</div>
                  ))}
                </td>
                <td className="p-3">
                  <select
                    className="input-field !py-1 !text-xs"
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value, o.courier)}
                  >
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <input
                    className="input-field !py-1 !text-xs !w-28"
                    defaultValue={o.courier}
                    onBlur={(e) => updateStatus(o._id, o.status, e.target.value)}
                    placeholder="Courier"
                  />
                </td>
                <td className="p-3">
                  <button
                    className="text-gold-dark hover:underline whitespace-nowrap"
                    onClick={() => copy(o)}
                  >
                    {copied === o._id ? 'Copied!' : 'Copy'}
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="12" className="p-4 text-center text-slate-400">No orders for this period.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
