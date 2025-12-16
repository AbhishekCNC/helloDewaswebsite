const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Newspaper = require("../models/Newspaper");

// ✅ Setup Storage (for PDF/Image uploads)
const fs = require("fs");

// Ensure upload directory exists. The project uses 'uploads/newspaper' (singular).
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "newspaper");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// helper to extract file url (handles cloudinary or disk)
function fileUrl(file, uploadFolderName) {
  if (!file) return "";
  if (file.path || file.secure_url || file.url || file.location) {
    return file.path || file.secure_url || file.url || file.location;
  }
  // fallback to relative uploads path using filename
  return `/uploads/${uploadFolderName}/${file.filename}`;
}

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
      // Store DB paths as web-accessible relative paths under /uploads when needed
      const filePath = req.files["file"]
        ? fileUrl(req.files["file"][0], "newspaper")
        : "";
      const thumbPath = req.files["thumbnail"]
        ? fileUrl(req.files["thumbnail"][0], "newspaper")
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
    // Normalize stored paths so frontend can reliably build URLs
    const normalized = papers.map((p) => {
      const obj = p.toObject();
      // Normalize file
      if (obj.file) {
        const f = obj.file.replace(/\\\\/g, "/");
        if (!f.startsWith("/uploads/")) {
          // try to extract filename and map to uploads/newspaper
          const name = path.basename(f);
          obj.file = "/uploads/newspaper/" + name;
        } else {
          obj.file = f;
        }
      }
      if (obj.thumbnail) {
        const t = obj.thumbnail.replace(/\\\\/g, "/");
        if (!t.startsWith("/uploads/")) {
          const name = path.basename(t);
          obj.thumbnail = "/uploads/newspaper/" + name;
        } else {
          obj.thumbnail = t;
        }
      }
      return obj;
    });
    res.json(normalized);
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
    // Normalize paths
    const obj = paper.toObject();
    if (obj.file) {
      const f = obj.file.replace(/\\\\/g, "/");
      obj.file = f.startsWith("/uploads/") ? f : "/uploads/newspaper/" + path.basename(f);
    }
    if (obj.thumbnail) {
      const t = obj.thumbnail.replace(/\\\\/g, "/");
      obj.thumbnail = t.startsWith("/uploads/") ? t : "/uploads/newspaper/" + path.basename(t);
    }
    res.json(obj);
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
        updateData.file = fileUrl(req.files["file"][0], "newspaper");
      }
      if (req.files["thumbnail"]) {
        updateData.thumbnail = fileUrl(req.files["thumbnail"][0], "newspaper");
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
