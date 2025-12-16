const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// dynamic folder selection based on route
function getUploadFolder(req) {
  if (req.baseUrl.includes('news')) return 'uploads/news';
  if (req.baseUrl.includes('events')) return 'uploads/events';
  if (req.baseUrl.includes('banners')) return 'uploads/banners';
  if (req.baseUrl.includes('newspapers')) return 'uploads/newspapers';
  return 'uploads/others';
}

// Disk storage (fallback / for non-image files like PDFs)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(process.cwd(), getUploadFolder(req));
    // ensure directory exists
    try {
      fs.mkdirSync(dest, { recursive: true });
    } catch (err) {
      // ignore if exists
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Try to configure Cloudinary storage when env vars are present
let cloudStorage = null;
let cloudinaryConfigured = false;
try {
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    cloudStorage = new CloudinaryStorage({
      cloudinary,
      params: (req, file) => {
        // use folder names without the leading 'uploads/'
        const folder = getUploadFolder(req).replace(/^uploads\/?/, '') || 'others';
        const isImage = file.mimetype && file.mimetype.startsWith('image/');
        return {
          folder,
          resource_type: isImage ? 'image' : 'raw',
          public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        };
      }
    });
    cloudinaryConfigured = true;
  }
} catch (err) {
  // If Cloudinary or storage package isn't installed, silently fall back to disk storage.
  cloudStorage = null;
  cloudinaryConfigured = false;
}

// Create a storage engine that delegates to cloudStorage for images when configured, otherwise uses diskStorage
const storage = {
  _handleFile(req, file, cb) {
    const isImage = file.mimetype && file.mimetype.startsWith('image/');
    if (cloudinaryConfigured && isImage && cloudStorage) {
      // delegate to cloud storage engine
      cloudStorage._handleFile(req, file, function (err, info) {
        if (err) return cb(err);
        // ensure `path` is available (routes expect file.path)
        if (info && !info.path && info.secure_url) info.path = info.secure_url;
        cb(null, info);
      });
    } else {
      diskStorage._handleFile(req, file, cb);
    }
  },
  _removeFile(req, file, cb) {
    const isImage = file.mimetype && file.mimetype.startsWith('image/');
    if (cloudinaryConfigured && isImage && cloudStorage) {
      cloudStorage._removeFile(req, file, cb);
    } else {
      diskStorage._removeFile(req, file, cb);
    }
  }
};

const upload = multer({ storage });

module.exports = upload;
