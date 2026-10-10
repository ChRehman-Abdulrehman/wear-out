// Post-build prerender: injects per-route SEO HTML into dist/ so Google
// sees titles, meta, headings and content WITHOUT executing JavaScript.
// Runs automatically after `vite build`. Never fails the build.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const DIST = decodeURIComponent(new URL('./dist/', import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const API_CANDIDATES = [
  process.env.PRERENDER_API,
  'http://localhost:5000/api',
  'https://wearout.shop/api',
].filter(Boolean);

const SITE = 'https://wearout.shop';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function api(path) {
  for (const base of API_CANDIDATES) {
    try {
      const r = await fetch(base + path, { signal: AbortSignal.timeout(5000) });
      if (!r.ok) continue;
      const data = await r.json();
      const list = data?.blogs || data?.products || data;
      if (Array.isArray(list) && list.length > 0) return data;
    } catch { /* try next */ }
  }
  return null;
}

function buildPages(blogs, products, categories) {
  const pages = [
    {
      path: '/',
      title: 'Wear Out — Premium Streetwear Pakistan | Wear Your Confidence',
      desc: "Pakistan's boldest streetwear brand. Shop premium shirts, trousers, caps, shoes & unstitched fabric. Cash on delivery. Bold fits, clean lines.",
      keywords: 'streetwear Pakistan, premium clothing Pakistan, COD clothing, oversized shirts Pakistan',
      h1: 'WEAR YOUR CONFIDENCE',
      body: `<p>Wear Out — Pakistan's boldest streetwear brand. Premium oversized shirts, cargo pants, sneakers, snapback caps and unstitched fabric with cash on delivery nationwide.</p>
      <h2>Shop Streetwear Categories</h2>
      <ul>${categories.map((c) => `<li><a href="/${c.toLowerCase()}">${esc(c)}</a></li>`).join('')}</ul>
      <h2>Why Wear Out?</h2>
      <ul><li>Cash on delivery across Pakistan</li><li>7-day easy exchange</li><li>Premium quality streetwear fits</li><li>Bulk &amp; reseller pricing for shopkeepers</li></ul>`,
    },
    { path: '/home', title: 'Featured Collection — Wear Out Streetwear Pakistan', desc: 'Shop the featured streetwear collection from Wear Out Pakistan — premium shirts, trousers and shoes with COD.', keywords: 'featured streetwear Pakistan, shop clothes online Pakistan COD', h1: 'Featured Collection', body: '<p>Browse the latest featured streetwear drops from Wear Out — oversized shirts, cargoes and sneakers with cash on delivery.</p>' },
    { path: '/shirts', title: 'Oversized Shirts & Tees Online Pakistan | Wear Out', desc: 'Buy premium oversized shirts and graphic tees online in Pakistan. Streetwear fits, cotton fabric, cash on delivery and easy exchange.', keywords: 'oversized shirts Pakistan, graphic tees Pakistan, buy shirts online Pakistan COD', h1: 'Shirts', body: '<p>Premium oversized shirts and graphic tees — 100% cotton, streetwear fits. Cash on delivery all over Pakistan with 7-day exchange.</p>' },
    { path: '/trousers', title: 'Cargo Pants & Trousers Online Pakistan | Wear Out', desc: 'Shop cargo pants and tapered trousers online in Pakistan. Streetwear utility fits with cash on delivery from Wear Out.', keywords: 'cargo pants Pakistan, trousers online Pakistan, buy cargoes COD', h1: 'Trousers', body: '<p>Cargo pants and tapered trousers built for streetwear — olive, black, beige. Cash on delivery nationwide.</p>' },
    { path: '/shoes', title: 'Streetwear Sneakers & Shoes Online Pakistan | Wear Out', desc: 'Buy streetwear sneakers and shoes online in Pakistan — white low-tops, chunky runners with cash on delivery.', keywords: 'sneakers Pakistan, streetwear shoes Pakistan, buy shoes online COD', h1: 'Shoes', body: '<p>Streetwear sneakers and shoes — clean white low-tops and chunky runners. COD available across Pakistan.</p>' },
    { path: '/caps', title: 'Snapback Caps & Streetwear Caps Online Pakistan | Wear Out', desc: 'Buy snapback caps and streetwear caps online in Pakistan with cash on delivery. Stitched, structured, bold.', keywords: 'caps Pakistan, snapback Pakistan, streetwear cap online', h1: 'Caps', body: '<p>Snapback caps that finish every streetwear outfit — stitched, structured, COD nationwide.</p>' },
    { path: '/watches', title: 'Watches Collection — Wear Out Pakistan', desc: 'Explore the Wear Out watches collection — bold statement pieces with cash on delivery in Pakistan.', keywords: 'watches Pakistan, streetwear watches', h1: 'Watches', body: '<p>Bold statement watches from Wear Out — coming to the storefront soon.</p>' },
    { path: '/accessories', title: 'Streetwear Accessories Online Pakistan | Wear Out', desc: 'Streetwear accessories from Wear Out Pakistan — caps, bags and more with cash on delivery.', keywords: 'streetwear accessories Pakistan', h1: 'Accessories', body: '<p>Complete your fit with Wear Out streetwear accessories — COD nationwide.</p>' },
    { path: '/unstitch', title: 'Unstitched Fabric Online Pakistan | Wear Out', desc: 'Buy quality unstitched fabric online in Pakistan — lawn, cotton and more with cash on delivery from Wear Out.', keywords: 'unstitched fabric Pakistan, lawn online Pakistan COD', h1: 'Unstitched Fabric', body: '<p>Quality unstitched fabric — lawn, cotton and blends with honest photos and cash on delivery.</p>' },
    { path: '/about', title: 'About Wear Out — Pakistan Boldest Streetwear Brand', desc: 'The story behind Wear Out — premium streetwear built in Pakistan with confidence, quality fabric and cash on delivery.', keywords: 'about Wear Out, streetwear brand Pakistan', h1: 'About Wear Out', body: '<p>We believe clothing is armor. Wear Out is Pakistan boldest streetwear brand — premium fits, honest pricing, cash on delivery everywhere.</p>' },
    { path: '/contact', title: 'Contact Wear Out — WhatsApp Support Pakistan', desc: 'Contact Wear Out for order help, sizing questions and support. WhatsApp support across Pakistan.', keywords: 'contact Wear Out, Wear Out WhatsApp', h1: 'Contact Us', body: '<p>Questions about sizing, orders or delivery? Reach Wear Out on WhatsApp — fast human support across Pakistan.</p>' },
    { path: '/faq', title: 'FAQ — Delivery, COD, Sizing & Returns | Wear Out Pakistan', desc: 'Answers about Wear Out delivery, cash on delivery, sizes, returns, exchange and bulk orders in Pakistan.', keywords: 'Wear Out FAQ, COD Pakistan delivery, returns Pakistan', h1: 'Frequently Asked Questions', body: '<p>Delivery, COD, sizing, returns and bulk orders — everything answered about shopping at Wear Out Pakistan.</p>' },
    { path: '/bulk-orders', title: 'Bulk & Wholesale Streetwear Orders Pakistan | Wear Out', desc: 'Wholesale and bulk streetwear orders for shopkeepers and resellers in Pakistan. Special pricing with Wear Out.', keywords: 'wholesale clothing Pakistan, bulk order streetwear, reseller Pakistan', h1: 'Bulk Orders', body: '<p>Shopkeeper or reseller? Get wholesale pricing on Wear Out streetwear — bulk orders across Pakistan.</p>' },
    { path: '/track', title: 'Track Your Order — Wear Out Pakistan', desc: 'Track your Wear Out order by reference or phone number. Real-time order status for Pakistan deliveries.', keywords: 'track order Pakistan, Wear Out order tracking', h1: 'Track Your Order', body: '<p>Enter your order reference or WhatsApp number to see live delivery status.</p>' },
    { path: '/returns', title: 'Return & Exchange Policy — Wear Out Pakistan', desc: 'Easy 7-day return and exchange for Wear Out orders in Pakistan. Request a return or exchange in minutes.', keywords: 'return policy Pakistan, exchange clothes online Pakistan', h1: 'Return & Exchange', body: '<p>Wrong size or changed your mind? Request a return or exchange within 7 days — process takes minutes on WhatsApp.</p>' },
    { path: '/wishlist', title: 'My Wishlist — Wear Out Pakistan', desc: 'Save your favourite Wear Out streetwear pieces — shirts, cargoes, sneakers and caps in one wishlist.', keywords: 'wishlist streetwear Pakistan', h1: 'My Wishlist', body: '<p>Save the fits you love and come back when you are ready — COD available on every order.</p>' },
    { path: '/blog', title: 'Streetwear Blog Pakistan — Style Guides & Tips | Wear Out', desc: 'Streetwear tips, outfit ideas, buying guides and style advice for Pakistani youth from the Wear Out blog.', keywords: 'streetwear blog Pakistan, fashion blog Pakistan, outfit ideas Pakistan', h1: 'Wear Out Blog', body: `<p>Style guides, outfit ideas and smart shopping tips for Pakistani streetwear.</p><ul>${blogs.slice(0, 12).map((b) => `<li><a href="/blog/${esc(b.slug)}">${esc(b.title)}</a></li>`).join('')}</ul>` },
    ...blogs.map((b) => ({
      path: `/blog/${b.slug}`,
      title: b.title,
      desc: b.metaDescription || b.excerpt,
      keywords: (b.tags || []).join(', '),
      h1: b.title,
      body: `<p>${esc(b.excerpt)}</p>${(b.content || '').slice(0, 2500)}`,
      type: 'article',
    })),
    ...products.map((p) => ({
      path: `/product/${p._id}`,
      title: `${p.name} — Rs ${p.price} | Wear Out Pakistan`,
      desc: `${p.name} — Rs ${p.price}. ${esc((p.description || '').slice(0, 140))} Cash on delivery available.`,
      keywords: `${esc(p.name)}, ${esc(p.category)} Pakistan, buy ${esc(p.name)} online Pakistan`,
      h1: p.name,
      body: `<p>${esc((p.description || '').slice(0, 300))}</p><p>Price: Rs ${p.price} — cash on delivery across Pakistan with 7-day exchange.</p>`,
      type: 'product',
    })),
  ];
  return pages;
}

function inject(baseHtml, page) {
  const url = SITE + (page.path === '/' ? '/' : page.path);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': page.type === 'article' ? 'Article' : page.type === 'product' ? 'Product' : 'WebPage',
    name: page.title,
    description: page.desc,
    url,
  };
  let html = baseHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(page.desc)}"`)
    .replace(/<meta name="keywords" content="[^"]*"/, `<meta name="keywords" content="${esc(page.keywords)}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(page.title)}"`)
    .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(page.desc)}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`)
    .replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head>`)
    .replace(
      '<div id="root"></div>',
      `<div id="root"><div class="prerender-seo"><h1>${esc(page.h1)}</h1>${page.body}</div></div>`
    );
  return html;
}

async function run() {
  const indexPath = join(DIST, 'index.html');
  if (!existsSync(indexPath)) {
    console.log('[prerender] dist/index.html missing — run vite build first');
    process.exit(0);
  }
  const baseHtml = readFileSync(indexPath, 'utf8');

  const blogRes = await api('/blog?limit=50');
  const blogs = (blogRes?.blogs || blogRes || []).filter((b) => b.published !== false);
  const prodRes = await api('/products?limit=24&featured=true');
  const products = prodRes?.products || prodRes || [];
  const categories = ['Shirts', 'Trousers', 'Caps', 'Shoes', 'Unstitch'];

  const pages = buildPages(blogs, products, categories);
  let count = 0;
  for (const page of pages) {
    const dir = page.path === '/' ? DIST : join(DIST, page.path.replace(/^\//, ''));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), inject(baseHtml, page));
    count++;
  }
  console.log(`[prerender] generated ${count} SEO pages (${blogs.length} blogs, ${products.length} products)`);
}

run().catch((e) => {
  console.log('[prerender] skipped:', e.message);
  process.exit(0); // never fail the build
});
