import { useState, useEffect } from 'react';
import { servicesApi } from '../services/api.js';

const FALLBACK_SERVICES = [
  {
    _id: 's1', slug: 'd2c', title: 'D2C Brand Solutions',
    badge: 'AI Agentic Automation', iconName: 'ShoppingCart', order: 1,
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
  {
    _id: 's2', slug: 'realestate', title: 'Real Estate Solutions',
    badge: 'AI Agentic Automation', iconName: 'Building2', order: 2,
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
  {
    _id: 's3', slug: 'leadgen', title: 'Advanced Sales & Lead Gen',
    badge: 'Sales Automation', iconName: 'Bot', order: 3,
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
  {
    _id: 's4', slug: 'content', title: 'Content Production Factory',
    badge: 'Content Automation', iconName: 'PenTool', order: 4,
    solution: 'A complete multi-agent factory replacing traditional content teams, operating seamlessly 24/7.',
    features: [
      { title: 'Research & Strategy Agent', desc: 'Scrapes search trends & competitors for daily content briefs.' },
      { title: 'Brand-Voice Writing Agent', desc: 'Trained on your exact tone to write blogs and social threads.' },
      { title: 'Visual Creation Agent', desc: 'Connects to Midjourney/Canva APIs for perfectly branded graphics.' },
      { title: 'Scheduling & Publishing Agent', desc: 'Analyzes historical engagement for optimal posting times.' },
      { title: 'Content Repurposing Agent', desc: 'Turns one high-performing blog into 8 social assets automatically.' },
    ],
  },
  {
    _id: 's5', slug: 'master', title: 'Master Agent Services',
    badge: 'Executive Level AI', iconName: 'Users', order: 5,
    solution: 'Scale your C-Suite digitally. Deploy master-level AI agents to oversee entire departments autonomously.',
    features: [
      { title: 'Marketing', desc: 'AI Chief of Socials, AI Chief of Advertisement, AI Chief of Content.' },
      { title: 'Customer Service', desc: 'AI Chief of Customer Experiences.' },
      { title: 'Sales & Admin', desc: 'AI Chief of Sales Operations, AI Chief of Administration Operations.' },
      { title: 'Operations', desc: 'AI Chief of Finance, AI Chief of HR.' },
      { title: 'Product', desc: 'AI Chief of Engineering, AI Chief of Design, AI Chief of Management.' },
    ],
  },
  {
    _id: 's6', slug: 'consultancy', title: 'AI Strategic Consultancy',
    badge: 'Strategy & Integration', iconName: 'Lightbulb', order: 6,
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

export function useServices() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [loading, setLoading]   = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await servicesApi.getAll();
        if (!cancelled && data.services?.length > 0) {
          setServices(data.services);
          setFromCache(false);
        }
      } catch {
        if (!cancelled) setFromCache(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { services, loading, fromCache };
}
