const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    short_description: String,
    description: String,
    links: String,
    categories: String,
    main_image: String,
    thumbnail: String,
    view_count: { type: Number, default: 0 },
    published_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
