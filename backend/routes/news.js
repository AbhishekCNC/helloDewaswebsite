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
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
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