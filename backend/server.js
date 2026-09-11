require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const { ensureAdminExists } = require('./controllers/adminController');
const Courier = require('./models/Courier');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : true,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/courier', require('./routes/courier'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/seller', require('./routes/shopkeepers'));
app.use('/api/seller', require('./routes/sellers'));
app.use('/api/admin', require('./routes/adminShopkeepers'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Seed default couriers
async function seedCouriers() {
  const defaults = [
    { name: 'TCS', rating: 4.2 },
    { name: 'Leopard Courier', rating: 4.0 },
    { name: 'M&P', rating: 4.4 },
  ];
  for (const c of defaults) {
    await Courier.updateOne({ name: c.name }, { $setOnInsert: { name: c.name, rating: c.rating } }, { upsert: true });
  }
}

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    await ensureAdminExists();
    await seedCouriers();
    app.listen(PORT, () => console.log(`Wear Out API running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
