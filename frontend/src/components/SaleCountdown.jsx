import { useEffect, useState } from 'react';

function left(endMs) {
  const diff = Math.max(0, endMs - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function SaleCountdown({ saleEnd, saleStart }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const endMs = saleEnd ? new Date(saleEnd).getTime() : null;
  const startMs = saleStart ? new Date(saleStart).getTime() : null;
  if (!endMs && !startMs) return null;

  if (startMs && now < startMs) {
    return (
      <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-dark">
        ⏳ Sale starts in {left(startMs)}
      </div>
    );
  }
  if (endMs && now < endMs) {
    return (
      <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">
        🔥 Sale ends in <span className="font-mono tabular-nums">{left(endMs)}</span>
      </div>
    );
  }
  return null;
}
