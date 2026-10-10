const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const A = (href, text) => `<a href="${href}">${text}</a>`;
const SHOP = {
  shirts: A('/shirts', 'premium shirts'),
  trousers: A('/trousers', 'cargo pants & trousers'),
  shoes: A('/shoes', 'streetwear sneakers'),
  caps: A('/caps', 'snapback caps'),
  unstitch: A('/unstitch', 'unstitched fabric'),
  bulk: A('/bulk-orders', 'bulk & reseller orders'),
  home: A('/', 'Wear Out store'),
};

const blogs = [
{
  title: 'Streetwear in Pakistan: The Complete Buying & Styling Guide (2026)',
  slug: 'streetwear-pakistan-complete-guide',
  excerpt: 'Everything about streetwear in Pakistan — what it is, top fits, where to buy with cash on delivery, and how to style bold streetwear outfits.',
  metaDescription: 'The complete streetwear Pakistan guide: best fits, outfit ideas, buying tips with COD, and styling advice from Wear Out — Pakistan boldest streetwear brand.',
  category: 'Style Guides',
  tags: ['streetwear Pakistan', 'streetwear brands Pakistan', 'streetwear outfits men', 'COD clothing Pakistan'],
  image: '/assets/logo.webp',
  content: `<p>Streetwear in Pakistan has exploded from a niche Lahore-and-Karachi subculture into the country's most-wanted everyday style. From university corridors in Islamabad to beachside hangs in Karachi, oversized fits, bold graphics and clean sneakers now define how a generation dresses. This guide breaks down exactly what streetwear is, how to build Pakistani streetwear outfits, and where to buy it online with cash on delivery.</p>
<h2>What Exactly Is Streetwear?</h2>
<p>Streetwear is casual clothing rooted in skate, hip-hop and youth culture — think oversized t-shirts, cargo pants, hoodies, snapback caps and chunky sneakers. The point is confidence, not formality. In Pakistan, streetwear works because it suits our weather (breathable cottons, light layers) and our lifestyle (university, cafés, night drives, weddings-adjacent casuals).</p>
<h2>5 Pakistani Streetwear Staples That Never Fail</h2>
<ul>
<li><strong>Oversized graphic tees &amp; shirts</strong> — the backbone of every Pakistani streetwear wardrobe. Shop ${SHOP.shirts}.</li>
<li><strong>Cargo pants &amp; tapered trousers</strong> — utility pockets + clean taper = instant outfit. Shop ${SHOP.trousers}.</li>
<li><strong>Snapback caps</strong> — the cheapest upgrade to any look. Shop ${SHOP.caps}.</li>
<li><strong>Streetwear sneakers</strong> — white low-tops or chunky runners. Shop ${SHOP.shoes}.</li>
<li><strong>A light hoodie or overshirt</strong> — for Karachi winters and Lahore December nights.</li>
</ul>
<h2>How to Build a Pakistani Streetwear Outfit (3 Formulas)</h2>
<p><strong>Formula 1 — The Daily Uniform:</strong> oversized shirt + tapered cargoes + white sneakers + snapback. Works at university, cafés, and shopping malls from Packages Mall Lahore to Dolmen Mall Karachi.</p>
<p><strong>Formula 2 — Monochrome Street:</strong> all-black or all-cream. One colour family, different textures. Black oversized tee, black cargoes, black sneakers. Slim, sharp, photographable.</p>
<p><strong>Formula 3 — Layered Night Look:</strong> tee + open overshirt + cargoes + sneakers + cap. Perfect for late-night biryani runs and university fests.</p>
<h2>Where to Buy Streetwear in Pakistan Online</h2>
<p>Instagram pages are everywhere, but for reliable sizing, real fabric, cash on delivery and easy exchanges, shop from established online stores. ${SHOP.home} offers COD across Pakistan, a proper size guide, and 7-day exchange so you never get stuck with the wrong fit. Looking to stock up for your shop? We also run ${SHOP.bulk} at wholesale rates.</p>
<h2>Streetwear Pakistan — Frequently Asked Questions</h2>
<h3>Is streetwear popular in Pakistan?</h3><p>Yes — it is currently the most popular casual style among Pakistani youth, especially university students in Lahore, Karachi, Islamabad and Faisalabad.</p>
<h3>Can I buy streetwear clothes online with cash on delivery?</h3><p>Yes. Wear Out offers cash on delivery all over Pakistan — you pay when the parcel reaches your hands.</p>
<h3>What is the best streetwear outfit for Pakistani weather?</h3><p>A cotton oversized shirt with tapered cargoes and sneakers. Breathable, comfortable in40°C summers, and easy to layer in winter.</p>
<p><strong>Ready to build your streetwear wardrobe?</strong> ${SHOP.home} and grab your first fit today — COD available, exchange easy.</p>`
},
{
  title: 'Oversized Shirts in Pakistan: How to Style the Biggest Trend',
  slug: 'oversized-shirts-pakistan-style-guide',
  excerpt: 'Oversized shirts are the #1 streetwear trend in Pakistan. See how to choose the right size, pair them, and style them for university, cafés and weddings-adjacent events.',
  metaDescription: 'Oversized shirts in Pakistan — sizing tips,5 outfit formulas, fabric guide and where to buy oversized shirts online with cash on delivery.',
  category: 'Trends',
  tags: ['oversized shirts Pakistan', 'oversized t-shirts Pakistan', 'baggy shirt trend', 'streetwear shirts COD'],
  image: '/assets/logo.webp',
  content: `<p>If one item defines Pakistani streetwear in2026, it is the <strong>oversized shirt</strong>. Available in every university, every café and every Instagram feed from Lahore to Karachi, the oversized fit has replaced the slim shirt as the default. Here is how to buy and style oversized shirts properly — not like a baggy mistake.</p>
<h2>Oversized vs Baggy: The Difference That Matters</h2>
<p>Oversized is <em>intentional</em>: dropped shoulders, a structured collar, sleeves that end near the elbow, hem that hits mid-hip. Baggy is just too big. When you shop ${SHOP.shirts}, look for "drop shoulder" and "boxy fit" descriptions — those are true oversized cuts.</p>
<h2>How to Pick Your Oversized Size</h2>
<table><thead><tr><th>Body Size</th><th>Recommended Oversized Size</th></tr></thead><tbody>
<tr><td>5'4" – 5'7" / slim</td><td>Medium (M)</td></tr>
<tr><td>5'7" – 5'10" / average</td><td>Large (L)</td></tr>
<tr><td>5'10" –6'1"</td><td>Extra Large (XL)</td></tr>
<tr><td>Broad build /6'+"</td><td>XXL</td></tr>
</tbody></table>
<p>Rule of thumb: go one size up from your regular fit, not three. Check the size chart on every product page — Pakistani brands vary wildly.</p>
<h2>5 Oversized Shirt Outfit Formulas for Pakistan</h2>
<ul>
<li><strong>University ready:</strong> oversized graphic tee + slim jeans + white sneakers + ${SHOP.caps}.</li>
<li><strong>Café hang:</strong> oversized solid shirt (cream or black) + ${SHOP.trousers} + loafers.</li>
<li><strong>Night out:</strong> oversized black tee + black cargoes + ${SHOP.shoes} + overshirt on top.</li>
<li><strong>Summer heat:</strong> oversized light cotton tee + shorts or tapered linen trousers.</li>
<li><strong>Winter Lahore:</strong> oversized tee + hoodie underneath + puffer jacket + cargoes.</li>
</ul>
<h2>Fabrics That Work in Pakistani Summers</h2>
<p>Buy <strong>100% cotton or cotton-blend (60/40)</strong> with180–220 GSM weight. Too thin and it clings in humidity; too thick and Lahore April becomes torture. Breathable knits with a matte finish look premium on camera — perfect for Pakistani streetwear photos.</p>
<h2>Oversized Shirts — FAQ</h2>
<h3>Are oversized shirts suitable for short guys in Pakistan?</h3><p>Yes — pick Medium, keep trousers slim, and show ankle. The contrast keeps proportions clean.</p>
<h3>How do I wash oversized shirts so they don't shrink?</h3><p>Cold water, inside-out, hang dry in shade. Never tumble dry Pakistani cotton.</p>
<h3>Where can I buy quality oversized shirts online in Pakistan?</h3><p>Shop the ${SHOP.shirts} collection at Wear Out — real fabric photos, size chart, COD and7-day exchange.</p>
<p><strong>Shop the trend now:</strong> ${SHOP.home} — oversized fits with cash on delivery nationwide.</p>`
},
{
  title: 'Cargo Pants in Pakistan: Men Styling Guide for Streetwear Fits',
  slug: 'cargo-pants-pakistan-men-styling-guide',
  excerpt: 'Cargo pants are Pakistani streetwear essentials. Learn the best fits, colours, and how to style cargo trousers with sneakers, tees and caps.',
  metaDescription: 'Cargo pants Pakistan guide — best fits, colours, outfit ideas and sizing tips for men. Buy cargo trousers online with COD from Wear Out.',
  category: 'Style Guides',
  tags: ['cargo pants Pakistan', 'cargo trousers men', 'streetwear pants Pakistan', 'baggy pants Pakistan'],
  image: '/assets/logo.webp',
  content: `<p><strong>Cargo pants in Pakistan</strong> have become the unofficial trouser of streetwear. Utility pockets, tough fabric and a tapered or wide-leg cut make them the easiest way to look styled without trying too hard. Here is the Pakistani man's guide to buying and wearing cargoes.</p>
<h2>Best Cargo Fits for Pakistani Builds</h2>
<ul>
<li><strong>Tapered cargo</strong> — roomy thigh, ankle taper. Universally flattering; best with sneakers. Our most popular ${SHOP.trousers}.</li>
<li><strong>Straight-leg cargo</strong> — classic military vibe; pairs with boots and chunky sneakers.</li>
<li><strong>Wide-leg cargo</strong> — maximum streetwear energy; keep the top fitted to balance.</li>
</ul>
<h2>Colours That Always Work in Pakistan</h2>
<p><strong>Olive green</strong>, <strong>black</strong>, <strong>khaki/beige</strong> and <strong>stone grey</strong>. These four match every tee you already own. Avoid shiny technical fabrics in45°C heat — matte cotton twill breathes better on Karachi and Lahore summers.</p>
<h2>3 Cargo Outfit Formulas</h2>
<p><strong>1. Classic street:</strong> white oversized tee + olive tapered cargoes + white ${SHOP.shoes} + black ${SHOP.caps}.</p>
<p><strong>2. All-black night:</strong> black cargo + black tee + black sneakers. Monochrome never misses on night drives.</p>
<p><strong>3. Layered winter:</strong> cargo + hoodie + denim or puffer jacket + boots.</p>
<h2>Cargo Pants Sizing Tips (Pakistan)</h2>
<p>Measure your waist and check the brand's inseam — Pakistani cargoes often run7–9 inches ankle opening for tapered fits. If you are between sizes, size up for wide-leg, stay true for tapered. Free exchange at Wear Out makes trying risk-free.</p>
<h2>Cargo Pants — FAQ</h2>
<h3>Are cargo pants good for Pakistani summer?</h3><p>Yes, if cotton-based with a relaxed thigh. Avoid heavy double-knee fabrics in peak summer.</p>
<h3>What shoes go with cargo pants?</h3><p>White sneakers (daily), chunky runners (streetwear), boots (winter).</p>
<h3>Where to buy cargo pants online in Pakistan with COD?</h3><p>${SHOP.trousers} at Wear Out — cash on delivery, real size chart, easy exchange.</p>
<p><strong>Grab your pair:</strong> ${SHOP.home} today.</p>`
},
{
  title: '10 Best Online Clothing Brands in Pakistan with Cash on Delivery (2026)',
  slug: 'best-online-clothing-brands-pakistan-cod',
  excerpt: 'A practical list of the best online clothing brands in Pakistan offering cash on delivery, easy exchanges and quality streetwear — including Wear Out.',
  metaDescription: 'Discover the best online clothing brands in Pakistan with cash on delivery, quality fabric, easy returns and streetwear fits. Updated2026 list.',
  category: 'Buying Guides',
  tags: ['online clothing brands Pakistan', 'COD clothes Pakistan', 'best clothing brand Pakistan', 'online shopping Pakistan'],
  image: '/assets/logo.webp',
  content: `<p>Online clothes shopping in Pakistan in2026 is huge — but inconsistent sizing, fake fabric photos and no-return policies still trap buyers. The fix: stick to brands that offer <strong>cash on delivery (COD)</strong>, transparent sizing and easy exchanges. Here are10 types of brands worth your money, with what each does best.</p>
<h2>What to Check Before Buying Clothes Online in Pakistan</h2>
<ul>
<li><strong>COD availability</strong> — pay only when the parcel arrives.</li>
<li><strong>Real fabric details</strong> — GSM, composition, and honest photos.</li>
<li><strong>Size chart with measurements</strong> — not just "M, L, XL".</li>
<li><strong>Exchange policy</strong> — minimum7 days for size swaps.</li>
<li><strong>WhatsApp support</strong> — fast human replies beat email tickets.</li>
</ul>
<h2>10 Best Online Clothing Options in Pakistan (2026)</h2>
<ol>
<li><strong>Wear Out</strong> — bold streetwear: oversized shirts, cargoes, sneakers, caps. COD everywhere,7-day exchange, ${SHOP.bulk} for shopkeepers. ${SHOP.home}.</li>
<li><strong>Premium unstitched fabric houses</strong> — for lawn, cotton suits; buy via ${SHOP.unstitch} for streetwear-adjacent casual kurtas.</li>
<li><strong>Sneaker stores</strong> — for runners and streetwear sneakers; always check return window.</li>
<li><strong>Denim specialists</strong> — jeans-only brands with strong sizing charts.</li>
<li><strong>Athleisure labels</strong> — joggers and tees for gym-to-street looks.</li>
<li><strong>Local Instagram streetwear pages</strong> — unique drops, but verify reviews first.</li>
<li><strong>Marketplace mega-stores</strong> — huge selection; quality is a lottery.</li>
<li><strong>International fast-fashion sites</strong> — shipping duty and returns are the catch.</li>
<li><strong>Handloom/craft brands</strong> — premium unstitched and embroidered pieces.</li>
<li><strong>Outlet aggregators</strong> — branded stock at discount; check fabric labels carefully.</li>
</ol>
<h2>Why COD Still Matters in Pakistan</h2>
<p>Card penetration is low; most Pakistani shoppers prefer paying cash when the rider arrives. Any brand that hides behind "advance payment only" should raise a flag. Wear Out keeps <strong>COD on every order</strong>, with only the delivery charge prepaid — the standard honest model in Pakistan.</p>
<h2>Online Clothing Brands — FAQ</h2>
<h3>Which online brand in Pakistan gives cash on delivery nationwide?</h3><p>Wear Out delivers COD across all major cities and smaller towns via courier partners.</p>
<h3>How do I avoid fake clothing brands online?</h3><p>Check recent customer reviews, real WhatsApp support, and clear return policies. Avoid pages with no physical address or refund policy.</p>
<h3>What is the best streetwear brand in Pakistan?</h3><p>For bold, premium streetwear with honest pricing and COD, Wear Out is a top pick — see the ${SHOP.home}.</p>
<p><strong>Shop trusted:</strong> ${SHOP.home} — quality you can pay for at your door.</p>`
},
/*BLOGS*/
{
  title: '10 Summer Outfit Ideas for Men in Pakistan (Beat the Heat in Style)',
  slug: 'summer-outfit-ideas-men-pakistan',
  excerpt: 'Practical summer outfit ideas for Pakistani men — lightweight streetwear fits for Lahore, Karachi and Islamabad heat that still look sharp.',
  metaDescription: '10 summer outfit ideas for men in Pakistan — breathable streetwear looks with oversized shirts, cargoes and sneakers that survive40°C heat in style.',
  category: 'Outfit Ideas',
  tags: ['summer outfits Pakistan', 'men summer fashion Pakistan', 'hot weather outfits', 'streetwear summer'],
  image: '/assets/logo.webp',
  content: `<p>Pakistani summer means40°C+ in Lahore, humid nights in Karachi, and dry heat in Islamabad. Your outfit has two jobs: keep you cool and keep you sharp. These10 summer outfit ideas for men in Pakistan use lightweight streetwear that breathes — no melting, no style loss.</p>
<h2>Golden Rules for Pakistani Summers</h2>
<ul>
<li><strong>Light colours</strong> — white, cream, stone, sky blue reflect heat.</li>
<li><strong>Loose fits</strong> — air circulation beats tight cotton every time. Oversized is functional here.</li>
<li><strong>Natural fabrics</strong> — cotton, linen blends; avoid poly-heavy knits.</li>
<li><strong>One statement piece</strong> — let the graphic tee or sneakers carry the outfit.</li>
</ul>
<h2>10 Heat-Proof Outfit Ideas</h2>
<ol>
<li>White oversized tee + beige tapered ${SHOP.trousers} + white ${SHOP.shoes}.</li>
<li>Graphic oversized ${SHOP.shirts} + black shorts + slides + ${SHOP.caps}.</li>
<li>All-cream linen-look set + loafers.</li>
<li>Sky-blue cotton shirt (sleeves rolled) + off-white trousers + sneakers.</li>
<li>Black oversized tee + olive cargoes (light cotton) + white runners.</li>
<li>Kurta-style short shirt + tapered trousers + khussa for Eid-casual days.</li>
<li>Pastel polo + stone chinos + clean white sneakers.</li>
<li>Sleeveless-friendly oversized tee + denim shorts + cap for gym-adjacent days.</li>
<li>Monochrome beige: tee + trousers + sneakers in three beige tones.</li>
<li>Night summer: black tee + black cargoes + ${SHOP.shoes} — dark colours don't show sweat under café lights.</li>
</ol>
<h2>Accessories That Survive Sweat</h2>
<p>A good snapback ${SHOP.caps} hides bad hair days and sun. Avoid heavy metal jewellery in peak heat — a clean watch or thin chain is enough.</p>
<h2>Summer Outfits — FAQ</h2>
<h3>Are black clothes okay in Pakistani summer?</h3><p>For daytime, prefer light colours. Black works for evenings, cafés and air-conditioned spaces — most summer nights in Pakistan are comfortable in dark fits.</p>
<h3>What fabric is best for40°C?</h3><p>100% cotton180–200 GSM or cotton-linen blends. Breathes and dries fast.</p>
<p><strong>Refresh your summer wardrobe:</strong> ${SHOP.home} — lightweight streetwear with COD.</p>`
},
{
  title: 'Eid Outfit Ideas for Men in Pakistan: Streetwear Edition',
  slug: 'eid-outfit-ideas-men-pakistan-streetwear',
  excerpt: 'Eid outfits for men that are special but not boring — modern streetwear-inspired looks with kurtas, trousers and sneakers that work for chand raat and Eid day.',
  metaDescription: 'Eid outfit ideas for men in Pakistan — streetwear-style looks with kurta, trousers, sneakers and caps. Eid dressing made easy for2026.',
  category: 'Outfit Ideas',
  tags: ['Eid outfit men Pakistan', 'Eid dress men', 'chand raat outfit', 'kurta streetwear'],
  image: '/assets/logo.webp',
  content: `<p>Eid dressing in Pakistan usually splits into two camps: full traditional or full western. The best-dressed guys in2026 do both at once — <strong>streetwear-informed traditional</strong>. Here are Eid outfit ideas for men that work for chand raat cafés, Eid-day dawats, and3-day marathon visits.</p>
<h2>Eid Day: The Modern Kurta Formula</h2>
<p>A well-fitted kurta (not tight, not tent-like) in ivory, sage or charcoal + tapered trousers + leather sandals or clean sneakers. The streetwear twist: skip the flashy waistcoat, add a minimal ${SHOP.caps}-style cap for chand raat, keep accessories thin.</p>
<h2>5 Eid Outfit Ideas (2026)</h2>
<ol>
<li><strong>Ivory on ivory:</strong> ivory kurta + ivory trousers + tan sandals. Monochrome tradition.</li>
<li><strong>Street kurta:</strong> black kurta + black chinos + white ${SHOP.shoes}. Sharp contrast.</li>
<li><strong>Fusion:</strong> oversized solid ${SHOP.shirts} (cream) + beige trousers + sneakers — for daytime casual dawats.</li>
<li><strong>Chand raat ready:</strong> kurta + denim jacket + sneakers + cap for café hopping.</li>
<li><strong>Family photo fit:</strong> sage green kurta + off-white trousers + brown sandals. Camera-friendly colour.</li>
</ol>
<h2>Colours That Work for Eid in Pakistan</h2>
<p>Ivory, sage, charcoal, navy, dusty rose (for bold guys). Avoid neon and loud prints — Eid photos age badly. Matte fabrics photograph better than shiny silk blends under flash.</p>
<h2>Eid Outfits — FAQ</h2>
<h3>Can I wear sneakers with a kurta on Eid?</h3><p>Absolutely — clean white or minimal sneakers with a tapered kurta is the2026 standard for young Pakistani men.</p>
<h3>What colour kurta suits wheatish/Pakistani skin tones?</h3><p>Ivory, sage green, charcoal and navy are universally flattering. Test lighting matters more than theory — check daylight, not bathroom bulbs.</p>
<h3>Where can I buy Eid outfits online in Pakistan?</h3><p>${SHOP.home} for fusion streetwear + easy-going kurta-adjacent fits, or ${SHOP.unstitch} for fabric to custom-stitch your own.</p>
<p><strong>Eid ready?</strong> ${SHOP.home} and order early — COD, easy exchange, delivered nationwide.</p>`
},
{
  title: 'How to Buy Clothes Online in Pakistan: The Safe COD Shopping Guide',
  slug: 'buy-clothes-online-pakistan-cod-guide',
  excerpt: 'Avoid scams and wrong sizes. A practical guide to buying clothes online in Pakistan — sizing, COD etiquette, returns, and how to verify a real brand.',
  metaDescription: 'Learn how to buy clothes online in Pakistan safely — COD tips, size measurement, scam avoidance and return policies. Smart online shopping2026.',
  category: 'Buying Guides',
  tags: ['online shopping Pakistan', 'COD shopping Pakistan', 'buy clothes online Pakistan', 'size guide Pakistan'],
  image: '/assets/logo.webp',
  content: `<p>Online clothes shopping in Pakistan is convenient — until a parcel arrives three sizes small, or a "brand" disappears after taking advance payment. This guide shows you how to buy clothes online the smart way: verify brands, nail your size, and use cash on delivery properly.</p>
<h2>Step1: Verify the Brand Before You Order</h2>
<ul>
<li>Real website with product pages (not just a WhatsApp catalogue).</li>
<li>Published size charts with centimetre/inch measurements.</li>
<li>Clear delivery, exchange and privacy pages.</li>
<li>Recent customer reviews with photos — not only10 generic comments.</li>
<li>WhatsApp support that answers in hours, not days.</li>
</ul>
<h2>Step2: Measure Yourself Once, Use It Forever</h2>
<table><thead><tr><th>Measurement</th><th>How</th></tr></thead><tbody>
<tr><td>Chest</td><td>Measure around the fullest part, tape snug not tight.</td></tr>
<tr><td>Waist</td><td>At your natural waistline (not where jeans sit).</td></tr>
<tr><td>Length</td><td>From shoulder point to desired hem.</td></tr>
<tr><td>Foot (shoes)</td><td>Evening measure, standing — feet swell during the day.</td></tr>
</tbody></table>
<p>Write these down. Every time you shop ${SHOP.shirts} or ${SHOP.trousers}, match measurements to the chart — not your "usual M".</p>
<h2>Step3: Use COD the Right Way</h2>
<p>Cash on delivery protects you: inspect the parcel at the door before paying if the rider allows it, and keep the packaging until you've tried the fit. Only the delivery charge is typically prepaid in Pakistan — the product amount is paid on arrival. If a brand demands100% advance with no return policy, walk away.</p>
<h2>Step4: Know the Exchange Window</h2>
<p>Exchange within the stated window (Wear Out offers7 days), keep tags on, and message support with your order reference immediately. Track your order via the ${A('/track', 'order tracking')} page anytime.</p>
<h2>Online Shopping Clothes — FAQ</h2>
<h3>Is COD available all over Pakistan?</h3><p>Most serious brands deliver COD to all major cities and many smaller towns via courier networks.</p>
<h3>What if the size is wrong?</h3><p>Use the exchange policy. Wear Out's ${A('/returns', 'Return & Exchange')} process takes minutes on WhatsApp.</p>
<h3>How do I know fabric quality is real?</h3><p>Look for GSM and composition details, close-up texture photos, and honest reviews. Vague "premium quality" claims with stock photos are a red flag.</p>
<p><strong>Shop safely:</strong> ${SHOP.home} — honest sizing, COD, easy exchange.</p>`
},
{
  title: 'Best Streetwear Sneakers & Shoes in Pakistan: Buying Guide',
  slug: 'streetwear-sneakers-shoes-pakistan-guide',
  excerpt: 'Which sneakers actually work with Pakistani streetwear fits? A guide to white low-tops, chunky runners, and how to style shoes with cargoes and oversized shirts.',
  metaDescription: 'The best streetwear sneakers and shoes in Pakistan — white low-tops, chunky runners, styling with cargoes, and where to buy with COD.',
  category: 'Buying Guides',
  tags: ['sneakers Pakistan', 'streetwear shoes Pakistan', 'white sneakers Pakistan', 'buy shoes online Pakistan'],
  image: '/assets/logo.webp',
  content: `<p>Sneakers make or break a Pakistani streetwear outfit. A great fit with dirty, mismatched shoes looks unfinished; the same outfit with clean ${SHOP.shoes} looks intentional. Here is the no-nonsense guide to streetwear sneakers in Pakistan — what to buy first, what to skip, and how to style them.</p>
<h2>The3 Sneakers Every Pakistani Wardrobe Needs</h2>
<ol>
<li><strong>Clean white low-tops</strong> — the Swiss army knife. Works with cargoes, jeans, even kurtas on Eid.</li>
<li><strong>Chunky runners</strong> — streetwear energy; pair with wide-leg cargoes and oversized tees.</li>
<li><strong>Black beaters</strong> — monochrome night fits, rainy-season backups.</li>
</ol>
<h2>What to Check Before Buying Sneakers Online in Pakistan</h2>
<ul>
<li><strong>Sole construction</strong> — cupsole for durability, EVA foam for comfort in our heat.</li>
<li><strong>True-to-size?</strong> — sneaker sizing varies by brand; read reviews for half-size advice.</li>
<li><strong>Breathability</strong> — mesh or perforated uppers survive Pakistani summers.</li>
<li><strong>Cleanable surface</strong> — smooth leather-like uppers wipe clean; suede dies in rain.</li>
</ul>
<h2>Styling Sneakers with Pakistani Streetwear</h2>
<p><strong>White sneakers:</strong> olive tapered cargoes + oversized white/graphic tee + white low-tops. The most reliable formula in Lahore and Karachi.</p>
<p><strong>Chunky runners:</strong> wide-leg cargoes + fitted tee + oversized ${SHOP.shirts} layered. Volume on volume works when the colour palette stays tight.</p>
<p><strong>Black sneakers:</strong> full monochrome. Add a ${SHOP.caps} snapback for texture.</p>
<h2>Rainy Season Reality (Monsoon)</h2>
<p>Pakistani July–August rains ruin suede fast. Keep a black "beater" pair for wet days and save whites for dry weeks. Wipe-down materials are your monsoon friend.</p>
<h2>Sneakers — FAQ</h2>
<h3>Where can I buy streetwear sneakers online in Pakistan with COD?</h3><p>Browse ${SHOP.shoes} at Wear Out — cash on delivery, size guidance, and easy exchange.</p>
<h3>Are white sneakers hard to keep clean in Pakistan?</h3><p>Dust is real — but a weekly wipe with a damp cloth keeps them fresh. Keep them for dry days.</p>
<h3>What shoes go with kurta?</h3><p>White sneakers or minimal tan sandals — both are2026-approved with tapered kurtas.</p>
<p><strong>Step up:</strong> ${SHOP.home} and finish your fit properly.</p>`
},
{
  title: 'Snapback Caps in Pakistan: How to Pick & Style Yours Like a Pro',
  slug: 'snapback-caps-pakistan-styling-guide',
  excerpt: 'Snapback caps complete Pakistani streetwear looks. How to choose the right fit, colours, and style caps with oversized shirts and cargoes.',
  metaDescription: 'Snapback caps in Pakistan — fit guide, best colours, outfit ideas and care tips. Buy streetwear caps online with COD from Wear Out.',
  category: 'Style Guides',
  tags: ['caps Pakistan', 'snapback Pakistan', 'streetwear caps', 'baseball cap Pakistan'],
  image: '/assets/logo.webp',
  content: `<p>A snapback ${SHOP.caps} is the fastest, cheapest upgrade to a Pakistani streetwear outfit. It fixes bad hair days, protects against Lahore sun, and adds a "styled" signal to even a plain tee-and-cargoes combo. Here is how to pick and wear snapbacks like you actually know what you're doing.</p>
<h2>Snapback vs Baseball Cap vs Dad Hat</h2>
<ul>
<li><strong>Snapback</strong> — flat brim, structured crown, adjustable snap. Boldest streetwear look.</li>
<li><strong>Baseball cap</strong> — curved brim, sporty-casual, most forgiving on faces.</li>
<li><strong>Dad hat</strong> — unstructured, soft, vintage vibe.</li>
</ul>
<p>For full Pakistani streetwear energy (oversized tee + cargoes + sneakers), snapbacks win.</p>
<h2>How a Cap Should Actually Fit</h2>
<p>Sit it just above the eyebrows, snug all around — it should not wobble when you shake your head. If the adjustable strap leaves a gap at the back, size down or pick an adjustable-medium. Pakistani head sizes run similar to international norms; when in doubt, adjustable snapbacks forgive more than fitted lids.</p>
<h2>4 Cap Outfit Formulas (Pakistan Edition)</h2>
<ol>
<li>White oversized ${SHOP.shirts} + olive cargoes + black snapback + white ${SHOP.shoes}.</li>
<li>All-black everything + black cap with small logo. Monochrome night uniform.</li>
<li>Blue denim jacket + white tee + beige trousers + cream cap.</li>
<li>Kurta (chand raat) + minimal black cap + sneakers. Fusion done right.</li>
</ol>
<h2>Colour Rules</h2>
<p>Match cap to your <em>shoes or trousers</em>, never all three loudly. Black cap goes with everything; white cap pops against dark outfits; olive works with earth tones. One small logo beats giant graphics for versatility.</p>
<h2>Care in Pakistani Dust & Rain</h2>
<p>Brush dust weekly, spot-clean with mild soap, air dry in shade — never machine wash snapbacks (brims die). Keep whites for dry weeks; save a dark cap for monsoon season.</p>
<h2>Snapbacks — FAQ</h2>
<h3>Which cap suits round faces?</h3><p>Structured snapbacks with a bit of crown height elongate round faces; avoid ultra-shallow crowns.</p>
<h3>Are caps popular in Pakistan?</h3><p>Extremely — from university campuses to cricket grounds, caps are everyday wear across the country.</p>
<h3>Where to buy quality snapbacks online in Pakistan?</h3><p>Shop ${SHOP.caps} at Wear Out — stitched, structured, COD nationwide.</p>
<p><strong>Top off your fit:</strong> ${SHOP.home} today.</p>`
},
{
  title: 'University Outfit Ideas in Pakistan:10 College Looks That Turn Heads',
  slug: 'university-outfit-ideas-pakistan',
  excerpt: '10 practical university outfit ideas for Pakistani students — affordable streetwear looks for lectures, presentations and cafeteria hangs.',
  metaDescription: '10 university outfit ideas for Pakistani students — affordable streetwear looks with shirts, cargoes and sneakers that work from lecture hall to cafeteria.',
  category: 'Outfit Ideas',
  tags: ['university outfit Pakistan', 'college fashion Pakistan', 'student outfit ideas', 'streetwear university'],
  image: '/assets/logo.webp',
  content: `<p>University in Pakistan is where style gets tested daily — lectures, presentations, cafeteria hangs, impromptu plans after class. You need outfits that are cheap to repeat, comfortable for8-hour days, and good enough for photos. These10 university outfit ideas use basic Pakistani streetwear pieces you can mix all semester.</p>
<h2>The Student Wardrobe Essentials</h2>
<ul>
<li>2–3 oversized ${SHOP.shirts} (white, black, one graphic)</li>
<li>2 ${SHOP.trousers} — one black, one olive or beige</li>
<li>1 slim jeans (dark wash)</li>
<li>White ${SHOP.shoes} + one cap</li>
<li>Hoodie or overshirt for winter campuses (Islamabad especially)</li>
</ul>
<p>That's roughly7 pieces creating10+ outfits.</p>
<h2>10 University Outfit Formulas</h2>
<ol>
<li>White oversized tee + black cargoes + white sneakers + cap.</li>
<li>Graphic ${SHOP.shirts} + dark jeans + sneakers.</li>
<li>Black on black: tee + cargoes + black sneakers.</li>
<li>Cream shirt + beige trousers + loafers (presentation day).</li>
<li>Olive cargoes + white tee + denim jacket (winter).</li>
<li>Pastel tee + white trousers + white sneakers (summer mornings).</li>
<li>Layered: tee + open check shirt + cargoes + sneakers.</li>
<li>Polo + chinos + clean sneakers (guest-lecture formal-casual).</li>
<li>Hoodie + cargoes + runners (Islamabad winter).</li>
<li>Monochrome beige head-to-toe. Simple, expensive-looking.</li>
</ol>
<h2>University Style Tips (Pakistan)</h2>
<p><strong>Keep shoes clean</strong> — dusty sneakers age any outfit. <strong>One fit per wash cycle</strong> — rotate to keep fabrics fresh in our heat. <strong>Presentation days:</strong> tuck the tee, add a belt, skip the cap — instant maturity without a suit.</p>
<h2>University Outfits — FAQ</h2>
<h3>How do I look stylish on a student budget in Pakistan?</h3>
<p>Buy fewer, mix more. Three quality basics beat six cheap one-offs. Wear Out's ${SHOP.home} keeps pricing student-friendly with COD so you don't block money in advance.</p>
<h3>Is streetwear allowed in Pakistani universities?</h3>
<p>Most allow casual dress; some engineering colleges have stricter norms. Tucked tees with chinos pass nearly everywhere.</p>
<h3>What about winter universities (Islamabad/Peshawar)?</h3>
<p>Layer: oversized tee + hoodie + jacket + cargoes. Remove layers indoors — campus heating varies wildly.</p>
<p><strong>Nail the semester:</strong> ${SHOP.home} — fits that survive9am lectures and6pm cafés.</p>`
},
{
  title: 'Winter Streetwear in Pakistan: Layering Guide for Lahore & Karachi Cold',
  slug: 'winter-streetwear-pakistan-layering-guide',
  excerpt: 'Pakistani winters are short but real. How to layer streetwear for Lahore, Islamabad and Karachi cold without looking bulky — hoodies, overshirts, jackets.',
  metaDescription: 'Winter streetwear Pakistan layering guide — hoodie and jacket combos for Lahore, Islamabad and Karachi cold. Stay warm, stay sharp, shop COD.',
  category: 'Style Guides',
  tags: ['winter fashion Pakistan', 'streetwear winter', 'hoodie Pakistan', 'layering guide'],
  image: '/assets/logo.webp',
  content: `<p>Pakistani winter is short — December to February, occasionally aggressive in Islamabad and Lahore, mild in Karachi — but it's when layering separates the styled from the buried-in-a-puffer crowd. This streetwear layering guide keeps you warm without the Michelin-man look.</p>
<h2>Understand Pakistani Winters</h2>
<ul>
<li><strong>Karachi:</strong>10–20°C nights. One hoodie or overshirt mostly suffices.</li>
<li><strong>Lahore:</strong>2–15°C with fog. Real layering territory.</li>
<li><strong>Islamabad/Rawalpindi:</strong>0–12°C, colder in Margalla wind. Jacket required.</li>
</ul>
<h2>The3-Layer Streetwear System</h2>
<ol>
<li><strong>Base:</strong> cotton oversized ${SHOP.shirts} or thermal-friendly tee.</li>
<li><strong>Mid:</strong> hoodie, knit sweater, or flannel overshirt — this does70% of the warmth.</li>
<li><strong>Shell:</strong> puffer, denim jacket, or windbreaker. Remove indoors, shine outdoors.</li>
</ol>
<h2>Winter Outfit Formulas</h2>
<p><strong>Lahore night:</strong> black tee + black hoodie (hood down) + black ${SHOP.trousers} + sneakers + beanie. Monochrome fog walk approved.</p>
<p><strong>Islamabad cold:</strong> thermal base + cream sweater + olive cargoes + boots + cap.</p>
<p><strong>Karachi winter:</strong> oversized tee + open overshirt + slim jeans + sneakers. Done.</p>
<p><strong>Chand raat in winter:</strong> kurta + puffer + sneakers — traditional under modern shell.</p>
<h2>Winter Colour Palette for Streetwear</h2>
<p>Charcoal, black, olive, cream, rust. Winter lets you wear darker tones that look heavy in summer. Cream knives against black cargoes photograph beautifully in Lahore fog season.</p>
<h2>Winter Layering — FAQ</h2>
<h3>How do I layer without looking fat?</h3><p>Thin base, medium mid, structured shell — and keep trousers tapered. Volume up top, clean below.</p>
<h3>Are hoodies enough for Islamabad winter?</h3><p>Not alone in January. Add a jacket shell for early-morning classes.</p>
<h3>Where to buy hoodies and winter streetwear in Pakistan?</h3><p>${SHOP.home} drops winter layers with every collection — COD, easy exchange, delivered nationwide.</p>
<p><strong>Stay warm, stay sharp:</strong> ${SHOP.home} this winter.</p>`
},
{
  title: 'Unstitched Fabric Online in Pakistan: A Smart Buyer\'s Guide',
  slug: 'unstitched-fabric-online-pakistan-guide',
  excerpt: 'Buying unstitched fabric online in Pakistan? Fabric types, yardage math, stitching tips and how to avoid common scams when ordering lawn and cotton online.',
  metaDescription: 'Unstitched fabric Pakistan buying guide — lawn vs cotton, yardage, stitching tips and scam avoidance. Buy quality unstitched material online with COD.',
  category: 'Buying Guides',
  tags: ['unstitched fabric Pakistan', 'lawn online Pakistan', 'cotton suit Pakistan', 'buy fabric online'],
  image: '/assets/logo.webp',
  content: `<p>Unstitched fabric remains Pakistan's clothing backbone — from summer lawn suits to winter khaddar. Buying it online is convenient, but fabric weight, shrinkage and yardage confuse first-time buyers. Here is how to buy ${SHOP.unstitch} smart, whether you're stitching a casual kurta or a full three-piece.</p>
<h2>Unstitched vs Stitched: Why Pakistan Still Buys Unstitched</h2>
<p>Custom fit, exact measurements, personal tailoring. A stitched-L from one brand is another brand's-M. Unstitched removes the guesswork — your darzi stitches to <em>your</em> body.</p>
<h2>Fabric Types for Pakistani Weather</h2>
<table><thead><tr><th>Fabric</th><th>Season</th><th>Notes</th></tr></thead><tbody>
<tr><td>Lawn</td><td>Summer</td><td>Light, breathable — the11-month Pakistani choice.</td></tr>
<tr><td>Cotton (cambric)</td><td>Summer</td><td>Slightly structured; great for shirts.</td></tr>
<tr><td>Khaddar</td><td>Winter</td><td>Textured, warm; Darzi-friendly.</td></tr>
<tr><td>Denim/jeans fabric</td><td>All-season (heavier)</td><td>For trousers and jackets.</td></tr>
<tr><td>Blended viscose</td><td>Summer-festive</td><td>Soft drape; needs gentle wash.</td></tr>
</tbody></table>
<h2>How Much Fabric Do You Need?</h2>
<ul>
<li><strong>Men's kurta (standard):</strong>2.5–3 metres.</li>
<li><strong>Shirt + trousers set:</strong>4.5–5.5 metres total.</li>
<li><strong>Three-piece women's suit:</strong> typically sold as pre-measured sets.</li>
</ul>
<p>Buy an extra half-metre for shrinkage insurance — cotton shrinks2–4% on first wash.</p>
<h2>How to Avoid Online Fabric Scams in Pakistan</h2>
<ul>
<li>Insist on close-up texture photos in daylight, not catalogue renders.</li>
<li>Ask for GSM/weight on messaging — sellers who know it, sell real fabric.</li>
<li>Prefer COD so you can feel the fabric before full payment (delivery charge prepaid).</li>
<li>Check exchange policy — colour looks different on screens always.</li>
</ul>
<h2>Stitching Tips</h2>
<p>Pre-wash fabric before stitching (pre-shrink). Match lining weight to season. Keep seams flat-felled for durability. For streetwear-style kurtas, ask for a straight hem and side slits — pairs well with sneakers.</p>
<h2>Unstitched Fabric — FAQ</h2>
<h3>What is the difference between lawn and cotton?</h3><p>Lawn is a finer, lighter weave — cooler in peak summer. Cotton is more structured and versatile year-round.</p>
<h3>How many metres for a men's shalwar kameez?</h3><p>Usually4.5–5 metres depending on size and style; confirm with your tailor first.</p>
<h3>Where can I buy unstitched fabric online in Pakistan with COD?</h3><p>${SHOP.unstitch} at Wear Out — honest fabric photos, cash on delivery, easy exchange.</p>
<p><strong>Buy fabric you can trust:</strong> ${SHOP.home} — quality unstitched material nationwide.</p>`
},
/*BLOGS*/
];

async function run() {
  console.log('connecting db…');
  await mongoose.connect('mongodb://127.0.0.1:27017/wearout', {
    family: 4,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  console.log('db connected, seeding', blogs.length, 'blogs…');
  let created = 0, updated = 0;
  for (const b of blogs) {
    const r = await Blog.updateOne(
      { slug: b.slug },
      { $set: { ...b, published: true } },
      { upsert: true }
    );
    if (r.upsertedCount) created++; else updated++;
    console.log(' -', b.slug, r.upsertedCount ? 'created' : 'updated');
  }
  console.log(`blogs: ${created} created, ${updated} updated, total ${blogs.length}`);
  await mongoose.disconnect();
  process.exit(0);
}
run().catch((e) => { console.error(e); process.exit(1); });
