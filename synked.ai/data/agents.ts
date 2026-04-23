export interface Agent {
  id: string;
  name: string;
  status: "ok" | "degraded" | "failing";
  lat: number;
  success: number;
  errors: number;
  rpm: number;
  uptime: number;
  issue?: string;
  fixSteps?: string[];
  fixed?: {
    lat: number;
    success: number;
    errors: number;
    uptime: number;
  };
}

export const agents: Agent[] = [
  {
    id: "support",
    name: "Support Agent (WhatsApp)",
    status: "ok",
    lat: 320,
    success: 99.1,
    errors: 2,
    rpm: 142,
    uptime: 99.9,
  },
  {
    id: "sales",
    name: "Sales Qualifier Bot",
    status: "degraded",
    lat: 890,
    success: 94.2,
    errors: 12,
    rpm: 67,
    uptime: 97.8,
    issue:
      "LLM provider latency spiked — response times 4× above baseline in last 2h.",
    fixSteps: [
      "Switch to fallback LLM endpoint (GPT-4o-mini)",
      "Reduce max_tokens 800→400 for qualification flow",
      "Enable response caching for repeated queries",
    ],
    fixed: { lat: 410, success: 98.7, errors: 3, uptime: 99.3 },
  },
  {
    id: "pipeline",
    name: "Data Pipeline (Nightly)",
    status: "ok",
    lat: 210,
    success: 100,
    errors: 0,
    rpm: 4,
    uptime: 100,
  },
  {
    id: "rag",
    name: "RAG Knowledge Engine",
    status: "degraded",
    lat: 720,
    success: 91.5,
    errors: 8,
    rpm: 89,
    uptime: 98.1,
    issue: "Vector search returning stale embeddings — index rebuild overdue.",
    fixSteps: [
      "Trigger incremental index rebuild on Pinecone namespace",
      "Increase similarity threshold 0.72→0.80",
      "Re-embed documents updated in last 48h",
    ],
    fixed: { lat: 290, success: 99.4, errors: 1, uptime: 99.7 },
  },
  {
    id: "email",
    name: "Email Responder Agent",
    status: "failing",
    lat: 2400,
    success: 12.3,
    errors: 47,
    rpm: 3,
    uptime: 88.4,
    issue:
      "OAuth token for Gmail integration expired — agent failing on every send.",
    fixSteps: [
      "Rotate OAuth token via Google Workspace admin",
      "Update secret GMAIL_OAUTH_TOKEN in env config",
      "Re-run integration health check after token refresh",
    ],
    fixed: { lat: 520, success: 98.1, errors: 4, uptime: 99.2 },
  },
  {
    id: "ops",
    name: "Internal Ops Assistant",
    status: "ok",
    lat: 445,
    success: 98.6,
    errors: 5,
    rpm: 22,
    uptime: 99.5,
  },
  {
    id: "enrichment",
    name: "Lead Enrichment Worker",
    status: "degraded",
    lat: 1100,
    success: 88.2,
    errors: 15,
    rpm: 34,
    uptime: 96.5,
    issue:
      "Third-party enrichment API (Clearbit) hitting rate-limit threshold.",
    fixSteps: [
      "Implement exponential backoff on enrichment requests",
      "Cache enriched leads 72h to reduce API calls",
      "Switch to Apollo.io fallback endpoint",
    ],
    fixed: { lat: 480, success: 97.8, errors: 6, uptime: 98.9 },
  },
];
