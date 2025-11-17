const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Create new event with image upload
router.post('/', auth, upload.fields([
  { name: 'main_image', maxCount: 1 },
  { name: 'thumbnail_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, short_description, description, date, time, venue } = req.body;

    const files = req.files || {};
    const mainImage = files.main_image && files.main_image[0] ? files.main_image[0].path : '';
    const thumbImage = files.thumbnail_image && files.thumbnail_image[0] ? files.thumbnail_image[0].path : '';

    const event = new Event({
      title,
      short_description,
      description,
      date,
      time,
      venue,
      main_image: mainImage,
      thumbnail_image: thumbImage,
      author: req.user.name
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
