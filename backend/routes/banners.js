const express = require("express");
const router = express.Router();
const Banner = require("../models/Banner");
const upload = require("../middleware/upload");

// ✅ CREATE / UPLOAD banner with TWO images
router.post(
  "/",
  upload.fields([
    { name: "desktop_image", maxCount: 1 },
    { name: "mobile_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("[banners] POST /api/banners - req.body:", req.body);
      console.log("[banners] POST /api/banners - req.files:", req.files);

      const { categories, display } = req.body;

      if (
        !req.files ||
        !req.files.desktop_image ||
        !req.files.mobile_image
      ) {
        return res
          .status(400)
          .json({ message: "Both desktop_image and mobile_image are required" });
      }

      // helper to extract URL/path from uploaded file
      const fileUrl = (file) => {
        if (!file) return null;
        return file.path || file.secure_url || file.url || file.location || (file.filename ? "/uploads/banners/" + file.filename : null);
      };

      let desktopPath = fileUrl(req.files.desktop_image[0]);
      let mobilePath = fileUrl(req.files.mobile_image[0]);

      // normalize windows backslashes (if any) and ensure leading slash for local paths
      const normalizeAndSlash = (p) => {
        if (!p) return p;
        if (/^https?:\/\//i.test(p)) return p; // remote
        const cleaned = p.replace(/\\/g, "/");
        return cleaned.startsWith("/") ? cleaned : "/" + cleaned;
      };

      desktopPath = normalizeAndSlash(desktopPath);
      mobilePath = normalizeAndSlash(mobilePath);

      const banner = new Banner({
        desktop_image: desktopPath,
        mobile_image: mobilePath,
        categories,
        display: display === "true" || display === true,
      });

      await banner.save();
      res.status(201).json(banner);
    } catch (err) {
      console.error("Error uploading banner:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// ✅ GET all banners
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ DELETE banner
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Banner.findByIdAndDelete(id);
    res.json({ message: "Banner deleted" });
  } catch (err) {
    console.error("Error deleting banner:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
