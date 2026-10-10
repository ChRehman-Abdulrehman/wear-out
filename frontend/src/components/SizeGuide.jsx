import { useState } from 'react';

const CHARTS = {
  Shirts: {
    title: 'Shirts — Size Guide',
    note: 'Oversized fit. If you like a regular fit, size down.',
    rows: [
      ['Size', 'Chest (in)', 'Length (in)'],
      ['S', '40', '27'],
      ['M', '42', '28'],
      ['L', '44', '29'],
      ['XL', '46', '30'],
    ],
  },
  Trousers: {
    title: 'Trousers — Size Guide',
    note: 'Cargo / relaxed fit. Waist in inches.',
    rows: [
      ['Size', 'Waist (in)', 'Length (in)'],
      ['S', '28–30', '40'],
      ['M', '31–33', '41'],
      ['L', '34–36', '42'],
      ['XL', '37–39', '43'],
    ],
  },
  Shoes: {
    title: 'Shoes — Size Guide',
    note: 'True to size. UK/PK conversions below.',
    rows: [
      ['US', 'UK', 'PK (cm)'],
      ['8', '7', '41'],
      ['8.5', '7.5', '42'],
      ['9', '7–7.5', '42–43'],
      ['9.5', '8.5', '43'],
      ['10', '9', '43–44'],
      ['10.5', '9.5', '44'],
      ['11', '10', '44–45'],
      ['12', '11', '46'],
    ],
  },
};

const DEFAULT = {
  title: 'Size Guide',
  note: 'Apparel sizes run true. Pick your usual size for a relaxed streetwear fit.',
  rows: [
    ['Size', 'Chest (in)'],
    ['S', '38–40'],
    ['M', '41–43'],
    ['L', '44–46'],
    ['XL', '47–49'],
  ],
};

export default function SizeGuide({ category }) {
  const [open, setOpen] = useState(false);
  const chart = CHARTS[category] || DEFAULT;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs uppercase tracking-wider text-gold-dark hover:underline underline-offset-2"
      >
        Size Guide
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center px-4" onClick={() => setOpen(false)}>
          <div className="bg-white border border-gold/40 rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl text-metallic tracking-wide">{chart.title}</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-slate-400 hover:text-ink text-xl leading-none">×</button>
            </div>
            <p className="text-xs text-slate-500 mt-1">{chart.note}</p>
            <table className="w-full mt-4 text-sm border border-gold/20 rounded overflow-hidden">
              <tbody>
                {chart.rows.map((row, i) => (
                  <tr key={i} className={i === 0 ? 'bg-gold/10 font-semibold text-ink' : 'border-t border-slate-100 text-slate-600'}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 text-center">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-slate-400 mt-3">
              Still unsure? WhatsApp us your measurements — we'll help you pick.
            </p>
            <button className="btn-gold w-full mt-4" onClick={() => setOpen(false)}>Got it</button>
          </div>
        </div>
      )}
    </>
  );
}
