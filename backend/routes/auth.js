import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true, token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, company: user.company },
  });
};

// POST /api/auth/register
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Min 8 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      const { name, email, password, company, phone } = req.body;
      if (await User.findOne({ email })) {
        return res.status(409).json({ success: false, message: 'Email already registered.' });
      }
      const user = await User.create({ name, email, password, company, phone });
      sendToken(user, 201, res);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Registration failed.' });
    }
  }
);

// POST /api/auth/login
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
      }
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Account disabled. Contact support.' });
      }
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
      sendToken(user, 200, res);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Login failed.' });
    }
  }
);

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, company, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, company, phone }, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: 'Profile update failed.' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 8 }).withMessage('Min 8 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select('+password');
      if (!(await user.comparePassword(currentPassword))) {
        return res.status(401).json({ success: false, message: 'Current password incorrect.' });
      }
      user.password = newPassword;
      await user.save();
      res.json({ success: true, message: 'Password updated.' });
    } catch {
      res.status(500).json({ success: false, message: 'Password change failed.' });
    }
  }
);

// GET /api/auth/users (Admin)
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch {
    res.status(500).json({ success: false, message: 'Could not fetch users.' });
  }
});

export default router;
