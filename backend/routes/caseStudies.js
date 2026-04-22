import express from 'express';
import CaseStudy from '../models/CaseStudy.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/case-studies  — public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'All') filter.category = category;
    const caseStudies = await CaseStudy.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: caseStudies.length, caseStudies });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch case studies.' });
  }
});

// POST /api/case-studies  — admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const cs = await CaseStudy.create(req.body);
    res.status(201).json({ success: true, caseStudy: cs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/case-studies/:id  — admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const cs = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cs) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, caseStudy: cs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/case-studies/:id  — admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const cs = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!cs) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Could not delete.' });
  }
});

export default router;
