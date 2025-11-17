const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  short_description: { type: String },
  description: { type: String },
  links: { type: String },
  main_image: { type: String },
  thumbnail_image: { type: String },
  date: { type: Date },
  time: { type: String },
  venue: { type: String },
  countdown: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
