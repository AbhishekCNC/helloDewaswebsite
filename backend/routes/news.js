const express = require("express");
const router = express.Router();
const News = require("../models/News");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/* ===========================
   MULTER → CLOUDINARY SETUP
=========================== */

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hello-dewas/news",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

/* ===========================
   GET ALL NEWS
=========================== */
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ published_at: -1 });
    res.json(news); // Cloudinary URLs already absolute
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   GET LATEST NEWS
=========================== */
router.get("/latest", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const latestNews = await News.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(latestNews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   GET SINGLE NEWS
=========================== */
router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   VIEW COUNT
=========================== */
router.put("/:id/view", async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { view_count: 1 } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update view count" });
  }
});

/* ===========================
   CREATE NEWS (🔥 CLOUDINARY)
=========================== */
router.post(
  "/",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
// debug: inspect uploaded files when DEBUG_UPLOADS=true
    if (process.env.DEBUG_UPLOADS === 'true') {
      console.log('[news] uploaded files:', JSON.stringify(req.files || {}));
    }

      const fileUrl = (file) => {
        if (!file) return null;
        // prefer path, then secure_url/url, then location or filename
        return file.path || file.secure_url || file.url || file.location || file.filename || null;
      };

      const newsData = {
        title: req.body.title,
        short_description: req.body.short_description,
        description: req.body.description,
        links: req.body.links,
        categories: req.body.categories,
        main_image: fileUrl(req.files?.main_image?.[0]) || null,
        thumbnail: fileUrl(req.files?.thumbnail?.[0]) || null,
      };

      const news = new News(newsData);
      await news.save();
      res.status(201).json(news);
    } catch (error) {
      console.error('Error creating news:', error);
      res.status(400).json({ message: error.message });
    }
  }
);

/* ===========================
   UPDATE NEWS (🔥 CLOUDINARY)
=========================== */
router.put(
  "/:id",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
        short_description: req.body.short_description,
        description: req.body.description,
        links: req.body.links,
        categories: req.body.categories,
      };

      const fileUrl = (file) => {
        if (!file) return null;
        return file.path || file.secure_url || file.url || file.location || file.filename || null;
      };

      if (req.files?.main_image && req.files.main_image[0]) {
        updateData.main_image = fileUrl(req.files.main_image[0]);
      }
      if (req.files?.thumbnail && req.files.thumbnail[0]) {
        updateData.thumbnail = fileUrl(req.files.thumbnail[0]);
      }

      const news = await News.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!news) return res.status(404).json({ message: "News not found" });
      res.json(news);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

/* ===========================
   DELETE NEWS
=========================== */
router.delete("/:id", async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
