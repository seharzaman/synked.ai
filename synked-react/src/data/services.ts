import {
  MessageCircle,
  Target,
  Settings2,
  FileText,
  Search,
  Shield,
  PlugZap,
  Zap,
  Workflow,
  BarChart2,
  Brain,
  Rocket,
} from "lucide-react";

export const serviceCards = [
  {
    num: "01",
    title: "AI Agents",
    desc: "Custom-built agents for customer support, sales qualification, and internal operations — deployed across chat, email, and WhatsApp.",
    href: "/services#agents",
  },
  {
    num: "02",
    title: "RAG Knowledge Systems",
    desc: "AI trained on your proprietary data. Context-aware responses using your internal documents, wikis, and databases.",
    href: "/services#rag",
  },
  {
    num: "03",
    title: "Workflow Automation",
    desc: "Deep integrations with CRM, Slack, Notion, and custom APIs. End-to-end process automation that eliminates manual overhead.",
    href: "/services#workflow",
  },
  {
    num: "04",
    title: "AI Management & Optimization",
    desc: "Continuous monitoring, prompt tuning, performance reporting, and scaling — we keep your AI working harder every month.",
    href: "/services#management",
  },
] as const;

export const serviceDeepDive = [
  {
    id: "agents",
    num: "01",
    title: "AI Agents",
    tag: "Automation",
    desc: "Intelligent agents designed to handle your most time-consuming tasks 24/7, without fatigue, without error drift. We build agents that feel human to your customers and work like machines under the hood.",
    features: [
      {
        icon: MessageCircle,
        title: "Customer Support AI",
        desc: "Chat, email, and WhatsApp agents trained on your knowledge base and tone of voice.",
      },
      {
        icon: Target,
        title: "Sales & Lead Qualification",
        desc: "Agents that qualify prospects, answer product questions, and book demos autonomously.",
      },
      {
        icon: Settings2,
        title: "Internal Operations",
        desc: "HR bots, internal knowledge assistants, document processors — built for your team's workflows.",
      },
    ],
  },
  {
    id: "rag",
    num: "02",
    title: "RAG Knowledge Systems",
    tag: "Intelligence",
    desc: "Your business has irreplaceable institutional knowledge in docs, PDFs, wikis, databases. We build RAG (Retrieval-Augmented Generation) pipelines that make that knowledge queryable, accurate, and always available.",
    features: [
      {
        icon: FileText,
        title: "Document Intelligence",
        desc: "AI that reads, indexes, and reasons across your entire document library.",
      },
      {
        icon: Search,
        title: "Context-Aware Responses",
        desc: "Answers grounded in your actual data — not generic hallucinated outputs.",
      },
      {
        icon: Shield,
        title: "Private & Secure",
        desc: "Your data stays yours. Deployed with enterprise-grade security and access controls.",
      },
    ],
  },
  {
    id: "workflow",
    num: "03",
    title: "Workflow Automation",
    tag: "Integration",
    desc: "Your tools should work together. We design and deploy intelligent automation pipelines that connect your CRM, communication tools, project management, and custom APIs into one seamless AI-powered flow.",
    features: [
      {
        icon: PlugZap,
        title: "Deep Integrations",
        desc: "CRM, Slack, Notion, HubSpot, custom APIs — we connect what needs connecting.",
      },
      {
        icon: Zap,
        title: "Trigger-Based Automation",
        desc: "Events trigger intelligent actions across your entire tech stack, instantly.",
      },
      {
        icon: Workflow,
        title: "End-to-End Processes",
        desc: "From lead capture to delivery — entire business processes handled by AI.",
      },
    ],
  },
  {
    id: "management",
    num: "04",
    title: "AI Management & Optimization",
    tag: "Partnership",
    desc: "Most AI agencies build and leave. We stay. Every month, our engineers monitor performance, tune prompts, improve accuracy, and scale your systems — so your AI gets smarter as your business grows.",
    features: [
      {
        icon: BarChart2,
        title: "Performance Tracking",
        desc: "Monthly reports with KPIs, resolution rates, cost savings, and improvement plans.",
      },
      {
        icon: Brain,
        title: "Prompt Tuning",
        desc: "Continuous prompt engineering and model improvements based on real usage data.",
      },
      {
        icon: Rocket,
        title: "Scaling & Maintenance",
        desc: "As you grow, we scale. No added complexity for you — just results.",
      },
    ],
  },
] as const;

export const pricingCards = [
  {
    title: "Setup",
    desc: "Custom AI system development",
    features: [
      "Discovery & architecture design",
      "Agent building & integration",
      "Testing & deployment",
      "Team onboarding",
    ],
    cta: "Get a Quote →",
    featured: false,
  },
  {
    title: "Monthly Retainer",
    desc: "Management, optimization & scaling",
    badge: "Most Popular",
    features: [
      "Ongoing monitoring & support",
      "Monthly performance reports",
      "Prompt & model optimization",
      "Priority scaling assistance",
    ],
    cta: "Start Now",
    featured: true,
  },
  {
    title: "Custom Projects",
    desc: "Advanced AI implementations",
    features: [
      "Multi-agent systems",
      "Custom LLM fine-tuning",
      "Complex workflow automation",
      "Dedicated engineering team",
    ],
    cta: "Discuss Scope →",
    featured: false,
  },
] as const;
