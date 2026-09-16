import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAdminAuth } from '../../context/AdminAuth';
import WoLogo from '../../components/WoLogo';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(form.email, form.password);
      login(res.token, res.email);
      navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-6">
          <WoLogo mode="nav" size={56} />
          <h1 className="font-display text-3xl text-ink tracking-widest mt-2">WEAR OUT</h1>
          <p className="text-slate-500 text-sm tracking-wide">Admin Control Center</p>
        </div>
        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input type="email" required className="input-field" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@wearout.store" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input type="password" required className="input-field" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
