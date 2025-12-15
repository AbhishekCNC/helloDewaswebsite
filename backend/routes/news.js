const express = require("express");
const router = express.Router();
const News = require("../models/News");
const upload = require("../middleware/upload"); // ✅ Cloudinary upload

// ✅ GET all news
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ published_at: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET latest news
router.get("/latest", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const latestNews = await News.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(latestNews);
  } catch (error) {
    console.error("Error fetching latest news:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET single news
router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 👁 Increment view count
router.put("/:id/view", async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { view_count: 1 } },
      { new: true }
    );
    res.json(updatedNews);
  } catch (err) {
    console.error("Error updating view count:", err);
    res.status(500).json({ message: "Failed to update view count" });
  }
});

// ✅ POST news (Cloudinary images)
router.post(
  "/",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const news = new News({
        title: req.body.title,
        short_description: req.body.short_description,
        description: req.body.description,
        links: req.body.links,
        categories: req.body.categories,
        main_image: req.files?.main_image
          ? req.files.main_image[0].path
          : null,
        thumbnail: req.files?.thumbnail
          ? req.files.thumbnail[0].path
          : null,
      });

      await news.save();
      res.status(201).json(news);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// ✅ UPDATE news
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

      if (req.files?.main_image) {
        updateData.main_image = req.files.main_image[0].path;
      }
      if (req.files?.thumbnail) {
        updateData.thumbnail = req.files.thumbnail[0].path;
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

// ✅ DELETE news
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
