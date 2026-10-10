// Seeds the12 SEO blogs into the LIVE site via admin API.
const { blogs } = require('./seed-blogs');
const BASE = process.env.LIVE_BASE || 'https://wearout.shop';
const T = { signal: AbortSignal.timeout(10000) };

async function run() {
  console.log('logging into', BASE, '…');
  const login = await (await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@wearout.store', password: 'wearout123' }),
    ...T,
  })).json();
  if (!login.token) { console.error('LIVE LOGIN FAILED:', login.message); process.exit(1); }
  const token = login.token;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // list existing slugs to avoid dupes
  const existing = await (await fetch(`${BASE}/api/blog/admin/all`, { headers, ...T })).json();
  const have = new Set((existing.blogs || existing || []).map((b) => b.slug));

  let ok = 0, skip = 0, fail = 0;
  for (const b of blogs) {
    if (have.has(b.slug)) { skip++; console.log('skip (exists):', b.slug); continue; }
    const res = await fetch(`${BASE}/api/blog/admin`, {
      method: 'POST', headers,
      body: JSON.stringify({ ...b, published: true }),
      ...T,
    });
    if (res.ok) { ok++; console.log('created:', b.slug); }
    else { fail++; console.log('FAILED:', b.slug, res.status, await res.text()); }
  }
  console.log(`LIVE blogs: ${ok} created, ${skip} skipped, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e); process.exit(1); });
