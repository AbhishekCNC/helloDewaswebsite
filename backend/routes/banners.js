const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Upload a banner image
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { categories, display } = req.body;
    const imagePath = req.file ? req.file.path : '';

    const banner = new Banner({
      image: imagePath,
      categories,
      display: display === 'true' || display === true
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    console.error('Error uploading banner:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
