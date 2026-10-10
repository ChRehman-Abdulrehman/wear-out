import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

export default function NotifyMe({ product }) {
  const [contact, setContact] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setSending(true);
    try {
      const r = await api.notifyRequest({ productId: product._id, contact: contact.trim() });
      setDone(true);
      toast.success(r.message || "You'll be notified when it's back");
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save — try again');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4 text-sm text-green-800">
        ✓ You're on the list — we'll message you as soon as <span className="font-semibold">{product.name}</span> is back.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 bg-slate-50 border border-gold/20 rounded-lg p-4">
      <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Out of stock</p>
      <p className="text-xs text-slate-500 mt-1 mb-3">Leave your phone or email — we'll notify you the moment it's back.</p>
      <div className="flex gap-2">
        <input
          className="input-field flex-1"
          placeholder="Phone or email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <button type="submit" className="btn-gold !py-2 px-4 text-sm" disabled={sending}>
          {sending ? '…' : 'Notify Me'}
        </button>
      </div>
    </form>
  );
}
