import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  desc:  { type: String, required: true, trim: true },
});

const serviceSchema = new mongoose.Schema(
  {
    slug:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    title:    { type: String, required: true, trim: true },
    badge:    { type: String, trim: true, default: '' },
    solution: { type: String, trim: true, default: '' },
    iconName: { type: String, default: 'Bot' },
    features: [featureSchema],
    order:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.index({ slug: 1 });
serviceSchema.index({ order: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
