const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, unique: true, maxlength: 120 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Newsletter', newsletterSchema);
