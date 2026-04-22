import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone:   { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    message: { type: String, trim: true, default: '', maxlength: [1000, 'Message too long'] },
    sessionType: {
      type: String,
      enum: ['discovery', 'founder-deep-dive'],
      required: true,
    },
    calendlyUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'booked', 'completed', 'cancelled'],
      default: 'new',
    },
    notes:     { type: String, default: '' },
    source:    { type: String, default: 'website' },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

bookingSchema.index({ email: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
