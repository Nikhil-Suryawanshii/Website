import express from 'express';
import { body, validationResult } from 'express-validator';
import Service from '../models/Service.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/services — public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 }).select('-__v');
    res.json({ success: true, count: services.length, services });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch services.' });
  }
});

// GET /api/services/:slug — public
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, service });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch service.' });
  }
});

// POST /api/services — admin
router.post('/', protect, authorize('admin'),
  [body('slug').trim().notEmpty(), body('title').trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      const service = await Service.create(req.body);
      res.status(201).json({ success: true, service });
    } catch (err) {
      if (err.code === 11000) return res.status(409).json({ success: false, message: 'Slug already exists.' });
      res.status(500).json({ success: false, message: 'Could not create service.' });
    }
  }
);

// PUT /api/services/:slug — admin
router.put('/:slug', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, service });
  } catch {
    res.status(500).json({ success: false, message: 'Could not update service.' });
  }
});

// DELETE /api/services/:slug — admin (soft delete)
router.delete('/:slug', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate({ slug: req.params.slug }, { isActive: false }, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, message: `Service '${service.title}' deactivated.` });
  } catch {
    res.status(500).json({ success: false, message: 'Could not delete service.' });
  }
});

export default router;
