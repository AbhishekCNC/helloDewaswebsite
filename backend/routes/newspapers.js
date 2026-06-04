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
  params: async (req, file) => {
    const isPDF = file.mimetype === "application/pdf";
    return {
      folder: "hello-dewas/newspapers",
      resource_type: isPDF ? "raw" : "image",  // ✅ explicit, no "auto"
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      // ✅ no allowed_formats — was conflicting with resource_type
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  },
});

const uploadFiles = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

const multerHandler = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (err) {
      console.error("Multer/Cloudinary upload error:", err);
      const status = err instanceof multer.MulterError ? 400 : 500;
      return res.status(status).json({
        message: err.message,
        error: err.code || err.name,
      });
    }
    next();
  });
};

/* ===========================
   FILE URL HELPER
=========================== */
const fileUrl = (file) => {
  if (!file) return null;
  return file.path || file.secure_url || file.url || file.location || null;
};

/* ===========================
   ROUTES
=========================== */

// ✅ Create newspaper
router.post("/", multerHandler, async (req, res) => {
  try {
    const { title, date } = req.body;

    // ✅ Safe optional chaining — won't crash if multer gave undefined
    const filePath = req.files?.["file"]?.[0]
      ? fileUrl(req.files["file"][0])
      : null;
    const thumbPath = req.files?.["thumbnail"]?.[0]
      ? fileUrl(req.files["thumbnail"][0])
      : null;

    // ✅ Validate required fields before hitting Mongoose
    if (!title || !date || !filePath) {
      return res.status(400).json({
        message: "Title, date, and file are required.",
        debug: { title, date, filePath, thumbPath },
      });
    }

    const newPaper = new Newspaper({
      title,
      date,
      file: filePath,
      thumbnail: thumbPath || "",
    });

    await newPaper.save();
    res.status(201).json(newPaper);
  } catch (error) {
    console.error("Error creating newspaper:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

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
    if (!paper) return res.status(404).json({ message: "Newspaper not found" });
    res.json(paper);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Update newspaper
router.put("/:id", multerHandler, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date } = req.body;
    const updateData = { title, date };

    if (req.files?.["file"]?.[0]) {
      updateData.file = fileUrl(req.files["file"][0]);
    }
    if (req.files?.["thumbnail"]?.[0]) {
      updateData.thumbnail = fileUrl(req.files["thumbnail"][0]);
    }

    const updated = await Newspaper.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,   // ✅ ensures schema validation runs on update too
    });

    if (!updated) return res.status(404).json({ message: "Newspaper not found" });

    res.json(updated);
  } catch (error) {
    console.error("Error updating newspaper:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Delete newspaper
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Newspaper.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Newspaper not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting newspaper:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;