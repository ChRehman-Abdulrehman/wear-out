const mongoose = require('mongoose');
const Order = require('../models/Order');
const Courier = require('../models/Courier');

const FOUR_CATEGORIES = ['Completed', 'On Delivery', 'Returned', 'Cancelled'];

// Map the 5 internal order statuses into the 4 public analytics categories.
function toCategory(status) {
  switch (status) {
    case 'Completed':
      return 'Completed';
    case 'Order Placed':
    case 'Processing':
    case 'On Delivery':
      return 'On Delivery';
    case 'Returned':
      return 'Returned';
    case 'Cancelled':
      return 'Cancelled';
    default:
      return null;
  }
}

function monthRange(month, year) {
  const m = parseInt(month, 10) - 1;
  const y = parseInt(year, 10);
  return { start: new Date(y, m, 1), end: new Date(y, m + 1, 1) };
}

// ---------- Monthly dashboard ----------
exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month || now.getMonth() + 1;
    const year = req.query.year || now.getFullYear();
    const { start, end } = monthRange(month, year);

    const orders = await Order.find({ createdAt: { $gte: start, $lt: end } });

    const categories = { Completed: 0, 'On Delivery': 0, Returned: 0, Cancelled: 0 };
    const daily = {};
    for (const o of orders) {
      const cat = toCategory(o.status);
      if (cat) categories[cat] += 1;
      const day = new Date(o.createdAt).getDate();
      daily[day] = (daily[day] || 0) + 1;
    }
    const dailyVolume = Object.keys(daily)
      .map((d) => ({ day: Number(d), count: daily[d] }))
      .sort((a, b) => a.day - b.day);

    const breakdown = FOUR_CATEGORIES.map((c) => ({
      name: c,
      value: categories[c],
      percent: orders.length ? Math.round((categories[c] / orders.length) * 1000) / 10 : 0,
    }));

    res.json({
      month: Number(month),
      year: Number(year),
      total: orders.length,
      categories,
      breakdown,
      dailyVolume,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- Customers ----------
exports.getCustomers = async (req, res) => {
  try {
    const agg = await Order.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$customer.whatsapp',
          name: { $first: '$customer.fullName' },
          email: { $first: '$customer.email' },
          city: { $first: '$customer.city' },
          gender: { $first: '$customer.gender' },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: { $add: ['$totalAmount', '$deliveryCharge'] } },
          lastOrder: { $max: '$createdAt' },
        },
      },
      { $sort: { orderCount: -1, lastOrder: -1 } },
    ]);
    res.json(agg);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- Courier Hub ----------
exports.getCouriers = async (req, res) => {
  try {
    const couriers = await Courier.find().sort({ name: 1 });
    res.json(couriers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleCourier = async (req, res) => {
  try {
    const { id } = req.params;
    const courier = await Courier.findById(id);
    if (!courier) return res.status(404).json({ message: 'Courier not found' });
    courier.connected = !courier.connected;
    await courier.save();
    res.json(courier);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// AI Delivery Optimizer: fastest courier for a city based on avg delivery time.
exports.getDeliveryOptimizer = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { status: 'Completed', courier: { $ne: '' }, deliveredAt: { $exists: true, $ne: null } } },
      {
        $project: {
          city: 1,
          courier: 1,
          durationHrs: { $divide: [{ $subtract: ['$deliveredAt', '$createdAt'] }, 3600000] },
        },
      },
      {
        $group: {
          _id: { city: '$city', courier: '$courier' },
          avgHrs: { $avg: '$durationHrs' },
          count: { $sum: 1 },
        },
      },
    ]);
    if (!data.length) {
      return res.json({ ready: false, insights: [] });
    }
    // Best (lowest avg) courier per city
    const byCity = {};
    for (const d of data) {
      const city = d._id.city;
      if (!byCity[city] || d.avgHrs < byCity[city].avgHrs) {
        byCity[city] = { courier: d._id.courier, avgHrs: d.avgHrs, count: d.count };
      }
    }
    const insights = Object.entries(byCity).map(([city, v]) => ({
      city,
      courier: v.courier,
      avgHrs: Math.round(v.avgHrs * 10) / 10,
      text: `Based on delivery data, ${v.courier} is fastest in ${city} (~${Math.round(v.avgHrs * 10) / 10}h avg).`,
    }));
    res.json({ ready: true, insights });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- AI Logistics Intelligence ----------
exports.getLogistics = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month || now.getMonth() + 1;
    const year = req.query.year || now.getFullYear();
    const { start, end } = monthRange(month, year);

    const orders = await Order.find({ createdAt: { $gte: start, $lt: end } });

    // 4-category donut (overall for selected month)
    const categories = { Completed: 0, 'On Delivery': 0, Returned: 0, Cancelled: 0 };
    for (const o of orders) {
      const cat = toCategory(o.status);
      if (cat) categories[cat] += 1;
    }
    const donut = FOUR_CATEGORIES.map((c) => ({
      name: c,
      value: categories[c],
      percent: orders.length ? Math.round((categories[c] / orders.length) * 1000) / 10 : 0,
    }));

    // Completed deliveries with delivery time + success per (city, courier)
    const deliveries = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end }, courier: { $ne: '' }, deliveredAt: { $exists: true, $ne: null } } },
      {
        $project: {
          city: '$customer.city',
          courier: 1,
          returned: { $cond: [{ $eq: ['$status', 'Returned'] }, 1, 0] },
          durationHrs: { $divide: [{ $subtract: ['$deliveredAt', '$createdAt'] }, 3600000] },
        },
      },
    ]);

    const cellMap = {};
    for (const d of deliveries) {
      const key = d.city + '||' + d.courier;
      if (!cellMap[key]) cellMap[key] = { city: d.city, courier: d.courier, total: 0, returned: 0, sumHrs: 0 };
      cellMap[key].total += 1;
      cellMap[key].returned += d.returned;
      cellMap[key].sumHrs += d.durationHrs;
    }
    const cells = Object.values(cellMap).map((c) => ({
      city: c.city,
      courier: c.courier,
      avgHrs: Math.round((c.sumHrs / c.total) * 10) / 10,
      successRate: Math.round(((c.total - c.returned) / c.total) * 1000) / 10,
    }));

    // Best courier per city
    const byCity = {};
    for (const c of cells) {
      if (!byCity[c.city] || c.avgHrs < byCity[c.city].avgHrs) {
        byCity[c.city] = c;
      }
    }
    const bestByCity = Object.values(byCity).map((c) => ({
      city: c.city,
      bestCourier: c.courier,
      avgDeliveryTime: c.avgHrs,
      successRate: c.successRate,
    }));

    // Return-risk customers: >=2 returned orders OR return ratio >= 50%
    const riskAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: '$customer.whatsapp',
          name: { $first: '$customer.fullName' },
          email: { $first: '$customer.email' },
          total: { $sum: 1 },
          returned: { $sum: { $cond: [{ $eq: ['$status', 'Returned'] }, 1, 0] } },
        },
      },
      { $match: { $or: [{ returned: { $gte: 2 } }, { $expr: { $gte: [{ $divide: ['$returned', '$total'] }, 0.5] } }] } },
    ]);
    const returnRisk = riskAgg.map((r) => ({
      whatsapp: r._id,
      name: r.name,
      email: r.email,
      totalOrders: r.total,
      returnedOrders: r.returned,
      risk: r.returned >= 2 ? 'High' : 'Medium',
    }));

    // Delivery-time prediction per city (best courier avg)
    const predictions = bestByCity.map((c) => ({
      city: c.city,
      courier: c.bestCourier,
      estimatedDays: Math.max(1, Math.round((c.avgDeliveryTime / 24) * 10) / 10),
    }));

    const hasData = orders.length > 0;
    res.json({
      hasData,
      month: Number(month),
      year: Number(year),
      donut,
      bestByCity,
      returnRisk,
      predictions,
      note: hasData ? '' : 'Not enough data yet',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
