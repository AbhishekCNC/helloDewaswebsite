const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Newspaper = require("../models/Newspaper");

// ✅ Setup Storage (for PDF/Image uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/newspapers/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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
      const filePath = req.files["file"]
        ? req.files["file"][0].path.replace(/\\/g, "/")
        : "";
      const thumbPath = req.files["thumbnail"]
        ? req.files["thumbnail"][0].path.replace(/\\/g, "/")
        : "";

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
        updateData.file = req.files["file"][0].path.replace(/\\/g, "/");
      }
      if (req.files["thumbnail"]) {
        updateData.thumbnail = req.files["thumbnail"][0].path.replace(/\\/g, "/");
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
