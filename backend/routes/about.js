import express from 'express';
import About from '../models/About.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/about  — public
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) return res.json({ success: true, about: null });
    res.json({ success: true, about });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch about content.' });
  }
});

// PUT /api/about  — admin (upsert)
router.put('/', protect, authorize('admin'), async (req, res) => {
  try {
    let about = await About.findOne();
    if (about) {
      about = await About.findByIdAndUpdate(about._id, req.body, { new: true, runValidators: true });
    } else {
      about = await About.create(req.body);
    }
    res.json({ success: true, about });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;