const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    desktop_image: { type: String, required: true }, // for desktop
    mobile_image: { type: String, required: true },  // for mobile
    categories: { type: String },
    display: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
