export interface BuilderComponent {
  type: string;
  icon: string;
  label: string;
  color: string;
  cost: number;
  latency: number;
  desc: string;
}

export const builderComponents: BuilderComponent[] = [
  {
    type: "llm",
    icon: "Cpu",
    label: "LLM Core",
    color: "#125842",
    cost: 0.042,
    latency: 380,
    desc: "Language model node",
  },
  {
    type: "rag",
    icon: "BookOpen",
    label: "RAG System",
    color: "#7F8C43",
    cost: 0.018,
    latency: 210,
    desc: "Knowledge retrieval",
  },
  {
    type: "api",
    icon: "Plug",
    label: "API Layer",
    color: "#B089AA",
    cost: 0.006,
    latency: 95,
    desc: "External integrations",
  },
  {
    type: "cache",
    icon: "Database",
    label: "Cache",
    color: "#6B8FA8",
    cost: 0.001,
    latency: 12,
    desc: "Fast response store",
  },
  {
    type: "queue",
    icon: "Inbox",
    label: "Queue",
    color: "#A86B3A",
    cost: 0.003,
    latency: 45,
    desc: "Async job handling",
  },
  {
    type: "embed",
    icon: "Search",
    label: "Embeddings",
    color: "#3A6B8F",
    cost: 0.009,
    latency: 120,
    desc: "Vector search",
  },
];
