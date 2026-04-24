import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  name:     { type: String },
  url:      { type: String },
  type:     { type: String }, // image | video | pdf | other
  publicId: { type: String }, // cloudinary public_id
});

const blogSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      enum: [
        'E-commerce Growth Automation',
        'Marketing Automation',
        'Sales Pipeline Automation',
        'Customer Support Automation',
        'HR Automation',
        'Business Operations Automation',
        'Finance Automation',
        'Other',
      ],
      default: 'Other',
    },
    badge:       { type: String, default: 'Article' }, // Article | Tutorial | Project | Case Study
    excerpt:     { type: String, trim: true, default: '' },  // short description shown on card
    content:     { type: String, default: '' },              // full markdown/html content
    thumbnail:   { type: String, default: '' },              // cloudinary image URL
    thumbnailId: { type: String, default: '' },              // cloudinary public_id
    attachments: [attachmentSchema],                         // images, videos, PDFs
    tags:        [{ type: String }],
    readTime:    { type: Number, default: 2 },               // minutes
    author:      { type: String, default: 'AgenticOS Team' },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    views:       { type: Number, default: 0 },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title
blogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 80);
  }
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ isPublished: 1 });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
