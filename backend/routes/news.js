const express = require("express");
const router = express.Router();
const News = require("../models/News");
const multer = require("multer");
const path = require("path");

// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ GET all news
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ published_at: -1 });
    // Normalize image paths to absolute URLs so frontends can display them reliably
    const hostPrefix = req.protocol + "://" + req.get("host");
    const normalized = news.map((n) => {
      const obj = n.toObject();
      if (obj.main_image) {
        const p = obj.main_image.replace(/\\\\/g, "/");
        obj.main_image = p.startsWith("http") ? p : hostPrefix + (p.startsWith("/") ? "" : "/") + p;
      }
      if (obj.thumbnail) {
        const p = obj.thumbnail.replace(/\\\\/g, "/");
        obj.thumbnail = p.startsWith("http") ? p : hostPrefix + (p.startsWith("/") ? "" : "/") + p;
      }
      return obj;
    });
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get latest news for homepage slider
router.get("/latest", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3; // default 3
    const latestNews = await News.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    const hostPrefix = req.protocol + "://" + req.get("host");
    const normalized = latestNews.map((n) => {
      const obj = n.toObject();
      if (obj.main_image) {
        const p = obj.main_image.replace(/\\\\/g, "/");
        obj.main_image = p.startsWith("http") ? p : hostPrefix + (p.startsWith("/") ? "" : "/") + p;
      }
      if (obj.thumbnail) {
        const p = obj.thumbnail.replace(/\\\\/g, "/");
        obj.thumbnail = p.startsWith("http") ? p : hostPrefix + (p.startsWith("/") ? "" : "/") + p;
      }
      return obj;
    });
    res.json(normalized);
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
    const obj = news.toObject();
    const hostPrefix = req.protocol + "://" + req.get("host");
    if (obj.main_image) {
      const p = obj.main_image.replace(/\\\\/g, "/");
      obj.main_image = p.startsWith("http") ? p : hostPrefix + (p.startsWith("/") ? "" : "/") + p;
    }
    if (obj.thumbnail) {
      const p = obj.thumbnail.replace(/\\\\/g, "/");
      obj.thumbnail = p.startsWith("http") ? p : hostPrefix + (p.startsWith("/") ? "" : "/") + p;
    }
    res.json(obj);
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


// ✅ POST new news
router.post("/", upload.fields([
  { name: "main_image", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), async (req, res) => {
  try {
    const newsData = {
      title: req.body.title,
      short_description: req.body.short_description,
      description: req.body.description,
      links: req.body.links,
      categories: req.body.categories,
      main_image: req.files?.main_image ? `/uploads/${req.files.main_image[0].filename}` : null,
      thumbnail: req.files?.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : null,
    };

    const news = new News(newsData);
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ UPDATE news
router.put("/:id", upload.fields([
  { name: "main_image", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      short_description: req.body.short_description,
      description: req.body.description,
      links: req.body.links,
      categories: req.body.categories,
    };

    if (req.files?.main_image) {
      updateData.main_image = `/uploads/${req.files.main_image[0].filename}`;
    }
    if (req.files?.thumbnail) {
      updateData.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    }

    const news = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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