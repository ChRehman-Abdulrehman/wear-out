import { useEffect, useState } from 'react';
import api from '../../api';

const EMPTY = { code: '', type: 'percent', value: '', minOrder: 0, maxDiscount: 0, active: true, expiresAt: '', usageLimit: 0, note: '' };

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = () => api.getCoupons().then(setCoupons).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setErr(''); };

  const openEdit = (c) => {
    setEditing(c._id);
    setErr('');
    setForm({
      code: c.code, type: c.type, value: c.value, minOrder: c.minOrder || 0, maxDiscount: c.maxDiscount || 0,
      active: c.active, expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 10) : '',
      usageLimit: c.usageLimit || 0, note: c.note || '',
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const payload = {
      code: form.code,
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      maxDiscount: Number(form.maxDiscount) || 0,
      active: form.active,
      expiresAt: form.expiresAt || '',
      usageLimit: Number(form.usageLimit) || 0,
      note: form.note,
    };
    try {
      if (editing) await api.updateCoupon(editing, payload);
      else await api.createCoupon(payload);
      setMsg(editing ? 'Coupon updated' : 'Coupon created');
      setEditing(null);
      setForm(EMPTY);
      await load();
    } catch (error) {
      setErr(error?.response?.data?.message || 'Save failed');
    }
  };

  const toggle = async (c) => {
    await api.updateCoupon(c._id, { active: !c.active });
    await load();
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete coupon ${c.code}?`)) return;
    await api.deleteCoupon(c._id);
    await load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-ink">Coupons</h1>
        <button className="btn-gold" onClick={openAdd}>+ Add Coupon</button>
      </div>
      {msg && <p className="text-sm text-green-600 mb-3">{msg}</p>}
      {err && <p className="text-sm text-red-500 mb-3">{err}</p>}

      {editing !== undefined && form && (
        <form onSubmit={submit} className="admin-surface p-5 mb-6 grid md:grid-cols-3 gap-3">
          <input className="input-field uppercase" placeholder="CODE (e.g. SAVE10)" value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
          <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="percent">Percent (%)</option>
            <option value="fixed">Fixed (Rs)</option>
          </select>
          <input className="input-field" type="number" min="1" placeholder={form.type === 'percent' ? 'Percent off (1-100)' : 'Rs off'} value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })} required />
          <input className="input-field" type="number" min="0" placeholder="Min order (Rs, 0 = none)" value={form.minOrder}
            onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
          <input className="input-field" type="number" min="0" placeholder="Max discount cap (0 = none)" value={form.maxDiscount}
            onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
          <input className="input-field" type="number" min="0" placeholder="Usage limit (0 = unlimited)" value={form.usageLimit}
            onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
          <input className="input-field" type="date" title="Expiry" value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active
          </label>
          <input className="input-field" placeholder="Note (internal)" value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <div className="md:col-span-3 flex gap-3">
            <button type="submit" className="btn-gold">Save</button>
            <button type="button" className="btn-outline" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Discount</th>
                <th className="text-left p-3">Min Order</th>
                <th className="text-left p-3">Used</th>
                <th className="text-left p-3">Expires</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-t border-slate-100">
                  <td className="p-3 font-mono font-semibold text-ink">{c.code}</td>
                  <td className="p-3 text-slate-600">
                    {c.type === 'percent' ? `${c.value}% off` : `Rs ${c.value.toLocaleString()} off`}
                    {c.maxDiscount > 0 && c.type === 'percent' && <span className="block text-xs text-slate-400">cap Rs {c.maxDiscount.toLocaleString()}</span>}
                  </td>
                  <td className="p-3 text-slate-600">Rs {(c.minOrder || 0).toLocaleString()}</td>
                  <td className="p-3 text-slate-600">{c.usedCount}{c.usageLimit > 0 ? ` / ${c.usageLimit}` : ''}</td>
                  <td className="p-3 text-slate-600">{fmtDate(c.expiresAt)}</td>
                  <td className="p-3">
                    {c.active ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Active</span>
                    ) : (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Inactive</span>
                    )}
                  </td>
                  <td className="p-3 space-x-2 whitespace-nowrap">
                    <button className="text-gold-dark hover:underline" onClick={() => openEdit(c)}>Edit</button>
                    <button className="text-slate-500 hover:underline" onClick={() => toggle(c)}>{c.active ? 'Disable' : 'Enable'}</button>
                    <button className="text-red-500 hover:underline" onClick={() => remove(c)}>Delete</button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan="7" className="p-4 text-center text-slate-400">No coupons yet. Create one to run a discount.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
