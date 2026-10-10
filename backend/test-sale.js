const mongoose = require('mongoose');
const { pricing } = require('./utils/pricing');

const BASE = 'http://localhost:5000';

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wearout');
  const Product = require('./models/Product');
  const p = await Product.findOne({ name: /Shirt/i });
  if (!p) { console.log('NO PRODUCT'); process.exit(1); }
  console.log('Product:', p.name, 'price:', p.price);

  // Set sale: 30% off
  p.salePrice = Math.round(p.price * 0.7);
  p.saleStart = null; p.saleEnd = null;
  await p.save();
  const pr = pricing(p);
  console.log('After set -> salePrice:', p.salePrice, 'current:', pr.current, 'onSale:', pr.onSale, 'pct:', pr.discountPct);

  // 1) API returns salePrice
  const g = await (await fetch(`${BASE}/api/products/${p._id}`)).json();
  console.log('API salePrice:', g.salePrice, 'price:', g.price);

  // 2) Order charges sale price
  const res = await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { fullName: 'Test User', age: 25, city: 'Lahore', address: 'House 1 Test Street', whatsapp: '+923001234567', email: 'test@example.com', gender: 'Male' },
      items: [{ product: p._id, size: 'M', quantity: 2 }],
    }),
  });
  const data = await res.json();
  const expected = p.salePrice * 2;
  console.log('Order status:', res.status, 'totalAmount:', data.order?.totalAmount, 'expected:', expected,
    data.order?.totalAmount === expected ? 'PASS ✅' : 'FAIL ❌');
  console.log('Order item price:', data.order?.items?.[0]?.price,
    data.order?.items?.[0]?.price === p.salePrice ? 'PASS ✅' : 'FAIL ❌');

  // 3) Sale window respected (end in past -> no sale)
  p.saleEnd = new Date(Date.now() - 86400000);
  await p.save();
  const pr2 = pricing(p);
  console.log('Expired sale -> onSale:', pr2.onSale, 'current:', pr2.current, pr2.onSale === false && pr2.current === p.price ? 'PASS ✅' : 'FAIL ❌');

  // cleanup: remove sale + delete test order
  p.salePrice = 0; p.saleEnd = null; p.saleStart = null;
  await p.save();
  const Order = require('./models/Order');
  await Order.deleteOne({ reference: data.order?.reference });
  console.log('cleanup done');
  process.exit(0);
}
run().catch((e) => { console.error('ERR', e.message); process.exit(1); });
