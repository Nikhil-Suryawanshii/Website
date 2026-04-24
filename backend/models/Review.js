import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    role:        { type: String, trim: true, default: '' },   // "CEO, FashionMart India"
    email:       { type: String, lowercase: true, trim: true, default: '' }, // private, never shown
    rating:      { type: Number, min: 1, max: 5, required: true },
    review:      { type: String, required: true, trim: true, maxlength: 600 },
    serviceUsed: { type: String, default: '' },
    avatarColor: { type: String, default: 'indigo' }, // auto-assigned
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    featured:    { type: Boolean, default: false },
    adminNote:   { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ status: 1 });
reviewSchema.index({ featured: 1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
