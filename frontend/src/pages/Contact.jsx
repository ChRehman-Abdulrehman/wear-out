import { useConfig } from '../context/ConfigContext';
import SEO from '../components/SEO';

export default function Contact() {
  const config = useConfig();
  const c = config?.contact || {};
  const links = [
    c.whatsapp && {
      label: 'WhatsApp',
      desc: 'Chat with us directly',
      href: `https://wa.me/${c.whatsapp}`,
      icon: '💬',
    },
    c.email && {
      label: 'Email',
      desc: 'Send us a message',
      href: `mailto:${c.email}`,
      icon: '✉️',
    },
    c.facebook && {
      label: 'Facebook',
      desc: 'Follow our page',
      href: c.facebook,
      icon: '📘',
    },
    c.instagram && {
      label: 'Instagram',
      desc: 'Follow our style',
      href: c.instagram,
      icon: '📸',
    },
    c.whatsappCommunity && {
      label: 'WhatsApp Community',
      desc: 'Join for drops & updates',
      href: c.whatsappCommunity,
      icon: '👥',
    },
  ].filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <SEO
        title="Contact Us — Get in Touch"
        description="Contact Wear Out — Pakistan's boldest streetwear brand. WhatsApp, email, Facebook & community. Fast response, cash on delivery support."
        keywords="contact Wear Out, Wear Out WhatsApp, streetwear Pakistan contact, Wear Out customer support, order help Pakistan"
        url="/contact"
      />
      <h1 className="font-display text-4xl sm:text-6xl text-metallic tracking-widest">CONTACT</h1>
      <p className="text-slate-500 mt-3 mb-10">We'd love to hear from you. Reach out through any channel below.</p>
      <div className="grid sm:grid-cols-2 gap-4 sm:justify-items-center">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="group bg-white border border-gold/20 rounded-xl p-6 hover:border-gold/50 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{l.icon}</span>
              <div>
                <p className="text-gold font-semibold text-lg group-hover:underline">{l.label}</p>
                <p className="text-slate-500 text-sm mt-0.5">{l.desc}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
