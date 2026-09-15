import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const FAQS = [
  {
    q: 'What is Wear Out?',
    a: 'Wear Out is Pakistan\'s boldest streetwear brand. We offer premium shirts, trousers, caps, shoes, watches, accessories, and unstitched fabric with cash on delivery across Pakistan.',
  },
  {
    q: 'Does Wear Out offer cash on delivery (COD)?',
    a: 'Yes! Wear Out offers cash on delivery across Pakistan. You pay the product amount when it arrives at your doorstep.',
  },
  {
    q: 'What are the delivery charges?',
    a: 'Delivery charges are shown at checkout and vary by location. Prepaid delivery charge must be paid in advance to confirm your order.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Delivery typically takes 3-5 working days across major cities in Pakistan. Remote areas may take 5-7 working days.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery (COD). Product amount is paid when you receive your order.',
  },
  {
    q: 'What sizes are available?',
    a: 'Our clothing sizes range from S to XXL depending on the product. Shoes are available in US sizes 8 to 12. Each product page shows available sizes.',
  },
  {
    q: 'How do I choose my shoe size?',
    a: 'When ordering shoes, select your foot size from the dropdown (US 8, 9, 10, 11, or 12). Each product page also shows a US/UK/PK-EU size conversion table.',
  },
  {
    q: 'Can I return or exchange my order?',
    a: 'If you receive a damaged or wrong item, contact us within 24 hours via WhatsApp. We will arrange a replacement or exchange.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once your order is shipped, you will receive a confirmation via WhatsApp with your tracking details.',
  },
  {
    q: 'Do you offer bulk or wholesale orders?',
    a: 'Yes! We offer special wholesale pricing for shopkeepers, resellers, and businesses. Visit our Bulk Orders page or contact us on WhatsApp for details.',
  },
  {
    q: 'What is your refund policy?',
    a: 'We offer refunds only if the product is damaged or incorrect. Contact us within 24 hours of delivery with photos of the issue.',
  },
  {
    q: 'How do I contact Wear Out?',
    a: 'You can reach us via WhatsApp, email, or Facebook. Visit our Contact page for all contact details.',
  },
  {
    q: 'Where is Wear Out based?',
    a: 'Wear Out is a Pakistani streetwear brand. We ship across Pakistan including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, and all major cities.',
  },
  {
    q: 'Are the products original?',
    a: 'Yes, all Wear Out products are original designs. We focus on premium quality streetwear with bold, unique designs.',
  },
  {
    q: 'Do you have physical stores?',
    a: 'Currently, Wear Out operates online only. You can order from our website with cash on delivery.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SEO
        title="Frequently Asked Questions — Wear Out"
        description="Got questions about Wear Out? Find answers about delivery, COD, sizes, returns, bulk orders, and more. Pakistan's boldest streetwear brand."
        keywords="Wear Out FAQ, streetwear Pakistan questions, COD Pakistan, delivery charges Pakistan, shoe size guide Pakistan, Wear Out returns"
        url="/faq"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        }}
      />

      <h1 className="font-display text-4xl sm:text-5xl text-metallic tracking-wider mb-2">FAQ</h1>
      <p className="text-slate-500 mb-8">Frequently asked questions about Wear Out.</p>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-white border border-gold/20 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-medium text-ink pr-4">{faq.q}</span>
              <span className={`text-gold text-xl transition-transform duration-200 ${openIdx === i ? 'rotate-45' : ''}`}>+</span>
            </button>
            {openIdx === i && (
              <div className="px-5 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-500 mb-4">Still have questions?</p>
        <Link to="/contact" className="btn-gold inline-block px-8 py-3 text-sm font-semibold tracking-wider uppercase">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
