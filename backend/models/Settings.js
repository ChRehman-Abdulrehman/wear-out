const mongoose = require('mongoose');

// Simple key/value store for admin-controlled site settings
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, maxlength: 60 },
    value: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

settingsSchema.statics.get = async function (key, fallback = null) {
  const doc = await this.findOne({ key }).lean();
  return doc ? doc.value : fallback;
};

settingsSchema.statics.set = async function (key, value) {
  await this.findOneAndUpdate({ key }, { $set: { value } }, { upsert: true, new: true });
  return value;
};

module.exports = mongoose.model('Settings', settingsSchema);
