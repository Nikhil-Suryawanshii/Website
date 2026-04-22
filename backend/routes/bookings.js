import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// POST /api/bookings  — public, captures lead before Calendly
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('sessionType').isIn(['discovery', 'founder-deep-dive']).withMessage('Invalid session type'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      const { name, email, phone, company, message, sessionType, calendlyUrl } = req.body;
      const booking = await Booking.create({
        name, email,
        phone:       phone || '',
        company:     company || '',
        message:     message || '',
        sessionType,
        calendlyUrl: calendlyUrl || '',
        ipAddress:   req.ip || '',
        userAgent:   req.headers['user-agent'] || '',
      });
      res.status(201).json({
        success: true,
        message: 'Lead captured.',
        booking: { id: booking._id, sessionType: booking.sessionType, calendlyUrl: booking.calendlyUrl },
      });
    } catch (err) {
      console.error('Booking error:', err);
      res.status(500).json({ success: false, message: 'Could not save booking.' });
    }
  }
);

// GET /api/bookings — admin only
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, sessionType, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status)      filter.status = status;
    if (sessionType) filter.sessionType = sessionType;
    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Booking.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)), bookings });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch bookings.' });
  }
});

// GET /api/bookings/stats — admin only
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [total, byStatus, byType, last7Days] = await Promise.all([
      Booking.countDocuments(),
      Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Booking.aggregate([{ $group: { _id: '$sessionType', count: { $sum: 1 } } }]),
      Booking.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ]);
    res.json({ success: true, stats: { total, byStatus, byType, last7Days } });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch stats.' });
  }
});

// GET /api/bookings/:id — admin
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, booking });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch booking.' });
  }
});

// PUT /api/bookings/:id — admin update status/notes
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, booking });
  } catch {
    res.status(500).json({ success: false, message: 'Could not update booking.' });
  }
});

// DELETE /api/bookings/:id — admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, message: 'Booking deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Could not delete booking.' });
  }
});

export default router;
