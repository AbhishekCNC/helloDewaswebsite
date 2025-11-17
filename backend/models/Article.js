const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String },
  content: { type: String },
  author: { type: String },
  category: { type: String },
  tags: [String],
  imageURL: { type: String },
  status: { type: String, enum: ['draft','published'], default: 'published' },
  views: { type: Number, default: 0 },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

articleSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Article', articleSchema);
