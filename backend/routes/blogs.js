import express from 'express';
import Blog from '../models/Blog.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// ── GET /api/blogs  — public, only published ──────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, badge, page = 1, limit = 12 } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'All') filter.category = category;
    if (badge)     filter.badge = badge;

    const skip = (Number(page) - 1) * Number(limit);
    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-content -attachments'),   // don't send full content in list
      Blog.countDocuments(filter),
    ]);
    res.json({ success: true, total, blogs });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch blogs.' });
  }
});

// ── GET /api/blogs/all  — admin, all including drafts ─────────────
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).select('-content');
    res.json({ success: true, blogs });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch blogs.' });
  }
});

// ── GET /api/blogs/:slug  — public, single post with full content ─
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found.' });
    // increment views
    blog.views += 1;
    await blog.save({ validateBeforeSave: false });
    res.json({ success: true, blog });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch blog post.' });
  }
});

// ── POST /api/blogs  — admin create ──────────────────────────────
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, blog });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'Slug already exists.' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/blogs/:id  — admin update ───────────────────────────
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/blogs/:id  — admin ───────────────────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Could not delete.' });
  }
});

export default router;
