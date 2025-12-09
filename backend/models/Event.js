const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    short_description: { type: String },

    description: { type: String },

    // main big banner image (640x480 etc.)
    main_image: { type: String },

    // small thumb (120x90 etc.)
    thumbnail_image: { type: String },

    // event schedule
    date: { type: Date },     // e.g. "2025-12-25T00:00:00.000Z"
    time: { type: String },   // "10:00 AM"
    venue: { type: String },  // "DEWAS"

    // extra info
    location: { type: String }, // e.g. "Gokul dham garden"
    link: { type: String },     // external link if any

    // for future countdown timers if you want
    countdown: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
