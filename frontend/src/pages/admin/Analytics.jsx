import { useEffect, useState } from 'react';
import api from '../../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = {
  Completed: '#16a34a',
  'On Delivery': '#c9a24b',
  Returned: '#dc2626',
  Cancelled: '#6b7280',
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    api.getDashboard(month, year).then(setData);
  }, [month, year]);

  if (!data) return <p className="text-slate-400">Loading…</p>;

  const monthName = new Date(0, month - 1).toLocaleString('default', { month: 'long' });

  const exportCsv = () => {
    const rows = [['Report', `Analytics ${monthName} ${year}`], [], ['Day', 'Orders']];
    (data.dailyVolume || []).forEach((d) => rows.push([d.day, d.count]));
    rows.push([], ['Status', 'Count', 'Percent']);
    (data.breakdown || []).forEach((b) => rows.push([b.name, b.value, b.percent]));
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `wearout-analytics-${monthName}-${year}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const printReport = () => {
    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Wear Out Analytics ${monthName} ${year}</title>
      <style>body{font-family:Arial,sans-serif;padding:32px;color:#26211a}h1{border-bottom:2px solid #c9a24b;padding-bottom:8px}
      table{width:100%;border-collapse:collapse;margin:16px 0}td,th{border:1px solid #ddd;padding:8px;text-align:left}
      th{background:#f7f5f0}.cards{display:flex;gap:12px;flex-wrap:wrap}.card{border:1px solid #ddd;border-radius:8px;padding:12px 20px}</style></head>
      <body><h1>Wear Out — Analytics Report</h1><p>${monthName} ${year}</p>
      <div class="cards">${(data.breakdown || []).map((b) => `<div class="card"><b>${b.name}</b><br>${b.value} (${b.percent}%)</div>`).join('')}</div>
      <table><tr><th>Day</th><th>Orders</th></tr>${(data.dailyVolume || []).map((d) => `<tr><td>${d.day}</td><td>${d.count}</td></tr>`).join('')}</table>
      <p style="color:#888;margin-top:32px">Generated ${new Date().toLocaleString()} — Wear Out</p>
      <script>window.onload = () => { window.print(); };</script></body></html>`);
    w.document.close();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h1 className="text-2xl font-semibold text-ink">Analytics</h1>
        <div className="ml-auto flex items-center gap-2 text-sm flex-wrap">
          <button onClick={exportCsv} className="btn-outline !py-1.5 px-3 text-xs">Export CSV</button>
          <button onClick={printReport} className="btn-outline !py-1.5 px-3 text-xs">Print / PDF</button>
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

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="admin-surface p-5">
          <h2 className="font-semibold text-ink mb-2">Order Volume — {monthName} {year}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.dailyVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#c9a24b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-surface p-5">
          <h2 className="font-semibold text-ink mb-2">Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.breakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label={({ name, percent }) => `${name}: ${percent}%`}>
                {data.breakdown.map((d) => <Cell key={d.name} fill={COLORS[d.name]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {data.breakdown.map((b) => (
          <div key={b.name} className="admin-surface p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{b.name}</p>
            <p className="text-2xl font-bold" style={{ color: COLORS[b.name] }}>{b.value}</p>
            <p className="text-xs text-slate-400">{b.percent}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
