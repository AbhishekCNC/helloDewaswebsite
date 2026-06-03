const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Newspaper = require("../models/Newspaper");

/* ===========================
   MULTER → CLOUDINARY SETUP
=========================== */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hello-dewas/newspapers",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

/* ===========================
   FILE URL HELPER
=========================== */
const fileUrl = (file) => {
  if (!file) return null;
  return file.path || file.secure_url || file.url || file.location || null;
};

// ✅ Create newspaper
router.post(
  "/",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, date } = req.body;
      const filePath = req.files["file"] ? fileUrl(req.files["file"][0]) : null;
      const thumbPath = req.files["thumbnail"]
        ? fileUrl(req.files["thumbnail"][0])
        : null;

      const newPaper = new Newspaper({
        title,
        date,
        file: filePath,
        thumbnail: thumbPath,
      });

      await newPaper.save();
      res.status(201).json(newPaper);
    } catch (error) {
      console.error("Error creating newspaper:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// ✅ Get all newspapers
router.get("/", async (req, res) => {
  try {
    const papers = await Newspaper.find().sort({ date: -1 });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get newspaper by ID
router.get("/:id", async (req, res) => {
  try {
    const paper = await Newspaper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Newspaper not found" });
    }
    res.json(paper);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Update newspaper
router.put(
  "/:id",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, date } = req.body;
      const updateData = { title, date };

      if (req.files["file"]) {
        updateData.file = fileUrl(req.files["file"][0]);
      }
      if (req.files["thumbnail"]) {
        updateData.thumbnail = fileUrl(req.files["thumbnail"][0]);
      }

      const updated = await Newspaper.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      res.json(updated);
    } catch (error) {
      console.error("Error updating newspaper:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// ✅ Delete newspaper
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Newspaper.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting newspaper:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
