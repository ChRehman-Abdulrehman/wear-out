import { useState } from 'react';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import api from '../api';

export default function Returns() {
  const [form, setForm] = useState({ orderReference: '', type: 'Return', reason: '', fullName: '', whatsapp: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.orderReference.trim()) e.orderReference = 'Order reference is required';
    if (!form.fullName.trim() || !/^[a-zA-Z\s]+$/.test(form.fullName.trim())) e.fullName = 'Valid name required (letters only)';
    if (!/^\+?[0-9]{7,15}$/.test(form.whatsapp.replace(/\s/g, ''))) e.whatsapp = 'Enter a valid phone number';
    if (form.reason.trim().length < 5) e.reason = 'Please describe the reason (min 5 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.createReturn({
        orderReference: form.orderReference.trim().toUpperCase(),
        type: form.type,
        reason: form.reason.trim(),
        fullName: form.fullName.trim(),
        whatsapp: form.whatsapp.replace(/\s/g, ''),
      });
      setDone(true);
      toast.success('Request submitted!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h1 className="font-display text-5xl text-metallic">REQUEST RECEIVED</h1>
        <p className="text-slate-600 mt-4">
          Thanks {form.fullName}! We received your {form.type.toLowerCase()} request for order
          <span className="text-gold font-mono"> {form.orderReference.toUpperCase()}</span>.
        </p>
        <p className="text-slate-500 mt-2 text-sm">Our team will WhatsApp you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <SEO title="Return & Exchange" description="Request a return or exchange for your Wear Out order." url="/returns" />
      <h1 className="font-display text-5xl text-metallic tracking-wider text-center">RETURN & EXCHANGE</h1>
      <p className="text-slate-500 text-center mt-2">Easy 7-day exchange. Fill the form and we'll handle the rest.</p>

      <form onSubmit={submit} className="bg-white border border-gold/20 rounded-xl p-6 mt-8 shadow-sm space-y-4">
        <div>
          <label className="text-sm text-slate-600">Order Reference *</label>
          <input className="input-field uppercase" placeholder="e.g. WO-ABC123" value={form.orderReference}
            onChange={(e) => setForm({ ...form, orderReference: e.target.value.toUpperCase() })} />
          {errors.orderReference && <p className="text-red-400 text-xs mt-1">{errors.orderReference}</p>}
        </div>

        <div>
          <label className="text-sm text-slate-600">Request Type *</label>
          <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>Return</option>
            <option>Exchange</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-600">Full Name *</label>
          <input className="input-field" placeholder="e.g. Ahmed Khan" value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value.replace(/[^a-zA-Z\s]/g, '') })} />
          {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="text-sm text-slate-600">WhatsApp Number *</label>
          <input className="input-field" placeholder="+923001234567" inputMode="tel" value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/[^0-9+]/g, '') })} />
          {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>}
        </div>

        <div>
          <label className="text-sm text-slate-600">Reason *</label>
          <textarea className="input-field min-h-[90px]" placeholder="e.g. Size is small, want to exchange for L"
            value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          {errors.reason && <p className="text-red-400 text-xs mt-1">{errors.reason}</p>}
        </div>

        <button type="submit" className="btn-gold w-full" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
