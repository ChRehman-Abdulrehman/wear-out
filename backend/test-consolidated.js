const BASE = 'http://localhost:5000';
let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => { if (cond) { pass++; console.log(`PASS ✅ ${name} ${extra}`); } else { fail++; console.log(`FAIL ❌ ${name} ${extra}`); } };

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let data = null;
  try { data = await res.json(); } catch { /* empty */ }
  return { status: res.status, data };
}

async function run() {
  // 1. Health + public config + settings
  const h = await req('GET', '/api/health');
  ok('health', h.status === 200 && h.data.ok);
  const cfg = await req('GET', '/api/admin/config');
  ok('public config', cfg.status === 200 && typeof cfg.data.deliveryCharge === 'number');
  const st = await req('GET', '/api/settings');
  ok('public settings', st.status === 200 && 'saleBanner' in st.data && 'freeShippingThreshold' in st.data);

  // 2. Admin login
  const login = await req('POST', '/api/admin/login', { email: 'admin@wearout.store', password: 'wearout123' });
  ok('admin login', login.status === 200 && login.data.token, login.data?.message || '');
  const token = login.data.token;

  // 3. Settings save (free shipping 1000 + banner) then public read
  const setSave = await req('PUT', '/api/settings/admin', { deliveryCharge: 200, freeShippingThreshold: 1000, saleBanner: 'EID SALE — 30% OFF' }, token);
  ok('settings save', setSave.status === 200);
  const st2 = await req('GET', '/api/settings');
  ok('settings public reflects save', st2.data.saleBanner === 'EID SALE — 30% OFF' && Number(st2.data.freeShippingThreshold) === 1000);
  const cfg2 = await req('GET', '/api/admin/config');
  ok('config has freeShippingThreshold', Number(cfg2.data.freeShippingThreshold) === 1000);

  // 4. Products: pick one shirt for sale test
  const prods = await req('GET', '/api/products?limit=50');
  const list = prods.data.products || prods.data;
  const shirt = list.find((p) => /shirt/i.test(p.name)) || list[0];
  ok('products list', Array.isArray(list) && list.length > 0, `(${list.length} items)`);

  // 5. Coupons: create TEST10 (Rs 100 off)
  const cCreate = await req('POST', '/api/coupons', { code: 'TEST10', type: 'flat', value: 100, minOrder: 500, active: true }, token);
  ok('coupon create', cCreate.status === 201 || cCreate.status === 200, cCreate.data?.message || '');

  // 6. Coupon validate
  const cVal = await req('POST', '/api/coupons/validate', { code: 'TEST10', subtotal: 2000 });
  ok('coupon validate (flat Rs100)', cVal.status === 200 && Number(cVal.data.discount) === 100, `discount=${cVal.data?.discount} type=${cVal.data?.type}`);

  // 7. Coupon validate — below min order
  const cLow = await req('POST', '/api/coupons/validate', { code: 'TEST10', subtotal: 100 });
  ok('coupon minOrder rejects', cLow.status === 400);

  // 8. Coupon validate — invalid code
  const cBad = await req('POST', '/api/coupons/validate', { code: 'NOPE99', subtotal: 2000 });
  ok('invalid coupon rejects', cBad.status === 400);

  // 9. Admin coupons list
  const cList = await req('GET', '/api/coupons', null, token);
  ok('admin coupons list', cList.status === 200 && (cList.data || []).some((c) => c.code === 'TEST10'));

  // 10. Order with coupon: 3 x shirt
  const order = await req('POST', '/api/orders', {
    customer: { fullName: 'Consolidated Tester', age: 25, city: 'Lahore', address: 'House 99 Test Road', whatsapp: '+923009999999', email: 'ctest@example.com', gender: 'Male' },
    items: [{ product: shirt._id, size: 'M', quantity: 3 }],
    couponCode: 'TEST10',
  });
  const ord = order.data.order || order.data;
  const itemPrice = Number(ord?.items?.[0]?.price || 0);
  const expectedPayable = itemPrice * 3 - 100;
  ok('order with coupon placed', order.status === 201 || order.status === 200, order.data?.message || '');
  ok('coupon discount applied', Number(ord?.coupon?.discount) === 100 && ord.coupon.code === 'TEST10');
  ok('totalAmount net of coupon', Number(ord?.totalAmount) === expectedPayable, `got=${ord?.totalAmount} expected=${expectedPayable}`);
  ok('free shipping above threshold', Number(ord?.deliveryCharge) === 0, `delivery=${ord?.deliveryCharge} (threshold 1000)`);

  // 11. Track by reference
  const ref = ord.reference;
  const track = await req('POST', '/api/orders/track', { reference: ref });
  ok('track by reference', track.status === 200 && (track.data?.orders || [])[0]?.status, `status=${(track.data?.orders || [])[0]?.status}`);

  // 12. Notify request
  const notify = await req('POST', '/api/notify', { productId: shirt._id, contact: '+923001112233' });
  ok('notify request', notify.status === 201 || notify.status === 200, notify.data?.message || '');

  // 13. Return request
  const ret = await req('POST', '/api/returns', {
    orderReference: ref, type: 'Exchange', reason: 'Test exchange request',
    fullName: 'Consolidated Tester', whatsapp: '+923009999999',
  });
  ok('return request', ret.status === 201 || ret.status === 200, ret.data?.message || '');

  // 14. Admin lists: notify + returns + newsletter
  const nList = await req('GET', '/api/notify/admin', null, token);
  ok('admin notify list', nList.status === 200 && (nList.data || []).length > 0);
  const rList = await req('GET', '/api/returns/admin', null, token);
  ok('admin returns list', rList.status === 200 && (rList.data || []).length > 0);
  const retId = (rList.data || []).find((r) => r.orderReference === ref)?._id;

  // 15. Admin update return status
  if (retId) {
    const rUpd = await req('PUT', `/api/returns/admin/${retId}`, { status: 'Approved' }, token);
    ok('return status update', rUpd.status === 200 && rUpd.data?.status === 'Approved');
  } else {
    ok('return status update', false, '(no id)');
  }

  // 16. Newsletter subscribe + admin list
  const nl = await req('POST', '/api/newsletter', { email: 'subscriber@example.com' });
  ok('newsletter subscribe', nl.status === 201 || nl.status === 200, nl.data?.message || '');
  const nlList = await req('GET', '/api/newsletter/admin', null, token);
  ok('admin newsletter list', nlList.status === 200 && (nlList.data || []).some((n) => n.email === 'subscriber@example.com'));

  // 17. Review with photo (1x1 gif data url)
  const gif = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
  const rev = await req('POST', '/api/reviews', { product: shirt._id, rating: 5, comment: 'Great shirt, fast delivery!', author: 'CT User', photos: [gif] });
  ok('review submit with photo', rev.status === 201 || rev.status === 200, rev.data?.message || '');
  const revId = rev.data?.review?._id;

  // 18. Approve review + fetch approved
  if (revId) {
    await req('PUT', `/api/reviews/${revId}/status`, { status: 'Approved' }, token);
    const approved = await req('GET', `/api/reviews/product/${shirt._id}`);
    const mine = (approved.data || []).find((r) => r._id === revId);
    ok('approved review shows photo', approved.status === 200 && mine && Array.isArray(mine.photos) && mine.photos.length === 1);
  } else {
    ok('approved review shows photo', false, '(no id)');
  }

  // 19. Order status update (admin) → tracking timeline
  const oUpd = await req('PUT', `/api/orders/${ord._id}/status`, { status: 'On Delivery' }, token);
  ok('admin order status update', oUpd.status === 200, oUpd.data?.message || '');
  const track2 = await req('POST', '/api/orders/track', { reference: ref });
  const st2s = (track2.data?.orders || [])[0]?.status;
  ok('track reflects new status', st2s === 'On Delivery', `status=${st2s}`);

  // 20. Settings reset (threshold 0, no banner)
  await req('PUT', '/api/settings/admin', { freeShippingThreshold: 0, saleBanner: '' }, token);

  // 21. Cleanup
  const tc = (cList.data || []).find((c) => c.code === 'TEST10');
  if (tc?._id) await req('DELETE', `/api/coupons/${tc._id}`, null, token);
  if (revId) await req('DELETE', `/api/reviews/${revId}`, null, token);
  const mongoose = require('mongoose');
  await mongoose.connect('mongodb://127.0.0.1:27017/wearout');
  await require('./models/Order').deleteOne({ reference: ref });
  if (retId) await req('PUT', `/api/returns/admin/${retId}`, { status: 'Done' }, token);
  console.log('cleanup done');

  console.log(`\n===== RESULT: ${pass} PASS / ${fail} FAIL =====`);
  process.exit(fail > 0 ? 1 : 0);
}
run().catch((e) => { console.error('ERR', e); process.exit(1); });
