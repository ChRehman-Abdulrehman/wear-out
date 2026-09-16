import { useConfig } from '../context/ConfigContext';
import SEO from '../components/SEO';

export default function BulkOrders() {
  const config = useConfig();
  const whatsapp = config?.contact?.whatsapp || '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO
        title="Bulk Orders & Wholesale — Wear Out Pakistan"
        description="Order Wear Out streetwear in bulk. Special wholesale pricing for shopkeepers, resellers & businesses in Pakistan. Contact us for bulk deals."
        keywords="bulk order Pakistan, wholesale streetwear Pakistan, Wear Out wholesale, reseller Pakistan, shopkeeper bulk order, wholesale clothing Pakistan, buy in bulk Pakistan"
        url="/bulk-orders"
      />
      <h1 className="font-display text-4xl sm:text-5xl text-metallic tracking-wider mb-6 text-center">
        Bulk Orders &amp; Resellers
      </h1>

      <div className="bg-white border border-gold/20 rounded-2xl p-6 sm:p-10 shadow-sm">
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          Are you a shopkeeper, reseller, or business looking to stock <strong className="text-ink">Wear Out</strong> premium streetwear? We offer <strong className="text-gold">special wholesale pricing</strong> for bulk orders.
        </p>

        <div className="space-y-4 text-slate-600 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-gold text-xl mt-0.5">✓</span>
            <p>Minimum order quantity applies for wholesale pricing.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gold text-xl mt-0.5">✓</span>
            <p>Competitive rates for resellers and shop owners.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gold text-xl mt-0.5">✓</span>
            <p>Custom assortments — mix and match categories (Shirts, Trousers, Caps, Unstitched, and more).</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gold text-xl mt-0.5">✓</span>
            <p>Nationwide delivery across Pakistan.</p>
          </div>
        </div>

        <div className="text-center">
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi! I am interested in bulk/wholesale orders for Wear Out. Please share the details.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
            >
              Contact Us on WhatsApp for Bulk Orders
            </a>
          ) : (
            <p className="text-slate-400">WhatsApp contact not configured yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
