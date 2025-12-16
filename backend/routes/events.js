const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Event = require("../models/Event");

// ---------- Multer setup ----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/events");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ---------- Helpers ----------
function normalizePath(p) {
  return p ? p.replace(/\\/g, "/") : "";
}

function fileUrl(file) {
  if (!file) return undefined;
  return file.path || file.secure_url || file.url || file.location || (file.filename ? "/uploads/events/" + file.filename : undefined);
}

// ---------- CREATE EVENT ----------
router.post(
  "/",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "thumbnail_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        short_description,
        description,
        date,
        time,
        venue,
        location,
        link,
        countdown,
      } = req.body;

      const mainImageFile =
        req.files?.main_image && req.files.main_image[0]
          ? normalizePath(fileUrl(req.files.main_image[0]))
          : undefined;

      const thumbFile =
        req.files?.thumbnail_image && req.files.thumbnail_image[0]
          ? normalizePath(fileUrl(req.files.thumbnail_image[0]))
          : undefined;

      const event = await Event.create({
        title,
        short_description,
        description,
        main_image: mainImageFile,
        thumbnail_image: thumbFile,
        date,
        time,
        venue,
        location,
        link,
        countdown: countdown ?? 0,
      });

      res.status(201).json(event);
    } catch (err) {
      console.error("Error creating event:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// ---------- UPDATE EVENT ----------
router.put(
  "/:id",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "thumbnail_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        short_description,
        description,
        date,
        time,
        venue,
        location,
        link,
        countdown,
      } = req.body;

      const update = {
        title,
        short_description,
        description,
        date,
        time,
        venue,
        location,
        link,
        countdown,
      };

      // only overwrite images if new files are uploaded
      if (req.files?.main_image && req.files.main_image[0]) {
        update.main_image = normalizePath(fileUrl(req.files.main_image[0]));
      }
      if (req.files?.thumbnail_image && req.files.thumbnail_image[0]) {
        update.thumbnail_image = normalizePath(
          fileUrl(req.files.thumbnail_image[0])
        );
      }

      const event = await Event.findByIdAndUpdate(req.params.id, update, {
        new: true,
      });

      res.json(event);
    } catch (err) {
      console.error("Error updating event:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// ---------- GET ALL / GET ONE / DELETE (unchanged) ----------
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1, createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- GET LATEST EVENTS ----------
router.get("/latest", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 2; // default 2 for hero slider
    const latestEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(latestEvents);
  } catch (err) {
    console.error("Error fetching latest events:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    res.json(ev);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
