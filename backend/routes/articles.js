const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');

// Helper function to create URL-friendly slugs
function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+|-+$/g, '');    // Trim - from start/end
}

// Create article (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, summary, content, author, category, tags, imageURL } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content required' });
    }

    let slug = slugify(title);
    const exists = await Article.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now().toString().slice(-5)}`;

    const article = new Article({
      title,
      slug,
      summary,
      content,
      author: author || req.user.name,
      category,
      tags,
      imageURL,
      status: 'published',
      publishedAt: Date.now()
    });

    await article.save();
    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all published articles (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content');

    const total = await Article.countDocuments({ status: 'published' });

    res.json({ total, page, articles });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single article by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    article.views = (article.views || 0) + 1;
    await article.save();

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete article (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
