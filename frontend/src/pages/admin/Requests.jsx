import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';

const fmt = (d) => (d ? new Date(d).toLocaleString() : '—');

function Section({ title, children }) {
  return (
    <div className="admin-surface p-5 mb-6">
      <h2 className="text-lg font-semibold text-ink mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function Requests() {
  const [returns, setReturns] = useState([]);
  const [notify, setNotify] = useState([]);
  const [newsletter, setNewsletter] = useState([]);
  const [settings, setSettings] = useState({ deliveryCharge: '', freeShippingThreshold: '', saleBanner: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [r, n, nl, s] = await Promise.all([
      api.adminGetReturns().catch(() => []),
      api.adminGetNotify().catch(() => []),
      api.adminGetNewsletter().catch(() => []),
      api.adminGetSettings().catch(() => null),
    ]);
    setReturns(r);
    setNotify(n);
    setNewsletter(nl);
    if (s) setSettings({ deliveryCharge: s.deliveryCharge ?? '', freeShippingThreshold: s.freeShippingThreshold ?? '', saleBanner: s.saleBanner ?? '' });
  };
  useEffect(() => { load(); }, []);

  const updateReturn = async (id, status) => {
    await api.adminUpdateReturn(id, { status });
    toast.success(`Marked ${status}`);
    await load();
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.adminSaveSettings({
        deliveryCharge: Number(settings.deliveryCharge) || 0,
        freeShippingThreshold: Number(settings.freeShippingThreshold) || 0,
        saleBanner: settings.saleBanner || '',
      });
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-4">Store Requests & Settings</h1>

      <Section title={`Return / Exchange Requests (${returns.length})`}>
        {returns.length === 0 ? (
          <p className="text-sm text-slate-400">No requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left p-2">Order</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Reason</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((r) => (
                  <tr key={r._id} className="border-t border-slate-100">
                    <td className="p-2 font-mono text-xs">{r.orderReference}</td>
                    <td className="p-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${r.type === 'Exchange' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>{r.type}</span>
                    </td>
                    <td className="p-2 text-slate-600">{r.customer?.fullName}<span className="block text-xs text-slate-400">{r.customer?.whatsapp}</span></td>
                    <td className="p-2 text-slate-600 max-w-[240px] truncate" title={r.reason}>{r.reason}</td>
                    <td className="p-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${
                        r.status === 'Approved' || r.status === 'Done' ? 'bg-green-50 text-green-600' :
                        r.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-2 space-x-1 whitespace-nowrap">
                      {['Approved', 'Rejected', 'Done'].map((s) => (
                        <button key={s} onClick={() => updateReturn(r._id, s)}
                          className={`text-xs px-2 py-0.5 rounded border ${r.status === s ? 'border-gold bg-gold/10 text-gold-dark' : 'border-slate-200 text-slate-500 hover:border-gold'}`}>
                          {s}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title={`Notify-Me Requests (${notify.length})`}>
        {notify.length === 0 ? (
          <p className="text-sm text-slate-400">No requests yet.</p>
        ) : (
          <ul className="text-sm divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {notify.map((n) => (
              <li key={n._id} className="py-2 flex justify-between gap-3">
                <span className="text-slate-700">{n.productName}</span>
                <span className="text-slate-500 font-mono text-xs">{n.contact}</span>
                <span className="text-xs text-slate-400">{fmt(n.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Newsletter Subscribers (${newsletter.length})`}>
        {newsletter.length === 0 ? (
          <p className="text-sm text-slate-400">No subscribers yet.</p>
        ) : (
          <ul className="text-sm divide-y divide-slate-100 max-h-48 overflow-y-auto">
            {newsletter.map((n) => (
              <li key={n._id} className="py-2 flex justify-between gap-3">
                <span className="text-slate-700 font-mono text-xs">{n.email}</span>
                <span className="text-xs text-slate-400">{fmt(n.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Store Settings">
        <form onSubmit={saveSettings} className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Delivery Charge (Rs)</label>
            <input type="number" min="0" className="input-field" value={settings.deliveryCharge}
              onChange={(e) => setSettings({ ...settings, deliveryCharge: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Free Shipping Above (Rs)</label>
            <input type="number" min="0" className="input-field" placeholder="0 = disabled" value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Sale Banner Text (homepage)</label>
            <input className="input-field" placeholder="e.g. EID SALE — up to 40% off" value={settings.saleBanner}
              onChange={(e) => setSettings({ ...settings, saleBanner: e.target.value })} />
          </div>
          <div className="md:col-span-3">
            <button type="submit" className="btn-gold" disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
          </div>
        </form>
      </Section>
    </div>
  );
}
