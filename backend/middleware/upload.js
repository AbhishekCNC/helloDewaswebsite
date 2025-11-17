const multer = require('multer');
const path = require('path');

// dynamic folder selection based on route
function getUploadFolder(req) {
  if (req.baseUrl.includes('news')) return 'uploads/news';
  if (req.baseUrl.includes('events')) return 'uploads/events';
  if (req.baseUrl.includes('banners')) return 'uploads/banners';
  if (req.baseUrl.includes('newspapers')) return 'uploads/newspapers';
  return 'uploads/others';
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadFolder(req));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;
