import 'dotenv/config';
import mongoose from 'mongoose';
import Service    from '../models/Service.js';
import User       from '../models/User.js';
import CaseStudy  from '../models/CaseStudy.js';
import About      from '../models/About.js';

const servicesData = [
  { slug: 'd2c', title: 'D2C Brand Solutions', badge: 'AI Agentic Automation', iconName: 'ShoppingCart', order: 1,
    solution: 'Deploy intelligent AI agents that autonomously handle complex business operations with unprecedented precision and efficiency.',
    features: [
      { title: 'Amazon PDP Agent', desc: 'Optimize product listings automatically.' },
      { title: 'Competitor Tracker Agent', desc: 'Real-time market intelligence.' },
      { title: 'Social Media Automation Agent', desc: 'Multi-platform content management.' },
      { title: 'Website Performance Reporting Agent', desc: 'Analytics & insights.' },
      { title: 'CRM Structuring & Outbound Tracking Agent', desc: 'Customer journey optimization.' },
      { title: 'Bookkeeping Agent', desc: 'Automated financial management.' },
      { title: 'Sales Automation Agent', desc: 'Pipeline optimization.' },
      { title: 'HR Recruitment Agent', desc: 'Talent acquisition automation.' },
      { title: 'WhatsApp Interaction Agent', desc: 'Customer engagement.' },
      { title: 'Inventory Brain', desc: 'Predicts stockouts & auto-drafts purchase orders.' },
      { title: 'Dynamic Pricing Engine', desc: 'Adjusts prices autonomously based on competitor data.' },
      { title: 'Real-Time Personalization', desc: 'Vector-memory driven product surfacing.' },
      { title: 'Contextual Cart Recovery', desc: 'Multi-channel sequences triggered within minutes.' },
    ],
  },
  { slug: 'realestate', title: 'Real Estate Solutions', badge: 'AI Agentic Automation', iconName: 'Building2', order: 2,
    solution: 'Deploy intelligent AI agents that autonomously handle complex business operations with unprecedented precision and efficiency.',
    features: [
      { title: 'AI Voice Calling Agent', desc: 'Automated lead qualification.' },
      { title: 'WhatsApp Chatbot Agent', desc: '24/7 property inquiries.' },
      { title: 'Social Media Automation Agent', desc: 'Property marketing.' },
      { title: 'CRM Automation Agent', desc: 'Lead management.' },
      { title: 'Email Automation Agent', desc: 'Follow-up campaigns.' },
      { title: 'GPT-powered CEO Assistant', desc: 'Voice-to-action workflows.' },
    ],
  },
  { slug: 'leadgen', title: 'Advanced Sales & Lead Gen', badge: 'Sales Automation', iconName: 'Bot', order: 3,
    solution: 'A 4-pillar autonomous department that captures, scores, and closes leads in a millisecond-loop.',
    features: [
      { title: 'Lead Capture Agent', desc: 'Omnichannel net triggering on Website, IG, and LinkedIn.' },
      { title: 'Conversation Agent', desc: 'Natural two-way dialogue to uncover budget & timeline.' },
      { title: 'Sentiment & Scoring Agent', desc: 'Assigns 1-10 scores by reading between the lines.' },
      { title: 'Meeting Booking Agent', desc: 'Offers live calendar slots to "Hot" scored leads.' },
      { title: 'Response Tracker (Kill-Switch)', desc: 'Instantly pauses sequences when leads reply.' },
      { title: 'Behavior-Aware Follow-Up', desc: 'Dynamically injects context into outbound replies.' },
    ],
  },
  { slug: 'content', title: 'Content Production Factory', badge: 'Content Automation', iconName: 'PenTool', order: 4,
    solution: 'A complete multi-agent factory replacing traditional content teams, operating seamlessly 24/7.',
    features: [
      { title: 'Research & Strategy Agent', desc: 'Scrapes search trends & competitors for daily content briefs.' },
      { title: 'Brand-Voice Writing Agent', desc: 'Trained on your exact tone to write blogs and social threads.' },
      { title: 'Visual Creation Agent', desc: 'Connects to Midjourney/Canva APIs for perfectly branded graphics.' },
      { title: 'Scheduling & Publishing Agent', desc: 'Analyzes historical engagement for optimal posting times.' },
      { title: 'Content Repurposing Agent', desc: 'Turns one high-performing blog into 8 social assets automatically.' },
    ],
  },
  { slug: 'master', title: 'Master Agent Services', badge: 'Executive Level AI', iconName: 'Users', order: 5,
    solution: 'Scale your C-Suite digitally. Deploy master-level AI agents to oversee entire departments autonomously.',
    features: [
      { title: 'Marketing', desc: 'AI Chief of Socials, AI Chief of Advertisement, AI Chief of Content.' },
      { title: 'Customer Service', desc: 'AI Chief of Customer Experiences.' },
      { title: 'Sales & Admin', desc: 'AI Chief of Sales Operations, AI Chief of Administration Operations.' },
      { title: 'Operations', desc: 'AI Chief of Finance, AI Chief of HR.' },
      { title: 'Product', desc: 'AI Chief of Engineering, AI Chief of Design, AI Chief of Management.' },
    ],
  },
  { slug: 'consultancy', title: 'AI Strategic Consultancy', badge: 'Strategy & Integration', iconName: 'Lightbulb', order: 6,
    solution: 'Transform your business vision into reality with expert AI strategy, implementation guidance, and continuous optimization.',
    features: [
      { title: 'AI Strategy Development', desc: 'Comprehensive roadmaps tailored to your business objectives.' },
      { title: 'Change Management', desc: 'Seamless integration of AI solutions with organizational culture.' },
      { title: 'ROI Optimization', desc: 'Data-driven insights to maximize returns on AI investments.' },
      { title: 'Risk Assessment', desc: 'Comprehensive evaluation of AI implementation risks.' },
      { title: 'Custom AI Solutions', desc: 'Bespoke AI architectures designed for your unique challenges.' },
      { title: 'Innovation Workshops', desc: 'Collaborative sessions to identify AI opportunities.' },
      { title: 'Enterprise NemoClaw Deployment', desc: 'Hardware-agnostic agent workforce rollouts.' },
      { title: 'Managed Agents Infrastructure', desc: 'Serverless agent loops with persistent memory mapping.' },
    ],
  },
];

const caseStudiesData = [
  { title: 'AI-Powered Inventory System', client: 'D2C Fashion Brand', category: 'AI', emoji: '👗',
    description: 'Built an autonomous inventory brain that predicts stockouts 2 weeks in advance and auto-drafts purchase orders, reducing out-of-stock events by 87%.',
    results: ['87% fewer stockouts', '40% lower holding cost', '3x faster reorder'], tags: ['AI Agent', 'Inventory', 'D2C'], order: 1 },
  { title: 'WhatsApp Lead Qualification Bot', client: 'Real Estate Developer', category: 'Automation', emoji: '🏠',
    description: 'Deployed a WhatsApp AI agent that qualifies 500+ daily property inquiries, books site visits, and syncs everything to CRM — without any human involvement.',
    results: ['500+ leads/day handled', '62% booking rate', '0 human hours'], tags: ['WhatsApp', 'Real Estate', 'CRM'], order: 2 },
  { title: 'Social Content Factory', client: 'E-commerce Brand', category: 'AI', emoji: '📱',
    description: 'Replaced 3 content creators with a multi-agent pipeline: research → write → design → schedule across Instagram, LinkedIn, and Twitter.',
    results: ['5x content output', '70% cost reduction', '3.2x engagement'], tags: ['Content AI', 'Social Media', 'Automation'], order: 3 },
  { title: 'Lead Scoring & Outbound Engine', client: 'B2B SaaS Company', category: 'Automation', emoji: '🎯',
    description: 'Built a 4-pillar autonomous sales department: capture, qualify, score, and book — all running 24/7 without a sales team.',
    results: ['4.1x more meetings booked', '28% close rate', '90-day ROI'], tags: ['Lead Gen', 'Sales AI', 'Outbound'], order: 4 },
];

const aboutData = {
  headline:    'Built by Engineers,',
  headlineSub: 'For Ambitious Businesses',
  tagline:     "We're a lean, focused team of engineers and AI specialists. No fluff, no middlemen — just clean code and measurable results.",
  story: {
    title: 'Why We Started AgenticOS',
    paragraphs: [
      'We saw too many businesses struggle with agencies that over-promised, under-delivered, and had no clue how to leverage AI effectively.',
      'So we built AgenticOS — an agency that combines deep engineering expertise with AI-first thinking to build systems that actually move the needle.',
      'Every member of our team has built production systems used by real users. We know the difference between a demo and a product that scales.',
    ],
  },
  values: [
    { icon: 'Users',  title: 'Client First',    desc: 'Your success is our success. We measure our work by the impact it creates for your business.' },
    { icon: 'Target', title: 'Outcome Driven',  desc: "Every feature is tied to a business objective. We don't build for the sake of building." },
    { icon: 'Zap',    title: 'Move Fast',       desc: 'We ship fast without breaking things. Rapid iteration with rock-solid quality.' },
    { icon: 'Shield', title: 'Transparent',     desc: 'Weekly updates, open communication, and honest timelines. No surprises.' },
  ],
  stats: [
    { value: '50+',  label: 'Projects Delivered' },
    { value: '98%',  label: 'Client Satisfaction' },
    { value: '5+',   label: 'Years Experience' },
    { value: '24/7', label: 'Support Available' },
  ],
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'agentic_os' });
    console.log('✅  Connected to MongoDB\n');

    // Services
    for (const svc of servicesData) {
      await Service.findOneAndUpdate({ slug: svc.slug }, svc, { upsert: true, new: true, setDefaultsOnInsert: true });
      console.log(`   ✔  Service: ${svc.title}`);
    }

    // Case Studies
    const existingCS = await CaseStudy.countDocuments();
    if (existingCS === 0) {
      for (const cs of caseStudiesData) {
        await CaseStudy.create(cs);
        console.log(`   ✔  Case Study: ${cs.title}`);
      }
    } else {
      console.log(`   ℹ️  Case Studies already exist (${existingCS}), skipping`);
    }

    // About
    const existingAbout = await About.findOne();
    if (!existingAbout) {
      await About.create(aboutData);
      console.log(`   ✔  About page content seeded`);
    } else {
      console.log(`   ℹ️  About content already exists, skipping`);
    }

    // Admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@agenticos.com';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      await User.create({ name: 'Admin', email: adminEmail, password: process.env.ADMIN_PASSWORD || 'Admin@123456', role: 'admin' });
      console.log(`\n✅  Admin created: ${adminEmail}`);
    } else {
      console.log(`\nℹ️   Admin already exists: ${adminEmail}`);
    }

    console.log('\n🎉  Seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err);
    process.exit(1);
  }
};

seed();
