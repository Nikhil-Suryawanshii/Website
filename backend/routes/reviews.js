import express from 'express';
import Review from '../models/Review.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const AVATAR_COLORS = ['indigo', 'cyan', 'purple', 'emerald', 'pink', 'orange'];

// ── POST /api/reviews  — PUBLIC: client submits review ───────────
router.post('/', async (req, res) => {
  try {
    const { name, role, email, rating, review, serviceUsed } = req.body;

    if (!name || !rating || !review) {
      return res.status(400).json({ success: false, message: 'Name, rating and review are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be 1–5.' });
    }

    // Auto assign avatar color
    const colorIndex = name.charCodeAt(0) % AVATAR_COLORS.length;

    const newReview = await Review.create({
      name: name.trim(),
      role: role?.trim() || '',
      email: email?.trim() || '',
      rating: Number(rating),
      review: review.trim(),
      serviceUsed: serviceUsed?.trim() || '',
      avatarColor: AVATAR_COLORS[colorIndex],
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted and is pending approval.',
      id: newReview._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/reviews  — PUBLIC: only approved reviews ────────────
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .sort({ featured: -1, createdAt: -1 })
      .select('-email -adminNote');
    res.json({ success: true, count: reviews.length, reviews });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch reviews.' });
  }
});

// ── GET /api/reviews/all  — ADMIN: all reviews ───────────────────
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch reviews.' });
  }
});

// ── PUT /api/reviews/:id  — ADMIN: approve/reject/feature ────────
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, featured, adminNote } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        ...(status !== undefined    && { status }),
        ...(featured !== undefined  && { featured }),
        ...(adminNote !== undefined && { adminNote }),
      },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, review });
  } catch {
    res.status(500).json({ success: false, message: 'Could not update review.' });
  }
});

// ── DELETE /api/reviews/:id  — ADMIN ─────────────────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Could not delete.' });
  }
});

export default router;
