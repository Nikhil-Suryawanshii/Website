import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    headline:    { type: String, default: 'Built by Engineers,' },
    headlineSub: { type: String, default: 'For Ambitious Businesses' },
    tagline:     { type: String, default: "We're a lean, focused team of engineers and AI specialists." },
    story: {
      title:      { type: String, default: 'Why We Started AgenticOS' },
      paragraphs: [{ type: String }],
    },
    values: [
      {
        icon:  { type: String, default: 'Shield' },
        title: { type: String },
        desc:  { type: String },
      },
    ],
    stats: [
      {
        value: { type: String },
        label: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const About = mongoose.model('About', aboutSchema);
export default About;
