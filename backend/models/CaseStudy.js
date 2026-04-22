import mongoose from 'mongoose';

const caseStudySchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    client:      { type: String, trim: true, default: '' },
    category:    { type: String, enum: ['Web', 'Mobile', 'AI', 'Automation'], required: true },
    description: { type: String, trim: true, default: '' },
    results:     [{ type: String }],
    tags:        [{ type: String }],
    emoji:       { type: String, default: '🚀' },
    imageUrl:    { type: String, default: '' },
    order:       { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

caseStudySchema.index({ category: 1 });
caseStudySchema.index({ isActive: 1 });

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);
export default CaseStudy;
